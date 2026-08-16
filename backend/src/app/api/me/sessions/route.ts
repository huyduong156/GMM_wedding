import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { userSecurityErrorResponse } from '@/modules/identity/interface/user-security-http'
import { revokeAllSessionsSchema } from '@/modules/identity/interface/user-security-schemas'
import { getUserSessionService } from '@/modules/identity/session-composition'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest) { const requestId = getRequestId(request); try { const { actor } = await requireAuthenticatedUser(request); return withAuthHeaders(jsonResponse(await getUserSessionService().list(actor.userId, actor.sessionId)), requestId) } catch (error) { return userSecurityErrorResponse(error, requestId) } }
export async function POST(request: NextRequest) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const input = await parseJson(request, revokeAllSessionsSchema); return withAuthHeaders(jsonResponse(await getUserSessionService().revokeAll(actor.userId, actor.sessionId, input.includeCurrent)), requestId) } catch (error) { return userSecurityErrorResponse(error, requestId) } }
