import { motion, useReducedMotion } from 'motion/react'
import { HandTap } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { TheWeddingRollRecapContent } from './content'
import { isSafeExternalAlbumUrl } from './album-url'
import { theWeddingRollRecapFixture } from './fixture'
import './the-wedding-roll.css'

type RevealProps = {
  id?: string
  className: string
  sectionKey?: string
  children: ReactNode
}

function RevealSection({ id, className, sectionKey, children }: RevealProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.section
      id={id}
      className={`${className} reveal`}
      data-editor-section={sectionKey}
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
type ChapterLightboxState = { chapterId: string; index: number }

function getChapterPhotos(chapter: TheWeddingRollRecapContent['chapters'][number]) {
  const gallery = Array.isArray(chapter.gallery) ? chapter.gallery : []
  const legacyPhotos = !gallery.length && chapter.cover ? [chapter.cover] : gallery
  return legacyPhotos.filter((photo) => photo && typeof photo.src === 'string').slice(0, 5)
}

function getAlbumHref(content: TheWeddingRollRecapContent, albumItems: AlbumItem[]) {
  const external = content.photoDelivery.albums.find(
    (album) => album.type === 'EXTERNAL_ALBUM_LINK' && isSafeExternalAlbumUrl(album.href),
  )
  if (external?.type === 'EXTERNAL_ALBUM_LINK') return external.href
  const internal = content.photoDelivery.albums.some((album) => album.type === 'INTERNAL_ALBUM')
  return internal && albumItems.length ? '#photo-gallery' : '#album'
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
}: {
  content?: TheWeddingRollRecapContent
  albumItems?: AlbumItem[]
}) {
  const albumHref = getAlbumHref(content, albumItems)
  const isExternalAlbum = albumHref.startsWith('https:')
  const reduceMotion = useReducedMotion()
  const [pageHidden, setPageHidden] = useState(false)
  const [filmPlaying, setFilmPlaying] = useState(false)
  const [activeMomentIndex, setActiveMomentIndex] = useState(0)
  const momentSwipeStartX = useRef<number | null>(null)
  const [chapterLightbox, setChapterLightbox] = useState<ChapterLightboxState | null>(null)
  const chapterLightboxCloseRef = useRef<HTMLButtonElement>(null)
  const [chapterLightboxTrigger, setChapterLightboxTrigger] = useState<HTMLButtonElement | null>(null)
  const activeLightboxChapter = chapterLightbox
    ? content.chapters.find((chapter) => chapter.id === chapterLightbox.chapterId)
    : undefined
  const activeLightboxPhotos = activeLightboxChapter
    ? getChapterPhotos(activeLightboxChapter)
    : []
  const activeLightboxIndex = Math.min(chapterLightbox?.index ?? 0, activeLightboxPhotos.length - 1)
  const activeLightboxPhoto = activeLightboxPhotos[activeLightboxIndex]
  const isChapterLightboxOpen = chapterLightbox !== null
  const momentCount = content.moments.length
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
    if (!isChapterLightboxOpen || !activeLightboxChapter || !activeLightboxPhotos.length) {
      chapterLightboxTrigger?.focus()
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    chapterLightboxCloseRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const dialog = chapterLightboxCloseRef.current?.closest('[role="dialog"]')
        const buttons = dialog?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        const first = buttons?.[0]
        const last = buttons?.[buttons.length - 1]
        if (first && last && event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (last && !event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
      if (event.key === 'Escape') setChapterLightbox(null)
      if (event.key === 'ArrowLeft' && activeLightboxPhotos.length > 1) {
        setChapterLightbox((current) =>
          current
            ? {
                ...current,
                index: (current.index - 1 + activeLightboxPhotos.length) % activeLightboxPhotos.length,
              }
            : current,
        )
      }
      if (event.key === 'ArrowRight' && activeLightboxPhotos.length > 1) {
        setChapterLightbox((current) =>
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
    activeLightboxChapter,
    activeLightboxPhotos.length,
    chapterLightboxTrigger,
    isChapterLightboxOpen,
  ])
  const optionalCards = [
    ['peopleBehindTheDay', content.optional.peopleBehindTheDay],
    ['soundtrack', content.optional.soundtrack],
    ['behindTheScenes', content.optional.behindTheScenes],
  ] as const
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
      <main>
        <section className="wrap hero" data-editor-section="hero">
          <div className="hero-copy">
            <motion.div className="issue mono" {...revealItem(reduceMotion)}>
              {content.hero.issueLabel}
            </motion.div>
            <motion.h1 {...revealItem(reduceMotion, 0.08)}>
              {content.hero.titleLines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {index === content.hero.emphasisLine ? <em>{line}</em> : line}
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
        </section>

        <div className="ticker">
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

        <RevealSection id="story" className="wrap story" sectionKey="ourStory">
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
        </RevealSection>

        <RevealSection id="chapters" className="wrap chapters" sectionKey="chapters">
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
                        setChapterLightboxTrigger(event.currentTarget)
                        setChapterLightbox({ chapterId: chapter.id, index: 0 })
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
        </RevealSection>

        <RevealSection id="moments" className="wrap moments" sectionKey="moments">
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
                className="moment-card-reveal"
                key={moment.id}
                {...revealItem(reduceMotion, index * 0.07)}
                aria-label={`${index + 1} / ${momentCount}: ${moment.title}`}
                aria-hidden={index !== activeMomentIndex}
                style={(() => {
                  const offset = ((index - activeMomentIndex + momentCount + momentCount / 2) % momentCount) - momentCount / 2
                  const distance = Math.abs(offset)
                  return {
                    '--moment-transform': `translateX(${offset * 76}%) translateZ(${-distance * 110}px) rotateY(${offset * -22}deg) scale(${1 - distance * 0.08})`,
                    '--moment-opacity': distance > 1 ? 0 : distance === 0 ? 1 : 0.48,
                    '--moment-z': momentCount - distance,
                    '--moment-pointer-events': distance > 1 ? 'none' : 'auto',
                  } as CSSProperties &
                    Record<
                      '--moment-transform' | '--moment-opacity' | '--moment-z' | '--moment-pointer-events',
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
              <span aria-live="polite">{activeMomentIndex + 1} / {momentCount}</span>
              <button type="button" aria-label="Khoảnh khắc tiếp theo" onClick={showNextMoment}>
                ›
              </button>
            </div>
          )}
          <div className="film-strip" aria-label="Dải ảnh xem trước">
            {content.filmStrip.map((media, index) => (
              <motion.div
                key={`${media.src}-${index}`}
                {...revealItem(reduceMotion, index * 0.035)}
              >
                <img src={media.src} alt={media.alt} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </RevealSection>

        <RevealSection id="album" className="wrap delivery" sectionKey="photoDelivery">
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
              <p>{content.photoDelivery.body}</p>
            </motion.div>
            <motion.a
              className="button"
              href={albumHref}
              target={albumHref.startsWith('https:') ? '_blank' : undefined}
              rel={albumHref.startsWith('https:') ? 'noopener noreferrer' : undefined}
              {...revealItem(reduceMotion, 0.16)}
            >
              {content.photoDelivery.ctaLabel}
              <span>↗</span>
            </motion.a>
          </motion.div>
        </RevealSection>

        {albumItems.length > 0 &&
        content.photoDelivery.albums.some((album) => album.type === 'INTERNAL_ALBUM') ? (
          <section
            id="photo-gallery"
            className="wrap wedding-roll-gallery"
            aria-label="Album ảnh cưới"
          >
            {albumItems.map((item, index) => (
              <a key={`${item.src}-${index}`} href={item.src} download>
                <img src={item.src} alt={item.alt} loading="lazy" />
                {item.caption ? <span>{item.caption}</span> : null}
              </a>
            ))}
          </section>
        ) : null}

        <RevealSection className="wrap optional">
          <div className="section-head">
            <motion.div {...revealItem(reduceMotion)}>
              <div className="mono">{content.optionalIndex.eyebrow}</div>
              <h2>
                <TextWithBreaks>{content.optionalIndex.title}</TextWithBreaks>
              </h2>
            </motion.div>
            <p>{content.optionalIndex.body}</p>
          </div>
          <div className="optional-grid">
            {optionalCards.map(
              ([sectionKey, item], index) =>
                item.enabled && (
                  <motion.article
                    className="optional-card"
                    data-editor-section={sectionKey}
                    key={sectionKey}
                    {...revealItem(reduceMotion, index * 0.07)}
                  >
                    <div className="mono">{item.eyebrow}</div>
                    <h3>{item.title}</h3>
                    <p>{item.intro}</p>
                    {sectionKey === 'soundtrack' && content.optional.soundtrack.audioSrc ? (
                      <audio
                        controls
                        preload="none"
                        src={content.optional.soundtrack.audioSrc}
                        aria-label={content.optional.soundtrack.title}
                      />
                    ) : null}
                  </motion.article>
                ),
            )}
          </div>
        </RevealSection>

        {content.optional.weddingFilm.enabled && (
          <RevealSection id="film" className="wrap film-feature" sectionKey="weddingFilm">
            <motion.div className="film-poster" {...revealItem(reduceMotion)}>
              <img
                src={content.optional.weddingFilm.poster.src}
                alt={content.optional.weddingFilm.poster.alt}
                loading="lazy"
                style={{ display: filmPlaying ? 'none' : undefined }}
              />
              {filmPlaying && content.optional.weddingFilm.videoSrc ? (
                <video
                  src={content.optional.weddingFilm.videoSrc}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : null}
              {content.optional.weddingFilm.videoSrc && !filmPlaying ? (
                <button
                  className="play"
                  type="button"
                  aria-label={content.optional.weddingFilm.playLabel}
                  onClick={() => setFilmPlaying(true)}
                >
                  <div>
                    <b>▶</b>
                    {content.optional.weddingFilm.playLabel}
                  </div>
                </button>
              ) : null}
            </motion.div>
            <motion.div className="film-copy" {...revealItem(reduceMotion, 0.1)}>
              <div className="mono">{content.optional.weddingFilm.eyebrow}</div>
              <h2>
                <TextWithBreaks>
                  {content.optional.weddingFilm.title.replace(', ', ',\n')}
                </TextWithBreaks>
              </h2>
              <p>{content.optional.weddingFilm.body}</p>
              {content.optional.weddingFilm.videoSrc ? (
                <button className="underlink" type="button" onClick={() => setFilmPlaying(true)}>
                  {content.optional.weddingFilm.linkLabel}
                </button>
              ) : null}
            </motion.div>
          </RevealSection>
        )}

        {content.optional.guestbook.enabled && (
          <RevealSection className="wrap guestbook" sectionKey="guestbook">
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
            <div className="wish-grid">
              {content.optional.guestbook.wishes.map((wish, index) => (
                <motion.article
                  className="wish"
                  key={wish.id}
                  {...revealItem(reduceMotion, index * 0.07)}
                >
                  <blockquote>{wish.message}</blockquote>
                  <cite>{wish.author}</cite>
                </motion.article>
              ))}
            </div>
          </RevealSection>
        )}

        {content.optional.memoryCapsule.enabled && (
          <RevealSection className="wrap capsule" sectionKey="memoryCapsule">
            <motion.div className="mono" {...revealItem(reduceMotion)}>
              {content.optional.memoryCapsule.eyebrow}
            </motion.div>
            <motion.h2 {...revealItem(reduceMotion, 0.08)}>
              {content.optional.memoryCapsule.title}
            </motion.h2>
            <motion.p {...revealItem(reduceMotion, 0.16)}>
              {content.optional.memoryCapsule.message}
            </motion.p>
          </RevealSection>
        )}

        <RevealSection className="closing" sectionKey="thankYou">
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
        </RevealSection>
      </main>
      {activeLightboxChapter && activeLightboxPhoto ? (
        <div
          className="chapter-lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setChapterLightbox(null)
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
                <div className="chapter-lightbox-eyebrow">{activeLightboxChapter.dateLabel}</div>
                <h2 id="chapter-lightbox-title">{activeLightboxChapter.title}</h2>
              </div>
              <button
                ref={chapterLightboxCloseRef}
                className="chapter-lightbox-close"
                type="button"
                aria-label="Đóng album ảnh"
                onClick={() => setChapterLightbox(null)}
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
                  setChapterLightbox((current) =>
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
                  setChapterLightbox((current) =>
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
              <div className="chapter-lightbox-thumbnails" aria-label="Chọn ảnh trong album">
                {activeLightboxPhotos.map((photo, index) => (
                  <button
                    key={`${photo.src}-${index}`}
                    className={index === activeLightboxIndex ? 'is-active' : ''}
                    type="button"
                    aria-label={`Hiện ảnh ${index + 1}`}
                    aria-current={index === activeLightboxIndex ? 'true' : undefined}
                    onClick={() => setChapterLightbox((current) => (current ? { ...current, index } : current))}
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
