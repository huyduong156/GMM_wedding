import { describe, expect, it, vi } from 'vitest'
import { GiftLedgerService } from './gift-ledger-service'
import type { GiftLedgerRepository } from './ports'
const actor = { kind: 'user' as const, userId: 'user-1', sessionId: 'session-1' }
const entry = { id: 'entry-1' }
function repository(overrides: Record<string, unknown> = {}) { return { listOwned: vi.fn().mockResolvedValue({ items: [], nextCursor: null }), findOwned: vi.fn().mockResolvedValue(entry), createOwned: vi.fn().mockResolvedValue(entry), updateOwned: vi.fn().mockResolvedValue(entry), deleteOwned: vi.fn().mockResolvedValue(true), summaryOwned: vi.fn().mockResolvedValue({ entryCount: 0 }), exportOwned: vi.fn().mockResolvedValue([]), promoteToGuest: vi.fn().mockResolvedValue(entry), linkGuest: vi.fn().mockResolvedValue(entry), unlinkGuest: vi.fn().mockResolvedValue(entry), ...overrides } as unknown as GiftLedgerRepository }
describe('GiftLedgerService', () => {
  it('delegates owner-scoped fast create and guest linking', async () => { const repo = repository(); const service = new GiftLedgerService(repo); await service.create(actor, 'wedding-1', { guestName: 'A', giftType: 'money', amountMinor: 1n, currency: 'VND', receiveMethod: 'cash', receivedAt: new Date() }); await service.link(actor, 'wedding-1', 'entry-1', 'guest-1'); expect(repo.createOwned).toHaveBeenCalledWith('user-1', 'wedding-1', expect.objectContaining({ guestName: 'A' })); expect(repo.linkGuest).toHaveBeenCalledWith('user-1', 'wedding-1', 'entry-1', 'guest-1') })
  it('maps revision conflict to a 409 error', async () => { const service = new GiftLedgerService(repository({ updateOwned: vi.fn().mockResolvedValue('conflict') })); await expect(service.update(actor, 'wedding-1', 'entry-1', { revision: 1 })).rejects.toMatchObject({ code: 'GIFT_REVISION_CONFLICT', status: 409 }) })
})
