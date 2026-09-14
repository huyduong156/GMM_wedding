import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
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
import { ClassicCardCover } from '../../shared/component/opening/ClassicCardCover'
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
  eventDetails: { title: string; date: string; time: string; calendarUrl: string; message: string }
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

const artworkRoot = '/assets/images/templates/rose-garden/artwork-drafts'
const rendererDecor = {
  openingClosed: `${artworkRoot}/rg-opening-closed-card.png`,
  openingInner: `${artworkRoot}/rg-opening-inner-card.png`,
  openingTriangle: `${artworkRoot}/rg-opening-triangle-flap.png`,
  openingFront: `${artworkRoot}/rg-opening-front-frame.png`,
  botanical: `${artworkRoot}/rg-botanical-cluster-v1.png`,
  envelope: `${artworkRoot}/rg-garden-envelope-vignette-v1.png`,
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
    father: side?.father ?? fallback.father ?? '',
    mother: side?.mother ?? fallback.mother ?? '',
    address: side?.address ?? fallback.address ?? '',
  }
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
      time: data?.eventDetails?.time ?? fallback.eventDetails?.time ?? '',
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
  const nestedChildren = node.props.children === undefined
    ? undefined
    : Children.map(node.props.children, (child, index) => motionize(child, depth + 1, index))
  return cloneElement(
    node,
    {
      className: `${node.props.className ?? ''} reveal ${variant}`.trim(),
      style: { ...node.props.style, '--reveal-delay': `${Math.min((depth + siblingIndex) * 0.08, 0.56)}s` } as CSSProperties,
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

function Artwork({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />
}

function EmptyArtwork({ label, className = '' }: { label: string; className?: string }) {
  return <div className={`rg-empty-artwork ${className}`.trim()} aria-label={label}>{label}</div>
}

function FamilySide({ side, className = '' }: { side: Required<RoseGardenFamilySide>; className?: string }) {
  return (
    <div className={`rg-family-side ${className}`.trim()}>
      {side.label ? <span>{side.label}</span> : null}
      {side.father ? <strong>{side.father}</strong> : null}
      {side.mother ? <strong>{side.mother}</strong> : null}
      {side.address ? <small>{side.address}</small> : null}
    </div>
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
  const [openingState, setOpeningState] = useState<'closed' | 'opening' | 'opened'>(editorMode ? 'opened' : 'closed')
  const [rsvpChoice, setRsvpChoice] = useState<'attending' | 'declined' | null>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [rsvpValidationError, setRsvpValidationError] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [wishSubmitted, setWishSubmitted] = useState(false)
  const [wishValidationError, setWishValidationError] = useState('')
  const [wishes, setWishes] = useState<Array<{ name: string; message: string }>>([])
  const opened = openingState === 'opened'
  const connectedGuestName = interactions?.guestName?.trim() ?? ''
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
  const openingInnerAsset = mediaSource(content.openingMediaBack) || rendererDecor.openingInner
  const openingFrontAsset = mediaSource(content.openingMediaFront) || rendererDecor.openingFront
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

  const openInvitation = () => {
    if (openingState !== 'closed') return
    setOpeningState('opening')
    const reduced = typeof window.matchMedia !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finishOpening = () => {
      setOpeningState('opened')
      requestAnimationFrame(() => pageRef.current?.querySelector<HTMLElement>('[data-editor-section="cover"]')?.focus({ preventScroll: true }))
    }
    if (reduced) {
      finishOpening()
    } else {
      openingTimerRef.current = window.setTimeout(finishOpening, 2050)
    }
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
          guestName: hasGuestName ? undefined : name,
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
    if (interactions) setWishes(interactions.wishes.items.map((item) => ({ name: item.authorName, message: item.content })))
  }, [interactions?.wishes.items])

  useEffect(() => {
    if (interactions?.rsvp.submitted) setRsvpSubmitted(true)
  }, [interactions?.rsvp.submitted])

  const renderSection = (key: RoseGardenSectionKey) => {
    const sectionIndex = sectionOrder(key)
    switch (key) {
      case 'cover':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-cover" tabIndex={-1}>
            <div className="rg-cover-art">
              {content.heroMedia?.src ? (
                <Artwork src={content.heroMedia.src} alt={content.heroMedia.alt || 'Ảnh bìa thiệp'} className="rg-user-media" eager />
              ) : (
                <EmptyArtwork label="Ảnh bìa thiệp · Chưa tải ảnh" />
              )}
              <Artwork src={rendererDecor.envelope} alt="" className="rg-cover-decor" />
              <span className="rg-cover-art-index">01 / 14</span>
            </div>
            <div className="rg-cover-atmosphere" aria-hidden="true">
              <Artwork src={rendererDecor.petalCluster} alt="" className="rg-cover-petal-cluster" />
              {Array.from({ length: 9 }, (_, index) => <i key={index} className="rg-cover-petal" />)}
            </div>
            <div className="rg-cover-copy">
              <SectionEyebrow>{content.cover.eyebrow}</SectionEyebrow>
              <h2>{content.cover.title}</h2>
              <p>{content.cover.message}</p>
              <div className="rg-name-lockup"><strong>{content.couple.brideName}</strong><i>&amp;</i><strong>{content.couple.groomName}</strong></div>
              <span className="rg-date-line">{content.event.weddingDate}</span>
            </div>
          </SectionFrame>
        )
      case 'invitation':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-invitation-letter">
            <div className="rg-section-number">02 <span>/ 14</span></div>
            <SectionEyebrow>Lời mời từ khu vườn</SectionEyebrow>
            <h2>{personalize(content.invitation.title, guestName)}</h2>
            <p className="rg-lead">{personalize(content.invitation.message, guestName)}</p>
            <div className="rg-memory-triptych">
              {memoryImages.map((src, index) => (
                <figure key={`${src}-${index}`} className={`rg-memory-card rg-memory-card-${index + 1}`}>
                  {src ? <Artwork src={src} alt={`Khoảnh khắc của cô dâu chú rể ${index + 1}`} className="rg-user-media" /> : <EmptyArtwork label={`Ảnh ký ức ${index + 1} · Chưa tải ảnh`} />}
                  <figcaption>mảnh vườn {String(index + 1).padStart(2, '0')}</figcaption>
                </figure>
              ))}
            </div>
            <Artwork src={rendererDecor.botanical} alt="" className="rg-letter-decor" />
          </SectionFrame>
        )
      case 'families':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-families">
            <div className="rg-section-number">03 <span>/ 14</span></div>
            <SectionEyebrow>Hai bên gia đình</SectionEyebrow>
            <h2>{content.families.title}</h2>
            <p className="rg-family-subtitle">{content.families.subtitle}</p>
            <p className="rg-family-message">{personalize(content.families.message, guestName)}</p>
            <div className="rg-family-columns"><FamilySide side={content.families.brideSide} /><span className="rg-family-ampersand">&amp;</span><FamilySide side={content.families.groomSide} /></div>
            <Artwork src={rendererDecor.sprig} alt="" className="rg-section-decor rg-family-decor" />
          </SectionFrame>
        )
      case 'eventDetails':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-event-details">
            <div className="rg-section-number">04 <span>/ 14</span></div>
            <div className="rg-event-stamp" aria-hidden="true"><CalendarBlank weight="thin" /><span>save the date</span></div>
            <SectionEyebrow>Ngày vui của chúng mình</SectionEyebrow>
            <h2>{content.eventDetails.title}</h2>
            <div className="rg-event-date">{content.eventDetails.date}</div>
            <div className="rg-event-time"><Clock /> {content.eventDetails.time}</div>
            <p>{content.eventDetails.message}</p>
            {content.eventDetailsMedia?.src ? (
              <Artwork src={content.eventDetailsMedia.src} alt={content.eventDetailsMedia.alt || 'Ảnh thời gian hôn lễ'} className="rg-event-divider rg-user-media" />
            ) : (
              <Artwork src={rendererDecor.divider} alt="" className="rg-event-divider rg-section-decor" />
            )}
            {content.eventDetails.calendarUrl ? <a className="rg-text-link" href={content.eventDetails.calendarUrl} target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch <ArrowUpRight /></a> : null}
          </SectionFrame>
        )
      case 'countdown':
        return content.countdown.enabled ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-countdown">
            <SectionEyebrow>Đếm ngược ngày vui</SectionEyebrow>
            <div className="rg-countdown-rule"><span /><Heart weight="fill" /><span /></div>
            <h2>Hẹn gặp nhau sau</h2>
            <div className="rg-countdown-placeholder" aria-label="Đếm ngược đến ngày cưới"><strong>{content.event.weddingDate}</strong><span>Đếm ngược sẽ tự lấy từ ngày cưới khi kết nối dữ liệu sự kiện.</span></div>
          </SectionFrame>
        ) : null
      case 'timeline':
        return content.timeline.items.length ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-timeline">
            <div className="rg-section-number">05 <span>/ 14</span></div>
            <SectionEyebrow>Nhịp ngày chung đôi</SectionEyebrow>
            <h2>Một ngày, những khoảnh khắc đáng nhớ</h2>
            <ol>{content.timeline.items.map((item, index) => {
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
            })}</ol>
          </SectionFrame>
        ) : null
      case 'venue':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-venue">
            <div className="rg-section-number">06 <span>/ 14</span></div>
            <div className="rg-venue-pin"><MapPin weight="fill" /></div>
            <SectionEyebrow>Địa điểm hôn lễ</SectionEyebrow>
            <h2>{content.venue.title}</h2><strong>{content.venue.name}</strong><p>{content.venue.address}</p><p className="rg-muted-copy">{content.venue.message}</p>
            {content.venue.mapUrl ? <a className="rg-text-link" href={content.venue.mapUrl} target="_blank" rel="noreferrer">Mở Google Maps <ArrowUpRight /></a> : null}
            <Artwork src={rendererDecor.wreath} alt="" className="rg-section-decor rg-venue-decor" />
          </SectionFrame>
        )
      case 'gallery':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-gallery">
            <SectionEyebrow>Album của chúng mình</SectionEyebrow><h2>{content.gallery.title}</h2><p>{content.gallery.message}</p>
            {galleryImages.length ? (
              <div className="rg-gallery-rail">{galleryImages.map((src, index) => <figure key={`${src}-${index}`}><Artwork src={src} alt={`Khoảnh khắc trong album ${index + 1}`} className="rg-user-media" /><figcaption>0{index + 1}</figcaption></figure>)}</div>
            ) : (
              <div className="rg-gallery-empty">
                <Artwork src={rendererDecor.giftCharm} alt="" className="rg-gallery-decor" />
                <span>Ảnh album sẽ xuất hiện tại đây sau khi tải lên.</span>
              </div>
            )}
          </SectionFrame>
        )
      case 'rsvp':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-rsvp">
            <div className="rg-section-number">07 <span>/ 14</span></div><SectionEyebrow>Phản hồi trước {content.rsvp.deadline}</SectionEyebrow><h2>{content.rsvp.title}</h2><p>{content.rsvp.message}</p>
            <div className="rg-rsvp-form" aria-live="polite">
              {!hasGuestName ? <label className="rg-field"><span>Tên của bạn</span><input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} placeholder="Nguyễn Văn A" disabled={rsvpLocked} /></label> : null}
              <div className="rg-rsvp-choices" role="group" aria-label="Lựa chọn tham dự">
                <button type="button" className={rsvpChoice === 'attending' ? 'is-selected' : ''} onClick={() => setRsvpChoice('attending')} disabled={rsvpLocked || interactions?.rsvp.submitting}>{content.rsvp.attendingLabel}</button>
                <button type="button" className={rsvpChoice === 'declined' ? 'is-selected' : ''} onClick={() => setRsvpChoice('declined')} disabled={rsvpLocked || interactions?.rsvp.submitting}>{content.rsvp.notAttendingLabel}</button>
              </div>
              <button type="button" className="rg-primary-action" onClick={sendRsvp} disabled={rsvpLocked || !rsvpChoice || interactions?.rsvp.submitting}>{interactions?.rsvp.submitting ? 'Đang gửi…' : rsvpLocked ? content.rsvp.successMessage : 'Xác nhận phản hồi'} <ArrowUpRight /></button>
              {rsvpValidationError || interactions?.rsvp.error ? <p className="rg-form-error" role="alert">{rsvpValidationError || interactions?.rsvp.error}</p> : null}
              {rsvpLocked && !interactions?.rsvp.error ? <p className="rg-form-success" role="status">{content.rsvp.successMessage}</p> : null}
            </div>
            <Artwork src={rendererDecor.centerCluster} alt="" className="rg-section-decor rg-rsvp-decor" />
          </SectionFrame>
        )
      case 'guestbook':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-guestbook">
            <div className="rg-section-number">08 <span>/ 14</span></div><EnvelopeSimple className="rg-guestbook-icon" weight="thin" /><SectionEyebrow>Sổ lưu bút</SectionEyebrow><h2>{content.guestbook.title}</h2><p>{content.guestbook.message}</p>
            <div className="rg-wish-form" aria-live="polite">
              {!hasGuestName ? <label className="rg-field"><span>Tên của bạn</span><input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Nguyễn Văn A" disabled={wishLocked} /></label> : null}
              <label className="rg-field"><span>Lời chúc</span><textarea value={wishMessage} onChange={(event) => setWishMessage(event.target.value)} placeholder="Gửi đôi lời yêu thương…" rows={4} disabled={wishLocked} /></label>
              <button type="button" className="rg-primary-action" onClick={sendWish} disabled={wishLocked || !wishMessage.trim() || interactions?.wishes.submitting}>{interactions?.wishes.submitting ? 'Đang gửi…' : wishLocked ? content.guestbook.successMessage : 'Gửi lời chúc'} <Heart weight="fill" /></button>
              {wishValidationError || interactions?.wishes.error ? <p className="rg-form-error" role="alert">{wishValidationError || interactions?.wishes.error}</p> : null}
              {wishLocked && !interactions?.wishes.error ? <p className="rg-form-success" role="status">{content.guestbook.successMessage}</p> : null}
            </div>
            <div className="rg-wish-list">
              {interactions && !wishes.length ? <p className="rg-muted-copy">Chưa có lời chúc nào được duyệt.</p> : null}
              {wishes.map((wish, index) => <article key={`${wish.name}-${index}`}><Heart weight="fill" /><div><strong>{wish.name}</strong><p>{wish.message}</p></div></article>)}
            </div>
            <Artwork src={rendererDecor.sprig} alt="" className="rg-section-decor rg-guestbook-decor" />
          </SectionFrame>
        )
      case 'gift':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-gift">
            <div className="rg-section-number">09 <span>/ 14</span></div><Gift className="rg-gift-icon" weight="thin" /><SectionEyebrow>{content.gift.title}</SectionEyebrow><p>{content.gift.message}</p>
            <div className="rg-qr-placeholder">{content.giftQrMedia?.src ? <Artwork src={content.giftQrMedia.src} alt="Mã QR mừng cưới" className="rg-user-media" /> : <span>QR</span>}</div>{content.gift.thankYouMessage ? <p className="rg-muted-copy">{content.gift.thankYouMessage}</p> : null}
          </SectionFrame>
        )
      case 'music':
        return content.music.backgroundMusicUrl || editorMode ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-music">
           <div className="rg-music-disc"><MusicNote weight="duotone" /></div><div><SectionEyebrow>Nhạc nền</SectionEyebrow><strong>{content.music.backgroundMusicName || 'Chọn một bài hát cho khu vườn'}</strong></div><span className="rg-music-state">{content.music.backgroundMusicUrl ? 'Sẵn sàng' : 'Chưa chọn'}</span>
          </SectionFrame>
        ) : null
      case 'footer':
        return (
          <footer key={key} className="rg-body-section rg-motion-content is-visible rg-footer" data-editor-section={key} style={{ order: sectionIndex } as CSSProperties}>
            <Sparkle weight="duotone" className="reveal reveal--zoom-in" />
            <SectionEyebrow className="reveal reveal--slide-left">{content.footer.title}</SectionEyebrow>
            <h2 className="reveal reveal--slide-right">{content.couple.brideName} <i>&amp;</i> {content.couple.groomName}</h2>
            <p className="reveal reveal--fade-up">{content.footer.message}</p>
            {content.footerMedia?.src ? <Artwork src={content.footerMedia.src} alt={content.footerMedia.alt || 'Ảnh cuối thiệp'} className="rg-footer-media rg-user-media reveal reveal--zoom-in" /> : null}
            <span className="rg-footer-date reveal reveal--slide-down">{content.event.weddingDate}</span>
            <Artwork src={rendererDecor.wreath} alt="" className="rg-section-decor rg-footer-decor reveal reveal--slide-left" />
          </footer>
        )
      default:
        return null
    }
  }

  return (
    <div ref={pageRef} className="rg-page">
      <div className="rg-backdrop" aria-hidden="true">{glints.map((glint) => <i key={glint.id} className="rg-glint" style={{ left: glint.left, top: glint.top, width: glint.size, height: glint.size, animationDelay: glint.delay, animationDuration: glint.duration }} />)}</div>
      <ClassicCardCover
        brideName={content.couple.brideName}
        groomName={content.couple.groomName}
        date={content.event.weddingDate}
        venue={content.event.venueName}
        note={personalize(content.opening.message, guestName)}
        leftDecorationSrc={rendererDecor.botanical}
        rightDecorationSrc={rendererDecor.botanical}
        openLabel="Chạm để mở thiệp"
        openedLabel="Thiệp đã mở"
        sectionKey="opening"
        order={sectionOrder('opening')}
        isOpen={opened}
        isOpening={openingState === 'opening'}
        onOpen={openInvitation}
      />
      <main className={`rg-invitation ${opened ? 'is-opened' : 'is-closed'} ${openingState === 'opening' ? 'is-opening' : ''}`} aria-label="Thiệp cưới Rose Garden">
        <div className="rg-invitation-decor rg-invitation-decor-top" aria-hidden="true" /><div className="rg-invitation-decor rg-invitation-decor-bottom" aria-hidden="true" />
        {sectionKeys.filter((key) => key !== 'opening' && order.includes(key)).map(renderSection)}
      </main>
    </div>
  )
}
