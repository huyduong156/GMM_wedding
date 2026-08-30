import type { NextRequest } from 'next/server'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { getWeddingService } from '@/modules/weddings'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ weddingSlug: string }> }
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  const value = (await context.params).weddingSlug
  const isWeddingSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 64
  try {
    if (isWeddingSlug) {
      const snapshot = await getWeddingService().publicSnapshot(value, 'ONLINE_INVITATION')
      return jsonResponse({ snapshot }, { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } })
    }
    return jsonResponse(await getPublicInteractionService().resolveToken(value))
  } catch (error) {
    return isWeddingSlug ? weddingErrorResponse(error, requestId) : guestErrorResponse(error, requestId)
  }
}