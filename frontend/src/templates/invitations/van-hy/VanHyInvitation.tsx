import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { MusicPlayer } from '../../../shared/ui/music-player'
import './van-hy.css'

export type VanHyTimelineItem = { time: string; title: string; detail: string }
export type VanHyData = {
  brideName?: string; groomName?: string; weddingDate?: string; coverEyebrow?: string
  invitationTitle?: string; invitationMessage?: string; brideFamilyName?: string; brideFamilyAddress?: string
  invitationMemoryImage1?: string | { src?: string }; invitationMemoryImage2?: string | { src?: string }; invitationMemoryImage3?: string | { src?: string }
  groomFamilyName?: string; groomFamilyAddress?: string; countdownTitle?: string; venueTitle?: string
  venueName?: string; venueAddress?: string; venueTime?: string; mapUrl?: string; timelineTitle?: string
  timelineItems?: VanHyTimelineItem[]; galleryTitle?: string; galleryImages?: string[]; rsvpTitle?: string
  rsvpDeadline?: string; guestbookTitle?: string; guestbookMessage?: string; giftTitle?: string
  giftMessage?: string; giftQrMedia?: string | { src?: string }; footerMessage?: string
  heroMedia?: string | { src?: string }; footerMedia?: string | { src?: string }
  backgroundMusicUrl?: string; backgroundMusicName?: string; backgroundMusicAutoplay?: boolean
}

export type VanHySectionConfig = { enabled: string[]; order: string[] }

const defaultOrder = ['opening', 'cover', 'invitation', 'families', 'countdown', 'venue', 'timeline', 'gallery', 'rsvp', 'guestbook', 'gift', 'music', 'footer']
const hyMarks = ['囍', '囍', '囍', '囍', '囍', '囍']

function showSection(section: string, config?: VanHySectionConfig) {
  return !config || config.enabled.includes(section)
}

function orderOf(section: string, config?: VanHySectionConfig) {
  const index = config?.order?.indexOf(section) ?? defaultOrder.indexOf(section)
  return index < 0 ? defaultOrder.indexOf(section) : index
}

function parseDate(value: string) {
  const match = value.match(/(\d{1,2})\s*[·\/.\-]\s*(\d{1,2})\s*[·\/.\-]\s*(\d{4})/)
  if (!match) return new Date('2026-10-18T17:30:00+07:00').getTime()
  return new Date(`${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}T17:30:00+07:00`).getTime()
}

function useCountdown(date: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id) }, [])
  const remaining = Math.max(0, parseDate(date) - now)
  return [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
}

export function VanHyInvitation({ data, sectionConfig }: { data?: VanHyData; sectionConfig?: VanHySectionConfig }) {
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [rsvp, setRsvp] = useState<string | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [wish, setWish] = useState('')
  const [wishSent, setWishSent] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const countdown = useCountdown(data?.weddingDate ?? '18 · 10 · 2026')
  const order = sectionConfig?.order ?? defaultOrder
  const timeline = data?.timelineItems?.length ? data.timelineItems : [
    { time: '17:00', title: 'Đón khách', detail: 'Cùng bắt đầu ngày vui bằng những lời chúc thân tình.' },
    { time: '17:30', title: 'Nghi lễ thành hôn', detail: 'Chứng kiến lời hẹn trăm năm của hai chúng mình.' },
    { time: '18:30', title: 'Tiệc chung vui', detail: 'Nâng ly và ở lại thật lâu cùng hai gia đình.' },
  ]
  const gallery = data?.galleryImages ?? []
  const memoryImages = [data?.invitationMemoryImage1, data?.invitationMemoryImage2, data?.invitationMemoryImage3].map((value) => typeof value === 'string' ? value : value?.src).filter((value): value is string => Boolean(value))
  const names = useMemo(() => `${data?.brideName ?? 'Minh Anh'} & ${data?.groomName ?? 'Hoàng Nam'}`, [data?.brideName, data?.groomName])
  const openCard = () => { if (!opened && !opening) setOpening(true) }
  useEffect(() => {
    if (!opening) return
    const timeout = window.setTimeout(() => { setOpened(true); setOpening(false) }, 760)
    return () => window.clearTimeout(timeout)
  }, [opening])
  useEffect(() => {
    const root = contentRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    root.classList.add('has-reveal')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.hh-section'))
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [opened])
  const onOpeningKeyDown = (event: KeyboardEvent<HTMLElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCard() } }

  return <main className={`hh-page${opened ? ' is-opening-complete' : ''}`}>
    <div className="hh-atmosphere" aria-hidden="true">{hyMarks.map((mark, index) => <span key={index} style={{ '--hh-index': index } as CSSProperties}>{mark}</span>)}</div>
    {!opened && <section className={`hh-opening${opening ? ' is-opening' : ''}`} data-editor-section="opening" aria-label="Mở thiệp Hỷ sự">
      <div className="hh-opening-stage"><div className={`hh-opening-card${opening ? ' is-opening' : ''}`} role="button" tabIndex={opening ? -1 : 0} aria-label="Mở thiệp Hỷ sự" onClick={openCard} onKeyDown={onOpeningKeyDown}>
        <img className="hh-approved-art hh-opening-art-left" src="/assets/images/templates/van-hy/decor/vh-opening-flower-left-v1.png" alt="" aria-hidden="true" />
        <img className="hh-approved-art hh-opening-art-right" src="/assets/images/templates/van-hy/decor/vh-opening-flower-right-v1.png" alt="" aria-hidden="true" />
        <div className="hh-flower hh-flower--left" aria-hidden="true"><i /><i /><i /></div>
        <div className="hh-card-front"><span className="hh-seal">囍</span><span className="hh-eyebrow">Thiệp mời Hỷ sự</span><h1>Ngày vui<br /><em>của chúng mình</em></h1><p className="hh-card-note">Chạm để mở thiệp</p><button type="button" className="hh-open-button" onClick={(event) => { event.stopPropagation(); openCard() }}>Mở thiệp</button></div>
        <div className="hh-flower hh-flower--right" aria-hidden="true"><i /><i /><i /></div>
      </div></div>
      <p className="hh-shell-note">Vạn Hỷ · Mobile invitation · 480px</p>
    </section>}

    <div className="hh-content" ref={contentRef} aria-hidden={!opened}>
      {showSection('cover', sectionConfig) && <section className="hh-section hh-cover" data-reveal data-editor-section="cover" style={{ order: orderOf('cover', sectionConfig) }}><img className="hh-approved-art hh-cover-fan" src="/assets/images/templates/van-hy/decor/vh-paper-fan-v4.png" alt="" aria-hidden="true" /><span className="hh-eyebrow">{data?.coverEyebrow ?? 'Thiệp mời Hỷ sự'}</span><p className="hh-section-kicker">Trăm năm vừa vặn một chữ duyên</p><h2>{data?.brideName ?? 'Minh Anh'} <i>&amp;</i> {data?.groomName ?? 'Hoàng Nam'}</h2><div className="hh-date-lockup"><strong>{data?.weddingDate ?? '18 · 10 · 2026'}</strong><span>Trân trọng kính mời bạn đến chung vui</span></div><span className="hh-section-mark">囍</span></section>}
      {showSection('invitation', sectionConfig) && <section className="hh-section hh-invitation" data-reveal data-editor-section="invitation" style={{ order: orderOf('invitation', sectionConfig) }}><span className="hh-eyebrow">Lời báo hỷ</span><h2>{data?.invitationTitle ?? 'Trân trọng báo tin vui'}</h2><p>{data?.invitationMessage ?? 'Hai gia đình chúng mình trân trọng báo tin và kính mời bạn đến chung vui trong ngày hạnh phúc.'}</p>{memoryImages.length > 0 && <div className="hh-memory-grid">{memoryImages.map((src, index) => <img key={src + index} src={src} alt={`Khoảnh khắc ${index + 1} của cô dâu và chú rể`} loading="lazy" />)}</div>}<div className="hh-seal-line"><span>囍</span><i /></div></section>}
      {showSection('families', sectionConfig) && <section className="hh-section" data-editor-section="families" style={{ order: orderOf('families', sectionConfig) }}><span className="hh-eyebrow">Hai bên gia đình</span><h2>Gia đình trân trọng báo tin</h2><div className="hh-family-grid"><article><span>Nhà gái</span><strong>{data?.brideFamilyName ?? 'Ông Nguyễn Văn Minh và gia đình'}</strong><small>{data?.brideFamilyAddress ?? 'Hà Nội'}</small></article><article><span>Nhà trai</span><strong>{data?.groomFamilyName ?? 'Ông Trần Đức Long và gia đình'}</strong><small>{data?.groomFamilyAddress ?? 'Thành phố Hồ Chí Minh'}</small></article></div></section>}
      {showSection('countdown', sectionConfig) && <section className="hh-section hh-countdown" data-editor-section="countdown" style={{ order: orderOf('countdown', sectionConfig) }}><span className="hh-eyebrow">Đếm ngược ngày vui</span><h2>{data?.countdownTitle ?? 'Hẹn gặp nhau trong ngày hỷ'}</h2><div className="hh-countdown-grid">{countdown.map((value, index) => <div key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Ngày', 'Giờ', 'Phút', 'Giây'][index]}</span></div>)}</div></section>}
      {showSection('venue', sectionConfig) && <section className="hh-section hh-venue" data-editor-section="venue" style={{ order: orderOf('venue', sectionConfig) }}><span className="hh-eyebrow">Địa điểm chung vui</span><h2>{data?.venueTitle ?? 'Hẹn bạn tại nơi hai gia đình gặp nhau'}</h2><div className="hh-detail-card"><strong>{data?.venueName ?? 'Trung tâm Tiệc cưới Vạn Hỷ'}</strong><span>{data?.venueAddress ?? '28 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'}</span><time>{data?.venueTime ?? '17:30'}</time><a href={data?.mapUrl ?? 'https://maps.google.com'} target="_blank" rel="noreferrer">Mở bản đồ</a></div></section>}
      {showSection('timeline', sectionConfig) && <section className="hh-section" data-editor-section="timeline" style={{ order: orderOf('timeline', sectionConfig) }}><span className="hh-eyebrow">Lịch trình ngày hỷ</span><h2>{data?.timelineTitle ?? 'Những khoảnh khắc trong ngày vui'}</h2><div className="hh-timeline">{timeline.map((item) => <article key={item.time + item.title}><time>{item.time}</time><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div></section>}
      {showSection('gallery', sectionConfig) && <section className="hh-section hh-gallery" data-editor-section="gallery" style={{ order: orderOf('gallery', sectionConfig) }}><span className="hh-eyebrow">Album ảnh</span><h2>{data?.galleryTitle ?? 'Một vài khung hình của chúng mình'}</h2>{gallery.length ? <div className="hh-gallery-grid">{gallery.map((src, index) => <img key={src + index} src={src} alt={`Ảnh kỷ niệm ${index + 1}`} loading="lazy" />)}</div> : <div className="hh-empty">Album sẽ được cập nhật bằng những khoảnh khắc của hai chúng mình.</div>}</section>}
      {showSection('rsvp', sectionConfig) && <section className="hh-section hh-rsvp" data-editor-section="rsvp" style={{ order: orderOf('rsvp', sectionConfig) }}><span className="hh-eyebrow">Xác nhận tham dự</span><h2>{data?.rsvpTitle ?? 'Bạn sẽ đến chung vui cùng chúng mình chứ?'}</h2><p>Vui lòng phản hồi trước {data?.rsvpDeadline ?? '10 · 10 · 2026'}.</p><div className="hh-actions"><button type="button" className={rsvp === 'yes' ? 'is-selected' : ''} onClick={() => setRsvp('yes')}>Mình sẽ tham dự</button><button type="button" className={rsvp === 'no' ? 'is-selected' : ''} onClick={() => setRsvp('no')}>Mình chưa thể đến</button></div>{rsvp && <span className="hh-status" role="status">Cảm ơn bạn đã phản hồi.</span>}</section>}
      {showSection('guestbook', sectionConfig) && <section className="hh-section" data-editor-section="guestbook" style={{ order: orderOf('guestbook', sectionConfig) }}><span className="hh-eyebrow">Sổ lưu bút</span><h2>{data?.guestbookTitle ?? 'Gửi một lời chúc ở lại'}</h2><p>{data?.guestbookMessage ?? 'Mỗi lời chúc của bạn là một niềm vui trong ngày hỷ sự.'}</p><textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Viết lời chúc của bạn…" aria-label="Lời chúc" /><button type="button" className="hh-text-button" disabled={!wish.trim()} onClick={() => setWishSent(true)}>{wishSent ? 'Đã gửi lời chúc' : 'Gửi lời chúc'}</button></section>}
      {showSection('gift', sectionConfig) && <section className="hh-section hh-gift" data-editor-section="gift" style={{ order: orderOf('gift', sectionConfig) }}><span className="hh-eyebrow">Quà mừng cưới</span><h2>{data?.giftTitle ?? 'Sự hiện diện là món quà quý giá nhất'}</h2><p>{data?.giftMessage ?? 'Nếu bạn muốn gửi lời chúc theo một cách khác, gia đình xin cảm ơn tấm lòng của bạn.'}</p><button type="button" className="hh-text-button" aria-expanded={giftOpen} onClick={() => setGiftOpen((value) => !value)}>{giftOpen ? 'Đóng thông tin' : 'Xem thông tin mừng cưới'}</button>{giftOpen && <div className="hh-empty" role="region" aria-label="Thông tin mừng cưới">Mã QR sẽ được cập nhật tại đây khi gia đình bật tính năng.</div>}</section>}
      {showSection('music', sectionConfig) && <MusicPlayer src={data?.backgroundMusicUrl} title={data?.backgroundMusicName ?? 'Nhạc nền'} autoplay={data?.backgroundMusicAutoplay} active={opened} />}
      {showSection('footer', sectionConfig) && <section className="hh-section hh-footer" data-editor-section="footer" style={{ order: orderOf('footer', sectionConfig) }}><span className="hh-eyebrow">Lời cảm ơn</span><h2>{names}</h2><p>{data?.footerMessage ?? 'Cảm ơn bạn đã dành thời gian chung vui cùng gia đình chúng mình.'}</p><span className="hh-section-mark">囍</span></section>}
    </div>
  </main>
}
