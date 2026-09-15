import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { requireWeddingPermission } from '@/modules/weddings/interface/wedding-authorizer'
import { weddingIdSchema, wishModerationSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; wishId: string }> }
export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const params = await context.params
    const input = await parseJson(request, wishModerationSchema)
    const weddingId = weddingIdSchema.parse(params.weddingId)
    await requireWeddingPermission(actor.userId, weddingId, 'EDIT')
    return withApiHeaders(
      jsonResponse({
        wish: await getWeddingService().moderateWish(
          actor,
          weddingId,
          params.wishId,
          input.status,
          input.isPinned,
        ),
      }),
      requestId,
    )
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
