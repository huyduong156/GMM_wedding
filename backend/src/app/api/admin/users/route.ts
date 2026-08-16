import type { NextRequest } from 'next/server'
import { optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAdminUserService } from '@/modules/identity/admin-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { adminUserListQuerySchema } from '@/modules/identity/interface/admin-user-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    await requirePlatformAdmin(request)
    const query = adminUserListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))
    return withAuthHeaders(jsonResponse(await getAdminUserService().list({ ...(query.q !== undefined ? { query: query.q } : {}), ...(query.status !== undefined ? { status: query.status } : {}), ...(query.role !== undefined ? { role: query.role } : {}), limit: query.limit, ...(query.cursor !== undefined ? { cursor: query.cursor } : {}) })), requestId)
  } catch (error) { return adminUserErrorResponse(error, requestId) }
}
