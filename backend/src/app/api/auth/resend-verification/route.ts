import { getAuthService } from '@/modules/identity/composition'
import { resendVerificationRequestSchema } from '@/modules/identity/interface/auth-schemas'
import {
  assertSafeMutation,
  authErrorResponse,
  clientIp,
  optionsResponse,
  parseJson,
  withAuthHeaders,
} from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const input = await parseJson(request, resendVerificationRequestSchema)
    await getAuthService().resendVerification(input.email, clientIp(request))
    const response = jsonResponse(
      { message: 'If the account is awaiting verification, a new email has been sent.' },
      { status: 202 },
    )
    return withAuthHeaders(response, requestId)
  } catch (error) {
    return withAuthHeaders(authErrorResponse(error, requestId), requestId)
  }
}
