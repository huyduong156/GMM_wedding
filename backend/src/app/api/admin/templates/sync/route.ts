import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { templateReleaseBundleSchema } from '@/modules/templates/interface/template-admin-schemas'
import { scanTemplateSource } from '@/modules/templates/infrastructure/template-source-scanner'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requirePlatformAdmin(request)
    const body = await request.text()
    const parsed = body.trim() ? JSON.parse(body) as Record<string, unknown> : {}
    const bundle = Object.keys(parsed).length === 0 ? await scanTemplateSource() : templateReleaseBundleSchema.parse(parsed)
    return withAuthHeaders(jsonResponse(await getTemplateAdminService().sync(actor, bundle, requestId)), requestId)
  } catch (error) { return templateAdminErrorResponse(error, requestId) }
}
