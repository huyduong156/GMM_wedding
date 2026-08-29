import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { promoteWishSchema, weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; wishId: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const params = await context.params
    const result = await getWeddingService().promoteWishToGuest(actor, weddingIdSchema.parse(params.weddingId), params.wishId, await parseJson(request, promoteWishSchema))
    return withApiHeaders(jsonResponse(result, { status: 201 }), requestId)
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
