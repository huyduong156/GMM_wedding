import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeddingApiError, weddingApi } from '../../api/weddings'
import { usePublicGuest } from './usePublicGuest'

describe('usePublicGuest', () => {
  it('does not call the guest endpoint without a guest slug', async () => {
    const request = vi.spyOn(weddingApi, 'publicInvitationGuest')
    const { result } = renderHook(() => usePublicGuest({ weddingSlug: 'mai-duc' }))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(request).not.toHaveBeenCalled()
    expect(result.current.guestName).toBeNull()
    request.mockRestore()
  })

  it('loads and exposes the guest display name outside template content', async () => {
    const request = vi.spyOn(weddingApi, 'publicInvitationGuest').mockResolvedValue({
      invitation: {
        weddingSlug: 'mai-duc',
        invitationSlug: 'anh-ba-hung',
        guestName: 'Anh Ba Hưng',
        maxPartySize: 2,
        expiresAt: null,
      },
    })
    const { result } = renderHook(() =>
      usePublicGuest({ weddingSlug: 'mai-duc', guestSlug: 'anh-ba-hung' }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(request).toHaveBeenCalledWith('mai-duc', 'anh-ba-hung')
    expect(result.current).toMatchObject({
      guestName: 'Anh Ba Hưng',
      guestSlug: 'anh-ba-hung',
      maxPartySize: 2,
      notFound: false,
      error: '',
    })
    request.mockRestore()
  })

  it('marks a missing guest slug as not found', async () => {
    const request = vi
      .spyOn(weddingApi, 'publicInvitationGuest')
      .mockRejectedValue(new WeddingApiError(404, 'RESOURCE_NOT_FOUND', 'Guest link not found'))
    const { result } = renderHook(() =>
      usePublicGuest({ weddingSlug: 'mai-duc', guestSlug: 'missing' }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.notFound).toBe(true)
    expect(result.current.error).toBe('')
    request.mockRestore()
  })

  it('keeps the invitation renderable when guest lookup has a non-404 error', async () => {
    const request = vi
      .spyOn(weddingApi, 'publicInvitationGuest')
      .mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() =>
      usePublicGuest({ weddingSlug: 'mai-duc', guestSlug: 'anh-ba-hung' }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.notFound).toBe(false)
    request.mockRestore()
  })
})
