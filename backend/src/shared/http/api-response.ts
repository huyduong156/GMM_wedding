import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getServerEnv } from '@/platform/config/env'
import { logHttpAccess, logHttpError, serializeError } from '@/shared/observability/logger'

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    requestId: string
    fieldErrors?: Record<string, string[]>
    debug?: Record<string, unknown>
  }
}

const requestOrigins = new Map<string, string | undefined>()
const requestContexts = new Map<string, { method: string; path: string; ip: string; startedAt: number }>()
const completedResponses = new WeakSet<Response>()

export function rememberRequestOrigin(requestId: string, origin: string | null) { requestOrigins.set(requestId, origin ?? undefined) }
export function takeRequestOrigin(requestId: string) { const origin = requestOrigins.get(requestId); requestOrigins.delete(requestId); return origin }

export function getRequestId(request: Request): string {
  const requestId = request.headers.get('x-request-id') ?? randomUUID()
  rememberRequestOrigin(requestId, request.headers.get('origin'))
  if (!requestContexts.has(requestId)) {
    const url = new URL(request.url)
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    requestContexts.set(requestId, {
      method: request.method,
      path: `${url.pathname}${url.search}`,
      ip: forwarded ?? request.headers.get('x-real-ip') ?? 'unknown',
      startedAt: performance.now(),
    })
  }
  return requestId
}

export function completeHttpRequest(response: Response, requestId: string) {
  if (completedResponses.has(response)) return
  completedResponses.add(response)
  const context = requestContexts.get(requestId)
  if (!context) return
  requestContexts.delete(requestId)
  logHttpAccess({
    requestId,
    method: context.method,
    path: context.path,
    ip: context.ip,
    status: response.status,
    durationMs: performance.now() - context.startedAt,
  })
}

export function jsonResponse<T>(body: T, init?: ResponseInit): NextResponse<T> {
  const response = NextResponse.json(body, init)
  response.headers.set('cache-control', 'no-store')
  return response
}

function includeErrorDebug(status: number) {
  const env = getServerEnv()
  if (status < 500) return false
  return env.ERROR_RESPONSE_DETAILS || env.APP_ENV === 'local' || env.APP_ENV === 'test'
}

export function apiError(
  requestId: string,
  code: string,
  message: string,
  status: number,
  fieldErrors?: Record<string, string[]>,
  cause?: unknown,
): NextResponse<ApiErrorBody> {
  if (status >= 500) {
    logHttpError(cause ?? new Error(message), { requestId, status, code })
  }
  const response = jsonResponse(
    {
      error: {
        code,
        message,
        requestId,
        ...(fieldErrors ? { fieldErrors } : {}),
        ...(cause && includeErrorDebug(status) ? { debug: serializeError(cause) } : {}),
      },
    },
    { status },
  )
  completeHttpRequest(response, requestId)
  return response
}
