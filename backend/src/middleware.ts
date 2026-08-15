import { NextResponse, type NextRequest } from 'next/server'
import { log } from '@/shared/observability/logger'

export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  log('info', 'HTTP request started', { requestId, method: request.method, path: request.nextUrl.pathname })
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)
  return response
}

export const config = { matcher: ['/api/:path*'] }
