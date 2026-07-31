import { useEffect, useMemo, useState } from 'react'
import { CalendarBlank, CaretLeft, CaretRight, Clock, Gift, Heart, MapPin, NavigationArrow } from '@phosphor-icons/react'
import './modern-luxe.css'
import './invitation-effects.css'

export type ModernLuxePalette = 'champagne' | 'midnight' | 'sage'
export type ModernLuxeData = {
  brideName?: string; groomName?: string; weddingDate?: string; eyebrow?: string
  invitationTitle?: string; invitationMessage?: string
  ceremonyTime?: string; receptionTime?: string; venueName?: string; venueAddress?: string; mapUrl?: string
  rsvpDeadline?: string; rsvpMessage?: string; galleryImages?: string[]
  brideFather?: string; brideMother?: string; brideFamilyAddress?: string
  groomFather?: string; groomMother?: string; groomFamilyAddress?: string
  calendarUrl?: string; giftMessage?: string
}

const defaults: Required<ModernLuxeData> = {
  brideName: 'Minh Anh', groomName: 'Hoàng Nam', weddingDate: '12 · 12 · 2026', eyebrow: 'Trân trọng kính mời',
  invitationTitle: 'Đến chung vui trong ngày thành hôn', invitationMessage: 'Sự hiện diện của bạn là niềm vui và là món quà quý giá trong ngày chúng mình bắt đầu một hành trình mới.',
  ceremonyTime: '09:00', receptionTime: '11:00', venueName: 'The Grand Ballroom', venueAddress: '88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh', mapUrl: '#',
  rsvpDeadline: '01.12.2026', rsvpMessage: 'Vui lòng xác nhận để chúng mình chuẩn bị đón tiếp bạn thật chu đáo.', galleryImages: [],
  brideFather: 'Ông Trần Văn Bình', brideMother: 'Bà Nguyễn Thu Hà', brideFamilyAddress: 'Quận 3, TP. Hồ Chí Minh',
  groomFather: 'Ông Nguyễn Văn Minh', groomMother: 'Bà Lê Ngọc Lan', groomFamilyAddress: 'TP. Thủ Đức, TP. Hồ Chí Minh',
  calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Le%20thanh%20hon%20Minh%20Anh%20va%20Hoang%20Nam&dates=20261212T020000Z/20261212T060000Z',
  giftMessage: 'Tình cảm và sự hiện diện của bạn là món quà ý nghĩa nhất dành cho chúng mình.',
}

export function ModernLuxeInvitation({ data, palette = 'champagne', preview = false }: { data?: ModernLuxeData; palette?: ModernLuxePalette; preview?: boolean }) {
  const content = { ...defaults, ...data }
  const [opened, setOpened] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [wishName, setWishName] = useState('')
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState([{ name: 'Ngọc Mai', message: 'Chúc hai bạn một đời bình an, luôn thương nhau như ngày đầu.' }, { name: 'Gia đình cô Lan', message: 'Chúc mừng hạnh phúc hai con, trăm năm viên mãn.' }])
  const gallery = content.galleryImages.length ? content.galleryImages : ['/assets/images/templates/modern-luxe/couple-portrait.jpg', '/assets/images/templates/modern-luxe/wedding-detail.jpg', '/assets/images/login-wedding-luxury.jpg']
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(content.venueAddress)}&output=embed`
  const weddingCountdown = useMemo(() => Math.max(0, Math.ceil((new Date('2026-12-12T09:00:00+07:00').getTime() - Date.now()) / 86400000)), [])

  useEffect(() => {
    if (!opened || gallery.length < 2) return
    const timer = window.setInterval(() => setActiveImage((current) => (current + 1) % gallery.length), 4800)
    return () => window.clearInterval(timer)
  }, [gallery.length, opened])

  const submitWish = () => {
    const message = wish.trim()
    const name = wishName.trim()
    if (!message || !name) return
    setWishes((current) => [{ name, message }, ...current])
    setWishName('')
    setWish('')
  }

  return <div className={`modern-luxe-wrap palette-${palette} ${opened ? 'is-opened' : ''}`}>
    {!opened ? <section className="ml-envelope-stage" aria-label="Thiệp mời Lời Hẹn">
      <div className="ml-stage-light" aria-hidden="true" />
      <button className="ml-closed-invitation" type="button" onClick={() => setOpened(true)} aria-label="Mở thiệp mời của Minh Anh và Hoàng Nam">
        <span className="ml-closed-kicker">Wedding invitation</span>
        <span className="ml-closed-monogram">M <i>&amp;</i> N</span>
        <span className="ml-closed-names">Minh Anh <i>&amp;</i> Hoàng Nam</span>
        <span className="ml-closed-date">{content.weddingDate}</span>
        <span className="ml-seal" aria-hidden="true">L</span>
      </button>
      <p>Chạm vào thiệp để mở lời mời</p>
    </section> : null}

    <main className="modern-luxe" aria-hidden={!opened}>
      {preview ? <div className="modern-luxe-preview-note">Bản xem trước · Dữ liệu mẫu</div> : null}
      <div className="ml-paper-grain" aria-hidden="true" />
      <article className="ml-invitation-sheet">
        <header className="ml-card-header">
          <span>{content.eyebrow}</span>
          <p>Wedding invitation</p>
          <h1>{content.brideName}<i>&amp;</i>{content.groomName}</h1>
          <time>{content.weddingDate}</time>
        </header>

        <section className="ml-card-message" aria-labelledby="invitation-title">
          <span className="ml-flourish" aria-hidden="true">M · N</span>
          <h2 id="invitation-title">{content.invitationTitle}</h2>
          <p>{content.invitationMessage}</p>
        </section>

        <section className="ml-families" aria-label="Thông tin hai bên gia đình">
          <p>Hai gia đình trân trọng báo tin</p>
          <div><article><span>Nhà gái</span><strong>{content.brideFather}</strong><strong>{content.brideMother}</strong><small>{content.brideFamilyAddress}</small></article><i aria-hidden="true">&amp;</i><article><span>Nhà trai</span><strong>{content.groomFather}</strong><strong>{content.groomMother}</strong><small>{content.groomFamilyAddress}</small></article></div>
        </section>

        <section className="ml-card-details" aria-label="Thông tin lễ cưới">
          <div><CalendarBlank size={18} weight="thin" /><span>Đón khách</span><strong>{content.ceremonyTime}</strong></div>
          <div className="ml-card-date"><small>THÁNG 12</small><strong>12</strong><span>2026</span></div>
          <div><span>Khai tiệc</span><strong>{content.receptionTime}</strong><small>Thứ bảy</small></div>
        </section>

        <section className="ml-card-venue">
          <MapPin size={20} weight="thin" />
          <span>Hôn lễ được cử hành tại</span>
          <h2>{content.venueName}</h2>
          <p>{content.venueAddress}</p>
          <a href={content.mapUrl}><NavigationArrow size={14} /> Xem chỉ đường</a>
        </section>

        <section className="ml-countdown" aria-label={`Còn ${weddingCountdown} ngày đến lễ cưới`}><span>Save our date</span><strong>{weddingCountdown}</strong><p>ngày nữa đến ngày chúng mình về chung một nhà</p></section>

        <section className="ml-timeline" aria-labelledby="timeline-title"><span>Lịch trình ngày vui</span><h2 id="timeline-title">Một ngày, những khoảnh khắc đáng nhớ</h2><ol><li><time>{content.ceremonyTime}</time><div><Clock size={16} /><strong>Đón khách</strong><p>Gặp gỡ, chụp ảnh và lưu lại lời chúc.</p></div></li><li><time>10:00</time><div><Heart size={16} /><strong>Lễ thành hôn</strong><p>Cùng chứng kiến nghi thức và lời hẹn trăm năm.</p></div></li><li><time>{content.receptionTime}</time><div><Gift size={16} /><strong>Tiệc chung vui</strong><p>Khai tiệc và sẻ chia niềm vui cùng hai gia đình.</p></div></li></ol></section>

        <section className="ml-map" aria-labelledby="map-title"><div><span>Địa điểm hôn lễ</span><h2 id="map-title">Hẹn gặp bạn tại đây</h2><p>{content.venueName}<br />{content.venueAddress}</p><div><a href={content.mapUrl}><NavigationArrow size={14} /> Google Maps</a><a href={content.calendarUrl} target="_blank" rel="noreferrer"><CalendarBlank size={14} /> Thêm vào lịch</a></div></div><iframe title={`Bản đồ ${content.venueName}`} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section>

        <section className="ml-gallery" aria-labelledby="gallery-title"><span>Our moments</span><h2 id="gallery-title">Những khoảnh khắc của chúng mình</h2><div className="ml-gallery-stage">{gallery.map((image, index) => <img key={`${image}-${index}`} className={index === activeImage ? 'is-active' : ''} src={image} alt={`Khoảnh khắc của cặp đôi ${index + 1}`} loading={index ? 'lazy' : undefined} />)}<button type="button" className="is-prev" onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)} aria-label="Ảnh trước"><CaretLeft /></button><button type="button" className="is-next" onClick={() => setActiveImage((activeImage + 1) % gallery.length)} aria-label="Ảnh tiếp theo"><CaretRight /></button></div><div className="ml-gallery-dots" role="group" aria-label="Chọn ảnh">{gallery.map((_, index) => <button key={index} type="button" className={index === activeImage ? 'is-active' : ''} onClick={() => setActiveImage(index)} aria-label={`Xem ảnh ${index + 1}`} aria-pressed={index === activeImage} />)}</div></section>

        <section className="ml-card-rsvp">
          <span>Phản hồi trước {content.rsvpDeadline}</span>
          <p>{content.rsvpMessage}</p>
          <button type="button">Xác nhận tham dự</button>
        </section>

        <section className="ml-guestbook" aria-labelledby="guestbook-title"><span>Sổ lưu bút</span><h2 id="guestbook-title">Gửi một lời chúc đến chúng mình</h2><div className="ml-wish-form"><label htmlFor="invitation-wish-name">Tên của bạn</label><input id="invitation-wish-name" value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Nhập tên khách mời" /><label htmlFor="invitation-wish">Lời chúc của bạn</label><textarea id="invitation-wish" value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Viết một lời chúc thật đẹp..." /><button type="button" onClick={submitWish} disabled={!wish.trim() || !wishName.trim()}>Gửi lời chúc</button></div><div className="ml-wish-list" aria-live="polite">{wishes.map((item, index) => <article key={`${item.name}-${index}`}><Heart size={14} weight="fill" /><p>{item.message}</p><strong>{item.name}</strong></article>)}</div></section>

        <section className="ml-gift-note"><Gift size={21} weight="thin" /><span>Quà mừng</span><p>{content.giftMessage}</p><button type="button">Xem thông tin mừng cưới</button></section>

        <footer><span>With love</span><strong>{content.brideName} &amp; {content.groomName}</strong></footer>
      </article>
    </main>
  </div>
}
