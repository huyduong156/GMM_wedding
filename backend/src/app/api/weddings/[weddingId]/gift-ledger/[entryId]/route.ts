import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGiftLedgerService } from '@/modules/gift-ledger'
import { giftLedgerErrorResponse } from '@/modules/gift-ledger/interface/gift-ledger-http'
import { giftEntryIdSchema, updateGiftSchema } from '@/modules/gift-ledger/interface/gift-ledger-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string; entryId: string }> }
async function ids(context: Context) { const p = await context.params; return { weddingId: weddingIdSchema.parse(p.weddingId), entryId: giftEntryIdSchema.parse(p.entryId) } }
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { const { actor } = await requireAuthenticatedUser(request); const p = await ids(context); return withAuthHeaders(jsonResponse({ entry: await getGiftLedgerService().get(actor, p.weddingId, p.entryId) }), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
export async function PATCH(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const p = await ids(context); return withAuthHeaders(jsonResponse({ entry: await getGiftLedgerService().update(actor, p.weddingId, p.entryId, await parseJson(request, updateGiftSchema)) }), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
export async function DELETE(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const p = await ids(context); await getGiftLedgerService().remove(actor, p.weddingId, p.entryId); return withAuthHeaders(new Response(null, { status: 204 }), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
