import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { guestImportSchema } from '@/modules/guests/interface/guest-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const OPTIONS = optionsResponse; type Context = { params: Promise<{ weddingId: string }> }
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); await requireAuthenticatedUser(request); const { weddingId } = await context.params; const { rows } = await parseJson(request, guestImportSchema); weddingIdSchema.parse(weddingId); return withAuthHeaders(jsonResponse(getGuestService().previewImport(rows)), requestId) } catch (e) { return guestErrorResponse(e, requestId) } }
