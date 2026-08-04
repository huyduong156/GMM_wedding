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

export function getRequestId(request: Request): string {
  return request.headers.get('x-request-id') ?? randomUUID()
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
