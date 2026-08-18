import type { NextRequest } from 'next/server'
import { optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRsvpService } from '@/modules/rsvps'
import { rsvpErrorResponse } from '@/modules/rsvps/interface/rsvp-http'
import { rsvpQuerySchema } from '@/modules/rsvps/interface/rsvp-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId } = await context.params
    const query = rsvpQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    return withAuthHeaders(jsonResponse(await getRsvpService().list(actor, weddingIdSchema.parse(weddingId), {
      limit: query.limit,
      ...(query.q !== undefined ? { query: query.q } : {}),
      ...(query.attendance !== undefined ? { attendance: query.attendance } : {}),
      ...(query.eventId !== undefined ? { eventId: query.eventId } : {}),
      ...(query.categoryId !== undefined ? { categoryId: query.categoryId } : {}),
      ...(query.groupId !== undefined ? { groupId: query.groupId } : {}),
      ...(query.from !== undefined ? { from: query.from } : {}),
      ...(query.to !== undefined ? { to: query.to } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    })), requestId)
  } catch (error) {
    return rsvpErrorResponse(error, requestId)
  }
}
