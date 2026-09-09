import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WoodlandLetterpressInvitation } from './WoodlandLetterpressInvitation'

describe('WoodlandLetterpressInvitation opening', () => {
  afterEach(() => vi.useRealTimers())

  it('keeps the seal centered on hover and removes cover after opening', () => {
    vi.useFakeTimers()
    render(<WoodlandLetterpressInvitation />)

    const openButton = screen.getByRole('button', { name: 'Mở thiệp' })
    expect(openButton).toBeEnabled()
    fireEvent.mouseEnter(openButton)
    expect(openButton).toBeInTheDocument()

    act(() => fireEvent.click(openButton))
    expect(screen.getByText('Woodland Letterpress')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(760))

    expect(screen.queryByRole('button', { name: 'Mở thiệp' })).not.toBeInTheDocument()
    expect(document.querySelector('.wl-cover')).not.toBeInTheDocument()
    expect(screen.getByText('Một ngày thật dịu dàng')).toBeInTheDocument()
  })
})
