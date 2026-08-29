import type { NextRequest } from 'next/server'

import { authErrorResponse, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    const identity = await requirePlatformAdmin(request)
    return withApiHeaders(jsonResponse({ user: identity.user, actor: identity.actor }), requestId)
  } catch (error) {
    return withApiHeaders(authErrorResponse(error, requestId), requestId)
  }
}
