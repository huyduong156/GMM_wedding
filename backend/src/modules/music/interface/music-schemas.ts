import { z } from 'zod'

export const musicCreateSchema = z.object({
  displayName: z.string().trim().min(1).max(160),
  artistName: z.string().trim().max(160).optional(),
  mimeType: z.enum(['audio/mpeg', 'audio/mp4', 'audio/ogg']),
  sizeBytes: z.number().int().positive().max(15 * 1024 * 1024),
  licenseType: z.string().trim().max(80).optional(),
  licenseReference: z.string().trim().max(500).optional(),
  creditText: z.string().trim().max(500).optional(),
})
export const musicListSchema = z.object({ q: z.string().trim().max(120).optional(), includeRetired: z.coerce.boolean().optional() })
export const musicIdSchema = z.string().uuid()
export const musicUpdateSchema = z.object({ displayName: z.string().trim().min(1).max(160).optional(), artistName: z.string().trim().max(160).nullable().optional(), licenseType: z.string().trim().max(80).nullable().optional(), licenseReference: z.string().trim().max(500).nullable().optional(), creditText: z.string().trim().max(500).nullable().optional(), sortOrder: z.number().int().min(0).optional(), revision: z.number().int().min(1) }).strict().refine((value) => Object.keys(value).some((key) => key !== 'revision'), { message: 'At least one field is required' })
