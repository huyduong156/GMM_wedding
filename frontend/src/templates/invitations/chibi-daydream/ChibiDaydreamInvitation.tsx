import { useEffect, useRef, useState } from 'react'
import { CalendarBlank, CaretLeft, CaretRight, Check, Gift, Heart, MapPin, NavigationArrow, PaperPlaneTilt, UsersThree } from '@phosphor-icons/react'
import { formatCountdownUnit, useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import './chibi-daydream.css'

const asset = (name: string) => `/assets/images/templates/chibi-daydream/${name}`
const gallery = [asset('chibi-couple-hero.png'), asset('album-wedding-car.png'), asset('album-cake-evening.png')]
const days = Array.from({ length: 31 }, (_, index) => index + 1)

export function ChibiDaydreamInvitation() {
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const [slide, setSlide] = useState(0)
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null)
  const [rsvpSent, setRsvpSent] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState([{ name: 'Gia đình cô Mai', message: 'Chúc hai con mãi đáng yêu và hạnh phúc như hôm nay nhé!' }, { name: 'Nhóm bạn Đại học', message: 'Một hành trình mới thật nhiều tiếng cười đang chờ hai bạn.' }])
  const mainRef = useRef<HTMLElement>(null)
  const weddingCountdown = useWeddingCountdown('2026-12-20T09:00:00+07:00')

  const openInvitation = () => {
    if (opening) return
    setOpening(true)
    window.setTimeout(() => { setOpened(true); mainRef.current?.focus() }, 900)
  }

  useEffect(() => {
    if (!opened) return
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % gallery.length), 5200)
    return () => window.clearInterval(timer)
  }, [opened])

  const sendWish = () => {
    if (!wishName.trim() || !wish.trim()) return
    setWishes((current) => [{ name: wishName.trim(), message: wish.trim() }, ...current])
    setWishName(''); setWish('')
  }

  return <div className={`cd-wrap ${opened ? 'is-opened' : ''}`}>
    {!opened && <section className={`cd-opening ${opening ? 'is-opening' : ''}`} aria-label="Mở thiệp Mây Hồng Có Đôi">
      <div className="cd-clouds" aria-hidden="true"><i /><i /><i /></div>
      <img className="cd-float cd-float-letter" src={asset('chibi_love-letter_v2.png')} alt="" />
      <img className="cd-float cd-float-doves" src={asset('chibi_love-doves_v2.png')} alt="" />
      <button className="cd-envelope" type="button" onClick={openInvitation} disabled={opening}>
        <span>Thiệp mời ngày vui</span><strong>Khánh An <i>&amp;</i> Đức Minh</strong><small>20 · 12 · 2026</small>
        <img src={asset('chibi_wedding-rings_v2.png')} alt="" />
        <b>{opening ? 'Thiệp đang mở...' : 'Chạm để mở thiệp'}</b>
      </button>
      <div className="cd-opening-curtain" aria-hidden="true" />
    </section>}

    <main ref={mainRef} className="cd-main" tabIndex={-1} aria-hidden={!opened}>
      <div className="cd-sky-decor" aria-hidden="true"><img src={asset('chibi_heart-balloons_v2.png')} alt="" /><img src={asset('chibi_love-doves_v2.png')} alt="" /></div>
      <section className="cd-hero">
        <img className="cd-hero-image" src={asset('chibi-couple-hero.png')} alt="Khánh An và Đức Minh dưới cổng hoa ngày cưới" />
        <div className="cd-hero-copy"><span>Save our happy day</span><h1>Khánh An <i>&amp;</i> Đức Minh</h1><time>20.12.2026</time></div>
      </section>

      <section className="cd-paper cd-announcement">
        <img src={asset('chibi_flower-arch_v2.png')} alt="" />
        <span>Song hỷ lâm môn</span><h2>Trân trọng báo tin lễ thành hôn của con chúng tôi</h2>
        <div className="cd-family-heading"><span>Thông tin hai gia đình</span><p>Hai bên gia đình trân trọng giới thiệu</p></div><div className="cd-families"><article><small>Nhà gái</small><b>Đại diện gia đình</b><div className="cd-family-person"><span>Ông</span><strong>Nguyễn Văn Thành</strong></div><div className="cd-family-person"><span>Bà</span><strong>Trần Thu Mai</strong></div><p>Tư gia · Hải Châu, Đà Nẵng</p></article><i className="cd-family-heart" aria-hidden="true"><Heart weight="fill" /></i><article><small>Nhà trai</small><b>Đại diện gia đình</b><div className="cd-family-person"><span>Ông</span><strong>Lê Quốc Hùng</strong></div><div className="cd-family-person"><span>Bà</span><strong>Phạm Ngọc Lan</strong></div><p>Tư gia · Sơn Trà, Đà Nẵng</p></article></div>
        <div className="cd-couple-names"><div><small>Trưởng nữ</small><strong>Khánh An</strong></div><i>&amp;</i><div><small>Trưởng nam</small><strong>Đức Minh</strong></div></div>
      </section>

      <section className="cd-ceremony">
        <div><span>Lễ thành hôn</span><h2>Được cử hành tại tư gia nhà gái</h2><p>Vào lúc <strong>09:00</strong>, Chủ nhật<br />ngày 20 tháng 12 năm 2026</p><small>Nhằm ngày 12 tháng 11 năm Bính Ngọ</small></div>
        <img src={asset('chibi_wedding-bells_v2.png')} alt="Chuông cưới chibi" />
      </section>

      <section className="cd-reception">
        <img src={asset('chibi_cupcake-pair_v2.png')} alt="Cặp bánh cưới chibi" />
        <span>Tiệc cưới</span><h2>Kính mời Quý khách</h2><p>Đến dự bữa tiệc chung vui cùng gia đình chúng tôi</p>
        <div><strong>Đón khách 17:30</strong><strong>Khai tiệc 18:30</strong></div><h3>Coral Garden Hall</h3><p>28 Bạch Đằng, Hải Châu, Đà Nẵng</p>
      </section>

      <section className="cd-calendar" aria-labelledby="cd-calendar-title">
        <div className="cd-calendar-copy"><img src={asset('chibi_love-calendar_v2.png')} alt="" /><span>Save the date</span><h2 id="cd-calendar-title">Hẹn nhau vào một ngày thật xinh</h2><div className="cd-calendar-countdown" role="timer" aria-live="off" aria-label={`${weddingCountdown.days} ngày ${weddingCountdown.hours} giờ ${weddingCountdown.minutes} phút ${weddingCountdown.seconds} giây`}><div><strong>{weddingCountdown.days}</strong><small>Ngày</small></div><div><strong>{formatCountdownUnit(weddingCountdown.hours)}</strong><small>Giờ</small></div><div><strong>{formatCountdownUnit(weddingCountdown.minutes)}</strong><small>Phút</small></div><div><strong>{formatCountdownUnit(weddingCountdown.seconds)}</strong><small>Giây</small></div></div><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Le%20thanh%20hon%20Khanh%20An%20va%20Duc%20Minh" target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch</a></div>
        <div className="cd-month"><header><span>Tháng 12</span><strong>2026</strong></header><div className="cd-week"><b>T2</b><b>T3</b><b>T4</b><b>T5</b><b>T6</b><b>T7</b><b>CN</b></div><div className="cd-days"><i />{days.map((day) => <span key={day} className={day === 20 ? 'is-wedding' : ''}>{day}{day === 20 && <Heart weight="fill" />}</span>)}</div></div>
      </section>

      <section className="cd-gallery"><span>Album ngày vui</span><h2>Ba khung hình, một câu chuyện có đôi</h2><div className="cd-gallery-stage">{gallery.map((src, index) => <img key={src} src={src} alt={`Khoảnh khắc chibi của cặp đôi ${index + 1}`} className={index === slide ? 'is-active' : ''} />)}<button type="button" className="is-prev" onClick={() => setSlide((slide - 1 + gallery.length) % gallery.length)} aria-label="Ảnh trước"><CaretLeft /></button><button type="button" className="is-next" onClick={() => setSlide((slide + 1) % gallery.length)} aria-label="Ảnh tiếp theo"><CaretRight /></button></div><div className="cd-dots">{gallery.map((_, index) => <button key={index} type="button" className={index === slide ? 'is-active' : ''} onClick={() => setSlide(index)} aria-label={`Xem ảnh ${index + 1}`} />)}</div></section>

      <section className="cd-timeline"><img src={asset('chibi_wedding-car_v2.png')} alt="Xe cưới chibi" /><span>Lịch trình ngày vui</span><h2>Cùng nhau đi qua từng khoảnh khắc</h2><ol><li><time>17:30</time><div><UsersThree /><strong>Đón khách</strong><p>Chụp ảnh và nhận một chiếc sticker nhỏ.</p></div></li><li><time>18:15</time><div><Heart /><strong>Lễ thành hôn</strong><p>Cùng chứng kiến lời hẹn trăm năm.</p></div></li><li><time>18:30</time><div><Gift /><strong>Tiệc chung vui</strong><p>Dùng tiệc và nâng ly cùng hai gia đình.</p></div></li></ol></section>

      <section className="cd-rsvp"><img src={asset('chibi_love-letter_v2.png')} alt="" /><span>Xác nhận tham dự</span><h2>Bạn sẽ đến chung vui cùng chúng mình chứ?</h2><div className="cd-rsvp-options"><button className={attendance === 'yes' ? 'is-active' : ''} onClick={() => setAttendance('yes')}><Check /> Mình sẽ tham dự</button><button className={attendance === 'no' ? 'is-active' : ''} onClick={() => setAttendance('no')}>Mình chưa thể đến</button></div><label>Tên khách mời<input placeholder="Tên của bạn" /></label><label>Số người tham dự<select defaultValue="1"><option value="1">1 người</option><option value="2">2 người</option><option value="3">3 người</option></select></label><button className="cd-primary" type="button" disabled={!attendance} onClick={() => setRsvpSent(true)}>{rsvpSent ? <><Check /> Đã ghi nhận phản hồi</> : 'Gửi xác nhận'}</button></section>

      <section className="cd-map"><div><MapPin /><span>Địa điểm tiệc cưới</span><h2>Coral Garden Hall</h2><p>28 Bạch Đằng, Hải Châu, Đà Nẵng</p><a href="https://maps.google.com/?q=28+Bach+Dang+Da+Nang" target="_blank" rel="noreferrer"><NavigationArrow /> Xem đường đi</a></div><iframe title="Bản đồ Coral Garden Hall" src="https://www.google.com/maps?q=28%20Bach%20Dang%20Da%20Nang&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section>

      <section className="cd-guestbook"><img src={asset('chibi_guestbook_v2.png')} alt="Sổ lưu bút chibi" /><span>Sổ lưu bút</span><h2>Để lại một lời chúc thật đáng yêu</h2><div className="cd-wishes">{wishes.map((item, index) => <article key={`${item.name}-${index}`}><Heart weight="fill" /><p>{item.message}</p><strong>{item.name}</strong></article>)}</div><div className="cd-wish-form"><input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Tên của bạn" aria-label="Tên của bạn" /><textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Viết lời chúc..." aria-label="Lời chúc" /><button type="button" onClick={sendWish} disabled={!wishName.trim() || !wish.trim()}><PaperPlaneTilt /> Gửi lời chúc</button></div></section>

      <section className="cd-gift"><img src={asset('chibi_ring-box_v2.png')} alt="Hộp nhẫn chibi" /><span>Quà mừng</span><h2>Một chút yêu thương gửi về tổ ấm nhỏ</h2><p>Sự hiện diện của bạn đã là món quà quý nhất. Nếu ở xa, bạn có thể gửi lời chúc qua mã bên dưới.</p><div className="cd-qr" aria-label="Mã QR quà mừng minh họa"><i /><i /><i /><b /></div><small>QR minh họa, không chứa thông tin tài khoản thật</small></section>

      <footer className="cd-thanks"><img src={asset('chibi_heart-balloons_v2.png')} alt="" /><span>Thank you</span><h2>Cảm ơn bạn đã dành thời gian đến chung vui</h2><p>Ngày hôm ấy sẽ trọn vẹn hơn thật nhiều vì có bạn ở bên.</p><strong>Khánh An <i>&amp;</i> Đức Minh</strong><small>Made with love by GMM Wedding</small></footer>
      <div className="cd-ambient" aria-hidden="true"><img src={asset('chibi_bridal-bouquet_v2.png')} alt="" /><img src={asset('chibi_polaroid-camera_v2.png')} alt="" /><img src={asset('chibi_wedding-cake_v2.png')} alt="" /></div>
    </main>
  </div>
}
