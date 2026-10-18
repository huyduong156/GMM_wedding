import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { WeddingAmbient } from '../../../shared/ui/wedding-ambient/WeddingAmbient'
import { AppShell } from './AppShell'

vi.mock('../../../shared/ui/wedding-ambient/WeddingAmbient', () => ({
  WeddingAmbient: vi.fn(() => null),
}))
vi.mock('../../../features/user-guide/ui/ProductGuide', () => ({ ProductGuide: () => null }))

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('studio shell countdown isolation', () => {
  it('does not render the shell again when the wedding-day label updates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:30Z'))
    render(
      <NavigationProvider>
        <AppShell>
          <button>Thao tác trong trang</button>
        </AppShell>
      </NavigationProvider>,
    )
    expect(screen.getByRole('button', { name: 'Thao tác trong trang' })).toBeEnabled()
    const renders = vi.mocked(WeddingAmbient).mock.calls.length
    act(() => vi.advanceTimersByTime(61_000))
    expect(vi.mocked(WeddingAmbient).mock.calls.length).toBe(renders)
  })
})
