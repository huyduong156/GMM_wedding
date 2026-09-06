import { useEffect, useRef } from 'react'
type Props = { count?: number; tone?: 'day' | 'night' }
type P = {
  x: number
  y: number
  r: number
  speed: number
  drift: number
  phase: number
  alpha: number
  spin: number
  spinSpeed: number
}
export function PetalFieldSafe({ count = 22, tone = 'day' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (/jsdom/i.test(navigator.userAgent)) return
    const canvas = ref.current,
      ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const media = matchMedia('(prefers-reduced-motion: reduce)'),
      seed = (n: number) => {
        const v = Math.sin(n * 9187.17) * 43758.5453
        return v - Math.floor(v)
      }
    let petals: P[] = [],
      width = 0,
      height = 0,
      raf = 0,
      visible = false,
      last = 0
    const reset = () => {
        petals = Array.from({ length: media.matches ? 7 : Math.min(count, 24) }, (_, i) => ({
          x: seed(i + 1),
          y: seed(i + 2),
          r: 3.5 + seed(i + 3) * 6,
          speed: 0.000022 + seed(i + 4) * 0.000036,
          drift: 12 + seed(i + 5) * 26,
          phase: seed(i + 6) * 6.28,
          alpha: 0.16 + seed(i + 7) * 0.32,
          spin: seed(i + 8) * 3.14,
          spinSpeed: (seed(i + 9) - 0.5) * 0.0012,
        }))
      },
      resize = () => {
        const b = canvas.getBoundingClientRect(),
          d = Math.min(devicePixelRatio || 1, 1.5)
        width = b.width
        height = b.height
        canvas.width = Math.max(1, Math.round(width * d))
        canvas.height = Math.max(1, Math.round(height * d))
        ctx.setTransform(d, 0, 0, d, 0, 0)
      },
      paint = (advance = 0) => {
        ctx.clearRect(0, 0, width, height)
        petals.forEach((p) => {
          p.y += p.speed * advance
          p.spin += p.spinSpeed * advance
          if (p.y > 1.06) {
            p.y = -0.06
            p.x = (p.x + 0.37) % 1
          }
          const sway = Math.sin(p.y * 7 + p.phase) * p.drift + Math.sin(p.y * 2.4 + p.phase) * 8
          ctx.save()
          ctx.translate(p.x * width + sway, p.y * height)
          ctx.rotate(p.spin)
          ctx.scale(1, 0.55 + 0.25 * Math.sin(p.spin))
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = tone === 'night' ? '#ffd9e5' : '#e9a9ba'
          ctx.beginPath()
          ctx.moveTo(0, -p.r)
          ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.35, p.r * 0.75, p.r * 0.72, 0, p.r)
          ctx.bezierCurveTo(-p.r * 0.75, p.r * 0.72, -p.r * 0.9, -p.r * 0.35, 0, -p.r)
          ctx.fill()
          ctx.restore()
        })
      },
      stop = () => cancelAnimationFrame(raf),
      draw = (now: number) => {
        if (document.hidden || !visible || media.matches) return
        const dt = Math.min(32, now - last || 16)
        last = now
        paint(dt)
        raf = requestAnimationFrame(draw)
      },
      sync = () => {
        stop()
        paint(0)
        if (visible && !document.hidden && !media.matches) {
          last = 0
          raf = requestAnimationFrame(draw)
        }
      },
      io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting && e.intersectionRatio > 0.08
          sync()
        },
        { threshold: [0, 0.08] },
      ),
      ro = new ResizeObserver(() => {
        resize()
        sync()
      }),
      change = () => {
        reset()
        sync()
      }
    reset()
    resize()
    paint(0)
    io.observe(canvas)
    ro.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    media.addEventListener('change', change)
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', sync)
      media.removeEventListener('change', change)
    }
  }, [count, tone])
  return <canvas ref={ref} className="cb-petal-field" aria-hidden="true" />
}
