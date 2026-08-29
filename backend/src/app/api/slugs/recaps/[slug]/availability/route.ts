import type { NextRequest } from 'next/server'
import { withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRecapService } from '@/modules/recaps'
import { recapErrorResponse, recapSlugSchema } from '@/modules/recaps/interface'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ slug: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const slug = recapSlugSchema.parse((await context.params).slug)
    const weddingId = request.nextUrl.searchParams.get('weddingId') ?? undefined
    return withApiHeaders(jsonResponse({ slug, available: await getRecapService().slugAvailable(actor.userId, slug, weddingId) }), requestId)
  } catch (error) { return recapErrorResponse(error, requestId) }
}