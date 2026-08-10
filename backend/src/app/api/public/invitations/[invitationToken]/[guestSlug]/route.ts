import type { NextRequest } from 'next/server'

import { getGuestService } from '@/modules/guests'
import { withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ invitationToken: string; guestSlug: string }> }
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  const { invitationToken: weddingSlug, guestSlug } = await context.params
  const invitation = await getGuestService().resolvePublicInvitation(weddingSlug, guestSlug)
  if (!invitation) return withAuthHeaders(jsonResponse({ error: { code: 'RESOURCE_NOT_FOUND', message: 'Invitation not found', requestId } }, { status: 404 }), requestId)
  return withAuthHeaders(jsonResponse({ invitation }, { headers: { 'cache-control': 'no-store' } }), requestId)
}
