import { z } from 'zod'
const uuid = z.string().uuid()
const optionalText = (max: number) => z.string().trim().min(1).max(max).optional()
export const guestIdSchema = uuid
export const guestQuerySchema = z.object({ q: z.string().trim().max(160).optional(), categoryId: uuid.optional(), groupId: uuid.optional(), limit: z.coerce.number().int().min(1).max(100).default(50), cursor: z.string().max(512).optional() })
const guestFields = { displayName: z.string().trim().min(1).max(160), categoryId: uuid.optional(), groupId: uuid.optional(), phone: optionalText(32), email: z.string().trim().email().max(320).optional(), note: z.string().trim().max(5000).optional(), tableName: optionalText(120), maxPartySize: z.number().int().min(1).max(50).default(1), tags: z.array(z.string().trim().min(1).max(48)).max(30).default([]) }
export const createGuestSchema = z.object(guestFields).strict()
export const updateGuestSchema = z.object({ ...guestFields, displayName: guestFields.displayName.optional() }).strict().refine((v) => Object.keys(v).length > 0, 'At least one field is required')
export const categorySchema = z.object({ name: z.string().trim().min(1).max(120), parentId: uuid.optional(), sortOrder: z.number().int().min(0).default(0) }).strict()
export const updateCategorySchema = z.object({ name: z.string().trim().min(1).max(120).optional(), parentId: z.union([uuid, z.null()]).optional(), sortOrder: z.number().int().min(0).optional() }).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required')
export const groupSchema = z.object({ name: z.string().trim().min(1).max(120), note: z.string().trim().max(2000).optional() }).strict()
export const invitationSchema = z.object({ guestId: uuid.optional(), label: z.string().trim().min(1).max(160).optional(), maxPartySize: z.number().int().min(1).max(50).default(1), expiresAt: z.string().datetime({ offset: true }).transform((v) => new Date(v)).optional() }).strict()
export const guestImportRowSchema = z.object({ displayName: z.string().trim().min(1).max(160), categoryPath: z.string().trim().max(400).optional(), groupName: z.string().trim().max(120).optional(), phone: z.string().trim().max(32).optional(), email: z.string().trim().email().max(320).optional(), note: z.string().trim().max(5000).optional(), tableName: z.string().trim().max(120).optional(), maxPartySize: z.number().int().min(1).max(50).optional(), tags: z.array(z.string().trim().min(1).max(48)).max(30).optional() }).strict()
export const guestImportSchema = z.object({ rows: z.array(guestImportRowSchema).min(1).max(5000) }).strict()
