import { useDeferredValue, useMemo, useState } from 'react'
import { CaretDown, DotsThree, MagnifyingGlass, UserPlus, UsersThree } from '@phosphor-icons/react'
import { adminUsers, adminUserRoleLabels, adminUserStatusLabels, type AdminUserStatus } from '../model/admin-user-data'

type StatusFilter = 'all' | AdminUserStatus

export function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [selected, setSelected] = useState<string[]>([])
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('vi'))

  const users = useMemo(() => adminUsers.filter((user) => {
    const matchesQuery = !deferredQuery || `${user.name} ${user.email}`.toLocaleLowerCase('vi').includes(deferredQuery)
    return matchesQuery && (status === 'all' || user.status === status)
  }), [deferredQuery, status])

  const allVisibleSelected = users.length > 0 && users.every((user) => selected.includes(user.id))
  const toggleAll = () => setSelected((current) => allVisibleSelected
    ? current.filter((id) => !users.some((user) => user.id === id))
    : [...new Set([...current, ...users.map((user) => user.id)])])
  const toggleUser = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return <div className="admin-dashboard admin-users-page">
    <header className="admin-page-heading">
      <div><p>Quản lý nền tảng <span>/</span> Người dùng</p><h1>Quản lý người dùng</h1><span>Tìm kiếm tài khoản, kiểm tra trạng thái và xử lý quyền truy cập.</span></div>
      <button className="button button-primary" type="button"><UserPlus size={18} />Mời người dùng</button>
    </header>

    <section className="admin-user-summary" aria-label="Tổng quan người dùng">
      <div><strong>1.284</strong><span>Tổng tài khoản</span></div>
      <div><strong>1.196</strong><span>Đang hoạt động</span></div>
      <div><strong>63</strong><span>Chờ xác minh</span></div>
      <div><strong>25</strong><span>Đang tạm khóa</span></div>
    </section>

    <section className="admin-panel admin-users-panel">
      <div className="admin-users-toolbar">
        <label className="admin-users-search"><span className="sr-only">Tìm người dùng</span><MagnifyingGlass size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc email" /></label>
        <label className="admin-filter-select"><span className="sr-only">Lọc theo trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}><option value="all">Tất cả trạng thái</option><option value="active">Hoạt động</option><option value="pending">Chờ xác minh</option><option value="suspended">Tạm khóa</option></select><CaretDown size={14} aria-hidden="true" /></label>
      </div>

      {selected.length > 0 && <div className="admin-bulk-bar" role="status"><strong>{selected.length} người dùng đã chọn</strong><div><button type="button">Gửi lại xác minh</button><button type="button">Tạm khóa</button><button type="button" onClick={() => setSelected([])}>Bỏ chọn</button></div></div>}

      {users.length ? <>
        <div className="admin-table-wrap admin-users-table"><table aria-label="Danh sách người dùng"><thead><tr><th className="admin-check-cell"><input type="checkbox" aria-label="Chọn tất cả người dùng đang hiển thị" checked={allVisibleSelected} onChange={toggleAll} /></th><th>Người dùng</th><th>Vai trò</th><th>Wedding</th><th>Trạng thái</th><th>Hoạt động gần nhất</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td className="admin-check-cell"><input type="checkbox" aria-label={`Chọn ${user.name}`} checked={selected.includes(user.id)} onChange={() => toggleUser(user.id)} /></td><td><div className="admin-user-identity"><span className="admin-user-avatar">{user.initials}</span><span><strong>{user.name}</strong><small>{user.email} · Tham gia {user.joinedAt}</small></span></div></td><td>{adminUserRoleLabels[user.role]}</td><td><strong className="admin-number">{user.weddings}</strong></td><td><span className={`admin-status user-${user.status}`}>{adminUserStatusLabels[user.status]}</span></td><td>{user.lastActive}</td><td><button className="admin-row-action" type="button" aria-label={`Mở thao tác cho ${user.name}`}><DotsThree size={20} weight="bold" /></button></td></tr>)}</tbody></table></div>
        <div className="admin-user-cards" aria-label="Danh sách người dùng trên di động">{users.map((user) => <article key={user.id}><header><label><input type="checkbox" aria-label={`Chọn ${user.name}`} checked={selected.includes(user.id)} onChange={() => toggleUser(user.id)} /><span className="admin-user-avatar">{user.initials}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></label><button className="admin-row-action" type="button" aria-label={`Mở thao tác cho ${user.name}`}><DotsThree size={20} weight="bold" /></button></header><dl><div><dt>Vai trò</dt><dd>{adminUserRoleLabels[user.role]}</dd></div><div><dt>Wedding</dt><dd>{user.weddings}</dd></div><div><dt>Trạng thái</dt><dd><span className={`admin-status user-${user.status}`}>{adminUserStatusLabels[user.status]}</span></dd></div><div><dt>Gần nhất</dt><dd>{user.lastActive}</dd></div></dl></article>)}</div>
        <footer className="admin-users-footer"><span>Hiển thị {users.length} tài khoản mẫu</span><div><button type="button" disabled>Trước</button><strong>Trang 1</strong><button type="button" disabled>Sau</button></div></footer>
      </> : <div className="admin-users-empty"><UsersThree size={28} /><h2>Không tìm thấy người dùng</h2><p>Thử đổi từ khóa hoặc bộ lọc trạng thái.</p><button type="button" onClick={() => { setQuery(''); setStatus('all') }}>Xóa bộ lọc</button></div>}
    </section>
  </div>
}
