export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

export interface TaskEventView { id: string; name: string; eventType: string; startsAt: Date; endsAt: Date | null }
export interface TaskView {
  id: string; weddingId: string; eventId: string | null; event: TaskEventView | null; parentTaskId: string | null
  title: string; description: string | null; dueAt: Date | null; priority: TaskPriority; status: TaskStatus
  sortOrder: number; completedAt: Date | null; completedById: string | null
  sourceTemplateKey: string | null; sourceTemplateVersion: number | null; revision: number
  createdAt: Date; updatedAt: Date
}
export interface TaskListFilter {
  query?: string | undefined; status?: TaskStatus | undefined; priority?: TaskPriority | undefined
  eventId?: string | undefined; withoutEvent?: boolean | undefined; parentTaskId?: string | undefined; withoutParent?: boolean | undefined; from?: Date | undefined; to?: Date | undefined
  limit: number; cursor?: string | undefined
}
export interface CreateTaskData { title: string; description?: string | undefined; eventId?: string | null | undefined; parentTaskId?: string | null | undefined; dueAt?: Date | undefined; priority: TaskPriority }
export interface UpdateTaskData { title?: string | undefined; description?: string | null | undefined; eventId?: string | null | undefined; parentTaskId?: string | null | undefined; dueAt?: Date | null | undefined; priority?: TaskPriority | undefined; status?: TaskStatus | undefined; revision: number }
export interface TaskRepository {
  listOwned(userId: string, weddingId: string, filter: TaskListFilter): Promise<{ items: TaskView[]; nextCursor: string | null } | null>
  findOwned(userId: string, weddingId: string, taskId: string): Promise<TaskView | null>
  createOwned(userId: string, weddingId: string, data: CreateTaskData): Promise<TaskView | null>
  bulkCreateOwned(userId: string, weddingId: string, data: BulkCreateTasksData): Promise<TaskView[] | null>
  updateOwned(userId: string, weddingId: string, taskId: string, data: UpdateTaskData): Promise<TaskView | 'conflict' | null>
  deleteOwned(userId: string, weddingId: string, taskId: string): Promise<boolean | null>
  reorderOwned(userId: string, weddingId: string, taskIds: string[]): Promise<{ updatedCount: number } | null>
  bulkStatusOwned(userId: string, weddingId: string, taskIds: string[], status: TaskStatus): Promise<{ updatedCount: number } | null>
  listTemplates(locale?: string): Promise<TaskChecklistTemplateView[]>
  applyTemplate(userId: string, weddingId: string, data: ApplyTemplateData): Promise<TaskView[] | null>
}
export interface TaskChecklistTemplateView { id: string; key: string; version: number; name: string; status: string; locale: string; items: TaskChecklistItemView[] }
export interface TaskChecklistItemView { id: string; title: string; description: string | null; priority: TaskPriority; relativeDueDayOffset: number | null; sortOrder: number }
export interface ApplyTemplateData { templateKey: string; templateVersion: number; eventId?: string | null | undefined; baseDate?: Date | undefined }
export interface BulkCreateTasksData { tasks: Array<Omit<CreateTaskData, 'parentTaskId'>> }
