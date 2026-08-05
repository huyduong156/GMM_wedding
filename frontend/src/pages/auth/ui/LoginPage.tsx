import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeSlash, LockKey, ShieldCheck } from '@phosphor-icons/react'
import { marketingRoutes, studioRoutes } from '../../../shared/config/routes'
import { WeddingAmbient } from '../../../shared/ui/wedding-ambient/WeddingAmbient'
import { useAuth } from '../../../features/auth/model/auth-context'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { AuthApiError } from '../../../shared/api/auth'
import { AppLink } from '../../../shared/lib/navigation/AppLink'

function loginError(error: unknown) {
  if (!(error instanceof AuthApiError)) return 'Không thể đăng nhập lúc này. Vui lòng thử lại.'
  if (error.code === 'INVALID_CREDENTIALS') return 'Email hoặc mật khẩu không chính xác.'
  if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return 'Vui lòng xác minh email trước khi đăng nhập.'
  if (error.code === 'ACCOUNT_SUSPENDED') return 'Tài khoản hiện không thể truy cập.'
  if (error.code === 'REQUEST_ORIGIN_REJECTED') return 'Yêu cầu đăng nhập bị từ chối. Hãy kiểm tra cấu hình địa chỉ frontend.'
  return error.message
}

export function LoginPage() {
  const { login } = useAuth()
  const { navigate } = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await login(email, password); navigate(studioRoutes.home, true) }
    catch (reason) { setError(loginError(reason)) }
    finally { setSubmitting(false) }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Giới thiệu GMM Wedding">
        <div className="login-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><span>GMM Wedding</span></div>
        <div className="login-story-copy">
          <span className="login-eyebrow">Một nơi cho ngày trọng đại</span>
          <h1>Thiệp đẹp, khách mời đủ, kỷ niệm còn mãi.</h1>
          <p>Quản lý thiệp online và website cưới trong một không gian riêng tư, gọn gàng.</p>
        </div>
        <p className="login-trust"><ShieldCheck size={18} /> Dữ liệu của bạn được bảo vệ và không chia sẻ với bên thứ ba.</p>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <WeddingAmbient variant="login" />
        <form className="login-card" onSubmit={submit}>
          <div className="login-mobile-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><strong>GMM Wedding</strong></div>
          <span className="login-kicker">Chào mừng trở lại</span>
          <h2 id="login-title">Đăng nhập</h2>
          <p>Tiếp tục chuẩn bị cho ngày cưới của bạn.</p>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="ban@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={submitting} />
          <div className="login-password-row"><label htmlFor="login-password">Mật khẩu</label><AppLink to={marketingRoutes.forgotPassword}>Quên mật khẩu?</AppLink></div>
          <div className="login-password"><LockKey size={18} /><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} disabled={submitting} /><button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}</button></div>
          {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
          <button className="button button-primary login-submit" type="submit" disabled={submitting}>{submitting ? 'Đang đăng nhập…' : 'Đăng nhập'} {!submitting ? <ArrowRight size={17} /> : null}</button>
          <p className="login-register">Chưa có tài khoản? <AppLink to={marketingRoutes.register}>Tạo tài khoản miễn phí</AppLink></p>
          <small>Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách riêng tư.</small>
        </form>
      </section>
    </main>
  )
}
