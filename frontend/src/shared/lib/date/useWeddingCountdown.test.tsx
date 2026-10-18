import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PreviewCountdownProvider, useWeddingCountdown } from './useWeddingCountdown'

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
})
