import { ArrowRight, Eye, LockKey, ShieldCheck } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { studioRoutes } from '../../../shared/config/routes'
import { WeddingAmbient } from '../../../shared/ui/wedding-ambient/WeddingAmbient'

export function LoginPage() {
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
        <form className="login-card" onSubmit={(event) => event.preventDefault()}>
          <div className="login-mobile-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><strong>GMM Wedding</strong></div>
          <span className="login-kicker">Chào mừng trở lại</span>
          <h2 id="login-title">Đăng nhập</h2>
          <p>Tiếp tục chuẩn bị cho ngày cưới của bạn.</p>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="ban@example.com" />
          <div className="login-password-row"><label htmlFor="login-password">Mật khẩu</label><button type="button">Quên mật khẩu?</button></div>
          <div className="login-password"><LockKey size={18} /><input id="login-password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" /><button type="button" aria-label="Hiện mật khẩu"><Eye size={18} /></button></div>
          <AppLink className="button button-primary login-submit" to={studioRoutes.home}>Đăng nhập <ArrowRight size={17} /></AppLink>
          <p className="login-register">Chưa có tài khoản? <button type="button">Tạo tài khoản miễn phí</button></p>
          <small>Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách riêng tư.</small>
        </form>
      </section>
    </main>
  )
}
