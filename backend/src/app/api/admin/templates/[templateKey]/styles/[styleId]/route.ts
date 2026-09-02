import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { prisma } from '@/platform/database/prisma'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { TemplateStyleAdminService } from '@/modules/templates/application/template-style-admin-service'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { templateStyleIdSchema } from '@/modules/templates/interface/template-style-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
const service = new TemplateStyleAdminService(prisma)
type Context = { params: Promise<{ templateKey: string; styleId: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const { templateKey, styleId } = await context.params; return withApiHeaders(jsonResponse(await service.add(actor, templateKey, templateStyleIdSchema.parse(styleId), requestId)), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}

export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const { templateKey, styleId } = await context.params; return withApiHeaders(jsonResponse(await service.remove(actor, templateKey, templateStyleIdSchema.parse(styleId), requestId)), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}
