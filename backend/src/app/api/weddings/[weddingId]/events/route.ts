import type { NextRequest } from 'next/server'

import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { createWeddingEventSchema, weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
async function id(context: Context) { return weddingIdSchema.parse((await context.params).weddingId) }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    return withAuthHeaders(jsonResponse({ items: await getWeddingService().listEvents(actor, await id(context)) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, createWeddingEventSchema)
    return withAuthHeaders(jsonResponse({ event: await getWeddingService().createEvent(actor, await id(context), input) }, { status: 201 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
