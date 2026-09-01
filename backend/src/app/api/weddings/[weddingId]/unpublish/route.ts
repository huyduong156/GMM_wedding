import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRecapService } from '@/modules/recaps'
import { RecapError } from '@/modules/recaps/application/recap-service'
import { recapErrorResponse } from '@/modules/recaps/interface/recap-http'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import {
  unpublishWeddingSchema,
  weddingIdSchema,
} from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, unpublishWeddingSchema)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    if (input.surface === 'RECAP') {
      await getRecapService().unpublish(actor.userId, weddingId, input.revision!)
    } else {
      await getWeddingService().unpublish(actor, weddingId, input.surface)
    }
    return withApiHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) {
    return error instanceof RecapError
      ? recapErrorResponse(error, requestId)
      : weddingErrorResponse(error, requestId)
  }
}
