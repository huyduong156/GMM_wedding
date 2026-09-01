import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getMusicService } from '@/modules/music'
import { musicCreateSchema, musicErrorResponse } from '@/modules/music/interface'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, musicCreateSchema)
    return withApiHeaders(
      jsonResponse(await getMusicService().createPersonalIntent(actor.userId, input), {
        status: 201,
      }),
      requestId,
    )
  } catch (error) {
    return musicErrorResponse(error, requestId)
  }
}
