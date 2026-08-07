import { z } from 'zod'

const dateTime = z.string().datetime({ offset: true }).transform((value) => new Date(value))
const timezone = z.string().trim().min(1).max(64).refine((value) => {
  try { new Intl.DateTimeFormat('en-US', { timeZone: value }); return true } catch { return false }
}, 'Timezone must be a valid IANA timezone')
const locale = z.string().trim().min(2).max(16)
export const weddingIdSchema = z.string().uuid()
export const weddingSurfaceSchema = z.enum(['ONLINE_INVITATION', 'WEDDING_WEBSITE'])
const jsonValue = z.record(z.unknown())
export const contentQuerySchema = z.object({ surface: weddingSurfaceSchema.default('ONLINE_INVITATION') })
export const saveWeddingContentSchema = z.object({
  surface: weddingSurfaceSchema.default('ONLINE_INVITATION'), templateVersionId: z.string().uuid(), content: jsonValue,
  themeConfig: z.record(jsonValue).default({}),
  sectionConfig: z.object({ enabled: z.array(z.string().min(1)).min(1), order: z.array(z.string().min(1)).min(1) }).strict(),
  revision: z.number().int().positive(),
}).strict()
export const publishWeddingSchema = z.object({ surface: weddingSurfaceSchema.default('ONLINE_INVITATION'), slug: z.string().trim().min(3).max(64), revision: z.number().int().positive() }).strict()
export const wishModerationSchema = z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM', 'HIDDEN']).optional(), isPinned: z.boolean().optional() }).strict().refine((value) => value.status !== undefined || value.isPinned !== undefined, 'At least one moderation field is required')
export const mediaIntentSchema = z.object({ mimeType: z.string().trim().min(1).max(128), sizeBytes: z.number().int().positive().max(10 * 1024 * 1024), originalName: z.string().trim().max(255).optional(), altText: z.string().trim().max(500).optional() }).strict()
export const createWeddingSchema = z.object({
  name: z.string().trim().min(1).max(160), primaryDate: dateTime.optional(),
  timezone: timezone.default('Asia/Ho_Chi_Minh'), locale: locale.default('vi-VN'),
  visibility: z.enum(['PUBLIC', 'PASSWORD_PROTECTED', 'INVITE_ONLY']).default('PUBLIC'),
}).strict()
export const updateWeddingSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(), primaryDate: z.union([dateTime, z.null()]).optional(),
  timezone: timezone.optional(), locale: locale.optional(),
  visibility: z.enum(['PUBLIC', 'PASSWORD_PROTECTED', 'INVITE_ONLY']).optional(),
  status: z.enum(['DRAFT', 'ARCHIVED']).optional(), revision: z.number().int().positive(),
}).strict().refine((value) => Object.keys(value).some((key) => key !== 'revision'), 'At least one editable field is required')
const eventFields = {
  name: z.string().trim().min(1).max(160), eventType: z.string().trim().min(1).max(48),
  startsAt: dateTime, endsAt: dateTime.optional(), timezone,
  venueName: z.string().trim().min(1).max(200).optional(), addressLine: z.string().trim().min(1).max(500).optional(),
  mapUrl: z.string().url().max(2048).optional(), latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(), sortOrder: z.number().int().min(0).default(0), isPublic: z.boolean().default(true),
}
export const createWeddingEventSchema = z.object(eventFields).strict()
export const updateWeddingEventSchema = z.object({
  name: eventFields.name.optional(), eventType: eventFields.eventType.optional(), startsAt: eventFields.startsAt.optional(),
  endsAt: z.union([dateTime, z.null()]).optional(), timezone: eventFields.timezone.optional(),
  venueName: z.union([z.string().trim().min(1).max(200), z.null()]).optional(),
  addressLine: z.union([z.string().trim().min(1).max(500), z.null()]).optional(),
  mapUrl: z.union([z.string().url().max(2048), z.null()]).optional(), latitude: z.union([z.number().min(-90).max(90), z.null()]).optional(),
  longitude: z.union([z.number().min(-180).max(180), z.null()]).optional(), sortOrder: eventFields.sortOrder.optional(), isPublic: eventFields.isPublic.optional(),
  revision: z.number().int().positive(),
}).strict().refine((value) => Object.keys(value).some((key) => key !== 'revision'), 'At least one editable field is required')
