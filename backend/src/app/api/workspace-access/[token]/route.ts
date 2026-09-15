import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWorkspaceAccessService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { workspaceAccessTokenSchema } from '@/modules/weddings/interface/workspace-access-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ token: string }> }

async function token(context: Context) { return workspaceAccessTokenSchema.parse((await context.params).token) }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { return withApiHeaders(jsonResponse({ access: await getWorkspaceAccessService().resolve(await token(context)) }), requestId) } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); return withApiHeaders(jsonResponse({ member: await getWorkspaceAccessService().accept(actor, await token(context)) }), requestId) } catch (error) { return weddingErrorResponse(error, requestId) }
}
