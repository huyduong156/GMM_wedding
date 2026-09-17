import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'
import { FallingStars } from '../../../shared/ui/falling-stars/FallingStars'
import './AstralOpeningCard.css'

type AstralOpeningCardProps = {
  brideName: string
  groomName: string
  date?: ReactNode
  venue?: ReactNode
  note?: ReactNode
  eyebrow?: ReactNode
  leftDecorationSrc?: string
  rightDecorationSrc?: string
  openLabel?: string
  openedLabel?: string
  isOpen?: boolean
  isOpening?: boolean
  onOpen?: () => void
  className?: string
  sectionKey?: string
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)
const getViewport = () => ({
  width: typeof window === 'undefined' ? 1024 : window.innerWidth,
  height: typeof window === 'undefined' ? 768 : window.innerHeight,
})
const meteorVector = (x: number, y: number) => ({
  travelX: `${x.toFixed(0)}px`,
  travelY: `${y.toFixed(0)}px`,
  travelMidX: `${(x * 0.5).toFixed(0)}px`,
  travelMidY: `${(y * 0.5).toFixed(0)}px`,
  tailAngle: `${(Math.atan2(-y, -x) * 180 / Math.PI).toFixed(2)}deg`,
})
const directionalMeteorVector = (top: number, left: number, viewport: { width: number; height: number }, minLength: number, maxLength: number, startShiftTop = 0, startShiftLeft = 0) => {
  const boundaryLength = Math.min((left + 5) / 100, (105 - top) / 100)
  const length = Math.max(0.02, boundaryLength * randomBetween(minLength, maxLength))
  return meteorVector(-(length + startShiftLeft / 100) * viewport.width, (length - startShiftTop / 100) * viewport.height)
}
const createOpeningMeteor = (index: number) => {
  const viewport = getViewport()
  const columns = 30
  const rows = 20
  const column = index % columns
  const row = Math.floor(index / columns)
  const top = (row + randomBetween(0.02, 0.98)) / rows * 100
  const left = (column + randomBetween(0.02, 0.98)) / columns * 100
  return {
    top: `${(-10 + top).toFixed(2)}%`,
    left: `${(10 + left).toFixed(2)}%`,
    size: `${randomBetween(3, 9).toFixed(2)}px`,
    tail: `${randomBetween(45, 150).toFixed(0)}px`,
    delay: `${randomBetween(0, 650).toFixed(0)}ms`,
    duration: `${randomBetween(1050, 1725).toFixed(0)}ms`,
    cycle: `${randomBetween(3000, 5000).toFixed(0)}ms`,
    ...directionalMeteorVector(top, left, viewport, 0.95, 1.05, -10, 10),
  }
}

export function AstralOpeningCard({
  brideName, groomName, date, venue, note, eyebrow, leftDecorationSrc, rightDecorationSrc,
  openLabel = 'Mở thiệp', openedLabel = 'Thiệp đã mở', isOpen = false, isOpening = false,
  onOpen, className = '', sectionKey = 'opening',
}: AstralOpeningCardProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const openingMeteors = useMemo(() => Array.from({ length: 600 }, (_, index) => createOpeningMeteor(index)), [])
  const open = isOpen || internalOpen
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

  return (
    <section className={`astral-opening-card ${open ? 'is-open' : ''} ${isOpening ? 'is-opening' : ''} ${className}`.trim()} aria-label="Mở thiệp cưới" data-editor-section={sectionKey}>
      <div className="astral-opening-card__wash" aria-hidden="true" />
      <FallingStars target=".astral-opening-card" />
      <div className="astral-opening-card__stars" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ left: `${(index * 37 + 11) % 96}%`, top: `${(index * 61 + 8) % 92}%`, animationDelay: `${-(index * 1.45) % 11}s` }} />)}</div>
      <div className="astral-opening-card__opening-meteor-rain" aria-hidden="true">{openingMeteors.map((meteor, index) => <i key={index} style={{ top: meteor.top, left: meteor.left, '--meteor-size': meteor.size, '--meteor-tail': meteor.tail, '--meteor-delay': meteor.delay, '--meteor-duration': meteor.duration, '--meteor-cycle': meteor.cycle, '--meteor-x': meteor.travelX, '--meteor-y': meteor.travelY, '--meteor-mid-x': meteor.travelMidX, '--meteor-mid-y': meteor.travelMidY, '--meteor-tail-angle': meteor.tailAngle } as React.CSSProperties} />)}</div>
      <div className="astral-opening-card__blackout" aria-hidden="true" />
      <div className="astral-opening-card__particles" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ left: `${8 + index * 7.5}%`, animationDelay: `${-index * 1.2}s` }} />)}</div>
      <div className="astral-opening-card__shell">
        <div className="astral-opening-card__card" role={open ? undefined : 'button'} tabIndex={open ? -1 : 0} aria-label={open ? undefined : 'Mở thiệp bằng thẻ'} onClick={handleOpen} onKeyDown={handleKeyDown}>
          {leftDecorationSrc && <img className="astral-opening-card__decoration astral-opening-card__decoration--left" src={leftDecorationSrc} alt="" />}
          <div className="astral-opening-card__content">
            <span className="astral-opening-card__seal" aria-hidden="true">✦</span>
            {eyebrow && <span className="astral-opening-card__eyebrow">{eyebrow}</span>}
            <h1><span>{brideName}</span><em>&amp;</em><span>{groomName}</span></h1>
            {date && <p className="astral-opening-card__date">{date}</p>}
            {venue && <p className="astral-opening-card__venue">{venue}</p>}
            {note && <p className="astral-opening-card__note">{note}</p>}
            <button type="button" className="astral-opening-card__open" onClick={(event) => { event.stopPropagation(); handleOpen() }} disabled={open || isOpening} aria-busy={isOpening}>{isOpening ? 'Đang mở…' : open ? openedLabel : openLabel}</button>
          </div>
          {rightDecorationSrc && <img className="astral-opening-card__decoration astral-opening-card__decoration--right" src={rightDecorationSrc} alt="" />}
        </div>
      </div>
    </section>
  )
}
