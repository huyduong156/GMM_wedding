import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { bulkAssignFamilySideSchema } from '@/modules/guests/interface/guest-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'

export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId } = await context.params
    const { guestIds, familySide } = await parseJson(request, bulkAssignFamilySideSchema)
    return withApiHeaders(
      jsonResponse(
        await getGuestService().bulkAssignFamilySide(
          actor,
          weddingIdSchema.parse(weddingId),
          guestIds,
          familySide,
        ),
      ),
      requestId,
    )
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}
