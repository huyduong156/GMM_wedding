import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getMediaManager } from '@/modules/media'
import { mediaErrorResponse } from '@/modules/media/interface/media-http'
import { mediaMetadataSchema, weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; mediaId: string }> }
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const p = await context.params
    return withApiHeaders(
      jsonResponse({
        media: await getMediaManager().get(
          actor.userId,
          weddingIdSchema.parse(p.weddingId),
          p.mediaId,
        ),
      }),
      requestId,
    )
  } catch (error) {
    return mediaErrorResponse(error, requestId)
  }
}
export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const p = await context.params
    const input = await parseJson(request, mediaMetadataSchema)
    return withApiHeaders(
      jsonResponse({
        media: await getMediaManager().updateMetadata(
          actor.userId,
          weddingIdSchema.parse(p.weddingId),
          p.mediaId,
          input.altText !== undefined ? { altText: input.altText } : {},
        ),
      }),
      requestId,
    )
  } catch (error) {
    return mediaErrorResponse(error, requestId)
  }
}
export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const p = await context.params
    await getMediaManager().remove(actor.userId, weddingIdSchema.parse(p.weddingId), p.mediaId)
    return withApiHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) {
    return mediaErrorResponse(error, requestId)
  }
}
