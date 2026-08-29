import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAuthService } from '@/modules/identity/composition'
import { getAdminUserService } from '@/modules/identity/admin-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { adminUserIdSchema } from '@/modules/identity/interface/admin-user-schemas'
import { clientIp } from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
type Context = { params: Promise<{ userId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); await requirePlatformAdmin(request); const { userId } = await context.params; const detail = await getAdminUserService().get(adminUserIdSchema.parse(userId)); await getAuthService().resendVerification(detail.user.email, clientIp(request)); return withApiHeaders(jsonResponse({ message: 'Verification request processed' }, { status: 202 }), requestId) } catch (error) { return adminUserErrorResponse(error, requestId) } }
