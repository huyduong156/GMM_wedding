import { useEffect, useRef, useState } from 'react'
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  Gift,
  Heart,
  MapPin,
  NavigationArrow,
  Sparkle,
} from '@phosphor-icons/react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { formatCountdownUnit, useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import './modern-luxe.css'

export type ModernLuxePalette = 'champagne' | 'midnight' | 'sage'
export type ModernLuxeData = {
  brideName?: string; groomName?: string; weddingDate?: string; eyebrow?: string
  invitationTitle?: string; invitationMessage?: string
  ceremonyTime?: string; receptionTime?: string; venueName?: string; venueAddress?: string; mapUrl?: string
  rsvpDeadline?: string; rsvpMessage?: string; galleryImages?: string[]
  brideFather?: string; brideMother?: string; brideFamilyAddress?: string; brideRole?: string
  groomFather?: string; groomMother?: string; groomFamilyAddress?: string; groomRole?: string
  calendarUrl?: string; giftMessage?: string
}

const defaults: Required<ModernLuxeData> = {
  brideName: 'Minh Anh', groomName: 'Hoàng Nam', weddingDate: '12 · 12 · 2026', eyebrow: 'Trân trọng kính mời',
  invitationTitle: 'Đến chung vui trong ngày thành hôn', invitationMessage: 'Sự hiện diện của bạn là niềm vui và là món quà quý giá trong ngày chúng mình bắt đầu một hành trình mới.',
  ceremonyTime: '09:00', receptionTime: '11:00', venueName: 'The Grand Ballroom', venueAddress: '88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh', mapUrl: '#',
  rsvpDeadline: '01.12.2026', rsvpMessage: 'Vui lòng xác nhận để chúng mình chuẩn bị đón tiếp bạn thật chu đáo.', galleryImages: [],
  brideFather: 'Ông Trần Văn Bình', brideMother: 'Bà Nguyễn Thu Hà', brideFamilyAddress: 'Quận 3, TP. Hồ Chí Minh', brideRole: 'Trưởng nữ',
  groomFather: 'Ông Nguyễn Văn Minh', groomMother: 'Bà Lê Ngọc Lan', groomFamilyAddress: 'TP. Thủ Đức, TP. Hồ Chí Minh', groomRole: 'Trưởng nam',
  calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Le%20thanh%20hon%20Minh%20Anh%20va%20Hoang%20Nam&dates=20261212T020000Z/20261212T060000Z',
  giftMessage: 'Tình cảm và sự hiện diện của bạn là món quà ý nghĩa nhất dành cho chúng mình.',
}

const timeline = [
  { timeKey: 'ceremony', title: 'Đón khách', detail: 'Gặp gỡ, chụp ảnh và lưu lại những lời chúc đầu tiên.', Icon: Clock },
  { timeKey: 'vow', title: 'Lễ thành hôn', detail: 'Cùng chứng kiến nghi thức và lời hẹn trăm năm.', Icon: Heart },
  { timeKey: 'reception', title: 'Tiệc chung vui', detail: 'Khai tiệc và sẻ chia niềm vui cùng hai gia đình.', Icon: Gift },
] as const

const loveJourney = [
  { year: '2019', title: 'Lần đầu gặp nhau', note: 'Một cuộc gặp nhỏ mở ra câu chuyện thật dài.' },
  { year: '2022', title: 'Những chuyến đi', note: 'Mình cùng đi, cùng lớn lên và cùng nhớ.' },
  { year: '2025', title: 'Lời cầu hôn', note: 'Một lời đồng ý cho mọi ngày về sau.' },
  { year: '2026', title: 'Ngày mình chung nhà', note: 'Chương đẹp nhất bắt đầu cùng những người thương.' },
] as const

const decemberDays = Array.from({ length: 31 }, (_, index) => index + 1)
const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const splitHonorific = (fullName: string) => {
  const match = /^(Ông|Bà)\s+(.+)$/u.exec(fullName.trim())
  return match ? { honorific: match[1], name: match[2] } : { honorific: '', name: fullName }
}

function SectionReveal({ children, className }: { children: React.ReactNode; className: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.12, once: true }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

export function ModernLuxeInvitation({ data, palette = 'champagne', preview = false }: { data?: ModernLuxeData; palette?: ModernLuxePalette; preview?: boolean }) {
  const content = { ...defaults, ...data }
  const brideFather = splitHonorific(content.brideFather)
  const brideMother = splitHonorific(content.brideMother)
  const groomFather = splitHonorific(content.groomFather)
  const groomMother = splitHonorific(content.groomMother)
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [galleryPaused, setGalleryPaused] = useState(false)
  const [rsvp, setRsvp] = useState<'attending' | 'declined' | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState([
    { name: 'Ngọc Mai', message: 'Chúc hai bạn một đời bình an, luôn thương nhau như ngày đầu.' },
    { name: 'Gia đình cô Lan', message: 'Chúc mừng hạnh phúc hai con, trăm năm viên mãn.' },
  ])
  const mainRef = useRef<HTMLElement>(null)
  const openingTimerRef = useRef<number | undefined>(undefined)
  const focusFrameRef = useRef<number | undefined>(undefined)
  const reduceMotion = useReducedMotion()
  const gallery = content.galleryImages.length ? content.galleryImages : [
    '/assets/images/templates/modern-luxe/couple-portrait.jpg',
    '/assets/images/templates/modern-luxe/wedding-detail.jpg',
    '/assets/images/login-wedding-luxury.jpg',
  ]
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(content.venueAddress)}&output=embed`
  const weddingCountdown = useWeddingCountdown('2026-12-12T09:00:00+07:00')
  const { scrollY } = useScroll()
  const heroPhotoY = useTransform(scrollY, [0, 760], ['0%', '13%'])
  const heroTypeY = useTransform(scrollY, [0, 700], ['0%', '25%'])

  useEffect(() => {
    if (!opened || galleryPaused || reduceMotion || gallery.length < 2) return
    const timer = window.setInterval(() => setActiveImage((current) => (current + 1) % gallery.length), 5400)
    return () => window.clearInterval(timer)
  }, [gallery.length, galleryPaused, opened, reduceMotion])

  useEffect(() => () => {
    if (openingTimerRef.current !== undefined) window.clearTimeout(openingTimerRef.current)
    if (focusFrameRef.current !== undefined) window.cancelAnimationFrame(focusFrameRef.current)
  }, [])

  const openInvitation = () => {
    if (opened || opening) return
    setOpening(true)
    setOpened(true)
    openingTimerRef.current = window.setTimeout(() => setOpening(false), reduceMotion ? 80 : 820)
    focusFrameRef.current = window.requestAnimationFrame(() => mainRef.current?.focus())
  }

  const submitWish = () => {
    const message = wish.trim()
    const name = wishName.trim()
    if (!message || !name) return
    setWishes((current) => [{ name, message }, ...current])
    setWishName('')
    setWish('')
  }

  const moveHeroLayers = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    event.currentTarget.style.setProperty('--ml-pointer-x', x.toFixed(3))
    event.currentTarget.style.setProperty('--ml-pointer-y', y.toFixed(3))
  }

  const resetHeroLayers = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--ml-pointer-x', '0')
    event.currentTarget.style.setProperty('--ml-pointer-y', '0')
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`modern-luxe-wrap palette-${palette} ${opened ? 'is-opened' : ''}`}>
        <AnimatePresence>
          {!opened || opening ? (
            <motion.section
              className="ml-opening"
              aria-label="Mở thiệp Élan d’Amour"
              aria-hidden={opened}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.42 }}
            >
              <div className="ml-opening-light" aria-hidden="true" />
              <div className="ml-opening-arc ml-opening-arc-a" aria-hidden="true" />
              <div className="ml-opening-arc ml-opening-arc-b" aria-hidden="true" />
              <motion.div className="ml-opening-photo ml-opening-photo-back" aria-hidden="true" animate={opening && !reduceMotion ? { x: -180, rotate: -18, opacity: 0 } : { x: 0, rotate: -8, opacity: 0.58 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
              <motion.div className="ml-opening-photo ml-opening-photo-front" aria-hidden="true" animate={opening && !reduceMotion ? { x: 180, rotate: 18, opacity: 0 } : { x: 0, rotate: 8, opacity: 0.72 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
              <motion.button
                className="ml-folio"
                type="button"
                onClick={openInvitation}
                disabled={opening}
                aria-label="Mở thiệp mời của Minh Anh và Hoàng Nam"
                initial={reduceMotion ? false : { opacity: 0, y: 38, rotateX: 8 }}
                animate={opening && !reduceMotion ? { opacity: 0, y: -25, rotateY: -22, scale: 0.92 } : { opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
                transition={{ duration: opening ? 0.88 : 1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -10, rotateX: 2, rotateY: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                <span className="ml-folio-edge" aria-hidden="true" />
                <span className="ml-folio-kicker">Élan d’Amour · Wedding invitation</span>
                <span className="ml-folio-monogram">M <i>&amp;</i> N</span>
                <strong>Minh Anh <i>&amp;</i> Hoàng Nam</strong>
                <time>{content.weddingDate}</time>
                <span className="ml-wax-seal" aria-hidden="true">É</span>
                <span className="ml-open-cta">Chạm để mở thiệp</span>
              </motion.button>
              <p className="ml-opening-note">Một lời mời được mở như trang đầu của haute couture</p>
            </motion.section>
          ) : null}
        </AnimatePresence>

        {opened ? (
          <main ref={mainRef} className="modern-luxe" tabIndex={-1}>
            {preview ? <div className="modern-luxe-preview-note">Bản xem trước · Dữ liệu mẫu</div> : null}
            <div className="ml-paper-grain" aria-hidden="true" />
            <div className="ml-fixed-arc ml-fixed-arc-left" aria-hidden="true" />
            <div className="ml-fixed-arc ml-fixed-arc-right" aria-hidden="true" />

            <header className="ml-hero" onPointerMove={moveHeroLayers} onPointerLeave={resetHeroLayers}>
              <motion.div className="ml-hero-word" style={reduceMotion ? undefined : { y: heroTypeY }} aria-hidden="true">ÉLAN</motion.div>
              <div className="ml-hero-stage" aria-hidden="true">
                <div className="ml-hero-shadow-card" />
                <motion.div className="ml-hero-photo" style={reduceMotion ? undefined : { y: heroPhotoY }} />
                <div className="ml-hero-metal-frame" />
                <div className="ml-hero-vellum"><span>12</span><small>DEC<br />2026</small></div>
              </div>
              <motion.div className="ml-hero-copy" initial={reduceMotion ? false : { opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <span className="ml-eyebrow">{content.eyebrow}</span>
                <p>Wedding invitation</p>
                <h1><span>{content.brideName}</span><i>&amp;</i><span>{content.groomName}</span></h1>
                <time>{content.weddingDate}</time>
              </motion.div>
              <div className="ml-hero-index" aria-hidden="true"><span>01</span><i /><small>CHAPTER<br />TOGETHER</small></div>
            </header>

            <SectionReveal className="ml-invitation-suite">
              <div className="ml-suite-number" aria-hidden="true">I</div>
              <div className="ml-floating-memories" aria-hidden="true">
                {gallery.slice(0, 3).map((image, index) => (
                  <motion.figure
                    className={`ml-floating-memory ml-floating-memory-${index + 1}`}
                    key={`floating-${image}-${index}`}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.18 }}
                    transition={{ delay: 0.12 + index * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img src={image} alt="" loading="lazy" />
                    <span>{index === 0 ? 'a quiet beginning' : index === 1 ? 'our little moments' : 'always, together'}</span>
                  </motion.figure>
                ))}
              </div>
              <article className="ml-invitation-card">
                <motion.img
                  className="ml-invitation-art"
                  src="/assets/images/templates/modern-luxe/couture-invitation-frame-v1.png"
                  alt=""
                  aria-hidden="true"
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.07, rotate: -2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="ml-invitation-orbit" aria-hidden="true" />
                <div className="ml-invitation-content">
                  <span className="ml-monogram">M · N</span>
                  <span className="ml-invitation-kicker">Trân trọng báo tin lễ thành hôn</span>
                  <div className="ml-invitation-names" aria-label={`${content.brideName} và ${content.groomName}`}>
                    <motion.span initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }}>{content.brideName}</motion.span>
                    <i>&amp;</i>
                    <motion.span initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.36, duration: 0.7 }}>{content.groomName}</motion.span>
                  </div>
                  <time>{content.weddingDate}</time>
                  <h3>{content.invitationTitle}</h3>
                  <p>{content.invitationMessage}</p>
                  <div className="ml-signature">with love</div>
                </div>
              </article>
              <div className="ml-journey" aria-label="Hành trình tình yêu của cô dâu và chú rể">
                <div className="ml-journey-heading"><span>Our love story</span><strong>Hành trình đến ngày chung đôi</strong></div>
                <div className="ml-journey-viewport" tabIndex={0}>
                  <div className="ml-journey-track">
                    {[false, true].map((duplicate) => (
                      <div className="ml-journey-group" aria-hidden={duplicate} key={duplicate ? 'duplicate' : 'primary'}>
                        {loveJourney.map((item, index) => (
                          <article className="ml-journey-card" key={`${duplicate ? 'd' : 'p'}-${item.year}`}>
                            <img src={gallery[index % gallery.length]} alt={duplicate ? '' : `Kỷ niệm ${item.title.toLowerCase()}`} loading="lazy" />
                            <div><time>{item.year}</time><strong>{item.title}</strong><p>{item.note}</p></div>
                          </article>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ml-families" role="region" aria-label="Thông tin hai bên gia đình">
                <header className="ml-family-heading"><span className="ml-eyebrow">Thông tin gia đình</span><h2>Hai gia đình trân trọng báo tin</h2><p>Lễ thành hôn của các con chúng tôi</p></header>
                <div className="ml-family-grid">
                  <article><small>Nhà gái</small><span>Đại diện gia đình</span><div className="ml-family-person"><em>{brideFather.honorific}</em><strong>{brideFather.name}</strong></div><i>&amp;</i><div className="ml-family-person"><em>{brideMother.honorific}</em><strong>{brideMother.name}</strong></div><div className="ml-family-child"><em>{content.brideRole}</em><b>{content.brideName}</b></div><address>Tư gia · {content.brideFamilyAddress}</address></article>
                  <div className="ml-family-medallion" aria-hidden="true">M<i>&amp;</i>N</div>
                  <article><small>Nhà trai</small><span>Đại diện gia đình</span><div className="ml-family-person"><em>{groomFather.honorific}</em><strong>{groomFather.name}</strong></div><i>&amp;</i><div className="ml-family-person"><em>{groomMother.honorific}</em><strong>{groomMother.name}</strong></div><div className="ml-family-child"><em>{content.groomRole}</em><b>{content.groomName}</b></div><address>Tư gia · {content.groomFamilyAddress}</address></article>
                </div>
                <p className="ml-family-invitation">Kính mời Quý khách đến chung vui và chứng kiến khoảnh khắc hai gia đình kết duyên.</p>
              </div>
            </SectionReveal>

            <SectionReveal className="ml-date-suite">
              <div className="ml-date-photo" aria-hidden="true"><span>Save<br />the<br />date</span></div>
              <div className="ml-date-plane">
                <span className="ml-eyebrow">Hôn lễ &amp; tiệc cưới</span>
                <div className="ml-date-lockup"><small>Tháng 12</small><strong>12</strong><time>2026</time></div>
                <dl>
                  <div><dt>Đón khách</dt><dd>{content.ceremonyTime}</dd></div>
                  <div><dt>Lễ thành hôn</dt><dd>10:00</dd></div>
                  <div><dt>Khai tiệc</dt><dd>{content.receptionTime}</dd></div>
                </dl>
                <a href={content.calendarUrl} target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch</a>
              </div>
            </SectionReveal>

            <SectionReveal className="ml-countdown">
              <div className="ml-month-card" aria-label="Lịch tháng 12 năm 2026"><header><span>December</span><strong>2026</strong></header><div className="ml-month-week">{weekdays.map((day) => <b key={day}>{day}</b>)}</div><div className="ml-month-days"><i />{decemberDays.map((day) => <span key={day} className={day === 12 ? 'is-wedding' : ''} aria-current={day === 12 ? 'date' : undefined} aria-label={day === 12 ? 'Ngày 12, ngày cưới' : undefined}>{day}{day === 12 ? <Heart weight="fill" /> : null}</span>)}</div></div>
              <div className="ml-countdown-live">
                <span>Đếm ngược đến ngày chung đôi</span>
                <div className="ml-countdown-units" role="timer" aria-live="off" aria-label={`${weddingCountdown.days} ngày ${weddingCountdown.hours} giờ ${weddingCountdown.minutes} phút ${weddingCountdown.seconds} giây`}>
                  <div><strong>{weddingCountdown.days}</strong><small>Ngày</small></div><i>:</i><div><strong>{formatCountdownUnit(weddingCountdown.hours)}</strong><small>Giờ</small></div><i>:</i><div><strong>{formatCountdownUnit(weddingCountdown.minutes)}</strong><small>Phút</small></div><i>:</i><div><strong>{formatCountdownUnit(weddingCountdown.seconds)}</strong><small>Giây</small></div>
                </div>
                <p>để cùng gặp nhau trong một ngày tháng mười hai thật đẹp</p>
              </div>
            </SectionReveal>

            <SectionReveal className="ml-timeline" aria-labelledby="timeline-title">
              <header><span className="ml-eyebrow">Lịch trình ngày vui</span><h2 id="timeline-title">Một ngày, những khoảnh khắc đáng nhớ</h2></header>
              <ol>
                {timeline.map(({ timeKey, title, detail, Icon }, index) => {
                  const time = timeKey === 'ceremony' ? content.ceremonyTime : timeKey === 'reception' ? content.receptionTime : '10:00'
                  return <motion.li key={title} initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ delay: index * 0.12 }}><time>{time}</time><div className="ml-timeline-mark"><Icon weight={index === 1 ? 'fill' : 'regular'} /></div><div><span>0{index + 1}</span><strong>{title}</strong><p>{detail}</p></div></motion.li>
                })}
              </ol>
            </SectionReveal>

            <SectionReveal className="ml-map" aria-labelledby="map-title">
              <div className="ml-map-copy">
                <MapPin weight="fill" />
                <span className="ml-eyebrow">Địa điểm hôn lễ</span>
                <h2 id="map-title">{content.venueName}</h2>
                <p>{content.venueAddress}</p>
                <div><a href={content.mapUrl}><NavigationArrow /> Google Maps</a><a href={content.calendarUrl} target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch</a></div>
              </div>
              <div className="ml-map-frame"><iframe title={`Bản đồ ${content.venueName}`} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
            </SectionReveal>

            <SectionReveal className="ml-gallery" aria-labelledby="gallery-title">
              <span className="ml-eyebrow">Our moments · Photo atelier</span>
              <h2 id="gallery-title">Những khoảnh khắc của chúng mình</h2>
              <div className="ml-gallery-deck" onMouseEnter={() => setGalleryPaused(true)} onMouseLeave={() => setGalleryPaused(false)} onFocus={() => setGalleryPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setGalleryPaused(false) }}>
                {gallery.map((image, index) => {
                  const previous = (activeImage - 1 + gallery.length) % gallery.length
                  const next = (activeImage + 1) % gallery.length
                  const position = index === activeImage ? 0 : index === previous ? -1 : index === next ? 1 : 2
                  return <motion.figure key={`${image}-${index}`} className={position === 0 ? 'is-active' : ''} aria-hidden={position === 2} animate={{ x: position === -1 ? '-44%' : position === 1 ? '44%' : position === 2 ? '0%' : '0%', y: position === 0 ? 0 : 24, rotate: position === -1 ? -8 : position === 1 ? 8 : 0, scale: position === 0 ? 1 : position === 2 ? 0.7 : 0.84, opacity: position === 2 ? 0 : 1, zIndex: position === 0 ? 3 : 1 }} transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}><img src={image} alt={`Khoảnh khắc của cặp đôi ${index + 1}`} loading={index ? 'lazy' : undefined} /><figcaption><span>0{index + 1}</span><p>Élan d’Amour</p></figcaption></motion.figure>
                })}
                <button type="button" className="is-prev" onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)} aria-label="Ảnh trước"><CaretLeft /></button>
                <button type="button" className="is-next" onClick={() => setActiveImage((activeImage + 1) % gallery.length)} aria-label="Ảnh tiếp theo"><CaretRight /></button>
              </div>
              <div className="ml-gallery-dots" role="group" aria-label="Chọn ảnh">{gallery.map((_, index) => <button key={index} type="button" className={index === activeImage ? 'is-active' : ''} onClick={() => setActiveImage(index)} aria-label={`Xem ảnh ${index + 1}`} aria-pressed={index === activeImage} />)}</div>
            </SectionReveal>

            <SectionReveal className="ml-rsvp">
              <div className="ml-rsvp-frame" aria-hidden="true" />
              <span className="ml-eyebrow">Phản hồi trước {content.rsvpDeadline}</span>
              <Sparkle weight="fill" />
              <h2>Hẹn gặp bạn trong ngày thật đẹp này?</h2>
              <p>{content.rsvpMessage}</p>
              <div className="ml-rsvp-actions"><button type="button" className={rsvp === 'attending' ? 'is-selected' : ''} onClick={() => setRsvp('attending')}>Mình sẽ tham dự</button><button type="button" className={rsvp === 'declined' ? 'is-selected' : ''} onClick={() => setRsvp('declined')}>Mình chưa thể tham dự</button></div>
              <AnimatePresence mode="wait">{rsvp ? <motion.div key={rsvp} className="ml-rsvp-status" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Check weight="bold" />{rsvp === 'attending' ? 'Thật vui vì sẽ được gặp bạn trong ngày đặc biệt.' : 'Cảm ơn bạn đã phản hồi và luôn dành tình cảm cho chúng mình.'}</motion.div> : null}</AnimatePresence>
            </SectionReveal>

            <SectionReveal className="ml-guestbook" aria-labelledby="guestbook-title">
              <header><span className="ml-eyebrow">Sổ lưu bút</span><h2 id="guestbook-title">Gửi một lời chúc đến chúng mình</h2></header>
              <div className="ml-wish-form"><label htmlFor="invitation-wish-name">Tên của bạn</label><input id="invitation-wish-name" value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Nhập tên khách mời" /><label htmlFor="invitation-wish">Lời chúc của bạn</label><textarea id="invitation-wish" value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Viết một lời chúc thật đẹp..." /><button type="button" onClick={submitWish} disabled={!wish.trim() || !wishName.trim()}>Gửi lời chúc <Heart weight="fill" /></button></div>
              <div className="ml-wish-list" aria-live="polite">{wishes.map((item, index) => <motion.article key={`${item.name}-${index}`} initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: index % 2 ? 1 : -1 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }}><Heart weight="fill" /><p>{item.message}</p><strong>{item.name}</strong></motion.article>)}</div>
            </SectionReveal>

            <SectionReveal className="ml-gift-note">
              <Gift weight="thin" />
              <span className="ml-eyebrow">Quà mừng</span>
              <p>{content.giftMessage}</p>
              <button type="button" onClick={() => setGiftOpen((current) => !current)} aria-expanded={giftOpen}>{giftOpen ? 'Khép lại' : 'Xem thông tin mừng cưới'}</button>
              <AnimatePresence>{giftOpen ? <motion.div className="ml-gift-disclosure" initial={{ opacity: 0, scaleY: 0.85 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.85 }}><Sparkle weight="fill" /><span>Thông tin chuyển khoản chỉ hiển thị khi chủ thiệp chủ động bật.</span></motion.div> : null}</AnimatePresence>
            </SectionReveal>

            <motion.footer className="ml-footer" initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="ml-footer-photo" aria-hidden="true" />
              <span>With love</span><strong>{content.brideName} <i>&amp;</i> {content.groomName}</strong><p>Cảm ơn bạn đã mở lời mời và dành thời gian trở thành một phần trong ngày vui của chúng mình.</p><small>{content.weddingDate}</small>
            </motion.footer>
          </main>
        ) : null}
      </div>
    </MotionConfig>
  )
}
