import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    requestId: string
    fieldErrors?: Record<string, string[]>
  }
}

const requestOrigins = new Map<string, string | undefined>()
export function rememberRequestOrigin(requestId: string, origin: string | null) { requestOrigins.set(requestId, origin ?? undefined) }
export function takeRequestOrigin(requestId: string) { const origin = requestOrigins.get(requestId); requestOrigins.delete(requestId); return origin }

export function getRequestId(request: Request): string {
  const requestId = request.headers.get('x-request-id') ?? randomUUID()
  rememberRequestOrigin(requestId, request.headers.get('origin'))
  return requestId
}

export function jsonResponse<T>(body: T, init?: ResponseInit): NextResponse<T> {
  const response = NextResponse.json(body, init)
  response.headers.set('cache-control', 'no-store')
  return response
}

export function apiError(
  requestId: string,
  code: string,
  message: string,
  status: number,
  fieldErrors?: Record<string, string[]>,
): NextResponse<ApiErrorBody> {
  return jsonResponse(
    {
      error: {
        code,
        message,
        requestId,
        ...(fieldErrors ? { fieldErrors } : {}),
      },
    },
    { status },
  )
}
