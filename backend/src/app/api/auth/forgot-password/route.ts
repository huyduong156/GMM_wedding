import { getAuthService } from '@/modules/identity/composition'
import { forgotPasswordRequestSchema } from '@/modules/identity/interface/auth-schemas'
import { assertSafeMutation, authErrorResponse, clientIp, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const input = await parseJson(request, forgotPasswordRequestSchema)
    await getAuthService().forgotPassword(input.email, clientIp(request))
    return withAuthHeaders(jsonResponse({ message: 'If the account is eligible, a password reset email has been sent.' }, { status: 202 }), requestId)
  } catch (error) {
    return withAuthHeaders(authErrorResponse(error, requestId), requestId)
  }
}
