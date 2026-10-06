import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'
import '@fontsource/allura/400.css'
import {
  ArrowUpRight,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Check,
  MapPin,
  MusicNotes,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothTemplateScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { sunlitSilkFixture, sunlitSilkSectionConfig } from './fixture'
import type {
  SunlitSilkData,
  SunlitSilkFamilySide,
  SunlitSilkMedia,
  SunlitSilkSectionConfig,
  SunlitSilkSectionKey,
} from './SunlitSilkTypes'
import './sunlit-silk.css'
import './sunlit-silk-opening.css'

export type { SunlitSilkData, SunlitSilkSectionConfig, SunlitSilkSectionKey }

const artwork = {
  ribbon: '/assets/images/templates/sunlit-silk/artwork/ss-ribbon-clasp-v2-optimized.png',
  floralCluster:
    '/assets/images/templates/sunlit-silk/artwork/ss-modern-floral-cluster-v1-optimized.png',
  floralSculpture:
    '/assets/images/templates/sunlit-silk/artwork/ss-modern-floral-sculpture-v1-optimized.png',
  petals: '/assets/images/templates/sunlit-silk/artwork/ss-modern-orchid-petals-v1-optimized.png',
  envelope: '/assets/images/templates/sunlit-silk/artwork/ss-linen-envelope-v1-optimized.png',
  paperStack: '/assets/images/templates/sunlit-silk/artwork/ss-cotton-paper-stack-v1-optimized.png',
  linenFold: '/assets/images/templates/sunlit-silk/artwork/ss-linen-fold-v1-optimized.png',
  ribbonTail: '/assets/images/templates/sunlit-silk/artwork/ss-linen-ribbon-tail-v2-optimized.png',
} as const

const sunlitDust = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 84)}%`,
  top: `${4 + ((index * 61) % 92)}%`,
  size: `${index % 5 === 0 ? 4 : index % 3 === 0 ? 3 : 2}px`,
  delay: `${-((index * 1.7) % 16)}s`,
  duration: `${14 + (index % 7) * 2}s`,
  drift: `${index % 2 === 0 ? 1 : -1}`,
  variant: index % 6 === 0 ? 'is-glint' : '',
}))

const openingLightParticles = Array.from({ length: 10 }, (_, index) => index)
const openingBurstParticles = Array.from({ length: 70 }, () => {
  const angle = Math.random() * Math.PI * 2
  const radius = 92 + Math.random() * 112
  return {
    x: `${Math.round(Math.cos(angle) * radius)}px`,
    y: `${Math.round(Math.sin(angle) * radius)}px`,
    delay: `${Math.round(Math.random() * 350)}ms`,
    size: `${Math.random() > 0.8 ? 24 : Math.random() > 0.5 ? 18 : 15}px`,
  }
})

const requiredSections = new Set<SunlitSilkSectionKey>([
  'opening',
  'cover',
  'invitation',
  'families',
  'eventDetails',
  'footer',
])
const revealTransition = { duration: 0.78, ease: [0.22, 1, 0.36, 1] as const }
const mediaSource = (value: string | SunlitSilkMedia | null | undefined) =>
  typeof value === 'string' ? value : (value?.src ?? '')
const mediaAlt = (value: string | SunlitSilkMedia | null | undefined, fallback: string) =>
  typeof value === 'string' ? fallback : value?.alt || fallback
const personalize = (value: string | null | undefined, guestName?: string | null) =>
  (value ?? '').replaceAll('{guestName}', guestName?.trim() || 'Quý khách')

function mergeContent(data?: SunlitSilkData): SunlitSilkData {
  return {
    ...sunlitSilkFixture,
    ...data,
    couple: { ...sunlitSilkFixture.couple, ...data?.couple },
    event: { ...sunlitSilkFixture.event, ...data?.event },
    opening: { ...sunlitSilkFixture.opening, ...data?.opening },
    cover: { ...sunlitSilkFixture.cover, ...data?.cover },
    invitation: { ...sunlitSilkFixture.invitation, ...data?.invitation },
    families: { ...sunlitSilkFixture.families, ...data?.families },
    eventDetails: { ...sunlitSilkFixture.eventDetails, ...data?.eventDetails },
    calendar: { ...sunlitSilkFixture.calendar, ...data?.calendar },
    timeline: { ...sunlitSilkFixture.timeline, ...data?.timeline },
    venue: { ...sunlitSilkFixture.venue, ...data?.venue },
    activities: { ...sunlitSilkFixture.activities, ...data?.activities },
    gallery: { ...sunlitSilkFixture.gallery, ...data?.gallery },
    rsvp: { ...sunlitSilkFixture.rsvp, ...data?.rsvp },
    guestbook: { ...sunlitSilkFixture.guestbook, ...data?.guestbook },
    gift: { ...sunlitSilkFixture.gift, ...data?.gift },
    music: { ...sunlitSilkFixture.music, ...data?.music },
    footer: { ...sunlitSilkFixture.footer, ...data?.footer },
  }
}

function getTargetTime(dateValue = '', timeValue = '') {
  const date = dateValue.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/)
  if (!date) return null
  const [hours = '0', minutes = '0'] = timeValue.split(':')
  return new Date(
    Number(date[3]),
    Number(date[2]) - 1,
    Number(date[1]),
    Number(hours),
    Number(minutes),
  ).getTime()
}

function getCountdown(target: number | null) {
  const remaining = target ? Math.max(0, target - Date.now()) : 0
  return [
    Math.floor(remaining / 86_400_000),
    Math.floor(remaining / 3_600_000) % 24,
    Math.floor(remaining / 60_000) % 60,
    Math.floor(remaining / 1_000) % 60,
  ]
}

function DecorImage({
  src,
  className,
  width,
  height,
  eager = false,
}: {
  src: string
  className: string
  width: number
  height: number
  eager?: boolean
}) {
  return (
    <img
      className={`ss-decor ${className}`}
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        event.currentTarget.hidden = true
      }}
    />
  )
}

function SunlitDust() {
  return (
    <div className="ss-sunlit-dust" aria-hidden="true">
      {sunlitDust.map((particle) => (
        <span
          className={`ss-sunlit-dust__particle ${particle.variant}`}
          key={particle.id}
          style={
            {
              '--dust-left': particle.left,
              '--dust-top': particle.top,
              '--dust-size': particle.size,
              '--dust-delay': particle.delay,
              '--dust-duration': particle.duration,
              '--dust-drift': particle.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function SilkSection({
  sectionKey,
  active,
  order,
  className = '',
  children,
}: {
  sectionKey: SunlitSilkSectionKey
  active: Set<SunlitSilkSectionKey>
  order: SunlitSilkSectionKey[]
  className?: string
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()
  if (!active.has(sectionKey)) return null
  return (
    <motion.section
      className={`ss-section ss-section--${sectionKey} ${className}`}
      data-editor-section={sectionKey}
      aria-labelledby={`ss-${sectionKey}-title`}
      tabIndex={-1}
      style={{ order: order.indexOf(sectionKey) } as CSSProperties}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={reduceMotion ? { duration: 0 } : revealTransition}
    >
      {children}
    </motion.section>
  )
}

function SectionHeading({
  id,
  kicker,
  children,
}: {
  id: string
  kicker?: string
  children: ReactNode
}) {
  return (
    <header className="ss-section-heading">
      {kicker ? <span>{kicker}</span> : null}
      <h2 id={id}>{children}</h2>
    </header>
  )
}

function FamilyCard({ side }: { side?: SunlitSilkFamilySide }) {
  return (
    <article className="ss-family-card">
      <span>{side?.label}</span>
      <div>
        <small>{side?.fatherTitle}</small>
        <strong>{side?.father}</strong>
      </div>
      <div>
        <small>{side?.motherTitle}</small>
        <strong>{side?.mother}</strong>
      </div>
      <p>{side?.address}</p>
    </article>
  )
}

export function SunlitSilkRenderer({
  data,
  sectionConfig,
  editorMode = false,
  guestName,
  interactions,
}: {
  data?: SunlitSilkData
  sectionConfig?: SunlitSilkSectionConfig
  editorMode?: boolean
  guestName?: string | null
  interactions?: PublicInteractions
}) {
  const content = useMemo(() => mergeContent(data), [data])
  const reduceMotion = useReducedMotion()
  const [opened, setOpened] = useState(editorMode)
  const [openingCelebration, setOpeningCelebration] = useState(false)
  const [openingComplete, setOpeningComplete] = useState(editorMode)
  const [pageHidden, setPageHidden] = useState(false)
  const [, setClockTick] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [attendance, setAttendance] = useState<'ATTENDING' | 'DECLINED' | null>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpError, setRsvpError] = useState('')
  const [rsvpDone, setRsvpDone] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wish, setWish] = useState('')
  const [wishError, setWishError] = useState('')
  const [wishDone, setWishDone] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const coverRef = useRef<HTMLElement>(null)

  useSmoothTemplateScroll(openingComplete)
  useEffect(() => {
    const interval = window.setInterval(() => setClockTick((tick) => tick + 1), 1_000)
    return () => window.clearInterval(interval)
  }, [])
  useEffect(() => {
    const sync = () => setPageHidden(document.visibilityState === 'hidden')
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])
  useEffect(() => {
    if (!openingCelebration || opened) return
    if (reduceMotion) {
      setOpened(true)
      return
    }
    const timeout = window.setTimeout(() => setOpened(true), 300)
    return () => window.clearTimeout(timeout)
  }, [opened, openingCelebration, reduceMotion])
  useEffect(() => {
    if (!opened || openingComplete) return
    if (reduceMotion) {
      setOpeningComplete(true)
      return
    }
    const timeout = window.setTimeout(() => setOpeningComplete(true), 1_500)
    return () => window.clearTimeout(timeout)
  }, [opened, openingComplete, reduceMotion])

  const handleOpeningClick = () => {
    if (opened || openingCelebration) return
    setOpeningCelebration(true)
  }
  useEffect(() => {
    const lockClass = 'ss-opening-lock'
    document.documentElement.classList.toggle(lockClass, !openingComplete)
    document.body.classList.toggle(lockClass, !openingComplete)
    return () => {
      document.documentElement.classList.remove(lockClass)
      document.body.classList.remove(lockClass)
    }
  }, [openingComplete])
  useEffect(() => {
    if (openingComplete && !editorMode) coverRef.current?.focus()
  }, [editorMode, openingComplete])

  const active = new Set(sectionConfig?.enabled ?? sunlitSilkSectionConfig.enabled)
  requiredSections.forEach((key) => active.add(key))
  const requestedOrder = sectionConfig?.order?.length
    ? sectionConfig.order
    : sunlitSilkSectionConfig.order
  const order = [
    ...requestedOrder,
    ...sunlitSilkSectionConfig.order.filter((key) => !requestedOrder.includes(key)),
  ].filter((key) => active.has(key))
  const connectedGuestName = interactions?.guestName?.trim() || guestName?.trim() || ''
  const guest = connectedGuestName || null
  const showGuestNameInput = !interactions?.isPersonalized && !connectedGuestName
  const countdown = getCountdown(getTargetTime(content.event?.weddingDate, content.event?.time))
  const galleryImages = (content.galleryImages ?? [])
    .map((item) => ({
      src: mediaSource(item),
      alt: mediaAlt(item, 'Khoảnh khắc của cô dâu và chú rể'),
    }))
    .filter((item) => item.src)
    .slice(0, 8)
  const timelineItems = (content.timeline?.items ?? []).filter(
    (item) => item.time?.trim() && item.title?.trim(),
  )
  const activities = (content.activities?.items ?? [])
    .filter((item) => item.title?.trim())
    .slice(0, 6)
  const calendarDays = Array.from({ length: 35 }, (_, index) => (index < 4 ? null : index - 3))

  const submitRsvp = async (event: FormEvent) => {
    event.preventDefault()
    if (!attendance || interactions?.rsvp.submitting) return
    const name = connectedGuestName || rsvpName.trim()
    if (!name) {
      setRsvpError('Vui lòng nhập tên trước khi gửi phản hồi.')
      return
    }
    setRsvpError('')
    const accepted = await interactions?.rsvp.submit({
      guestName: interactions?.isPersonalized ? undefined : name,
      attendance,
      partySize: 1,
    })
    if (accepted !== false) setRsvpDone(true)
  }
  const submitWish = async (event: FormEvent) => {
    event.preventDefault()
    const name = connectedGuestName || wishName.trim()
    const message = wish.trim()
    if (!name) {
      setWishError('Vui lòng nhập tên trước khi gửi lời chúc.')
      return
    }
    if (!message) {
      setWishError('Vui lòng nhập lời chúc.')
      return
    }
    if (interactions?.wishes.submitting) return
    setWishError('')
    const accepted = await interactions?.wishes.submit({
      guestName: interactions?.isPersonalized ? undefined : name,
      content: message,
    })
    if (accepted !== false) {
      setWishDone(true)
      setWish('')
    }
  }

  return (
    <main
      className={`ss-page is-opened is-ready ${pageHidden ? 'is-page-hidden' : ''}`}
      aria-label="Bản xem trước thiệp cưới Nắng Trên Lụa"
    >
      <div
        className="ss-stage"
        data-template-shell="sunlit-silk"
        data-phase="3-rebuild"
        data-editor-section="opening"
      >
        <div className="ss-stage__light" aria-hidden="true" />
        <SunlitDust />
        <DecorImage
          src={artwork.petals}
          className="ss-atmosphere-petals"
          width={1280}
          height={547}
          eager
        />
        {!openingComplete ? (
          <div
            className={`ss-opening-v4-gate ${openingCelebration ? 'is-celebrating' : ''} ${opened ? 'is-opening' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ss-opening-title"
          >
            <div className="ss-opening-v4-paper-shell">
              <div className="ss-opening-v4-card">
              <DecorImage
                src={artwork.floralCluster}
                className="ss-opening-v4-floral"
                width={768}
                height={1152}
                eager
              />
              <div className="ss-opening-v4-copy">
                <p>Thiệp mời lễ thành hôn</p>
                <small>№ 01 · {content.event?.weddingDate}</small>
                <h1 id="ss-opening-title">
                  <span>{content.couple?.brideName}</span>
                  <span className="ss-opening-v4-ampersand">
                    {openingLightParticles.map((particle) => (
                      <i
                        key={particle}
                        aria-hidden="true"
                      >
                        ✦
                      </i>
                    ))}
                    <b>&amp;</b>
                  </span>
                  <span>{content.couple?.groomName}</span>
                </h1>
                <span>{content.opening?.message}</span>
              </div>
              <DecorImage
                src={artwork.ribbon}
                className="ss-opening-v4-ribbon"
                width={1280}
                height={547}
                eager
              />
              <button
                className="ss-opening-v4-action"
                type="button"
                aria-label="Mở thiệp"
                onClick={handleOpeningClick}
                disabled={opened || openingCelebration}
                autoFocus
              >
                {openingCelebration ? (
                  <div className="ss-opening-v4-burst" aria-hidden="true">
                    {openingBurstParticles.map((particle, index) => (
                      <i
                        key={index}
                        style={
                          {
                            '--ss-opening-burst-x': particle.x,
                            '--ss-opening-burst-y': particle.y,
                            '--ss-opening-burst-delay': particle.delay,
                            '--ss-opening-burst-size': particle.size,
                          } as CSSProperties
                        }
                      >
                        ✦
                      </i>
                    ))}
                  </div>
                ) : null}
                <span>{openingCelebration ? 'Đang mở…' : 'Mở thiệp'}</span>
              </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="ss-sections" aria-hidden={!openingComplete}>
          <motion.section
            ref={coverRef}
            className="ss-section ss-section--cover"
            data-editor-section="cover"
            tabIndex={-1}
            style={{ order: order.indexOf('cover') }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={openingComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.9, ease: revealTransition.ease }
            }
          >
            <DecorImage
              src={artwork.floralCluster}
              className="ss-cover-floral"
              width={768}
              height={1152}
              eager
            />
            <div className="ss-cover-sun" aria-hidden="true" />
            <div className="ss-cover-copy">
              <span>{content.cover?.eyebrow}</span>
              <h2 id="ss-cover-title">
                <b>{content.couple?.brideName}</b>
                <i>&amp;</i>
                <b>{content.couple?.groomName}</b>
              </h2>
              <time>{content.event?.weddingDate}</time>
              <p>{content.cover?.message}</p>
            </div>
          </motion.section>
          <SilkSection
            sectionKey="invitation"
            active={active}
            order={order}
            className="ss-letter-section"
          >
            <DecorImage
              src={artwork.ribbonTail}
              className="ss-letter-ribbon"
              width={1280}
              height={547}
            />
            <article className="ss-letter">
              <span className="ss-letter__stamp">M • H</span>
              <SectionHeading id="ss-invitation-title" kicker="Lời báo hỷ">
                {personalize(content.invitation?.title, guest)}
              </SectionHeading>
              <p>{personalize(content.invitation?.message, guest)}</p>
              <strong>
                {content.couple?.brideName} <i>&amp;</i> {content.couple?.groomName}
              </strong>
            </article>
          </SilkSection>
          <SilkSection sectionKey="families" active={active} order={order}>
            <SectionHeading id="ss-families-title">{content.families?.title}</SectionHeading>
            <div className="ss-family-diptych">
              <FamilyCard side={content.families?.brideSide} />
              <span className="ss-family-knot" aria-hidden="true">
                &amp;
              </span>
              <FamilyCard side={content.families?.groomSide} />
            </div>
            <p className="ss-family-note">{personalize(content.families?.message, guest)}</p>
          </SilkSection>
          <SilkSection
            sectionKey="eventDetails"
            active={active}
            order={order}
            className="ss-date-ledger"
          >
            <DecorImage
              src={artwork.paperStack}
              className="ss-date-paper"
              width={1280}
              height={1170}
            />
            <div className="ss-date-mark" aria-hidden="true">
              <strong>16</strong>
              <span>01 / 2027</span>
            </div>
            <div className="ss-date-copy">
              <SectionHeading id="ss-eventDetails-title" kicker="Thứ Bảy">
                {content.eventDetails?.title}
              </SectionHeading>
              <div className="ss-event-times">
                <div>
                  <time>{content.eventDetails?.ceremonyTime}</time>
                  <span>{content.eventDetails?.ceremonyLabel}</span>
                </div>
                <div>
                  <time>{content.eventDetails?.receptionTime}</time>
                  <span>{content.eventDetails?.receptionLabel}</span>
                </div>
              </div>
            </div>
          </SilkSection>
          <SilkSection
            sectionKey="countdown"
            active={active}
            order={order}
            className="ss-countdown"
          >
            <SectionHeading id="ss-countdown-title">Hẹn gặp nhau trong</SectionHeading>
            <div className="ss-countdown-grid" aria-live="off">
              {countdown.map((value, index) => (
                <div key={['Ngày', 'Giờ', 'Phút', 'Giây'][index]}>
                  <strong>{String(value).padStart(2, '0')}</strong>
                  <span>{['Ngày', 'Giờ', 'Phút', 'Giây'][index]}</span>
                </div>
              ))}
            </div>
          </SilkSection>
          <SilkSection sectionKey="calendar" active={active} order={order} className="ss-calendar">
            <div className="ss-calendar-header">
              <CalendarBlank size={26} weight="thin" />
              <SectionHeading id="ss-calendar-title">
                {content.calendar?.month} <span>{content.calendar?.year}</span>
              </SectionHeading>
            </div>
            <div className="ss-month-grid">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => (
                <span className="ss-weekday" key={label}>
                  {label}
                </span>
              ))}
              {calendarDays.map((day, index) => (
                <span
                  className={day === Number(content.calendar?.day) ? 'is-wedding-day' : ''}
                  key={`${day}-${index}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </SilkSection>
          <SilkSection
            sectionKey="timeline"
            active={active}
            order={order}
            className="ss-timeline-section"
          >
            <DecorImage
              src={artwork.floralSculpture}
              className="ss-timeline-floral"
              width={853}
              height={1280}
            />
            <SectionHeading id="ss-timeline-title">{content.timeline?.title}</SectionHeading>
            <p>{content.timeline?.message}</p>
            {timelineItems.length ? (
              <div className="ss-timeline">
                {timelineItems.map((item, index) => (
                  <article key={`${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="ss-empty-state">Chưa có lịch trình cho ngày vui.</p>
            )}
          </SilkSection>
          <SilkSection sectionKey="venue" active={active} order={order} className="ss-venue">
            <DecorImage
              src={artwork.envelope}
              className="ss-venue-envelope"
              width={1280}
              height={1170}
            />
            <div className="ss-venue-ticket">
              <MapPin size={30} weight="thin" />
              <SectionHeading id="ss-venue-title" kicker={content.venue?.title}>
                {content.venue?.name}
              </SectionHeading>
              <address>{content.venue?.address}</address>
              <p>{content.venue?.message}</p>
              {content.venue?.mapUrl ? (
                <a href={content.venue.mapUrl} target="_blank" rel="noreferrer">
                  Mở bản đồ <ArrowUpRight size={17} />
                </a>
              ) : null}
            </div>
          </SilkSection>
          <SilkSection
            sectionKey="activities"
            active={active}
            order={order}
            className="ss-activities"
          >
            <SectionHeading id="ss-activities-title">{content.activities?.title}</SectionHeading>
            {activities.length ? (
              <ol>
                {activities.map((activity, index) => (
                  <li key={`${activity.title}-${index}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{activity.title}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="ss-empty-state">Các hoạt động sẽ được cập nhật sau.</p>
            )}
          </SilkSection>
          <SilkSection sectionKey="gallery" active={active} order={order} className="ss-gallery">
            <SectionHeading id="ss-gallery-title">{content.gallery?.title}</SectionHeading>
            <p>{content.gallery?.message}</p>
            {galleryImages.length ? (
              <>
                <div className="ss-gallery-deck" aria-live="polite">
                  {galleryImages.map((image, index) => {
                    const previous =
                      (galleryIndex - 1 + galleryImages.length) % galleryImages.length
                    const next = (galleryIndex + 1) % galleryImages.length
                    const position =
                      index === galleryIndex
                        ? 'is-active'
                        : index === previous
                          ? 'is-previous'
                          : index === next
                            ? 'is-next'
                            : 'is-hidden'
                    return (
                      <figure
                        className={position}
                        key={`${image.src}-${index}`}
                        aria-hidden={position === 'is-hidden'}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          width={720}
                          height={960}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </figure>
                    )
                  })}
                  <button
                    type="button"
                    className="is-prev"
                    aria-label="Ảnh trước"
                    onClick={() =>
                      setGalleryIndex(
                        (galleryIndex - 1 + galleryImages.length) % galleryImages.length,
                      )
                    }
                  >
                    <CaretLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="is-next"
                    aria-label="Ảnh tiếp theo"
                    onClick={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)}
                  >
                    <CaretRight size={20} />
                  </button>
                </div>
                <p className="ss-gallery-index">
                  <span>{String(galleryIndex + 1).padStart(2, '0')}</span> /{' '}
                  {String(galleryImages.length).padStart(2, '0')}
                </p>
              </>
            ) : (
              <p className="ss-empty-state">Album ảnh đang chờ những khoảnh khắc đầu tiên.</p>
            )}
          </SilkSection>
          <SilkSection sectionKey="rsvp" active={active} order={order} className="ss-rsvp">
            <DecorImage
              src={artwork.ribbonTail}
              className="ss-rsvp-ribbon"
              width={1280}
              height={547}
            />
            <SectionHeading id="ss-rsvp-title" kicker="Hồi âm trước ngày lễ">
              {content.rsvp?.title}
            </SectionHeading>
            <p>{content.rsvp?.message}</p>
            {rsvpDone || interactions?.rsvp.submitted ? (
              <div className="ss-success">
                <Check size={24} />
                {content.rsvp?.successMessage}
              </div>
            ) : (
              <form onSubmit={submitRsvp} noValidate>
                {showGuestNameInput ? (
                  <label>
                    <span>Tên của bạn</span>
                    <input
                      name="rsvpName"
                      value={rsvpName}
                      onChange={(event) => setRsvpName(event.target.value)}
                      autoComplete="name"
                      placeholder="Ví dụ: Nguyễn Minh Anh…"
                    />
                  </label>
                ) : null}
                <div className="ss-choice-grid">
                  <button
                    type="button"
                    aria-pressed={attendance === 'ATTENDING'}
                    onClick={() => setAttendance('ATTENDING')}
                  >
                    {content.rsvp?.attendingLabel}
                  </button>
                  <button
                    type="button"
                    aria-pressed={attendance === 'DECLINED'}
                    onClick={() => setAttendance('DECLINED')}
                  >
                    {content.rsvp?.notAttendingLabel}
                  </button>
                </div>
                <button
                  className="ss-primary-action"
                  type="submit"
                  disabled={!attendance || interactions?.rsvp.submitting}
                >
                  {interactions?.rsvp.submitting ? 'Đang gửi…' : 'Gửi phản hồi'}
                </button>
                <small>Hạn phản hồi: {content.rsvp?.deadline}</small>
                {rsvpError || interactions?.rsvp.error ? (
                  <p className="ss-form-error" role="alert">
                    {rsvpError || interactions?.rsvp.error}
                  </p>
                ) : null}
              </form>
            )}
          </SilkSection>
          <SilkSection
            sectionKey="guestbook"
            active={active}
            order={order}
            className="ss-guestbook"
          >
            <DecorImage
              src={artwork.paperStack}
              className="ss-guestbook-paper"
              width={1280}
              height={1170}
            />
            <SectionHeading id="ss-guestbook-title">{content.guestbook?.title}</SectionHeading>
            <p>{content.guestbook?.message}</p>
            {wishDone || interactions?.wishes.submitted ? (
              <div className="ss-success">
                <Check size={24} />
                {content.guestbook?.successMessage}
              </div>
            ) : (
              <form onSubmit={submitWish} noValidate>
                {showGuestNameInput ? (
                  <label>
                    <span>Tên của bạn</span>
                    <input
                      name="wishName"
                      value={wishName}
                      onChange={(event) => setWishName(event.target.value)}
                      autoComplete="name"
                      placeholder="Ví dụ: Gia đình Minh Anh…"
                    />
                  </label>
                ) : null}
                <label>
                  <span>Lời chúc</span>
                  <textarea
                    name="wish"
                    value={wish}
                    onChange={(event) => setWish(event.target.value)}
                    placeholder="Viết đôi lời yêu thương…"
                    rows={4}
                  />
                </label>
                <button
                  className="ss-primary-action"
                  type="submit"
                  disabled={interactions?.wishes.submitting}
                >
                  <PaperPlaneTilt size={17} />
                  {interactions?.wishes.submitting ? 'Đang gửi…' : 'Gửi lời chúc'}
                </button>
                {wishError || interactions?.wishes.error ? (
                  <p className="ss-form-error" role="alert">
                    {wishError || interactions?.wishes.error}
                  </p>
                ) : null}
              </form>
            )}
          </SilkSection>
          <SilkSection sectionKey="gift" active={active} order={order} className="ss-gift">
            <SectionHeading id="ss-gift-title">{content.gift?.title}</SectionHeading>
            <p>{content.gift?.message}</p>
            <button
              type="button"
              aria-expanded={giftOpen}
              aria-controls="ss-gift-panel"
              onClick={() => setGiftOpen((open) => !open)}
            >
              {giftOpen ? 'Khép thông tin' : 'Mở thiệp mừng'}
            </button>
            <div id="ss-gift-panel" hidden={!giftOpen}>
              {mediaSource(content.giftQrMedia) ? (
                <img
                  src={mediaSource(content.giftQrMedia)}
                  alt="Mã QR mừng cưới"
                  width={240}
                  height={240}
                  loading="lazy"
                />
              ) : null}
              <p>{content.gift?.thankYouMessage}</p>
            </div>
          </SilkSection>
          <SilkSection sectionKey="music" active={active} order={order} className="ss-music">
            <MusicNotes size={24} weight="thin" />
            <div>
              <h2 id="ss-music-title">Nhạc của ngày vui</h2>
              <p>{content.music?.backgroundMusicName || 'Chưa chọn bản nhạc nền'}</p>
            </div>
            {content.music?.backgroundMusicUrl ? (
              <audio controls preload="none" src={content.music.backgroundMusicUrl} />
            ) : null}
          </SilkSection>
          <SilkSection sectionKey="footer" active={active} order={order} className="ss-footer">
            <DecorImage
              src={artwork.linenFold}
              className="ss-footer-linen"
              width={1280}
              height={853}
            />
            <DecorImage
              src={artwork.floralSculpture}
              className="ss-footer-floral"
              width={853}
              height={1280}
            />
            <span aria-hidden="true">M • H</span>
            <h2 id="ss-footer-title">{content.footer?.title}</h2>
            <p>{content.footer?.message}</p>
          </SilkSection>
        </div>
      </div>
    </main>
  )
}
