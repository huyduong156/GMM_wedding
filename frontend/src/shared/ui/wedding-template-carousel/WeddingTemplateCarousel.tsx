import { useEffect, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { AppLink } from '../../lib/navigation/AppLink'
import { publicTemplateRoutes } from '../../config/routes'
import './wedding-template-carousel.css'

const slides = [
  { name: 'Élan d’Amour', style: 'Thiệp mời hiện đại', image: '/assets/images/templates/modern-luxe/couple-portrait.jpg', position: 'center' },
  { name: 'Ivory Letter', style: 'Tối giản', image: '/assets/images/login-wedding-luxury.jpg', position: 'center 44%' },
  { name: 'Botanical Vow', style: 'Tinh tế', image: '/assets/images/templates/modern-luxe/wedding-detail.jpg', position: 'center' },
  { name: 'Brown Atelier', style: 'Sang trọng', image: '/assets/images/templates/modern-luxe/couple-portrait.jpg', position: '60% center' },
  { name: 'Silk Ceremony', style: 'Lãng mạn', image: '/assets/images/login-wedding-luxury.jpg', position: '68% center' },
  { name: 'White Garden', style: 'Trong trẻo', image: '/assets/images/templates/modern-luxe/wedding-detail.jpg', position: '35% center' },
]

export function WeddingTemplateCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 4200)
    return () => window.clearInterval(timer)
  }, [paused])

  const move = (direction: number) => setActive((current) => (current + direction + slides.length) % slides.length)

  return (
    <div className="template-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="template-carousel-stage" aria-live="polite">
        {slides.map((slide, index) => {
          let offset = index - active
          if (offset > slides.length / 2) offset -= slides.length
          if (offset < -slides.length / 2) offset += slides.length
          const boundedOffset = Math.max(-3, Math.min(3, offset))
          const depth = Math.abs(boundedOffset)
          const slideStyle = {
            '--slide-image-position': slide.position,
            '--slide-x': `${boundedOffset * 52}%`,
            '--slide-z': `${depth * -180}px`,
            '--slide-rotate': `${boundedOffset * -12}deg`,
            '--slide-scale': 1 - depth * .08,
            '--slide-opacity': 1 - depth * .23,
            '--slide-saturation': 1 - depth * .16,
          } as React.CSSProperties
          return (
            <AppLink
              to={publicTemplateRoutes.modernLuxePreview}
              className="template-slide"
              ariaLabel={`Xem mẫu ${slide.name}`}
              key={slide.name}
            >
              <article data-offset={boundedOffset} style={slideStyle}>
                <img src={slide.image} alt={`Banner thiệp cưới ${slide.name}`} loading="lazy" />
                <div><strong>{slide.name}</strong><span>{slide.style}</span></div>
              </article>
            </AppLink>
          )
        })}
      </div>
      <div className="template-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Mẫu thiệp trước"><CaretLeft /></button>
        <span><strong>{String(active + 1).padStart(2, '0')}</strong> / {String(slides.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => move(1)} aria-label="Mẫu thiệp tiếp theo"><CaretRight /></button>
      </div>
    </div>
  )
}
