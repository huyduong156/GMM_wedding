import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { templateThumbnailUploadIntentSchema } from '@/modules/templates/interface/template-admin-schemas'
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
    const input = await parseJson(request, templateThumbnailUploadIntentSchema)
    return withApiHeaders(
      jsonResponse(
        await getTemplateAdminService().createThumbnailUploadIntent(actor, templateKey, version, input),
        { status: 201 },
      ),
      requestId,
    )
  } catch (error) {
    return templateAdminErrorResponse(error, requestId)
  }
}
