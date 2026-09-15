import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWorkspaceAccessService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { workspaceAccessCreateSchema } from '@/modules/weddings/interface/workspace-access-schemas'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getServerEnv } from '@/platform/config/env'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

async function id(context: Context) { return weddingIdSchema.parse((await context.params).weddingId) }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { const { actor } = await requireAuthenticatedUser(request); return withApiHeaders(jsonResponse({ access: await getWorkspaceAccessService().list(actor, await id(context)) }), requestId) } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const result = await getWorkspaceAccessService().create(actor, await id(context), await parseJson(request, workspaceAccessCreateSchema))
    const frontendOrigin = new URL(getServerEnv().APP_ORIGIN).origin
    const access = {
      id: result.access.id,
      weddingId: result.access.weddingId,
      createdByUserId: result.access.createdByUserId,
      acceptedByUserId: result.access.acceptedByUserId,
      email: result.access.email,
      role: result.access.role,
      status: result.access.status,
      expiresAt: result.access.expiresAt,
      acceptedAt: result.access.acceptedAt,
      revokedAt: result.access.revokedAt,
      createdAt: result.access.createdAt,
      updatedAt: result.access.updatedAt,
      acceptUrl: `${frontendOrigin}/workspace-access/${result.token}`,
    }
    return withApiHeaders(jsonResponse({ access }, { status: 201 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
