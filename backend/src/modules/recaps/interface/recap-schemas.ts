import { z } from 'zod'

const jsonObject = z.record(z.unknown())
const sectionConfig = z
  .object({
    enabled: z.array(z.string().trim().min(1)).max(100),
    order: z.array(z.string().trim().min(1)).max(100),
  })
  .strip()

const mediaItem = z
  .object({
    mediaAssetId: z.string().uuid(),
    caption: z.string().trim().max(500).nullable().optional(),
    sortOrder: z.number().int().min(0).max(1000),
  })
  .strip()

const wishSelection = z
  .object({
    wishId: z.string().uuid(),
    sortOrder: z.number().int().min(0).max(1000),
  })
  .strip()

export const recapIdSchema = z.string().uuid()
export const recapSaveSchema = z
  .object({
    templateVersionId: z.string().uuid(),
    content: jsonObject,
    themeConfig: jsonObject,
    sectionConfig,
    mediaItems: z.array(mediaItem).max(200),
    wishSelections: z.array(wishSelection).max(200),
    revision: z.number().int().positive(),
  })
  .strip()

export const recapPublishSchema = z
  .object({
    revision: z.number().int().positive(),
  })
  .strip()

export const recapUnpublishSchema = z
  .object({
    revision: z.number().int().positive(),
  })
  .strip()

export type RecapSaveInput = z.infer<typeof recapSaveSchema>
export type RecapPublishInput = z.infer<typeof recapPublishSchema>
