import type { CSSProperties } from 'react'
import './home-ambient.css'

type AmbientItem = {
  src: string
  className: string
  width: number
  delay: number
  duration: number
  top: number
}

const flyingItems: AmbientItem[] = [
  { src: '/assets/images/home-decor/elegant_wax-envelope_v1.png', className: 'ambient-across', width: 74, delay: -3, duration: 24, top: 12 },
  { src: '/assets/images/home-decor/ivory-feather.png', className: 'ambient-across ambient-across-reverse', width: 64, delay: -14, duration: 29, top: 34 },
  { src: '/assets/images/home-decor/blush-petals.png', className: 'ambient-fall', width: 58, delay: -8, duration: 21, top: 4 },
  { src: '/assets/images/home-decor/elegant_calla-lily_v1.png', className: 'ambient-across ambient-across-reverse', width: 62, delay: -20, duration: 31, top: 70 },
  { src: '/assets/images/home-decor/ivory-feather.png', className: 'ambient-fall ambient-fall-right', width: 48, delay: -2, duration: 25, top: 2 },
  { src: '/assets/images/home-decor/blush-petals.png', className: 'ambient-fall', width: 46, delay: -15, duration: 28, top: 1 },
  { src: '/assets/images/home-decor/elegant_satin-bow_v1.png', className: 'ambient-across', width: 68, delay: -18, duration: 33, top: 82 },
  { src: '/assets/images/home-decor/ivory-feather.png', className: 'ambient-fall ambient-fall-right', width: 40, delay: -21, duration: 30, top: 3 },
]

export function HomeAmbient() {
  return (
    <div className="home-ambient" aria-hidden="true">
      <img className="home-ambient-generated home-wedding-vows" src="/assets/images/home-decor/wedding-vows.png" alt="" />
      <img className="home-ambient-generated home-dandelion" src="/assets/images/home-decor/dandelion.png" alt="" />
      <img className="home-ambient-still ambient-rings" src="/assets/images/home-decor/elegant_intertwined-rings_v1.png" alt="" />
      <img className="home-ambient-still ambient-bow" src="/assets/images/home-decor/elegant_satin-bow_v1.png" alt="" />
      {flyingItems.map(({ src, className, width, delay, duration, top }, index) => (
        <img
          className={`home-ambient-photo ${className}`}
          key={`${className}-${index}`}
          src={src}
          alt=""
          style={{ '--ambient-width': `${width}px`, '--ambient-delay': `${delay}s`, '--ambient-duration': `${duration}s`, '--ambient-top': `${top}%` } as CSSProperties}
        />
      ))}
    </div>
  )
}
