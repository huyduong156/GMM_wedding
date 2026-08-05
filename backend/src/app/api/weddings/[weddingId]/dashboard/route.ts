import type { NextRequest } from 'next/server'

import { withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    return withAuthHeaders(jsonResponse({ dashboard: await getWeddingService().dashboard(actor, weddingId) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
