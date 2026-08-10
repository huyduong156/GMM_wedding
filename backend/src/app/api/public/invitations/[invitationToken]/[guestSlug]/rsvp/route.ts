import type { NextRequest } from 'next/server'

import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { rsvpSchema } from '@/modules/public-interactions/public-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const OPTIONS = optionsResponse
type Context = { params: Promise<{ invitationToken: string; guestSlug: string }> }

export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { invitationToken: weddingSlug, guestSlug } = await context.params
    return withAuthHeaders(jsonResponse(await getPublicInteractionService().submitPersonalRsvp(weddingSlug, guestSlug, await parseJson(request, rsvpSchema))), requestId)
  } catch (error) { return guestErrorResponse(error, requestId) }
}
