import type { NextRequest } from 'next/server'

import { withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { requireWeddingPermission } from '@/modules/weddings/interface/wedding-authorizer'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    await requireWeddingPermission(actor.userId, weddingId, 'READ')
    return withApiHeaders(
      jsonResponse({ dashboard: await getWeddingService().dashboard(actor, weddingId) }),
      requestId,
    )
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
