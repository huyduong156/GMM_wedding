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
export async function PUT(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const p = await context.params; const body = new Uint8Array(await request.arrayBuffer()); return withAuthHeaders(jsonResponse(await getMediaManager().uploadFake(actor.userId, weddingIdSchema.parse(p.weddingId), p.mediaId, body, request.headers.get('content-type') ?? 'application/octet-stream')), requestId) } catch (error) { return mediaErrorResponse(error, requestId) } }
