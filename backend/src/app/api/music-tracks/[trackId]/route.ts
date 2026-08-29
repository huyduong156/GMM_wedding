import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getMusicService } from '@/modules/music'
import { musicErrorResponse, musicIdSchema } from '@/modules/music/interface'
import { getRequestId } from '@/shared/http/api-response'
type Context = { params: Promise<{ trackId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); await getMusicService().retire(actor.userId, musicIdSchema.parse((await context.params).trackId)); return withApiHeaders(new Response(null, { status: 204 }), requestId) }
  catch (error) { return musicErrorResponse(error, requestId) }
}