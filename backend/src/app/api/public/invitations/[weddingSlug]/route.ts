import type { NextRequest } from 'next/server'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ weddingSlug: string }> }
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    return jsonResponse(await getPublicInteractionService().resolveToken((await context.params).weddingSlug))
  } catch (error) { return guestErrorResponse(error, requestId) }
}
