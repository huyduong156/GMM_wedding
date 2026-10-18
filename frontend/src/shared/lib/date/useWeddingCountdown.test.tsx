import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PreviewCountdownProvider, usePreviewWeddingDate, useWeddingCountdown } from './useWeddingCountdown'

describe('useWeddingCountdown preview defaults', () => {
  it('uses a dynamic target 69 days ahead for template demo previews', () => {
    const { result } = renderHook(() => useWeddingCountdown('2020-01-01T00:00:00'), {
      wrapper: ({ children }) => (
        <PreviewCountdownProvider enabled>{children}</PreviewCountdownProvider>
      ),
    })

    expect(result.current.days).toBe(69)
    expect(result.current.complete).toBe(false)
  })

  it('keeps the provided wedding date when the preview default is disabled', () => {
    const { result } = renderHook(() => useWeddingCountdown('2020-01-01T00:00:00'), {
      wrapper: ({ children }) => (
        <PreviewCountdownProvider enabled={false}>{children}</PreviewCountdownProvider>
      ),
    })

    expect(result.current.days).toBe(0)
    expect(result.current.complete).toBe(true)
  })

  it('formats the demo date using the template date style, including ISO dates', () => {
    const { result } = renderHook(() => ({
      dotted: usePreviewWeddingDate('16.01.2027'),
      iso: usePreviewWeddingDate('2027-01-16'),
    }), {
      wrapper: ({ children }) => (
        <PreviewCountdownProvider enabled>{children}</PreviewCountdownProvider>
      ),
    })
    const expected = new Date()
    expected.setDate(expected.getDate() + 69)
    const day = String(expected.getDate()).padStart(2, '0')
    const month = String(expected.getMonth() + 1).padStart(2, '0')
    const year = expected.getFullYear()

    expect(result.current.dotted).toBe(`${day}.${month}.${year}`)
    expect(result.current.iso).toBe(`${year}-${month}-${day}`)
  })
})
