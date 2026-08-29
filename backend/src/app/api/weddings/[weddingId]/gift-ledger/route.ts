import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGiftLedgerService } from '@/modules/gift-ledger'
import { giftLedgerErrorResponse } from '@/modules/gift-ledger/interface/gift-ledger-http'
import { createGiftSchema, giftQuerySchema } from '@/modules/gift-ledger/interface/gift-ledger-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string }> }
async function id(context: Context) { return weddingIdSchema.parse((await context.params).weddingId) }
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { const { actor } = await requireAuthenticatedUser(request); const query = giftQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); return withApiHeaders(jsonResponse(await getGiftLedgerService().list(actor, await id(context), query)), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); return withApiHeaders(jsonResponse({ entry: await getGiftLedgerService().create(actor, await id(context), await parseJson(request, createGiftSchema)) }, { status: 201 }), requestId) } catch (error) { return giftLedgerErrorResponse(error, requestId) } }
