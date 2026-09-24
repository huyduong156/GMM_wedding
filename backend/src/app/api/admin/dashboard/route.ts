import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAdminDashboardService } from '@/modules/identity/admin-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    await requirePlatformAdmin(request)
    return withApiHeaders(
      jsonResponse({ dashboard: await getAdminDashboardService().getOverview() }),
      requestId,
    )
  } catch (error) {
    return adminUserErrorResponse(error, requestId)
  }
}
