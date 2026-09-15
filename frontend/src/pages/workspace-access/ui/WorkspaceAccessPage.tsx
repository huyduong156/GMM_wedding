import { useEffect, useState } from 'react'
import { CheckCircle, EnvelopeSimple, LockKey, WarningCircle, UsersThree } from '@phosphor-icons/react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { AuthRecoveryLayout } from '../../auth/ui/AuthRecoveryLayout'
import { WeddingApiError, weddingApi, type WorkspaceAccessResolution } from '../../../shared/api/weddings'
import { marketingRoutes, studioRoutes, workspaceAccessRoute } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { PageLoading } from '../../../shared/ui/PageLoading'

const workspaceAccessReturnKey = 'gmm-workspace-access-return'

function roleLabel(role: WorkspaceAccessResolution['role']) {
  return role === 'EDITOR' ? 'Biên tập viên' : 'Chỉ xem'
}

function accessError(error: unknown) {
  if (!(error instanceof WeddingApiError)) return 'Không thể kiểm tra liên kết này. Vui lòng thử lại.'
  if (error.code === 'WORKSPACE_ACCESS_EXPIRED') return 'Liên kết tham gia đã hết hạn.'
  if (error.code === 'WORKSPACE_ACCESS_EMAIL_MISMATCH')
    return 'Liên kết này chỉ dành cho một địa chỉ email khác.'
  if (error.code === 'WORKSPACE_MEMBER_EXISTS') return 'Tài khoản này đã là thành viên của Wedding.'
  if (error.code === 'WORKSPACE_ACCESS_INVALID') return 'Liên kết đã được dùng, bị thu hồi hoặc không hợp lệ.'
  return error.message
}

export function WorkspaceAccessPage({ token }: { token: string }) {
  const auth = useOptionalAuth()
  const checkUserSession = auth?.checkUserSession
  const { navigate } = useNavigation()
  const [access, setAccess] = useState<WorkspaceAccessResolution | null>(null)
  const [loading, setLoading] = useState(true)
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    let current = true
    void Promise.all([
      weddingApi.resolveWorkspaceAccess(token),
      checkUserSession?.() ?? Promise.resolve(false),
    ])
      .then(([result, hasSession]) => {
        if (!current) return
        setAccess(result.access)
        setSignedIn(hasSession)
      })
      .catch((reason) => {
        if (current) setError(accessError(reason))
      })
      .finally(() => {
        if (current) setLoading(false)
      })
    return () => {
      current = false
    }
  }, [checkUserSession, token])

  async function accept() {
    setSubmitting(true)
    setError('')
    try {
      const result = await weddingApi.acceptWorkspaceAccess(token)
      sessionStorage.setItem('gmm-active-wedding-id', result.member.weddingId)
      setAccepted(true)
      window.setTimeout(() => navigate(studioRoutes.home, true), 700)
    } catch (reason) {
      setError(accessError(reason))
    } finally {
      setSubmitting(false)
    }
  }

  function rememberAccessLink() {
    sessionStorage.setItem(workspaceAccessReturnKey, workspaceAccessRoute(token))
  }

  if (loading)
    return <PageLoading label="Đang kiểm tra lời mời" detail="Đang chuẩn bị quyền truy cập Wedding cho bạn." />

  return (
    <AuthRecoveryLayout titleId="workspace-access-title">
      <section className="login-card auth-recovery-card workspace-access-claim" aria-live="polite">
        <div className="login-mobile-brand">
          <img src="/assets/logo/wedding_logo.png" alt="" />
          <strong>GMM Wedding</strong>
        </div>
        {error && !access ? (
          <>
            <WarningCircle className="workspace-access-icon is-error" size={34} weight="duotone" />
            <span className="login-kicker">Không thể tham gia</span>
            <h2 id="workspace-access-title">Liên kết không khả dụng</h2>
            <p>{error}</p>
            <AppLink className="button button-primary login-submit" to={marketingRoutes.home}>
              Về trang chủ
            </AppLink>
          </>
        ) : accepted ? (
          <>
            <CheckCircle className="workspace-access-icon is-success" size={34} weight="duotone" />
            <span className="login-kicker">Tham gia thành công</span>
            <h2 id="workspace-access-title">Chào mừng bạn đến với {access?.weddingName}</h2>
            <p>Đang mở không gian Wedding của bạn.</p>
          </>
        ) : access ? (
          <>
            <UsersThree className="workspace-access-icon" size={34} weight="duotone" />
            <span className="login-kicker">Lời mời cộng tác</span>
            <h2 id="workspace-access-title">Bạn được mời vào {access.weddingName}</h2>
            <p>Quyền được cấp: <strong>{roleLabel(access.role)}</strong>.</p>
            <div className="workspace-access-summary">
              <EnvelopeSimple size={17} aria-hidden="true" />
              <span>Liên kết có hiệu lực đến {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(access.expiresAt))}.</span>
            </div>
            {signedIn ? (
              <button className="button button-primary login-submit" type="button" onClick={() => void accept()} disabled={submitting}>
                {submitting ? 'Đang tham gia…' : 'Tham gia Wedding'}
              </button>
            ) : (
              <div className="workspace-access-auth-actions">
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => {
                    rememberAccessLink()
                    navigate(marketingRoutes.login)
                  }}
                >
                  <LockKey size={17} /> Đăng nhập để tham gia
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    rememberAccessLink()
                    navigate(marketingRoutes.register)
                  }}
                >
                  Tạo tài khoản
                </button>
              </div>
            )}
            {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
          </>
        ) : null}
      </section>
    </AuthRecoveryLayout>
  )
}
