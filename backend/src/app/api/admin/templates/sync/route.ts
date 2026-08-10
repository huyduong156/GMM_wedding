import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { templateReleaseBundleSchema } from '@/modules/templates/interface/template-admin-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requirePlatformAdmin(request)
    const bundle = await parseJson(request, templateReleaseBundleSchema)
    return withAuthHeaders(jsonResponse(await getTemplateAdminService().sync(actor, bundle, requestId)), requestId)
  } catch (error) { return templateAdminErrorResponse(error, requestId) }
}
