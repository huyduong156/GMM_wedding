import { NextResponse } from 'next/server'
import { ZodError, type ZodType, type ZodTypeDef } from 'zod'

import { AuthError } from '../domain/auth-error'
import { getServerEnv } from '@/platform/config/env'
import { apiError, takeRequestOrigin, type ApiErrorBody } from '@/shared/http/api-response'

function allowedOrigins() {
  const env = getServerEnv()
  return new Set((env.APP_ORIGINS ?? env.APP_ORIGIN).split(',').map((origin) => origin.trim()).filter(Boolean))
}

export function clientIp(request: Request): string {
  const env = getServerEnv()
  if (env.TRUST_PROXY) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (forwarded) return forwarded
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export function assertSafeMutation(request: Request) {
  const env = getServerEnv()
  const origin = request.headers.get('origin')
  const fetchSite = request.headers.get('sec-fetch-site')
  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim()
  if (
    !allowedOrigins().has(origin ?? '')
    || fetchSite === 'cross-site'
    || request.headers.get('x-csrf-protection') !== '1'
    || contentType !== 'application/json'
  ) {
    throw new AuthError('REQUEST_ORIGIN_REJECTED', 403, 'Request origin or content type was rejected')
  }
}

export async function parseJson<T>(request: Request, schema: ZodType<T, ZodTypeDef, unknown>): Promise<T> {
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
  return apiError(requestId, 'INTERNAL_ERROR', 'An unexpected error occurred', 500)
}

export function optionsResponse(request?: Request) {
  const env = getServerEnv()
  const requestOrigin = request?.headers.get('origin')
  const origin = requestOrigin && allowedOrigins().has(requestOrigin) ? requestOrigin : env.APP_ORIGIN
  return new NextResponse(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': origin,
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'access-control-allow-headers': 'content-type,x-csrf-protection,x-request-id',
      vary: 'Origin',
    },
  })
}

export function withAuthHeaders<T extends Response>(response: T, requestId: string): T {
  const env = getServerEnv()
  const origin = takeRequestOrigin(requestId)
  response.headers.set('x-request-id', requestId)
  response.headers.set('access-control-allow-origin', origin && allowedOrigins().has(origin) ? origin : env.APP_ORIGIN)
  response.headers.set('access-control-allow-credentials', 'true')
  response.headers.append('vary', 'Origin')
  return response
}
