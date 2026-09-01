import { NextResponse } from 'next/server'
import { ZodError, type ZodType, type ZodTypeDef } from 'zod'

import { AuthError } from '../domain/auth-error'
import { getServerEnv } from '@/platform/config/env'
import {
  apiError,
  completeHttpRequest,
  getRequestId,
  withApiHeaders,
  type ApiErrorBody,
} from '@/shared/http/api-response'
export { withApiHeaders }

function allowedOrigins() {
  const env = getServerEnv()
  const origins = new Set(
    (env.APP_ORIGINS ?? env.APP_ORIGIN)
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  if (env.APP_ENV === 'local' || env.APP_ENV === 'test') {
    for (const port of [5173, 8080, 4173]) {
      origins.add(`http://localhost:${port}`)
      origins.add(`http://127.0.0.1:${port}`)
    }
  }
  return origins
}
export function clientIp(request: Request): string {
  const env = getServerEnv()
  if (env.TRUST_PROXY) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (forwarded) return forwarded
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export function assertSafeMutation(
  request: Request,
  options?: { contentTypes?: readonly string[] },
) {
  const origin = request.headers.get('origin')
  const fetchSite = request.headers.get('sec-fetch-site')
  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim()
  const allowedContentTypes = options?.contentTypes ?? ['application/json']
  if (
    !allowedOrigins().has(origin ?? '') ||
    fetchSite === 'cross-site' ||
    request.headers.get('x-csrf-protection') !== '1' ||
    !allowedContentTypes.includes(contentType ?? '')
  ) {
    throw new AuthError(
      'REQUEST_ORIGIN_REJECTED',
      403,
      'Request origin or content type was rejected',
    )
  }
}

export async function parseJson<T>(
  request: Request,
  schema: ZodType<T, ZodTypeDef, unknown>,
): Promise<T> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new AuthError('VALIDATION_ERROR', 400, 'Request body must be valid JSON')
  }
  return schema.parse(body)
}

export function authErrorResponse(error: unknown, requestId: string): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>
    return apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, fieldErrors)
  }
  if (error instanceof AuthError) {
    const response = apiError(requestId, error.code, error.message, error.status)
    if (error.retryAfter) response.headers.set('retry-after', String(error.retryAfter))
    return response
  }
  return apiError(
    requestId,
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    500,
    undefined,
    error,
  )
}

export function optionsResponse(request?: Request) {
  const env = getServerEnv()
  const requestOrigin = request?.headers.get('origin')
  const origin =
    requestOrigin && allowedOrigins().has(requestOrigin) ? requestOrigin : env.APP_ORIGIN
  const requestId = request ? getRequestId(request) : undefined
  const response = new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': origin,
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'access-control-allow-headers': 'content-type,x-csrf-protection,x-request-id',
      ...(requestId ? { 'x-request-id': requestId } : {}),
      vary: 'Origin',
    },
  })
  if (requestId) completeHttpRequest(response, requestId)
  return response
}

export const withAuthHeaders = withApiHeaders
