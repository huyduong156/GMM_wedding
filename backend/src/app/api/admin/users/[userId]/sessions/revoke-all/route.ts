import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAdminUserService } from '@/modules/identity/admin-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { adminUserIdSchema } from '@/modules/identity/interface/admin-user-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
type Context = { params: Promise<{ userId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const { userId } = await context.params; return withApiHeaders(jsonResponse(await getAdminUserService().revokeSessions(actor.userId, adminUserIdSchema.parse(userId), requestId)), requestId) } catch (error) { return adminUserErrorResponse(error, requestId) } }
