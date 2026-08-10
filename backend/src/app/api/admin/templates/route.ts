import type { NextRequest } from 'next/server'
import { optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { adminTemplateListQuerySchema } from '@/modules/templates/interface/template-admin-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    await requirePlatformAdmin(request)
    const query = adminTemplateListQuerySchema.parse({ productType: request.nextUrl.searchParams.get('productType') ?? undefined, reviewStatus: request.nextUrl.searchParams.get('reviewStatus') ?? undefined })
    return withAuthHeaders(jsonResponse(await getTemplateAdminService().list(query)), requestId)
  } catch (error) { return templateAdminErrorResponse(error, requestId) }
}
