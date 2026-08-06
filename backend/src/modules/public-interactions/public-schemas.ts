import { z } from 'zod'
export const rsvpSchema = z.object({ guestName: z.string().trim().min(1).max(160).optional(), attendance: z.enum(['ATTENDING', 'DECLINED', 'MAYBE']), partySize: z.number().int().min(1).max(50), mealPreference: z.string().trim().max(160).optional(), specialRequest: z.string().trim().max(2000).optional(), message: z.string().trim().max(2000).optional() }).strict()
export const wishSchema = z.object({ guestName: z.string().trim().min(1).max(160).optional(), content: z.string().trim().min(1).max(2000) }).strict()
