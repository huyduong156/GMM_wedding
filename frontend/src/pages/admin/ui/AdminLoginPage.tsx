import { useState, type FormEvent } from 'react'
import { ArrowRight, Fingerprint, LockKey, ShieldCheck } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { adminRoutes } from '../../../shared/config/routes'
import { useAuth } from '../../../features/auth/model/auth-context'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { AuthApiError } from '../../../shared/api/auth'

export function AdminLoginPage() {
  const { loginAdmin } = useAuth()
  const { navigate } = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await loginAdmin(email, password); navigate(adminRoutes.home, true) }
    catch (reason) {
      if (reason instanceof AuthApiError && reason.code === 'ADMIN_ACCESS_REQUIRED') setError('Tài khoản này không có quyền truy cập khu vực quản trị.')
      else if (reason instanceof AuthApiError && reason.code === 'INVALID_CREDENTIALS') setError('Email hoặc mật khẩu không chính xác.')
      else setError(reason instanceof Error ? reason.message : 'Không thể đăng nhập quản trị lúc này.')
    } finally { setSubmitting(false) }
  }

  return <main className="admin-login-page">
    <section className="admin-login-intro" aria-label="Giới thiệu khu vực quản trị">
      <AppLink to="/login" className="admin-login-brand">
        <img src="/assets/logo/wedding_logo.png" alt="GMM Wedding" />
        <span><strong>GMM Wedding</strong><small>Control center</small></span>
      </AppLink>
      <div className="admin-login-message">
        <p>Vận hành nền tảng</p>
        <h2>Một nơi để quản lý toàn bộ hệ sinh thái cưới.</h2>
        <span>Theo dõi người dùng, kiểm duyệt nội dung và xuất bản template từ một không gian làm việc bảo mật.</span>
      </div>
      <ul className="admin-login-assurances">
        <li><ShieldCheck size={19} weight="duotone" /><span><strong>Phân quyền theo vai trò</strong><small>Mỗi thành viên chỉ thấy đúng nghiệp vụ được giao.</small></span></li>
        <li><Fingerprint size={19} weight="duotone" /><span><strong>Ghi nhận phiên truy cập</strong><small>Các hoạt động quản trị quan trọng đều có thể truy vết.</small></span></li>
      </ul>
    </section>
    <section className="admin-login-panel">
      <div className="admin-login-form-wrap">
        <div className="admin-login-security"><LockKey size={16} weight="fill" /> Khu vực nội bộ</div>
        <header><p>GMM ADMIN</p><h1>Đăng nhập quản trị</h1><span>Sử dụng tài khoản quản trị đã được cấp quyền.</span></header>
        <form className="admin-login-form" onSubmit={submit}>
          <label>Email quản trị<input type="email" autoComplete="username" placeholder="admin@gmmwedding.vn" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={submitting} /></label>
          <label>Mật khẩu<input type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} disabled={submitting} /></label>
          <div className="admin-login-options"><label><input type="checkbox" /> Duy trì đăng nhập</label><button type="button">Quên mật khẩu?</button></div>
          {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
          <button type="submit" className="admin-login-submit" disabled={submitting}>{submitting ? 'Đang xác thực…' : 'Đăng nhập'} {!submitting ? <ArrowRight size={18} weight="bold" /> : null}</button>
        </form>
        <p className="admin-login-note"><ShieldCheck size={16} /> Chỉ tài khoản có quyền quản trị đang hoạt động mới được phép truy cập.</p>
        <AppLink to="/login" className="admin-login-back">← Quay lại trang đăng nhập khách hàng</AppLink>
      </div>
    </section>
  </main>
}
