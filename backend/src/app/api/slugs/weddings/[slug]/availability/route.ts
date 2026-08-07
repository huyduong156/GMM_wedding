import type { NextRequest } from 'next/server'
import { withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ slug: string }> }
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const slug = (await context.params).slug
    const weddingId = request.nextUrl.searchParams.get('weddingId') ?? undefined
    return withAuthHeaders(jsonResponse({ slug, available: await getWeddingService().slugAvailable(actor, slug, weddingId) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
