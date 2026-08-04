import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CalendarCheck,
  ChartLineUp,
  Check,
  CheckCircle,
  ClockCountdown,
  DeviceMobile,
  Heart,
  Image,
  MapPin,
  QrCode,
  Sparkle,
  LockKey,
  Palette,
  ShareNetwork,
  UserCircleCheck,
} from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { marketingRoutes, publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import './home-page.css'
import { HomeAmbient } from '../../../shared/ui/home-ambient/HomeAmbient'
import { WeddingTemplateCarousel } from '../../../shared/ui/wedding-template-carousel/WeddingTemplateCarousel'

const journey = [
  { icon: Sparkle, title: 'Chọn một mẫu hợp gu', copy: 'Khám phá thiệp và website theo phong cách của hai bạn.' },
  { icon: Image, title: 'Kể câu chuyện riêng', copy: 'Thêm ảnh, sự kiện, địa điểm và lời nhắn trong trình chỉnh sửa.' },
  { icon: QrCode, title: 'Xuất bản và chia sẻ', copy: 'Gửi đường dẫn hoặc mã QR, nhận RSVP và lời chúc tập trung.' },
]

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1150)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-home-reveal]')
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-page">
      {isLoading && <div className="home-loader" role="status" aria-label="Đang mở không gian GMM Wedding"><div className="home-loader-envelope"><img src="/assets/logo/wedding_logo.png" alt="" /><i /><span>GMM Wedding</span></div></div>}
      <section className="home-intro" aria-label="Chào mừng đến GMM Wedding">
          <div className="home-intro-grain" aria-hidden="true" />
          <img className="intro-object intro-rings" src="/assets/images/home-decor/elegant_intertwined-rings_v1.png" alt="" />
          <img className="intro-object intro-envelope" src="/assets/images/home-decor/elegant_wax-envelope_v1.png" alt="" />
          <img className="intro-object intro-coupes" src="/assets/images/home-decor/elegant_champagne-coupes_v1.png" alt="" />
          <img className="intro-object intro-flower" src="/assets/images/home-decor/elegant_calla-lily_v1.png" alt="" />
          <div className="home-intro-content">
            <img src="/assets/logo/wedding_logo.png" alt="GMM Wedding" />
            <span>Wedding, beautifully organized</span>
            <h1>Ngày trọng đại bắt đầu từ một lời mời đẹp.</h1>
            <p>Tạo không gian cưới mang dấu ấn riêng của hai bạn.</p>
            <a href="#home-overview">Bắt đầu khám phá <ArrowRight /></a>
          </div>
      </section>
      <div className="home-scroll-progress" aria-hidden="true" />
      <a className="home-skip" href="#main-content">Bỏ qua điều hướng</a>
      <div className="home-background" aria-hidden="true"><i /><i /><i /></div>
      <HomeAmbient />

      <header className="home-header">
        <nav className="home-nav" aria-label="Điều hướng chính">
          <AppLink to={marketingRoutes.home} className="home-brand" ariaLabel="GMM Wedding - Trang chủ">
            <img src="/assets/logo/wedding_logo.png" alt="" />
            <span>GMM Wedding</span>
          </AppLink>
          <div className="home-nav-links">
            <a href="#how-it-works">Tính năng</a>
            <a href="#templates">Giao diện mẫu</a>
            <a href="#how-it-works">Cách hoạt động</a>
          </div>
          <div className="home-nav-actions">
            <AppLink to={marketingRoutes.login} className="home-text-link">Đăng nhập</AppLink>
            <AppLink to={studioRoutes.inviteThemes} className="home-button home-button-small">Tạo thiệp</AppLink>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="home-hero" id="home-overview" aria-labelledby="home-title">
          <div className="home-hero-copy">
            <span className="home-eyebrow"><Heart weight="fill" /> Không gian cưới của riêng hai bạn</span>
            <h1 id="home-title">Chuẩn bị ngày cưới, nhẹ nhàng hơn.</h1>
            <p>Tạo thiệp, quản lý khách mời và lưu trọn lời chúc trong một không gian.</p>
            <div className="home-hero-actions">
              <AppLink to={studioRoutes.inviteThemes} className="home-button">Bắt đầu tạo <ArrowRight /></AppLink>
              <AppLink to={publicTemplateRoutes.modernLuxePreview} className="home-button home-button-ghost">Xem thiệp mẫu</AppLink>
            </div>
          </div>
          <div className="home-hero-visual" aria-label="Xem trước mẫu thiệp cưới Élan d’Amour">
            <div className="home-photo-main">
              <img src="/assets/images/templates/modern-luxe/couple-portrait.jpg" alt="Cặp đôi trong mẫu thiệp cưới Élan d’Amour" />
              <div className="home-photo-copy"><small>Save our date</small><strong>Minh Anh &amp; Hoàng Nam</strong><span>20.12.2026</span></div>
            </div>
            <div className="home-mini-card"><CheckCircle weight="fill" /><span><strong>RSVP đã nhận</strong>Phản hồi mới từ khách mời</span></div>
            <img className="home-detail-photo" src="/assets/images/templates/modern-luxe/wedding-detail.jpg" alt="Hoa cưới trong mẫu Élan d’Amour" />
          </div>
        </section>

        <section className="home-proof" aria-label="Điểm nổi bật" data-home-reveal>
          <span><DeviceMobile /> Tối ưu trên điện thoại</span>
          <span><ClockCountdown /> Cập nhật theo thời gian thực</span>
          <span><Check /> Khách mời không cần đăng nhập</span>
        </section>

        <div className="home-marquee" aria-label="Các công cụ cho hành trình cưới">
          <div><span>Thiệp online</span><Heart weight="fill" /><span>Website cưới</span><Heart weight="fill" /><span>Khách mời</span><Heart weight="fill" /><span>RSVP</span><Heart weight="fill" /><span>Lời chúc</span><Heart weight="fill" /><span>Wedding Recap</span><Heart weight="fill" /></div>
          <div aria-hidden="true"><span>Thiệp online</span><Heart weight="fill" /><span>Website cưới</span><Heart weight="fill" /><span>Khách mời</span><Heart weight="fill" /><span>RSVP</span><Heart weight="fill" /><span>Lời chúc</span><Heart weight="fill" /><span>Wedding Recap</span><Heart weight="fill" /></div>
        </div>

        <section className="home-story-band" aria-labelledby="story-title" data-home-reveal>
          <div className="home-story-intro">
            <span className="home-story-mark"><Sparkle weight="fill" /></span>
            <h2 id="story-title">Một hành trình liền mạch, từ lời mời đầu tiên đến những ký ức sau ngày cưới.</h2>
          </div>
          <div className="home-story-points">
            <article><strong>Trước ngày cưới</strong><p>Chọn mẫu, hoàn thiện nội dung, lập danh sách khách và kế hoạch công việc.</p></article>
            <article><strong>Trong ngày vui</strong><p>Chia sẻ lịch trình, bản đồ, QR và cập nhật phản hồi từ khách mời.</p></article>
            <article><strong>Sau ngày cưới</strong><p>Lưu lời chúc, hình ảnh và chuẩn bị một Wedding Recap đáng nhớ.</p></article>
          </div>
        </section>

        <section className="home-template-showcase" id="templates" aria-labelledby="showcase-title" data-home-reveal>
          <div className="home-template-showcase-heading"><span className="home-eyebrow">Bộ sưu tập nổi bật</span><h2 id="showcase-title">Chọn một lời mở đầu thật đẹp</h2><p>Sáu hướng hình ảnh cho thiệp cưới, trình bày trong không gian cover-flow có chiều sâu.</p></div>
          <WeddingTemplateCarousel />
        </section>

        <section className="home-section home-control-section" aria-labelledby="control-title">
          <div className="home-control-sticky" data-home-reveal>
            <span className="home-eyebrow">Cá nhân hóa có kiểm soát</span>
            <h2 id="control-title">Đẹp theo gu của bạn, không cần biết thiết kế</h2>
            <p>Các tùy chọn được chọn lọc để thiệp luôn hài hòa trên mọi kích thước màn hình.</p>
            <AppLink to={studioRoutes.invites} className="home-inline-link">Mở trình chỉnh sửa <ArrowRight /></AppLink>
          </div>
          <div className="home-control-list">
            <article data-home-reveal><Palette /><div><h3>Màu sắc và font chữ</h3><p>Phối màu, kiểu chữ và độ tương phản theo phong cách chung của ngày cưới.</p></div></article>
            <article data-home-reveal><Image /><div><h3>Ảnh và từng khoảnh khắc</h3><p>Sắp xếp ảnh cặp đôi, album và các dấu mốc trong câu chuyện tình yêu.</p></div></article>
            <article data-home-reveal><CalendarCheck /><div><h3>Nhiều sự kiện trong một nơi</h3><p>Vu quy, thành hôn và tiệc cưới có lịch, địa điểm, bản đồ riêng rõ ràng.</p></div></article>
            <article data-home-reveal><DeviceMobile /><div><h3>Xem trước responsive</h3><p>Kiểm tra trực tiếp cách thiệp hiển thị trên điện thoại và màn hình lớn.</p></div></article>
          </div>
        </section>

        <section className="home-section home-journey-section" id="how-it-works" aria-labelledby="journey-title" data-home-reveal>
          <div className="home-section-heading home-section-heading-centered"><h2 id="journey-title">Từ ý tưởng đến lời mời trong ba chặng</h2></div>
          <div className="home-journey">
            {journey.map(({ icon: Icon, title, copy }, index) => <article key={title}><span>{index + 1}</span><Icon /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="home-section home-planning" aria-labelledby="planning-title" data-home-reveal>
          <div className="home-planning-visual" aria-hidden="true">
            <div className="planning-date"><CalendarCheck /><strong>Ngày trọng đại</strong><span>Chủ nhật, 20 tháng 12</span></div>
            <div className="planning-item"><CheckCircle weight="fill" /><span><strong>Thiệp online</strong>Đã sẵn sàng chia sẻ</span></div>
            <div className="planning-item"><MapPin /><span><strong>Địa điểm</strong>The Grand Ballroom</span></div>
            <div className="planning-item"><ChartLineUp /><span><strong>Phản hồi</strong>Theo dõi tại studio</span></div>
          </div>
          <div className="home-planning-copy"><h2 id="planning-title">Không chỉ là một tấm thiệp</h2><p>Quản lý việc cần làm, khách mời, RSVP, lời chúc và sổ quà mừng xuyên suốt hành trình cưới.</p><AppLink to={studioRoutes.home} className="home-inline-link">Vào studio <ArrowRight /></AppLink></div>
        </section>

        <section className="home-section home-guest-experience" aria-labelledby="guest-title" data-home-reveal>
          <img className="home-guest-decor home-guest-decor-envelope" src="/assets/images/home-decor/elegant_wax-envelope_v1.png" alt="" loading="lazy" />
          <img className="home-guest-decor home-guest-decor-petals" src="/assets/images/home-decor/blush-petals.png" alt="" loading="lazy" />
          <img className="home-guest-decor home-guest-decor-rings" src="/assets/images/home-decor/elegant_intertwined-rings_v1.png" alt="" loading="lazy" />
          <div className="home-guest-copy">
            <h2 id="guest-title">Dễ dàng cho cả hai bạn và khách mời</h2>
            <p>Mỗi tương tác được thiết kế gọn, rõ và thân thiện trên điện thoại. Khách không cần tạo tài khoản để phản hồi.</p>
          </div>
          <div className="home-guest-grid">
            <article><UserCircleCheck /><strong>Không cần đăng nhập</strong><span>Mở thiệp và phản hồi ngay</span></article>
            <article><ShareNetwork /><strong>Chia sẻ linh hoạt</strong><span>Đường dẫn riêng hoặc mã QR</span></article>
            <article><LockKey /><strong>Quyền riêng tư</strong><span>Thông tin khách được tách biệt</span></article>
            <article><ChartLineUp /><strong>Theo dõi tập trung</strong><span>RSVP và lời chúc trong studio</span></article>
          </div>
        </section>

        <section className="home-section home-faq" aria-labelledby="faq-title" data-home-reveal>
          <div><span className="home-eyebrow">Những điều bạn có thể muốn biết</span><h2 id="faq-title">Bắt đầu thật nhẹ nhàng</h2><p>Mọi phần đều có nội dung mẫu để hai bạn chỉnh sửa dần theo tiến độ chuẩn bị.</p></div>
          <div className="home-faq-list">
            <details open><summary>Khách mời có cần tài khoản không?</summary><p>Không. Khách có thể xem thiệp, RSVP và gửi lời chúc trực tiếp.</p></details>
            <details><summary>Có thể dùng cho nhiều sự kiện không?</summary><p>Có. Mỗi wedding có thể gồm lễ vu quy, thành hôn, tiệc cưới và các địa điểm riêng.</p></details>
            <details><summary>Thiệp có đẹp trên điện thoại không?</summary><p>Có. Template được thiết kế mobile-first và có chế độ xem trước responsive.</p></details>
            <details><summary>Có đổi mẫu sau khi nhập nội dung không?</summary><p>Có. Nội dung tương thích được giữ lại khi hai bạn chuyển sang một template khác.</p></details>
          </div>
        </section>

        <section className="home-cta" aria-labelledby="cta-title" data-home-reveal>
          <div><h2 id="cta-title">Bắt đầu từ điều đẹp nhất của hai bạn</h2><p>Chọn một mẫu, thêm câu chuyện và gửi lời mời đầu tiên.</p></div>
          <AppLink to={studioRoutes.inviteThemes} className="home-button home-button-light">Tạo thiệp ngay <ArrowRight /></AppLink>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><span>GMM Wedding</span></div>
        <p>Không gian số cho một ngày thật đáng nhớ.</p>
        <nav aria-label="Điều hướng cuối trang"><AppLink to={marketingRoutes.login}>Đăng nhập</AppLink><AppLink to={studioRoutes.inviteThemes}>Kho giao diện</AppLink><AppLink to={publicTemplateRoutes.modernLuxePreview}>Thiệp mẫu</AppLink></nav>
      </footer>
    </div>
  )
}
