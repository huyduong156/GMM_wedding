import { useEffect, useState } from 'react'

export type WeddingCountdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  complete: boolean
}

const calculateCountdown = (targetDate: string): WeddingCountdown => {
  const targetTime = new Date(targetDate).getTime()
  const remaining = Number.isFinite(targetTime) ? Math.max(0, targetTime - Date.now()) : 0
  const totalSeconds = Math.floor(remaining / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: remaining === 0,
  }
}

export const formatCountdownUnit = (value: number) => String(value).padStart(2, '0')

export function useWeddingCountdown(targetDate: string) {
  const [countdown, setCountdown] = useState(() => calculateCountdown(targetDate))

  useEffect(() => {
    const updateCountdown = () => setCountdown(calculateCountdown(targetDate))
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [targetDate])

  return countdown
}
