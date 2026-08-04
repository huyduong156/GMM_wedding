import type { NextRequest } from 'next/server'

import { getAuthService } from '@/modules/identity/composition'
import { authErrorResponse, optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getSessionCookiePolicy } from '@/platform/auth/session-policy'
import { getServerEnv } from '@/platform/config/env'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    const env = getServerEnv()
    const cookie = getSessionCookiePolicy(env.NODE_ENV, new URL(env.APP_ORIGIN).protocol === 'https:')
    const user = await getAuthService().authenticate(request.cookies.get(cookie.name)?.value)
    const response = jsonResponse({ user })
    return withAuthHeaders(response, requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}
