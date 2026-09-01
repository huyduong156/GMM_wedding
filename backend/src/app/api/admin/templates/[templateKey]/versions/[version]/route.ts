import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ templateKey: string; version: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    await requirePlatformAdmin(request)
    const { templateKey, version } = await context.params
    return withApiHeaders(
      jsonResponse({ template: await getTemplateAdminService().detail(templateKey, version) }),
      requestId,
    )
  } catch (error) {
    return templateAdminErrorResponse(error, requestId)
  }
}
