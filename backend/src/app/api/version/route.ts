import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const requestId = getRequestId(request)

  return jsonResponse(
    {
      service: 'gmm-wedding-backend',
      version: process.env.APP_VERSION ?? 'development',
      revision: process.env.GIT_SHA ?? 'local',
      requestId,
    },
    {
      headers: { 'x-request-id': requestId },
    },
  )
}
