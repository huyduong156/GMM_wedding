import { z } from 'zod'
const uuid = z.string().uuid()
const date = z.string().datetime({ offset: true }).transform((v) => new Date(v))
const amount = z.union([z.string().regex(/^\d+$/, 'amountMinor must be a non-negative integer string'), z.number().int().nonnegative().safe()]).transform((v) => BigInt(v))
const giftType = z.enum(['money', 'gold', 'physicalGift'])
const receiveMethod = z.enum(['cash', 'bankTransfer', 'physicalGift', 'other'])
const reciprocity = z.enum(['pending', 'returned', 'notApplicable'])
const base = { guestName: z.string().trim().min(1).max(160), giftType, amountMinor: amount.optional(), currency: z.string().trim().length(3).transform((v) => v.toUpperCase()).optional(), goldWeight: z.string().trim().regex(/^\d+(\.\d{1,4})?$/).optional(), goldUnit: z.string().trim().min(1).max(32).optional(), goldType: z.string().trim().max(64).optional(), giftDescription: z.string().trim().max(2000).optional(), receiveMethod, receivedAt: date.default(() => new Date().toISOString()), note: z.string().trim().max(5000).optional(), reciprocityStatus: reciprocity.default('pending'), returnedAt: date.optional() }
type GiftValidationInput = { giftType: 'money' | 'gold' | 'physicalGift'; amountMinor?: bigint | undefined; currency?: string | undefined; goldWeight?: string | undefined; goldUnit?: string | undefined; giftDescription?: string | undefined; receiveMethod: string; reciprocityStatus: 'pending' | 'returned' | 'notApplicable'; returnedAt?: Date | undefined }
function validGift(value: GiftValidationInput, ctx: z.RefinementCtx) {
  if (value.giftType === 'money' && (value.amountMinor === undefined || !value.currency)) ctx.addIssue({ code: 'custom', path: ['amountMinor'], message: 'Money requires amountMinor and currency' })
  if (value.giftType === 'gold' && (!value.goldWeight || !value.goldUnit)) ctx.addIssue({ code: 'custom', path: ['goldWeight'], message: 'Gold requires weight and unit' })
  if (value.giftType === 'physicalGift' && !value.giftDescription) ctx.addIssue({ code: 'custom', path: ['giftDescription'], message: 'Physical gift requires description' })
  if (value.giftType === 'money' && value.receiveMethod === 'physicalGift') ctx.addIssue({ code: 'custom', path: ['receiveMethod'], message: 'Money cannot use physicalGift receive method' })
  if (value.giftType !== 'money' && (value.receiveMethod === 'cash' || value.receiveMethod === 'bankTransfer')) ctx.addIssue({ code: 'custom', path: ['receiveMethod'], message: 'Gold or physical gift must use physicalGift or other' })
  if (value.reciprocityStatus === 'returned' && !value.returnedAt) ctx.addIssue({ code: 'custom', path: ['returnedAt'], message: 'Returned entry requires returnedAt' })
  if (value.reciprocityStatus !== 'returned' && value.returnedAt) ctx.addIssue({ code: 'custom', path: ['returnedAt'], message: 'returnedAt is only valid for returned entries' })
}
export const giftEntryIdSchema = uuid
export const giftQuerySchema = z.object({ q: z.string().trim().max(160).optional(), giftType: giftType.optional(), receiveMethod: receiveMethod.optional(), reciprocityStatus: reciprocity.optional(), guestId: uuid.optional(), from: date.optional(), to: date.optional(), limit: z.coerce.number().int().min(1).max(100).default(50), cursor: z.string().max(512).optional() }).strict().refine((v) => !v.from || !v.to || v.from <= v.to, { path: ['to'], message: 'to must be after from' })
export const createGiftSchema = z.object({ ...base, guestId: uuid.optional() }).strict().superRefine(validGift)
export const updateGiftSchema = z.object({ ...Object.fromEntries(Object.entries(base).map(([key, value]) => [key, value.optional()])), revision: z.number().int().min(1) }).strict().superRefine((value, ctx) => { const candidate = value as Partial<GiftValidationInput> & { revision: number }; if (Object.keys(value).length === 1) ctx.addIssue({ code: 'custom', message: 'At least one field is required' }); if (candidate.giftType && candidate.receiveMethod && candidate.reciprocityStatus) validGift(candidate as GiftValidationInput, ctx) })
export const linkGuestSchema = z.object({ guestId: uuid }).strict()
export const promoteGuestSchema = z.object({ displayName: z.string().trim().min(1).max(160) }).strict()
export const giftDateQuerySchema = z.object({ from: date.optional(), to: date.optional() }).strict().refine((v) => !v.from || !v.to || v.from <= v.to, { path: ['to'], message: 'to must be after from' })
