import type { NextRequest } from 'next/server'

import { getAuthService } from '@/modules/identity/composition'
import { assertSafeMutation, authErrorResponse, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { updateProfileRequestSchema } from '@/modules/identity/interface/auth-schemas'
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
    const identity = await getAuthService().authenticate(request.cookies.get(cookie.name)?.value)
    const response = jsonResponse({ user: identity.user })
    return withAuthHeaders(response, requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const env = getServerEnv()
    const cookie = getSessionCookiePolicy(env.NODE_ENV, new URL(env.APP_ORIGIN).protocol === 'https:')
    const identity = await getAuthService().authenticate(request.cookies.get(cookie.name)?.value)
    const input = await parseJson(request, updateProfileRequestSchema)
    const response = jsonResponse({ user: await getAuthService().updateProfile(identity.user.id, input) })
    return withAuthHeaders(response, requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}
