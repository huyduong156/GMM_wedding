import { describe, expect, it } from 'vitest'
import { bulkAssignCategorySchema, createGuestSchema, guestQuerySchema, invitationSchema } from './guest-schemas'

describe('guest API schemas', () => {
  it('applies safe defaults and rejects invalid contact data', () => {
    expect(createGuestSchema.parse({ displayName: 'Mai', })).toMatchObject({ displayName: 'Mai', maxPartySize: 1, tags: [] })
    expect(() => createGuestSchema.parse({ displayName: 'Mai', email: 'not-an-email' })).toThrow()
  })
  it('accepts null for optional guest fields', () => {
    expect(createGuestSchema.parse({ displayName: 'Mai', phone: null, email: null, note: null, tableName: null, categoryId: null })).toMatchObject({ phone: null, email: null, note: null, tableName: null, categoryId: null })
  })
  it('limits list pagination', () => {
    expect(guestQuerySchema.parse({ limit: '25' }).limit).toBe(25)
    expect(() => guestQuerySchema.parse({ limit: '101' })).toThrow()
  })
  it('parses invitation expiry into a Date', () => {
    const result = invitationSchema.parse({ maxPartySize: 2, expiresAt: '2030-01-01T00:00:00.000Z' })
    expect(result.expiresAt).toBeInstanceOf(Date)
  })
  it('supports assigning and clearing a category for a bounded unique guest set', () => {
    expect(bulkAssignCategorySchema.parse({ guestIds: ['00000000-0000-0000-0000-000000000001'], categoryId: null }).categoryId).toBeNull()
    expect(() => bulkAssignCategorySchema.parse({ guestIds: ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'], categoryId: null })).toThrow()
  })
})
