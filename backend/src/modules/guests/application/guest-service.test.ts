import { describe, expect, it, vi } from 'vitest'
import { GuestService } from './guest-service'
import type { GuestRepository } from './ports'

const actor = { kind: 'user' as const, userId: 'user-1', sessionId: 'session-1' }
const guest = {
  id: 'guest-1',
  slug: 'guest-1',
  weddingId: 'wedding-1',
  categoryId: null,
  groupId: null,
  displayName: 'Nguyễn An',
  phone: null,
  email: null,
  note: null,
  tableName: null,
  maxPartySize: 1,
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}
function repository(overrides: Partial<GuestRepository> = {}): GuestRepository {
  return {
    resolvePublicGuestLink: vi.fn().mockResolvedValue(null),
    listOwned: vi.fn().mockResolvedValue({ items: [guest], nextCursor: null }),
    findOwned: vi.fn().mockResolvedValue(guest),
    createOwned: vi.fn().mockResolvedValue(guest),
    updateOwned: vi.fn().mockResolvedValue(guest),
    deleteOwned: vi.fn().mockResolvedValue(true),
    bulkDeleteOwned: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    bulkAssignCategory: vi.fn().mockResolvedValue({ updatedCount: 1 }),
    listCategories: vi.fn().mockResolvedValue([]),
    createCategory: vi.fn().mockResolvedValue({}),
    updateCategory: vi.fn().mockResolvedValue({}),
    deleteCategory: vi.fn().mockResolvedValue(true),
    bulkDeleteCategories: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    listGroups: vi.fn().mockResolvedValue([]),
    createGroup: vi.fn().mockResolvedValue({}),
    updateGroup: vi.fn().mockResolvedValue({}),
    deleteGroup: vi.fn().mockResolvedValue(true),
    exportOwned: vi.fn().mockResolvedValue([]),
    importOwned: vi.fn().mockResolvedValue([]),
    ...overrides,
  }
}

describe('GuestService', () => {
  it('lists and creates guests through the owner-scoped repository', async () => {
    const repo = repository()
    const service = new GuestService(repo)
    await expect(service.list(actor, 'wedding-1', { limit: 50 })).resolves.toEqual({
      items: [guest],
      nextCursor: null,
    })
    await expect(
      service.create(actor, 'wedding-1', { name: 'Nguyễn An', maxPartySize: 1, tags: [] }),
    ).resolves.toEqual(guest)
    expect(repo.createOwned).toHaveBeenCalledWith(
      'user-1',
      'wedding-1',
      expect.objectContaining({ name: 'Nguyễn An' }),
    )
  })
  it('returns not found instead of leaking another tenant', async () => {
    const service = new GuestService(
      repository({
        findOwned: vi.fn().mockResolvedValue(null),
        deleteOwned: vi.fn().mockResolvedValue(null),
      }),
    )
    await expect(service.get(actor, 'other-wedding', 'guest-1')).rejects.toMatchObject({
      code: 'GUEST_NOT_FOUND',
      status: 404,
    })
    await expect(service.remove(actor, 'other-wedding', 'guest-1')).rejects.toMatchObject({
      code: 'WEDDING_NOT_FOUND',
      status: 404,
    })
  })
  it('previews import rows and rejects invalid depth or names', () => {
    const service = new GuestService(repository())
    const result = service.previewImport([
      { name: '  Huyền  ', categoryPath: 'Họ nội / Bác / Gia đình', maxPartySize: 2 },
      { name: '', categoryPath: 'A / B / C / D' },
    ])
    expect(result.validRows).toEqual([
      { name: 'Huyền', categoryPath: 'Họ nội / Bác / Gia đình', maxPartySize: 2 },
    ])
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ row: 3, field: 'name' }),
        expect.objectContaining({ row: 3, field: 'categoryPath' }),
      ]),
    )
  })
})
