import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarBlank, Heart, MapPin, PaperPlaneTilt } from '@phosphor-icons/react'
import './peony-veranda.css'
import '../../../shared/styles/reveal-animations.css'
import '../../../shared/styles/interaction-effects.css'
import { MusicPlayer } from '../../../shared/ui/music-player'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothInvitationScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'

const asset = (name: string) => `/assets/images/templates/peony-veranda/${name}`
const mediaUrl = (value: unknown, fallback: string) => {
  if (typeof value === 'string' && value) return value
  if (value && typeof value === 'object' && 'src' in value && typeof (value as { src?: unknown }).src === 'string') return (value as { src: string }).src
  return fallback
}
const gallery = ['peony-gallery-01-v1.png', 'peony-gallery-02-v1.png', 'peony-gallery-03-v1.png'].map(asset)

export type PeonyVerandaData = {
  brideName?: string; groomName?: string; weddingDate?: string; eyebrow?: string; coverEyebrow?: string
  bannerIntro?: string; bannerNote?: string; bannerImage?: string; bannerIndex?: string
  invitationTitle?: string; invitationMessage?: string; announcementKicker?: string; announcementSignoff?: string
  ceremonyTime?: string; receptionTime?: string; mapUrl?: string; coupleImage?: string
  brideRole?: string; groomRole?: string; coupleTagline?: string
  familiesEyebrow?: string; familiesTitle?: string
  brideFamily?: { representativeRole?: string; name: string; address?: string; hometown?: string }; groomFamily?: { representativeRole?: string; name: string; address?: string; hometown?: string }
  brideFatherName?: string; brideMotherName?: string; groomFatherName?: string; groomMotherName?: string; brideFamilyName?: string; brideFamilyAddress?: string; brideFamilyRole?: string; brideFamilyHometown?: string; groomFamilyName?: string; groomFamilyAddress?: string; groomFamilyRole?: string; groomFamilyHometown?: string
  countdownTitle?: string
  ceremonyEyebrow?: string; ceremonyTitle?: string; ceremonyMessage?: string; ceremonyGuestLabel?: string; ceremonyVenue?: string; ceremonyAddress?: string; ceremonyDate?: string; ceremonyNote?: string
  receptionLabel?: string; receptionGreeting?: string; guestCountLabel?: string; dressCode?: string
  calendarEyebrow?: string; calendarTitle?: string; timelineEyebrow?: string; timelineTitle?: string
  timelineItems?: Array<{ time: string; title: string; detail: string }>
  activitiesEyebrow?: string; activitiesTitle?: string; galleryEyebrow?: string; galleryTitle?: string
  galleryImages?: string[]; activities?: Array<{ title: string; image?: string; detail?: string }>
  rsvpEyebrow?: string; rsvpTitle?: string; rsvpDeadlinePrefix?: string
  guestbookTitle?: string
  giftQrMedia?: string | { src?: string }; footerMessage?: string; footerImage?: string
  rsvpDeadline?: string; backgroundMusicUrl?: string; backgroundMusicName?: string; backgroundMusicAutoplay?: boolean
}

export type PeonyVerandaSectionConfig = { enabled: string[]; order: string[] }

function getCountdown(target: number) {
  const total = Math.max(0, target - Date.now())
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const minutes = Math.floor((total % 3600000) / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function familyValue(data: PeonyVerandaData | undefined, side: 'bride' | 'groom', key: 'name' | 'address' | 'hometown' | 'representativeRole') {
  const nested = data?.[side === 'bride' ? 'brideFamily' : 'groomFamily']?.[key]
  const flat = data?.[`${side}Family${key[0].toUpperCase()}${key.slice(1)}` as keyof PeonyVerandaData]
  return (nested ?? flat) as string | undefined
}

export function PeonyVerandaInvitation({ editorMode = false, data, sectionConfig, interactions }: { editorMode?: boolean; data?: PeonyVerandaData; sectionConfig?: PeonyVerandaSectionConfig; interactions?: PublicInteractions }) {
  // Keep the opening cover visible on the first editor preview render. The editor iframe uses editorMode for the bridge, not to bypass the invitation opening.
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [active, setActive] = useState(0)
  const [activityActive, setActivityActive] = useState(0)
  const [attendance, setAttendance] = useState<string | null>(null)
  const [wish, setWish] = useState('')
  const [wishGuestName, setWishGuestName] = useState('')
  const [wishSent, setWishSent] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [guestIdentityModal, setGuestIdentityModal] = useState(false)
  const [guestIdentityDraft, setGuestIdentityDraft] = useState('')
  const [pendingAttendance, setPendingAttendance] = useState<string | null>(null)
  const [pendingWish, setPendingWish] = useState(false)
  const [calendarSaved, setCalendarSaved] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const mainRef = useRef<HTMLElement>(null)

  const brideName = data?.brideName ?? 'Mai'
  const groomName = data?.groomName ?? 'Đức'
  const weddingDate = data?.weddingDate ?? '20 · 12 · 2026'
  const dateMatch = weddingDate.match(/(\d{1,2})\s*[·\/-]\s*(\d{1,2})\s*[·\/-]\s*(\d{4})/) ?? weddingDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  const weddingDay = dateMatch ? (dateMatch[3].length === 4 ? dateMatch[1] : dateMatch[3]) : '20'
  const weddingMonth = dateMatch ? dateMatch[2] : '12'
  const weddingYear = dateMatch ? (dateMatch[3].length === 4 ? dateMatch[3] : dateMatch[1]) : '2026'
  const weddingTimestamp = new Date(`${weddingYear}-${weddingMonth.padStart(2, '0')}-${weddingDay.padStart(2, '0')}T18:30:00+07:00`).getTime()
  const ceremonyVenue = data?.ceremonyVenue ?? 'The Peony Veranda'
  const ceremonyAddress = data?.ceremonyAddress ?? '28 Bạch Đằng, Hải Châu, Đà Nẵng'
  const mapUrl = data?.mapUrl ?? 'https://maps.google.com'
  const mapEmbedUrl = data?.mapUrl?.includes('google.com/maps/embed') ? data.mapUrl : 'https://www.google.com/maps?q=' + encodeURIComponent(ceremonyAddress) + '&output=embed'
  const guestName = interactions?.guestName ?? null
  const show = (key: string) => !sectionConfig || sectionConfig.enabled.includes(key)
  const orderOf = (key: string) => { const index = sectionConfig?.order.indexOf(key) ?? -1; return index >= 0 ? index : 999 }
  const splitNames = (value: string | undefined) => (value ?? '').split('&').map((part) => part.trim()).filter(Boolean)
  const brideLegacyNames = splitNames(familyValue(data, 'bride', 'name') ?? data?.brideFamilyName)
  const groomLegacyNames = splitNames(familyValue(data, 'groom', 'name') ?? data?.groomFamilyName)
  const brideFatherName = data?.brideFatherName ?? brideLegacyNames[0] ?? 'Nguyễn Văn Lâm'
  const brideMotherName = data?.brideMotherName ?? brideLegacyNames[1] ?? 'Trần Thu Hương'
  const groomFatherName = data?.groomFatherName ?? groomLegacyNames[0] ?? 'Phạm Văn Thành'
  const groomMotherName = data?.groomMotherName ?? groomLegacyNames[1] ?? 'Lê Ngọc Mai'
  const galleryItems = data?.galleryImages?.length ? data.galleryImages.map((item) => mediaUrl(item, asset('peony-gallery-01-v1.png'))) : gallery
  const timelineItems = data?.timelineItems?.length ? data.timelineItems : [
    { time: '17:30', title: 'Đón khách', detail: 'Gặp nhau, chụp một tấm ảnh và nhận lời chúc đầu tiên.' },
    { time: data?.ceremonyTime ?? '18:30', title: 'Lời hẹn trăm năm', detail: 'Cùng chứng kiến khoảnh khắc hai chúng mình gọi nhau là gia đình.' },
    { time: data?.receptionTime ?? '19:00', title: 'Tiệc và nâng ly', detail: 'Ở lại dùng tiệc, kể chuyện và chia sẻ niềm vui cùng hai gia đình.' },
  ]
  const activityItems = data?.activities?.length ? data.activities : [
    { title: 'Góc chụp ảnh', image: asset('peony-single-bloom-v1.png'), detail: 'Lưu lại một khung hình thật đẹp trước khi vào tiệc.' },
    { title: 'Bàn lời chúc', image: asset('peony-leaf-sprig-v1.png'), detail: 'Để lại vài dòng dịu dàng cho mùa mới của chúng mình.' },
    { title: 'Nâng ly cùng nhau', image: asset('peony-bud-v1.png'), detail: 'Ở lại dùng tiệc và chia sẻ những câu chuyện thật vui.' },
  ]
  const notes: Array<{ message: string; author?: string }> = interactions ? interactions.wishes.items.map((item) => ({ message: item.content, author: item.authorName })) : [{ message: 'Chúc hai bạn luôn tìm thấy nhau trong những điều thật nhỏ.' }, { message: 'Một mùa mới thật dịu dàng và nhiều tiếng cười nhé.' }]
  const calendarDays = new Date(Number(weddingYear), Number(weddingMonth), 0).getDate()
  const calendarStart = (new Date(Number(weddingYear), Number(weddingMonth) - 1, 1).getDay() + 6) % 7

  useSmoothInvitationScroll(opened)
  useEffect(() => { if (opened) window.setTimeout(() => mainRef.current?.focus({ preventScroll: true }), 0) }, [opened])
  useEffect(() => { setCountdown(getCountdown(weddingTimestamp)); const timer = window.setInterval(() => setCountdown(getCountdown(weddingTimestamp)), 1000); return () => window.clearInterval(timer) }, [weddingTimestamp])
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.pv-page'); let frame = 0
    const update = () => { frame = 0; page?.style.setProperty('--pv-scroll', `${(window.scrollY * 0.08).toFixed(1)}px`) }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update(); window.addEventListener('scroll', onScroll, { passive: true })
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.pv-slide'))
    sections.forEach((section) => Array.from(section.querySelectorAll<HTMLElement>('h1,h2,h3,p,span,strong,small,time,em,button,a,img,iframe,article,input,textarea,b')).forEach((element, index) => { element.classList.add('reveal', index % 3 === 0 ? 'reveal--slide-up' : index % 3 === 1 ? 'reveal--slide-left' : 'reveal--zoom-in'); element.style.setProperty('--reveal-delay', `${(index * 0.2).toFixed(1)}s`) }))
    let observer: IntersectionObserver | null = null
    if (!('IntersectionObserver' in window)) sections.forEach((section) => section.classList.add('is-visible'))
    else { observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer?.unobserve(entry.target) } }), { rootMargin: '0px 0px -33% 0px', threshold: 0.01 }); sections.forEach((section) => observer?.observe(section)) }
    return () => { observer?.disconnect(); window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame) }
  }, [])

  const open = () => { if (opening) return; setOpening(true); window.setTimeout(() => setOpened(true), 880) }
  const hasGuestIdentity = Boolean(interactions?.isPersonalized || guestName)
  const selectAttendance = async (value: 'ATTENDING' | 'DECLINED') => {
    if (!hasGuestIdentity) { setPendingAttendance(value); setPendingWish(false); setGuestIdentityModal(true); return }
    setAttendance(value); await interactions?.rsvp.submit({ guestName: guestName ?? undefined, attendance: value, partySize: 1 })
  }
  const submitWish = async () => {
    if (!wish.trim()) return
    if (!hasGuestIdentity) { setPendingWish(true); setPendingAttendance(null); setGuestIdentityModal(true); return }
    const sent = await interactions?.wishes.submit({ guestName: undefined, content: wish.trim() })
    if (sent !== false) { setWishSent(true); setWish('') }
  }
  const confirmGuestIdentity = async () => {
    const name = guestIdentityDraft.trim()
    if (!name) return
    setGuestIdentityModal(false); setGuestIdentityDraft('')
    if (pendingAttendance) { const next = pendingAttendance as 'ATTENDING' | 'DECLINED'; setPendingAttendance(null); setAttendance(next); await interactions?.rsvp.submit({ guestName: name, attendance: next, partySize: 1 }) }
    if (pendingWish) { setPendingWish(false); const sent = await interactions?.wishes.submit({ guestName: name, content: wish.trim() }); if (sent !== false) { setWishSent(true); setWish('') } }
  }

  return <div className={'pv-page ' + (opened ? 'is-opened' : 'is-closed') + (!opened && opening ? ' is-opening' : '')}>
    <div className='pv-global-atmosphere' aria-hidden='true'><img className='pv-global-leaf pv-global-leaf-a' src={asset('peony-leaf-sprig-v1.png')} alt='' /><img className='pv-global-leaf pv-global-leaf-b' src={asset('peony-leaf-sprig-v1.png')} alt='' /><img className='pv-global-petal pv-global-petal-b' src={asset('peony-bud-v1.png')} alt='' /><span className='pv-heart-particle pv-heart-a'>♡</span><span className='pv-heart-particle pv-heart-b'>♡</span><span className='pv-heart-particle pv-heart-c'>♡</span><span className='pv-heart-particle pv-heart-d'>♡</span><span className='pv-heart-particle pv-heart-e'>♡</span><span className='pv-global-sprite pv-global-sprite-a' /></div>
    {!opened && <section className={'pv-opening ' + (opening ? 'is-opening' : '')} data-editor-section='cover' aria-label='Mở thiệp Peony Veranda'><img className='pv-veil' src={asset('peony-voile-overlay-v1.png')} alt='' /><img className='pv-opening-top-left' src={asset('peony-single-bloom-v1.png')} alt='' /><img className='pv-hero-flower' src={asset('peony-hero-cluster-v1.png')} alt='' /><div className='pv-opening-frame' aria-hidden='true'><img src={asset('peony-leaf-sprig-v1.png')} alt='' /></div><div className='pv-opening-petals' aria-hidden='true'><img src={asset('peony-mini-petal-v1.png')} alt='' /><img src={asset('peony-mini-bud-v1.png')} alt='' /><img src={asset('peony-mini-leaf-petal-v1.png')} alt='' /></div><div className='pv-opening-card-wrap'><img className='pv-opening-card-spray' src={asset('peony-corner-spray-v1.png')} alt='' /><div className='pv-opening-card'><span>{data?.coverEyebrow ?? 'Thiệp mời ngày vui'}</span><h1>{brideName} <i>&amp;</i> {groomName}</h1><time>{weddingDate}</time><p>Kính mời <strong>{editorMode ? 'Quý khách' : (guestName ?? 'Quý khách')}</strong></p><button type='button' onClick={open} disabled={opening}>{opening ? 'Hiên hoa đang mở…' : 'Chạm để mở thiệp'} <ArrowRight size={16} /></button></div></div></section>}
    <main ref={mainRef} className='pv-main' tabIndex={-1}>
      {editorMode && <div data-editor-section='cover' aria-hidden='true' className='pv-editor-cover-marker' />}
      {show('banner') && <section className='pv-banner-new pv-slide' data-editor-section='banner' style={{ order: orderOf('banner') }}><div className='pv-banner-new-art' aria-hidden='true'><span className='pv-banner-new-art-label'>{data?.bannerIndex ?? 'PEONY VERANDA'}</span><img className='pv-banner-new-flower' src={mediaUrl(data?.bannerImage, asset('peony-hero-cluster-v1.png'))} alt='' /><span className='pv-banner-new-stamp'>✦<small>PV</small></span></div><div className='pv-banner-new-content'><span className='pv-banner-new-kicker'>{data?.eyebrow ?? 'Trân trọng kính mời'}</span><p className='pv-banner-new-intro'>{data?.bannerIntro ?? 'Trân trọng gửi đến bạn lời mời của mùa yêu thương'}</p><h2><span>{brideName}</span><i>&amp;</i><span>{groomName}</span></h2><div className='pv-banner-new-rule' aria-hidden='true' /><time>{weddingDate}</time><p className='pv-banner-new-note'>{data?.bannerNote ?? 'Một ngày để cùng nhau hiện diện, nâng ly và bắt đầu một mùa mới.'}</p><span className='pv-banner-new-index'>{data?.bannerIndex ?? '01 / 19'}</span></div></section>}
      {show('announcement') && <section className='pv-slide pv-announcement pv-announcement-new' data-editor-section='announcement' style={{ order: orderOf('announcement') }}><div className='pv-announcement-new-ornament' aria-hidden='true'><span>THƯ BÁO HỶ</span><img src={asset('peony-divider-v1.png')} alt='' /><b>✦</b></div><div className='pv-announcement-new-copy'><span className='pv-announcement-new-kicker'>{data?.announcementKicker ?? 'Trân trọng báo tin'}</span><h2>{data?.invitationTitle ?? 'Lễ thành hôn của chúng mình'}</h2><div className='pv-announcement-new-rule' aria-hidden='true' /><p>{data?.invitationMessage ?? 'Hai gia đình trân trọng báo tin và kính mời bạn đến chung vui trong ngày hạnh phúc của ' + brideName + ' và ' + groomName + '.'}</p><span className='pv-announcement-new-signoff'>{data?.announcementSignoff ?? 'Hai gia đình kính báo'}</span></div></section>}
      {show('families') && <section className='pv-slide pv-families' data-editor-section='families' style={{ order: orderOf('families') }}><span>{data?.familiesEyebrow ?? 'Hai bên gia đình'}</span><h2>{data?.familiesTitle ?? 'Từ hai mái nhà, thành một lời hẹn'}</h2><div className='pv-families-grid'><article><small>Nhà gái</small><strong><span><em>Ba cô dâu</em>{brideFatherName}</span><span><em>Mẹ cô dâu</em>{brideMotherName}</span></strong><p>{data?.brideFamilyAddress ?? '18 Phan Đình Phùng, Hà Nội'}</p>{data?.brideFamilyHometown && <span>Quê quán: {data.brideFamilyHometown}</span>}</article><b aria-hidden='true'>✦</b><article><small>Nhà trai</small><strong><span><em>Ba chú rể</em>{groomFatherName}</span><span><em>Mẹ chú rể</em>{groomMotherName}</span></strong><p>{data?.groomFamilyAddress ?? '86 Trần Duy Hưng, Hà Nội'}</p>{data?.groomFamilyHometown && <span>Quê quán: {data.groomFamilyHometown}</span>}</article></div></section>}
      {show('couple') && <section className='pv-slide pv-couple' data-editor-section='couple' style={{ order: orderOf('couple') }}><div className='pv-couple-ring' style={data?.coupleImage ? { backgroundImage: 'url(' + mediaUrl(data.coupleImage, '') + ')' } : undefined} aria-label='Ảnh của cô dâu và chú rể'><div className='pv-couple-ring-overlay' aria-hidden='true' /><div className='pv-couple-ring-content'><span>With love</span><div className='pv-couple-person'><em>{data?.brideRole ?? 'Trưởng nữ'}</em><strong>{brideName}</strong></div><i>&amp;</i><div className='pv-couple-person'><em>{data?.groomRole ?? 'Trưởng nam'}</em><strong>{groomName}</strong></div><small>{data?.coupleTagline ?? 'together is our favorite place'}</small></div></div><div className='pv-couple-orbit' aria-hidden='true'><i className='pv-couple-orbit-star pv-couple-orbit-star-a' /><i className='pv-couple-orbit-star pv-couple-orbit-star-b' /><i className='pv-couple-orbit-star pv-couple-orbit-star-c' /></div><span className='pv-couple-petal pv-couple-petal-a' aria-hidden='true' /><span className='pv-couple-petal pv-couple-petal-b' aria-hidden='true' /></section>}
{show('countdown') && <section className='pv-slide pv-date-countdown-combo' data-editor-section='countdown' style={{ order: orderOf('countdown') }}><div className='pv-date-countdown-wash' aria-hidden='true' /><div className='pv-date pv-date-new'><div className='pv-date-card'><span>Save the date</span><strong>{weddingDay}</strong><small>THÁNG {weddingMonth} · {weddingYear}</small><em>{new Date(Number(weddingYear), Number(weddingMonth) - 1, Number(weddingDay)).toLocaleDateString('vi-VN', { weekday: 'long' })}</em></div><div className='pv-date-note'><span>{data?.calendarEyebrow ?? 'Ngày vui đang đến gần'}</span><p>{weddingDate}</p></div></div><div className='pv-countdown pv-countdown-new'><span>Đếm ngược ngày vui</span><h2>{data?.countdownTitle ?? 'Hẹn gặp nhau sau'}</h2><div className='pv-countdown-grid' aria-live='off'>{[[countdown.days, 'Ngày'], [countdown.hours, 'Giờ'], [countdown.minutes, 'Phút'], [countdown.seconds, 'Giây']].map(([value, label]) => <div key={label}><strong aria-label={String(value) + ' ' + String(label).toLowerCase()}>{String(value).padStart(2, '0')}</strong><small>{label}</small></div>)}</div></div></section>}
{show('venue') && <section className='pv-slide pv-ceremony pv-ceremony-venue' data-editor-section='venue' style={{ order: orderOf('venue') }}><span>{data?.ceremonyEyebrow ?? 'Nghi lễ thành hôn'}</span><h2>{data?.ceremonyTitle ?? 'Một lời hẹn, hai gia đình chứng kiến'}</h2><p>{data?.ceremonyMessage ?? ('Lễ thành hôn được cử hành tại ' + (data?.ceremonyVenue ?? ceremonyVenue) + ' trong sự hiện diện của những người thân yêu.')}</p><span className='pv-ceremony-guest'> {data?.ceremonyGuestLabel ?? 'Kính mời'} <em>{guestName ?? 'Quý khách'}</em></span><div className='pv-detail'><div className='pv-detail-copy'><strong>{data?.ceremonyVenue ?? ceremonyVenue} · {data?.ceremonyDate ?? weddingDate} · {data?.ceremonyTime ?? '18:30'}</strong><span>{data?.ceremonyAddress ?? ceremonyAddress}</span>{data?.ceremonyNote && <span>{data.ceremonyNote}</span>}</div><div className='pv-map-art'><iframe title={'Bản đồ ' + ceremonyVenue} src={mapEmbedUrl} loading='lazy' /><a href={mapUrl} target='_blank' rel='noreferrer'><MapPin size={17} />Mở bản đồ</a></div></div></section>}
{show('calendar') && <section className='pv-slide pv-calendar' data-editor-section='calendar' style={{ order: orderOf('calendar') }}><div className='pv-calendar-intro'><span>{data?.calendarEyebrow ?? 'Ngày vui đang đến gần'}</span><h2>{data?.calendarTitle ?? 'Để chúng mình gặp nhau đúng hẹn'}</h2><p><CalendarBlank size={18} /> {weddingDate}</p></div><div className='pv-calendar-card'><b>THÁNG {weddingMonth} · {weddingYear}</b><div className='pv-calendar-grid'>{['T2','T3','T4','T5','T6','T7','CN'].map((day) => <small key={day}>{day}</small>)}{Array.from({ length: calendarStart }).map((_, index) => <i aria-hidden='true' key={'blank-' + index} />)}{Array.from({ length: calendarDays }).map((_, index) => <i className={index + 1 === Number(weddingDay) ? 'is-wedding' : ''} key={index}>{index + 1}</i>)}</div><a className={'pv-calendar-add' + (calendarSaved ? ' is-saved' : '')} aria-label='Thêm ngày cưới vào Google Calendar' href='https://calendar.google.com/calendar/render?action=TEMPLATE' target='_blank' rel='noreferrer' onClick={() => setCalendarSaved(true)}>{calendarSaved ? 'Đã lưu ngày vui' : 'Thêm vào lịch'}</a></div></section>}
      {show('timeline') && <section className='pv-slide pv-program' data-editor-section='timeline' style={{ order: orderOf('timeline') }}><span>{data?.timelineEyebrow ?? 'Lịch trình trong ngày'}</span><h2>{data?.timelineTitle ?? 'Những khoảnh khắc mình muốn giữ lại'}</h2><div className='pv-program-list'>{timelineItems.map((item) => <article key={item.time + item.title}><time>{item.time}</time><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div></section>}
      {show('activities') && <section className='pv-slide pv-activities' data-editor-section='activities' style={{ order: orderOf('activities') }}><span>{data?.activitiesEyebrow ?? 'Một chút niềm vui'}</span><h2>{data?.activitiesTitle ?? 'Những góc nhỏ dành cho bạn'}</h2><div className='pv-activity-slider' aria-label='Các hoạt động trong tiệc'><button className='pv-activity-control pv-activity-prev' type='button' onClick={() => setActivityActive((activityActive - 1 + activityItems.length) % activityItems.length)} aria-label='Hoạt động trước'>‹</button><div className='pv-activity-viewport'><div className='pv-activity-track' style={{ transform: 'translate3d(-' + (activityActive * 100) + '%, 0, 0)' }}>{activityItems.map((item, index) => <article className={index === activityActive ? 'is-active' : ''} key={item.title + index}><img src={mediaUrl(item.image, asset('peony-leaf-sprig-v1.png'))} alt='' /><strong>{item.title}</strong><p>{item.detail}</p></article>)}</div></div><button className='pv-activity-control pv-activity-next' type='button' onClick={() => setActivityActive((activityActive + 1) % activityItems.length)} aria-label='Hoạt động tiếp theo'>›</button><div className='pv-activity-dots' role='tablist' aria-label='Chọn hoạt động'>{activityItems.map((item, index) => <button role='tab' aria-selected={index === activityActive} type='button' key={item.title + index} className={index === activityActive ? 'is-active' : ''} onClick={() => setActivityActive(index)} aria-label={'Xem hoạt động ' + (index + 1)} />)}</div></div></section>}
      {show('rsvp') && <section className='pv-slide pv-rsvp' data-editor-section='rsvp' style={{ order: orderOf('rsvp') }}><span>{data?.rsvpEyebrow ?? 'Xác nhận tham dự'}</span><h2>{data?.rsvpTitle ?? 'Bạn sẽ đến chung vui cùng chúng mình chứ?'}</h2><p className='pv-rsvp-deadline'>{data?.rsvpDeadlinePrefix ?? 'Vui lòng phản hồi trước'} {data?.rsvpDeadline ?? 'ngày diễn ra buổi tiệc'}.</p><div className='pv-actions'><button type='button' disabled={interactions?.rsvp.submitting} className={attendance === 'ATTENDING' ? 'is-selected' : ''} onClick={() => void selectAttendance('ATTENDING')}>Mình sẽ tham dự</button><button type='button' disabled={interactions?.rsvp.submitting} className={attendance === 'DECLINED' ? 'is-selected' : ''} onClick={() => void selectAttendance('DECLINED')}>Mình chưa thể đến</button></div>{attendance && <p className='pv-status' role='status'>{interactions?.rsvp.error || 'Cảm ơn bạn đã phản hồi.'}</p>}<span className='pv-rsvp-bloom' aria-hidden='true'>✦</span></section>}
      {show('gallery') && <section className='pv-slide pv-gallery' data-editor-section='gallery' style={{ order: orderOf('gallery') }}><span>{data?.galleryEyebrow ?? 'Những điều dịu dàng'}</span><h2>{data?.galleryTitle ?? 'Một vài khung hình của chúng mình'}</h2><div className='pv-gallery-stage'><img src={mediaUrl(galleryItems[active], asset('peony-gallery-01-v1.png'))} alt={'Ảnh trong album ' + (active + 1)} /><button type='button' onClick={() => setActive((active + galleryItems.length - 1) % galleryItems.length)} aria-label='Ảnh trước'>‹</button><button type='button' onClick={() => setActive((active + 1) % galleryItems.length)} aria-label='Ảnh tiếp theo'>›</button></div><div className='pv-gallery-dots' role='tablist' aria-label='Chọn ảnh trong album'>{galleryItems.map((_, index) => <button role='tab' aria-selected={index === active} type='button' key={index} className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={'Xem ảnh ' + (index + 1)} />)}</div></section>}
      {show('guestbook') && <section className='pv-slide pv-wishes' data-editor-section='guestbook' style={{ order: orderOf('guestbook') }}><img className='pv-wishes-decor pv-wishes-decor-left' src={asset('peony-foliage-branch-v1.png')} alt='' /><img className='pv-wishes-decor pv-wishes-decor-right' src={asset('peony-foliage-branch-v1.png')} alt='' /><h2>{data?.guestbookTitle ?? 'Gửi một lời chúc ở lại'}</h2><div className='pv-note-marquee' aria-label='Lời chúc đã được duyệt'>{notes.length ? <div className='pv-note-grid'>{[...notes, ...notes].map((note, index) => <article key={note.message + index} aria-hidden={index >= notes.length ? true : undefined}><p>{note.message}</p>{note.author && <small>Gửi bởi {note.author}</small>}</article>)}</div> : <p className='pv-status'>Chưa có lời chúc được duyệt.</p>}</div><div className='pv-wish-form'>{interactions?.wishes.error ? <p className='pv-status' role='alert'>{interactions.wishes.error}</p> : null}<input className='pv-wish-name' value={wishGuestName} onChange={(event) => setWishGuestName(event.target.value)} placeholder='Tên của bạn' aria-label='Tên của bạn' /><textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder='Viết lời chúc của bạn…' aria-label='Lời chúc' /><button type='button' disabled={!wish.trim() || interactions?.wishes.submitting} onClick={() => void submitWish()}>{wishSent || interactions?.wishes.submitted ? <Heart size={17} weight='fill' /> : <PaperPlaneTilt size={17} />}{wishSent || interactions?.wishes.submitted ? 'Đã gửi lời chúc' : interactions?.wishes.submitting ? 'Đang gửi…' : 'Gửi lời chúc'}</button></div></section>}
      {show('gift') && <section className='pv-gift pv-slide' data-editor-section='gift' style={{ order: orderOf('gift') }}><h2>Quà mừng cưới</h2><p>Sự hiện diện của bạn đã là món quà quý giá nhất với chúng mình.</p><button type='button' aria-expanded={giftOpen} onClick={() => setGiftOpen((value) => !value)}>Xem thông tin mừng cưới</button>{giftOpen && <div role='region' aria-label='Thông tin mừng cưới'>{data?.giftQrMedia ? <img className='pv-gift-qr' src={mediaUrl(data.giftQrMedia, '')} alt='Mã QR mừng cưới' /> : <p className='pv-status'>Gia đình sẽ cập nhật mã QR mừng cưới tại đây.</p>}</div>}</section>}
      {show('footer') && <section className='pv-footer pv-slide' data-editor-section='footer' style={{ order: orderOf('footer'), ...(data?.footerImage ? { backgroundImage: 'linear-gradient(rgba(244, 211, 215, .78), rgba(244, 211, 215, .78)), url(' + mediaUrl(data.footerImage, '') + ')', backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}><div className='pv-footer-constellation' aria-hidden='true'><i /><i /><i /></div><span>Hẹn gặp bạn trong ngày vui</span><h2>{brideName} <i>&amp;</i> {groomName}</h2><p>{data?.footerMessage ?? 'Cảm ơn bạn đã dành thời gian chung vui cùng chúng mình.'}</p></section>}
    </main>
    {show('music') && <MusicPlayer src={data?.backgroundMusicUrl} title={data?.backgroundMusicName ?? 'Nhạc nền'} autoplay={data?.backgroundMusicAutoplay ?? true} active={opened} editorMode={editorMode} />}
    <GuestIdentityModal open={guestIdentityModal} value={guestIdentityDraft} onChange={setGuestIdentityDraft} onClose={() => setGuestIdentityModal(false)} onConfirm={() => void confirmGuestIdentity()} />
  </div>
}
function GuestIdentityModal({ open, value, onChange, onClose, onConfirm }: { open: boolean; value: string; onChange: (value: string) => void; onClose: () => void; onConfirm: () => void }) { if (!open) return null; return <div className="pv-guest-identity-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="pv-guest-identity-modal" role="dialog" aria-modal="true" aria-labelledby="pv-guest-identity-title"><h2 id="pv-guest-identity-title">Cho chúng mình biết tên bạn</h2><p>Để lưu lời xác nhận và lời chúc, bạn hãy nhập tên nhé.</p><input autoFocus value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onConfirm() }} placeholder="Tên của bạn" aria-label="Tên của bạn" /><div><button type="button" onClick={onClose}>Để sau</button><button type="button" onClick={onConfirm} disabled={!value.trim()}>Tiếp tục</button></div></div></div> }
