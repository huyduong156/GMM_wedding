import { motion, useReducedMotion } from 'motion/react'
import { HandTap } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { MusicPlayer } from '../../../shared/ui/music-player'
import type { TheWeddingRollMedia, TheWeddingRollRecapContent } from './content'
import { isSafeExternalAlbumUrl } from './album-url'
import { theWeddingRollRecapFixture } from './fixture'
import './the-wedding-roll.css'

type RevealProps = {
  id?: string
  className: string
  sectionKey?: string
  sectionOrder?: number
  children: ReactNode
}

function RevealSection({ id, className, sectionKey, sectionOrder, children }: RevealProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.section
      id={id}
      className={`${className} reveal`}
      data-editor-section={sectionKey}
      style={sectionOrder === undefined ? undefined : { order: sectionOrder }}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

function TextWithBreaks({ children }: { children: string }) {
  return (
    <>
      {children.split('\n').map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  )
}

function getThankYouTitleLines(title: string) {
  const splitAt = title.indexOf('ở trong')
  if (splitAt < 0) return [title]
  return [title.slice(0, splitAt).trim(), title.slice(splitAt)]
}

type AlbumItem = { src: string; alt: string; caption?: string | null }
type RecapWish = { id?: string; authorName: string; content: string }
type RecapSectionConfig = { enabled: string[]; order: string[] }
type LightboxState = {
  kind: 'chapter' | 'featured' | 'people'
  chapterId?: string
  index: number
  title?: string
  eyebrow?: string
  photos?: TheWeddingRollMedia[]
}

function getChapterPhotos(chapter: TheWeddingRollRecapContent['chapters'][number]) {
  const gallery = Array.isArray(chapter.gallery) ? chapter.gallery : []
  const legacyPhotos = !gallery.length && chapter.cover ? [chapter.cover] : gallery
  return legacyPhotos.filter((photo) => photo && typeof photo.src === 'string').slice(0, 5)
}

function getFeaturedPhotos(content: TheWeddingRollRecapContent, albumItems: AlbumItem[]) {
  const featured = content.photoDelivery.featuredPhotos?.length
    ? content.photoDelivery.featuredPhotos
    : content.photoDelivery.media ?? []
  if (featured.length) return featured.slice(0, 50)
  const hasLegacyInternalAlbum = content.photoDelivery.albums.some(
    (album) => album.type === 'INTERNAL_ALBUM',
  )
  return hasLegacyInternalAlbum ? albumItems.slice(0, 50) : []
}

function getExternalAlbumHref(content: TheWeddingRollRecapContent) {
  const configuredUrl = content.photoDelivery.externalAlbumUrl?.trim() ?? ''
  return configuredUrl && isSafeExternalAlbumUrl(configuredUrl) ? configuredUrl : undefined
}

function revealItem(reduceMotion: boolean | null, delay = 0) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.22 },
    transition: {
      duration: 0.62,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }
}

export function TheWeddingRollRecap({
  content = theWeddingRollRecapFixture,
  albumItems = [],
  wishes,
  sectionConfig,
}: {
  content?: TheWeddingRollRecapContent
  albumItems?: AlbumItem[]
  wishes?: RecapWish[]
  sectionConfig?: RecapSectionConfig
}) {
  const defaultSectionOrder = [
    'hero',
    'ourStory',
    'chapters',
    'moments',
    'photoDelivery',
    'peopleBehindTheDay',
    'behindTheScenes',
    'soundtrack',
    'guestbook',
    'memoryCapsule',
    'thankYou',
  ]
  const orderedKeys = [...(sectionConfig?.order ?? defaultSectionOrder)]
  for (const key of defaultSectionOrder) if (!orderedKeys.includes(key)) orderedKeys.push(key)
  const sectionPosition = (key: string) => orderedKeys.indexOf(key)
  const sectionIsEnabled = (key: string, fallback: boolean) =>
    sectionConfig ? sectionConfig.enabled.includes(key) : fallback
  const optionalSectionEnabled = (key: keyof TheWeddingRollRecapContent['optional']) =>
    sectionIsEnabled(key, content.optional[key].enabled)
  const featuredPhotos = getFeaturedPhotos(content, albumItems)
  const externalAlbumHref = getExternalAlbumHref(content)
  const albumHref = externalAlbumHref ?? '#album'
  const isExternalAlbum = Boolean(externalAlbumHref)
  const displayedWishes = wishes ?? content.optional.guestbook.wishes.map((wish) => ({
    id: wish.id,
    authorName: wish.author,
    content: wish.message,
  }))
  const wishMarqueeDuration = `${Math.max(displayedWishes.length, 1) * 5.88}s`
  const photoDeliveryBody =
    featuredPhotos.length || externalAlbumHref
      ? content.photoDelivery.body
      : 'Ảnh cưới sẽ được cập nhật tại đây.'
  const reduceMotion = useReducedMotion()
  const [pageHidden, setPageHidden] = useState(false)
  const [activeMomentIndex, setActiveMomentIndex] = useState(0)
  const momentSwipeStartX = useRef<number | null>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const lightboxCloseRef = useRef<HTMLButtonElement>(null)
  const [lightboxTrigger, setLightboxTrigger] = useState<HTMLButtonElement | null>(null)
  const showBehindTheScenes = optionalSectionEnabled('behindTheScenes')
  const peopleGroups = (content.optional.peopleBehindTheDay.groups ?? [])
    .filter((group) => group.id !== 'behind-the-scenes' || showBehindTheScenes)
    .slice(0, 10)
    .map((group) => ({ ...group, photos: group.photos.slice(0, 10) }))
  const peopleRailRef = useRef<HTMLDivElement>(null)
  const [peopleRailPosition, setPeopleRailPosition] = useState({
    index: 0,
    canPrevious: false,
    canNext: peopleGroups.length > 3,
  })
  const activeLightboxChapter = lightbox?.kind === 'chapter'
    ? content.chapters.find((chapter) => chapter.id === lightbox.chapterId)
    : undefined
  const activeLightboxPhotos = lightbox?.kind === 'featured'
    ? featuredPhotos
    : lightbox?.kind === 'people'
      ? lightbox.photos ?? []
    : activeLightboxChapter
      ? getChapterPhotos(activeLightboxChapter)
      : []
  const activeLightboxIndex = Math.min(lightbox?.index ?? 0, activeLightboxPhotos.length - 1)
  const activeLightboxPhoto = activeLightboxPhotos[activeLightboxIndex]
  const isLightboxOpen = lightbox !== null
  const movePeopleRail = (direction: -1 | 1) => {
    const rail = peopleRailRef.current
    const card = rail?.firstElementChild as HTMLElement | null
    if (!rail || !card) return
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap || '0') || 0
    rail.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }
  const momentCount = content.moments.length
  const currentMomentIndex = momentCount ? activeMomentIndex % momentCount : 0
  const showPreviousMoment = () => {
    if (momentCount > 1) setActiveMomentIndex((current) => (current - 1 + momentCount) % momentCount)
  }
  const showNextMoment = () => {
    if (momentCount > 1) setActiveMomentIndex((current) => (current + 1) % momentCount)
  }

  useEffect(() => {
    const updateVisibility = () => setPageHidden(document.hidden)
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])
  useEffect(() => {
    const rail = peopleRailRef.current
    if (!rail) return
    const updatePosition = () => {
      const card = rail.firstElementChild as HTMLElement | null
      const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap || '0') || 0
      const step = card ? card.getBoundingClientRect().width + gap : 1
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
      setPeopleRailPosition({
        index: step > 1 ? Math.round(rail.scrollLeft / step) : 0,
        canPrevious: rail.scrollLeft > 1,
        canNext: maxScroll - rail.scrollLeft > 1,
      })
    }
    updatePosition()
    rail.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      rail.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [peopleGroups.length])
  useEffect(() => {
    if (!isLightboxOpen || !activeLightboxPhotos.length) {
      lightboxTrigger?.focus()
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lightboxCloseRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const dialog = lightboxCloseRef.current?.closest('[role="dialog"]')
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"]',
        )
        const first = focusable?.[0]
        const last = focusable?.[focusable.length - 1]
        if (first && last && event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (last && !event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft' && activeLightboxPhotos.length > 1) {
        setLightbox((current) =>
          current
            ? {
                ...current,
                index: (current.index - 1 + activeLightboxPhotos.length) % activeLightboxPhotos.length,
              }
            : current,
        )
      }
      if (event.key === 'ArrowRight' && activeLightboxPhotos.length > 1) {
        setLightbox((current) =>
          current ? { ...current, index: (current.index + 1) % activeLightboxPhotos.length } : current,
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [
    activeLightboxPhotos.length,
    isLightboxOpen,
    lightboxTrigger,
  ])
  const coupleNames = content.hero.couple.split(/\s*&\s*/)

  return (
    <div
      className="the-wedding-roll"
      id="top"
      lang="vi"
      data-motion-paused={reduceMotion || pageHidden ? 'true' : 'false'}
    >
      <div className="ambient-artwork" aria-hidden="true">
        <img
          className="ambient-mark ambient-mark--one"
          src="/assets/images/templates/the-wedding-roll/film-sprocket-mark.svg"
          alt=""
        />
        <img
          className="ambient-mark ambient-mark--two"
          src="/assets/images/templates/the-wedding-roll/film-sprocket-mark.svg"
          alt=""
        />
        <img
          className="ambient-mark ambient-mark--three"
          src="/assets/images/templates/the-wedding-roll/film-sprocket-mark.svg"
          alt=""
        />
      </div>

      {optionalSectionEnabled('soundtrack') && content.optional.soundtrack.audioSrc ? (
        <MusicPlayer
          src={content.optional.soundtrack.audioSrc}
          title={content.optional.soundtrack.title}
          autoplay={false}
          active
          sectionKey={null}
        />
      ) : null}
      <header className="wrap topbar">
        <a className="brand" href="#top">
          THE <b>WEDDING</b> ROLL
        </a>
        <a
          className="top-cta"
          href={albumHref}
          target={isExternalAlbum ? '_blank' : undefined}
          rel={isExternalAlbum ? 'noopener noreferrer' : undefined}
        >
          {content.hero.ctaLabel} ↗
        </a>
      </header>
      <main style={{ display: 'flex', flexDirection: 'column' }}>
        {sectionIsEnabled('hero', true) ? <section className="wrap hero" data-editor-section="hero" style={{ order: sectionPosition('hero') }}>
          <div className="hero-copy">
            <motion.div className="issue mono" {...revealItem(reduceMotion)}>
              {content.hero.issueLabel}
            </motion.div>
            <motion.h1 {...revealItem(reduceMotion, 0.08)}>
              {content.hero.titleLines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {index === Number(content.hero.emphasisLine) ? <em>{line}</em> : line}
                </span>
              ))}
            </motion.h1>
            <motion.p {...revealItem(reduceMotion, 0.16)}>{content.hero.tagline}</motion.p>
            <motion.div className="actions" {...revealItem(reduceMotion, 0.24)}>
              <a
                className="button"
                href={albumHref}
                target={isExternalAlbum ? '_blank' : undefined}
                rel={isExternalAlbum ? 'noopener noreferrer' : undefined}
              >
                {content.hero.ctaLabel}
                <span>↘</span>
              </a>
              <a className="underlink" href="#chapters">
                {content.hero.secondaryCtaLabel}
              </a>
            </motion.div>
          </div>
          <motion.div className="hero-art" {...revealItem(reduceMotion, 0.12)}>
            <div className="hero-photo">
              <img src={content.hero.cover.src} alt={content.hero.cover.alt} />
              <div className="frame-note">{content.hero.frameNote}</div>
              <div className="hero-caption">
                <strong>
                  <span>{coupleNames[0]}</span>
                  <span className="hero-caption-amp">&</span>
                  <span>{coupleNames.slice(1).join(' & ')}</span>
                </strong>
                <span>{content.hero.date}</span>
              </div>
            </div>
            <div className="frame-id">MỘT NGÀY ĐÁNG NHỚ</div>
            <div className="stamp">
              <span className="stamp-wave" aria-hidden="true" />
              <span className="stamp-wave stamp-wave--delayed" aria-hidden="true" />
              <span className="stamp-label">{content.hero.stampLabel}</span>
              <b>{content.hero.stampCount}</b>
              <span className="stamp-label">{content.hero.stampCaption}</span>
            </div>
          </motion.div>
        </section> : null}

        <div className="ticker" style={{ order: sectionPosition('hero') + 0.5 }}>
          <div className="ticker-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div className="ticker-group" key={copy}>
                {content.tickerItems.map((item, index) => (
                  <span key={`${copy}-${item}-${index}`}>
                    {index > 0 && <i aria-hidden="true">✳</i>}
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <span className="sr-only">{content.tickerItems.join(' · ')}</span>
        </div>

        {sectionIsEnabled('ourStory', true) ? <RevealSection id="story" className="wrap story" sectionKey="ourStory" sectionOrder={sectionPosition('ourStory')}>
          <div className="story-grid">
            <motion.div {...revealItem(reduceMotion)}>
              <div className="mono">{content.ourStory.eyebrow}</div>
              <p className="story-quote">{content.ourStory.quote}</p>
              <p className="story-copy">{content.ourStory.body}</p>
            </motion.div>
            <motion.figure className="story-image" {...revealItem(reduceMotion, 0.1)}>
              <img src={content.ourStory.media.src} alt={content.ourStory.media.alt} />
              <figcaption className="image-label">{content.ourStory.mediaLabel}</figcaption>
            </motion.figure>
          </div>
        </RevealSection> : null}

        {sectionIsEnabled('chapters', true) ? <RevealSection id="chapters" className="wrap chapters" sectionKey="chapters" sectionOrder={sectionPosition('chapters')}>
          <div className="section-head">
            <motion.div {...revealItem(reduceMotion)}>
              <div className="mono">{content.chaptersIntro.eyebrow}</div>
              <h2>
                <TextWithBreaks>{content.chaptersIntro.title.replace(', ', ', \n')}</TextWithBreaks>
              </h2>
            </motion.div>
            <p>{content.chaptersIntro.description}</p>
          </div>
          <div className="chapter-list">
            {content.chapters.map((chapter, index) => {
              const chapterPhotos = getChapterPhotos(chapter)
              const coverPhoto = chapterPhotos[0]
              return (
                <motion.article
                  className="chapter"
                  key={chapter.id}
                  {...revealItem(reduceMotion, index * 0.07)}
                >
                  <div className="chapter-num">{chapter.dateLabel}</div>
                  <div className="chapter-copy">
                    <h3>{chapter.title}</h3>
                    <p>{chapter.description}</p>
                  </div>
                  <div className="chapter-thumb">
                    {coverPhoto ? (
                      <img src={coverPhoto.src} alt={coverPhoto.alt} loading="lazy" />
                    ) : null}
                    <button
                      className="chapter-gallery-trigger"
                      type="button"
                      disabled={!chapterPhotos.length}
                      aria-label={`Xem album ảnh ${chapter.title}, ${chapterPhotos.length} ảnh`}
                      onClick={(event) => {
                        setLightboxTrigger(event.currentTarget)
                        setLightbox({ kind: 'chapter', chapterId: chapter.id, index: 0 })
                      }}
                    >
                      <span className="chapter-gallery-trigger-content">
                        <HandTap
                          className="chapter-gallery-hand"
                          size={14}
                          weight="regular"
                          aria-hidden="true"
                        />
                        <span>Xem {chapterPhotos.length} ảnh</span>
                      </span>
                    </button>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </RevealSection> : null}

        {sectionIsEnabled('moments', true) ? <RevealSection id="moments" className="wrap moments" sectionKey="moments" sectionOrder={sectionPosition('moments')}>
          <div className="section-head">
            <motion.div {...revealItem(reduceMotion)}>
              <div className="mono">{content.momentsIntro.eyebrow}</div>
              <h2 className="fx-spotlight">
                <TextWithBreaks>{content.momentsIntro.title.replace(', ', ', \n')}</TextWithBreaks>
              </h2>
            </motion.div>
            <p>{content.momentsIntro.description}</p>
          </div>
          <div
            className="moment-carousel"
            role="region"
            aria-label="Khoảnh khắc đáng nhớ"
            onPointerDown={(event) => {
              momentSwipeStartX.current = event.clientX
            }}
            onPointerUp={(event) => {
              const startX = momentSwipeStartX.current
              momentSwipeStartX.current = null
              if (startX === null || Math.abs(event.clientX - startX) < 45) return
              if (event.clientX < startX) showNextMoment()
              else showPreviousMoment()
            }}
            onPointerCancel={() => {
              momentSwipeStartX.current = null
            }}
          >
            {content.moments.map((moment, index) => (
              <motion.div
                className={`moment-card-reveal${index === currentMomentIndex ? ' is-active' : ''}`}
                key={moment.id}
                {...revealItem(reduceMotion, index * 0.07)}
                aria-label={`${index + 1} / ${momentCount}: ${moment.title}`}
                aria-hidden={index !== currentMomentIndex}
                style={(() => {
                  const offset = ((index - currentMomentIndex + momentCount + momentCount / 2) % momentCount) - momentCount / 2
                  const distance = Math.abs(offset)
                  return {
                    '--moment-transform': `translateX(${offset * 76}%) translateZ(${-distance * 110}px) rotateY(${offset * -22}deg) scale(${1 - distance * 0.08})`,
                    '--moment-opacity': distance > 1 ? 0 : distance === 0 ? 1 : 0.48,
                    '--moment-pointer-events': distance > 1 ? 'none' : 'auto',
                  } as CSSProperties &
                    Record<
                      '--moment-transform' | '--moment-opacity' | '--moment-pointer-events',
                      string | number
                    >
                })()}
              >
                <div className="moment-card-shell">
                  <article className="moment-card">
                    <div className="moment-photo">
                      <img src={moment.cover.src} alt={moment.cover.alt} loading="lazy" />
                    </div>
                    <div className="moment-meta">
                      <h3>{moment.title}</h3>
                      <span>{moment.momentLabel}</span>
                    </div>
                    <p>{moment.description}</p>
                    {moment.gallery?.some((photo) => photo?.src) ? (
                      <button
                        type="button"
                        className="chapter-gallery-open"
                        onClick={(event) => {
                          setLightboxTrigger(event.currentTarget)
                          setLightbox({
                            kind: 'people',
                            index: 0,
                            title: moment.title,
                            eyebrow: moment.momentLabel,
                            photos: moment.gallery?.filter((photo) => photo?.src).slice(0, 24),
                          })
                        }}
                      >
                        Xem album khoảnh khắc <span aria-hidden="true">↗</span>
                      </button>
                    ) : null}
                  </article>
                </div>
              </motion.div>
            ))}
          </div>
          {momentCount > 1 && (
            <div className="moment-carousel-controls" aria-label="Điều khiển khoảnh khắc">
              <button type="button" aria-label="Khoảnh khắc trước" onClick={showPreviousMoment}>
                ‹
              </button>
              <span aria-live="polite">{currentMomentIndex + 1} / {momentCount}</span>
              <button type="button" aria-label="Khoảnh khắc tiếp theo" onClick={showNextMoment}>
                ›
              </button>
            </div>
          )}
        </RevealSection> : null}

        {sectionIsEnabled('photoDelivery', true) ? <RevealSection id="album" className="wrap delivery" sectionKey="photoDelivery" sectionOrder={sectionPosition('photoDelivery')}>
          <motion.div
            className="delivery-panel"
            data-marker={content.photoDelivery.marker}
            {...revealItem(reduceMotion)}
          >
            <motion.div {...revealItem(reduceMotion, 0.08)}>
              <div className="mono">{content.photoDelivery.eyebrow}</div>
              <h2>
                <TextWithBreaks>
                  {content.photoDelivery.title.replace(' đang ', '\nđang ')}
                </TextWithBreaks>
              </h2>
              <p>{photoDeliveryBody}</p>
            </motion.div>
            <div className="delivery-actions">
              {featuredPhotos.length > 0 ? (
                <motion.button
                  type="button"
                  className="button button--featured"
                  onClick={(event) => {
                    setLightboxTrigger(event.currentTarget)
                    setLightbox({ kind: 'featured', index: 0 })
                  }}
                  {...revealItem(reduceMotion, 0.12)}
                >
                  Xem ảnh nổi bật
                  <span>↗</span>
                </motion.button>
              ) : null}
              {externalAlbumHref ? (
                <motion.a
                  className="button button--all-photos"
                  href={externalAlbumHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...revealItem(reduceMotion, featuredPhotos.length ? 0.2 : 0.12)}
                >
                  Xem toàn bộ ảnh ngày hôm ấy
                  <span>↗</span>
                </motion.a>
              ) : null}
            </div>
          </motion.div>
        </RevealSection> : null}

        {optionalSectionEnabled('peopleBehindTheDay') && peopleGroups.length > 0 ? (
        <RevealSection
          id="people-behind-the-day"
          className="wrap people-behind-section"
          sectionKey="peopleBehindTheDay"
          sectionOrder={sectionPosition('peopleBehindTheDay')}
        >
          <div className="section-head">
            <motion.div {...revealItem(reduceMotion)}>
              <div className="mono">NHỮNG NGƯỜI GÓP SỨC</div>
              <h2>{content.optional.peopleBehindTheDay.title}</h2>
            </motion.div>
            <p>{content.optional.peopleBehindTheDay.intro}</p>
          </div>
          <div className="people-carousel" aria-roledescription="carousel">
            <div
              ref={peopleRailRef}
              className="people-carousel-rail"
              role="region"
              aria-label="Những người góp sức cho ngày cưới"
              tabIndex={0}
            >
              {peopleGroups.map((group, index) => {
                const coverPhoto = group.photos[0]
                return (
                  <motion.article
                    className="people-card"
                    data-editor-section={group.id === 'behind-the-scenes' ? 'behindTheScenes' : undefined}
                    key={group.id}
                    {...revealItem(reduceMotion, index * 0.05)}
                  >
                    <div className="people-card-photo">
                      {coverPhoto ? (
                        <button
                          className="people-photo-open"
                          type="button"
                          aria-label={`Mở ảnh nhóm ${group.title}, ${group.photos.length} ảnh`}
                          onClick={(event) => {
                            setLightboxTrigger(event.currentTarget)
                            setLightbox({
                              kind: 'people',
                              index: 0,
                              title: group.title,
                              eyebrow: 'NHỮNG NGƯỜI GÓP SỨC',
                              photos: group.photos.slice(0, 10),
                            })
                          }}
                        >
                          <img src={coverPhoto.src} alt={coverPhoto.alt} loading="lazy" />
                        </button>
                      ) : (
                        <div className="people-photo-empty">
                          <span>{group.title}</span>
                          <small>NGÀY HÔM ẤY</small>
                        </div>
                      )}
                      {group.photos.length > 0 ? (
                        <span className="people-photo-count">{group.photos.length} ẢNH</span>
                      ) : null}
                    </div>
                    <div className="people-card-copy">
                      <div className="mono">{String(index + 1).padStart(2, '0')} / GÓP SỨC CHO NGÀY VUI</div>
                      <h3>{group.title}</h3>
                      <p>{group.caption}</p>
                      {group.photos.length > 0 ? (
                        <button
                          className="people-card-action"
                          type="button"
                          onClick={(event) => {
                            setLightboxTrigger(event.currentTarget)
                            setLightbox({
                              kind: 'people',
                              index: 0,
                              title: group.title,
                              eyebrow: 'NHỮNG NGƯỜI GÓP SỨC',
                              photos: group.photos.slice(0, 10),
                            })
                          }}
                        >
                          Xem {group.photos.length > 1 ? `${group.photos.length} ảnh` : 'ảnh'} <span>↗</span>
                        </button>
                      ) : null}
                    </div>
                  </motion.article>
                )
              })}
            </div>
            {peopleGroups.length > 1 ? (
              <div className="people-carousel-controls" aria-label="Điều khiển nhóm ảnh">
                <button
                  type="button"
                  aria-label="Nhóm trước"
                  disabled={!peopleRailPosition.canPrevious}
                  onClick={() => movePeopleRail(-1)}
                >
                  ‹
                </button>
                <span aria-live="polite">{peopleRailPosition.index + 1} / {peopleGroups.length}</span>
                <button
                  type="button"
                  aria-label="Nhóm tiếp theo"
                  disabled={!peopleRailPosition.canNext}
                  onClick={() => movePeopleRail(1)}
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>
        </RevealSection>
        ) : null}

        {optionalSectionEnabled('soundtrack') ? (
          <RevealSection className="wrap soundtrack-feature" sectionKey="soundtrack" sectionOrder={sectionPosition('soundtrack')}>
            <div className="mono">{content.optional.soundtrack.eyebrow}</div>
            <h2>{content.optional.soundtrack.title}</h2>
            <p>{content.optional.soundtrack.intro}</p>
            {content.optional.soundtrack.audioSrc ? (
              <p className="soundtrack-player-note">Chạm nút nhạc ở góc màn hình để phát giai điệu này.</p>
            ) : null}
          </RevealSection>
        ) : null}

        {optionalSectionEnabled('guestbook') && (
          <RevealSection className="wrap guestbook" sectionKey="guestbook" sectionOrder={sectionPosition('guestbook')}>
            <div className="section-head">
              <motion.div {...revealItem(reduceMotion)}>
                <div className="mono">{content.optional.guestbook.eyebrow}</div>
                <h2>
                  <TextWithBreaks>
                    {content.optional.guestbook.title.replace(' mà ', ' mà\nvẫn ')}
                  </TextWithBreaks>
                </h2>
              </motion.div>
              <p>{content.optional.guestbook.intro}</p>
            </div>
            {displayedWishes.length ? (
              <div
                className="wish-marquee"
                role="region"
                aria-label="Lời chúc đã chọn"
                tabIndex={0}
              >
                <div
                  className="wish-marquee-track"
                  style={{ '--wish-marquee-duration': wishMarqueeDuration } as CSSProperties}
                >
                  {[0, 1].map((copy) => (
                    <div
                      className="wish-marquee-group"
                      key={copy}
                      aria-hidden={copy === 1 ? 'true' : undefined}
                    >
                      {displayedWishes.map((wish, index) => (
                        <motion.article
                          className="wish"
                          key={`${copy}-${wish.id ?? index}`}
                          {...revealItem(reduceMotion, index * 0.04)}
                        >
                          <blockquote>{wish.content}</blockquote>
                          <cite>{wish.authorName}</cite>
                        </motion.article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </RevealSection>
        )}

        {optionalSectionEnabled('memoryCapsule') && (
          <RevealSection className="wrap capsule" sectionKey="memoryCapsule" sectionOrder={sectionPosition('memoryCapsule')}>
            <motion.div className="mono" {...revealItem(reduceMotion)}>
              {content.optional.memoryCapsule.eyebrow}
            </motion.div>
            <motion.h2 {...revealItem(reduceMotion, 0.08)}>
              {content.optional.memoryCapsule.title}
            </motion.h2>
            <motion.p {...revealItem(reduceMotion, 0.16)}>
              {content.optional.memoryCapsule.message}
            </motion.p>
            {content.optional.memoryCapsule.media?.src ? (
              <motion.figure className="capsule-photo" {...revealItem(reduceMotion, 0.22)}>
                <img
                  src={content.optional.memoryCapsule.media.src}
                  alt={content.optional.memoryCapsule.media.alt}
                  loading="lazy"
                />
              </motion.figure>
            ) : null}
          </RevealSection>
        )}

        {sectionIsEnabled('thankYou', true) ? <RevealSection className="closing" sectionKey="thankYou" sectionOrder={sectionPosition('thankYou')}>
          <div className="wrap closing-inner">
            <motion.div className="mono" {...revealItem(reduceMotion)}>
              {content.thankYou.eyebrow}
            </motion.div>
            <motion.h2 {...revealItem(reduceMotion, 0.08)}>
              {getThankYouTitleLines(content.thankYou.title).map((line, index) => (
                <span key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </motion.h2>
            <motion.p {...revealItem(reduceMotion, 0.16)}>{content.thankYou.body}</motion.p>
            <motion.div className="signature" {...revealItem(reduceMotion, 0.22)}>
              {content.thankYou.signature}
            </motion.div>
            <motion.footer className="footer" {...revealItem(reduceMotion, 0.28)}>
              <span>{content.thankYou.date}</span>
              <span>MỘT NGÀY ĐÁNG NHỚ</span>
              <span>{content.thankYou.footerNote}</span>
            </motion.footer>
          </div>
        </RevealSection> : null}
      </main>
      {lightbox && activeLightboxPhoto ? (
        <div
          className="chapter-lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightbox(null)
          }}
        >
          <section
            className="chapter-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chapter-lightbox-title"
          >
            <header className="chapter-lightbox-header">
              <div>
                <div className="chapter-lightbox-eyebrow">
                  {activeLightboxChapter?.dateLabel ?? lightbox.eyebrow ?? 'ẢNH NỔI BẬT'}
                </div>
                <h2 id="chapter-lightbox-title">
                  {activeLightboxChapter?.title ?? lightbox.title ?? 'Ảnh nổi bật'}
                </h2>
              </div>
              <button
                ref={lightboxCloseRef}
                className="chapter-lightbox-close"
                type="button"
                aria-label="Đóng album ảnh"
                onClick={() => setLightbox(null)}
              >
                ×
              </button>
            </header>
            <div className="chapter-lightbox-viewer">
              <button
                className="chapter-lightbox-step"
                type="button"
                aria-label="Ảnh trước"
                disabled={activeLightboxPhotos.length < 2}
                onClick={() =>
                  setLightbox((current) =>
                    current
                      ? {
                          ...current,
                          index:
                            (current.index - 1 + activeLightboxPhotos.length) %
                            activeLightboxPhotos.length,
                        }
                      : current,
                  )
                }
              >
                ‹
              </button>
              <img
                className="chapter-lightbox-image"
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.alt}
              />
              <button
                className="chapter-lightbox-step"
                type="button"
                aria-label="Ảnh tiếp theo"
                disabled={activeLightboxPhotos.length < 2}
                onClick={() =>
                  setLightbox((current) =>
                    current
                      ? { ...current, index: (current.index + 1) % activeLightboxPhotos.length }
                      : current,
                  )
                }
              >
                ›
              </button>
            </div>
            <div className="chapter-lightbox-footer">
              <span aria-live="polite">
                {activeLightboxIndex + 1} / {activeLightboxPhotos.length}
              </span>
              {lightbox.kind === 'featured' || lightbox.kind === 'people' ? (
                <a
                  className="chapter-lightbox-download"
                  href={activeLightboxPhoto.src}
                  download
                  aria-label="Tải ảnh đang xem"
                >
                  Tải ảnh ↓
                </a>
              ) : null}
              <div className="chapter-lightbox-thumbnails" aria-label="Chọn ảnh trong album">
                {activeLightboxPhotos.map((photo, index) => (
                  <button
                    key={`${photo.src}-${index}`}
                    className={index === activeLightboxIndex ? 'is-active' : ''}
                    type="button"
                    aria-label={`Hiện ảnh ${index + 1}`}
                    aria-current={index === activeLightboxIndex ? 'true' : undefined}
                    onClick={() => setLightbox((current) => (current ? { ...current, index } : current))}
                  >
                    <img src={photo.src} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}
      <a
        className="mobile-album-cta"
        href={albumHref}
        target={isExternalAlbum ? '_blank' : undefined}
        rel={isExternalAlbum ? 'noopener noreferrer' : undefined}
      >
        <span>
          {content.hero.ctaLabel === 'Mở & tải ảnh' ? 'Mở & tải album ảnh' : content.hero.ctaLabel}
        </span>
        <span>↗</span>
      </a>
    </div>
  )
}
