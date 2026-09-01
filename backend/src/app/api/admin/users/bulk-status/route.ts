import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getAdminUserService } from '@/modules/identity/admin-composition'
import { adminUserErrorResponse } from '@/modules/identity/interface/admin-user-http'
import { adminUserBulkStatusSchema } from '@/modules/identity/interface/admin-user-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requirePlatformAdmin(request)
    const input = await parseJson(request, adminUserBulkStatusSchema)
    return withApiHeaders(
      jsonResponse(
        await getAdminUserService().bulkStatus(
          actor.userId,
          input.userIds,
          input.status,
          requestId,
        ),
      ),
      requestId,
    )
  } catch (error) {
    return adminUserErrorResponse(error, requestId)
  }
}
