import { NextResponse, type NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { userSecurityErrorResponse } from '@/modules/identity/interface/user-security-http'
import { changePasswordSchema } from '@/modules/identity/interface/user-security-schemas'
import { getPasswordChangeService } from '@/modules/identity/session-composition'
import { getRequestId } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, changePasswordSchema)
    await getPasswordChangeService().change(
      actor.userId,
      actor.sessionId,
      input.currentPassword,
      input.newPassword,
    )
    return withApiHeaders(new NextResponse(null, { status: 204 }), requestId)
  } catch (error) {
    return userSecurityErrorResponse(error, requestId)
  }
}
