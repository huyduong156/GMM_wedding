import { NextResponse, type NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { userSecurityErrorResponse } from '@/modules/identity/interface/user-security-http'
import { sessionIdSchema } from '@/modules/identity/interface/user-security-schemas'
import { getUserSessionService } from '@/modules/identity/session-composition'
import { getRequestId } from '@/shared/http/api-response'
type Context = { params: Promise<{ sessionId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function DELETE(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const { sessionId } = await context.params; await getUserSessionService().revoke(actor.userId, sessionIdSchema.parse(sessionId)); return withAuthHeaders(new NextResponse(null, { status: 204 }), requestId) } catch (error) { return userSecurityErrorResponse(error, requestId) } }
