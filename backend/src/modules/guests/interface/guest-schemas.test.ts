import { describe, expect, it } from 'vitest'
import {
  bulkAssignCategorySchema,
  bulkAssignFamilySideSchema,
  createGuestSchema,
  guestQuerySchema,
} from './guest-schemas'

describe('guest API schemas', () => {
  it('applies safe defaults and rejects invalid contact data', () => {
    expect(createGuestSchema.parse({ name: 'Mai' })).toMatchObject({
      name: 'Mai',
      maxPartySize: 1,
      tags: [],
    })
    expect(() => createGuestSchema.parse({ name: 'Mai', email: 'not-an-email' })).toThrow()
  })
  it('accepts null for optional guest fields', () => {
    expect(
      createGuestSchema.parse({
        name: 'Mai',
        phone: null,
        email: null,
        note: null,
        tableName: null,
        categoryId: null,
      }),
    ).toMatchObject({ phone: null, email: null, note: null, tableName: null, categoryId: null })
  })
  it('limits list pagination', () => {
    expect(guestQuerySchema.parse({ limit: '25' }).limit).toBe(25)
    expect(() => guestQuerySchema.parse({ limit: '101' })).toThrow()
  })
  it('accepts family side values and clearing', () => {
    expect(createGuestSchema.parse({ name: 'Mai', familySide: 'BRIDE' }).familySide).toBe('BRIDE')
    expect(createGuestSchema.parse({ name: 'Mai', familySide: null }).familySide).toBeNull()
    expect(
      bulkAssignFamilySideSchema.parse({
        guestIds: ['00000000-0000-0000-0000-000000000001'],
        familySide: null,
      }).familySide,
    ).toBeNull()
  })
  it('supports assigning and clearing a category for a bounded unique guest set', () => {
    expect(
      bulkAssignCategorySchema.parse({
        guestIds: ['00000000-0000-0000-0000-000000000001'],
        categoryId: null,
      }).categoryId,
    ).toBeNull()
    expect(() =>
      bulkAssignCategorySchema.parse({
        guestIds: ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'],
        categoryId: null,
      }),
    ).toThrow()
  })
})
