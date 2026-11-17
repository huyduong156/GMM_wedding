import { useEffect } from 'react'

const USER_PLAY_EVENT = 'ourday:invitation-user-play'
const AUTO_SCROLL_PIXELS_PER_SECOND = 14
const MAX_FRAME_DELTA_MS = 50

/** Slowly advances a guest-facing invitation until the guest interacts. */
export function useGuestInvitationAutoScroll(enabled: boolean) {
  useEffect(() => {
    if (
      !enabled ||
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let lastFrameAt = 0
    let running = false
    let stoppedByGuest = false

    const stop = () => {
      if (!running) return
      running = false
      lastFrameAt = 0
      window.cancelAnimationFrame(frame)
    }

    const scrollFrame = (now: number) => {
      if (!running) return
      const elapsed = lastFrameAt ? Math.min(now - lastFrameAt, MAX_FRAME_DELTA_MS) : 0
      lastFrameAt = now
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const nextScroll = Math.min(
        maxScroll,
        window.scrollY + (AUTO_SCROLL_PIXELS_PER_SECOND * elapsed) / 1000,
      )

      if (nextScroll > window.scrollY) window.scrollTo(0, nextScroll)
      if (nextScroll >= maxScroll) {
        stop()
        return
      }
      frame = window.requestAnimationFrame(scrollFrame)
    }

    const start = () => {
      if (running || reducedMotion.matches || document.hidden) return
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      if (window.scrollY >= maxScroll) return
      running = true
      lastFrameAt = 0
      frame = window.requestAnimationFrame(scrollFrame)
    }

    const stopForGuest = () => {
      stoppedByGuest = true
      stop()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) return
      stopForGuest()
    }
    const handleUserPlay = () => {
      stoppedByGuest = false
      start()
    }
    const handleVisibilityChange = () => {
      if (document.hidden) stop()
      else if (!stoppedByGuest) start()
    }
    const handleMotionPreference = () => {
      if (reducedMotion.matches) stop()
      else if (!stoppedByGuest) start()
    }
    const contentResizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            if (!running && !stoppedByGuest && !reducedMotion.matches) start()
          })
    contentResizeObserver?.observe(document.documentElement)

    window.addEventListener('pointerdown', stopForGuest, { passive: true })
    window.addEventListener('touchstart', stopForGuest, { passive: true })
    window.addEventListener('wheel', stopForGuest, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener(USER_PLAY_EVENT, handleUserPlay)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotion.addEventListener('change', handleMotionPreference)

    start()

    return () => {
      stop()
      window.removeEventListener('pointerdown', stopForGuest)
      window.removeEventListener('touchstart', stopForGuest)
      window.removeEventListener('wheel', stopForGuest)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener(USER_PLAY_EVENT, handleUserPlay)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotion.removeEventListener('change', handleMotionPreference)
      contentResizeObserver?.disconnect()
    }
  }, [enabled])
}
