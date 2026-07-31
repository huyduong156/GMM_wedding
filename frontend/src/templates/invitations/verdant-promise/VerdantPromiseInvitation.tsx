import { useEffect, useState } from 'react'
import { CalendarBlank, CaretLeft, CaretRight, Clock, Gift, Heart, MapPin, NavigationArrow } from '@phosphor-icons/react'
import './verdant-promise.css'

const gallery = ['/assets/images/templates/modern-luxe/couple-portrait.jpg', '/assets/images/templates/verdant-promise/greenhouse-background.png', '/assets/images/templates/modern-luxe/wedding-detail.jpg']

export function VerdantPromiseInvitation({ preview = false }: { preview?: boolean }) {
  const [opened, setOpened] = useState(false)
  const [slide, setSlide] = useState(0)
  const [wishName, setWishName] = useState('')
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState([{ name: 'Gia đình bác Hùng', message: 'Chúc hai con trăm năm hạnh phúc, mãi bình an bên nhau.' }, { name: 'Thanh An', message: 'Ngày vui thật trọn vẹn và hành trình phía trước luôn ngập tiếng cười nhé!' }])

  useEffect(() => {
    if (!opened) return
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % gallery.length), 4500)
    return () => window.clearInterval(timer)
  }, [opened])

  const sendWish = () => {
    if (!wishName.trim() || !wish.trim()) return
    setWishes((current) => [{ name: wishName.trim(), message: wish.trim() }, ...current])
    setWishName(''); setWish('')
  }

  return <div className={`vp-wrap ${opened ? 'is-opened' : ''}`}>
    {!opened ? <section className="vp-opening" aria-label="Mở thiệp Verdant Promise">
      <div className="vp-opening-mist" aria-hidden="true" />
      <div className="vp-opening-leaves" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <button className="vp-cover" type="button" onClick={() => setOpened(true)} aria-label="Mở thiệp cưới của An Nhiên và Minh Khang">
        <img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" />
        <span>Wedding invitation</span><h1>An Nhiên <i>&amp;</i> Minh Khang</h1><time>18 · 10 · 2026</time><strong>Mở thiệp</strong>
      </button><p>Chạm vào thiệp để bước vào khu vườn của chúng mình</p>
    </section> : null}

    <main className="vp-invitation" aria-hidden={!opened}>
      {preview ? <div className="vp-preview-note">Bản xem trước · Dữ liệu mẫu</div> : null}
      <div className="vp-floating" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <section className="vp-hero"><img className="vp-frame" src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" /><span>Trân trọng báo tin lễ thành hôn</span><h1>An Nhiên<i>&amp;</i>Minh Khang</h1><time>18 · 10 · 2026</time><p>Thân mời bạn đến chung vui trong ngày chúng mình viết nên lời hẹn trăm năm.</p></section>

      <section className="vp-families"><span>Hai gia đình chúng tôi</span><div><article><small>Nhà gái</small><strong>Ông Nguyễn Văn Lâm</strong><strong>Bà Trần Thu Hương</strong><p>Quận Ba Đình, Hà Nội</p></article><i>&amp;</i><article><small>Nhà trai</small><strong>Ông Phạm Văn Thành</strong><strong>Bà Lê Ngọc Mai</strong><p>Quận Cầu Giấy, Hà Nội</p></article></div></section>

      <section className="vp-date"><div><span>Chủ nhật</span><strong>18</strong><span>Tháng 10 · 2026</span></div><p>Đón khách lúc <strong>10:30</strong><br />Khai tiệc lúc <strong>11:30</strong></p><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Le%20thanh%20hon%20An%20Nhien%20va%20Minh%20Khang" target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch</a></section>

      <section className="vp-countdown"><span>Chỉ còn</span><div><strong>79</strong><small>Ngày</small><strong>18</strong><small>Giờ</small><strong>36</strong><small>Phút</small></div><p>để cùng gặp nhau trong khu vườn ngập nắng</p></section>

      <section className="vp-timeline"><header><span>Lịch trình</span><h2>Những khoảnh khắc trong ngày vui</h2></header><ol><li><time>10:30</time><div><Clock /><strong>Đón khách</strong><p>Chụp ảnh và lưu lại lời chúc.</p></div></li><li><time>11:00</time><div><Heart /><strong>Lễ thành hôn</strong><p>Chứng kiến lời hẹn trăm năm.</p></div></li><li><time>11:30</time><div><Gift /><strong>Tiệc chung vui</strong><p>Khai tiệc cùng hai gia đình.</p></div></li></ol></section>

      <section className="vp-map"><div><MapPin /><span>Địa điểm</span><h2>Glass Garden Ballroom</h2><p>25 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội</p><a href="https://maps.google.com/?q=25+Trang+Tien+Ha+Noi"><NavigationArrow /> Xem đường đi</a></div><iframe title="Bản đồ Glass Garden Ballroom" src="https://www.google.com/maps?q=25%20Trang%20Tien%20Ha%20Noi&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section>

      <section className="vp-gallery"><span>Our moments</span><h2>Chuyện của chúng mình, qua những khung hình</h2><div className="vp-slider">{gallery.map((src, index) => <img key={src} className={index === slide ? 'is-active' : ''} src={src} alt={`Khoảnh khắc của cặp đôi ${index + 1}`} />)}<button type="button" className="is-prev" onClick={() => setSlide((slide - 1 + gallery.length) % gallery.length)} aria-label="Ảnh trước"><CaretLeft /></button><button type="button" className="is-next" onClick={() => setSlide((slide + 1) % gallery.length)} aria-label="Ảnh tiếp theo"><CaretRight /></button></div><div className="vp-dots">{gallery.map((_, index) => <button key={index} type="button" className={index === slide ? 'is-active' : ''} onClick={() => setSlide(index)} aria-label={`Xem ảnh ${index + 1}`} />)}</div></section>

      <section className="vp-rsvp"><span>RSVP</span><h2>Bạn sẽ đến chung vui cùng chúng mình chứ?</h2><p>Vui lòng phản hồi trước ngày 10.10.2026.</p><div><button type="button">Mình sẽ tham dự</button><button type="button">Mình chưa thể tham dự</button></div></section>

      <section className="vp-guestbook"><span>Sổ lưu bút</span><h2>Gửi một lời chúc thật xanh</h2><div className="vp-wish-form"><input value={wishName} onChange={(event) => setWishName(event.target.value)} aria-label="Tên của bạn" placeholder="Tên của bạn" /><textarea value={wish} onChange={(event) => setWish(event.target.value)} aria-label="Lời chúc" placeholder="Viết lời chúc..." /><button type="button" onClick={sendWish} disabled={!wishName.trim() || !wish.trim()}>Gửi lời chúc</button></div><div className="vp-wishes" aria-live="polite">{wishes.map((item, index) => <article key={`${item.name}-${index}`}><Heart weight="fill" /><p>{item.message}</p><strong>{item.name}</strong></article>)}</div></section>

      <section className="vp-gift"><Gift /><span>Quà mừng</span><p>Sự hiện diện và lời chúc của bạn đã là món quà quý giá nhất.</p><button type="button">Xem thông tin mừng cưới</button></section>
      <footer className="vp-footer"><img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" /><span>With love</span><strong>An Nhiên &amp; Minh Khang</strong><p>Cảm ơn bạn đã là một phần trong ngày thật đẹp của chúng mình.</p></footer>
    </main>
  </div>
}
