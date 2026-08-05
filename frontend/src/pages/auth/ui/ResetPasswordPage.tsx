import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Eye, EyeSlash, LockKey } from '@phosphor-icons/react'
import { AuthApiError, authApi } from '../../../shared/api/auth'
import { marketingRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { AuthRecoveryLayout } from './AuthRecoveryLayout'

function resetError(reason: unknown) {
  if (!(reason instanceof AuthApiError)) return 'Không thể đặt lại mật khẩu lúc này. Vui lòng thử lại.'
  if (reason.code === 'INVALID_PASSWORD_RESET_TOKEN') return 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'
  return reason.message
}

export function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    if (password !== confirmation) { setError('Mật khẩu xác nhận chưa khớp.'); return }
    setSubmitting(true)
    try { await authApi.resetPassword(token, password); setComplete(true) }
    catch (reason) { setError(resetError(reason)) }
    finally { setSubmitting(false) }
  }

  return <AuthRecoveryLayout titleId="reset-password-title">
    <form className="login-card auth-recovery-card" onSubmit={submit}>
      <div className="login-mobile-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><strong>GMM Wedding</strong></div>
      <span className="login-kicker">Bảo mật tài khoản</span>
      <h2 id="reset-password-title">Đặt lại mật khẩu</h2>
      <p>Mật khẩu mới cần có ít nhất 12 ký tự và nên khác mật khẩu bạn đã dùng trước đây.</p>
      {complete ? <div className="auth-form-success" role="status"><CheckCircle size={22} /><div><strong>Đổi mật khẩu thành công</strong><span>Bạn có thể đăng nhập lại bằng mật khẩu mới.</span></div></div> : token ? <>
        <label htmlFor="reset-password">Mật khẩu mới</label>
        <div className="login-password"><LockKey size={18} /><input id="reset-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} disabled={submitting} /><button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}</button></div>
        <label htmlFor="reset-password-confirmation">Xác nhận mật khẩu mới</label>
        <div className="login-password"><LockKey size={18} /><input id="reset-password-confirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={12} disabled={submitting} /></div>
        {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
        <button className="button button-primary login-submit" type="submit" disabled={submitting}>{submitting ? 'Đang cập nhật…' : 'Đặt lại mật khẩu'} {!submitting ? <ArrowRight size={17} /> : null}</button>
      </> : <p className="auth-form-error" role="alert">Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.</p>}
      <AppLink className="auth-back-link" to={marketingRoutes.login}><ArrowLeft size={16} /> {complete ? 'Đăng nhập ngay' : 'Quay lại đăng nhập'}</AppLink>
    </form>
  </AuthRecoveryLayout>
}
