import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SunlitSilkRenderer } from './SunlitSilkRenderer'

describe('SunlitSilkRenderer Phase 5 contract', () => {
  beforeEach(() => {
    class MockIntersectionObserver {
      observe = (element: Element) => element.classList.add('ss-section--visible')
      disconnect = vi.fn()
      unobserve = vi.fn()
      constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('opens the invitation and exposes all 16 section anchors', () => {
    render(<SunlitSilkRenderer />)
    expect(screen.getByRole('button', { name: 'Mở thiệp' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Mở thiệp' }))

    const sections = screen.getAllByRole('region')
    expect(sections).toHaveLength(16)
    expect(sections[0]).toHaveAttribute('data-section-key', 'opening')
    expect(sections.at(-1)).toHaveAttribute('data-section-key', 'footer')
    expect(sections.every((section) => section.getAttribute('data-layout'))).toBe(true)
  })

  it('keeps decorative artwork hidden from assistive technology', () => {
    render(<SunlitSilkRenderer />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở thiệp' }))
    expect(Array.from(document.querySelectorAll('img')).every((image) => image.getAttribute('aria-hidden') === 'true')).toBe(true)
  })
})
