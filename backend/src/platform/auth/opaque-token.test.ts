import { describe, expect, it } from 'vitest'

import { createOpaqueToken, hashOpaqueToken } from './opaque-token'

describe('opaque token primitives', () => {
  it('creates different URL-safe tokens with at least 256 bits of entropy', () => {
    const first = createOpaqueToken()
    const second = createOpaqueToken()

    expect(first).not.toBe(second)
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(Buffer.from(first, 'base64url')).toHaveLength(32)
  })

  it('hashes tokens deterministically without retaining the raw value', () => {
    const token = 'local-test-token'
    const digest = hashOpaqueToken(token)

    expect(digest).toHaveLength(64)
    expect(digest).toBe(hashOpaqueToken(token))
    expect(digest).not.toContain(token)
  })

  it('rejects tokens with less than 128 bits of entropy', () => {
    expect(() => createOpaqueToken(15)).toThrow(RangeError)
  })
})
