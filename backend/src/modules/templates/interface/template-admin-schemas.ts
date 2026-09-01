import { z } from 'zod'

const versionSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, 'Must be a semantic version')
const templateKeySchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a lowercase kebab-case key')
const templateSourceStatusSchema = z.enum(['DEVELOPMENT', 'REVIEW', 'READY', 'DEPRECATED'])

export const templateReleaseBundleSchema = z
  .object({
    bundleVersion: z.literal(1),
    generatedAt: z.string().datetime(),
    sourceRevision: z.string().min(1).max(128),
    templates: z
      .array(
        z.object({
          templateKey: templateKeySchema,
          displayName: z.string().trim().min(1).max(160),
          productType: z.enum(['ONLINE_INVITATION', 'WEDDING_WEBSITE', 'RECAP']),
          templateVersion: versionSchema,
          sourceStatus: templateSourceStatusSchema,
          templateConfigVersion: z.number().int().positive(),
          contentSchemaVersion: z.number().int().positive(),
          rendererApiVersion: z.number().int().positive(),
          description: z.string().max(5000).nullable().optional(),
          config: z.record(z.unknown()),
        }),
      )
      .min(1)
      .max(100),
  })
  .superRefine((bundle, context) => {
    const seen = new Set<string>()
    bundle.templates.forEach((template, index) => {
      const identity = `${template.templateKey}@${template.templateVersion}`
      if (seen.has(identity))
        context.addIssue({
          code: 'custom',
          path: ['templates', index],
          message: `Duplicate template version: ${identity}`,
        })
      seen.add(identity)
    })
  })

export const adminTemplateListQuerySchema = z.object({
  productType: z.enum(['ONLINE_INVITATION', 'WEDDING_WEBSITE', 'RECAP']).optional(),
  reviewStatus: z.enum(['PENDING_REVIEW', 'RELEASED', 'DEPRECATED']).optional(),
})

export type TemplateReleaseBundle = z.infer<typeof templateReleaseBundleSchema>
export type AdminTemplateListQuery = z.infer<typeof adminTemplateListQuerySchema>
