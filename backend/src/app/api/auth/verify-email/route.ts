import { getAuthService } from '@/modules/identity/composition'
import { verifyEmailRequestSchema } from '@/modules/identity/interface/auth-schemas'
import {
  assertSafeMutation,
  authErrorResponse,
  clientIp,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const input = await parseJson(request, verifyEmailRequestSchema)
    const workspaceAccessOutcome = await getAuthService().verifyEmail(input.token, clientIp(request))
    return withApiHeaders(
      jsonResponse({ ...(workspaceAccessOutcome ? { workspaceAccessOutcome } : {}) }),
      requestId,
    )
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withApiHeaders(response, requestId)
  }
}
