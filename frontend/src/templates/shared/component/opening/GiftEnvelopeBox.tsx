import { useEffect, useState } from 'react'
import './GiftEnvelopeBox.css'

export type GiftEnvelopeBoxProps = {
  cardSrc: string
  cardAlt?: string
  iconSrc?: string
  className?: string
  decorative?: boolean
}

const ambientParticles = Array.from({ length: 10 }, (_, index) => index)

export function GiftEnvelopeBox({
  cardSrc,
  cardAlt = '',
  iconSrc,
  className = '',
  decorative = false,
}: GiftEnvelopeBoxProps) {
  const [documentHidden, setDocumentHidden] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  )

  useEffect(() => {
    const handleVisibilityChange = () => setDocumentHidden(document.hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <div
      className={`gift-envelope-box ${documentHidden ? 'is-document-hidden' : ''} ${className}`.trim()}
      aria-hidden={decorative || undefined}
    >
      <span className="gift-envelope-box__particles" aria-hidden="true">
        {ambientParticles.map((particle) =>
          iconSrc ? (
            <img key={particle} src={iconSrc} alt="" />
          ) : (
            <i key={particle}>♥</i>
          ),
        )}
      </span>
      <img className="gift-envelope-box__image gift-envelope-box__image--back" src={cardSrc} alt={cardAlt} />
      <img className="gift-envelope-box__image gift-envelope-box__image--front" src={cardSrc} alt="" aria-hidden="true" />
    </div>
  )
}
