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
})
