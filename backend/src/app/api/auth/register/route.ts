import { getAuthService } from '@/modules/identity/composition'
import { registerRequestSchema } from '@/modules/identity/interface/auth-schemas'
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
    const input = await parseJson(request, registerRequestSchema)
    await getAuthService().register(
      {
        email: input.email,
        password: input.password,
        ...(input.displayName ? { displayName: input.displayName } : {}),
      },
      clientIp(request),
    )
    const response = jsonResponse(
      { message: 'If the address can be registered, a verification email has been sent.' },
      { status: 202 },
    )
    return withAuthHeaders(response, requestId)
  } catch (error) {
    const response = authErrorResponse(error, requestId)
    return withAuthHeaders(response, requestId)
  }
}
