import type { NextRequest } from 'next/server'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ slug: string }> }
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const snapshot = await getWeddingService().publicSnapshot((await context.params).slug, 'ONLINE_INVITATION')
    const response = jsonResponse({ snapshot })
    response.headers.set('cache-control', 'public, max-age=60, stale-while-revalidate=300')
    response.headers.set('etag', `"${snapshot.id}-${snapshot.version}"`)
    return response
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
