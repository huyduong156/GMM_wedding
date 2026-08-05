import { getAuthService } from '@/modules/identity/composition'
import { verifyEmailRequestSchema } from '@/modules/identity/interface/auth-schemas'
import { assertSafeMutation, authErrorResponse, clientIp, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const input = await parseJson(request, verifyEmailRequestSchema)
    await getAuthService().verifyEmail(input.token, clientIp(request))
    return withAuthHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}
