import { createCsrfToken, getCsrfCookiePolicy } from '@/platform/auth/csrf'
import { getServerEnv } from '@/platform/config/env'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'

export function OPTIONS(request: Request) {
  return optionsResponse(request)
}

export function GET(request: Request) {
  const requestId = getRequestId(request)
  const env = getServerEnv()
  const cookie = getCsrfCookiePolicy(new URL(env.APP_ORIGIN).protocol === 'https:')
  const existing = request.headers
    .get('cookie')
    ?.match(new RegExp(`(?:^|;\\s*)${cookie.name}=([^;]+)`))?.[1]
  const token = existing || createCsrfToken()
  const response = jsonResponse({ csrfToken: token })
  if (!existing) response.cookies.set(cookie.name, token, cookie.options)
  return withApiHeaders(response, requestId)
}
