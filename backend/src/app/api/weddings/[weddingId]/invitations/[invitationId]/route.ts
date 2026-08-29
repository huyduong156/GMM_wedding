import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { updateInvitationSchema } from '@/modules/guests/interface/guest-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; invitationId: string }> }

async function ids(context: Context) {
  const params = await context.params
  return { weddingId: weddingIdSchema.parse(params.weddingId), invitationId: params.invitationId }
}

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const idsValue = await ids(context)
    return withApiHeaders(jsonResponse({ invitation: await getGuestService().getInvitation(actor, idsValue.weddingId, idsValue.invitationId) }), requestId)
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const idsValue = await ids(context)
    return withApiHeaders(jsonResponse({ invitation: await getGuestService().updateInvitation(actor, idsValue.weddingId, idsValue.invitationId, await parseJson(request, updateInvitationSchema)) }), requestId)
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}
