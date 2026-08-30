import type { NextRequest } from 'next/server'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ weddingSlug: string }> }
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const snapshot = await getWeddingService().publicSnapshot((await context.params).weddingSlug, 'WEDDING_WEBSITE')
    const etag = `"${snapshot.id}-${snapshot.version}"`
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: { etag, 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } })
    return jsonResponse({ snapshot }, { headers: { etag, 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } })
  } catch (error) { return weddingErrorResponse(error, requestId) }
}