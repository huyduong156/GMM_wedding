import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRsvpService } from '@/modules/rsvps'
import { rsvpErrorResponse } from '@/modules/rsvps/interface/rsvp-http'
import { linkRsvpGuestSchema, rsvpIdSchema } from '@/modules/rsvps/interface/rsvp-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; rsvpId: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId, rsvpId } = await context.params
    const { guestId } = await parseJson(request, linkRsvpGuestSchema)
    const result = await getRsvpService().linkGuest(actor, weddingIdSchema.parse(weddingId), rsvpIdSchema.parse(rsvpId), guestId)
    return withApiHeaders(jsonResponse(result), requestId)
  } catch (error) {
    return rsvpErrorResponse(error, requestId)
  }
}
