import { useEffect, useState, type RefObject } from 'react'
import { animate } from 'motion/react'

export const abdMotion = {
  duration: 0.82,
  stagger: 0.12,
  listStagger: 0.1,
  ease: [0.22, 1, 0.36, 1] as const,
}

/** Subscribe locally so live OS preferences and desktop-to-touch resizes clean up Lenis. */
export function useABDMotionPreferences() {
  const read = () => ({
    reduced: typeof window.matchMedia !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    desktop: typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine) and (min-width: 701px)').matches,
    supported: typeof IntersectionObserver !== 'undefined' && typeof window.matchMedia === 'function',
  })
  const [preferences, setPreferences] = useState(read)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(pointer: fine) and (min-width: 701px)')
    const update = () => setPreferences({ reduced: reduced.matches, desktop: desktop.matches, supported: typeof IntersectionObserver !== 'undefined' })
    reduced.addEventListener('change', update)
    desktop.addEventListener('change', update)
    return () => { reduced.removeEventListener('change', update); desktop.removeEventListener('change', update) }
  }, [])
  return preferences
}

/** Visible HTML first: an observer starts a finite entrance, never owns a hidden page. */
export function useABDMotion(ref: RefObject<HTMLElement>, enabled: boolean, revision: string) {
  useEffect(() => {
    const site = ref.current
    if (!site || !enabled || typeof IntersectionObserver === 'undefined' || typeof window.matchMedia !== 'function') return
    const controls = new Set<ReturnType<typeof animate>>()
    const targets = Array.from(site.querySelectorAll<HTMLElement>('[data-motion-variant]'))
    const chapters = Array.from(site.querySelectorAll<HTMLElement>('.abd-chapter'))
    const visible = new Set<HTMLElement>()
    const restore = () => {
      controls.forEach((control) => control.stop())
      targets.forEach((target) => { target.style.removeProperty('opacity'); target.style.removeProperty('transform') })
    }
    const entrance = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return
        entrance.unobserve(target)
        const element = target as HTMLElement
        const list = element.dataset.motionOrder !== undefined
        const order = Math.min(Number(element.dataset.motionOrder ?? element.dataset.motionStep ?? 0), 5)
        const image = element.dataset.motionVariant === 'image'
        const control = animate(element, {
          opacity: [0.32, 1],
          transform: image ? ['translateY(22px) scale(.975)', 'translateY(0) scale(1)'] : ['translateY(20px)', 'translateY(0)'],
        }, { duration: abdMotion.duration, delay: order * (list ? abdMotion.listStagger : abdMotion.stagger), ease: abdMotion.ease })
        controls.add(control)
        if (document.hidden) control.pause()
        void control.then(() => {
          controls.delete(control)
          element.style.removeProperty('opacity')
          element.style.removeProperty('transform')
        })
      })
    }, { threshold: 0, rootMargin: '0px 0px -32% 0px' })
    targets.forEach((target) => entrance.observe(target))
    const presence = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const chapter = target as HTMLElement
        chapter.classList.toggle('is-in-view', isIntersecting)
        if (isIntersecting) visible.add(chapter)
        else visible.delete(chapter)
      })
      const active = [...visible].sort((a, b) => Math.abs(a.getBoundingClientRect().top - 140) - Math.abs(b.getBoundingClientRect().top - 140))[0]
      site.querySelectorAll<HTMLAnchorElement>('.abd-nav__links a').forEach((link) => {
        if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }, { threshold: [0, 0.15, 0.45] })
    chapters.forEach((chapter) => presence.observe(chapter))
    const depthMedia = window.matchMedia('(min-width: 900px) and (pointer: fine)')
    const hero = site.querySelector<HTMLElement>('.abd-hero')
    const frame = site.querySelector<HTMLElement>('.abd-hero__stage')
    const photo = site.querySelector<HTMLElement>('.abd-hero__photo-depth')
    const story = site.querySelector<HTMLElement>('.abd-story')
    const rail = site.querySelector<HTMLElement>('.abd-story__progress-fill')
    let raf = 0
    const update = () => {
      raf = 0
      if (document.hidden || !depthMedia.matches) return
      if (hero && visible.has(hero)) {
        const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight))
        if (frame) frame.style.transform = `translateY(${progress * -14}px)`
        if (photo) photo.style.transform = `translateY(${progress * 24}px) scale(1.04)`
      }
      if (story && rail && visible.has(story)) {
        const bounds = story.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - bounds.top) / bounds.height))
        rail.style.transform = `scaleY(${progress})`
      }
    }
    const request = () => { if (!raf && !document.hidden && depthMedia.matches) raf = requestAnimationFrame(update) }
    const visibility = () => {
      site.dataset.motionRunning = document.hidden ? 'false' : 'true'
      controls.forEach((control) => document.hidden ? control.pause() : control.play())
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0 }
      else request()
    }
    const resize = () => {
      if (!depthMedia.matches) { frame?.style.removeProperty('transform'); photo?.style.removeProperty('transform'); rail?.style.removeProperty('transform') }
      request()
    }
    visibility()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      entrance.disconnect(); presence.disconnect(); cancelAnimationFrame(raf); restore()
      window.removeEventListener('scroll', request); window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
      delete site.dataset.motionRunning
      chapters.forEach((chapter) => chapter.classList.remove('is-in-view'))
      frame?.style.removeProperty('transform'); photo?.style.removeProperty('transform'); rail?.style.removeProperty('transform')
      site.querySelectorAll('[aria-current]').forEach((link) => link.removeAttribute('aria-current'))
    }
  }, [ref, enabled, revision])
}
