import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { prisma } from '@/platform/database/prisma'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { TemplateStyleAdminService } from '@/modules/templates/application/template-style-admin-service'
import { templateAdminErrorResponse } from '@/modules/templates/interface/template-admin-http'
import { createTemplateStyleSchema } from '@/modules/templates/interface/template-style-schemas'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
const service = new TemplateStyleAdminService(prisma)

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try { await requirePlatformAdmin(request); return withApiHeaders(jsonResponse(await service.list(request.nextUrl.searchParams.get('includeArchived') !== 'false')), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); return withApiHeaders(jsonResponse(await service.create(actor, await parseJson(request, createTemplateStyleSchema), requestId), { status: 201 }), requestId) }
  catch (error) { return templateAdminErrorResponse(error, requestId) }
}
