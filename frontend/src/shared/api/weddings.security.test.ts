import { afterEach, describe, expect, it, vi } from 'vitest'

import { weddingApi } from './weddings'
import { resetCsrfTokenForTests } from './csrf'

describe('wedding API mutation safety contract', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    resetCsrfTokenForTests()
  })

  it('sends credentials and CSRF protection for bodyless DELETE mutations', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))

    await weddingApi.remove('wedding-1')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/weddings/wedding-1'),
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          'content-type': 'application/json',
          'x-csrf-token': 'test-csrf-token',
        }),
      }),
    )
  })
})
