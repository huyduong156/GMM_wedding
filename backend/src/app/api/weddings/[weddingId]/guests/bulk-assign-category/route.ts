import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { bulkAssignCategorySchema } from '@/modules/guests/interface/guest-schemas'
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
    const { guestIds, categoryId } = await parseJson(request, bulkAssignCategorySchema)
    return withAuthHeaders(jsonResponse(await getGuestService().bulkAssignCategory(actor, weddingIdSchema.parse(weddingId), guestIds, categoryId)), requestId)
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}
