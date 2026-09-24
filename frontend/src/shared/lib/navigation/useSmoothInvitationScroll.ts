import { useEffect } from 'react'

type SmoothScrollTarget = string | number | HTMLElement
type SmoothScrollOptions = {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
}

type SmoothScrollRuntime = {
  scrollTo: (target: SmoothScrollTarget, options?: Record<string, unknown>) => void
  destroy: () => void
  stop?: () => void
  start?: () => void
}

let activeSmoothScroll: SmoothScrollRuntime | undefined

/** Scroll through the active Lenis runtime and fall back to native scrolling. */
export function smoothScrollTo(target: SmoothScrollTarget, options: SmoothScrollOptions = {}) {
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = reduced ? 'auto' : (options.behavior ?? 'smooth')
  const element =
    typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : typeof HTMLElement !== 'undefined' && target instanceof HTMLElement
        ? target
        : null
  const resolvedTarget =
    element && typeof window !== 'undefined'
      ? window.scrollY + element.getBoundingClientRect().top -
        (options.block === 'center' ? (window.innerHeight - element.getBoundingClientRect().height) / 2 : 0)
      : target

  if (activeSmoothScroll && behavior !== 'auto') {
    activeSmoothScroll.scrollTo(resolvedTarget, { immediate: false })
    return
  }

  if (typeof resolvedTarget === 'number') {
    window.scrollTo({ top: resolvedTarget, behavior })
    return
  }

  if (element?.scrollIntoView) {
    element.scrollIntoView({ behavior, block: options.block ?? 'start' })
  } else if (element) {
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top, behavior })
  }
}

/**
 * Desktop-only Lenis wrapper for public template renderers.
 * Mobile, touch and reduced-motion keep native document scrolling.
 */
export function useSmoothTemplateScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(pointer: fine) and (min-width: 701px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!media.matches || reduced.matches) return

    let active = true
    let smoothScroll: SmoothScrollRuntime | undefined

    void import('lenis').then(({ default: Lenis }) => {
      if (!active || document.hidden) return
      smoothScroll = new Lenis({
        autoRaf: true,
        // Keep the same inertia profile as Verdant Promise's original
        // renderer-owned implementation.
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.85,
      })
      activeSmoothScroll = smoothScroll
      document.documentElement.dataset.smoothScroll = 'lenis'
    })

    const onVisibilityChange = () => {
      if (document.hidden) smoothScroll?.stop?.()
      else smoothScroll?.start?.()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      active = false
      document.removeEventListener('visibilitychange', onVisibilityChange)
      smoothScroll?.destroy()
      if (activeSmoothScroll === smoothScroll) {
        activeSmoothScroll = undefined
        delete document.documentElement.dataset.smoothScroll
      }
    }
  }, [enabled])
}

/** @deprecated Use useSmoothTemplateScroll for new template renderers. */
export const useSmoothInvitationScroll = useSmoothTemplateScroll
