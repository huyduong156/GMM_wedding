import { getAuthService } from '@/modules/identity/composition'
import { loginRequestSchema } from '@/modules/identity/interface/auth-schemas'
import { assertSafeMutation, authErrorResponse, clientIp, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getSessionCookiePolicy } from '@/platform/auth/session-policy'
import { getServerEnv } from '@/platform/config/env'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export function OPTIONS(request: Request) {
  return optionsResponse(request)
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const input = await parseJson(request, loginRequestSchema)
    const result = await getAuthService().login(input, {
      ip: clientIp(request),
      ...(request.headers.get('user-agent') ? { userAgent: request.headers.get('user-agent') as string } : {}),
    })
    const response = jsonResponse({ user: result.user })
    const env = getServerEnv()
    const cookie = getSessionCookiePolicy(env.NODE_ENV, new URL(env.APP_ORIGIN).protocol === 'https:')
    response.cookies.set(cookie.name, result.token, cookie.options)
    return withAuthHeaders(response, requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}
