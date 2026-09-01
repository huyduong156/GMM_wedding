import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRecapService } from '@/modules/recaps'
import { recapErrorResponse, recapPublishSchema } from '@/modules/recaps/interface'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, recapPublishSchema)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    return withApiHeaders(
      jsonResponse(
        { snapshot: await getRecapService().publish(actor.userId, weddingId, input) },
        { status: 201 },
      ),
      requestId,
    )
  } catch (error) {
    return recapErrorResponse(error, requestId)
  }
}
