import { getGuestService } from '@/modules/guests'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { withAuthHeaders } from '@/modules/identity/interface/auth-http'
import type { NextRequest } from 'next/server'
type Context = { params: Promise<{ weddingSlug: string; guestSlug: string }> }
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); const { weddingSlug, guestSlug } = await context.params; const invitation = await getGuestService().resolvePublicInvitation(weddingSlug, guestSlug); if (!invitation) return withAuthHeaders(jsonResponse({ error: { code: 'RESOURCE_NOT_FOUND', message: 'Invitation not found', requestId } }, { status: 404 }), requestId); return withAuthHeaders(jsonResponse({ invitation }, { headers: { 'cache-control': 'no-store' } }), requestId) }
