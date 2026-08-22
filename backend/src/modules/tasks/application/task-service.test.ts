import { describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import type { TaskRepository } from './ports'
import { TaskService } from './task-service'

const actor: AuthenticatedUserActor = { kind: 'user', userId: 'user-1', sessionId: 'session-1' }
const repository = (overrides: Partial<TaskRepository> = {}): TaskRepository => ({ listOwned: vi.fn().mockResolvedValue({ items: [], nextCursor: null }), findOwned: vi.fn().mockResolvedValue(null), createOwned: vi.fn(), bulkCreateOwned: vi.fn(), updateOwned: vi.fn(), deleteOwned: vi.fn(), reorderOwned: vi.fn().mockResolvedValue({ updatedCount: 1 }), bulkStatusOwned: vi.fn().mockResolvedValue({ updatedCount: 1 }), listTemplates: vi.fn().mockResolvedValue([]), applyTemplate: vi.fn(), ...overrides })

describe('TaskService', () => {
  it('maps revision conflicts', async () => {
    const repo = repository({ updateOwned: vi.fn().mockResolvedValue('conflict') })
    await expect(new TaskService(repo).update(actor, 'wedding-1', 'task-1', { status: 'DONE', revision: 1 })).rejects.toMatchObject({ code: 'TASK_REVISION_CONFLICT', status: 409 })
  })
  it('delegates bulk status to the owner-scoped repository', async () => {
    const bulkStatusOwned = vi.fn().mockResolvedValue({ updatedCount: 2 })
    const repo = repository({ bulkStatusOwned })
    await expect(new TaskService(repo).bulkStatus(actor, 'wedding-1', ['task-1', 'task-2'], 'DONE')).resolves.toEqual({ updatedCount: 2 })
    expect(bulkStatusOwned).toHaveBeenCalledWith('user-1', 'wedding-1', ['task-1', 'task-2'], 'DONE')
  })
})
