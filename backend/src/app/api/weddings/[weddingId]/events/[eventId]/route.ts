import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { updateWeddingEventSchema, weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; eventId: string }> }
async function ids(context: Context) { const params = await context.params; return { weddingId: weddingIdSchema.parse(params.weddingId), eventId: z.string().uuid().parse(params.eventId) } }

export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, updateWeddingEventSchema)
    const { weddingId, eventId } = await ids(context)
    return withAuthHeaders(jsonResponse({ event: await getWeddingService().updateEvent(actor, weddingId, eventId, input) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId, eventId } = await ids(context)
    await getWeddingService().removeEvent(actor, weddingId, eventId)
    return withAuthHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
