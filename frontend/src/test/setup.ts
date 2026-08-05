import '@testing-library/jest-dom/vitest'

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  constructor(private readonly callback: IntersectionObserverCallback) {}

  disconnect() {}

  observe(target: Element) {
    const bounds = target.getBoundingClientRect()
    this.callback([{
      boundingClientRect: bounds,
      intersectionRatio: 1,
      intersectionRect: bounds,
      isIntersecting: true,
      rootBounds: null,
      target,
      time: 0,
    }], this)
  }

  takeRecords() {
    return []
  }

  unobserve() {}
}

globalThis.IntersectionObserver = IntersectionObserverMock
window.scrollTo = vi.fn()
