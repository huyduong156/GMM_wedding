import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import { TaskError } from '../domain/task-error'
import type { ApplyTemplateData, CreateTaskData, TaskListFilter, TaskRepository, TaskStatus, UpdateTaskData } from './ports'
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}
  list(actor: AuthenticatedUserActor, weddingId: string, filter: TaskListFilter) { return this.require(this.repository.listOwned(actor.userId, weddingId, filter)) }
  find(actor: AuthenticatedUserActor, weddingId: string, taskId: string) { return this.requireTask(this.repository.findOwned(actor.userId, weddingId, taskId)) }
  async create(actor: AuthenticatedUserActor, weddingId: string, data: CreateTaskData) { return this.requireTask(await this.repository.createOwned(actor.userId, weddingId, data)) }
  async update(actor: AuthenticatedUserActor, weddingId: string, taskId: string, data: UpdateTaskData) { const result = await this.repository.updateOwned(actor.userId, weddingId, taskId, data); if (result === 'conflict') throw new TaskError('TASK_REVISION_CONFLICT', 409, 'Task was changed by another request'); return this.requireTask(result) }
  async remove(actor: AuthenticatedUserActor, weddingId: string, taskId: string) { const result = await this.repository.deleteOwned(actor.userId, weddingId, taskId); if (result === null || !result) throw new TaskError('TASK_NOT_FOUND', 404, 'Task not found') }
  async reorder(actor: AuthenticatedUserActor, weddingId: string, taskIds: string[]) { return this.require(await this.repository.reorderOwned(actor.userId, weddingId, taskIds)) }
  async bulkStatus(actor: AuthenticatedUserActor, weddingId: string, taskIds: string[], status: TaskStatus) { return this.require(await this.repository.bulkStatusOwned(actor.userId, weddingId, taskIds, status)) }
  templates(locale?: string) { return this.repository.listTemplates(locale) }
  async applyTemplate(actor: AuthenticatedUserActor, weddingId: string, data: ApplyTemplateData) { return this.require(await this.repository.applyTemplate(actor.userId, weddingId, data)) }
  private require<T>(value: T | null): T { if (value === null) throw new TaskError('TASK_NOT_FOUND', 404, 'Wedding not found'); return value }
  private requireTask<T>(value: T | null): T { if (value === null) throw new TaskError('TASK_NOT_FOUND', 404, 'Task not found'); return value }
}
