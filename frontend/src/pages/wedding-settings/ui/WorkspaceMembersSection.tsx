import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Copy, Eye, Link, SpinnerGap, Trash, UserMinus, UsersThree, X } from '@phosphor-icons/react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import {
  weddingApi,
  type WeddingMember,
  type WorkspaceAccessRole,
  type WeddingWorkspaceAccess,
} from '../../../shared/api/weddings'
import { workspaceAccessRoute } from '../../../shared/config/routes'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/ConfirmDialog'
import { SelectField } from '../../../shared/ui/form-controls/SelectField'

const roleLabels: Record<WorkspaceAccessRole | 'OWNER', string> = {
  OWNER: 'Chủ sở hữu',
  EDITOR: 'Biên tập viên',
  VIEWER: 'Chỉ xem',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value))
}

export function WorkspaceMembersSection({
  weddingId,
}: {
  weddingId: string
}) {
  const user = useOptionalAuth()?.user
  const [members, setMembers] = useState<WeddingMember[]>([])
  const [accessLinks, setAccessLinks] = useState<WeddingWorkspaceAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [role, setRole] = useState<WorkspaceAccessRole>('EDITOR')
  const [email, setEmail] = useState('')
  const [creating, setCreating] = useState(false)
  const [newLink, setNewLink] = useState<string | null>(null)
  const [newLinkAccessId, setNewLinkAccessId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: WeddingMember
    role: WorkspaceAccessRole
  } | null>(null)
  const [changingRole, setChangingRole] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState<WeddingMember | null>(null)
  const [pendingRevoke, setPendingRevoke] = useState<WeddingWorkspaceAccess | null>(null)
  const [selectedAccess, setSelectedAccess] = useState<WeddingWorkspaceAccess | null>(null)
  const [leaving, setLeaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setFeedback(null)
    try {
      const [memberResult, accessResult] = await Promise.all([
        weddingApi.members(weddingId),
        weddingApi.workspaceAccess(weddingId),
      ])
      setMembers(memberResult.members)
      setAccessLinks(accessResult.access)
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể tải thành viên.')
    } finally {
      setLoading(false)
    }
  }, [weddingId])

  useEffect(() => {
    void load()
  }, [load])

  const currentMember = useMemo(
    () => members.find((member) => member.userId === user?.id),
    [members, user?.id],
  )
  const isOwner = currentMember?.role === 'OWNER'
  const pendingLinks = useMemo(
    () => accessLinks.filter((access) => access.status === 'PENDING'),
    [accessLinks],
  )

  async function createLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCreating(true)
    setFeedback(null)
    setCopied(false)
    try {
      const result = await weddingApi.createWorkspaceAccess(weddingId, {
        role,
        ...(email.trim() ? { email: email.trim() } : {}),
      })
      setAccessLinks((items) => [result.access, ...items])
      setNewLink(`${window.location.origin}${workspaceAccessRoute(result.token)}`)
      setNewLinkAccessId(result.access.id)
      setEmail('')
      setFeedback('Đã tạo link một lần dùng. Hãy sao chép và gửi ngay cho thành viên.')
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể tạo link tham gia.')
    } finally {
      setCreating(false)
    }
  }

  async function copyNewLink() {
    if (!newLink) return
    try {
      await navigator.clipboard.writeText(newLink)
      setCopied(true)
    } catch {
      setFeedback('Không thể sao chép tự động. Bạn có thể chọn và sao chép đường dẫn bên dưới.')
    }
  }

  async function changeRole(member: WeddingMember, nextRole: WorkspaceAccessRole) {
    setChangingRole(true)
    try {
      const result = await weddingApi.updateMemberRole(weddingId, member.id, nextRole)
      setMembers((items) => items.map((item) => (item.id === member.id ? result.member : item)))
      setPendingRoleChange(null)
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể đổi quyền thành viên.')
    } finally {
      setChangingRole(false)
    }
  }

  async function removeMember() {
    if (!pendingRemoval) return
    try {
      await weddingApi.removeMember(weddingId, pendingRemoval.id)
      setMembers((items) => items.filter((member) => member.id !== pendingRemoval.id))
      setPendingRemoval(null)
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể thu hồi quyền thành viên.')
    }
  }

  async function revokeLink() {
    if (!pendingRevoke) return
    try {
      await weddingApi.revokeWorkspaceAccess(weddingId, pendingRevoke.id)
      setAccessLinks((items) =>
        items.map((access) =>
          access.id === pendingRevoke.id
            ? { ...access, status: 'REVOKED', revokedAt: new Date().toISOString() }
            : access,
        ),
      )
      if (pendingRevoke.id === newLinkAccessId) {
        setNewLink(null)
        setNewLinkAccessId(null)
        setCopied(false)
      }
      if (pendingRevoke.id === selectedAccess?.id) setSelectedAccess(null)
      setPendingRevoke(null)
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể thu hồi link.')
    }
  }

  async function leaveWorkspace() {
    setLeaving(true)
    try {
      await weddingApi.leaveWorkspace(weddingId)
      window.location.assign('/studio')
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : 'Không thể rời Wedding.')
      setLeaving(false)
    }
  }

  return (
    <section className="settings-panel workspace-members-panel">
      <header>
        <UsersThree size={20} />
        <div>
          <h2>Thành viên & quyền</h2>
          <p>Editor có thể vận hành Wedding; Viewer chỉ có thể xem. Chỉ chủ sở hữu quản lý quyền truy cập.</p>
        </div>
      </header>
      <div className="workspace-members-content">
        {loading ? <p className="workspace-members-loading"><SpinnerGap size={17} /> Đang tải thành viên…</p> : null}
        {!loading && feedback ? <p className="workspace-members-feedback" role="status">{feedback}</p> : null}

        {isOwner ? (
          <form className="workspace-access-form" onSubmit={createLink}>
            <div>
              <strong>Tạo link tham gia</strong>
              <span>Mỗi link chỉ được dùng bởi một tài khoản và hết hạn sau 7 ngày.</span>
            </div>
            <label>
              Khóa theo email <small>(không bắt buộc)</small>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="thanhvien@example.com"
              />
            </label>
            <SelectField
              id="workspace-access-role"
              label="Quyền"
              value={role}
              onChange={(value) => setRole(value as WorkspaceAccessRole)}
              options={[
                { value: 'EDITOR', label: roleLabels.EDITOR },
                { value: 'VIEWER', label: roleLabels.VIEWER },
              ]}
            />
            <button className="button button-primary" type="submit" disabled={creating}>
              <Link size={17} /> {creating ? 'Đang tạo…' : 'Tạo link'}
            </button>
          </form>
        ) : null}

        {newLink ? (
          <div className="workspace-new-link">
            <p>Link mới — chỉ hiển thị đầy đủ ở lần tạo này.</p>
            <div>
              <input value={newLink} readOnly aria-label="Link tham gia Wedding" />
              <button type="button" className="button button-secondary" onClick={() => void copyNewLink()}>
                {copied ? <Check size={17} /> : <Copy size={17} />} {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
          </div>
        ) : null}

        {!loading ? (
          <div className="workspace-member-list">
            <div className="workspace-member-list-heading">
              <strong>Thành viên đang hoạt động ({members.length})</strong>
            </div>
            {members.map((member) => {
              const isCurrent = member.userId === user?.id
              const canManage = isOwner && member.role !== 'OWNER'
              return (
                <article className="workspace-member-row" key={member.id}>
                  <div className="workspace-member-avatar" aria-hidden="true">
                    {(member.user.displayName ?? member.user.email).slice(0, 1).toUpperCase()}
                  </div>
                  <div className="workspace-member-identity">
                    <strong>{member.user.displayName ?? member.user.email}</strong>
                    <span>{member.user.email}{isCurrent ? ' · Bạn' : ''}</span>
                  </div>
                  {canManage ? (
                    <select
                      aria-label={`Quyền của ${member.user.displayName ?? member.user.email}`}
                      value={member.role}
                      onChange={(event) =>
                        setPendingRoleChange({
                          member,
                          role: event.target.value as WorkspaceAccessRole,
                        })
                      }
                    >
                      <option value="EDITOR">Editor</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  ) : (
                    <span className={`workspace-role workspace-role-${member.role.toLowerCase()}`}>
                      {roleLabels[member.role]}
                    </span>
                  )}
                  {canManage ? (
                    <button
                      type="button"
                      className="workspace-member-remove"
                      aria-label={`Thu hồi quyền của ${member.user.displayName ?? member.user.email}`}
                      onClick={() => setPendingRemoval(member)}
                    >
                      <UserMinus size={18} />
                    </button>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : null}

        {isOwner && pendingLinks.length > 0 ? (
          <div className="workspace-pending-links">
            <strong>Link đang chờ ({pendingLinks.length})</strong>
            {pendingLinks.map((access) => (
              <div key={access.id}>
                <span>
                  {access.email ?? 'Không giới hạn email'} · {roleLabels[access.role]} · hết hạn {formatDate(access.expiresAt)}
                </span>
                <div className="workspace-pending-link-actions">
                  <button type="button" onClick={() => setSelectedAccess(access)}>
                    <Eye size={15} /> Xem thông tin
                  </button>
                  <button type="button" onClick={() => setPendingRevoke(access)}>
                    <Trash size={15} /> Thu hồi
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && currentMember && !isOwner ? (
          <div className="workspace-leave-action">
            <span>Bạn không còn muốn tham gia Wedding này?</span>
            <button type="button" className="button button-secondary" onClick={() => void leaveWorkspace()} disabled={leaving}>
              <UserMinus size={17} /> {leaving ? 'Đang rời…' : 'Rời Wedding'}
            </button>
          </div>
        ) : null}
      </div>
      <ConfirmDialog
        open={Boolean(pendingRoleChange)}
        title="Đổi quyền thành viên?"
        description={`${pendingRoleChange?.member.user.displayName ?? pendingRoleChange?.member.user.email ?? 'Thành viên này'} sẽ được đổi từ ${pendingRoleChange ? roleLabels[pendingRoleChange.member.role] : ''} sang ${pendingRoleChange ? roleLabels[pendingRoleChange.role] : ''}.`}
        confirmLabel="Xác nhận đổi quyền"
        busy={changingRole}
        onCancel={() => setPendingRoleChange(null)}
        onConfirm={() =>
          pendingRoleChange
            ? changeRole(pendingRoleChange.member, pendingRoleChange.role)
            : Promise.resolve()
        }
      />
      {selectedAccess ? (
        <div
          className="workspace-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedAccess(null)
          }}
        >
          <section className="workspace-dialog workspace-link-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="workspace-link-detail-title">
            <header>
              <div>
                <h2 id="workspace-link-detail-title">Link tham gia Wedding</h2>
                <p>Thông tin để phân biệt link đang chờ.</p>
              </div>
              <button type="button" onClick={() => setSelectedAccess(null)} aria-label="Đóng">
                <X size={18} />
              </button>
            </header>
            <dl className="workspace-link-detail-list">
              <div><dt>Email</dt><dd>{selectedAccess.email ?? 'Không giới hạn email'}</dd></div>
              <div><dt>Quyền</dt><dd>{roleLabels[selectedAccess.role]}</dd></div>
              <div><dt>Hết hạn</dt><dd>{formatDate(selectedAccess.expiresAt)}</dd></div>
              <div><dt>Tạo lúc</dt><dd>{formatDate(selectedAccess.createdAt)}</dd></div>
            </dl>
            {selectedAccess.id === newLinkAccessId && newLink ? (
              <div className="workspace-new-link">
                <p>URL của link vừa tạo trong phiên hiện tại.</p>
                <div>
                  <input value={newLink} readOnly aria-label="Link tham gia Wedding" />
                  <button type="button" className="button button-secondary" onClick={() => void copyNewLink()}>
                    {copied ? <Check size={17} /> : <Copy size={17} />} {copied ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="workspace-link-detail-notice">
                URL chỉ hiển thị một lần khi tạo để token không thể bị lấy lại từ máy chủ. Nếu bạn không còn URL, hãy thu hồi và tạo link mới.
              </p>
            )}
            <footer>
              <button type="button" className="button button-secondary" onClick={() => setSelectedAccess(null)}>Đóng</button>
            </footer>
          </section>
        </div>
      ) : null}
      <ConfirmDialog
        open={Boolean(pendingRemoval)}
        title="Thu hồi quyền thành viên?"
        description={` ${pendingRemoval?.user.displayName ?? pendingRemoval?.user.email ?? 'Thành viên này'} sẽ không còn truy cập Wedding này.`}
        confirmLabel="Thu hồi quyền"
        busy={false}
        onCancel={() => setPendingRemoval(null)}
        onConfirm={removeMember}
      />
      <ConfirmDialog
        open={Boolean(pendingRevoke)}
        title="Thu hồi link tham gia?"
        description="Link này sẽ không thể được dùng để tham gia Wedding nữa."
        confirmLabel="Thu hồi link"
        busy={false}
        onCancel={() => setPendingRevoke(null)}
        onConfirm={revokeLink}
      />
    </section>
  )
}
