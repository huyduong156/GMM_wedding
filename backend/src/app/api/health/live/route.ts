import { completeHttpRequest, getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const requestId = getRequestId(request)

  const response = jsonResponse(
    {
      status: 'ok',
      service: 'gmm-wedding-backend',
      requestId,
    },
    {
      headers: { 'x-request-id': requestId },
    },
  )
  completeHttpRequest(response, requestId)
  return response
}
