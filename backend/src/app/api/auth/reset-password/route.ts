import { getAuthService } from '@/modules/identity/composition'
import { resetPasswordRequestSchema } from '@/modules/identity/interface/auth-schemas'
import { assertSafeMutation, authErrorResponse, clientIp, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const input = await parseJson(request, resetPasswordRequestSchema)
    await getAuthService().resetPassword(input.token, input.password, clientIp(request))
    return withAuthHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) {
    return withAuthHeaders(authErrorResponse(error, requestId), requestId)
  }
}
