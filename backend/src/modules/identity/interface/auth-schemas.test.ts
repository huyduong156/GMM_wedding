import { describe, expect, it } from 'vitest'
import { updateProfileRequestSchema } from './auth-schemas'

describe('updateProfileRequestSchema', () => {
  it('accepts editable profile fields and nullable values for clearing', () => {
    expect(updateProfileRequestSchema.parse({ displayName: ' Nguyễn An ', phone: '+84 912 345 678', avatarUrl: null })).toEqual({
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
