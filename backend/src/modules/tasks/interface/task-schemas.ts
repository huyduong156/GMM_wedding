import { z } from 'zod'
const uuid = z.string().uuid()
const dateTime = z.string().datetime({ offset: true }).transform((value) => new Date(value))
const priority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
const status = z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'])
export const taskIdSchema = uuid
export const taskQuerySchema = z.object({ q: z.string().trim().max(200).optional(), status: status.optional(), priority: priority.optional(), eventId: uuid.optional(), withoutEvent: z.coerce.boolean().optional(), parentTaskId: uuid.optional(), withoutParent: z.coerce.boolean().optional(), from: dateTime.optional(), to: dateTime.optional(), limit: z.coerce.number().int().min(1).max(100).default(50), cursor: z.string().max(512).optional() }).strict().refine((value) => !value.from || !value.to || value.from <= value.to, { message: 'from must be before to', path: ['from'] })
const taskFields = { title: z.string().trim().min(1).max(200), description: z.string().trim().max(5000).optional(), eventId: uuid.nullable().optional(), parentTaskId: uuid.nullable().optional(), dueAt: dateTime.optional(), priority: priority.default('MEDIUM') }
export const createTaskSchema = z.object(taskFields).strict()
export const updateTaskSchema = z.object({ title: taskFields.title.optional(), description: z.union([z.string().trim().max(5000), z.null()]).optional(), eventId: z.union([uuid, z.null()]).optional(), parentTaskId: z.union([uuid, z.null()]).optional(), dueAt: z.union([dateTime, z.null()]).optional(), priority: priority.optional(), status: status.optional(), revision: z.number().int().positive() }).strict().refine((value) => Object.keys(value).some((key) => key !== 'revision'), 'At least one editable field is required')
export const reorderTaskSchema = z.object({ taskIds: z.array(uuid).min(1).max(200).refine((ids) => new Set(ids).size === ids.length, 'Task IDs must be unique') }).strict()
export const bulkTaskStatusSchema = z.object({ taskIds: z.array(uuid).min(1).max(200).refine((ids) => new Set(ids).size === ids.length, 'Task IDs must be unique'), status }).strict()
export const templateQuerySchema = z.object({ locale: z.string().trim().min(2).max(16).optional() }).strict()
export const applyTemplateSchema = z.object({ templateKey: z.string().trim().min(1).max(80), templateVersion: z.number().int().positive(), eventId: uuid.nullable().optional(), baseDate: dateTime.optional() }).strict()
