import type { NextRequest } from 'next/server'
import { withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { WeddingError } from '@/modules/weddings/domain/wedding-error'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ templateKey: string; version: string }> }
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    await requireAuthenticatedUser(request)
    const { templateKey, version } = await context.params
    const template = await getWeddingService().getTemplateVersion(templateKey, version)
    if (!template) throw new WeddingError('WEDDING_TEMPLATE_NOT_FOUND', 404, 'Template version not found')
    return withAuthHeaders(jsonResponse({ template }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
