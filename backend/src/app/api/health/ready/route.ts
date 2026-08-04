import { prisma } from '@/platform/database/prisma'
import { apiError, getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await prisma.$queryRaw`SELECT 1`

    return jsonResponse(
      {
        status: 'ready',
        service: 'gmm-wedding-backend',
        checks: { database: 'up' },
        requestId,
      },
      {
        headers: { 'x-request-id': requestId },
      },
    )
  } catch {
    const response = apiError(requestId, 'SERVICE_UNAVAILABLE', 'Service is not ready', 503)
    response.headers.set('x-request-id', requestId)
    return response
  }
}
