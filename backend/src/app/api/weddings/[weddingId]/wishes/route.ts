import type { NextRequest } from 'next/server'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { requireWeddingPermission } from '@/modules/weddings/interface/wedding-authorizer'
import { weddingIdSchema, wishQuerySchema } from '@/modules/weddings/interface/wedding-schemas'
import { withApiHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const query = wishQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    await requireWeddingPermission(actor.userId, weddingId, 'EDIT')
    const result = await getWeddingService().listWishes(
      actor,
      weddingId,
      {
        limit: query.limit,
        ...(query.status !== undefined ? { status: query.status } : {}),
        ...(query.q !== undefined ? { query: query.q } : {}),
        ...(query.from !== undefined ? { from: query.from } : {}),
        ...(query.to !== undefined ? { to: query.to } : {}),
        ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
      },
    )
    return withApiHeaders(jsonResponse(result), requestId)
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
