import { describe, expect, it } from 'vitest'
import { registerRequestSchema, updateProfileRequestSchema } from './auth-schemas'

describe('registerRequestSchema', () => {
  it('accepts an optional workspace access token for a new-member registration', () => {
    expect(
      registerRequestSchema.parse({
        email: ' new.member@example.test ',
        password: 'a-secure-password',
        workspaceAccessToken: 'a'.repeat(32),
      }),
    ).toMatchObject({
      email: 'new.member@example.test',
      workspaceAccessToken: 'a'.repeat(32),
    })
  })
})

describe('updateProfileRequestSchema', () => {
  it('accepts editable profile fields and nullable values for clearing', () => {
    expect(
      updateProfileRequestSchema.parse({
        displayName: ' Nguyễn An ',
        phone: '+84 912 345 678',
        avatarUrl: null,
      }),
    ).toEqual({
      displayName: 'Nguyễn An',
      phone: '+84 912 345 678',
      avatarUrl: null,
    })
  })

  it('rejects empty updates and malformed phone numbers', () => {
    expect(() => updateProfileRequestSchema.parse({})).toThrow()
    expect(() => updateProfileRequestSchema.parse({ phone: 'abc' })).toThrow()
  })
})
