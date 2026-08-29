import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getMusicService } from '@/modules/music'
import { musicErrorResponse, musicIdSchema, musicUpdateSchema } from '@/modules/music/interface'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ trackId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requirePlatformAdmin(request)
    const params = await context.params
    const input = await parseJson(request, musicUpdateSchema)
    return withApiHeaders(jsonResponse(await getMusicService().updateAdmin(actor.userId, musicIdSchema.parse(params.trackId), input)), requestId)
  } catch (error) { return musicErrorResponse(error, requestId) }
}
