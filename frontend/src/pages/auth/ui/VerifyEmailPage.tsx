import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { AuthApiError, authApi } from '../../../shared/api/auth'
import { marketingRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { AuthRecoveryLayout } from './AuthRecoveryLayout'
import { ResendVerificationControl } from './ResendVerificationControl'
import type { WorkspaceAccessOutcome } from '../../../shared/api/auth'

type VerificationState = 'checking' | 'verified' | 'invalid'

const workspaceAccessReturnKey = 'gmm-workspace-access-return'

function workspaceAccessMessage(outcome: WorkspaceAccessOutcome) {
  switch (outcome) {
    case 'JOINED':
      return 'Bạn đã được thêm vào Wedding được mời. Đăng nhập để bắt đầu cộng tác.'
    case 'ALREADY_USED':
      return 'Email đã được xác minh, nhưng link quyền này đã được một tài khoản khác sử dụng.'
    case 'REVOKED':
      return 'Email đã được xác minh, nhưng link quyền này đã bị thu hồi.'
    case 'EXPIRED':
      return 'Email đã được xác minh, nhưng link quyền này đã hết hạn.'
    default:
      return 'Email đã được xác minh, nhưng link quyền này không còn khả dụng.'
  }
}

export function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.search).get('token') ?? ''
  const verification = useRef<Promise<{ workspaceAccessOutcome?: WorkspaceAccessOutcome }> | null>(null)
  const [state, setState] = useState<VerificationState>(token ? 'checking' : 'invalid')
  const [message, setMessage] = useState(
    token ? '' : 'Liên kết xác minh không hợp lệ hoặc thiếu token.',
  )
  const [workspaceAccessOutcome, setWorkspaceAccessOutcome] = useState<WorkspaceAccessOutcome>()

  useEffect(() => {
    if (!token) return
    verification.current ??= authApi.verifyEmail(token).then((result) => result ?? {})
    let active = true
    void verification.current
      .then((result) => {
        if (!active) return
        if (result.workspaceAccessOutcome) {
          sessionStorage.removeItem(workspaceAccessReturnKey)
          setWorkspaceAccessOutcome(result.workspaceAccessOutcome)
          setMessage(workspaceAccessMessage(result.workspaceAccessOutcome))
        }
        setState('verified')
      })
      .catch((reason: unknown) => {
        if (!active) return
        setState('invalid')
        setMessage(
          reason instanceof AuthApiError && reason.code === 'INVALID_VERIFICATION_TOKEN'
            ? 'Liên kết xác minh không hợp lệ, đã được sử dụng hoặc đã hết hạn.'
            : 'Không thể xác minh email lúc này. Vui lòng thử lại.',
        )
      })
    return () => {
      active = false
    }
  }, [token])

  return (
    <AuthRecoveryLayout titleId="verify-email-title">
      <div className="login-card auth-recovery-card">
        <div className="login-mobile-brand">
          <img src="/assets/logo/wedding_logo.png" alt="" />
          <strong>GMM Wedding</strong>
        </div>
        <span className="login-kicker">Xác minh tài khoản</span>
        <h2 id="verify-email-title">Xác minh email</h2>
        {state === 'checking' ? (
          <div className="auth-verification-state" role="status">
            <span className="auth-inline-spinner" />
            <div>
              <strong>Đang xác minh email…</strong>
              <span>Quá trình này chỉ mất vài giây.</span>
            </div>
          </div>
        ) : state === 'verified' ? (
          <div className={workspaceAccessOutcome && workspaceAccessOutcome !== 'JOINED' ? 'auth-verification-state is-error' : 'auth-form-success'} role="status">
            {workspaceAccessOutcome && workspaceAccessOutcome !== 'JOINED' ? <WarningCircle size={22} /> : <CheckCircle size={22} />}
            <div>
              <strong>Email đã được xác minh</strong>
              <span>{workspaceAccessOutcome ? message : 'Tài khoản của bạn đã sẵn sàng để đăng nhập.'}</span>
            </div>
          </div>
        ) : (
          <div className="auth-verification-state is-error" role="alert">
            <WarningCircle size={22} />
            <div>
              <strong>Không thể xác minh email</strong>
              <span>{message}</span>
            </div>
          </div>
        )}
        {state !== 'checking' ? (
          <AppLink
            className="button button-primary login-submit auth-primary-link"
            to={state === 'verified' ? marketingRoutes.login : marketingRoutes.register}
          >
            {state === 'verified' ? 'Đăng nhập ngay' : 'Đăng ký lại'} <ArrowRight size={17} />
          </AppLink>
        ) : null}
        {state === 'invalid' ? <ResendVerificationControl /> : null}
      </div>
    </AuthRecoveryLayout>
  )
}
