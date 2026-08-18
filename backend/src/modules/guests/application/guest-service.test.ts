import { describe, expect, it, vi } from 'vitest'
import { GuestService } from './guest-service'
import type { GuestRepository } from './ports'

const actor = { kind: 'user' as const, userId: 'user-1', sessionId: 'session-1' }
const guest = { id: 'guest-1', weddingId: 'wedding-1', categoryId: null, groupId: null, displayName: 'Nguyễn An', phone: null, email: null, note: null, tableName: null, maxPartySize: 1, tags: [], createdAt: new Date(), updatedAt: new Date() }
function repository(overrides: Partial<GuestRepository> = {}): GuestRepository { return { listOwned: vi.fn().mockResolvedValue({ items: [guest], nextCursor: null }), findOwned: vi.fn().mockResolvedValue(guest), createOwned: vi.fn().mockResolvedValue(guest), updateOwned: vi.fn().mockResolvedValue(guest), deleteOwned: vi.fn().mockResolvedValue(true), bulkDeleteOwned: vi.fn().mockResolvedValue({ deletedCount: 1 }), bulkAssignCategory: vi.fn().mockResolvedValue({ updatedCount: 1 }), listCategories: vi.fn().mockResolvedValue([]), createCategory: vi.fn().mockResolvedValue({}), updateCategory: vi.fn().mockResolvedValue({}), deleteCategory: vi.fn().mockResolvedValue(true), bulkDeleteCategories: vi.fn().mockResolvedValue({ deletedCount: 1 }), listGroups: vi.fn().mockResolvedValue([]), createGroup: vi.fn().mockResolvedValue({}), updateGroup: vi.fn().mockResolvedValue({}), deleteGroup: vi.fn().mockResolvedValue(true), listInvitations: vi.fn().mockResolvedValue({ items: [], nextCursor: null }), findInvitation: vi.fn().mockResolvedValue({}), createInvitation: vi.fn().mockResolvedValue({ invitation: {}, token: 'token' }), updateInvitation: vi.fn().mockResolvedValue({}), rotateInvitation: vi.fn().mockResolvedValue({ invitation: {}, token: 'token' }), revokeInvitation: vi.fn().mockResolvedValue(true), resolvePublicInvitation: vi.fn().mockResolvedValue(null), exportOwned: vi.fn().mockResolvedValue([]), importOwned: vi.fn().mockResolvedValue([]), ...overrides } }

describe('GuestService', () => {
  it('lists and creates guests through the owner-scoped repository', async () => {
    const repo = repository(); const service = new GuestService(repo)
    await expect(service.list(actor, 'wedding-1', { limit: 50 })).resolves.toEqual({ items: [guest], nextCursor: null })
    await expect(service.create(actor, 'wedding-1', { displayName: 'Nguyễn An', maxPartySize: 1, tags: [] })).resolves.toEqual(guest)
    expect(repo.createOwned).toHaveBeenCalledWith('user-1', 'wedding-1', expect.objectContaining({ displayName: 'Nguyễn An' }))
  })
  it('returns not found instead of leaking another tenant', async () => {
    const service = new GuestService(repository({ findOwned: vi.fn().mockResolvedValue(null), deleteOwned: vi.fn().mockResolvedValue(null) }))
    await expect(service.get(actor, 'other-wedding', 'guest-1')).rejects.toMatchObject({ code: 'GUEST_NOT_FOUND', status: 404 })
    await expect(service.remove(actor, 'other-wedding', 'guest-1')).rejects.toMatchObject({ code: 'WEDDING_NOT_FOUND', status: 404 })
  })
  it('supports category, group and invitation operations', async () => {
    const repo = repository(); const service = new GuestService(repo)
    await expect(service.categories(actor, 'wedding-1')).resolves.toEqual([])
    await expect(service.groups(actor, 'wedding-1')).resolves.toEqual([])
    await expect(service.createInvitation(actor, 'wedding-1', { maxPartySize: 2 })).resolves.toMatchObject({ token: 'token' })
    await service.revokeInvitation(actor, 'wedding-1', 'invitation-1')
    expect(repo.revokeInvitation).toHaveBeenCalledWith('user-1', 'wedding-1', 'invitation-1')
    await expect(service.listInvitations(actor, 'wedding-1', { limit: 50 })).resolves.toEqual({ items: [], nextCursor: null })
    await expect(service.getInvitation(actor, 'wedding-1', 'invitation-1')).resolves.toEqual({})
    await expect(service.updateGroup(actor, 'wedding-1', 'group-1', { name: 'Gia đình' })).resolves.toEqual({})
    await expect(service.updateInvitation(actor, 'wedding-1', 'invitation-1', { maxPartySize: 3 })).resolves.toEqual({})
    await expect(service.bulkRemove(actor, 'wedding-1', ['guest-1'])).resolves.toEqual({ deletedCount: 1 })
    await expect(service.bulkRemoveCategories(actor, 'wedding-1', ['category-1'])).resolves.toEqual({ deletedCount: 1 })
    await expect(service.bulkAssignCategory(actor, 'wedding-1', ['guest-1'], 'category-1')).resolves.toEqual({ updatedCount: 1 })
    await expect(service.bulkAssignCategory(actor, 'wedding-1', ['guest-1'], null)).resolves.toEqual({ updatedCount: 1 })
  })
  it('previews import rows and rejects invalid depth or names', () => {
    const service = new GuestService(repository())
    const result = service.previewImport([
      { displayName: '  Huyền  ', categoryPath: 'Họ nội / Bác / Gia đình', maxPartySize: 2 },
      { displayName: '', categoryPath: 'A / B / C / D' },
    ])
    expect(result.validRows).toEqual([{ displayName: 'Huyền', categoryPath: 'Họ nội / Bác / Gia đình', maxPartySize: 2 }])
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ row: 3, field: 'displayName' }),
      expect.objectContaining({ row: 3, field: 'categoryPath' }),
    ]))
  })
})
