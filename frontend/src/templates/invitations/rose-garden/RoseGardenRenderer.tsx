import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  CalendarBlank,
  Clock,
  EnvelopeSimple,
  Gift,
  Heart,
  MapPin,
  MusicNote,
  Sparkle,
} from '@phosphor-icons/react'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { MusicPlayer } from '../../../shared/ui/music-player'
import { ClassicCardCover } from '../../shared/component/opening/ClassicCardCover'
import { GiftEnvelopeBox } from '../../shared/component/opening/GiftEnvelopeBox'
import '../../../shared/styles/reveal-animations.css'

import { roseGardenFixture, roseGardenSectionConfig } from './fixture'
import {
  type RoseGardenData,
  type RoseGardenFamilySide,
  type RoseGardenMedia,
  type RoseGardenSectionConfig,
  type RoseGardenSectionKey,
} from './RoseGardenTypes'
import './rose-garden.css'

type ResolvedData = {
  couple: { brideName: string; groomName: string }
  event: { weddingDate: string; time: string; venueName: string; venueAddress: string; mapUrl: string }
  opening: { title: string; message: string }
  openingMediaBack: RoseGardenMedia | null
  openingMediaFront: RoseGardenMedia | null
  cover: { eyebrow: string; title: string; message: string }
  heroMedia: RoseGardenMedia | null
  invitation: { title: string; message: string }
  invitationMemoryImage1: string | RoseGardenMedia
  invitationMemoryImage2: string | RoseGardenMedia
  invitationMemoryImage3: string | RoseGardenMedia
  families: {
    title: string
    subtitle: string
    message: string
    brideSide: Required<RoseGardenFamilySide>
    groomSide: Required<RoseGardenFamilySide>
  }
  eventDetails: {
    title: string
    date: string
    items: NonNullable<NonNullable<RoseGardenData['eventDetails']>['items']>
    calendarUrl: string
    message: string
  }
  eventDetailsMedia: RoseGardenMedia | null
  countdown: { enabled: boolean }
  timeline: { items: NonNullable<NonNullable<RoseGardenData['timeline']>['items']> }
  venue: { title: string; name: string; address: string; mapUrl: string; message: string }
  gallery: { title: string; message: string }
  galleryImages: Array<string | RoseGardenMedia>
  rsvp: {
    title: string
    message: string
    deadline: string
    successMessage: string
    attendingLabel: string
    notAttendingLabel: string
  }
  guestbook: { title: string; message: string; successMessage: string }
  gift: { title: string; message: string; thankYouMessage: string }
  giftQrMedia: RoseGardenMedia | null
  music: { backgroundMusicUrl: string; backgroundMusicName: string; backgroundMusicAutoplay: boolean }
  footer: { title: string; message: string }
  footerMedia: RoseGardenMedia | null
}

type CountdownClock = {
  days: number
  hours: number
  minutes: number
  seconds: number
  complete: boolean
}

const artworkRoot = '/assets/images/templates/rose-garden/artwork-drafts'
const rendererDecor = {
  openingClosed: `${artworkRoot}/rg-opening-closed-card.png`,
  openingInner: `${artworkRoot}/rg-opening-inner-card.png`,
  openingTriangle: `${artworkRoot}/rg-opening-triangle-flap.png`,
  openingFront: `${artworkRoot}/rg-opening-front-frame.png`,
  envelopeVignette: `${artworkRoot}/rg-garden-envelope-vignette-v1.png`,
  botanical: `${artworkRoot}/rg-botanical-cluster-v1.png`,
  botanicalAlt: `${artworkRoot}/rg-botanical-cluster.png`,
  divider: `${artworkRoot}/rg-pressed-flower-divider.png`,
  giftCharm: `${artworkRoot}/rg-gift-botanical-charm.png`,
  timelineBloom: `${artworkRoot}/rg-timeline-bloom.png`,
  petalCluster: `${artworkRoot}/rg-center-rose-petal-cluster.png`,
  wreath: `${artworkRoot}/rg-botanical-wreath.png`,
  centerCluster: `${artworkRoot}/rg-center-floral-cluster.png`,
  sprig: `${artworkRoot}/rg-botanical-sprig.png`,
}
const sectionKeys: RoseGardenSectionKey[] = roseGardenSectionConfig.order
const fixedLeadingSectionKeys: RoseGardenSectionKey[] = [
  'opening',
  'cover',
  'invitation',
  'families',
  'eventDetails',
]
const requiredSectionKeys = new Set<RoseGardenSectionKey>([
  ...fixedLeadingSectionKeys,
  'footer',
])
const fixedSectionKeys = new Set<RoseGardenSectionKey>([
  ...fixedLeadingSectionKeys,
  'music',
  'footer',
])
const openingExitFallbackMs =1200

const emptyCountdownClock: CountdownClock = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  complete: false,
}

function parseWeddingTimestamp(dateValue: string, timeValue: string): number {
  const normalizedDate = dateValue.trim()
  const isoMatch = normalizedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  const dmyMatch = normalizedDate.match(/(\d{1,2})\s*[·/.-]\s*(\d{1,2})\s*[·/.-]\s*(\d{4})/)
  const [, first, second, third] = isoMatch ?? dmyMatch ?? []
  if (!first || !second || !third) return Number.NaN

  const year = Number(isoMatch ? first : third)
  const month = Number(second)
  const day = Number(isoMatch ? third : first)
  const timeMatch = timeValue.match(/(\d{1,2}):(\d{2})/)
  const hours = Number(timeMatch?.[1] ?? 0)
  const minutes = Number(timeMatch?.[2] ?? 0)
  const target = new Date(year, month - 1, day, hours, minutes)

  if (
    target.getFullYear() !== year
    || target.getMonth() !== month - 1
    || target.getDate() !== day
    || hours > 23
    || minutes > 59
  ) return Number.NaN

  return target.getTime()
}

function getCountdownClock(target: number, now = Date.now()): CountdownClock {
  if (!Number.isFinite(target)) return emptyCountdownClock
  const remaining = Math.max(0, target - now)
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
    complete: remaining === 0,
  }
}

function mediaSource(value: string | RoseGardenMedia | null | undefined): string {
  return typeof value === 'string' ? value : value?.src ?? ''
}

function personalize(value: string, guestName?: string | null): string {
  return value.split('{guestName}').join(guestName?.trim() || 'Quý khách')
}

function resolveSide(
  side: RoseGardenFamilySide | undefined,
  fallback: RoseGardenFamilySide,
): Required<RoseGardenFamilySide> {
  return {
    label: side?.label ?? fallback.label ?? '',
    fatherTitle: side?.fatherTitle ?? fallback.fatherTitle ?? 'Ông',
    father: side?.father ?? fallback.father ?? '',
    motherTitle: side?.motherTitle ?? fallback.motherTitle ?? 'Bà',
    mother: side?.mother ?? fallback.mother ?? '',
    address: side?.address ?? fallback.address ?? '',
  }
}

function resolveEventDetailItems(
  value: RoseGardenData['eventDetails'],
  fallback: RoseGardenData['eventDetails'],
): NonNullable<NonNullable<RoseGardenData['eventDetails']>['items']> {
  if (value?.items !== undefined) return value.items
  if (value?.time !== undefined) {
    return value.time ? [{ time: value.time, title: 'Thời gian hôn lễ' }] : []
  }
  if (fallback?.items !== undefined) return fallback.items
  return fallback?.time ? [{ time: fallback.time, title: 'Thời gian hôn lễ' }] : []
}

function resolveData(data?: RoseGardenData): ResolvedData {
  const fallback = roseGardenFixture
  return {
    couple: {
      brideName: data?.couple?.brideName ?? fallback.couple?.brideName ?? '',
      groomName: data?.couple?.groomName ?? fallback.couple?.groomName ?? '',
    },
    event: {
      weddingDate: data?.event?.weddingDate ?? fallback.event?.weddingDate ?? '',
      time: data?.event?.time ?? fallback.event?.time ?? '',
      venueName: data?.event?.venueName ?? fallback.event?.venueName ?? '',
      venueAddress: data?.event?.venueAddress ?? fallback.event?.venueAddress ?? '',
      mapUrl: data?.event?.mapUrl ?? fallback.event?.mapUrl ?? '',
    },
    opening: {
      title: data?.opening?.title ?? fallback.opening?.title ?? '',
      message: data?.opening?.message ?? fallback.opening?.message ?? '',
    },
    openingMediaBack: data?.openingMediaBack === undefined ? fallback.openingMediaBack ?? null : data.openingMediaBack,
    openingMediaFront: data?.openingMediaFront === undefined ? fallback.openingMediaFront ?? null : data.openingMediaFront,
    cover: {
      eyebrow: data?.cover?.eyebrow ?? fallback.cover?.eyebrow ?? '',
      title: data?.cover?.title ?? fallback.cover?.title ?? '',
      message: data?.cover?.message ?? fallback.cover?.message ?? '',
    },
    heroMedia: data?.heroMedia === undefined ? fallback.heroMedia ?? null : data.heroMedia,
    invitation: {
      title: data?.invitation?.title ?? fallback.invitation?.title ?? '',
      message: data?.invitation?.message ?? fallback.invitation?.message ?? '',
    },
    invitationMemoryImage1: data?.invitationMemoryImage1 ?? fallback.invitationMemoryImage1 ?? '',
    invitationMemoryImage2: data?.invitationMemoryImage2 ?? fallback.invitationMemoryImage2 ?? '',
    invitationMemoryImage3: data?.invitationMemoryImage3 ?? fallback.invitationMemoryImage3 ?? '',
    families: {
      title: data?.families?.title ?? fallback.families?.title ?? '',
      subtitle: data?.families?.subtitle ?? fallback.families?.subtitle ?? '',
      message: data?.families?.message ?? fallback.families?.message ?? '',
      brideSide: resolveSide(data?.families?.brideSide, fallback.families?.brideSide ?? {}),
      groomSide: resolveSide(data?.families?.groomSide, fallback.families?.groomSide ?? {}),
    },
    eventDetails: {
      title: data?.eventDetails?.title ?? fallback.eventDetails?.title ?? '',
      date: data?.eventDetails?.date ?? fallback.eventDetails?.date ?? '',
      items: resolveEventDetailItems(data?.eventDetails, fallback.eventDetails),
      calendarUrl: data?.eventDetails?.calendarUrl ?? fallback.eventDetails?.calendarUrl ?? '',
      message: data?.eventDetails?.message ?? fallback.eventDetails?.message ?? '',
    },
    eventDetailsMedia: data?.eventDetailsMedia === undefined ? fallback.eventDetailsMedia ?? null : data.eventDetailsMedia,
    countdown: { enabled: data?.countdown?.enabled ?? fallback.countdown?.enabled ?? true },
    timeline: { items: data?.timeline?.items ?? fallback.timeline?.items ?? [] },
    venue: {
      title: data?.venue?.title ?? fallback.venue?.title ?? '',
      name: data?.venue?.name ?? fallback.venue?.name ?? '',
      address: data?.venue?.address ?? fallback.venue?.address ?? '',
      mapUrl: data?.venue?.mapUrl ?? fallback.venue?.mapUrl ?? '',
      message: data?.venue?.message ?? fallback.venue?.message ?? '',
    },
    gallery: {
      title: data?.gallery?.title ?? fallback.gallery?.title ?? '',
      message: data?.gallery?.message ?? fallback.gallery?.message ?? '',
    },
    galleryImages: data?.galleryImages ?? data?.gallery?.images ?? fallback.galleryImages ?? [],
    rsvp: {
      title: data?.rsvp?.title ?? fallback.rsvp?.title ?? '',
      message: data?.rsvp?.message ?? fallback.rsvp?.message ?? '',
      deadline: data?.rsvp?.deadline ?? fallback.rsvp?.deadline ?? '',
      successMessage: data?.rsvp?.successMessage ?? fallback.rsvp?.successMessage ?? '',
      attendingLabel: data?.rsvp?.attendingLabel ?? fallback.rsvp?.attendingLabel ?? '',
      notAttendingLabel: data?.rsvp?.notAttendingLabel ?? fallback.rsvp?.notAttendingLabel ?? '',
    },
    guestbook: {
      title: data?.guestbook?.title ?? fallback.guestbook?.title ?? '',
      message: data?.guestbook?.message ?? fallback.guestbook?.message ?? '',
      successMessage: data?.guestbook?.successMessage ?? fallback.guestbook?.successMessage ?? '',
    },
    gift: {
      title: data?.gift?.title ?? fallback.gift?.title ?? '',
      message: data?.gift?.message ?? fallback.gift?.message ?? '',
      thankYouMessage: data?.gift?.thankYouMessage ?? fallback.gift?.thankYouMessage ?? '',
    },
    giftQrMedia: data?.giftQrMedia === undefined ? fallback.giftQrMedia ?? null : data.giftQrMedia,
    music: {
      backgroundMusicUrl: data?.music?.backgroundMusicUrl ?? fallback.music?.backgroundMusicUrl ?? '',
      backgroundMusicName: data?.music?.backgroundMusicName ?? fallback.music?.backgroundMusicName ?? '',
      backgroundMusicAutoplay: data?.music?.backgroundMusicAutoplay ?? fallback.music?.backgroundMusicAutoplay ?? false,
    },
    footer: {
      title: data?.footer?.title ?? fallback.footer?.title ?? '',
      message: data?.footer?.message ?? fallback.footer?.message ?? '',
    },
    footerMedia: data?.footerMedia === undefined ? fallback.footerMedia ?? null : data.footerMedia,
  }
}

type MotionElementProps = {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const motionVariants = ['reveal--fade-up', 'reveal--slide-left', 'reveal--slide-right', 'reveal--zoom-in', 'reveal--slide-down'] as const

function motionize(node: ReactNode, depth = 0, siblingIndex = 0): ReactNode {
  if (!isValidElement<MotionElementProps>(node)) return node
  const variant = motionVariants[(depth + siblingIndex) % motionVariants.length]
  const existingClassName = node.props.className ?? ''
  const isMotionStatic = existingClassName.split(/\s+/).includes('rg-motion-static')
  const hasRevealClass = existingClassName.split(/\s+/).includes('reveal')
    || existingClassName.split(/\s+/).includes('rg-date-line')
    || existingClassName.split(/\s+/).includes('rg-date-heart')
    || existingClassName.split(/\s+/).includes('rg-invitation-eyebrow')
    || isMotionStatic
  const nestedChildren = node.props.children === undefined
    ? undefined
    : Children.map(node.props.children, (child, index) => motionize(child, depth + 1, index))
  return cloneElement(
    node,
    {
      className: hasRevealClass ? existingClassName : `${existingClassName} reveal ${variant}`.trim(),
      style: hasRevealClass
        ? node.props.style
        : { ...node.props.style, '--reveal-delay': `${Math.min((depth + siblingIndex) * 0.08, 0.56)}s` } as CSSProperties,
    },
    nestedChildren,
  )
}
function SectionFrame({
  sectionKey,
  order,
  className,
  tabIndex,
  children,
}: {
  sectionKey: RoseGardenSectionKey
  order: number
  className: string
  tabIndex?: number
  children: ReactNode
}) {
  const motionChildren = Children.map(children, (child, index) => motionize(child, 0, index))
  return (
    <section
      className={`rg-body-section rg-motion-content ${sectionKey === 'opening' ? 'is-visible' : ''} ${className}`}
      data-editor-section={sectionKey}
      data-section-layout={className.replace('rg-', '')}
      tabIndex={tabIndex}
      style={{ order } as CSSProperties}
    >
      {motionChildren}
    </section>
  )
}
function SectionEyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`rg-eyebrow ${className}`.trim()}>{children}</span>
}

function WaveTitle({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const text = String(children ?? '')
  return (
    <h2 className={className} style={style} aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span key={`${character}-${index}`} style={{ '--wave-index': index } as CSSProperties}>
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </h2>
  )
}

function Artwork({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />
}

function EmptyArtwork({ label, className = '' }: { label: string; className?: string }) {
  return <div className={`rg-empty-artwork ${className}`.trim()} aria-label={label}>{label}</div>
}

function FamilySide({
  side,
  decorSrc,
  decorPosition,
}: {
  side: Required<RoseGardenFamilySide>
  decorSrc: string
  decorPosition: 'left' | 'right'
}) {
  return (
    <article className="rg-family-side" aria-label={side.label || 'Đại diện gia đình'}>
      <Artwork
        src={decorSrc}
        alt=""
        className={`rg-family-card-flower rg-family-card-flower-${decorPosition}`}
      />
      <header>
        {side.label ? <span className="rg-family-label">{side.label}</span> : null}
        <small>Đại diện gia đình</small>
      </header>
      <div className="rg-family-people">
        {side.father ? <p><em>{side.fatherTitle}</em><strong>{side.father}</strong></p> : null}
        {side.mother ? <p><em>{side.motherTitle}</em><strong>{side.mother}</strong></p> : null}
      </div>
      {side.address ? <address><span>Tư gia</span>{side.address}</address> : null}
    </article>
  )
}

export function RoseGardenRenderer({
  data,
  sectionConfig,
  editorMode = false,
  guestName,
  interactions,
}: {
  data?: RoseGardenData
  sectionConfig?: RoseGardenSectionConfig
  editorMode?: boolean
  guestName?: string | null
  interactions?: PublicInteractions
}) {
  const content = resolveData(data)
  const pageRef = useRef<HTMLDivElement>(null)
  const openingTimerRef = useRef<number | null>(null)
  const [openingState, setOpeningState] = useState<'closed' | 'opening' | 'opened'>('closed')
  const [rsvpChoice, setRsvpChoice] = useState<'attending' | 'declined' | null>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [rsvpValidationError, setRsvpValidationError] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [wishSubmitted, setWishSubmitted] = useState(false)
  const [wishValidationError, setWishValidationError] = useState('')
  const [wishes, setWishes] = useState<Array<{ name: string; message: string }>>([])
  const weddingTimestamp = useMemo(
    () => parseWeddingTimestamp(content.event.weddingDate, content.event.time),
    [content.event.time, content.event.weddingDate],
  )
  const [countdownClock, setCountdownClock] = useState<CountdownClock>(() => getCountdownClock(weddingTimestamp))
  const opened = openingState === 'opened'
  const connectedGuestName = interactions?.guestName?.trim() || guestName?.trim() || ''
  const interactionWishItems = interactions?.wishes.items
  const hasGuestName = Boolean(connectedGuestName)
  const rsvpLocked = rsvpSubmitted || Boolean(interactions?.rsvp.submitted)
  const wishLocked = wishSubmitted || Boolean(interactions?.wishes.submitted)
  const enabled = new Set(sectionConfig?.enabled ?? sectionKeys)
  requiredSectionKeys.forEach((key) => enabled.add(key))
  const requestedOrder = sectionConfig?.order?.length ? sectionConfig.order : sectionKeys
  const normalizedRequestedOrder = [...new Set([...requestedOrder, ...sectionKeys])].filter(
    (key) => sectionKeys.includes(key) && enabled.has(key),
  )
  const reorderableSectionKeys = normalizedRequestedOrder.filter(
    (key) => !fixedSectionKeys.has(key),
  )
  const order = [
    ...fixedLeadingSectionKeys,
    ...reorderableSectionKeys,
    ...(enabled.has('music') ? (['music'] as const) : []),
    'footer' as const,
  ]
  const sectionOrder = (key: RoseGardenSectionKey) => order.indexOf(key)
  const memoryImages = [
    mediaSource(content.invitationMemoryImage1),
    mediaSource(content.invitationMemoryImage2),
    mediaSource(content.invitationMemoryImage3),
  ]
  const galleryImages = content.galleryImages.map(mediaSource).filter(Boolean)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [giftQrOpen, setGiftQrOpen] = useState(false)
  const glints = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const random = Math.random
        const isRight = index % 2 === 1
        return {
          id: index,
          left: `${isRight ? 66 + random() * 29 : 5 + random() * 29}%`,
          top: `${8 + random() * 84}%`,
          size: `${3 + Math.round(random() * 2)}px`,
          delay: `${-(random() * 6).toFixed(2)}s`,
          duration: `${(4.2 + random() * 2.8).toFixed(2)}s`,
        }
      }),
    [],
  )

  useEffect(() => {
    const page = pageRef.current
    if (!page || typeof window === 'undefined') return

    const getMediaQuery = (query: string) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(query) : { matches: false }
    const reduceMotion = getMediaQuery('(prefers-reduced-motion: reduce)').matches
    const handleVisibility = () => page.classList.toggle('rg-document-hidden', document.hidden)
    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)
    page.classList.add('rg-motion-ready')
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      page.classList.add('rg-atmosphere-active')
      page.querySelectorAll<HTMLElement>('.rg-body-section:not(.rg-opening)').forEach((section) => section.classList.add('is-visible'))
      return () => document.removeEventListener('visibilitychange', handleVisibility)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.01, rootMargin: '0px 0px -33% 0px' },
    )
    const observeSections = () => {
      page.querySelectorAll<HTMLElement>('.rg-body-section:not(.rg-opening):not(.is-visible)').forEach((section) => observer.observe(section))
    }
    observeSections()

    const atmosphere = page.querySelector<HTMLElement>('.rg-cover-atmosphere')
    const atmosphereObserver = new IntersectionObserver(
      ([entry]) => page.classList.toggle('rg-atmosphere-active', Boolean(entry?.isIntersecting)),
      { threshold: 0.05 },
    )
    if (atmosphere) atmosphereObserver.observe(atmosphere)

    const canParallax = getMediaQuery('(hover: hover) and (pointer: fine)')
    const handlePointerMove = (event: PointerEvent) => {
      if (!canParallax.matches) return
      page.style.setProperty('--rg-pointer-x', `${((event.clientX / window.innerWidth) - 0.5) * 16}`)
      page.style.setProperty('--rg-pointer-y', `${((event.clientY / window.innerHeight) - 0.5) * 16}`)
    }
    const resetPointer = () => {
      page.style.setProperty('--rg-pointer-x', '0')
      page.style.setProperty('--rg-pointer-y', '0')
    }
    page.addEventListener('pointermove', handlePointerMove, { passive: true })
    page.addEventListener('pointerleave', resetPointer)

    return () => {
      observer.disconnect()
      atmosphereObserver.disconnect()
      page.removeEventListener('pointermove', handlePointerMove)
      page.removeEventListener('pointerleave', resetPointer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [sectionConfig, openingState])

  useEffect(() => () => {
    if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current)
  }, [])

  const focusCover = () => {
    requestAnimationFrame(() => pageRef.current?.querySelector<HTMLElement>('[data-editor-section="cover"]')?.focus({ preventScroll: true }))
  }

  const completeOpening = () => {
    if (openingTimerRef.current !== null) {
      window.clearTimeout(openingTimerRef.current)
      openingTimerRef.current = null
    }
    setOpeningState((current) => current === 'opening' ? 'opened' : current)
    focusCover()
  }

  const openInvitation = () => {
    if (openingState !== 'closed') return
    const reduced = typeof window.matchMedia !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setOpeningState('opened')
      focusCover()
      return
    }
    setOpeningState('opening')
    openingTimerRef.current = window.setTimeout(completeOpening, openingExitFallbackMs)
  }

  const sendRsvp = async () => {
    if (!rsvpChoice || rsvpLocked || interactions?.rsvp.submitting) return
    const name = connectedGuestName || rsvpName.trim()
    if (!hasGuestName && !name) {
      setRsvpValidationError('Vui lòng nhập tên của bạn.')
      return
    }
    setRsvpValidationError('')
    const submitted = interactions
      ? await interactions.rsvp.submit({
          guestName: hasGuestName || interactions.isPersonalized ? undefined : name,
          attendance: rsvpChoice === 'attending' ? 'ATTENDING' : 'DECLINED',
          partySize: 1,
        })
      : true
    if (submitted) setRsvpSubmitted(true)
  }

  const sendWish = async () => {
    if (wishLocked || interactions?.wishes.submitting) return
    const name = connectedGuestName || wishName.trim()
    const message = wishMessage.trim()
    if (!hasGuestName && !name) {
      setWishValidationError('Vui lòng nhập tên của bạn.')
      return
    }
    if (!message) {
      setWishValidationError('Vui lòng viết một lời chúc.')
      return
    }
    setWishValidationError('')
    const submitted = interactions
      ? await interactions.wishes.submit({ guestName: interactions.isPersonalized ? undefined : name, content: message })
      : true
    if (!submitted) return
    if (!interactions) setWishes((current) => [{ name, message }, ...current])
    setWishSubmitted(true)
    setWishName('')
    setWishMessage('')
  }

  useEffect(() => {
    if (interactionWishItems) setWishes(interactionWishItems.map((item) => ({ name: item.authorName, message: item.content })))
  }, [interactionWishItems])

  useEffect(() => {
    if (interactions?.rsvp.submitted) setRsvpSubmitted(true)
  }, [interactions?.rsvp.submitted])

  const renderWish = (wish: { name: string; message: string }, index: number, clone = false) => (
    <article
      key={`${clone ? 'clone-' : ''}${wish.name}-${index}`}
      aria-hidden={clone || undefined}
    >
      <Heart weight="fill" />
      <div>
        <strong>{wish.name}</strong>
        <p>{wish.message}</p>
      </div>
    </article>
  )
  const isWishMarquee = wishes.length > 5

  useEffect(() => {
    const updateCountdown = () => setCountdownClock(getCountdownClock(weddingTimestamp))
    updateCountdown()
    if (!Number.isFinite(weddingTimestamp) || weddingTimestamp <= Date.now()) return

    const timer = window.setInterval(updateCountdown, 1000)
    const handleVisibility = () => {
      if (!document.hidden) updateCountdown()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [weddingTimestamp])

  const renderSection = (key: RoseGardenSectionKey) => {
    const sectionIndex = sectionOrder(key)
    switch (key) {
      case 'cover':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-cover" tabIndex={-1}>
            <div className="rg-cover-main-hero">
              <div className="rg-cover-art">
                {content.heroMedia?.src ? (
                  <Artwork src={content.heroMedia.src} alt={content.heroMedia.alt || 'Ảnh bìa thiệp'} className="rg-user-media" eager />
                ) : (
                  <EmptyArtwork label="Ảnh bìa thiệp · Chưa tải ảnh" />
                )}
              </div>
            </div>
            <div className="rg-cover-atmosphere" aria-hidden="true">
              <Artwork src={rendererDecor.petalCluster} alt="" className="rg-cover-petal-cluster" />
              {Array.from({ length: 9 }, (_, index) => <i key={index} className="rg-cover-petal" />)}
            </div>
            <div className="rg-cover-copy">
              <SectionEyebrow>{content.cover.eyebrow}</SectionEyebrow>
              <WaveTitle>{content.cover.title}</WaveTitle>
              <p>{content.cover.message}</p>
              <div className="rg-name-lockup"><strong>{content.couple.brideName}</strong><i>&amp;</i><strong>{content.couple.groomName}</strong></div>
              <span className="rg-date-line"><span>{content.event.weddingDate}</span><i className="rg-date-heart" aria-hidden="true">♥</i></span>
            </div>
          </SectionFrame>
        )
      case 'invitation':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-invitation-letter">
            <SectionEyebrow className="rg-invitation-eyebrow">Lời mời từ khu vườn</SectionEyebrow>
            <h2>{personalize(content.invitation.title, connectedGuestName)}</h2>
            <p className="rg-lead">{personalize(content.invitation.message, connectedGuestName)}</p>
            <Artwork src={rendererDecor.petalCluster} alt="" className="rg-letter-rose-decor reveal reveal--fade-up" />
            <div className="rg-memory-triptych">
              {memoryImages.map((src, index) => (
                <figure key={`${src}-${index}`} className={`rg-memory-card rg-memory-card-${index + 1}`}>
                  {src ? <Artwork src={src} alt={`Khoảnh khắc của cô dâu chú rể ${index + 1}`} className="rg-user-media" /> : <EmptyArtwork label={`Ảnh ký ức ${index + 1} · Chưa tải ảnh`} />}
                  <figcaption>memories {String(index + 1).padStart(2, '0')}</figcaption>
                </figure>
              ))}
            </div>
            <Artwork src={rendererDecor.sprig} alt="" className="rg-letter-decor reveal reveal--slide-left" />
          </SectionFrame>
        )
      case 'families':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-families">
            <div className="rg-family-canopy" aria-hidden="true">
              <Artwork src={rendererDecor.centerCluster} alt="" className="rg-family-floral-cluster" />
            </div>
            <div className="rg-family-heading">
              <SectionEyebrow>Thông tin hai gia đình</SectionEyebrow>
              <h2>{content.families.title}</h2>
              <p className="rg-family-subtitle">{content.families.subtitle}</p>
            </div>
            <div className="rg-family-columns">
              <FamilySide side={content.families.brideSide} decorSrc={rendererDecor.botanical} decorPosition="left" />
              <span className="rg-family-ampersand" aria-hidden="true">&amp;</span>
              <FamilySide side={content.families.groomSide} decorSrc={rendererDecor.botanicalAlt} decorPosition="right" />
            </div>
            <Artwork src={rendererDecor.envelopeVignette} alt="" className="rg-family-floating-envelope" />
            <p className="rg-family-message">Kính mời đến chung vui và chứng kiến khoảnh khắc hai gia đình kết duyên.</p>
          </SectionFrame>
        )
      case 'eventDetails':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-event-details">
            <header className="rg-event-heading">
              <div className="rg-event-stamp rg-motion-static" aria-hidden="true"><CalendarBlank weight="thin" /><span>save the date</span></div>
              <div>
                <SectionEyebrow>Hôn lễ &amp; tiệc cưới</SectionEyebrow>
                <h2>{content.eventDetails.title}</h2>
              </div>
            </header>
            <div className="rg-event-card">
              {content.eventDetailsMedia?.src ? (
                <figure className="rg-event-media">
                  <Artwork src={content.eventDetailsMedia.src} alt={content.eventDetailsMedia.alt || 'Ảnh thời gian hôn lễ'} className="rg-user-media" />
                  <figcaption>Ngày thành hôn</figcaption>
                </figure>
              ) : null}
              <div className="rg-event-calendar">
                <span className="rg-event-calendar-label">Ngày thành hôn</span>
                <time className="rg-event-date">{content.eventDetails.date}</time>
                {content.eventDetails.items.length ? (
                  <div className="rg-event-schedule">
                    <div className="rg-event-schedule-heading"><Clock weight="duotone" /><span>Chương trình dự kiến</span></div>
                    <ol className="rg-event-times">
                      {content.eventDetails.items.map((item, index) => (
                        <li className="rg-event-time-item" key={`${item.time ?? 'time'}-${item.title ?? 'event'}-${index}`}>
                          <time>{item.time}</time>
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
              <div className="rg-event-copy">
                <Artwork src={rendererDecor.divider} alt="" className="rg-event-divider rg-section-decor rg-motion-static" />
                <p>{content.eventDetails.message}</p>
                {content.eventDetails.calendarUrl ? <a className="rg-event-calendar-action" href={content.eventDetails.calendarUrl} target="_blank" rel="noreferrer"><CalendarBlank weight="duotone" /><span><small>Lưu ngày vui</small>Thêm vào lịch</span><ArrowUpRight /></a> : null}
              </div>
            </div>
          </SectionFrame>
        )
      case 'countdown':
        return content.countdown.enabled && Number.isFinite(weddingTimestamp) ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-countdown">
            <Artwork src={rendererDecor.sprig} alt="" className="rg-countdown-sprig rg-countdown-sprig-left rg-motion-static" />
            <Artwork src={rendererDecor.sprig} alt="" className="rg-countdown-sprig rg-countdown-sprig-right rg-motion-static" />
            <div className="rg-countdown-heading">
              <SectionEyebrow>Đếm ngược ngày vui</SectionEyebrow>
              <div className="rg-countdown-rule"><span /><Heart weight="fill" /><span /></div>
              <h2>{countdownClock.complete ? 'Ngày vui đã đến' : 'Hẹn gặp nhau sau'}</h2>
            </div>
            <div className="rg-countdown-plaque" role="timer" aria-live="off" aria-label="Đếm ngược đến ngày cưới">
              <div className="rg-countdown-units">
                {([
                  ['days', countdownClock.days, 'Ngày'],
                  ['hours', countdownClock.hours, 'Giờ'],
                  ['minutes', countdownClock.minutes, 'Phút'],
                  ['seconds', countdownClock.seconds, 'Giây'],
                ] as const).map(([unit, value, label]) => (
                  <div className="rg-countdown-unit rg-motion-static" data-countdown-unit={unit} key={unit}>
                    <strong>{String(value).padStart(2, '0')}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="rg-countdown-date"><span>{countdownClock.complete ? 'Trân trọng chào đón' : 'Ngày chúng mình chung đôi'}</span><strong>{content.event.weddingDate}</strong></div>
            </div>
          </SectionFrame>
        ) : null
      case 'timeline':
        return content.timeline.items.length ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-timeline">
            <SectionEyebrow>Nhịp ngày chung đôi</SectionEyebrow>
            <h2>Một ngày, những khoảnh khắc đáng nhớ</h2>
            <ol>
              <span key="timeline-light-a" className="rg-timeline-light rg-timeline-light-a rg-motion-static" aria-hidden="true" />
              {content.timeline.items.map((item, index) => {
              const imageSrc = mediaSource(item.image)
              return (
                <li key={`${item.time}-${item.title}-${index}`}>
                  <time>{item.time}</time>
                  <span className="rg-timeline-node"><Artwork src={rendererDecor.timelineBloom} alt="" className="rg-timeline-bloom" /><span>{String(index + 1).padStart(2, '0')}</span></span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    {imageSrc ? <Artwork src={imageSrc} alt={`Ảnh mốc thời gian ${item.title || index + 1}`} className="rg-timeline-media rg-user-media" /> : null}
                  </div>
                </li>
              )
              })}
            </ol>
          </SectionFrame>
        ) : null
      case 'venue':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-venue">
            <div className="rg-venue-pin reveal reveal--slide-left"><MapPin weight="fill" className="rg-motion-static" /></div>
            <SectionEyebrow>Địa điểm hôn lễ</SectionEyebrow>
            <h2>{content.venue.title}</h2><strong>{content.venue.name}</strong><p>{content.venue.address}</p><p className="rg-muted-copy">{content.venue.message}</p>
            {content.venue.mapUrl ? <a className="rg-venue-map-link" href={content.venue.mapUrl} target="_blank" rel="noreferrer">Mở Google Maps <ArrowUpRight /></a> : null}
            <Artwork src={rendererDecor.wreath} alt="" className="rg-section-decor rg-venue-decor rg-motion-static" />
          </SectionFrame>
        )
      case 'gallery':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-gallery">
            <SectionEyebrow>Album của chúng mình</SectionEyebrow><h2>{content.gallery.title}</h2><p>{content.gallery.message}</p>
            {galleryImages.length ? (
              <div className="rg-gallery-carousel">
                <button type="button" className="rg-gallery-control" aria-label="Ảnh trước" onClick={() => setGalleryIndex((index) => Math.max(0, index - 1))} disabled={galleryIndex === 0}><CaretLeft /></button>
                <div className="rg-gallery-viewport">
                  <div className="rg-gallery-rail rg-motion-static" style={{ '--rg-gallery-index': galleryIndex } as CSSProperties}>{galleryImages.map((src, index) => <figure key={`${src}-${index}`} className="rg-gallery-card rg-motion-static"><Artwork src={src} alt={`Khoảnh khắc trong album ${index + 1}`} className="rg-user-media" /><figcaption>0{index + 1}</figcaption></figure>)}</div>
                </div>
                <button type="button" className="rg-gallery-control" aria-label="Ảnh tiếp theo" onClick={() => setGalleryIndex((index) => Math.min(galleryImages.length - 1, index + 1))} disabled={galleryIndex >= galleryImages.length - 1}><CaretRight /></button>
              </div>
            ) : (
              <div className="rg-gallery-empty">
                <Artwork src={rendererDecor.giftCharm} alt="" className="rg-gallery-decor" />
                <span>Ảnh album sẽ xuất hiện tại đây sau khi tải lên.</span>
              </div>
            )}
            <Artwork src={rendererDecor.sprig} alt="" className="rg-gallery-botanical rg-motion-static" />
          </SectionFrame>
        )
      case 'rsvp':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-rsvp">
            {content.rsvp.deadline.trim() ? <SectionEyebrow>Phản hồi trước {content.rsvp.deadline}</SectionEyebrow> : null}<h2>{content.rsvp.title}</h2><p>{content.rsvp.message}</p>
            <div className="rg-rsvp-form" aria-live="polite">
              {hasGuestName ? <p className="rg-form-identity">Xác nhận dành cho <strong>{connectedGuestName}</strong></p> : <label className="rg-field"><span>Tên của bạn</span><input value={rsvpName} onChange={(event) => { setRsvpName(event.target.value); setRsvpValidationError('') }} placeholder="Nguyễn Văn A" disabled={rsvpLocked || interactions?.rsvp.submitting} /></label>}
              <div className="rg-rsvp-choices" role="group" aria-label="Lựa chọn tham dự">
                <button type="button" className={rsvpChoice === 'attending' ? 'is-selected' : ''} onClick={() => { setRsvpChoice('attending'); setRsvpValidationError('') }} disabled={rsvpLocked || interactions?.rsvp.submitting}>{content.rsvp.attendingLabel}</button>
                <button type="button" className={rsvpChoice === 'declined' ? 'is-selected' : ''} onClick={() => { setRsvpChoice('declined'); setRsvpValidationError('') }} disabled={rsvpLocked || interactions?.rsvp.submitting}>{content.rsvp.notAttendingLabel}</button>
              </div>
              <button type="button" className="rg-primary-action" onClick={sendRsvp} disabled={rsvpLocked || !rsvpChoice || interactions?.rsvp.submitting}>{interactions?.rsvp.submitting ? 'Đang gửi…' : rsvpLocked ? content.rsvp.successMessage : 'Xác nhận phản hồi'} <ArrowUpRight /></button>
              {rsvpValidationError || interactions?.rsvp.error ? <p className="rg-form-error" role="alert">{rsvpValidationError || interactions?.rsvp.error}</p> : null}
              {rsvpLocked && !interactions?.rsvp.error ? <p className="rg-form-success" role="status">{content.rsvp.successMessage}</p> : null}
            </div>
            <Artwork src={rendererDecor.centerCluster} alt="" className="rg-section-decor rg-rsvp-decor rg-motion-static" />
          </SectionFrame>
        )
      case 'guestbook':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-guestbook">
            <EnvelopeSimple className="rg-guestbook-icon" weight="thin" /><SectionEyebrow>Sổ lưu bút</SectionEyebrow><h2>{content.guestbook.title}</h2><p>{content.guestbook.message}</p>
            <div className="rg-wish-form" aria-live="polite">
              {hasGuestName ? <p className="rg-form-identity">Lời chúc từ <strong>{connectedGuestName}</strong></p> : <label className="rg-field"><span>Tên của bạn</span><input value={wishName} onChange={(event) => { setWishName(event.target.value); setWishValidationError('') }} placeholder="Nguyễn Văn A" disabled={wishLocked || interactions?.wishes.submitting} /></label>}
              <label className="rg-field"><span>Lời chúc</span><textarea value={wishMessage} onChange={(event) => { setWishMessage(event.target.value); setWishValidationError('') }} placeholder="Gửi đôi lời yêu thương…" rows={4} disabled={wishLocked || interactions?.wishes.submitting} /></label>
              <button type="button" className="rg-primary-action" onClick={sendWish} disabled={wishLocked || !wishMessage.trim() || interactions?.wishes.submitting}>{interactions?.wishes.submitting ? 'Đang gửi…' : wishLocked ? content.guestbook.successMessage : 'Gửi lời chúc'} <Heart weight="fill" /></button>
              {wishValidationError || interactions?.wishes.error ? <p className="rg-form-error" role="alert">{wishValidationError || interactions?.wishes.error}</p> : null}
              {wishLocked && !interactions?.wishes.error ? <p className="rg-form-success" role="status">{content.guestbook.successMessage}</p> : null}
            </div>
            <div
              className={`rg-wish-list${isWishMarquee ? ' is-marquee' : ''}`}
              data-wish-count={wishes.length}
              data-wish-marquee={isWishMarquee ? 'true' : 'false'}
            >
              {interactions && !wishes.length ? <p className="rg-muted-copy">Chưa có lời chúc nào được duyệt.</p> : null}
              {isWishMarquee ? (
                <div className="rg-wish-track rg-motion-static">
                  {wishes.map((wish, index) => renderWish(wish, index))}
                  {wishes.map((wish, index) => renderWish(wish, index, true))}
                </div>
              ) : wishes.map((wish, index) => renderWish(wish, index))}
            </div>
            <Artwork src={rendererDecor.sprig} alt="" className="rg-section-decor rg-guestbook-decor" />
          </SectionFrame>
        )
      case 'gift':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-gift">
            <Gift className="rg-gift-icon" weight="thin" /><SectionEyebrow>{content.gift.title}</SectionEyebrow><p>{content.gift.message}</p>
            <div className={`rg-gift-payment ${giftQrOpen ? 'is-open' : ''}`}>
              <GiftEnvelopeBox
                className="rg-gift-envelope-box"
                cardSrc={rendererDecor.openingClosed}
                onClick={() => setGiftQrOpen((open) => !open)}
                expanded={giftQrOpen}
              />
              <div className="rg-qr-placeholder rg-motion-static">{content.giftQrMedia?.src ? <Artwork src={content.giftQrMedia.src} alt="Mã QR mừng cưới" className="rg-user-media" /> : <span>QR</span>}</div>
            </div>
            {content.gift.thankYouMessage ? <p className="rg-muted-copy">{content.gift.thankYouMessage}</p> : null}
          </SectionFrame>
        )
      case 'music':
        return null
      case 'footer':
        return (
          <footer key={key} className="rg-body-section rg-motion-content is-visible rg-footer" data-editor-section={key} style={{ order: sectionIndex } as CSSProperties}>
            <Sparkle weight="duotone" className="reveal reveal--zoom-in" />
            <SectionEyebrow className="reveal reveal--slide-left">{content.footer.title}</SectionEyebrow>
            <h2 className="reveal reveal--slide-right">{content.couple.brideName} <i>&amp;</i> {content.couple.groomName}</h2>
            <p className="reveal reveal--fade-up">{content.footer.message}</p>
            {content.footerMedia?.src ? <Artwork src={content.footerMedia.src} alt={content.footerMedia.alt || 'Ảnh cuối thiệp'} className="rg-footer-media rg-user-media reveal reveal--zoom-in" /> : null}
            <span className="rg-footer-date reveal reveal--slide-down">{content.event.weddingDate}</span>
            <Artwork src={rendererDecor.botanicalAlt} alt="" className="rg-section-decor rg-footer-decor rg-motion-static" />
          </footer>
        )
      default:
        return null
    }
  }

  return (
    <div ref={pageRef} className="rg-page">
      <div className="rg-backdrop" aria-hidden="true">{glints.map((glint) => <i key={glint.id} className="rg-glint" style={{ left: glint.left, top: glint.top, width: glint.size, height: glint.size, animationDelay: glint.delay, animationDuration: glint.duration }} />)}</div>
      {enabled.has('music') && (content.music.backgroundMusicUrl || editorMode) ? (
        <MusicPlayer
          src={content.music.backgroundMusicUrl}
          title={content.music.backgroundMusicName || 'Nhạc nền'}
          autoplay={content.music.backgroundMusicAutoplay}
          active={opened}
          editorMode={editorMode}
        />
      ) : null}
      <ClassicCardCover
        brideName={content.couple.brideName}
        groomName={content.couple.groomName}
        date={content.event.weddingDate}
        venue={content.event.venueName}
        eyebrow={content.opening.title}
        note={personalize(content.opening.message, connectedGuestName)}
        leftDecorationSrc={rendererDecor.botanical}
        rightDecorationSrc={rendererDecor.botanical}
        openLabel="Chạm để mở thiệp"
        openedLabel="Thiệp đã mở"
        sectionKey="opening"
        order={sectionOrder('opening')}
        isOpen={opened}
        isOpening={openingState === 'opening'}
        onOpen={openInvitation}
        onOpeningComplete={completeOpening}
      />
      <main className={`rg-invitation ${opened ? 'is-opened' : 'is-closed'} ${openingState === 'opening' ? 'is-opening' : ''}`} aria-label="Thiệp cưới Rose Garden">
        <div className="rg-invitation-decor rg-invitation-decor-top" aria-hidden="true" /><div className="rg-invitation-decor rg-invitation-decor-bottom" aria-hidden="true" />
        {sectionKeys.filter((key) => key !== 'opening' && order.includes(key)).map(renderSection)}
      </main>
    </div>
  )
}
