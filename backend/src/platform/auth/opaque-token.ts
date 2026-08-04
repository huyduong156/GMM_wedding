import { createHash, randomBytes } from 'node:crypto'

import { SESSION_TOKEN_BYTES } from './session-policy'

export function createOpaqueToken(byteLength = SESSION_TOKEN_BYTES): string {
  if (!Number.isSafeInteger(byteLength) || byteLength < 16) {
    throw new RangeError('Opaque tokens require at least 128 bits of entropy')
  }

  return randomBytes(byteLength).toString('base64url')
}

export function hashOpaqueToken(token: string): string {
  if (!token) {
    throw new TypeError('Token must not be empty')
  }

  return createHash('sha256').update(token, 'utf8').digest('hex')
}
