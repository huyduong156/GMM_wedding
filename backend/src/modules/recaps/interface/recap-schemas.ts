import { z } from 'zod'

const jsonObject = z.record(z.unknown())
const sectionConfig = z
  .object({
    enabled: z.array(z.string().trim().min(1)).max(100),
    order: z.array(z.string().trim().min(1)).max(100),
  })
  .strict()

const mediaItem = z
  .object({
    mediaAssetId: z.string().uuid(),
    caption: z.string().trim().max(500).nullable().optional(),
    sortOrder: z.number().int().min(0).max(1000),
  })
  .strict()

const wishSelection = z
  .object({
    wishId: z.string().uuid(),
    sortOrder: z.number().int().min(0).max(1000),
  })
  .strict()

export const recapIdSchema = z.string().uuid()
export const recapSlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .min(3)
  .max(64)
export const recapSaveSchema = z
  .object({
    templateVersionId: z.string().uuid(),
    title: z.string().trim().min(1).max(200),
    thankYouMessage: z.string().trim().max(10000).nullable().optional(),
    ogTitle: z.string().trim().max(200).nullable().optional(),
    ogDescription: z.string().trim().max(500).nullable().optional(),
    ogImageUrl: z.string().url().max(2048).nullable().optional(),
    content: jsonObject,
    themeConfig: jsonObject,
    sectionConfig,
    mediaItems: z.array(mediaItem).max(200),
    wishSelections: z.array(wishSelection).max(200),
    revision: z.number().int().positive(),
  })
  .strict()

export const recapPublishSchema = z
  .object({
    revision: z.number().int().positive(),
  })
  .strict()

export const recapUnpublishSchema = z
  .object({
    revision: z.number().int().positive(),
  })
  .strict()

export type RecapSaveInput = z.infer<typeof recapSaveSchema>
export type RecapPublishInput = z.infer<typeof recapPublishSchema>
