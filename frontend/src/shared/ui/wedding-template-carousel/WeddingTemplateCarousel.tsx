import { useEffect, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { AppLink } from '../../lib/navigation/AppLink'
import { publicTemplateRoutes } from '../../config/routes'
import { weddingApi, type WeddingTemplate } from '../../api/weddings'
import { TemplateThumbnail } from '../TemplateThumbnail'
import './wedding-template-carousel.css'

type CarouselSlide = {
  name: string
  style: string
  image?: string | null
  position: string
  href?: string
}

const previewPaths: Record<string, string> = {
  'modern-luxe': publicTemplateRoutes.modernLuxePreview,
  'verdant-promise': publicTemplateRoutes.verdantPromisePreview,
  'chibi-daydream': publicTemplateRoutes.chibiDaydreamPreview,
  'peony-veranda': publicTemplateRoutes.peonyVerandaPreview,
  'astral-vow': publicTemplateRoutes.astralVowPreview,
  'rose-garden': publicTemplateRoutes.roseGardenPreview,
  'van-hy': publicTemplateRoutes.vanHyPreview,
  'aurelia-court': publicTemplateRoutes.aureliaCourtPreview,
}

function apiSlides(items: WeddingTemplate[]) {
  return items.slice(0, 6).map((item) => ({
    name: item.name,
    style: item.description ?? 'Thiệp online',
    image: item.versions.find((version) => !version.deprecatedAt)?.thumbnailUrl ?? null,
    position: 'center',
    href: previewPaths[item.key] ?? publicTemplateRoutes.modernLuxePreview,
  }))
}

export function WeddingTemplateCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [items, setItems] = useState<CarouselSlide[]>([])

  useEffect(() => {
    let activeRequest = true
    void weddingApi.templates('ONLINE_INVITATION').then((result) => {
      const next = apiSlides(result.items)
      if (activeRequest && next.length) setItems(next)
    }).catch(() => undefined)
    return () => { activeRequest = false }
  }, [])

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % items.length),
      4200,
    )
    return () => window.clearInterval(timer)
  }, [items.length, paused])

  const move = (direction: number) =>
    setActive((current) => (current + direction + items.length) % items.length)

  return (
    <div
      className="template-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="template-carousel-stage" aria-live="polite">
        {items.map((slide, index) => {
          let offset = index - active
          if (offset > items.length / 2) offset -= items.length
          if (offset < -items.length / 2) offset += items.length
          const boundedOffset = Math.max(-3, Math.min(3, offset))
          const depth = Math.abs(boundedOffset)
          const slideStyle = {
            '--slide-image-position': slide.position,
            '--slide-x': `${boundedOffset * 52}%`,
            '--slide-z': `${depth * -180}px`,
            '--slide-rotate': `${boundedOffset * -12}deg`,
            '--slide-scale': 1 - depth * 0.08,
            '--slide-opacity': 1 - depth * 0.23,
            '--slide-saturation': 1 - depth * 0.16,
          } as React.CSSProperties
          return (
            <AppLink
              to={'href' in slide && typeof slide.href === 'string' ? slide.href : publicTemplateRoutes.modernLuxePreview}
              className="template-slide"
              ariaLabel={`Xem mẫu ${slide.name}`}
              key={slide.name}
            >
              <article data-offset={boundedOffset} style={slideStyle}>
                {slide.image ? (
                  <TemplateThumbnail className="template-carousel-thumbnail" src={slide.image} alt={`Banner thiệp cưới ${slide.name}`} loading="lazy" />
                ) : (
                  <div className="template-carousel-thumbnail template-carousel-thumbnail-fallback" aria-label={`Xem mẫu ${slide.name}`}>
                    <span>{slide.name}</span>
                  </div>
                )}
                <div>
                  <strong>{slide.name}</strong>
                  <span>{slide.style}</span>
                </div>
              </article>
            </AppLink>
          )
        })}
      </div>
      <div className="template-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Mẫu thiệp trước">
          <CaretLeft />
        </button>
        <span>
          <strong>{String(active + 1).padStart(2, '0')}</strong> /{' '}
          {String(items.length).padStart(2, '0')}
        </span>
        <button type="button" onClick={() => move(1)} aria-label="Mẫu thiệp tiếp theo">
          <CaretRight />
        </button>
      </div>
    </div>
  )
}
