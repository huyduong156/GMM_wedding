import type { NextRequest } from 'next/server'

import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { createWeddingSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    return withAuthHeaders(jsonResponse({ items: await getWeddingService().list(actor) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, createWeddingSchema)
    const wedding = await getWeddingService().create(actor, input)
    return withAuthHeaders(jsonResponse({ wedding }, { status: 201 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
