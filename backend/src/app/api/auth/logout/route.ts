import type { NextRequest } from 'next/server'

import { getAuthService } from '@/modules/identity/composition'
import { assertSafeMutation, authErrorResponse, optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getSessionCookiePolicy } from '@/platform/auth/session-policy'
import { getServerEnv } from '@/platform/config/env'
import { getRequestId } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  const env = getServerEnv()
  const cookie = getSessionCookiePolicy(env.NODE_ENV, new URL(env.APP_ORIGIN).protocol === 'https:')
  try {
    assertSafeMutation(request)
    await getAuthService().logout(request.cookies.get(cookie.name)?.value)
    const response = new Response(null, { status: 204, headers: { 'x-request-id': requestId } })
    response.headers.append(
      'set-cookie',
      `${cookie.name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${cookie.options.secure ? '; Secure' : ''}`,
    )
    return withAuthHeaders(response, requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}
