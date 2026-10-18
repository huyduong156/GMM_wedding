import { createContext, createElement, type ReactNode, useContext, useEffect, useState } from 'react'

const PREVIEW_COUNTDOWN_DAYS = 69
const PreviewCountdownTargetContext = createContext<number | null>(null)

function formatDateLike(date: Date, referenceDate: string) {
  const referenceMatch = referenceDate.match(/^(\s*)(\d{1,4})(\D+)(\d{1,2})(\D+)(\d{1,4})/)
  const separator = referenceMatch?.[3] ?? ' · '
  const yearFirst = Boolean(referenceMatch && referenceMatch[2].length === 4)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())

  if (yearFirst) return `${year}${separator}${month}${separator}${day}`
  return `${day}${separator}${month}${separator}${year}`
}

export function PreviewCountdownProvider({
  enabled,
  children,
}: {
  enabled: boolean
  children: ReactNode
}) {
  const [target] = useState(() => {
    const previewDate = new Date()
    previewDate.setDate(previewDate.getDate() + PREVIEW_COUNTDOWN_DAYS)
    previewDate.setHours(23, 59, 59, 999)
    return previewDate.getTime()
  })

  return createElement(PreviewCountdownTargetContext.Provider, { value: enabled ? target : null }, children)
}

export type WeddingCountdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  complete: boolean
}

const calculateCountdown = (targetTime: number): WeddingCountdown => {
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

function parseCountdownTarget(targetDate: string) {
  const nativeTimestamp = new Date(targetDate).getTime()
  if (Number.isFinite(nativeTimestamp)) return nativeTimestamp

  const match = targetDate.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/)
  if (!match) return Number.NaN
  const target = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime()
  return Number.isFinite(target) ? target : Number.NaN
}

export const formatCountdownUnit = (value: number) => String(value).padStart(2, '0')

export function useWeddingCountdown(targetDate: string, refreshIntervalMs = 1000) {
  const previewTarget = useContext(PreviewCountdownTargetContext)
  const parsedTarget = parseCountdownTarget(targetDate)
  const effectiveTarget = previewTarget ?? parsedTarget
  const [countdown, setCountdown] = useState(() => calculateCountdown(effectiveTarget))

  useEffect(() => {
    const updateCountdown = () => {
      const next = calculateCountdown(effectiveTarget)
      setCountdown((previous) =>
        previous.days === next.days &&
        previous.hours === next.hours &&
        previous.minutes === next.minutes &&
        previous.seconds === next.seconds &&
        previous.complete === next.complete
          ? previous
          : next,
      )
      return next
    }
    if (updateCountdown().complete) return
    const timer = window.setInterval(
      () => {
        if (updateCountdown().complete) window.clearInterval(timer)
      },
      Math.max(1000, refreshIntervalMs),
    )
    return () => window.clearInterval(timer)
  }, [effectiveTarget, refreshIntervalMs])

  return countdown
}

export function usePreviewWeddingDate(referenceDate: string) {
  const previewTarget = useContext(PreviewCountdownTargetContext)
  if (previewTarget === null) return null
  return formatDateLike(new Date(previewTarget), referenceDate)
}
