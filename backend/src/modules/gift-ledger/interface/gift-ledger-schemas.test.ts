import { describe, expect, it } from 'vitest'
import { createGiftSchema, updateGiftSchema } from './gift-ledger-schemas'
describe('gift ledger schemas', () => {
  it('accepts a fast money entry without guestId and normalizes amount', () => { const result = createGiftSchema.parse({ guestName: 'Nguyễn Văn A', giftType: 'money', amountMinor: '1000000', currency: 'vnd', receiveMethod: 'cash' }); expect(result.guestId).toBeUndefined(); expect(result.amountMinor).toBe(1000000n); expect(result.currency).toBe('VND') })
  it('requires type-specific gift details', () => { expect(() => createGiftSchema.parse({ guestName: 'A', giftType: 'gold', receiveMethod: 'physicalGift' })).toThrow(); expect(() => createGiftSchema.parse({ guestName: 'A', giftType: 'physicalGift', receiveMethod: 'physicalGift' })).toThrow() })
  it('requires revision for updates', () => { expect(() => updateGiftSchema.parse({ guestName: 'A' })).toThrow(); expect(updateGiftSchema.parse({ reciprocityStatus: 'returned', revision: 1 })).toMatchObject({ revision: 1 }) })
  it('accepts a guest snapshot with a linked or anonymous guest id', () => { expect(updateGiftSchema.parse({ guestName: 'A', guestId: '00000000-0000-0000-0000-000000000001', revision: 1 })).toMatchObject({ guestName: 'A' }); expect(updateGiftSchema.parse({ guestName: 'A', guestId: null, revision: 1 }).guestId).toBeNull() })
})
