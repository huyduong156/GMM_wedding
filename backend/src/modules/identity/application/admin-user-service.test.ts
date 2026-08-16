import type { PrismaClient } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'
import { AdminUserService } from './admin-user-service'

function dbMock() {
  const db = {
    user: { findFirst: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    userRole: { updateMany: vi.fn(), createMany: vi.fn() },
    auditLog: { create: vi.fn() },
    $transaction: vi.fn(async (callback: (tx: typeof db) => unknown) => callback(db)),
  }
  return db
}

describe('AdminUserService', () => {
  it('rejects mutation of the current admin account', async () => {
    const db = dbMock()
    await expect(new AdminUserService(db as unknown as PrismaClient).update('admin-id', 'admin-id', { status: 'SUSPENDED' })).rejects.toMatchObject({ code: 'SELF_ADMIN_USER_MUTATION_FORBIDDEN', status: 409 })
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it('rejects removing the last active administrator', async () => {
    const db = dbMock()
    db.user.findFirst.mockResolvedValue({ id: 'user-id', status: 'ACTIVE', roles: [{ role: 'ADMIN', expiresAt: null }] })
    db.user.count.mockResolvedValue(1)
    await expect(new AdminUserService(db as unknown as PrismaClient).update('admin-id', 'user-id', { roles: [] })).rejects.toMatchObject({ code: 'LAST_ADMIN_REQUIRED', status: 409 })
    expect(db.$transaction).not.toHaveBeenCalled()
  })
})