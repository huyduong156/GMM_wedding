import { Prisma, type PrismaClient } from '@prisma/client'
import type {
  ApplyTemplateData,
  BulkCreateTasksData,
  CreateTaskData,
  TaskChecklistTemplateView,
  TaskListFilter,
  TaskRepository,
  TaskStatus,
  TaskView,
  UpdateTaskData,
} from '../application/ports'
import { TaskError } from '../domain/task-error'

const eventSelect = {
  id: true,
  name: true,
  eventType: true,
  startsAt: true,
  endsAt: true,
} satisfies Prisma.WeddingEventSelect
const taskSelect = {
  id: true,
  weddingId: true,
  eventId: true,
  parentTaskId: true,
  title: true,
  description: true,
  dueAt: true,
  priority: true,
  status: true,
  sortOrder: true,
  completedAt: true,
  completedById: true,
  sourceTemplateKey: true,
  sourceTemplateVersion: true,
  revision: true,
  createdAt: true,
  updatedAt: true,
  event: { select: eventSelect },
} satisfies Prisma.WeddingTaskSelect
const encode = (value: { sortOrder: number; id: string }) =>
  Buffer.from(JSON.stringify([value.sortOrder, value.id])).toString('base64url')
function decode(cursor?: string) {
  if (!cursor) return undefined
  try {
    const [sortOrder, id] = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as [
      number,
      string,
    ]
    return typeof sortOrder === 'number' && typeof id === 'string' ? { sortOrder, id } : undefined
  } catch {
    return undefined
  }
}

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}
  private ownedWhere(userId: string, weddingId: string) {
    return { id: weddingId, createdById: userId, deletedAt: null } as const
  }
  private async owns(userId: string, weddingId: string) {
    return Boolean(
      await this.prisma.wedding.findFirst({
        where: this.ownedWhere(userId, weddingId),
        select: { id: true },
      }),
    )
  }
  private map(row: Prisma.WeddingTaskGetPayload<{ select: typeof taskSelect }>): TaskView {
    return row as TaskView
  }
  private async validateReferences(
    tx: Prisma.TransactionClient,
    weddingId: string,
    eventId?: string | null,
    parentTaskId?: string | null,
    currentTaskId?: string,
  ) {
    if (
      eventId &&
      !(await tx.weddingEvent.findFirst({
        where: { id: eventId, weddingId, deletedAt: null },
        select: { id: true },
      }))
    )
      throw new TaskError('TASK_EVENT_NOT_FOUND', 404, 'Wedding event not found')
    if (parentTaskId !== undefined && parentTaskId !== null) {
      if (parentTaskId === currentTaskId)
        throw new TaskError('TASK_PARENT_INVALID', 400, 'A task cannot be its own parent')
      const parent = await tx.weddingTask.findFirst({
        where: { id: parentTaskId, weddingId, deletedAt: null },
        select: { id: true, parentTaskId: true },
      })
      if (!parent) throw new TaskError('TASK_PARENT_INVALID', 400, 'Parent task not found')
      if (parent.parentTaskId)
        throw new TaskError('TASK_PARENT_INVALID', 400, 'A child task cannot have child tasks')
    }
  }
  async listOwned(userId: string, weddingId: string, filter: TaskListFilter) {
    if (!(await this.owns(userId, weddingId))) return null
    const cursor = decode(filter.cursor)
    const where: Prisma.WeddingTaskWhereInput = {
      weddingId,
      deletedAt: null,
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.priority ? { priority: filter.priority } : {}),
      ...(filter.eventId ? { eventId: filter.eventId } : {}),
      ...(filter.withoutEvent ? { eventId: null } : {}),
      ...(filter.parentTaskId ? { parentTaskId: filter.parentTaskId } : {}),
      ...(filter.withoutParent ? { parentTaskId: null } : {}),
      ...(filter.query
        ? {
            OR: [
              { title: { contains: filter.query, mode: 'insensitive' } },
              { description: { contains: filter.query, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(filter.from || filter.to
        ? {
            dueAt: {
              ...(filter.from ? { gte: filter.from } : {}),
              ...(filter.to ? { lte: filter.to } : {}),
            },
          }
        : {}),
      ...(cursor
        ? {
            OR: [
              { sortOrder: { gt: cursor.sortOrder } },
              { sortOrder: cursor.sortOrder, id: { gt: cursor.id } },
            ],
          }
        : {}),
    }
    const rows = await this.prisma.weddingTask.findMany({
      where,
      select: taskSelect,
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      take: filter.limit + 1,
    })
    const hasNextPage = rows.length > filter.limit
    const items = rows.slice(0, filter.limit).map((row) => this.map(row))
    return {
      items,
      nextCursor: hasNextPage && items.length ? encode(items[items.length - 1]!) : null,
    }
  }
  async findOwned(userId: string, weddingId: string, taskId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    const row = await this.prisma.weddingTask.findFirst({
      where: { id: taskId, weddingId, deletedAt: null },
      select: taskSelect,
    })
    return row ? this.map(row) : null
  }
  async createOwned(userId: string, weddingId: string, data: CreateTaskData) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      await this.validateReferences(
        tx,
        weddingId,
        data.parentTaskId ? null : data.eventId,
        data.parentTaskId,
      )
      const last = await tx.weddingTask.aggregate({
        where: { weddingId, deletedAt: null },
        _max: { sortOrder: true },
      })
      const row = await tx.weddingTask.create({
        data: {
          weddingId,
          title: data.title,
          priority: data.priority,
          sortOrder: (last._max.sortOrder ?? -1) + 1,
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.parentTaskId !== undefined ? { parentTaskId: data.parentTaskId } : {}),
          ...(data.parentTaskId
            ? { eventId: null }
            : data.eventId !== undefined
              ? { eventId: data.eventId }
              : {}),
          ...(data.dueAt !== undefined ? { dueAt: data.dueAt } : {}),
        },
        select: taskSelect,
      })
      return this.map(row)
    })
  }
  async updateOwned(userId: string, weddingId: string, taskId: string, data: UpdateTaskData) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.weddingTask.findFirst({
        where: { id: taskId, weddingId, deletedAt: null },
        select: { status: true, parentTaskId: true },
      })
      if (!current) return null
      const effectiveParentTaskId =
        data.parentTaskId !== undefined ? data.parentTaskId : current.parentTaskId
      if (data.eventId !== undefined || data.parentTaskId !== undefined)
        await this.validateReferences(
          tx,
          weddingId,
          effectiveParentTaskId ? null : data.eventId,
          data.parentTaskId,
          taskId,
        )
      if (data.parentTaskId && !current.parentTaskId)
        await tx.weddingTask.updateMany({
          where: { parentTaskId: taskId, deletedAt: null },
          data: { parentTaskId: null, eventId: null, revision: { increment: 1 } },
        })
      const nextStatus = data.status ?? current.status
      const completion =
        nextStatus === 'DONE'
          ? { completedAt: new Date(), completedById: userId }
          : { completedAt: null, completedById: null }
      const eventUpdate = effectiveParentTaskId
        ? { eventId: null }
        : data.eventId !== undefined
          ? { eventId: data.eventId }
          : {}
      const result = await tx.weddingTask.updateMany({
        where: { id: taskId, weddingId, deletedAt: null, revision: data.revision },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...eventUpdate,
          ...(data.parentTaskId !== undefined ? { parentTaskId: data.parentTaskId } : {}),
          ...(data.dueAt !== undefined ? { dueAt: data.dueAt } : {}),
          ...(data.priority !== undefined ? { priority: data.priority } : {}),
          ...(data.status !== undefined ? { status: data.status, ...completion } : {}),
          revision: { increment: 1 },
        },
      })
      if (!result.count) return 'conflict'
      const row = await tx.weddingTask.findUnique({ where: { id: taskId }, select: taskSelect })
      return row ? this.map(row) : null
    })
  }
  async deleteOwned(userId: string, weddingId: string, taskId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.weddingTask.updateMany({
        where: { id: taskId, weddingId, deletedAt: null },
        data: { deletedAt: new Date(), revision: { increment: 1 } },
      })
      if (result.count)
        await tx.weddingTask.updateMany({
          where: { parentTaskId: taskId, deletedAt: null },
          data: { parentTaskId: null, eventId: null, revision: { increment: 1 } },
        })
      return result.count === 1
    })
  }
  async reorderOwned(userId: string, weddingId: string, taskIds: string[]) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      const count = await tx.weddingTask.count({
        where: { id: { in: taskIds }, weddingId, deletedAt: null },
      })
      if (count !== taskIds.length)
        throw new TaskError('TASK_REORDER_INVALID', 400, 'All task IDs must belong to the wedding')
      for (const [index, taskId] of taskIds.entries())
        await tx.weddingTask.update({
          where: { id: taskId },
          data: { sortOrder: index, revision: { increment: 1 } },
        })
      return { updatedCount: taskIds.length }
    })
  }
  async bulkStatusOwned(userId: string, weddingId: string, taskIds: string[], status: TaskStatus) {
    if (!(await this.owns(userId, weddingId))) return null
    const result = await this.prisma.weddingTask.updateMany({
      where: { id: { in: taskIds }, weddingId, deletedAt: null },
      data: {
        status,
        ...(status === 'DONE'
          ? { completedAt: new Date(), completedById: userId }
          : { completedAt: null, completedById: null }),
        revision: { increment: 1 },
      },
    })
    return { updatedCount: result.count }
  }
  async bulkCreateOwned(userId: string, weddingId: string, data: BulkCreateTasksData) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      for (const item of data.tasks) await this.validateReferences(tx, weddingId, item.eventId)
      const last = await tx.weddingTask.aggregate({
        where: { weddingId, deletedAt: null },
        _max: { sortOrder: true },
      })
      const result: TaskView[] = []
      for (const [index, item] of data.tasks.entries()) {
        const row = await tx.weddingTask.create({
          data: {
            weddingId,
            title: item.title,
            priority: item.priority,
            sortOrder: (last._max.sortOrder ?? -1) + index + 1,
            ...(item.description !== undefined ? { description: item.description } : {}),
            ...(item.eventId !== undefined ? { eventId: item.eventId } : {}),
            ...(item.dueAt !== undefined ? { dueAt: item.dueAt } : {}),
          },
          select: taskSelect,
        })
        result.push(this.map(row))
      }
      return result
    })
  }
  async listTemplates(locale?: string): Promise<TaskChecklistTemplateView[]> {
    const rows = await this.prisma.taskChecklistTemplate.findMany({
      where: { status: 'ACTIVE', ...(locale ? { locale } : {}) },
      include: { items: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    })
    return rows.map((row) => ({
      id: row.id,
      key: row.key,
      version: row.version,
      name: row.name,
      status: row.status,
      locale: row.locale,
      items: row.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        relativeDueDayOffset: item.relativeDueDayOffset,
        sortOrder: item.sortOrder,
      })),
    }))
  }
  async applyTemplate(userId: string, weddingId: string, data: ApplyTemplateData) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      const [template, wedding] = await Promise.all([
        tx.taskChecklistTemplate.findFirst({
          where: { key: data.templateKey, version: data.templateVersion, status: 'ACTIVE' },
          include: { items: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
        }),
        tx.wedding.findFirst({
          where: this.ownedWhere(userId, weddingId),
          select: { primaryDate: true },
        }),
      ])
      if (!template || !wedding)
        throw new TaskError('TASK_TEMPLATE_NOT_FOUND', 404, 'Checklist template not found')
      await this.validateReferences(tx, weddingId, data.eventId)
      const last = await tx.weddingTask.aggregate({
        where: { weddingId, deletedAt: null },
        _max: { sortOrder: true },
      })
      const baseDate = data.baseDate ?? wedding.primaryDate
      const result: TaskView[] = []
      for (const [index, item] of template.items.entries()) {
        const dueAt =
          item.relativeDueDayOffset !== null && baseDate
            ? new Date(baseDate.getTime() + item.relativeDueDayOffset * 86_400_000)
            : undefined
        const row = await tx.weddingTask.create({
          data: {
            weddingId,
            title: item.title,
            priority: item.priority,
            sortOrder: (last._max.sortOrder ?? -1) + index + 1,
            sourceTemplateKey: template.key,
            sourceTemplateVersion: template.version,
            ...(item.description !== null ? { description: item.description } : {}),
            ...(data.eventId !== undefined ? { eventId: data.eventId } : {}),
            ...(dueAt ? { dueAt } : {}),
          },
          select: taskSelect,
        })
        result.push(this.map(row))
      }
      return result
    })
  }
}
