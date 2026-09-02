import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { prisma } from '@/platform/database/prisma'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { TemplateStyleAdminService } from '@/modules/templates/application/template-style-admin-service'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { templateStyleIdSchema, updateTemplateStyleSchema } from '@/modules/templates/interface/template-style-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
const service = new TemplateStyleAdminService(prisma)
type Context = { params: Promise<{ styleId: string }> }

export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const { styleId } = await context.params; return withApiHeaders(jsonResponse(await service.update(actor, templateStyleIdSchema.parse(styleId), await parseJson(request, updateTemplateStyleSchema), requestId)), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}

export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const { styleId } = await context.params; return withApiHeaders(jsonResponse(await service.archive(actor, templateStyleIdSchema.parse(styleId), requestId)), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}
