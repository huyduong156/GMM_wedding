import { z } from 'zod'
const uuid = z.string().uuid()
const optionalText = (max: number) => z.string().trim().min(1).max(max).nullable().optional()
const optionalDisplayName = z.string().trim().max(160).nullable().optional().transform((value) =>
  value === undefined ? undefined : value || null,
)
export const guestIdSchema = uuid
export const guestQuerySchema = z.object({
  q: z.string().trim().max(160).optional(),
  categoryId: uuid.optional(),
  groupId: uuid.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().max(512).optional(),
})
const guestFields = {
  name: z.string().trim().min(1).max(160),
    displayName: optionalDisplayName,
  categoryId: uuid.nullable().optional(),
  groupId: uuid.nullable().optional(),
  phone: optionalText(32),
  email: z.string().trim().email().max(320).nullable().optional(),
  note: z.string().trim().max(5000).nullable().optional(),
  tableName: optionalText(120),
  maxPartySize: z.number().int().min(1).max(50).default(1),
  tags: z.array(z.string().trim().min(1).max(48)).max(30).default([]),
}
export const createGuestSchema = z.object(guestFields).strip()
export const updateGuestSchema = z
  .object({ ...guestFields, name: guestFields.name.optional() })
  .strip()
  .refine((v) => Object.keys(v).length > 0, 'At least one field is required')
export const categorySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    parentId: z.union([uuid, z.null()]).optional(),
    sortOrder: z.number().int().min(0).default(0),
  })
  .strip()
export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    parentId: z.union([uuid, z.null()]).optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .strip()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')
export const groupSchema = z
  .object({ name: z.string().trim().min(1).max(120), note: z.string().trim().max(2000).optional() })
  .strip()
export const updateGroupSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    note: z.string().trim().max(2000).nullable().optional(),
  })
  .strip()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')
export const bulkDeleteSchema = z
  .object({
    ids: z
      .array(uuid)
      .min(1)
      .max(200)
      .refine((ids) => new Set(ids).size === ids.length, 'IDs must be unique'),
  })
  .strip()
export const bulkAssignCategorySchema = z
  .object({
    guestIds: z
      .array(uuid)
      .min(1)
      .max(200)
      .refine((ids) => new Set(ids).size === ids.length, 'Guest IDs must be unique'),
    categoryId: uuid.nullable(),
  })
  .strip()
export const guestImportRowSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    displayName: optionalDisplayName,
    categoryPath: z.string().trim().max(400).optional(),
    groupName: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(32).optional(),
    email: z.string().trim().email().max(320).optional(),
    note: z.string().trim().max(5000).optional(),
    tableName: z.string().trim().max(120).optional(),
    maxPartySize: z.number().int().min(1).max(50).optional(),
    tags: z.array(z.string().trim().min(1).max(48)).max(30).optional(),
  })
  .strip()
export const guestImportSchema = z
  .object({ rows: z.array(guestImportRowSchema).min(1).max(5000) })
  .strip()
