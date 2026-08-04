import { ArrowRight, Fingerprint, LockKey, ShieldCheck } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { adminRoutes } from '../../../shared/config/routes'

export function AdminLoginPage() {
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
        <form className="admin-login-form" onSubmit={(event) => event.preventDefault()}>
          <label>Email quản trị<input type="email" autoComplete="username" placeholder="admin@gmmwedding.vn" /></label>
          <label>Mật khẩu<input type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" /></label>
          <div className="admin-login-options"><label><input type="checkbox" /> Duy trì đăng nhập</label><button type="button">Quên mật khẩu?</button></div>
          <AppLink to={adminRoutes.home} className="admin-login-submit" ariaLabel="Đăng nhập quản trị">Đăng nhập <ArrowRight size={18} weight="bold" /></AppLink>
        </form>
        <p className="admin-login-note"><ShieldCheck size={16} /> Chỉ tài khoản nội bộ được phép truy cập. Xác thực phía máy chủ sẽ được kết nối ở giai đoạn backend.</p>
        <AppLink to="/login" className="admin-login-back">← Quay lại trang đăng nhập khách hàng</AppLink>
      </div>
    </section>
  </main>
}
