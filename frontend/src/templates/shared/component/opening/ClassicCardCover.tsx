import {
  useEffect,
  useMemo,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import './ClassicCardCover.css'

export type ClassicCardCoverProps = {
  brideName: string
  groomName: string
  date?: ReactNode
  venue?: ReactNode
  note?: ReactNode
  eyebrow?: ReactNode
  leftDecorationSrc?: string
  rightDecorationSrc?: string
  decorationAlt?: string
  backgroundImageSrc?: string
  openLabel?: string
  openedLabel?: string
  isOpen?: boolean
  isOpening?: boolean
  onOpen?: () => void
  onOpeningComplete?: () => void
  className?: string
  sectionKey?: string
  order?: number
}

const heartColors = ['#ffd9de', '#f7b8c4', '#f9e9d0', '#e7a7b5']
const largeHeartIndexes = new Set([2, 9, 15])

function createHeartParticles() {
  return Array.from({ length: 24 }, (_, index) => {
    const random = Math.random
    const isLarge = largeHeartIndexes.has(index)
    const direction = random() > 0.5 ? 1 : -1
    const startX = Math.round(-18 + random() * 36)
    const midDriftX = startX + direction * Math.round(54 + random() * 64)
    const driftX = startX - direction * Math.round(26 + random() * 62)
    const rise = Math.round(92 + random() * 38)
    const rotate = Math.round(-28 + random() * 56)
    const opacity = (isLarge ? 0.18 : 0.12) + random() * (isLarge ? 0.1 : 0.14)
    return {
      id: index,
      isLarge,
      left: `${(4 + random() * 92).toFixed(2)}%`,
      startX: `${startX}px`,
      driftX: `${driftX}px`,
      midDriftX: `${midDriftX}px`,
      midRise: `${Math.round(rise * -0.52)}vh`,
      endRise: `${-rise}vh`,
      staticRise: `${Math.round(rise * -0.38)}vh`,
      size: `${Math.round(isLarge ? 34 + random() * 12 : 12 + random() * 18)}px`,
      duration: `${(isLarge ? 11.5 : 8.5 + random() * 7).toFixed(2)}s`,
      delay: `${(-random() * 16).toFixed(2)}s`,
      rotate: `${rotate}deg`,
      endRotate: `${-rotate}deg`,
      opacity: opacity.toFixed(2),
      fadeOpacity: (opacity * 0.56).toFixed(2),
      color: heartColors[index % heartColors.length],
    }
  })
}

function FlowerCluster({ side, src, alt }: { side: 'left' | 'right'; src?: string; alt: string }) {
  if (src) return <img className={`classic-card-cover__flower classic-card-cover__flower--${side}`} src={src} alt={alt} />
  return <span className={`classic-card-cover__flower classic-card-cover__flower--${side}`} aria-hidden="true"><i /><i /><i /><i /><b /></span>
}

export function ClassicCardCover({
  brideName,
  groomName,
  date,
  venue,
  note,
  eyebrow,
  leftDecorationSrc,
  rightDecorationSrc,
  decorationAlt = '',
  backgroundImageSrc,
  openLabel = 'Mở thiệp',
  openedLabel = 'Đã mở thiệp',
  isOpen,
  isOpening = false,
  onOpen,
  onOpeningComplete,
  className = '',
  sectionKey = 'opening',
  order = 0,
}: ClassicCardCoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [documentHidden, setDocumentHidden] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  )
  const heartParticles = useMemo(createHeartParticles, [])
  const open = typeof isOpen === 'boolean' ? isOpen : internalOpen
  useEffect(() => {
    const handleVisibilityChange = () => setDocumentHidden(document.hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  const handleOpen = () => {
    if (open || isOpening) return
    setInternalOpen(true)
    onOpen?.()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }
  const handleOpenButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleOpen()
  }
  const handleCardAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (!isOpening || event.animationName !== 'classic-card-cover-card-exit') return
    onOpeningComplete?.()
  }
  const style = backgroundImageSrc ? ({ '--classic-card-cover-bg': `url("${backgroundImageSrc}")` } as CSSProperties) : undefined
  const cardCoverClassName = `classic-card-cover ${open ? 'is-open' : ''} ${isOpening ? 'is-opening' : ''} ${documentHidden ? 'is-document-hidden' : ''} ${className}`.trim()

  return (
    <section className={cardCoverClassName} style={{ ...style, order }} aria-label="Mở thiệp cưới" data-editor-section={sectionKey}>
      <div className="classic-card-cover__wash" aria-hidden="true" />
      <div className="classic-card-cover__hearts" aria-hidden="true">
        {heartParticles.map((heart) => (
          <span
            key={heart.id}
            className={`classic-card-cover__heart ${heart.isLarge ? 'classic-card-cover__heart--large' : ''}`.trim()}
            style={{
              '--classic-card-cover-heart-left': heart.left,
              '--classic-card-cover-heart-start-x': heart.startX,
              '--classic-card-cover-heart-drift-x': heart.driftX,
              '--classic-card-cover-heart-mid-drift-x': heart.midDriftX,
              '--classic-card-cover-heart-mid-rise': heart.midRise,
              '--classic-card-cover-heart-end-rise': heart.endRise,
              '--classic-card-cover-heart-static-rise': heart.staticRise,
              '--classic-card-cover-heart-size': heart.size,
              '--classic-card-cover-heart-duration': heart.duration,
              '--classic-card-cover-heart-delay': heart.delay,
              '--classic-card-cover-heart-rotate': heart.rotate,
              '--classic-card-cover-heart-end-rotate': heart.endRotate,
              '--classic-card-cover-heart-opacity': heart.opacity,
              '--classic-card-cover-heart-fade-opacity': heart.fadeOpacity,
              '--classic-card-cover-heart-color': heart.color,
            } as CSSProperties}
          >
            ♥
          </span>
        ))}
      </div>
      <div className="classic-card-cover__card-shell">
        <div className="classic-card-cover__card" role={open ? undefined : 'button'} tabIndex={open ? -1 : 0} aria-label={open ? undefined : 'Mở thiệp bằng thẻ'} onClick={handleOpen} onKeyDown={handleKeyDown} onAnimationEnd={handleCardAnimationEnd}>
          <FlowerCluster side="left" src={leftDecorationSrc} alt={decorationAlt} />
          <div className="classic-card-cover__content">
            <span className="classic-card-cover__seal" aria-label="Tình yêu của cô dâu chú rể">
              <span aria-hidden="true">♥</span>
            </span>
            {eyebrow ? <span className="classic-card-cover__eyebrow">{eyebrow}</span> : null}
            <h1><span>{brideName}</span><em>&amp;</em><span>{groomName}</span></h1>
            {date ? <p className="classic-card-cover__date">{date}</p> : null}
            {venue ? <p className="classic-card-cover__venue">{venue}</p> : null}
            {note ? <p className="classic-card-cover__note">{note}</p> : null}
            <button type="button" className="classic-card-cover__open" onClick={handleOpenButtonClick} disabled={open || isOpening} aria-busy={isOpening}>{isOpening ? 'Đang mở…' : open ? openedLabel : openLabel}</button>
          </div>
          <FlowerCluster side="right" src={rightDecorationSrc} alt={decorationAlt} />
        </div>
      </div>
    </section>
  )
}
