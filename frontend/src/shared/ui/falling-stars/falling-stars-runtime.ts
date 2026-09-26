type CountRange = { min: number; max: number }

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

function createMeteor(rect: DOMRect) {
  const top = randomBetween(0, 100)
  const left = randomBetween(0, 100)
  const size = randomBetween(2.2, 5.6)
  const edgeDistance = Math.min((left + 5) / 100, (105 - top) / 100)
  const distance = Math.max(0.78, Math.min(1.05, edgeDistance * randomBetween(.88, 1.02)))
  const x = -distance * rect.width
  const y = distance * rect.height
  const flightMs = Math.max(5000, Math.min(6500, randomBetween(5400, 6000) * distance))
  return {
    top: top.toFixed(2) + '%',
    left: left.toFixed(2) + '%',
    size: size.toFixed(2) + 'px',
    tail: (size < 3.8 ? randomBetween(80, 165) : randomBetween(110, 200)).toFixed(0) + 'px',
    delay: randomBetween(0, 2200).toFixed(0) + 'ms',
    cycle: flightMs.toFixed(0) + 'ms',
    x: x.toFixed(0) + 'px',
    y: y.toFixed(0) + 'px',
    angle: (Math.atan2(-y, -x) * 180 / Math.PI).toFixed(2) + 'deg',
  }
}

export function mountFallingStars(
  target: string,
  options: { count?: number | CountRange; className?: string } = {},
) {
  const host = document.querySelector<HTMLElement>(target)
  if (!host) return () => undefined
  const layer = document.createElement('div')
  layer.className = ('falling-stars ' + (options.className ?? '')).trim()
  layer.setAttribute('aria-hidden', 'true')
  host.appendChild(layer)
  const range = typeof options.count === 'number'
    ? { min: options.count, max: options.count }
    : options.count ?? { min: 4, max: 6 }
  let frame = 0
  const render = () => {
    const total = Math.floor(randomBetween(range.min, range.max + 1))
    layer.replaceChildren(...Array.from({ length: total }, () => {
      const star = document.createElement('i')
      const applyMeteor = (initial = false) => {
        const meteor = createMeteor(host.getBoundingClientRect())
        star.style.left = meteor.left
        star.style.top = meteor.top
        star.style.setProperty('--falling-star-size', meteor.size)
        star.style.setProperty('--falling-star-tail', meteor.tail)
        star.style.setProperty('--falling-star-delay', initial ? meteor.delay : '0ms')
        star.style.setProperty('--falling-star-cycle', meteor.cycle)
        star.style.setProperty('--falling-star-x', meteor.x)
        star.style.setProperty('--falling-star-y', meteor.y)
        star.style.setProperty('--falling-star-angle', meteor.angle)
      }
      applyMeteor(true)
      star.addEventListener('animationend', (event) => {
        if (event.animationName !== 'falling-stars-flight') return
        applyMeteor()
        star.style.animation = 'none'
        void star.offsetWidth
        star.style.animation = ''
      })
      return star
    }))
  }
  const scheduleRender = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(render)
  }
  render()
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleRender)
  observer?.observe(host)
  return () => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
    layer.remove()
  }
}
