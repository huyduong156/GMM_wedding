import { useEffect, useState } from 'react'

export const ABeautifulDayCountdown = ({ startsAt }: { startsAt: string }) => {
  const [now, setNow] = useState(Date.now)
  const target = new Date(startsAt).getTime()
  useEffect(() => {
    if (!Number.isFinite(target)) return
    let timer: ReturnType<typeof setInterval> | undefined
    const tick = () => {
      const current = Date.now()
      setNow(current)
      if (current >= target) clearInterval(timer)
    }
    const visibility = () => {
      clearInterval(timer)
      if (!document.hidden) { tick(); if (Date.now() < target) timer = setInterval(tick, 1000) }
    }
    visibility()
    document.addEventListener('visibilitychange', visibility)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', visibility) }
  }, [target])
  if (!Number.isFinite(target)) return null
  const seconds = Math.max(0, Math.floor((target - now) / 1000))
  if (!seconds) return <p className="abd-countdown__complete" data-motion-variant="copy">Ngày vui đã đến. Cảm ơn bạn đã đồng hành cùng chúng mình.</p>
  const units = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
  return <div className="abd-countdown__units" aria-label="Thời gian còn lại đến ngày cưới" aria-live="off">{units.map((value, index) => <span data-motion-variant="copy" data-motion-order={index} key={index}><strong>{String(value).padStart(2, '0')}</strong><small>{['ngày', 'giờ', 'phút', 'giây'][index]}</small></span>)}</div>
}
