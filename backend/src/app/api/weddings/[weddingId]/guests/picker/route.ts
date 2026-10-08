import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'

type Context = { params: Promise<{ weddingId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    const query = request.nextUrl.searchParams.get('q')?.trim() || undefined
    return withApiHeaders(
      jsonResponse({ items: await getGuestService().picker(actor, weddingId, query) }),
      requestId,
    )
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}
