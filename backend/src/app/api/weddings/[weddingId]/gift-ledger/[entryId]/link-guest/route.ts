import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGiftLedgerService } from '@/modules/gift-ledger'
import { giftLedgerErrorResponse } from '@/modules/gift-ledger/interface/gift-ledger-http'
import { giftEntryIdSchema, linkGuestSchema } from '@/modules/gift-ledger/interface/gift-ledger-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
type Context = { params: Promise<{ weddingId: string; entryId: string }> }
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const p = await context.params; const { guestId } = await parseJson(request, linkGuestSchema); return withAuthHeaders(jsonResponse({ entry: await getGiftLedgerService().link(actor, weddingIdSchema.parse(p.weddingId), giftEntryIdSchema.parse(p.entryId), guestId) }), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
