import { useState } from 'react'
import { ArrowDown, CalendarBlank, MapPin, NavigationArrow } from '@phosphor-icons/react'
import './modern-luxe.css'
import './invitation-effects.css'

export type ModernLuxePalette = 'champagne' | 'midnight' | 'sage'
export type ModernLuxeData = {
  brideName?: string; groomName?: string; weddingDate?: string; eyebrow?: string
  invitationTitle?: string; invitationMessage?: string
  ceremonyTime?: string; receptionTime?: string; venueName?: string; venueAddress?: string; mapUrl?: string
  rsvpDeadline?: string; rsvpMessage?: string; galleryImages?: string[]
}

const defaultImages = ['/assets/images/templates/modern-luxe/couple-portrait.jpg', '/assets/images/templates/modern-luxe/wedding-detail.jpg']
const defaults: Required<ModernLuxeData> = {
  brideName: 'Trần Minh Anh', groomName: 'Nguyễn Hoàng Nam', weddingDate: '12.12.2026', eyebrow: 'Trân trọng báo tin lễ thành hôn',
  invitationTitle: 'Mời bạn đến dự ngày vui của chúng mình', invitationMessage: 'Tình yêu đã đưa chúng mình đến một lời hẹn trọn đời. Trong khoảnh khắc ý nghĩa ấy, sẽ thật trọn vẹn khi có bạn ở bên, cùng chứng kiến và sẻ chia niềm hạnh phúc.',
  ceremonyTime: '09:00', receptionTime: '11:00', venueName: 'The Grand Ballroom', venueAddress: '88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh', mapUrl: '#',
  rsvpDeadline: '01.12.2026', rsvpMessage: 'Sự hiện diện của bạn là món quà quý giá nhất dành cho chúng mình.', galleryImages: defaultImages,
}

export function ModernLuxeInvitation({ data, palette = 'champagne', preview = false }: { data?: ModernLuxeData; palette?: ModernLuxePalette; preview?: boolean }) {
  const content = { ...defaults, ...data }
  const [opened, setOpened] = useState(false)
  const images = content.galleryImages.length ? content.galleryImages : defaultImages
  return <div className={`modern-luxe-wrap ${opened ? 'is-opened' : ''}`}>
    {!opened ? <section className="ml-envelope-stage" aria-label="Mở thiệp mời">
      <div className="ml-envelope-glow" /><div className="ml-envelope">
        <div className="ml-envelope-back" /><div className="ml-envelope-card"><p>Wedding invitation</p><strong>{content.brideName}<i>&</i>{content.groomName}</strong><span>{content.weddingDate}</span></div><div className="ml-envelope-front" /><div className="ml-envelope-flap" />
        <button type="button" onClick={() => setOpened(true)}><span>MN</span><small>Mở thiệp</small></button>
      </div><p className="ml-envelope-hint">Chạm vào dấu niêm phong để mở lời mời</p>
    </section> : null}
    <main className={`modern-luxe palette-${palette}`} aria-hidden={!opened}>
      {preview ? <div className="modern-luxe-preview-note">Bản xem trước · Dữ liệu mẫu</div> : null}
      <div className="ml-floating-petals" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <section className="ml-hero" id="top"><div className="ml-hero-index">PRIVATE INVITATION — 2026</div><div className="ml-hero-copy"><p>{content.eyebrow}</p><h1><span>{content.brideName}</span><i>&</i><span>{content.groomName}</span></h1><div className="ml-hero-date"><span>Save</span><strong>{content.weddingDate}</strong><span>the date</span></div></div><a className="ml-scroll" href="#invitation" aria-label="Xem lời mời"><ArrowDown size={18} /></a><div className="ml-hero-orbit" aria-hidden="true"><i /><i /><i /></div></section>

      <section className="ml-invitation" id="invitation"><p className="ml-kicker">Thân gửi bạn</p><div><h2>{content.invitationTitle}</h2><p>{content.invitationMessage}</p><span className="ml-signature">Minh Anh & Hoàng Nam</span></div><time>{content.weddingDate}</time></section>

      <section className="ml-photo-moment"><figure><img src={images[0]} alt={`Cô dâu ${content.brideName} và chú rể ${content.groomName}`} /><figcaption><span>Our promise</span><strong>Một lời hẹn.<br />Một đời bên nhau.</strong></figcaption></figure><div className="ml-photo-note"><span>01</span><p>From this day forward</p></div></section>

      <section className="ml-invite-details"><div className="ml-date-poster"><small>DECEMBER</small><strong>12</strong><span>THỨ BẢY · 2026</span></div><div className="ml-schedule-copy"><p className="ml-kicker">Thông tin hôn lễ</p><h2>Hẹn gặp bạn<br />trong ngày vui.</h2><ol><li><time>{content.ceremonyTime}</time><div><strong>Lễ thành hôn</strong><span>Đón khách và nghi thức cưới</span></div></li><li><time>{content.receptionTime}</time><div><strong>Tiệc chung vui</strong><span>Khai tiệc và lưu giữ khoảnh khắc</span></div></li></ol></div></section>

      <section className="ml-venue"><img src={images[1]} alt="Chi tiết trang trí lễ cưới" /><div><MapPin size={24} weight="thin" /><p className="ml-kicker">Địa điểm tổ chức</p><h2>{content.venueName}</h2><p>{content.venueAddress}</p><a href={content.mapUrl}><NavigationArrow size={15} /> Xem chỉ đường</a></div></section>

      <section className="ml-rsvp"><div><CalendarBlank size={22} weight="thin" /><p className="ml-kicker">Vui lòng phản hồi trước {content.rsvpDeadline}</p><h2>Bạn sẽ đến<br />chung vui chứ?</h2><p>{content.rsvpMessage}</p></div><button type="button">Xác nhận tham dự</button></section>
      <footer className="ml-footer"><p>{content.brideName} <i>&</i> {content.groomName}</p><span>Thank you for being part of our story.</span><a href="#top">Trở về đầu trang ↑</a></footer>
    </main>
  </div>
}
