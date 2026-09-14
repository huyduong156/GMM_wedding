import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import './ClassicCardCover.css'

export type ClassicCardCoverProps = {
  brideName: string
  groomName: string
  date?: ReactNode
  venue?: ReactNode
  note?: ReactNode
  leftDecorationSrc?: string
  rightDecorationSrc?: string
  decorationAlt?: string
  backgroundImageSrc?: string
  openLabel?: string
  openedLabel?: string
  isOpen?: boolean
  isOpening?: boolean
  onOpen?: () => void
  className?: string
  sectionKey?: string
  order?: number
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
  leftDecorationSrc,
  rightDecorationSrc,
  decorationAlt = '',
  backgroundImageSrc,
  openLabel = 'Mở thiệp',
  openedLabel = 'Đã mở thiệp',
  isOpen,
  isOpening = false,
  onOpen,
  className = '',
  sectionKey = 'opening',
  order = 0,
}: ClassicCardCoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = typeof isOpen === 'boolean' ? isOpen : internalOpen
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
  const style = backgroundImageSrc ? ({ '--classic-card-cover-bg': `url("${backgroundImageSrc}")` } as CSSProperties) : undefined

  return (
    <section className={`classic-card-cover ${open ? 'is-open' : ''} ${isOpening ? 'is-opening' : ''} ${className}`.trim()} style={{ ...style, order }} aria-label="Mở thiệp cưới" data-editor-section={sectionKey}>
      <div className="classic-card-cover__wash" aria-hidden="true" />
      <div className="classic-card-cover__hearts" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <span key={index}>♥</span>)}</div>
      <div className="classic-card-cover__card-shell">
        <div className="classic-card-cover__card" role={open ? undefined : 'button'} tabIndex={open ? -1 : 0} aria-label={open ? undefined : 'Mở thiệp bằng thẻ'} onClick={handleOpen} onKeyDown={handleKeyDown}>
          <FlowerCluster side="left" src={leftDecorationSrc} alt={decorationAlt} />
          <div className="classic-card-cover__content">
            <span className="classic-card-cover__seal" aria-label="Tình yêu của cô dâu chú rể">
              <span aria-hidden="true">♥</span>
            </span>
            <h1><span>{brideName}</span><em>&amp;</em><span>{groomName}</span></h1>
            {date ? <p className="classic-card-cover__date">{date}</p> : null}
            {venue ? <p className="classic-card-cover__venue">{venue}</p> : null}
            {note ? <p className="classic-card-cover__note">{note}</p> : null}
            <button type="button" className="classic-card-cover__open" onClick={handleOpen} disabled={open || isOpening} aria-busy={isOpening}>{isOpening ? 'Đang mở…' : open ? openedLabel : openLabel}</button>
          </div>
          <FlowerCluster side="right" src={rightDecorationSrc} alt={decorationAlt} />
        </div>
      </div>
    </section>
  )
}