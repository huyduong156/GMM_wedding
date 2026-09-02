import { z } from 'zod'

export const templateStyleKeySchema = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
export const templateStyleIdSchema = z.string().uuid()
export const createTemplateStyleSchema = z.object({ key: templateStyleKeySchema, name: z.string().trim().min(1).max(120), description: z.string().max(5000).nullable().optional(), sortOrder: z.number().int().min(0).max(100000).optional() })
export const updateTemplateStyleSchema = createTemplateStyleSchema.partial().extend({ status: z.enum(['ACTIVE', 'ARCHIVED']).optional() })
export const replaceTemplateStylesSchema = z.object({ styleIds: z.array(templateStyleIdSchema).max(50) })
export type CreateTemplateStyle = z.infer<typeof createTemplateStyleSchema>
export type UpdateTemplateStyle = z.infer<typeof updateTemplateStyleSchema>
