import { describe, expect, it, vi } from 'vitest'

vi.mock('@/platform/config/env', () => ({
  getServerEnv: () => ({
    APP_ENV: 'test',
    APP_ORIGIN: 'http://localhost:8080',
    APP_ORIGINS: 'http://localhost:8080,http://localhost:5173',
  }),
}))
vi.mock('@/shared/observability/logger', () => ({ log: vi.fn() }))

import { assertSafeMutation } from './auth-http'
import { log } from '@/shared/observability/logger'

const request = (headers: Record<string, string> = {}) =>
  new Request('http://localhost:3000/api/weddings', {
    method: 'POST',
    headers: {
      origin: 'http://localhost:8080',
      'content-type': 'application/json',
      cookie: 'gmm_csrf=test-csrf-token',
      'x-csrf-token': 'test-csrf-token',
      ...headers,
    },
  })

describe('assertSafeMutation', () => {
  it('accepts an allowlisted JSON mutation with a matching CSRF cookie and header', () => {
    expect(() => assertSafeMutation(request())).not.toThrow()
  })

  it.each([
    ['missing origin', { origin: '' }],
    ['untrusted origin', { origin: 'https://attacker.example' }],
    ['missing CSRF token header', { 'x-csrf-token': '' }],
    ['mismatched CSRF token', { 'x-csrf-token': 'different-token' }],
    ['missing CSRF cookie', { cookie: '' }],
    ['cross-site fetch metadata', { 'sec-fetch-site': 'cross-site' }],
    ['non-JSON content type', { 'content-type': 'text/plain' }],
  ])('rejects %s', (_label, headers) => {
    expect(() => assertSafeMutation(request(headers))).toThrowError(
      expect.objectContaining({ code: 'REQUEST_ORIGIN_REJECTED', status: 403 }),
    )
  })

  it('accepts another explicitly configured frontend origin', () => {
    expect(() =>
      assertSafeMutation(
        request({ origin: 'http://localhost:5173', 'sec-fetch-site': 'same-site' }),
      ),
    ).not.toThrow()
  })

  it('supports the explicit binary upload content type when configured by the route', () => {
    expect(() =>
      assertSafeMutation(
        request({ 'content-type': 'image/webp' }),
        { contentTypes: ['image/webp'] },
      ),
    ).not.toThrow()
  })

  it('logs safe rejection diagnostics without logging cookie or header values', () => {
    expect(() =>
      assertSafeMutation(request({ cookie: '', 'x-csrf-token': '', 'content-type': 'text/plain' })),
    ).toThrow()

    expect(log).toHaveBeenLastCalledWith(
      'warn',
      'Safe mutation rejected',
      expect.objectContaining({
        reasons: ['csrf', 'content-type'],
        csrfCookiePresent: false,
        csrfHeaderPresent: false,
      }),
    )
    expect(JSON.stringify(vi.mocked(log).mock.lastCall)).not.toContain('test-csrf-token')
  })
})
