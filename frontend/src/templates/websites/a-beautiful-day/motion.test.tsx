import { act, renderHook } from '@testing-library/react'
import { useABDMotion, useABDMotionPreferences } from './motion'

const { animateMock, control } = vi.hoisted(() => {
  const control = { stop: vi.fn(), pause: vi.fn(), play: vi.fn(), then: vi.fn() }
  return { control, animateMock: vi.fn(() => control) }
})
vi.mock('motion/react', () => ({ animate: animateMock }))

class Observer {
  static instances: Observer[] = []
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(private callback: IntersectionObserverCallback) { Observer.instances.push(this) }
  fire(target: Element, isIntersecting = true) {
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

function mediaQueries() {
  const queries = new Map<string, { matches: boolean; listeners: Set<() => void>; addEventListener: (_: string, listener: () => void) => void; removeEventListener: (_: string, listener: () => void) => void }>()
  const matchMedia = (query: string) => {
    if (!queries.has(query)) {
      const listeners = new Set<() => void>()
      queries.set(query, { matches: !query.includes('reduced-motion'), listeners, addEventListener: (_event, listener) => listeners.add(listener), removeEventListener: (_event, listener) => listeners.delete(listener) })
    }
    return queries.get(query)!
  }
  vi.stubGlobal('matchMedia', matchMedia)
  return { queries, matchMedia }
}

describe('A Beautiful Day motion lifecycle', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.clearAllMocks(); Observer.instances = [] })

  it('reacts to live reduced-motion and desktop eligibility changes and removes listeners', () => {
    vi.stubGlobal('IntersectionObserver', Observer)
    const { queries, matchMedia } = mediaQueries()
    const { result, unmount } = renderHook(useABDMotionPreferences)
    expect(result.current).toEqual({ reduced: false, desktop: true, supported: true })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    act(() => { reduced.matches = true; reduced.listeners.forEach((listener) => listener()) })
    expect(result.current.reduced).toBe(true)
    const desktop = matchMedia('(pointer: fine) and (min-width: 701px)')
    act(() => { desktop.matches = false; desktop.listeners.forEach((listener) => listener()) })
    expect(result.current.desktop).toBe(false)
    unmount()
    expect([...queries.values()].every((query) => query.listeners.size === 0)).toBe(true)
  })

  it('reports unavailable observers as a static enhancement fallback', () => {
    mediaQueries()
    vi.stubGlobal('IntersectionObserver', undefined)
    const { result } = renderHook(useABDMotionPreferences)
    expect(result.current.supported).toBe(false)
  })

  it('observes semantic targets only, pauses controls when hidden and restores visibility on cleanup', () => {
    vi.stubGlobal('IntersectionObserver', Observer)
    mediaQueries()
    const site = document.createElement('main')
    site.innerHTML = '<section class="abd-chapter" id="hero"><h1 data-motion-variant="title">Tên cặp đôi</h1><img class="abd-artwork" alt="" /></section>'
    const target = site.querySelector<HTMLElement>('h1')!
    const { unmount } = renderHook(() => useABDMotion({ current: site }, true, 'hero'))
    const [entrance, presence] = Observer.instances
    expect(entrance.observe).toHaveBeenCalledTimes(1)
    expect(entrance.observe).toHaveBeenCalledWith(target)
    expect(target.style.opacity).toBe('')
    act(() => entrance.fire(target))
    expect(animateMock).toHaveBeenCalledWith(target, expect.objectContaining({ opacity: [0.32, 1] }), expect.objectContaining({ duration: .82, delay: 0 }))
    act(() => presence.fire(site.querySelector('section')!))
    expect(site.querySelector('section')).toHaveClass('is-in-view')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(site.dataset.motionRunning).toBe('false')
    expect(control.pause).toHaveBeenCalled()
    target.style.opacity = '0.32'
    target.style.transform = 'translateY(20px)'
    unmount()
    expect(control.stop).toHaveBeenCalled()
    expect(entrance.disconnect).toHaveBeenCalled()
    expect(target.style.opacity).toBe('')
    expect(target.style.transform).toBe('')
    expect(site.dataset.motionRunning).toBeUndefined()
  })
})
