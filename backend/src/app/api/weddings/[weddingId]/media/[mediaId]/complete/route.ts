import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getMediaManager } from '@/modules/media'
import { mediaErrorResponse } from '@/modules/media/interface/media-http'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; mediaId: string }> }
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const p = await context.params; return withAuthHeaders(jsonResponse(await getMediaManager().complete(actor.userId, weddingIdSchema.parse(p.weddingId), p.mediaId)), requestId) } catch (error) { return mediaErrorResponse(error, requestId) } }
