import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ templateKey: string; version: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requirePlatformAdmin(request)
    const { templateKey, version } = await context.params
    return withApiHeaders(
      jsonResponse({
        version: await getTemplateAdminService().deprecate(actor, templateKey, version, requestId),
      }),
      requestId,
    )
  } catch (error) {
    return templateAdminErrorResponse(error, requestId)
  }
}
