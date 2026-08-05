import type { NextRequest } from 'next/server'

import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { updateWeddingSchema, weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

async function weddingId(context: Context) { return weddingIdSchema.parse((await context.params).weddingId) }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    return withAuthHeaders(jsonResponse({ wedding: await getWeddingService().get(actor, await weddingId(context)) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, updateWeddingSchema)
    return withAuthHeaders(jsonResponse({ wedding: await getWeddingService().update(actor, await weddingId(context), input) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    await getWeddingService().remove(actor, await weddingId(context))
    return withAuthHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
