import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getTemplateAdminService } from '@/modules/templates'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

type Context = { params: Promise<{ templateKey: string; version: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request, { contentTypes: ['image/jpeg', 'image/png', 'image/webp'] })
    const { actor } = await requirePlatformAdmin(request)
    const { templateKey, version } = await context.params
    const storageKey = request.nextUrl.searchParams.get('storageKey') ?? ''
    const body = new Uint8Array(await request.arrayBuffer())
    return withApiHeaders(
      jsonResponse(
        await getTemplateAdminService().uploadThumbnailBytes(
          actor,
          templateKey,
          version,
          storageKey,
          body,
          request.headers.get('content-type')?.split(';')[0]?.trim() ?? '',
        ),
      ),
      requestId,
    )
  } catch (error) {
    return templateAdminErrorResponse(error, requestId)
  }
}
