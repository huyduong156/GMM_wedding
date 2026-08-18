import type { NextRequest } from 'next/server'
import { optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGiftLedgerService } from '@/modules/gift-ledger'
import { giftLedgerErrorResponse } from '@/modules/gift-ledger/interface/gift-ledger-http'
import { giftDateQuerySchema } from '@/modules/gift-ledger/interface/gift-ledger-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string }> }
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { const { actor } = await requireAuthenticatedUser(request); const weddingId = weddingIdSchema.parse((await context.params).weddingId); const filter = giftDateQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); return withAuthHeaders(jsonResponse({ summary: await getGiftLedgerService().summary(actor, weddingId, filter) }), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
