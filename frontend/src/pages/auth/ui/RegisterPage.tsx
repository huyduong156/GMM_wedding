import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, EnvelopeSimple, Eye, EyeSlash, LockKey } from '@phosphor-icons/react'
import { AuthApiError, authApi } from '../../../shared/api/auth'
import { marketingRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { AuthRecoveryLayout } from './AuthRecoveryLayout'
import { ResendVerificationControl } from './ResendVerificationControl'

function registerError(reason: unknown) {
  if (!(reason instanceof AuthApiError)) return 'Không thể tạo tài khoản lúc này. Vui lòng thử lại.'
  if (reason.code === 'REQUEST_ORIGIN_REJECTED') return 'Yêu cầu bị từ chối. Hãy kiểm tra cấu hình địa chỉ frontend.'
  if (reason.code === 'RATE_LIMITED') return 'Bạn đã thử quá nhiều lần. Vui lòng chờ một lúc rồi thử lại.'
  if (reason.code === 'VALIDATION_ERROR') return 'Thông tin đăng ký chưa hợp lệ. Vui lòng kiểm tra lại.'
  return reason.message
}

export function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    if (password !== confirmation) { setError('Mật khẩu xác nhận chưa khớp.'); return }
    setSubmitting(true)
    try { await authApi.register(email, password, displayName.trim() || undefined); setSent(true) }
    catch (reason) { setError(registerError(reason)) }
    finally { setSubmitting(false) }
  }

  return <AuthRecoveryLayout titleId="register-title">
    <form className="login-card auth-recovery-card" onSubmit={submit}>
      <div className="login-mobile-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><strong>GMM Wedding</strong></div>
      <span className="login-kicker">Bắt đầu hành trình</span>
      <h2 id="register-title">Tạo tài khoản</h2>
      <p>Tạo không gian riêng để chuẩn bị thiệp và website cưới của bạn.</p>
      {sent ? <><div className="auth-form-success" role="status"><EnvelopeSimple size={22} /><div><strong>Kiểm tra email của bạn</strong><span>Nếu địa chỉ có thể đăng ký, chúng tôi đã gửi liên kết xác minh tài khoản.</span></div></div><ResendVerificationControl initialEmail={email} /></> : <>
        <label htmlFor="register-name">Tên hiển thị <span className="auth-optional">(không bắt buộc)</span></label>
        <input id="register-name" type="text" autoComplete="name" maxLength={120} value={displayName} onChange={(event) => setDisplayName(event.target.value)} disabled={submitting} />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" autoComplete="email" maxLength={320} placeholder="ban@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={submitting} />
        <label htmlFor="register-password">Mật khẩu</label>
        <div className="login-password"><LockKey size={18} /><input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} required disabled={submitting} /><button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}</button></div>
        <span className="auth-field-hint">Tối thiểu 12 ký tự.</span>
        <label htmlFor="register-confirmation">Xác nhận mật khẩu</label>
        <div className="login-password"><LockKey size={18} /><input id="register-confirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={12} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required disabled={submitting} /></div>
        {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
        <button className="button button-primary login-submit" type="submit" disabled={submitting}>{submitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'} {!submitting ? <ArrowRight size={17} /> : null}</button>
      </>}
      <AppLink className="auth-back-link" to={marketingRoutes.login}><ArrowLeft size={16} /> {sent ? 'Về trang đăng nhập' : 'Đã có tài khoản? Đăng nhập'}</AppLink>
    </form>
  </AuthRecoveryLayout>
}
