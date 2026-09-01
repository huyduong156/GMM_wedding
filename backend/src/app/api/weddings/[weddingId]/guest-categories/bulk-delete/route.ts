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
import { bulkDeleteSchema } from '@/modules/guests/interface/guest-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'

export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

async function remove(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId } = await context.params
    const { ids } = await parseJson(request, bulkDeleteSchema)
    return withApiHeaders(
      jsonResponse(
        await getGuestService().bulkRemoveCategories(actor, weddingIdSchema.parse(weddingId), ids),
      ),
      requestId,
    )
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}

export async function POST(request: NextRequest, context: Context) {
  return remove(request, context)
}

export async function DELETE(request: NextRequest, context: Context) {
  return remove(request, context)
}
