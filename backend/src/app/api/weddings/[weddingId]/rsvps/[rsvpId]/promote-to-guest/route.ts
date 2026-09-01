import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRsvpService } from '@/modules/rsvps'
import { rsvpErrorResponse } from '@/modules/rsvps/interface/rsvp-http'
import { promoteRsvpSchema, rsvpIdSchema } from '@/modules/rsvps/interface/rsvp-schemas'
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
    const result = await getRsvpService().promoteToGuest(
      actor,
      weddingIdSchema.parse(weddingId),
      rsvpIdSchema.parse(rsvpId),
      await parseJson(request, promoteRsvpSchema),
    )
    return withApiHeaders(jsonResponse(result, { status: 201 }), requestId)
  } catch (error) {
    return rsvpErrorResponse(error, requestId)
  }
}
