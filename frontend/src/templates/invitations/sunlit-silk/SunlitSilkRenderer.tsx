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
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothTemplateScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { MusicPlayer } from '../../../shared/ui/music-player'
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
  coverBotanical:
    '/assets/images/templates/sunlit-silk/artwork/ss-modern-botanical-white-eucalyptus-v1-generated.png',
  babysBreath:
    '/assets/images/templates/sunlit-silk/artwork/ss-modern-botanical-white-babys-breath-v1-generated.png',
  petals: '/assets/images/templates/sunlit-silk/artwork/ss-modern-orchid-petals-v1-optimized.png',
  envelope: '/assets/images/templates/sunlit-silk/artwork/ss-linen-envelope-v1-optimized.png',
  paperStack: '/assets/images/templates/sunlit-silk/artwork/ss-cotton-paper-stack-v1-optimized.png',
  paperFrame: '/assets/images/templates/sunlit-silk/artwork/ss-opening-paper-v2.png',
  linenFold: '/assets/images/templates/sunlit-silk/artwork/ss-linen-fold-v1-optimized.png',
  ribbonTail: '/assets/images/templates/sunlit-silk/artwork/ss-linen-ribbon-tail-v2-optimized.png',
} as const

const eventCardArtwork = [artwork.floralCluster, artwork.floralSculpture, artwork.coverBotanical]

const sunlitDust = Array.from({ length: 50 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 84)}%`,
  top: `${4 + ((index * 61) % 92)}%`,
  size: `${index % 5 === 0 ? 4 : index % 3 === 0 ? 3 : 2}px`,
  delay: `${-((index * 1.7) % 16)}s`,
  duration: `${14 + (index % 7) * 2}s`,
  drift: `${index % 2 === 0 ? 1 : -1}`,
  variant: index % 7 === 0 ? 'is-glint' : '',
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
const revealTransition = { duration: 1.08, ease: [0.22, 1, 0.36, 1] as const }
const elementRevealTransition = { duration: 0.92, ease: [0.22, 1, 0.36, 1] as const }
const elementReveal = (reduceMotion: boolean, delay = 0) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: reduceMotion ? { duration: 0 } : { ...elementRevealTransition, delay },
})
const mediaSource = (value: string | SunlitSilkMedia | null | undefined) =>
  typeof value === 'string' ? value : (value?.src ?? '')
const mediaAlt = (value: string | SunlitSilkMedia | null | undefined, fallback: string) =>
  typeof value === 'string' ? fallback : value?.alt || fallback
const personalize = (value: string | null | undefined, guestName?: string | null) =>
  (value ?? '').replaceAll('{guestName}', guestName?.trim() || 'Quý khách')
const lastNameInitial = (value?: string | null) => {
  const words = value?.trim().split(/\s+/).filter(Boolean) ?? []
  return words.at(-1)?.slice(0, 1).toUpperCase() || '•'
}
const firstNameInitial = (value?: string | null) => value?.trim().slice(0, 1).toUpperCase() || '•'

function mergeContent(data?: SunlitSilkData): SunlitSilkData {
  const couple = { ...sunlitSilkFixture.couple, ...data?.couple }

  return {
    ...sunlitSilkFixture,
    ...data,
    couple: {
      ...couple,
      brideMedia: couple.brideMedia || sunlitSilkFixture.couple?.brideMedia,
      groomMedia: couple.groomMedia || sunlitSilkFixture.couple?.groomMedia,
    },
    event: { ...sunlitSilkFixture.event, ...data?.event },
    opening: { ...sunlitSilkFixture.opening, ...data?.opening },
    cover: { ...sunlitSilkFixture.cover, ...data?.cover },
    invitation: { ...sunlitSilkFixture.invitation, ...data?.invitation },
    families: { ...sunlitSilkFixture.families, ...data?.families },
    eventDetails: { ...sunlitSilkFixture.eventDetails, ...data?.eventDetails },
    timeline: { ...sunlitSilkFixture.timeline, ...data?.timeline },
    venue: { ...sunlitSilkFixture.venue, ...data?.venue },
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

const vietnameseWeekdays = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const vietnameseMonths = ['Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Mười hai']

function getWeddingDateParts(value = '') {
  const match = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (!match) return { day: value || '—', month: '—', year: '—', weekday: '—', lunar: '—' }

  const day = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const year = Number(match[3])
  const date = new Date(year, monthIndex, day)
  let lunar = '—'

  try {
    lunar = new Intl.DateTimeFormat('vi-VN-u-ca-chinese', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    // Keep the fixture fallback when the browser has no Chinese calendar support.
  }

  return {
    day: String(day).padStart(2, '0'),
    month: vietnameseMonths[monthIndex] ?? String(monthIndex + 1),
    year: String(year),
    weekday: vietnameseWeekdays[date.getDay()] ?? '—',
    lunar,
  }
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
  const reduceMotion = useReducedMotion()
  return (
    <motion.header className="ss-section-heading" {...elementReveal(Boolean(reduceMotion))}>
      {kicker ? <span>{kicker}</span> : null}
      <h2 id={id}>{children}</h2>
    </motion.header>
  )
}

function FamilyCard({
  side,
  label,
  index = 0,
}: {
  side?: SunlitSilkFamilySide
  label: string
  index?: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      className="ss-family-card"
      {...elementReveal(Boolean(reduceMotion), index * 0.08)}
    >
      <span>{label}</span>
      <div>
        <small>{side?.fatherTitle}</small>
        <strong>{side?.father}</strong>
      </div>
      <div>
        <small>{side?.motherTitle}</small>
        <strong>{side?.mother}</strong>
      </div>
      <p>{side?.address}</p>
    </motion.article>
  )
}

function CountdownGrid({ target }: { target: number | null }) {
  const reduceMotion = useReducedMotion()
  const [countdown, setCountdown] = useState(() => getCountdown(target))

  useEffect(() => {
    let interval: number | undefined

    const stop = () => {
      if (interval !== undefined) window.clearInterval(interval)
      interval = undefined
    }
    const sync = () => {
      setCountdown(getCountdown(target))
      stop()
      if (!document.hidden) {
        interval = window.setInterval(() => setCountdown(getCountdown(target)), 1_000)
      }
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [target])

  return (
    <motion.div className="ss-countdown-grid" aria-live="off" {...elementReveal(Boolean(reduceMotion), 0.1)}>
      {countdown.map((value, index) => (
        <div
          className={`ss-countdown-unit ${index === 0 ? 'is-primary' : ''}`}
          key={['Ngày', 'Giờ', 'Phút', 'Giây'][index]}
        >
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{['Ngày', 'Giờ', 'Phút', 'Giây'][index]}</span>
        </div>
      ))}
    </motion.div>
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
  const coverPhraseFrom = content.cover?.phraseFrom?.trim() || 'Hai người, một lời hẹn'
  const coverPhraseTo = content.cover?.phraseTo?.trim() || 'Mình thương, mình ở lại'
  const coverPhraseLength = Math.max(coverPhraseFrom.length, coverPhraseTo.length)
  const [opened, setOpened] = useState(false)
  const [openingCelebration, setOpeningCelebration] = useState(false)
  const [openingComplete, setOpeningComplete] = useState(editorMode)
  const [editorOpeningVisible, setEditorOpeningVisible] = useState(editorMode)
  const [pageHidden, setPageHidden] = useState(false)
  const [eventIndex, setEventIndex] = useState(0)
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
    if (editorMode && openingComplete) {
      setEditorOpeningVisible(false)
      return
    }
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
  const hasGuestName = Boolean(connectedGuestName)
  const showGuestNameInput = !hasGuestName
  const weddingDateParts = getWeddingDateParts(content.event?.weddingDate)
  const galleryImages = (content.galleryImages ?? [])
    .map((item) => ({
      src: mediaSource(item),
      alt: mediaAlt(item, 'Khoảnh khắc của cô dâu và chú rể'),
    }))
    .filter((item) => item.src)
    .slice(0, 8)
  if (!galleryImages.length) active.delete('gallery')
  const eventItems = [
    ...(content.eventDetails?.items ?? []),
  ].filter((item) => item.title?.trim())
  if (!eventItems.length) active.delete('eventDetails')
  const timelineItems = (content.timeline?.items ?? []).filter(
    (item) => item.time?.trim() && item.title?.trim(),
  )
  if (!timelineItems.length) active.delete('timeline')
  const calendarDays = Array.from({ length: 35 }, (_, index) => (index < 4 ? null : index - 3))

  const submitRsvp = async (event: FormEvent) => {
    event.preventDefault()
    if (!attendance || interactions?.rsvp.submitting) return
    if (!interactions) {
      setRsvpError('Tính năng xác nhận tham dự chưa sẵn sàng.')
      return
    }
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
    if (!interactions) {
      setWishError('Tính năng gửi lời chúc chưa sẵn sàng.')
      return
    }
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
        <SunlitDust />
        <DecorImage
          src={artwork.petals}
          className="ss-atmosphere-petals"
          width={1280}
          height={547}
          eager
        />
        {!openingComplete || (editorMode && editorOpeningVisible) ? (
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
                <h2>{content.opening?.title}</h2>
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
                disabled={(!editorMode && opened) || openingCelebration}
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
            className="ss-section ss-section--portrait-cover"
            data-editor-section="cover"
            tabIndex={-1}
            style={{ order: order.indexOf('cover') }}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={openingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.78, ease: revealTransition.ease }}
          >
            <DecorImage
              src={artwork.floralSculpture}
              className="ss-portrait-cover__floral"
              width={768}
              height={1152}
              eager
            />
            <DecorImage
              src={artwork.coverBotanical}
              className="ss-portrait-cover__botanical"
              width={768}
              height={1152}
              eager
            />
             <motion.div className="ss-portrait-cover__header" {...elementReveal(Boolean(reduceMotion), 0.08)}>
              <span>{content.cover?.eyebrow}</span>
              <p className="ss-portrait-cover__phrase" aria-label={coverPhraseTo}>
                <span className="ss-portrait-cover__phrase-line" aria-hidden="true">
                  {Array.from({ length: coverPhraseLength }, (_, index) => {
                    const fromStart = Math.floor((coverPhraseLength - coverPhraseFrom.length) / 2)
                    const toStart = Math.floor((coverPhraseLength - coverPhraseTo.length) / 2)
                    const fromCharacter = coverPhraseFrom[index - fromStart] ?? ' '
                    const toCharacter = coverPhraseTo[index - toStart] ?? ' '

                    return (
                      <span
                        key={`${fromCharacter}-${toCharacter}-${index}`}
                        className="ss-portrait-cover__glyph"
                        style={{ '--ss-letter-index': index } as CSSProperties}
                      >
                        <span className="ss-portrait-cover__glyph-face ss-portrait-cover__glyph-face--from">
                          {fromCharacter === ' ' ? '\u00a0' : fromCharacter}
                        </span>
                        <span className="ss-portrait-cover__glyph-face ss-portrait-cover__glyph-face--to">
                          {toCharacter === ' ' ? '\u00a0' : toCharacter}
                        </span>
                      </span>
                    )
                  })}
                </span>
              </p>
             </motion.div>
             <motion.div className="ss-portrait-cover__portraits" {...elementReveal(Boolean(reduceMotion), 0.18)}>
               <motion.figure className="ss-portrait-cover__bride" {...elementReveal(Boolean(reduceMotion), 0.24)}>
                <div className="ss-portrait-cover__paper">
                  <div className="ss-portrait-cover__photo">
                    {mediaSource(content.couple?.brideMedia) ? (
                      <img src={mediaSource(content.couple?.brideMedia)} alt={mediaAlt(content.couple?.brideMedia, `Ảnh cô dâu ${content.couple?.brideName ?? ''}`)} loading="eager" decoding="async" />
                    ) : (
                      <span aria-hidden="true">{content.couple?.brideName?.slice(0, 1)}</span>
                    )}
                  </div>
                </div>
                <figcaption>
                  <small>Cô dâu</small>
                  <b>{content.couple?.brideName}</b>
                </figcaption>
               </motion.figure>
               <span className="ss-portrait-cover__seal" aria-hidden="true">&amp;</span>
               <motion.figure className="ss-portrait-cover__groom" {...elementReveal(Boolean(reduceMotion), 0.32)}>
                <div className="ss-portrait-cover__paper">
                  <div className="ss-portrait-cover__photo">
                    {mediaSource(content.couple?.groomMedia) ? (
                      <img src={mediaSource(content.couple?.groomMedia)} alt={mediaAlt(content.couple?.groomMedia, `Ảnh chú rể ${content.couple?.groomName ?? ''}`)} loading="eager" decoding="async" />
                    ) : (
                      <span aria-hidden="true">{content.couple?.groomName?.slice(0, 1)}</span>
                    )}
                  </div>
                </div>
                <figcaption>
                  <small>Chú rể</small>
                  <b>{content.couple?.groomName}</b>
                </figcaption>
               </motion.figure>
             </motion.div>
             <motion.div className="ss-portrait-cover__footer" {...elementReveal(Boolean(reduceMotion), 0.4)}>
              <time>{content.event?.weddingDate}</time>
              <p>{content.cover?.message}</p>
             </motion.div>
          </motion.section>
          <SilkSection
            sectionKey="invitation"
            active={active}
            order={order}
            className="ss-letter-section"
          >
            <article className="ss-letter">
              <DecorImage
                src={artwork.envelope}
                className="ss-letter__corner-paper"
                width={1280}
                height={1600}
                eager
              />
             <motion.div className="ss-letter__content" {...elementReveal(Boolean(reduceMotion), 0.08)}>
                <span className="ss-letter__stamp ss-letter__stamp--dynamic">
                  {lastNameInitial(content.couple?.brideName)} · {lastNameInitial(content.couple?.groomName)}
                </span>
                <span className="ss-letter__stamp">M • H</span>
                <SectionHeading id="ss-invitation-title" kicker="Lời báo hỷ">
                  Trân trọng kính mời {guest || 'Quý khách'}
                </SectionHeading>
                <p>{personalize(content.invitation?.message, guest)}</p>
                <strong>Trân trọng</strong>
             </motion.div>
            </article>
          </SilkSection>
          <SilkSection sectionKey="families" active={active} order={order}>
            <SectionHeading id="ss-families-title">{content.families?.title}</SectionHeading>
            <div className="ss-family-diptych">
              <FamilyCard side={content.families?.brideSide} label="Nhà gái" index={0} />
              <span className="ss-family-knot" aria-hidden="true">
                &amp;
              </span>
              <FamilyCard side={content.families?.groomSide} label="Nhà trai" index={1} />
            </div>
            <motion.p className="ss-family-note" {...elementReveal(Boolean(reduceMotion), 0.2)}>
              {personalize(content.families?.note ?? content.families?.message, guest)}
            </motion.p>
            <motion.div className="ss-family-date" {...elementReveal(Boolean(reduceMotion), 0.28)}>
              <div className="ss-family-date__row">
                <div className="ss-family-date__weekday">
                  <small>{weddingDateParts.weekday}</small>
                </div>
                <div className="ss-family-date__day">
                  <small>Ngày</small>
                  <time data-ripple-text={weddingDateParts.day}>{weddingDateParts.day}</time>
                </div>
                <div className="ss-family-date__month">
                  <small>Tháng {weddingDateParts.month}</small>
                </div>
              </div>
              <div className="ss-family-date__year">
                <strong>{weddingDateParts.year}</strong>
              </div>
              <span className="ss-family-date__lunar">(Âm lịch: {weddingDateParts.lunar})</span>
            </motion.div>
            <motion.div className="ss-family-couple" {...elementReveal(Boolean(reduceMotion), 0.36)}>
              <div>
                <small>{content.couple?.brideRole}</small>
                <strong>{content.couple?.brideName}</strong>
              </div>
              <div>
                <small>{content.couple?.groomRole}</small>
                <strong>{content.couple?.groomName}</strong>
              </div>
            </motion.div>
          </SilkSection>
          <SilkSection
            sectionKey="eventDetails"
            active={active}
            order={order}
            className="ss-date-ledger"
          >
            <DecorImage
              src={artwork.babysBreath}
              className="ss-event-floral"
              width={900}
              height={1100}
            />
             <motion.div className="ss-event-copy" {...elementReveal(Boolean(reduceMotion), 0.08)}>
              <SectionHeading id="ss-eventDetails-title" kicker="Cùng vui trong ngày cưới">
                {content.eventDetails?.title}
              </SectionHeading>
              {eventItems.length ? (
                 <motion.div className="ss-event-carousel" aria-live="polite" {...elementReveal(Boolean(reduceMotion), 0.14)}>
                  {eventItems.map((item, index) => {
                    const previous = (eventIndex - 1 + eventItems.length) % eventItems.length
                    const next = (eventIndex + 1) % eventItems.length
                    const position =
                      index === eventIndex
                        ? 'is-active'
                        : index === previous
                          ? 'is-previous'
                          : index === next
                            ? 'is-next'
                            : 'is-hidden'
                    return (
                       <motion.article
                        className={position}
                        key={`${item.title}-${index}`}
                        {...elementReveal(Boolean(reduceMotion), 0.18 + index * 0.08)}
                        style={
                          {
                            '--ss-event-card-image': `url("${mediaSource(item.image) || eventCardArtwork[index % eventCardArtwork.length]}")`,
                          } as CSSProperties
                        }
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{item.title}</strong>
                       </motion.article>
                    )
                  })}
                  {eventItems.length > 1 ? (
                    <>
                      <button
                        type="button"
                        className="is-prev"
                        aria-label="Sự kiện trước"
                        onClick={() =>
                          setEventIndex((eventIndex - 1 + eventItems.length) % eventItems.length)
                        }
                      >
                        <CaretLeft size={18} />
                      </button>
                      <button
                        type="button"
                        className="is-next"
                        aria-label="Sự kiện tiếp theo"
                        onClick={() => setEventIndex((eventIndex + 1) % eventItems.length)}
                      >
                        <CaretRight size={18} />
                      </button>
                    </>
                  ) : null}
                 </motion.div>
              ) : (
                <p className="ss-empty-state">Các sự kiện trong tiệc sẽ được cập nhật sau.</p>
              )}
             </motion.div>
          </SilkSection>
          <SilkSection
            sectionKey="countdown"
            active={active}
            order={order}
            className="ss-countdown"
          >
            <DecorImage
              src={artwork.paperStack}
              className="ss-countdown-paper"
              width={1280}
              height={1170}
            />
            <DecorImage
              src={artwork.petals}
              className="ss-countdown-petals"
              width={720}
              height={720}
            />
            <SectionHeading id="ss-countdown-title" kicker="Ngày vui đang đến gần">
              Hẹn gặp nhau trong
            </SectionHeading>
            <span className="ss-countdown-ornament" aria-hidden="true" />
            <CountdownGrid target={getTargetTime(content.event?.weddingDate, content.event?.time)} />
            <div className="ss-countdown-calendar" aria-labelledby="ss-calendar-title">
                <motion.div className="ss-calendar-header" {...elementReveal(Boolean(reduceMotion), 0.18)}>
                  <CalendarBlank size={18} weight="thin" />
                  <SectionHeading id="ss-calendar-title">
                    Tháng {weddingDateParts.month} <span>{weddingDateParts.year}</span>
                  </SectionHeading>
                </motion.div>
                <motion.div className="ss-month-grid" {...elementReveal(Boolean(reduceMotion), 0.24)}>
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => (
                    <span className="ss-weekday" key={label}>
                      {label}
                    </span>
                  ))}
                  {calendarDays.map((day, index) => (
                    <span
                      className={day === Number(weddingDateParts.day) ? 'is-wedding-day' : ''}
                      key={`${day}-${index}`}
                    >
                      {day}
                    </span>
                  ))}
                </motion.div>
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
            <SectionHeading id="ss-timeline-title" kicker="Nhịp ngày vui">
              {content.timeline?.title}
            </SectionHeading>
            <motion.p className="ss-timeline-intro" {...elementReveal(Boolean(reduceMotion), 0.08)}>
              {content.timeline?.message}
            </motion.p>
            {timelineItems.length ? (
              <motion.div className="ss-timeline" {...elementReveal(Boolean(reduceMotion), 0.14)}>
                {timelineItems.map((item, index) => (
                  <motion.article
                    key={`${item.time}-${item.title}`}
                    {...elementReveal(Boolean(reduceMotion), 0.18 + index * 0.08)}
                  >
                    <time>{item.time}</time>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
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
            <motion.div className="ss-venue-ticket" {...elementReveal(Boolean(reduceMotion), 0.08)}>
              <MapPin className="ss-venue-pin" size={30} weight="thin" aria-hidden="true" />
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
            </motion.div>
          </SilkSection>
          <SilkSection sectionKey="gallery" active={active} order={order} className="ss-gallery">
            <SectionHeading id="ss-gallery-title" kicker={content.gallery?.kicker}>
              {content.gallery?.title}
            </SectionHeading>
            <motion.p {...elementReveal(Boolean(reduceMotion), 0.08)}>{content.gallery?.message}</motion.p>
            {galleryImages.length ? (
              <>
                <motion.div className="ss-gallery-filmstrip" aria-live="polite" {...elementReveal(Boolean(reduceMotion), 0.14)}>
                  <div className="ss-gallery-main">
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
                    <figure>
                      <img
                        src={galleryImages[galleryIndex].src}
                        alt={galleryImages[galleryIndex].alt}
                        width={720}
                        height={960}
                        loading="eager"
                        decoding="async"
                      />
                    </figure>
                  <button
                    type="button"
                    className="is-next"
                    aria-label="Ảnh tiếp theo"
                    onClick={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)}
                  >
                    <CaretRight size={20} />
                  </button>
                  </div>
                  <div className="ss-gallery-thumbs" role="tablist" aria-label="Chọn ảnh">
                    {galleryImages.map((image, index) => (
                      <button
                        type="button"
                        className={index === galleryIndex ? 'is-active' : ''}
                        role="tab"
                        aria-selected={index === galleryIndex}
                        aria-label={`Mở ảnh ${index + 1}`}
                        key={`${image.src}-${index}`}
                        onClick={() => setGalleryIndex(index)}
                      >
                        <img src={image.src} alt="" width={96} height={112} loading="lazy" />
                      </button>
                    ))}
                  </div>
                </motion.div>
                <motion.p className="ss-gallery-index" {...elementReveal(Boolean(reduceMotion), 0.22)}>
                  <span>{String(galleryIndex + 1).padStart(2, '0')}</span> /{' '}
                  {String(galleryImages.length).padStart(2, '0')}
                </motion.p>
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
            <SectionHeading id="ss-rsvp-title" kicker={content.rsvp?.kicker}>
              {personalize(content.rsvp?.title, guest)}
            </SectionHeading>
            <motion.p {...elementReveal(Boolean(reduceMotion), 0.08)}>
              {personalize(content.rsvp?.message, guest)}
            </motion.p>
            {rsvpDone || interactions?.rsvp.submitted ? (
              <div className="ss-success">
                <Check size={24} />
                {personalize(content.rsvp?.successMessage, guest)}
              </div>
            ) : (
              <motion.form onSubmit={submitRsvp} noValidate {...elementReveal(Boolean(reduceMotion), 0.14)}>
                {showGuestNameInput ? (
                  <input
                    name="rsvpName"
                    value={rsvpName}
                    onChange={(event) => setRsvpName(event.target.value)}
                    autoComplete="name"
                    aria-label="Tên của bạn"
                    placeholder="Tên của bạn"
                  />
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
                 {rsvpError || interactions?.rsvp.error ? (
                  <p className="ss-form-error" role="alert">
                    {rsvpError || interactions?.rsvp.error}
                  </p>
                ) : null}
               </motion.form>
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
            <SectionHeading id="ss-guestbook-title">
              {personalize(content.guestbook?.title, guest)}
            </SectionHeading>
            <motion.p {...elementReveal(Boolean(reduceMotion), 0.08)}>
              {personalize(content.guestbook?.message, guest)}
            </motion.p>
            {wishDone || interactions?.wishes.submitted ? (
              <div className="ss-success">
                <Check size={24} />
                {personalize(content.guestbook?.successMessage, guest)}
              </div>
            ) : (
              <motion.form onSubmit={submitWish} noValidate {...elementReveal(Boolean(reduceMotion), 0.14)}>
                {showGuestNameInput ? (
                  <input
                    name="wishName"
                    value={wishName}
                    onChange={(event) => setWishName(event.target.value)}
                    autoComplete="name"
                    aria-label="Tên của bạn"
                    placeholder="Tên của bạn"
                  />
                ) : null}
                <textarea
                  name="wish"
                  value={wish}
                  onChange={(event) => setWish(event.target.value)}
                  aria-label="Lời chúc"
                  placeholder="Lời chúc của bạn"
                  rows={4}
                />
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
              </motion.form>
            )}
            {interactions?.wishes.items.length ? (
              <motion.div className="ss-wish-list" aria-live="polite" {...elementReveal(Boolean(reduceMotion), 0.2)}>
                <h3>Lời chúc gửi đến hai bạn</h3>
                {interactions.wishes.items.map((item) => (
                  <article key={item.id}>
                    <p>{item.content}</p>
                    <small>{item.authorName}</small>
                  </article>
                ))}
              </motion.div>
            ) : null}
          </SilkSection>
          <SilkSection sectionKey="gift" active={active} order={order} className="ss-gift">
            <SectionHeading id="ss-gift-title">{content.gift?.title}</SectionHeading>
            <motion.p {...elementReveal(Boolean(reduceMotion), 0.08)}>{content.gift?.message}</motion.p>
            <motion.button
              type="button"
              aria-expanded={giftOpen}
              aria-controls="ss-gift-panel"
              onClick={() => setGiftOpen((open) => !open)}
              {...elementReveal(Boolean(reduceMotion), 0.14)}
            >
              {giftOpen ? 'Khép thông tin' : 'Mở thiệp mừng'}
            </motion.button>
            <motion.div id="ss-gift-panel" hidden={!giftOpen} {...elementReveal(Boolean(reduceMotion), 0.2)}>
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
            </motion.div>
          </SilkSection>
          <SilkSection sectionKey="footer" active={active} order={order} className="ss-footer">
            {mediaSource(content.footer?.image) ? (
              <img
                className="ss-footer-photo"
                src={mediaSource(content.footer?.image)}
                alt={mediaAlt(content.footer?.image, 'Khoảnh khắc của cô dâu và chú rể')}
                width={1280}
                height={900}
                loading="lazy"
                decoding="async"
              />
            ) : null}
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
            <span
              className="ss-footer-monogram"
              aria-hidden="true"
            >
              {firstNameInitial(content.couple?.brideName)} • {firstNameInitial(content.couple?.groomName)}
            </span>
            <motion.h2 id="ss-footer-title" {...elementReveal(Boolean(reduceMotion), 0.08)}>
              {content.footer?.title}
            </motion.h2>
            <motion.p {...elementReveal(Boolean(reduceMotion), 0.16)}>{content.footer?.message}</motion.p>
          </SilkSection>
        </div>
        {active.has('music') ? (
          <MusicPlayer
            src={content.music?.backgroundMusicUrl}
            title={content.music?.backgroundMusicName || 'Nhạc nền'}
            autoplay={content.music?.backgroundMusicAutoplay}
            active={openingComplete}
            editorMode={editorMode}
            sectionKey="music"
          />
        ) : null}
      </div>
    </main>
  )
}
