import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getMusicService } from '@/modules/music'
import { musicErrorResponse } from '@/modules/music/interface'
import { musicListSchema } from '@/modules/music/interface'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const input = musicListSchema.parse({ q: request.nextUrl.searchParams.get('q') ?? undefined })
    return withApiHeaders(
      jsonResponse(await getMusicService().listForUser(actor.userId, input)),
      requestId,
    )
  } catch (error) {
    return musicErrorResponse(error, requestId)
  }
}
