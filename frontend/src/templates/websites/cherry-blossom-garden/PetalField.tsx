import { useEffect, useRef } from 'react'
type Props = { count?: number; tone?: 'day' | 'night' }
type Petal = {
  x: number
  y: number
  r: number
  speed: number
  drift: number
  phase: number
  alpha: number
  spin: number
}
export function PetalField({ count = 32, tone = 'day' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches,
      seed = (n: number) => {
        const v = Math.sin(n * 9187.17) * 43758.5453
        return v - Math.floor(v)
      },
      petals: Petal[] = Array.from({ length: reduced ? 7 : count }, (_, i) => ({
        x: seed(i + 1),
        y: seed(i + 2),
        r: 4 + seed(i + 3) * 7,
        speed: 0.025 + seed(i + 4) * 0.045,
        drift: 18 + seed(i + 5) * 34,
        phase: seed(i + 6) * Math.PI * 2,
        alpha: 0.18 + seed(i + 7) * 0.38,
        spin: seed(i + 8) * Math.PI,
      }))
    let width = 0,
      height = 0,
      raf = 0,
      active = false,
      last = 0
    const resize = () => {
        const box = canvas.getBoundingClientRect(),
          dpr = Math.min(devicePixelRatio || 1, 1.5)
        width = box.width
        height = box.height
        canvas.width = Math.max(1, Math.round(width * dpr))
        canvas.height = Math.max(1, Math.round(height * dpr))
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      },
      draw = (now: number) => {
        if (!active) return
        const dt = Math.min(32, now - last || 16)
        last = now
        ctx.clearRect(0, 0, width, height)
        petals.forEach((p) => {
          if (!reduced) {
            p.y += (p.speed * dt) / 16
            p.spin += 0.008 * dt
            if (p.y > 1.08) p.y = -0.08
          }
          ctx.save()
          ctx.translate(p.x * width + Math.sin(p.y * 8 + p.phase) * p.drift, p.y * height)
          ctx.rotate(p.spin)
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = tone === 'night' ? '#ffd9e5' : '#e9a9ba'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
        if (!reduced) raf = requestAnimationFrame(draw)
      },
      start = () => {
        if (active) return
        active = true
        last = 0
        raf = requestAnimationFrame(draw)
      },
      stop = () => {
        active = false
        cancelAnimationFrame(raf)
      },
      io = new IntersectionObserver(
        ([e]) =>
          e.isIntersecting && e.intersectionRatio > 0.08 && !document.hidden ? start() : stop(),
        { threshold: [0, 0.08] },
      ),
      ro = new ResizeObserver(resize),
      visibility = () => (document.hidden ? stop() : start())
    resize()
    io.observe(canvas)
    ro.observe(canvas)
    document.addEventListener('visibilitychange', visibility)
    if (reduced) {
      active = true
      draw(0)
    }
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [count, tone])
  return <canvas ref={ref} className="cb-petal-field" aria-hidden="true" />
}
