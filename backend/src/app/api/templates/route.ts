import type { NextRequest } from 'next/server'
import { withApiHeaders } from '@/modules/identity/interface/auth-http'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    const productType = request.nextUrl.searchParams.get('productType')
    const normalized =
      productType === 'ONLINE_INVITATION' ||
      productType === 'WEDDING_WEBSITE' ||
      productType === 'RECAP'
        ? productType
        : undefined
    const styleKey = request.nextUrl.searchParams.get('styleKey') ?? undefined
    return withApiHeaders(
      jsonResponse({ items: await getWeddingService().listTemplates(normalized, styleKey) }),
      requestId,
    )
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
