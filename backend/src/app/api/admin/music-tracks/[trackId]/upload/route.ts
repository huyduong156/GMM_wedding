import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getMusicService } from '@/modules/music'
import { musicErrorResponse, musicIdSchema } from '@/modules/music/interface'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ trackId: string }> }

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request, {
      contentTypes: ['audio/mpeg', 'audio/mp4', 'audio/ogg'],
    })
    const { actor } = await requirePlatformAdmin(request)
    const { trackId } = await context.params
    const body = new Uint8Array(await request.arrayBuffer())
    return withApiHeaders(
      jsonResponse(
        await getMusicService().uploadAdminBytes(
          actor.userId,
          musicIdSchema.parse(trackId),
          body,
          request.headers.get('content-type')?.split(';')[0]?.trim() ?? '',
        ),
      ),
      requestId,
    )
  } catch (error) {
    return musicErrorResponse(error, requestId)
  }
}
