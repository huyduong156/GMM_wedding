import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { rsvpSchema } from '@/modules/public-interactions/public-schemas'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ invitationToken: string }> }
export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const token = (await context.params).invitationToken
    return withAuthHeaders(jsonResponse(await getPublicInteractionService().submitTokenRsvp(token, await parseJson(request, rsvpSchema))), requestId)
  } catch (error) { return guestErrorResponse(error, requestId) }
}
