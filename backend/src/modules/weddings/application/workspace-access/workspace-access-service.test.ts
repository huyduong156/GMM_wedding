import type { PrismaClient } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'
import { WorkspaceAccessService } from './workspace-access-service'

const actor = {
  kind: 'user' as const,
  userId: '00000000-0000-4000-8000-000000000001',
  sessionId: 'session-1',
}
const weddingId = '10000000-0000-4000-8000-000000000001'

describe('WorkspaceAccessService', () => {
  it('never exposes token hashes when listing workspace access links', async () => {
    const db = {
      weddingMember: { findFirst: vi.fn().mockResolvedValue({ id: 'member-1', role: 'OWNER' }) },
      weddingWorkspaceAccess: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'access-1', weddingId, tokenHash: 'secret-hash', status: 'PENDING' },
        ]),
      },
    } as unknown as PrismaClient

    const access = await new WorkspaceAccessService(db).list(actor, weddingId)

    expect(access).toEqual([
      expect.objectContaining({ id: 'access-1', weddingId, status: 'PENDING' }),
    ])
    expect(access[0]).not.toHaveProperty('tokenHash')
  })

  it('does not allow a workspace owner to leave', async () => {
    const db = {
      weddingMember: { findFirst: vi.fn().mockResolvedValue({ id: 'member-1', role: 'OWNER' }) },
    } as unknown as PrismaClient

    await expect(new WorkspaceAccessService(db).leave(actor, weddingId)).rejects.toMatchObject({
      code: 'WORKSPACE_OWNER_CANNOT_LEAVE',
      status: 409,
    })
  })

  it('reactivates a revoked member when they claim a new access link', async () => {
    const memberUpdate = vi.fn().mockResolvedValue({ id: 'member-1', status: 'ACTIVE' })
    const tx = {
      weddingWorkspaceAccess: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'access-1',
          weddingId,
          email: null,
          role: 'EDITOR',
          status: 'PENDING',
          createdAt: new Date('2026-09-16T00:00:00.000Z'),
          expiresAt: new Date('2026-10-16T00:00:00.000Z'),
        }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      user: { findUnique: vi.fn().mockResolvedValue({ email: 'member@example.test' }) },
      weddingMember: {
        findUnique: vi.fn().mockResolvedValue({ id: 'member-1', status: 'REVOKED' }),
        update: memberUpdate,
        create: vi.fn(),
      },
    }
    const db = { $transaction: vi.fn((callback) => callback(tx)) } as unknown as PrismaClient

    await new WorkspaceAccessService(db).accept(actor, 'a'.repeat(32))

    expect(memberUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'member-1' },
        data: expect.objectContaining({ status: 'ACTIVE', role: 'EDITOR', revokedAt: null }),
      }),
    )
    expect(tx.weddingMember.create).not.toHaveBeenCalled()
  })
})
