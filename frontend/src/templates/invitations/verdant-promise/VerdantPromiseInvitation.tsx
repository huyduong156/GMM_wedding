import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Clock,
  Gift,
  Heart,
  Leaf,
  MapPin,
  NavigationArrow,
  Sparkle,
} from '@phosphor-icons/react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { formatCountdownUnit, useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import './verdant-promise.css'

const VerdantParticles = lazy(async () => {
  const module = await import('./VerdantParticles')
  return { default: module.VerdantParticles }
})

const gallery = [
  '/assets/images/templates/modern-luxe/couple-portrait.jpg',
  '/assets/images/templates/verdant-promise/greenhouse-background.png',
  '/assets/images/templates/modern-luxe/wedding-detail.jpg',
]

const families = [
  {
    side: 'Nhà gái',
    father: 'Nguyễn Văn Lâm',
    mother: 'Trần Thu Hương',
    role: 'Trưởng nữ',
    child: 'Nguyễn An Nhiên',
    home: '18 Phan Đình Phùng, Ba Đình, Hà Nội',
    origin: 'Quê quán · Nam Định',
  },
  {
    side: 'Nhà trai',
    father: 'Phạm Văn Thành',
    mother: 'Lê Ngọc Mai',
    role: 'Trưởng nam',
    child: 'Phạm Minh Khang',
    home: '86 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    origin: 'Quê quán · Hải Dương',
  },
]

const timeline = [
  { time: '10:30', title: 'Đón khách', detail: 'Chụp ảnh và lưu lại những lời chúc đầu tiên.', Icon: Clock },
  { time: '11:00', title: 'Lễ thành hôn', detail: 'Chứng kiến lời hẹn trăm năm trước hai gia đình.', Icon: Heart },
  { time: '11:30', title: 'Tiệc chung vui', detail: 'Khai tiệc trong không gian nhà kính ngập nắng.', Icon: Gift },
]

const edgePetals = Array.from({ length: 8 }, (_, index) => index + 1)

function EdgeAtmosphere() {
  return (
    <div className="vp-edge-atmosphere" aria-hidden="true">
      <div className="vp-edge-rail vp-edge-rail-left">
        <img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" />
      </div>
      <div className="vp-edge-rail vp-edge-rail-right">
        <img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" />
      </div>
      <div className="vp-edge-petals">
        {edgePetals.map((petal) => <i key={petal} className={`vp-edge-petal vp-edge-petal-${petal}`} />)}
      </div>
    </div>
  )
}

function SectionReveal({ children, className }: { children: ReactNode; className: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 72 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.12, once: true }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

export function VerdantPromiseInvitation({ preview = false }: { preview?: boolean }) {
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const [slide, setSlide] = useState(0)
  const [galleryPaused, setGalleryPaused] = useState(false)
  const [rsvp, setRsvp] = useState<'attending' | 'declined' | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState([
    { name: 'Gia đình bác Hùng', message: 'Chúc hai con trăm năm hạnh phúc, mãi bình an bên nhau.' },
    { name: 'Thanh An', message: 'Ngày vui thật trọn vẹn và hành trình phía trước luôn ngập tiếng cười nhé!' },
  ])
  const mainRef = useRef<HTMLElement>(null)
  const openingTimerRef = useRef<number | undefined>(undefined)
  const focusFrameRef = useRef<number | undefined>(undefined)
  const reduceMotion = useReducedMotion()
  const weddingCountdown = useWeddingCountdown('2026-10-18T10:30:00+07:00')
  const { scrollY } = useScroll()
  const heroImageY = useTransform(scrollY, [0, 720], ['0%', '18%'])
  const heroContentY = useTransform(scrollY, [0, 720], ['0%', '34%'])
  const heroContentOpacity = useTransform(scrollY, [0, 560], [1, 0])

  useEffect(() => {
    if (!opened || reduceMotion || typeof window.matchMedia !== 'function' || !window.matchMedia('(pointer: fine) and (min-width: 701px)').matches) return

    let active = true
    let smoothScroll: { destroy: () => void } | undefined

    void import('lenis').then(({ default: Lenis }) => {
      if (!active) return
      smoothScroll = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.85 })
    })

    return () => {
      active = false
      smoothScroll?.destroy()
    }
  }, [opened, reduceMotion])

  useEffect(() => {
    if (!opened || galleryPaused || reduceMotion) return
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % gallery.length), 5200)
    return () => window.clearInterval(timer)
  }, [galleryPaused, opened, reduceMotion])

  useEffect(() => {
    const onVisibilityChange = () => setGalleryPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => () => {
    if (openingTimerRef.current !== undefined) window.clearTimeout(openingTimerRef.current)
    if (focusFrameRef.current !== undefined) window.cancelAnimationFrame(focusFrameRef.current)
  }, [])

  const openInvitation = () => {
    if (opening || opened) return
    setOpening(true)
    setOpened(true)
    openingTimerRef.current = window.setTimeout(() => setOpening(false), reduceMotion ? 80 : 680)
    focusFrameRef.current = window.requestAnimationFrame(() => mainRef.current?.focus())
  }

  const sendWish = () => {
    if (!wishName.trim() || !wish.trim()) return
    setWishes((current) => [{ name: wishName.trim(), message: wish.trim() }, ...current])
    setWishName('')
    setWish('')
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className={`vp-wrap ${opened ? 'is-opened' : ''}`}>
      <AnimatePresence>
        {!opened || opening ? (
          <motion.section
            className="vp-opening"
            aria-label="Mở thiệp Verdant Promise"
            aria-hidden={opened}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.38 }}
          >
            <div className="vp-opening-photo" aria-hidden="true" />
            <div className="vp-opening-mist" aria-hidden="true" />
            {!reduceMotion ? (
              <Suspense fallback={null}>
                <VerdantParticles id="vp-opening-particles" dense />
              </Suspense>
            ) : null}
            <div className="vp-opening-orbit vp-opening-orbit-a" aria-hidden="true" />
            <div className="vp-opening-orbit vp-opening-orbit-b" aria-hidden="true" />
            <motion.div
              className="vp-opening-aperture"
              aria-hidden="true"
              animate={opening && !reduceMotion ? { opacity: 0, scale: 8 } : { opacity: 0.72, scale: 1 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.button
              className={`vp-cover ${opening ? 'is-opening' : ''}`}
              type="button"
              onClick={openInvitation}
              disabled={opening}
              aria-label="Mở thiệp cưới của An Nhiên và Minh Khang"
              initial={reduceMotion ? false : { opacity: 0, rotateX: 8, y: 34 }}
              animate={opening && !reduceMotion
                ? { opacity: 0, rotateY: -16, scale: 0.9, y: -24 }
                : { opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0 }}
              transition={{ duration: opening ? 0.82 : 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { rotateX: 2, rotateY: -2, y: -9 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            >
              <img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" />
              <span className="vp-cover-kicker">Wedding invitation</span>
              <span className="vp-cover-monogram" aria-hidden="true">A · K</span>
              <h1>An Nhiên <i>&amp;</i> Minh Khang</h1>
              <time dateTime="2026-10-18">18 · 10 · 2026</time>
              <strong><Leaf weight="fill" /> {opening ? 'Khu vườn đang mở' : 'Chạm để mở thiệp'}</strong>
            </motion.button>
            <p className="vp-opening-note">Một lời mời được ươm bằng yêu thương</p>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {opened ? (
        <main ref={mainRef} className="vp-invitation" tabIndex={-1}>
          <EdgeAtmosphere />
          {preview ? <div className="vp-preview-note">Bản xem trước · Dữ liệu mẫu</div> : null}
          <section className="vp-hero">
            <motion.div className="vp-hero-photo" style={reduceMotion ? undefined : { y: heroImageY }} aria-hidden="true" />
            <div className="vp-hero-vignette" aria-hidden="true" />
            <motion.div
              className="vp-hero-aperture"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.45 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            {!reduceMotion ? (
              <Suspense fallback={null}>
                <VerdantParticles id="vp-hero-particles" />
              </Suspense>
            ) : null}
            <motion.div
              className="vp-hero-content"
              style={reduceMotion ? undefined : { y: heroContentY, opacity: heroContentOpacity }}
              initial={reduceMotion ? false : { opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="vp-eyebrow vp-eyebrow-light">Trân trọng báo tin lễ thành hôn</span>
              <p className="vp-hero-script">Our verdant promise</p>
              <h1>
                <span className="vp-name-mask"><motion.span initial={reduceMotion ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>An Nhiên</motion.span></span>
                <motion.i initial={reduceMotion ? false : { opacity: 0, rotate: -18, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.62, duration: 0.72 }}>&amp;</motion.i>
                <span className="vp-name-mask"><motion.span initial={reduceMotion ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.38, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>Minh Khang</motion.span></span>
              </h1>
              <div className="vp-hero-date"><span>Chủ nhật</span><time dateTime="2026-10-18">18 · 10 · 2026</time><span>Hà Nội</span></div>
              <p className="vp-hero-copy">Thân mời bạn bước vào khu vườn của chúng mình, cùng chứng kiến khoảnh khắc hai hành trình nở thành một lời hẹn trăm năm.</p>
            </motion.div>
            <div className="vp-scroll-cue" aria-hidden="true"><span>Cuộn để bước vào vườn</span><i /></div>
          </section>

          <SectionReveal className="vp-families">
            <div className="vp-botanical-shadow vp-botanical-shadow-left" aria-hidden="true" />
            <div className="vp-botanical-shadow vp-botanical-shadow-right" aria-hidden="true" />
            <header className="vp-section-heading">
              <span className="vp-eyebrow">Song hỷ lâm môn</span>
              <h2>Hai gia đình trân trọng báo tin</h2>
              <p>Lễ thành hôn của các con chúng tôi</p>
            </header>
            <div className="vp-family-grid">
              {families.map((family, index) => (
                <motion.article
                  key={family.side}
                  initial={reduceMotion ? false : { opacity: 0, x: index === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.35, once: true }}
                  transition={{ delay: index * 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="vp-family-side">{family.side}</span>
                  <div className="vp-family-parents">
                    <div className="vp-family-person"><small>Ông</small><strong>{family.father}</strong></div>
                    <span>&amp;</span>
                    <div className="vp-family-person"><small>Bà</small><strong>{family.mother}</strong></div>
                  </div>
                  <div className="vp-family-rule" aria-hidden="true"><i /><Leaf weight="fill" /><i /></div>
                  <small>{family.role}</small>
                  <h3>{family.child}</h3>
                  <address>{family.home}</address>
                  <p>{family.origin}</p>
                </motion.article>
              ))}
              <div className="vp-family-seal" aria-hidden="true"><span>A</span><i>&amp;</i><span>K</span></div>
            </div>
            <p className="vp-family-invitation">Kính mời <strong>Quý khách</strong> đến dự bữa tiệc thân mật, chung vui cùng gia đình chúng tôi.</p>
          </SectionReveal>

          <SectionReveal className="vp-date">
            <div className="vp-date-card">
              <div className="vp-date-calendar">
                <span>Chủ nhật</span>
                <strong>18</strong>
                <span>Tháng 10 · 2026</span>
              </div>
              <div className="vp-ceremony-copy">
                <span className="vp-eyebrow">Hôn lễ &amp; tiệc cưới</span>
                <h2>Một ngày thu dành cho lời hẹn trăm năm</h2>
                <dl>
                  <div><dt>Đón khách</dt><dd>10:30</dd></div>
                  <div><dt>Cử hành hôn lễ</dt><dd>11:00</dd></div>
                  <div><dt>Khai tiệc</dt><dd>11:30</dd></div>
                </dl>
                <p>Nhằm ngày 08 tháng 09 năm Bính Ngọ</p>
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Le%20thanh%20hon%20An%20Nhien%20va%20Minh%20Khang" target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch</a>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="vp-countdown">
            <div className="vp-countdown-orbit" aria-hidden="true" />
            <span>Chỉ còn</span>
            <div className="vp-countdown-units" role="timer" aria-live="off" aria-label={`${weddingCountdown.days} ngày ${weddingCountdown.hours} giờ ${weddingCountdown.minutes} phút ${weddingCountdown.seconds} giây`}><div><strong>{weddingCountdown.days}</strong><small>Ngày</small></div><div><strong>{formatCountdownUnit(weddingCountdown.hours)}</strong><small>Giờ</small></div><div><strong>{formatCountdownUnit(weddingCountdown.minutes)}</strong><small>Phút</small></div><div><strong>{formatCountdownUnit(weddingCountdown.seconds)}</strong><small>Giây</small></div></div>
            <p>để cùng gặp nhau trong khu vườn ngập nắng</p>
          </SectionReveal>

          <SectionReveal className="vp-timeline">
            <header className="vp-section-heading vp-section-heading-left">
              <span className="vp-eyebrow">Lịch trình</span>
              <h2>Những khoảnh khắc trong ngày vui</h2>
            </header>
            <ol>
              {timeline.map(({ time, title, detail, Icon }, index) => (
                <motion.li
                  key={time}
                  initial={reduceMotion ? false : { opacity: 0, x: -34 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.45, once: true }}
                  transition={{ delay: index * 0.12, duration: 0.62 }}
                >
                  <time>{time}</time>
                  <div className="vp-timeline-icon"><Icon weight={index === 1 ? 'fill' : 'regular'} /></div>
                  <div><strong>{title}</strong><p>{detail}</p></div>
                </motion.li>
              ))}
            </ol>
          </SectionReveal>

          <SectionReveal className="vp-map">
            <div className="vp-map-copy">
              <MapPin weight="fill" />
              <span className="vp-eyebrow">Địa điểm</span>
              <h2>Glass Garden Ballroom</h2>
              <p>25 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội</p>
              <small>Sảnh kính tầng 2 · Trang phục: thanh lịch, tông màu tự nhiên</small>
              <a href="https://maps.google.com/?q=25+Trang+Tien+Ha+Noi" target="_blank" rel="noreferrer"><NavigationArrow /> Xem đường đi</a>
            </div>
            <div className="vp-map-frame">
              <iframe title="Bản đồ Glass Garden Ballroom" src="https://www.google.com/maps?q=25%20Trang%20Tien%20Ha%20Noi&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </SectionReveal>

          <SectionReveal className="vp-gallery">
            <span className="vp-eyebrow">Our moments</span>
            <h2>Chuyện của chúng mình, qua những khung hình</h2>
            <div
              className="vp-slider"
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
              onFocus={() => setGalleryPaused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setGalleryPaused(false)
              }}
            >
              {gallery.map((src, index) => (
                <motion.img
                  key={src}
                  className={index === slide ? 'is-active' : ''}
                  src={src}
                  alt={`Khoảnh khắc của cặp đôi ${index + 1}`}
                  animate={index === slide ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
                  transition={{ opacity: { duration: 0.9 }, scale: { duration: reduceMotion ? 0 : 5.4 } }}
                />
              ))}
              <div className="vp-gallery-matte" aria-hidden="true">
                <img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" />
                <img src="/assets/images/templates/verdant-promise/botanical-frame.png" alt="" />
              </div>
              <div className="vp-gallery-caption"><span>0{slide + 1}</span><p>Grow wild, love deeply.</p></div>
              <button type="button" className="is-prev" onClick={() => setSlide((slide - 1 + gallery.length) % gallery.length)} aria-label="Ảnh trước"><CaretLeft /></button>
              <button type="button" className="is-next" onClick={() => setSlide((slide + 1) % gallery.length)} aria-label="Ảnh tiếp theo"><CaretRight /></button>
            </div>
            <div className="vp-dots" aria-label="Chọn ảnh trong album">
              {gallery.map((_, index) => <button key={index} type="button" className={index === slide ? 'is-active' : ''} onClick={() => setSlide(index)} aria-label={`Xem ảnh ${index + 1}`} />)}
            </div>
          </SectionReveal>

          <SectionReveal className="vp-rsvp">
            <div className="vp-rsvp-glow" aria-hidden="true" />
            <span className="vp-eyebrow vp-eyebrow-light">RSVP · Trước 10.10.2026</span>
            <Sparkle weight="fill" />
            <h2>Bạn sẽ đến chung vui cùng chúng mình chứ?</h2>
            <p>Sự hiện diện của bạn sẽ làm khu vườn ngày ấy thêm trọn vẹn.</p>
            <div className="vp-rsvp-actions">
              <button type="button" className={rsvp === 'attending' ? 'is-selected' : ''} onClick={() => setRsvp('attending')}>Mình sẽ tham dự</button>
              <button type="button" className={rsvp === 'declined' ? 'is-selected' : ''} onClick={() => setRsvp('declined')}>Mình chưa thể tham dự</button>
            </div>
            <AnimatePresence>
              {rsvp === 'attending' && !reduceMotion ? (
                <motion.div className="vp-rsvp-bloom" aria-hidden="true" initial={{ opacity: 0, scale: 0.72 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.72 }}>
                  {Array.from({ length: 6 }, (_, index) => <Leaf key={index} weight="fill" />)}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {rsvp ? (
                <motion.p key={rsvp} className="vp-rsvp-feedback" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {rsvp === 'attending' ? 'Thật vui vì sẽ được gặp bạn trong ngày đặc biệt này.' : 'Cảm ơn bạn đã phản hồi. Chúng mình vẫn luôn trân quý lời chúc của bạn.'}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </SectionReveal>

          <SectionReveal className="vp-guestbook">
            <header className="vp-section-heading">
              <span className="vp-eyebrow">Sổ lưu bút</span>
              <h2>Gửi một lời chúc thật xanh</h2>
            </header>
            <div className="vp-wish-form">
              <label><span>Tên của bạn</span><input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Ví dụ: Thanh An" /></label>
              <label><span>Lời chúc</span><textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Viết điều bạn muốn gửi đến cô dâu chú rể..." /></label>
              <button type="button" onClick={sendWish} disabled={!wishName.trim() || !wish.trim()}>Gửi lời chúc <Heart weight="fill" /></button>
            </div>
            <div className="vp-wishes" aria-live="polite">
              {wishes.map((item, index) => (
                <motion.article key={`${item.name}-${index}`} initial={reduceMotion ? false : { opacity: 0, rotate: index % 2 ? 1.5 : -1.5, y: 16 }} whileInView={{ opacity: 1, rotate: 0, y: 0 }} viewport={{ once: true }}>
                  <Heart weight="fill" /><p>{item.message}</p><strong>{item.name}</strong>
                </motion.article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="vp-gift">
            <Gift weight="fill" />
            <span className="vp-eyebrow">Quà mừng</span>
            <p>Sự hiện diện và lời chúc của bạn đã là món quà quý giá nhất.</p>
            <button type="button" onClick={() => setGiftOpen((current) => !current)} aria-expanded={giftOpen}>{giftOpen ? 'Khép lại' : 'Xem lời nhắn mừng cưới'}</button>
            <AnimatePresence>
              {giftOpen ? (
                <motion.div className="vp-gift-note" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Leaf weight="fill" />
                  <p>Nếu muốn gửi một món quà nhỏ, bạn có thể trao trực tiếp trong ngày vui. Thông tin chuyển khoản chỉ hiển thị khi chủ thiệp chủ động bật.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </SectionReveal>

          <motion.footer className="vp-footer" initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <div className="vp-footer-photo" aria-hidden="true" />
            <span>With love</span>
            <strong>An Nhiên &amp; Minh Khang</strong>
            <p>Cảm ơn bạn đã dành thời gian bước vào khu vườn và trở thành một phần trong ngày thật đẹp của chúng mình.</p>
            <small>18 · 10 · 2026</small>
          </motion.footer>
        </main>
      ) : null}
    </div>
    </MotionConfig>
  )
}
