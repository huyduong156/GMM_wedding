import { z } from 'zod'

const uuid = z.string().uuid()
export const rsvpIdSchema = uuid
export const rsvpQuerySchema = z
  .object({
    q: z.string().trim().max(160).optional(),
    attendance: z.enum(['ATTENDING', 'DECLINED', 'MAYBE']).optional(),
    eventId: uuid.optional(),
    categoryId: uuid.optional(),
    groupId: uuid.optional(),
    from: z
      .string()
      .datetime({ offset: true })
      .transform((value) => new Date(value))
      .optional(),
    to: z
      .string()
      .datetime({ offset: true })
      .transform((value) => new Date(value))
      .optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    cursor: z.string().max(512).optional(),
  })
  .strict()
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    message: 'from must be before to',
    path: ['from'],
  })

export const promoteRsvpSchema = z
  .object({
    displayName: z.string().trim().min(1).max(160).optional(),
    categoryId: uuid.optional(),
    groupId: uuid.optional(),
  })
  .strict()

export const linkRsvpGuestSchema = z.object({ guestId: uuid }).strict()
