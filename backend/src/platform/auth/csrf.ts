import { timingSafeEqual } from 'node:crypto'

import { createOpaqueToken } from './opaque-token'

export const CSRF_COOKIE_BYTES = 32
export const LOCAL_CSRF_COOKIE_NAME = 'gmm_csrf'
export const SECURE_CSRF_COOKIE_NAME = '__Host-gmm_csrf'
export const CSRF_COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60

export function getCsrfCookiePolicy(secure: boolean) {
  return {
    name: secure ? SECURE_CSRF_COOKIE_NAME : LOCAL_CSRF_COOKIE_NAME,
    options: {
      httpOnly: false,
      secure,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: CSRF_COOKIE_MAX_AGE_SECONDS,
    },
  }
}

export function createCsrfToken() {
  return createOpaqueToken(CSRF_COOKIE_BYTES)
}

export function csrfTokensMatch(expected: string | undefined, actual: string | null) {
  if (!expected || !actual) return false
  const expectedBuffer = Buffer.from(expected)
  const actualBuffer = Buffer.from(actual)
  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  )
}
