import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWorkspaceAccessService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { workspaceMemberIdSchema, workspaceMemberUpdateSchema } from '@/modules/weddings/interface/workspace-access-schemas'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; memberId: string }> }

async function ids(context: Context) {
  const params = await context.params
  return { weddingId: weddingIdSchema.parse(params.weddingId), memberId: workspaceMemberIdSchema.parse(params.memberId) }
}

export async function PATCH(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId, memberId } = await ids(context)
    const input = await parseJson(request, workspaceMemberUpdateSchema)
    return withApiHeaders(jsonResponse({ member: await getWorkspaceAccessService().changeMemberRole(actor, weddingId, memberId, input.role) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}

export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const { weddingId, memberId } = await ids(context)
    await getWorkspaceAccessService().removeMember(actor, weddingId, memberId)
    return withApiHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
