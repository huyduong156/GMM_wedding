import { useCallback, useEffect, useRef } from 'react'

/**
 * Desktop-only Lenis wrapper for invitation renderers.
 * Mobile, touch and reduced-motion keep native document scrolling.
 */
export function useSmoothInvitationScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(pointer: fine) and (min-width: 701px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!media.matches || reduced.matches) return

    let active = true
    let smoothScroll: { destroy: () => void; stop?: () => void; start?: () => void } | undefined

    void import('lenis').then(({ default: Lenis }) => {
      if (!active || document.hidden) return
      smoothScroll = new Lenis({ autoRaf: true, lerp: 0.12, smoothWheel: true, wheelMultiplier: 0.8 })
    })

    const onVisibilityChange = () => {
      if (document.hidden) smoothScroll?.stop?.()
      else smoothScroll?.start?.()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => { active = false; document.removeEventListener('visibilitychange', onVisibilityChange); smoothScroll?.destroy() }
  }, [enabled])
}
