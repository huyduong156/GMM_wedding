import { act, cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSmoothTemplateScroll } from '../shared/lib/navigation/useSmoothInvitationScroll'
import { VanHyInvitation } from './invitations/van-hy/VanHyInvitation'
import { vanHyFixture } from './invitations/van-hy/fixture'
import { EditorialVowsWebsite } from './websites/editorial-vows/EditorialVowsWebsite'

vi.mock('../shared/lib/navigation/useSmoothInvitationScroll', () => ({
  useSmoothTemplateScroll: vi.fn(),
}))

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('countdown updates stay inside their child component', () => {
  it.each([
    ['Vạn Hỷ', () => <VanHyInvitation data={vanHyFixture} />, '.hh-countdown-value'],
    ['Editorial Vows', () => <EditorialVowsWebsite />, '.ev-countdown strong'],
  ] as const)('%s updates seconds without rendering its page again', (_, element, selector) => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
    const { container } = render(element())
    const before = container.querySelectorAll(selector)[3]?.textContent
    expect(before).toBeDefined()
    // This hook is called on every root-renderer invocation, including no-op renders.
    const rootRenders = vi.mocked(useSmoothTemplateScroll).mock.calls.length
    act(() => vi.advanceTimersByTime(2_000))
    expect(container.querySelectorAll(selector)[3]?.textContent).not.toBe(before)
    expect(vi.mocked(useSmoothTemplateScroll).mock.calls.length).toBe(rootRenders)
  })
})
