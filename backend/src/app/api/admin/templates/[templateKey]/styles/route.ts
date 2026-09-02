import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { prisma } from '@/platform/database/prisma'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { TemplateStyleAdminService } from '@/modules/templates/application/template-style-admin-service'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { replaceTemplateStylesSchema } from '@/modules/templates/interface/template-style-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
const service = new TemplateStyleAdminService(prisma)
type Context = { params: Promise<{ templateKey: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { await requirePlatformAdmin(request); const { templateKey } = await context.params; return withApiHeaders(jsonResponse(await service.stylesForTemplate(templateKey)), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}

export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); const { templateKey } = await context.params; const body = await parseJson(request, replaceTemplateStylesSchema); return withApiHeaders(jsonResponse(await service.replace(actor, templateKey, body.styleIds, requestId)), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}
