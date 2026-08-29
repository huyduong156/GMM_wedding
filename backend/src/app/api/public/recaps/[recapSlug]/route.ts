import type { NextRequest } from 'next/server'
import { getRecapService } from '@/modules/recaps'
import { recapErrorResponse } from '@/modules/recaps/interface'
import { apiHandler, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ recapSlug: string }> }

export async function GET(request: NextRequest, context: Context) {
  return apiHandler(request, async () => {
    const snapshot = await getRecapService().publicSnapshot((await context.params).recapSlug)
    const etag = '"' + snapshot.id + '-' + snapshot.version + '-' + snapshot.payloadHash + '"'
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: { etag, 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } })
    const response = jsonResponse({ snapshot })
    response.headers.set('cache-control', 'public, max-age=60, stale-while-revalidate=300')
    response.headers.set('etag', etag)
    return response
  }, recapErrorResponse)
}
