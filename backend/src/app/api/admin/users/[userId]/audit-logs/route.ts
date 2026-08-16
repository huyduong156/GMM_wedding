import type { NextRequest } from 'next/server'
import { optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAdminUserService } from '@/modules/identity/admin-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { adminUserAuditQuerySchema, adminUserIdSchema } from '@/modules/identity/interface/admin-user-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
type Context = { params: Promise<{ userId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { await requirePlatformAdmin(request); const { userId } = await context.params; const query = adminUserAuditQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries())); return withAuthHeaders(jsonResponse(await getAdminUserService().audit(adminUserIdSchema.parse(userId), query.limit, query.cursor)), requestId) } catch (error) { return adminUserErrorResponse(error, requestId) } }
