import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const requestId = getRequestId(request)

  return jsonResponse(
    {
      status: 'ok',
      service: 'gmm-wedding-backend',
      requestId,
    },
    {
      headers: { 'x-request-id': requestId },
    },
  )
}
