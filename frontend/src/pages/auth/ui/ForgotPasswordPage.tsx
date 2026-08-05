import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, EnvelopeSimple } from '@phosphor-icons/react'
import { AuthApiError, authApi } from '../../../shared/api/auth'
import { marketingRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { AuthRecoveryLayout } from './AuthRecoveryLayout'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await authApi.forgotPassword(email); setSent(true) }
    catch (reason) { setError(reason instanceof AuthApiError ? reason.message : 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại.') }
    finally { setSubmitting(false) }
  }

  return <AuthRecoveryLayout titleId="forgot-password-title">
    <form className="login-card auth-recovery-card" onSubmit={submit}>
      <div className="login-mobile-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><strong>GMM Wedding</strong></div>
      <span className="login-kicker">Khôi phục tài khoản</span>
      <h2 id="forgot-password-title">Quên mật khẩu?</h2>
      <p>Nhập email đã đăng ký. Nếu tài khoản hợp lệ, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
      {sent ? <div className="auth-form-success" role="status"><EnvelopeSimple size={22} /><div><strong>Kiểm tra hộp thư của bạn</strong><span>Nếu email tồn tại và đủ điều kiện, liên kết đặt lại mật khẩu đã được gửi.</span></div></div> : <>
        <label htmlFor="forgot-email">Email</label>
        <input id="forgot-email" type="email" autoComplete="email" placeholder="ban@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={submitting} />
        {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
        <button className="button button-primary login-submit" type="submit" disabled={submitting}>{submitting ? 'Đang gửi…' : 'Gửi hướng dẫn'} {!submitting ? <ArrowRight size={17} /> : null}</button>
      </>}
      <AppLink className="auth-back-link" to={marketingRoutes.login}><ArrowLeft size={16} /> Quay lại đăng nhập</AppLink>
    </form>
  </AuthRecoveryLayout>
}
