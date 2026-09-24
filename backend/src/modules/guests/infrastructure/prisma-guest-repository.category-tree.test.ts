import { describe, expect, it, vi } from 'vitest'

import { PrismaGuestRepository, rebaseGuestCategoryTree } from './prisma-guest-repository'

const active = (id: string, parentId: string | null, depth: number) => ({
  id,
  parentId,
  depth,
  deletedAt: null,
})

describe('rebaseGuestCategoryTree', () => {
  it('promotes descendants when deleting a root category', () => {
    const rows = [active('level-1', null, 1), active('level-2', 'level-1', 2), active('level-3', 'level-2', 3)]

    expect(rebaseGuestCategoryTree(rows, new Set(['level-1']))).toEqual([
      { id: 'level-2', parentId: null, depth: 1 },
      { id: 'level-3', parentId: 'level-2', depth: 2 },
    ])
  })

  it('promotes descendants when deleting a middle category', () => {
    const rows = [active('level-1', null, 1), active('level-2', 'level-1', 2), active('level-3', 'level-2', 3)]

    expect(rebaseGuestCategoryTree(rows, new Set(['level-2']))).toEqual([
      { id: 'level-3', parentId: 'level-1', depth: 2 },
    ])
  })

  it('reconnects descendants to the nearest surviving ancestor for bulk deletion', () => {
    const rows = [
      active('level-1', null, 1),
      active('level-2', 'level-1', 2),
      active('level-3', 'level-2', 3),
      active('other-root', null, 1),
    ]

    expect(rebaseGuestCategoryTree(rows, new Set(['level-1', 'level-2']))).toEqual([
      { id: 'level-3', parentId: null, depth: 1 },
    ])
  })

  it('does not update an already normalized tree', () => {
    const rows = [active('level-1', null, 1), active('level-2', 'level-1', 2)]

    expect(rebaseGuestCategoryTree(rows, new Set())).toEqual([])
  })

  it('persists a level-three child as level two under the deleted level-two category parent', async () => {
    const categoryRows = [
      active('level-1', null, 1),
      active('level-2', 'level-1', 2),
      active('level-3', 'level-2', 3),
    ]
    const categoryUpdateMany = vi.fn().mockResolvedValue({ count: 1 })
    const transaction = {
      guestCategory: {
        findMany: vi.fn().mockResolvedValue(categoryRows),
        updateMany: categoryUpdateMany,
      },
      guest: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
    }
    const prisma = {
      wedding: { findFirst: vi.fn().mockResolvedValue({ id: 'wedding-1' }) },
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<boolean>) =>
        callback(transaction),
      ),
    }
    const repository = new PrismaGuestRepository(prisma as never)

    await expect(repository.deleteCategory('user-1', 'wedding-1', 'level-2')).resolves.toBe(true)
    expect(categoryUpdateMany).toHaveBeenCalledWith({
      where: { id: 'level-3', weddingId: 'wedding-1', deletedAt: null },
      data: { parentId: 'level-1', depth: 2 },
    })
  })
})
