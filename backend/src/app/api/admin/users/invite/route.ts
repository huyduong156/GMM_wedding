import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAdminInviteService } from '@/modules/identity/invite-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { adminUserInviteSchema } from '@/modules/identity/interface/admin-user-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const input = await parseJson(request, adminUserInviteSchema); return withAuthHeaders(jsonResponse(await getAdminInviteService().invite(actor.userId, input, requestId), { status: 202 }), requestId) } catch (error) { return adminUserErrorResponse(error, requestId) } }