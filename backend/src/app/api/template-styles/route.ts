import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { prisma } from '@/platform/database/prisma'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { TemplateStyleAdminService } from '@/modules/templates/application/template-style-admin-service'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

const service = new TemplateStyleAdminService(prisma)

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request)
  try {
    await requireAuthenticatedUser(request)
    return withApiHeaders(jsonResponse(await service.listActive()), requestId)
  } catch (error) {
    return withApiHeaders(jsonResponse({ error: { code: 'UNAUTHORIZED', message: error instanceof Error ? error.message : 'Unauthorized' } }, { status: 401 }), requestId)
  }
}
