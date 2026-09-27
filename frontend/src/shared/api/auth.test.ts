import { afterEach, describe, expect, it, vi } from 'vitest'

import { authApi } from './auth'
import { resetCsrfTokenForTests } from './csrf'

describe('auth API mutation safety contract', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    resetCsrfTokenForTests()
  })

  it('sends credentials and the CSRF protection header for JSON mutations', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ user: { id: 'user-1' } }), { status: 200 }),
      )

    await authApi.login('owner@example.test', 'password')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          'content-type': 'application/json',
          'x-csrf-token': 'test-csrf-token',
        }),
      }),
    )
  })

  it('keeps CSRF protection on a bodyless mutation when the API sends an empty body', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))

    await authApi.logout()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({ 'x-csrf-token': 'test-csrf-token' }),
      }),
    )
  })

  it('retries CSRF initialization after the first attempt fails', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: 'retry-csrf-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 'user-1' } }), { status: 200 }))

    await expect(authApi.login('owner@example.test', 'password')).rejects.toThrow(
      'Không thể khởi tạo bảo vệ CSRF.',
    )
    await authApi.login('owner@example.test', 'password')

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[2]?.[1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-csrf-token': 'retry-csrf-token' }),
      }),
    )
  })
})
