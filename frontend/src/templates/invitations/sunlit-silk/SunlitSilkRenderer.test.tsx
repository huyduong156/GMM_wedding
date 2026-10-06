import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SunlitSilkRenderer } from './SunlitSilkRenderer'
import { sunlitSilkSectionConfig } from './fixture'

describe('SunlitSilkRenderer rebuild contract', () => {
  afterEach(() => vi.useRealTimers())

  it('keeps the new opening in the DOM until its exit choreography completes', () => {
    vi.useFakeTimers()
    render(<SunlitSilkRenderer />)
    expect(document.documentElement).toHaveClass('ss-opening-lock')
    const button = screen.getByRole('button', { name: 'Mở thiệp' })
    fireEvent.click(button)
    expect(screen.getByRole('dialog')).toHaveClass('is-celebrating')
    expect(screen.getByRole('dialog')).not.toHaveClass('is-opening')
    expect(document.body).toHaveClass('ss-opening-lock')

    act(() => vi.advanceTimersByTime(300))
    expect(screen.getByRole('dialog')).toHaveClass('is-opening')

    act(() => vi.advanceTimersByTime(1_500))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('ss-opening-lock')
  })

  it('exposes all 16 editor anchors and distinct interactive surfaces', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        sectionConfig={{ ...sunlitSilkSectionConfig, enabled: sunlitSilkSectionConfig.order }}
      />,
    )
    expect(container.querySelectorAll('[data-editor-section]')).toHaveLength(16)
    expect(screen.getByRole('link', { name: /mở bản đồ/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ảnh tiếp theo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /gửi phản hồi/i })).toBeDisabled()
  })

  it('keeps decorative artwork hidden from assistive technology', () => {
    const { container } = render(<SunlitSilkRenderer editorMode />)
    expect(
      Array.from(container.querySelectorAll('.ss-decor')).every(
        (image) => image.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true)
  })

  it('removes disabled optional sections without leaving placeholders', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        sectionConfig={{
          enabled: ['opening', 'cover', 'invitation', 'families', 'eventDetails', 'footer'],
          order: ['opening', 'cover', 'invitation', 'families', 'eventDetails', 'footer'],
        }}
      />,
    )
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="footer"]')).toBeInTheDocument()
  })
})
