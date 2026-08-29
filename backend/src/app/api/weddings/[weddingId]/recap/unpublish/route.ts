import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRecapService } from '@/modules/recaps'
import { recapErrorResponse, recapUnpublishSchema } from '@/modules/recaps/interface'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, recapUnpublishSchema)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    await getRecapService().unpublish(actor.userId, weddingId, input.revision)
    return withApiHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) { return recapErrorResponse(error, requestId) }
}