import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { AuthApiError, authApi } from '../../../shared/api/auth'
import { marketingRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { AuthRecoveryLayout } from './AuthRecoveryLayout'
import { ResendVerificationControl } from './ResendVerificationControl'

type VerificationState = 'checking' | 'verified' | 'invalid'

export function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.search).get('token') ?? ''
  const verification = useRef<Promise<void> | null>(null)
  const [state, setState] = useState<VerificationState>(token ? 'checking' : 'invalid')
  const [message, setMessage] = useState(token ? '' : 'Liên kết xác minh không hợp lệ hoặc thiếu token.')

  useEffect(() => {
    if (!token) return
    verification.current ??= authApi.verifyEmail(token)
    let active = true
    void verification.current.then(() => {
      if (active) setState('verified')
    }).catch((reason: unknown) => {
      if (!active) return
      setState('invalid')
      setMessage(reason instanceof AuthApiError && reason.code === 'INVALID_VERIFICATION_TOKEN'
        ? 'Liên kết xác minh không hợp lệ, đã được sử dụng hoặc đã hết hạn.'
        : 'Không thể xác minh email lúc này. Vui lòng thử lại.')
    })
    return () => { active = false }
  }, [token])

  return <AuthRecoveryLayout titleId="verify-email-title">
    <div className="login-card auth-recovery-card">
      <div className="login-mobile-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><strong>GMM Wedding</strong></div>
      <span className="login-kicker">Xác minh tài khoản</span>
      <h2 id="verify-email-title">Xác minh email</h2>
      {state === 'checking' ? <div className="auth-verification-state" role="status"><span className="auth-inline-spinner" /><div><strong>Đang xác minh email…</strong><span>Quá trình này chỉ mất vài giây.</span></div></div> : state === 'verified' ? <div className="auth-form-success" role="status"><CheckCircle size={22} /><div><strong>Email đã được xác minh</strong><span>Tài khoản của bạn đã sẵn sàng để đăng nhập.</span></div></div> : <div className="auth-verification-state is-error" role="alert"><WarningCircle size={22} /><div><strong>Không thể xác minh email</strong><span>{message}</span></div></div>}
      {state !== 'checking' ? <AppLink className="button button-primary login-submit auth-primary-link" to={state === 'verified' ? marketingRoutes.login : marketingRoutes.register}>{state === 'verified' ? 'Đăng nhập ngay' : 'Đăng ký lại'} <ArrowRight size={17} /></AppLink> : null}
      {state === 'invalid' ? <ResendVerificationControl /> : null}
    </div>
  </AuthRecoveryLayout>
}
