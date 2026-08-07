import type { NextRequest } from 'next/server'
import { withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    await requireAuthenticatedUser(request)
    const productType = request.nextUrl.searchParams.get('productType')
    const normalized = productType === 'ONLINE_INVITATION' || productType === 'WEDDING_WEBSITE' ? productType : undefined
    return withAuthHeaders(jsonResponse({ items: await getWeddingService().listTemplates(normalized) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
