import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VanHyShell } from './VanHyShell'

describe('VanHyShell', () => {
  it('opens from keyboard interaction and keeps the mobile shell bounded', () => {
    vi.useFakeTimers()
    render(<VanHyShell />)

    const card = screen.getByRole('button', { name: 'Mở thiệp Hỷ Sự' })
    expect(card).toHaveAttribute('tabindex', '0')
    expect(document.querySelector('.hh-page')).toHaveClass('hh-page')
    expect(document.querySelector('.hh-page')).not.toHaveClass('is-opened')

    act(() => fireEvent.keyDown(card, { key: 'Enter' }))

    expect(document.querySelector('.hh-page')).toHaveClass('is-opened')
    expect(screen.getByRole('button', { name: 'Đang mở thiệp' })).toBeDisabled()

    act(() => vi.advanceTimersByTime(760))
    expect(document.querySelector('.hh-opening')).not.toBeInTheDocument()
    expect(document.querySelector('.hh-page')).toHaveClass('is-opening-complete')
    vi.useRealTimers()
  })

  it('keeps decorative Hỷ and flower layers non-interactive', () => {
    render(<VanHyShell />)

    expect(document.querySelector('.hh-atmosphere')).toHaveAttribute('aria-hidden', 'true')
    expect(document.querySelector('.hh-flower--left')).toHaveAttribute('aria-hidden', 'true')
    expect(document.querySelector('.hh-flower--right')).toHaveAttribute('aria-hidden', 'true')
  })
})
