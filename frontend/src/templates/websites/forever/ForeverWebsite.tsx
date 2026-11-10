import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { animate } from 'motion/react'
import type { ForeverData, ForeverSectionConfig, ForeverSectionKey, ForeverStoryImage } from './content'
import { foreverFixture, foreverSections } from './fixture'
import { formatCountdownUnit, useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import { formatForeverDate, toForeverDateInputValue } from './date-format'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import type { RsvpAttendance } from '../../../shared/api/weddings'
import { MusicPlayer } from '../../../shared/ui/music-player'
import './forever.css'

type Props = { data?: ForeverData; sectionConfig?: ForeverSectionConfig; editorMode?: boolean; interactions?: PublicInteractions }
const mergeForeverData = (source: unknown, defaults: unknown): unknown => {
  if (Array.isArray(source)) return source
  if (!source || typeof source !== 'object') return source ?? defaults
  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) return source
  const merged: Record<string, unknown> = { ...(defaults as Record<string, unknown>) }
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    merged[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? mergeForeverData(value, (defaults as Record<string, unknown>)[key])
      : value
  }
  return merged
}
const storyImagesForItem = (item: ForeverData['story'][number]): ForeverStoryImage[] =>
  Array.isArray(item.images)
    ? item.images
        .slice(0, 10)
        .filter((image): image is ForeverStoryImage => Boolean(image && typeof image.src === 'string' && image.src))
    : typeof item.image === 'string' && item.image
      ? [{ src: item.image, alt: item.title || 'Ảnh cột mốc' }]
      : []

export function ForeverWebsite({ data: inputData, sectionConfig = foreverSections, editorMode = false, interactions }: Props) {
  const data = mergeForeverData(inputData, foreverFixture) as ForeverData
  const pageRef = useRef<HTMLElement>(null)
  const galleryDialogRef = useRef<HTMLDialogElement>(null)
  const storyImageDialogRef = useRef<HTMLDialogElement>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [activeAlbum, setActiveAlbum] = useState<'gallery' | 'couple'>('gallery')
  const [storyPreviewAlbum, setStoryPreviewAlbum] = useState<{ title: string; images: ForeverStoryImage[]; index: number } | null>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpAttendance, setRsvpAttendance] = useState<RsvpAttendance | ''>('')
  const [rsvpFormError, setRsvpFormError] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [wishFormError, setWishFormError] = useState('')
  const galleryImages = data.gallery.images.slice(0, 10)
  const coupleAlbumImages = Array.isArray(data.couple.albumImages) ? data.couple.albumImages.slice(0, 25).filter((image) => typeof image?.src === 'string' && image.src.length > 0) : []
  const lightboxImages = activeAlbum === 'couple' ? coupleAlbumImages : galleryImages
  const displayDate = formatForeverDate(data.hero.date)
  const weddingDateParts = toForeverDateInputValue(data.hero.date).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const storyHeading = typeof data.storyHeading === 'string' ? data.storyHeading : foreverFixture.storyHeading
  const storyItems = Array.isArray(data.story) ? data.story : foreverFixture.story
  const venueHeading = data.venues.heading.split(/\||\r?\n/)
  const dressCodeColors = Array.isArray(data.dressCode.colors) ? data.dressCode.colors : []
  const legacyMusic = data.music as typeof data.music & {
    musicTrackId?: string | null
    autoplay?: boolean
    projection?: { src?: string; title?: string } | null
  }
  const musicSrc = data.music.backgroundMusicUrl || legacyMusic.projection?.src || legacyMusic.musicTrackId || ''
  const musicTitle = data.music.backgroundMusicName || legacyMusic.projection?.title || 'Nhạc nền'
  const musicAutoplay = data.music.backgroundMusicAutoplay ?? legacyMusic.autoplay ?? true
  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (interactions?.rsvp.submitted || interactions?.rsvp.submitting) return
    const name = rsvpName.trim()
    if (!name || !rsvpAttendance) {
      setRsvpFormError('Nhập tên và chọn phản hồi tham dự nhé.')
      return
    }
    if (!interactions) {
      setRsvpFormError('Tính năng xác nhận sẽ dùng được khi website được công khai.')
      return
    }
    setRsvpFormError('')
    await interactions.rsvp.submit({ guestName: name, attendance: rsvpAttendance, partySize: 1 })
  }
  const submitWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (interactions?.wishes.submitted || interactions?.wishes.submitting) return
    const name = wishName.trim()
    const content = wishMessage.trim()
    if (!name || !content) {
      setWishFormError('Nhập tên và lời chúc trước khi gửi nhé.')
      return
    }
    if (!interactions) {
      setWishFormError('Tính năng gửi lời chúc sẽ dùng được khi website được công khai.')
      return
    }
    setWishFormError('')
    await interactions.wishes.submit({ guestName: name, content })
  }
  const storedEvents = (data as unknown as { events: unknown }).events
  const eventData = Array.isArray(storedEvents)
    ? { ...foreverFixture.events, items: storedEvents as ForeverData['events']['items'] }
    : {
        ...foreverFixture.events,
        ...(storedEvents && typeof storedEvents === 'object' ? storedEvents : {}),
        summary: {
          ...foreverFixture.events.summary,
          ...(storedEvents && typeof storedEvents === 'object' && (storedEvents as ForeverData['events']).summary
            ? (storedEvents as ForeverData['events']).summary
            : {}),
        },
        items: storedEvents && typeof storedEvents === 'object' && Array.isArray((storedEvents as ForeverData['events']).items)
          ? (storedEvents as ForeverData['events']).items
          : foreverFixture.events.items,
      }
  const eventDateParts = eventData.summary.date.split('.')
  const eventStampDay = weddingDateParts?.[3] ?? eventDateParts[0] ?? ''
  const eventStampMonthYear = weddingDateParts
    ? `${weddingDateParts[2]} / ${weddingDateParts[1].slice(-2)}`
    : `${eventDateParts[1] ?? ''} / ${eventDateParts[2] ?? ''}`
  const eventStampWeekday = weddingDateParts
    ? new Intl.DateTimeFormat('vi-VN', { weekday: 'long' })
        .format(new Date(Number(weddingDateParts[1]), Number(weddingDateParts[2]) - 1, Number(weddingDateParts[3])))
        .toLocaleUpperCase('vi-VN')
    : eventData.summary.weekday
  const marqueeImages = galleryImages.length
    ? Array.from({ length: Math.max(4, galleryImages.length) }, (_, index) => galleryImages[index % galleryImages.length])
    : []
  const visible = new Set(sectionConfig.enabled)
  const musicEnabled = visible.has('music')
  const decorBySection: Partial<Record<ForeverSectionKey, React.ReactNode>> = {
    announcement: <img className="ff-decor ff-decor--ribbon" src="/assets/images/templates/forever/decor/detail-black-silk-ribbon-pen.webp" alt="" aria-hidden="true" />,
    couple: <img className="ff-decor ff-decor--rings" src="/assets/images/templates/forever/decor/detail-brushed-silver-bands.webp" alt="" aria-hidden="true" />,
    story: <img className="ff-decor ff-decor--booklet" src="/assets/images/templates/forever/decor/detail-vows-booklet.webp" alt="" aria-hidden="true" />,
    countdown: <img className="ff-decor ff-decor--plate" src="/assets/images/templates/forever/decor/background-two-curved-black-lines-v1.webp" alt="" aria-hidden="true" />,
    rsvp: <picture className="ff-decor ff-decor--curves"><source media="(max-width: 760px)" srcSet="/assets/images/templates/forever/decor/background-two-black-curves-mobile.svg" /><img src="/assets/images/templates/forever/decor/background-two-black-curves.svg" alt="" aria-hidden="true" /></picture>,
  }
  const section = (key: ForeverSectionKey, content: React.ReactNode) => visible.has(key) ? <div key={key} data-editor-section={key} data-motion="section" style={{ order: sectionConfig.order.indexOf(key) }}>{content}{decorBySection[key]}</div> : null
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return
    page.querySelectorAll<HTMLElement>('.ff-decor').forEach((decor) => {
      decor.removeAttribute('data-motion-item')
      decor.removeAttribute('data-motion-visible')
      decor.style.removeProperty('--ff-item-delay')
      decor.style.removeProperty('opacity')
      decor.style.removeProperty('transform')
    })
    page.querySelectorAll<HTMLElement>('.ff-story-item').forEach((item) => {
      item.removeAttribute('data-motion-item')
      item.removeAttribute('data-motion-visible')
      item.style.removeProperty('--ff-item-delay')
      item.style.removeProperty('opacity')
      item.style.removeProperty('transform')
    })
    page.querySelectorAll<HTMLElement>('[data-editor-section="announcement"] .ff-kicker').forEach((kicker) => {
      const text = kicker.textContent ?? ''
      kicker.setAttribute('data-ff-kicker-text', text)
      const charCount = Array.from(text).length
      kicker.style.setProperty('--ff-kicker-steps', String(charCount))
      kicker.style.setProperty('--ff-kicker-duration', `${(charCount * 0.18 + 1).toFixed(2)}s`)
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const storyList = page.querySelector<HTMLElement>('.ff-story-list')
    const storySection = page.querySelector<HTMLElement>('[data-editor-section="story"]')
    let storyTraceFrame = 0
    let storyTraceElapsed = 0
    let storyTraceLastFrame = 0
    const storyTraceSpeed = 45
    let storyTraceEnd = 34
    let storyTravelDuration = 1
    let storyItems: HTMLElement[] = []
    let storyNodePositions: number[] = []
    let activeStoryIndex = -1
    let activeStoryNodeIndex = -1
    let traceWasVisible = false
    let storyResizeObserver: ResizeObserver | null = null
    const measureStoryNodes = () => {
      if (!storyList) return
      storyItems = Array.from(storyList.querySelectorAll<HTMLElement>('.ff-story-item'))
      storyTraceEnd = Math.max(34, storyList.clientHeight - 34)
      storyTravelDuration = Math.max(1, storyTraceEnd - 34) / storyTraceSpeed
      const listTop = storyList.getBoundingClientRect().top
      storyNodePositions = storyItems.map((item) => item.getBoundingClientRect().top - listTop + 37)
      storyItems.forEach((item) => storyResizeObserver?.observe(item))
    }
    measureStoryNodes()
    if (storyList && 'ResizeObserver' in window) {
      storyResizeObserver = new ResizeObserver(measureStoryNodes)
      storyResizeObserver.observe(storyList)
      storyItems.forEach((item) => storyResizeObserver?.observe(item))
    }
    const stopStoryTrace = () => {
      if (storyTraceFrame) cancelAnimationFrame(storyTraceFrame)
      storyTraceFrame = 0
      storyTraceLastFrame = 0
      if (activeStoryIndex >= 0) storyItems[activeStoryIndex]?.removeAttribute('data-story-current')
      if (activeStoryNodeIndex >= 0) storyItems[activeStoryNodeIndex]?.removeAttribute('data-story-node-active')
      activeStoryIndex = -1
      activeStoryNodeIndex = -1
      traceWasVisible = false
      storyList?.style.setProperty('--ff-story-trace-opacity', '0')
    }
    const updateStoryTrace = (now: number) => {
      if (!storyList || !storyItems.length) {
        storyTraceFrame = 0
        return
      }
      if (storyTraceLastFrame) storyTraceElapsed += Math.min((now - storyTraceLastFrame) / 1000, 0.05)
      storyTraceLastFrame = now
      const start = 34
      const cycleDuration = storyTravelDuration + 1.2
      const phase = storyTraceElapsed % cycleDuration
      const traveling = phase < storyTravelDuration
      const top = traveling ? Math.min(storyTraceEnd, start + phase * storyTraceSpeed) : storyTraceEnd
      storyList.style.setProperty('--ff-story-trace-y', `${(top - start).toFixed(1)}px`)
      if (traveling !== traceWasVisible) {
        storyList.style.setProperty('--ff-story-trace-opacity', traveling ? '0.9' : '0')
        traceWasVisible = traveling
      }

      let nearestIndex = -1
      let nearestDistance = Number.POSITIVE_INFINITY
      storyNodePositions.forEach((markerY, index) => {
        const markerDistance = markerY - top
        if (Math.abs(markerDistance) < nearestDistance) {
          nearestDistance = Math.abs(markerDistance)
          nearestIndex = index
        }
      })
      const markerDistance = nearestIndex >= 0 ? storyNodePositions[nearestIndex] - top : Number.NEGATIVE_INFINITY
      const currentIndex = markerDistance >= -(storyTraceSpeed * 2) && markerDistance <= storyTraceSpeed * 0.5 && traveling ? nearestIndex : -1
      const activeNodeIndex = markerDistance >= 0 && markerDistance <= storyTraceSpeed * 0.5 && traveling ? nearestIndex : -1
      if (currentIndex !== activeStoryIndex) {
        if (activeStoryIndex >= 0) storyItems[activeStoryIndex]?.removeAttribute('data-story-current')
        if (currentIndex >= 0) storyItems[currentIndex]?.setAttribute('data-story-current', 'true')
        activeStoryIndex = currentIndex
      }
      if (activeNodeIndex !== activeStoryNodeIndex) {
        if (activeStoryNodeIndex >= 0) storyItems[activeStoryNodeIndex]?.removeAttribute('data-story-node-active')
        if (activeNodeIndex >= 0) storyItems[activeNodeIndex]?.setAttribute('data-story-node-active', 'true')
        activeStoryNodeIndex = activeNodeIndex
      }
      storyTraceFrame = requestAnimationFrame(updateStoryTrace)
    }
    const startStoryTrace = () => {
      if (!storyList || storyTraceFrame || document.hidden) return
      storyTraceLastFrame = 0
      storyTraceFrame = requestAnimationFrame(updateStoryTrace)
    }
    page.classList.add('ff-motion-ready')
    const itemSelectors = [
      '.ff-hero-top, .ff-hero-title, .ff-hero-bottom',
      '.ff-announcement > *', '.ff-intro-photo, .ff-intro-photo img, .ff-intro-copy > *',
      '.ff-story > .ff-section-heading > *, .ff-story-item',
      '.ff-date-stamp > *, .ff-event-intro > *, .ff-event-agenda-heading > *, .ff-event-grid article, .ff-event-grid article > *',
      '.ff-activities-heading > *, .ff-activity-card, .ff-activity-card > img, .ff-activity-card > div > *',
      '.ff-countdown > *, .ff-countdown-clock > *, .ff-venue > img, .ff-venue > div > *',
      '.ff-gallery-heading > *, .ff-gallery-heading > div > *',
      '.ff-details-note > *, .ff-details-note > * > *',
      '.ff-wedding-party .ff-section-heading > *, .ff-party-group, .ff-party-group article, .ff-party-group article > *',
      '.ff-faq > div > *, .ff-faq-list details, .ff-faq-list summary', '.ff-rsvp > *', '.ff-gift > *',
      '.ff-guestbook > div > *, .ff-guestbook > a', '.ff-footer > *, .ff-footer > div > *',
    ]
    itemSelectors.forEach((selector) => page.querySelectorAll<HTMLElement>(selector).forEach((item) => {
      if (item.closest('[aria-hidden="true"]')) return
      item.setAttribute('data-motion-item', '')
      item.setAttribute('data-motion-kind', item.matches('.ff-intro-photo img, .ff-venue > img, .ff-activity-card > img, .ff-party-group article > img') ? 'image' : item.matches('.ff-kicker, h1, h2, h3, .ff-event-agenda-heading') ? 'heading' : 'detail')
      const siblings = Array.from(item.parentElement?.querySelectorAll<HTMLElement>(':scope > [data-motion-item]') ?? [])
      item.style.setProperty('--ff-item-delay', `${Math.min(siblings.indexOf(item) * 120, 480)}ms`)
    }))
    const targets = Array.from(page.querySelectorAll<HTMLElement>('[data-motion="section"], [data-motion-item]'))
    const sections = Array.from(page.querySelectorAll<HTMLElement>('[data-motion="section"]'))
    const heroSection = page.querySelector<HTMLElement>('[data-editor-section="hero"]')
    const heroTargets = new Set<HTMLElement>()
    if (heroSection) {
      heroTargets.add(heroSection)
      heroSection.querySelectorAll<HTMLElement>('[data-motion-item]').forEach((target) => heroTargets.add(target))
      heroTargets.forEach((target) => target.setAttribute('data-motion-visible', 'true'))
    }
    const revealTimers = new Set<number>()
    const revealTarget = (target: HTMLElement) => {
      target.setAttribute('data-motion-visible', 'true')
      const keyframes = target.dataset.motionKind === 'image'
        ? { opacity: [0, 1], scale: 1 }
        : { opacity: [0, 1], y: 0 }
      void animate(target, keyframes, { duration: 1.3, ease: [0.42, 0, 0.58, 1] })
    }
    const scheduleReveal = (target: HTMLElement) => {
      const stagger = Number.parseFloat(target.style.getPropertyValue('--ff-item-delay')) || 0
      const timer = window.setTimeout(() => {
        revealTimers.delete(timer)
        revealTarget(target)
      }, 500 + stagger)
      revealTimers.add(timer)
    }
    const effectsObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute('data-effects-active', String(entry.isIntersecting))
        if (entry.target === storySection) {
          if (entry.isIntersecting) startStoryTrace()
          else stopStoryTrace()
        }
      })
    }, { threshold: 0 }) : null
    sections.forEach((section) => {
      if (effectsObserver) effectsObserver.observe(section)
      else section.setAttribute('data-effects-active', 'true')
    })
    if (!effectsObserver && storySection) startStoryTrace()
    const syncDocumentVisibility = () => {
      page.classList.toggle('ff-document-hidden', document.hidden)
      if (document.hidden) stopStoryTrace()
      else if (storySection?.getAttribute('data-effects-active') === 'true') startStoryTrace()
    }
    document.addEventListener('visibilitychange', syncDocumentVisibility)
    syncDocumentVisibility()
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => {
        if (!heroTargets.has(target)) scheduleReveal(target)
      })
      return () => {
        revealTimers.forEach((timer) => window.clearTimeout(timer))
        revealTimers.clear()
        effectsObserver?.disconnect()
        storyResizeObserver?.disconnect()
        stopStoryTrace()
        document.removeEventListener('visibilitychange', syncDocumentVisibility)
        page.classList.remove('ff-motion-ready')
      }
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        scheduleReveal(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      })
    }, { threshold: 0, rootMargin: '0px' })
    targets.forEach((target) => {
      if (!heroTargets.has(target)) observer.observe(target)
    })
    return () => {
      revealTimers.forEach((timer) => window.clearTimeout(timer))
      revealTimers.clear()
      observer.disconnect()
      effectsObserver?.disconnect()
      storyResizeObserver?.disconnect()
      stopStoryTrace()
      document.removeEventListener('visibilitychange', syncDocumentVisibility)
      page.classList.remove('ff-motion-ready')
    }
  }, [])
  useEffect(() => {
    const dialog = galleryDialogRef.current
    if (!dialog) return
    if (galleryOpen && !dialog.open) dialog.showModal()
    if (!galleryOpen && dialog.open) dialog.close()
  }, [galleryOpen])
  const storyPreviewOpen = Boolean(storyPreviewAlbum)
  useEffect(() => {
    const dialog = storyImageDialogRef.current
    if (!dialog) return
    if (storyPreviewOpen && !dialog.open) dialog.showModal()
    if (!storyPreviewOpen && dialog.open) dialog.close()
  }, [storyPreviewOpen])
  const storyPreviewCount = storyPreviewAlbum?.images.length ?? 0
  useEffect(() => {
    if (storyPreviewCount < 2) return
    const handleStoryAlbumKeys = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      setStoryPreviewAlbum((current) => {
        if (!current || current.images.length < 2) return current
        const direction = event.key === 'ArrowRight' ? 1 : -1
        return { ...current, index: (current.index + direction + current.images.length) % current.images.length }
      })
    }
    window.addEventListener('keydown', handleStoryAlbumKeys)
    return () => window.removeEventListener('keydown', handleStoryAlbumKeys)
  }, [storyPreviewCount])
  useEffect(() => {
    if (!galleryOpen) return
    const handleGalleryKeys = (event: KeyboardEvent) => {
      const count = lightboxImages.length
      if (!count) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setGalleryIndex((index) => (index + 1) % count)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setGalleryIndex((index) => (index - 1 + count) % count)
      }
    }
    window.addEventListener('keydown', handleGalleryKeys)
    return () => window.removeEventListener('keydown', handleGalleryKeys)
  }, [activeAlbum, lightboxImages.length, galleryOpen])
  const musicControl = musicEnabled && (musicSrc || editorMode)
    ? <MusicPlayer src={musicSrc} title={musicTitle} autoplay={musicAutoplay} autoplayDelayMs={1000} active={musicEnabled} editorMode={editorMode} sectionKey="music" />
    : null
  const currentGalleryIndex = Math.min(galleryIndex, Math.max(0, lightboxImages.length - 1))
  const currentGalleryImage = lightboxImages[currentGalleryIndex]
  const moveGallery = (direction: number) => {
    const count = lightboxImages.length
    if (count) setGalleryIndex((index) => (index + direction + count) % count)
  }
  const moveStoryPreview = (direction: number) => setStoryPreviewAlbum((current) => {
    if (!current || current.images.length < 2) return current
    return { ...current, index: (current.index + direction + current.images.length) % current.images.length }
  })
  const storyPreviewImage = storyPreviewAlbum?.images[storyPreviewAlbum.index]
  const publicWishes = interactions?.wishes.items ?? []
  const publicWishesMarquee = publicWishes.length > 6
  const publicWishesMarkup = publicWishes.length ? (
    <div className="ff-public-wishes" aria-live="polite">
      <h3>Lời chúc gửi đến hai bạn</h3>
      <div
        className={`ff-public-wishes-list${publicWishesMarquee ? ' is-marquee' : ''}`}
        role="region"
        aria-label="Lời chúc đã nhận"
        tabIndex={0}
        style={{ '--ff-public-wishes-duration': `${Math.max(16.8, publicWishes.length * 4.9)}s` } as React.CSSProperties}
      >
        <div className="ff-public-wishes-track">
          <div className="ff-public-wishes-group">
            {publicWishes.map((wish) => (
              <article key={wish.id}>
                <p>{wish.content}</p>
                <small>{wish.authorName}</small>
              </article>
            ))}
          </div>
          {publicWishesMarquee ? (
            <div className="ff-public-wishes-group" aria-hidden="true">
              {publicWishes.map((wish) => (
                <article key={`${wish.id}-duplicate`}>
                  <p>{wish.content}</p>
                  <small>{wish.authorName}</small>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null
  const gallerySequence = (duplicate = false) => <div className="ff-photo-sequence" aria-hidden={duplicate || undefined}>
    {marqueeImages.map((image, index) => {
      const photoIndex = index % galleryImages.length
      return <figure key={(duplicate ? 'loop-' : 'photo-') + index + '-' + image.src}>
      <button type="button" tabIndex={duplicate ? -1 : undefined} aria-label={duplicate ? undefined : 'Mở ảnh ' + (photoIndex + 1) + ': ' + image.alt} onClick={duplicate ? undefined : () => { setActiveAlbum('gallery'); setGalleryIndex(photoIndex); setGalleryOpen(true) }}>
        <img src={image.src} alt={duplicate ? '' : image.alt} loading="eager" decoding="async" />
      </button>
      <figcaption>FRAME {String(photoIndex + 1).padStart(2, '0')}</figcaption>
    </figure>
    })}
  </div>
  const galleryLightbox = <dialog ref={galleryDialogRef} className="ff-gallery-lightbox" aria-label={activeAlbum === 'couple' ? 'Album câu chuyện của chúng mình' : 'Album ảnh của chúng mình'} onClose={() => setGalleryOpen(false)} onCancel={() => setGalleryOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setGalleryOpen(false) }}>
    <div className="ff-lightbox-inner">
      <div className="ff-lightbox-top"><span>{String(currentGalleryIndex + 1).padStart(2, '0')} / {String(lightboxImages.length).padStart(2, '0')}</span><button type="button" className="ff-lightbox-close" aria-label="Đóng album ảnh" onClick={() => setGalleryOpen(false)}>×</button></div>
      {currentGalleryImage ? <><div className="ff-lightbox-stage"><button type="button" className="ff-lightbox-arrow" aria-label="Ảnh trước" disabled={lightboxImages.length < 2} onClick={() => moveGallery(-1)}>←</button><figure className="ff-lightbox-photo"><img src={currentGalleryImage.src} alt={currentGalleryImage.alt} /><figcaption>{currentGalleryImage.alt}</figcaption></figure><button type="button" className="ff-lightbox-arrow" aria-label="Ảnh tiếp theo" disabled={lightboxImages.length < 2} onClick={() => moveGallery(1)}>→</button></div><div className="ff-lightbox-thumbnails">{lightboxImages.map((image, index) => <button key={image.src} type="button" aria-label={`Mở ảnh ${index + 1}`} aria-current={index === currentGalleryIndex} onClick={() => setGalleryIndex(index)}><img src={image.src} alt="" /></button>)}</div></> : <p className="ff-lightbox-empty">Album chưa có ảnh.</p>}
    </div>
  </dialog>
  const storyImageLightbox = <dialog ref={storyImageDialogRef} className="ff-gallery-lightbox ff-story-lightbox" aria-label={storyPreviewAlbum?.title ? `Album ảnh cột mốc: ${storyPreviewAlbum.title}` : 'Album ảnh cột mốc'} onClose={() => setStoryPreviewAlbum(null)} onCancel={() => setStoryPreviewAlbum(null)} onClick={(event) => { if (event.target === event.currentTarget) setStoryPreviewAlbum(null) }}>
    <div className="ff-lightbox-inner">
      <div className="ff-lightbox-top"><span>{storyPreviewAlbum ? `${storyPreviewAlbum.title} · ${String(storyPreviewAlbum.index + 1).padStart(2, '0')} / ${String(storyPreviewCount).padStart(2, '0')}` : 'ẢNH CỘT MỐC'}</span><button type="button" className="ff-lightbox-close" aria-label="Đóng album ảnh" onClick={() => setStoryPreviewAlbum(null)}>×</button></div>
      {storyPreviewImage ? <><div className="ff-lightbox-stage"><button type="button" className="ff-lightbox-arrow" aria-label="Ảnh trước" disabled={storyPreviewCount < 2} onClick={() => moveStoryPreview(-1)}>←</button><figure className="ff-lightbox-photo"><img src={storyPreviewImage.src} alt={storyPreviewImage.alt || storyPreviewAlbum?.title || ''} /><figcaption>{storyPreviewImage.alt || storyPreviewAlbum?.title}</figcaption></figure><button type="button" className="ff-lightbox-arrow" aria-label="Ảnh tiếp theo" disabled={storyPreviewCount < 2} onClick={() => moveStoryPreview(1)}>→</button></div>{storyPreviewCount > 1 ? <div className="ff-lightbox-thumbnails">{storyPreviewAlbum?.images.map((image, index) => <button key={`${image.src}-${index}`} type="button" aria-label={`Mở ảnh ${index + 1}`} aria-current={index === storyPreviewAlbum.index} onClick={() => setStoryPreviewAlbum((current) => current ? { ...current, index } : current)}><img src={image.src} alt="" /></button>)}</div> : null}</> : null}
    </div>
  </dialog>
  const hero = section('hero', <section className="ff-hero" id="top" data-motion-hero><img className="ff-hero-image" src={data.hero.image} alt={data.hero.imageAlt} /><div className="ff-hero-shade" /><div className="ff-hero-top">{data.hero.eyebrow ? <span>{data.hero.eyebrow}</span> : null}<span>EST. 2026 · VIETNAM</span></div><div className="ff-hero-title"><p>{data.hero.headline}</p><h1>{data.hero.brideName} <i>&</i> {data.hero.groomName}</h1></div><div className="ff-hero-bottom"><span>{displayDate}<br />{data.hero.time}</span><span className="ff-scroll-cue">SCROLL TO EXPLORE <span className="ff-scroll-cue-icon" aria-hidden="true">↓</span></span><span>{data.hero.location}</span></div></section>)
  const events = eventData.items.length ? section('events', (
    <section className="ff-event-chapter" id="details">
      <div className="ff-event-overview">
        <div className="ff-date-stamp">
          <span className="ff-kicker">{eventData.dateEyebrow}</span>
          <div className="ff-date-main">
            <strong>{eventStampDay}</strong>
            <div>
              <span className="ff-date-weekday">{eventStampWeekday}</span>
              <span className="ff-date-month">{eventStampMonthYear}</span>
            </div>
          </div>
        </div>
        <div className="ff-event-intro">
          <span className="ff-kicker">{eventData.introEyebrow}</span>
          <h2>{eventData.introHeading.split('|')[0]}{eventData.introHeading.includes('|') ? <><br /><em>{eventData.introHeading.split('|').slice(1).join('|').replaceAll('{location}', data.hero.location)}</em></> : null}</h2>
          <p>{eventData.introMessage}</p>
          <div className="ff-event-meta">
            <div><span>GIỜ ĐÓN KHÁCH</span><p>{eventData.summary.hours}</p></div>
            <div><span>ĐỊA ĐIỂM</span><p>{eventData.summary.venue}</p></div>
          </div>
        </div>
      </div>
      <div className="ff-event-agenda">
        <div className="ff-event-agenda-heading"><span>{eventData.agendaHeading}</span><span>THE CELEBRATION</span></div>
        <div className={`ff-event-grid${eventData.items.length > 1 ? ' ff-event-grid--marquee' : ''}`} style={{ '--ff-event-marquee-duration': `${Math.max(eventData.items.length * 10, 24)}s`, '--ff-event-marquee-mobile-duration': `${Math.max(eventData.items.length * 10, 24) / 1.2}s` } as React.CSSProperties}>
          <div className="ff-event-track">
            {[...eventData.items, ...(eventData.items.length > 1 ? eventData.items : [])].map((event, index) => {
              const duplicate = index >= eventData.items.length
              return <article key={`${event.type || event.title || 'event'}-${index}`} aria-hidden={duplicate || undefined}>
                <span className="ff-event-index">{event.type || `${String((index % eventData.items.length) + 1).padStart(2, '0')} / EVENT`}</span>
                <h3>{event.title}</h3>
                <p className="ff-event-time">{event.time} · {event.date}</p>
                <p>{event.venue}<br />{event.address}</p>
                {event.mapUrl ? <a href={event.mapUrl} tabIndex={duplicate ? -1 : undefined} target="_blank" rel="noreferrer">Mở bản đồ ↗</a> : null}
              </article>
            })}
          </div>
        </div>
      </div>
    </section>
  )) : null
  const activities = data.activities.items.length ? <section className="ff-activities" id="activities">
    <header className="ff-activities-heading"><span className="ff-kicker">CÙNG VUI TRONG NGÀY CƯỚI</span><h2>{data.activities.heading.split('|')[0]}<br /><em>{data.activities.heading.split('|')[1]}</em></h2></header>
    <div className="ff-activities-grid">{data.activities.items.map((activity, index) => <article className="ff-activity-card" key={`${activity.title}-${index}`}><img src={activity.image} alt="" loading="lazy" /><div><span>{String(index + 1).padStart(2, '0')}</span><h3>{activity.title}</h3></div></article>)}</div>
  </section> : null
  const details = visible.has('dressCode') ? <section className="ff-details-note" data-motion="section">
    {visible.has('dressCode') ? <div className="ff-dress-code"><div><span className="ff-kicker">WHAT TO WEAR</span><h2>{data.dressCode.heading.split('|')[0]}<br /><em>{data.dressCode.heading.split('|')[1]}</em></h2><p>{data.dressCode.message}</p></div><div className="ff-dress-code-palette"><span className="ff-kicker">Dresscode</span><div className="ff-swatches" aria-label="Gợi ý màu trang phục">{dressCodeColors.map((color, index) => <i key={index} style={{ background: color }} />)}</div></div></div> : null}
  </section> : null
  const mapped: Partial<Record<ForeverSectionKey, React.ReactNode>> = {
    hero,
    announcement: <section className="ff-announcement" id="announcement"><span className="ff-kicker" data-kicker-typewriter>A NOTE TO OUR FAVORITE PEOPLE</span><p>{data.announcement.message}</p><span className="ff-signature">Thân mời, {data.hero.brideName} &amp; {data.hero.groomName}</span></section>,
    couple: <section className="ff-intro" id="couple"><div className="ff-intro-photo"><img src={data.couple.image} alt={`Ảnh cưới của ${data.hero.brideName} và ${data.hero.groomName}`} /></div><div className="ff-intro-copy"><span className="ff-kicker">TWO PEOPLE, ONE HOME</span><h2>Chúng mình là<br /><em>{data.hero.brideName} & {data.hero.groomName}.</em></h2><p>{data.couple.bio}</p>{coupleAlbumImages.length > 0 ? <button className="ff-text-link ff-open-album" type="button" onClick={() => { setActiveAlbum('couple'); setGalleryIndex(0); setGalleryOpen(true) }}>Xem câu chuyện của chúng mình <span>↗</span></button> : null}</div></section>,
    story: storyItems.length ? <section className="ff-story" id="story"><div className="ff-section-heading"><span className="ff-kicker">NHỮNG MỐC ĐÁNG NHỚ</span><h2>{storyHeading.split('\n')[0]}<br /><em>{storyHeading.split('\n')[1] ?? ''}</em></h2></div><div className="ff-story-list">{storyItems.map((item, index) => {
      const images = storyImagesForItem(item)
      return <article className="ff-story-item" key={item.date || item.year || index}><span>{formatForeverDate(item.date || item.year || '').replaceAll(' — ', '.')}</span><div><h3>{item.title}</h3><p>{item.body}</p>{images.length ? <button className="ff-text-link ff-story-photo-link" type="button" onClick={() => setStoryPreviewAlbum({ title: item.title, images, index: 0 })}>{images.length > 1 ? `Xem ${images.length} ảnh` : 'Xem ảnh'} <span aria-hidden="true">↗</span></button> : null}</div><span className="ff-story-mark" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></article>
    })}</div></section> : null,
    events,
    activities,
    countdown: <section className="ff-countdown"><div className="ff-countdown-copy"><span className="ff-kicker">ĐẾM NGƯỢC NGÀY CƯỚI</span><h2>Còn bao lâu<br /><em>đến ngày cưới?</em></h2><p>{data.countdown.message}</p></div><ForeverCountdown date={data.hero.date} time={data.hero.time} /></section>,
    venues: <section className="ff-venue"><img src={data.venues.image} alt={`Địa điểm tổ chức tại ${data.hero.location}`} /><div><span className="ff-kicker">A LITTLE NOTE ON GETTING HERE</span><h2>{venueHeading[0]}<br /><em>{venueHeading[1] ?? ''}</em></h2><p>{data.venues.note}</p>{data.venues.mapUrl ? <a href={data.venues.mapUrl} target="_blank" rel="noreferrer" className="ff-text-link">{data.venues.address} ↗</a> : <p className="ff-text-link">{data.venues.address}</p>}</div></section>,
    gallery: galleryImages.length ? <section className="ff-gallery" id="gallery">
      <div className="ff-gallery-heading"><div><span className="ff-kicker">LITTLE MOMENTS, KEPT</span><h2>{data.gallery.heading.split('|')[0]}<br /><em>{data.gallery.heading.split('|')[1]}</em></h2></div><span>01 — {String(galleryImages.length).padStart(2, '0')}</span></div>
      <div className="ff-photo-marquee" role="region" aria-label="Album ảnh, chạy tự động từ phải sang trái">
        <div className="ff-photo-track" style={{ animationDuration: (Math.max(marqueeImages.length, 1) * 6 / 1.2) + 's' }}>{gallerySequence()}{gallerySequence(true)}</div>
      </div>
    </section> : null,
    weddingParty: data.weddingParty.groups.length ? <section className="ff-wedding-party"><div className="ff-section-heading"><span className="ff-kicker">OUR PEOPLE</span><h2>{data.weddingParty.title ?? 'Những người đồng hành'}</h2></div><div className="ff-party-groups">{data.weddingParty.groups.map((group) => <div className="ff-party-group" key={group.id}><h3>{group.title}</h3><div>{group.members.map((member) => <article key={member.id}>{member.portraitUrl ? <img src={member.portraitUrl} alt={member.name} loading="lazy" /> : <div className="ff-party-initials" aria-hidden="true">{member.name.trim().charAt(0).toLocaleUpperCase()}</div>}<h4>{member.name}</h4>{member.role ? <span>{member.role}</span> : null}{member.biography ? <p>{member.biography}</p> : null}</article>)}</div></div>)}</div></section> : null,
    dressCode: details,
    faq: data.faq.items.length ? <section className="ff-faq"><div><span className="ff-kicker">GOOD TO KNOW</span><h2>Một vài điều<br /><em>bạn có thể hỏi.</em></h2></div><div className="ff-faq-list">{data.faq.items.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section> : null,
    rsvp: <section className="ff-rsvp" id="rsvp"><span className="ff-kicker">YOUR COMPANY MEANS EVERYTHING</span><h2>{data.rsvp.heading}</h2><p>{data.rsvp.message}</p>{interactions?.rsvp.submitted ? <p className="ff-form-success" role="status">Cảm ơn bạn đã phản hồi.</p> : <form className="ff-rsvp-form" onSubmit={(event) => void submitRsvp(event)} noValidate><input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} autoComplete="name" aria-label="Tên của bạn" placeholder="Tên của bạn ..." /><div className="ff-rsvp-choices"><button type="button" aria-pressed={rsvpAttendance === 'ATTENDING'} className={rsvpAttendance === 'ATTENDING' ? 'is-selected' : ''} onClick={() => setRsvpAttendance('ATTENDING')}>Mình sẽ đến</button><button type="button" aria-pressed={rsvpAttendance === 'DECLINED'} className={rsvpAttendance === 'DECLINED' ? 'is-selected' : ''} onClick={() => setRsvpAttendance('DECLINED')}>Không tham dự</button></div><button className="ff-submit-button" type="submit" disabled={!rsvpName.trim() || !rsvpAttendance || interactions?.rsvp.submitting}>{interactions?.rsvp.submitting ? 'Đang gửi…' : 'Xác nhận tham dự'}</button>{rsvpFormError || interactions?.rsvp.error ? <small className="ff-form-error" role="alert">{rsvpFormError || interactions?.rsvp.error}</small> : null}</form>}<small>{data.rsvp.note}</small></section>,
    gift: <section className="ff-gift"><span className="ff-kicker">YOUR PRESENCE IS THE PRESENT</span><h2>{data.gift.heading}</h2><p>{data.gift.message}</p>{data.gift.qrImage ? <figure className="ff-gift-qr"><img src={data.gift.qrImage} alt="Mã QR chuyển khoản mừng cưới" loading="lazy" /></figure> : null}</section>,
    guestbook: <section className="ff-guestbook" id="guestbook"><div><span className="ff-kicker">LEAVE A LITTLE LOVE</span><h2>{data.guestbook.heading}</h2></div><div className="ff-guestbook-content">{interactions?.wishes.submitted ? <p className="ff-form-success" role="status">Cảm ơn bạn đã gửi lời chúc.</p> : <form className="ff-guestbook-form" onSubmit={(event) => void submitWish(event)} noValidate><input value={wishName} onChange={(event) => setWishName(event.target.value)} autoComplete="name" aria-label="Tên của bạn" placeholder="Tên của bạn ..." /><textarea value={wishMessage} onChange={(event) => setWishMessage(event.target.value)} aria-label="Lời chúc" placeholder="Lời chúc của bạn ..." rows={3} /><button className="ff-submit-button" type="submit" disabled={!wishName.trim() || !wishMessage.trim() || interactions?.wishes.submitting}>{interactions?.wishes.submitting ? 'Đang gửi…' : 'Gửi lời chúc'}</button>{wishFormError || interactions?.wishes.error ? <small className="ff-form-error" role="alert">{wishFormError || interactions?.wishes.error}</small> : null}</form>}{publicWishesMarkup}</div></section>,
    footer: <footer
      className={`ff-footer${data.footer.backgroundImage ? ' ff-footer--image' : ''}`}
      style={data.footer.backgroundImage ? ({ '--ff-footer-image': `url(${JSON.stringify(data.footer.backgroundImage)})` } as React.CSSProperties) : undefined}
    >
      <span>THANK YOU FOR BEING HERE</span><p>{data.footer.message}<br /><em>{data.footer.signature}</em></p><div><span>{data.hero.brideName.toUpperCase()} & {data.hero.groomName.toUpperCase()}</span><span>{displayDate} · {data.hero.location.toUpperCase()}</span><a href="#top">VỀ ĐẦU TRANG ↑</a></div>
    </footer>,
  }
  return <><main ref={pageRef} className="ff-page" data-template="forever" data-editor-mode={editorMode || undefined}>{sectionConfig.order.map((key) => !mapped[key] ? null : section(key, mapped[key]!))}{galleryLightbox}{storyImageLightbox}</main>{musicControl}</>
}

function buildForeverCountdownTarget(dateValue: string, timeValue: string) {
  const parts = dateValue.match(/\d+/g)?.slice(0, 3).map(Number)
  if (!parts || parts.length !== 3) return ''

  let year: number
  let month: number
  let day: number
  if (parts[0] >= 1000) [year, month, day] = parts
  else [day, month, year] = parts
  if (year < 100) year += 2000

  const time = timeValue.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i)
  let hour = time ? Number(time[1]) : 0
  const minute = time ? Number(time[2]) : 0
  const meridiem = time?.[3]?.toLowerCase()
  if ((meridiem === 'pm' || /chiều|tối/i.test(timeValue)) && hour < 12) hour += 12
  if ((meridiem === 'am' || /sáng/i.test(timeValue)) && hour === 12) hour = 0

  const target = new Date(year, month - 1, day, hour, minute)
  if (hour > 23 || minute > 59) return ''
  if (target.getFullYear() !== year || target.getMonth() !== month - 1 || target.getDate() !== day) return ''

  return String(year) + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0') + 'T' + String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0') + ':00'
}

function ForeverCountdown({ date, time }: { date: string; time: string }) {
  const targetDate = buildForeverCountdownTarget(date, time)
  const countdown = useWeddingCountdown(targetDate || 'invalid-countdown-date')

  if (!targetDate) return <p className="ff-countdown-unavailable" role="status">Ngày cưới chưa được cập nhật.</p>
  if (countdown.complete) return <p className="ff-countdown-complete" role="status">Ngày cưới đã đến rồi.</p>

  const units = [
    { label: 'NGÀY', value: countdown.days },
    { label: 'GIỜ', value: countdown.hours },
    { label: 'PHÚT', value: countdown.minutes },
    { label: 'GIÂY', value: countdown.seconds },
  ]

  return <div className="ff-countdown-clock" role="timer" aria-label="Thời gian còn lại đến ngày cưới">
    {units.map((unit) => <div className="ff-countdown-unit" key={unit.label}>
      <strong>{formatCountdownUnit(unit.value)}</strong>
      <span>{unit.label}</span>
    </div>)}
  </div>
}
