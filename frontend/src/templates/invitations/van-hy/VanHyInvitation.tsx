import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { MusicPlayer } from '../../../shared/ui/music-player'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothTemplateScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import './van-hy.css'

export type VanHyTimelineItem = { time: string; title: string; detail: string }
export type VanHyData = {
  openingTitle?: string; openingMessage?: string; brideName?: string; groomName?: string; weddingDate?: string; coverEyebrow?: string
  invitationTitle?: string; invitationMessage?: string; familiesTitle?: string; familiesMessage?: string
  brideFamilyAddress?: string; brideFatherTitle?: string; brideFather?: string; brideMotherTitle?: string; brideMother?: string
  groomFamilyAddress?: string; groomFatherTitle?: string; groomFather?: string; groomMotherTitle?: string; groomMother?: string; countdownTitle?: string; venueTitle?: string
  venueName?: string; venueAddress?: string; venueTime?: string; mapUrl?: string; timelineTitle?: string
  timelineItems?: VanHyTimelineItem[]; galleryTitle?: string; galleryImages?: Array<string | { src?: string }>; rsvpTitle?: string
  rsvpDeadline?: string; guestbookTitle?: string; guestbookMessage?: string; giftTitle?: string
  giftMessage?: string; footerMessage?: string; footerMedia?: string | { src?: string }
  backgroundMusicUrl?: string; backgroundMusicName?: string; backgroundMusicAutoplay?: boolean
}

export type VanHySectionConfig = { enabled: string[]; order: string[] }

const defaultOrder = ['opening', 'cover', 'families', 'countdown', 'timeline', 'gallery', 'rsvp', 'guestbook', 'gift', 'music', 'footer']
const hyMarks = ['囍', '囍', '囍', '囍', '囍', '囍', '囍', '囍', '囍', '囍', '囍', '囍']
const giftParticles = Array.from({ length: 10 }, (_, index) => index)
const openingFloaters = Array.from({ length: 11 }, (_, index) => ({
  x: `${4 + ((index * 47) % 92)}%`,
  bottom: `${-12 - ((index * 13) % 24)}%`,
  delay: `${index * -1.7}s`,
  duration: `${22 + (index % 5) * 3.6}s`,
  drift: `${-26 + (index % 6) * 11}px`,
  rotate: `${-24 + (index % 7) * 8}deg`,
  size: `${14 + (index % 4) * 4}px`,
}))

const stageDust = Array.from({ length: 20 }, (_, index) => ({
  side: index % 2 === 0 ? 'left' : 'right',
  x: `${8 + ((index * 37) % 84)}%`,
  y: `${8 + ((index * 29) % 84)}%`,
  delay: `${index * -1.1}s`,
  drift: `${index % 2 === 0 ? 10 + (index % 4) * 4 : -10 - (index % 4) * 4}px`,
  rotate: `${-24 + index * 11}deg`,
}))

function showSection(section: string, config?: VanHySectionConfig) {
  return !config || config.enabled.includes(section)
}

function orderOf(section: string, config?: VanHySectionConfig) {
  const index = config?.order?.indexOf(section) ?? defaultOrder.indexOf(section)
  return index < 0 ? defaultOrder.indexOf(section) : index
}

function parseDate(value: string) {
  const match = value.match(/(\d{1,2})\s*[·/.-]\s*(\d{1,2})\s*[·/.-]\s*(\d{4})/)
  if (!match) return new Date('2026-10-18T17:30:00+07:00').getTime()
  return new Date(`${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}T17:30:00+07:00`).getTime()
}

function useCountdown(date: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id) }, [])
  const remaining = Math.max(0, parseDate(date) - now)
  return useMemo(() => [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60], [remaining])
}

export function VanHyInvitation({ data, sectionConfig, guestName, interactions }: { data?: VanHyData; sectionConfig?: VanHySectionConfig; guestName?: string | null; interactions?: PublicInteractions }) {
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [curtainsActive, setCurtainsActive] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const [rsvp, setRsvp] = useState<string | null>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [giftOpen, setGiftOpen] = useState(false)
  const [wish, setWish] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishError, setWishError] = useState('')
  const [wishSent, setWishSent] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const countdown = useCountdown(data?.weddingDate ?? '18 · 10 · 2026')
  const previousCountdown = useRef<number[] | null>(null)
  const changedCountdown = countdown.map((value, index) => previousCountdown.current !== null && previousCountdown.current[index] !== value)
  useEffect(() => { previousCountdown.current = countdown }, [countdown])
  const timeline = data?.timelineItems ?? [
    { time: '17:00', title: 'Đón khách', detail: 'Cùng bắt đầu ngày vui bằng những lời chúc thân tình.' },
    { time: '17:30', title: 'Nghi lễ thành hôn', detail: 'Chứng kiến lời hẹn trăm năm của hai chúng mình.' },
    { time: '18:30', title: 'Tiệc chung vui', detail: 'Nâng ly và ở lại thật lâu cùng hai gia đình.' },
  ]
  const gallery = (data?.galleryImages ?? []).map((value) => typeof value === 'string' ? value : value?.src).filter((value): value is string => Boolean(value))
  const footerImage = typeof data?.footerMedia === 'string' ? data.footerMedia : data?.footerMedia?.src
  const names = useMemo(() => `${data?.brideName ?? 'Minh Anh'} & ${data?.groomName ?? 'Hoàng Nam'}`, [data?.brideName, data?.groomName])
  const connectedGuestName = interactions?.guestName?.trim() || guestName?.trim() || ''
  const hasGuestName = Boolean(connectedGuestName)
  const rsvpLocked = rsvpSubmitted || Boolean(interactions?.rsvp.submitted)
  const wishLocked = wishSent || Boolean(interactions?.wishes.submitted)
  const guestText = (value: string | undefined, fallback: string) => (value ?? fallback).replaceAll('{guestName}', connectedGuestName || 'Quý khách')
  const submitRsvp = async () => {
    if (!rsvp || rsvpLocked || interactions?.rsvp.submitting) return
    const name = rsvpName.trim()
    if (!hasGuestName && !name) { setRsvpError('Vui lòng nhập tên trước khi xác nhận.'); return }
    setRsvpError('')
    const sent = interactions ? await interactions.rsvp.submit({ guestName: hasGuestName ? undefined : name, attendance: rsvp === 'yes' ? 'ATTENDING' : 'DECLINED', partySize: 1 }) : true
    if (sent) setRsvpSubmitted(true)
  }
  const submitWish = async () => {
    const message = wish.trim()
    const name = wishName.trim()
    if (!message || wishLocked || interactions?.wishes.submitting) return
    if (!hasGuestName && !name) { setWishError('Vui lòng nhập tên trước khi gửi lời chúc.'); return }
    setWishError('')
    const sent = interactions ? await interactions.wishes.submit({ guestName: hasGuestName ? undefined : name, content: message }) : true
    if (sent) { setWishSent(true); setWish(''); setWishName('') }
  }
  useSmoothTemplateScroll(opened && contentReady)
  const openCard = () => { if (!opened && !opening) { setOpening(true); setCurtainsActive(true) } }
  useEffect(() => {
    if (!opening) return
    const revealTimeout = window.setTimeout(() => { setContentReady(true); setOpened(true); setOpening(false) }, 1250)
    return () => window.clearTimeout(revealTimeout)
  }, [opening])
  useEffect(() => {
    if (!curtainsActive) return
    const timeout = window.setTimeout(() => setCurtainsActive(false), 2650)
    return () => window.clearTimeout(timeout)
  }, [curtainsActive])
  useEffect(() => {
    const shouldLockScroll = !opened || opening || curtainsActive
    if (!shouldLockScroll) return
    const root = document.documentElement
    const body = document.body
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
    }
    const scrollY = window.scrollY
    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    return () => {
      root.style.overflow = previous.rootOverflow
      body.style.overflow = previous.bodyOverflow
      body.style.position = previous.bodyPosition
      body.style.top = previous.bodyTop
      body.style.width = previous.bodyWidth
    }
  }, [curtainsActive, opened, opening])
  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

const sectionEnabledKey = sectionConfig?.enabled.join('|')
  const sectionOrderKey = sectionConfig?.order.join('|')
  useEffect(() => {
    const root = contentRef.current
    if (!root || !contentReady) return
    root.classList.add('has-reveal')
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.hh-section'))
    const revealSelector = 'h2,h3,p,span,strong,small,time,button,a,input,textarea,img:not(.hh-approved-art):not(.hh-cover-panel):not(.hh-cover-medallion),article,.hh-family-grid,.hh-countdown-grid,.hh-detail-card,.hh-timeline,.hh-gallery-grid,.hh-gallery-carousel,.hh-actions'
    sections.forEach((section) => {
      section.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
        if (element.matches('.hh-cover-name,.hh-family-card-seal,.hh-countdown-value,.hh-detail-card') || element.closest('.hh-gift-card,.hh-gift-envelope-box,.gift-envelope-box')) return
        element.classList.add('hh-reveal-item')
        if (element.matches('img,.hh-gallery-grid,.hh-gallery-carousel,.hh-memory-grid')) element.classList.add('hh-reveal-fade')
        else if (element.matches('button,input,textarea,a')) element.classList.add('hh-reveal-scale')
        else if (index % 3 === 1) element.classList.add('hh-reveal-slide')
        else element.classList.add('hh-reveal-rise')
        element.style.setProperty('--hh-reveal-delay', `${Math.min(index * 105, 760)}ms`)
      })
    })
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return
    }
    const markVisible = (section: Element) => section.classList.add('is-visible')
    sections.filter((section) => section.getBoundingClientRect().top < window.innerHeight * 0.72).forEach(markVisible)
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      markVisible(entry.target)
      observer.unobserve(entry.target)
    }), { rootMargin: '0px 0px -24% 0px', threshold: 0.05 })
    sections.filter((section) => !section.classList.contains('is-visible')).forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [contentReady, sectionEnabledKey, sectionOrderKey])
  return <>
    <div className="hh-stage-decor" aria-hidden="true">
      <img className="hh-stage-fan hh-stage-fan--left" src="/assets/images/templates/van-hy/decor/vh-paper-fan-v4.png" width={1536} height={1024} alt="" />
      <img className="hh-stage-fan hh-stage-fan--right" src="/assets/images/templates/van-hy/decor/vh-paper-fan-v4.png" width={1536} height={1024} alt="" />
    </div>
    <div className="hh-stage-dust" aria-hidden="true">
      {stageDust.map((dust, index) => <span key={index} className={`hh-stage-dust-item hh-stage-dust-item--${dust.side}`} style={{ '--hh-dust-x': dust.x, '--hh-dust-y': dust.y, '--hh-dust-delay': dust.delay, '--hh-dust-drift': dust.drift, '--hh-dust-rotate': dust.rotate } as CSSProperties} />)}
    </div>
      {curtainsActive && <div className="hh-opening-curtains is-active" aria-hidden="true">
        <div className="hh-opening-curtain hh-opening-curtain--left"><img className="hh-opening-curtain-emblem" src="/assets/images/templates/van-hy/decor/vh-double-happiness-v4.png" width={1254} height={1279} alt="" /></div>
        <div className="hh-opening-curtain hh-opening-curtain--right" />
        <span className="hh-opening-curtain-line" />
      </div>}
    {!opened && <section className={`hh-opening${opening ? ' is-opening' : ''}`} data-editor-section="opening" aria-label="Mở thiệp Hỷ sự">
      <div className="hh-opening-floaters" aria-hidden="true">
        {openingFloaters.map((floater, index) => <span key={index} className="hh-opening-floater" style={{ '--hh-floater-x': floater.x, '--hh-floater-bottom': floater.bottom, '--hh-floater-delay': floater.delay, '--hh-floater-duration': floater.duration, '--hh-floater-drift': floater.drift, '--hh-floater-rotate': floater.rotate, '--hh-floater-size': floater.size } as CSSProperties}>囍</span>)}
      </div>      <div className="hh-opening-stage"><button type="button" className={`hh-opening-card${opening ? ' is-opening' : ''}`} aria-label="Mở thiệp Hỷ sự" onClick={openCard} disabled={opening}>
        <img className="hh-approved-art hh-opening-art-left" src="/assets/images/templates/van-hy/decor/vh-opening-flower-left-v1.png" width={1024} height={1536} alt="" aria-hidden="true" />
        <img className="hh-approved-art hh-opening-art-right" src="/assets/images/templates/van-hy/decor/vh-opening-flower-right-v1.png" width={1024} height={1536} alt="" aria-hidden="true" />
        <div className="hh-flower hh-flower--left" aria-hidden="true"><i /><i /><i /></div>
        <div className="hh-card-front"><span className="hh-seal">囍<i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span><div className="hh-opening-marquee" aria-label={data?.openingTitle ?? 'Thiệp mời Hỷ sự'}><span className="hh-opening-marquee-line"><span>{data?.openingTitle ?? 'Thiệp mời Hỷ sự'}</span><span aria-hidden="true">{data?.openingTitle ?? 'Thiệp mời Hỷ sự'}</span><span aria-hidden="true">{data?.openingTitle ?? 'Thiệp mời Hỷ sự'}</span><span aria-hidden="true">{data?.openingTitle ?? 'Thiệp mời Hỷ sự'}</span></span></div>{data?.openingMessage && <p className="hh-opening-message">{guestText(data.openingMessage, data.openingMessage)}</p>}<h1><span className="hh-opening-names"><strong>{data?.brideName ?? 'Minh Anh'}</strong><i>&amp;</i><strong>{data?.groomName ?? 'Hoàng Nam'}</strong></span></h1><span className="hh-open-button">Chạm để mở thiệp</span></div>
        <div className="hh-flower hh-flower--right" aria-hidden="true"><i /><i /><i /></div>
      </button></div>
      <p className="hh-shell-note">Vạn Hỷ · Mobile invitation · 480px</p>
    </section>}

    <main className={`hh-page${contentReady ? ' is-opening-complete' : ''}${pageVisible ? '' : ' is-paused'}`}>
    <div className="hh-atmosphere" aria-hidden="true">{hyMarks.map((mark, index) => <span key={index} style={{ '--hh-index': index } as CSSProperties}>{mark}</span>)}</div>


    <div className="hh-content" ref={contentRef} aria-hidden={!contentReady}>
      {showSection('cover', sectionConfig) && <section className="hh-section hh-cover" data-reveal data-editor-section="cover" style={{ order: orderOf('cover', sectionConfig) }}><img className="hh-approved-art hh-cover-flower hh-cover-flower--right" src="/assets/images/templates/van-hy/decor/vh-opening-flower-right-v1.png" width={1024} height={1536} alt="" aria-hidden="true" /><img className="hh-approved-art hh-cover-flower hh-cover-flower--left" src="/assets/images/templates/van-hy/decor/vh-opening-flower-left-v1.png" width={1024} height={1536} alt="" aria-hidden="true" /><span className="hh-eyebrow">{data?.coverEyebrow ?? 'Thiệp mời Hỷ sự'}</span><p className="hh-section-kicker">Trăm năm vừa vặn một chữ duyên</p><h2><span className="hh-cover-name hh-cover-name--bride">{data?.brideName ?? 'Minh Anh'}</span><i>&amp;</i><span className="hh-cover-name hh-cover-name--groom">{data?.groomName ?? 'Hoàng Nam'}</span></h2><div className="hh-date-lockup"><strong>{data?.weddingDate ?? '18 · 10 · 2026'}</strong><span>Trân trọng kính mời bạn đến chung vui</span></div><span className="hh-section-mark">囍</span></section>}
      {showSection('families', sectionConfig) && <section className="hh-section hh-families" data-reveal data-editor-section="families" style={{ order: orderOf('families', sectionConfig) }}><img className="hh-approved-art hh-family-flower hh-family-flower--left" src="/assets/images/templates/van-hy/decor/vh-opening-flower-left-v1.png" width={1024} height={1536} alt="" aria-hidden="true" /><img className="hh-approved-art hh-family-flower hh-family-flower--right" src="/assets/images/templates/van-hy/decor/vh-opening-flower-right-v1.png" width={1024} height={1536} alt="" aria-hidden="true" /><span className="hh-eyebrow">Hai bên gia đình</span><h2>{guestText(data?.familiesTitle ?? data?.invitationTitle, 'Gia đình trân trọng báo tin')}</h2><p className="hh-family-message">{guestText(data?.familiesMessage ?? data?.invitationMessage, 'Hai gia đình chúng mình trân trọng báo tin và kính mời bạn đến chung vui trong ngày hạnh phúc.')}</p><div className="hh-family-grid"><article><span>Nhà gái</span><span className="hh-family-card-seal" aria-hidden="true">囍</span><div className="hh-family-parents"><strong><small>{data?.brideFatherTitle ?? 'Ông'}</small> {data?.brideFather ?? 'Nguyễn Văn Minh'}</strong><strong><small>{data?.brideMotherTitle ?? 'Bà'}</small> {data?.brideMother ?? 'Lê Thanh Hà'}</strong></div><small>{data?.brideFamilyAddress ?? 'Hà Nội'}</small></article><article><span>Nhà trai</span><span className="hh-family-card-seal" aria-hidden="true">囍</span><div className="hh-family-parents"><strong><small>{data?.groomFatherTitle ?? 'Ông'}</small> {data?.groomFather ?? 'Trần Đức Long'}</strong><strong><small>{data?.groomMotherTitle ?? 'Bà'}</small> {data?.groomMother ?? 'Phạm Thu Vân'}</strong></div><small>{data?.groomFamilyAddress ?? 'Thành phố Hồ Chí Minh'}</small></article></div><div className="hh-seal-line"><span>囍</span><i /></div></section>}
      {showSection('countdown', sectionConfig) && <section className="hh-section hh-countdown" data-editor-section="countdown" style={{ order: orderOf('countdown', sectionConfig) }}><span className="hh-eyebrow">Đếm ngược ngày vui</span><h2>{data?.countdownTitle ?? 'Hẹn gặp nhau trong ngày hỷ'}</h2><div className="hh-countdown-grid">{countdown.map((value, index) => <div key={index}><strong key={`${index}-${value}`} className={`hh-countdown-value${changedCountdown[index] ? ' is-changing' : ''}`}>{String(value).padStart(2, '0')}</strong><span>{['Ngày', 'Giờ', 'Phút', 'Giây'][index]}</span></div>)}</div><div className="hh-detail-card hh-reveal-item hh-reveal-rise"><strong>{data?.venueName ?? 'Trung tâm Tiệc cưới Vạn Hỷ'}</strong><span>{data?.venueAddress ?? '28 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'}</span><time>{data?.venueTime ?? '17:30'}</time><a href={data?.mapUrl ?? 'https://maps.google.com'} target="_blank" rel="noreferrer">Mở bản đồ</a></div></section>}
      {showSection('timeline', sectionConfig) && timeline.length > 0 && <section className="hh-section hh-timeline-section" data-editor-section="timeline" style={{ order: orderOf('timeline', sectionConfig) }}><span className="hh-eyebrow">Lịch trình ngày hỷ</span><h2>{data?.timelineTitle ?? 'Những khoảnh khắc trong ngày vui'}</h2><img className="hh-approved-art hh-divider-art" src="/assets/images/templates/van-hy/decor/vh-celebration-divider-v1.png" width={2172} height={1024} alt="" aria-hidden="true" /><div className="hh-timeline">{timeline.map((item) => <article key={item.time + item.title}><time>{item.time}</time><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div></section>}
      {showSection('gallery', sectionConfig) && <section className="hh-section hh-gallery" data-editor-section="gallery" style={{ order: orderOf('gallery', sectionConfig) }}><span className="hh-eyebrow">Album ảnh</span><h2>{data?.galleryTitle ?? 'Một vài khung hình của chúng mình'}</h2>{gallery.length ? <div className="hh-gallery-carousel" role="region" aria-label="Album ảnh kỷ niệm"><div className="hh-gallery-carousel-track">{gallery.map((src, index) => <figure key={src + index} style={{ '--hh-gallery-angle': `${(index * 360) / gallery.length}deg` } as CSSProperties}><img src={src} alt={`Ảnh kỷ niệm ${index + 1}`} width={720} height={960} loading="lazy" /></figure>)}</div></div> : <div className="hh-empty">Album sẽ được cập nhật bằng những khoảnh khắc của hai chúng mình.</div>}</section>}
{showSection('rsvp', sectionConfig) && <section className="hh-section hh-rsvp" data-editor-section="rsvp" style={{ order: orderOf('rsvp', sectionConfig) }}>
        <span className="hh-eyebrow">Xác nhận tham dự</span>
        <h2>{data?.rsvpTitle ?? 'Bạn sẽ đến chung vui cùng chúng mình chứ?'}</h2>
        <p>Vui lòng phản hồi trước {data?.rsvpDeadline ?? '10 · 10 · 2026'}.</p>
        <div className="hh-actions">
          <button type="button" className={rsvp === 'yes' ? 'is-selected' : ''} onClick={() => { setRsvp('yes'); setRsvpError('') }} disabled={rsvpLocked || interactions?.rsvp.submitting}>Mình sẽ tham dự</button>
          <button type="button" className={rsvp === 'no' ? 'is-selected' : ''} onClick={() => { setRsvp('no'); setRsvpError('') }} disabled={rsvpLocked || interactions?.rsvp.submitting}>Mình chưa thể đến</button>
        </div>
        <div className={`hh-submit-row${hasGuestName ? ' is-personalized' : ''}`}>
          {!hasGuestName ? <label className="hh-guest-field"><span>Tên khách mời</span><input value={rsvpName} onChange={(event) => { setRsvpName(event.target.value); setRsvpError('') }} placeholder="Ví dụ: Thanh An" autoComplete="name" disabled={rsvpLocked || interactions?.rsvp.submitting} /></label> : <p className="hh-guest-context">Xác nhận cho {connectedGuestName}</p>}
          <button type="button" className="hh-text-button" onClick={() => void submitRsvp()} disabled={!rsvp || rsvpLocked || interactions?.rsvp.submitting}>{interactions?.rsvp.submitting ? 'Đang gửi…' : rsvpLocked ? 'Đã ghi nhận phản hồi' : 'Gửi xác nhận'}</button>
        </div>
        {(rsvpError || interactions?.rsvp.error) && <p className="hh-interaction-error" role="alert">{rsvpError || interactions?.rsvp.error}</p>}
        {rsvpLocked && <span className="hh-status" role="status">Cảm ơn bạn đã phản hồi.</span>}
      </section>}
      {showSection('guestbook', sectionConfig) && <section className="hh-section hh-guestbook" data-editor-section="guestbook" style={{ order: orderOf('guestbook', sectionConfig) }}>
        <span className="hh-eyebrow">Sổ lưu bút</span>
        <h2>{data?.guestbookTitle ?? 'Gửi một lời chúc ở lại'}</h2>
        <p>{guestText(data?.guestbookMessage, 'Mỗi lời chúc của bạn là một niềm vui trong ngày hỷ sự.')}</p>
        <textarea value={wish} onChange={(event) => { setWish(event.target.value); setWishError('') }} placeholder="Viết lời chúc của bạn…" aria-label="Lời chúc" disabled={wishLocked || interactions?.wishes.submitting} />
        <div className={`hh-submit-row${hasGuestName ? ' is-personalized' : ''}`}>
          {!hasGuestName && <label className="hh-guest-field"><span>Tên khách mời</span><input value={wishName} onChange={(event) => { setWishName(event.target.value); setWishError('') }} placeholder="Tên của bạn" autoComplete="name" disabled={wishLocked || interactions?.wishes.submitting} /></label>}
          {hasGuestName && <p className="hh-guest-context">Lời chúc từ {connectedGuestName}</p>}
          <button type="button" className="hh-text-button" disabled={!wish.trim() || wishLocked || interactions?.wishes.submitting} onClick={() => void submitWish()}>{interactions?.wishes.submitting ? 'Đang gửi…' : wishLocked ? 'Đã gửi lời chúc' : 'Gửi lời chúc'}</button>
        </div>
        {(wishError || interactions?.wishes.error) && <p className="hh-interaction-error" role="alert">{wishError || interactions?.wishes.error}</p>}
        {wishLocked && <span className="hh-status" role="status">Cảm ơn bạn đã gửi lời chúc.</span>}
        {interactions?.wishes.items.length ? <div className="hh-wish-list" aria-live="polite">{interactions.wishes.items.map((item) => <article key={item.id}><p>{item.content}</p><small>{item.authorName}</small></article>)}</div> : null}
      </section>}
      {showSection('gift', sectionConfig) && <section className="hh-section hh-gift" data-editor-section="gift" style={{ order: orderOf('gift', sectionConfig) }}>
        <span className="hh-eyebrow">Quà mừng cưới</span>
        <h2>{data?.giftTitle ?? 'Sự hiện diện là món quà quý giá nhất'}</h2>
        <p>{data?.giftMessage ?? 'Nếu bạn muốn gửi lời chúc theo một cách khác, gia đình xin cảm ơn tấm lòng của bạn.'}</p>
        <div className={`hh-gift-payment${giftOpen ? ' is-open' : ''}`}>
          <div className="hh-gift-envelope-box" role="button" tabIndex={0} aria-label="Mở thông tin mừng cưới" aria-expanded={giftOpen} onClick={() => setGiftOpen(true)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setGiftOpen(true) } }}>
            <span className="hh-gift-envelope-box__particles" aria-hidden="true">{giftParticles.map((particle) => <i key={particle}>囍</i>)}</span>
            <img className="hh-gift-envelope-box__image hh-gift-envelope-box__image--back" src="/assets/images/templates/van-hy/decor/vh-gift-envelope-v2.png" alt="" aria-hidden="true" width={1024} height={1536} />
            <img className="hh-gift-envelope-box__image hh-gift-envelope-box__image--front" src="/assets/images/templates/van-hy/decor/vh-gift-envelope-v2.png" alt="" aria-hidden="true" width={1024} height={1536} />
          </div>
        </div>
        {giftOpen && <div className="hh-gift-modal" role="dialog" aria-modal="true" aria-labelledby="hh-gift-modal-title" onClick={(event) => { if (event.target === event.currentTarget) setGiftOpen(false) }}>
          <div className="hh-gift-modal-card">
            <button type="button" className="hh-gift-modal-close" onClick={() => setGiftOpen(false)} aria-label="Đóng thông tin mừng cưới">×</button>
            <span className="hh-gift-modal-seal" aria-hidden="true">囍</span>
            <h3 id="hh-gift-modal-title">Thông tin mừng cưới</h3>
            <p>{data?.giftMessage ?? 'Nếu bạn muốn gửi lời chúc theo một cách khác, gia đình xin cảm ơn tấm lòng của bạn.'}</p>
            <small className="hh-gift-modal-note">Cảm ơn tấm lòng và lời chúc của bạn dành cho hai chúng mình.</small>
          </div>
        </div>}
      </section>}
      {showSection('music', sectionConfig) && <MusicPlayer src={data?.backgroundMusicUrl} title={data?.backgroundMusicName ?? 'Nhạc nền'} autoplay={data?.backgroundMusicAutoplay} active={contentReady} />}
{showSection('footer', sectionConfig) && <section className="hh-section hh-footer" data-editor-section="footer" style={{ order: orderOf('footer', sectionConfig), '--hh-footer-media': footerImage ? `url("${footerImage}")` : 'none' } as CSSProperties}><span className="hh-eyebrow">Lời cảm ơn</span><img className="hh-approved-art hh-footer-motif" src="/assets/images/templates/van-hy/decor/vh-double-happiness-v4.png" width={1254} height={1279} alt="" aria-hidden="true" /><h2>{names}</h2><p>{guestText(data?.footerMessage, 'Cảm ơn bạn đã dành thời gian chung vui cùng gia đình chúng mình.')}</p><span className="hh-section-mark">囍</span></section>}
    </div>
    </main>
  </>
}
