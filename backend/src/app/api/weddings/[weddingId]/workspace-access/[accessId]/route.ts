import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWorkspaceAccessService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { workspaceAccessIdSchema } from '@/modules/weddings/interface/workspace-access-schemas'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; accessId: string }> }

export async function DELETE(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const params = await context.params
    await getWorkspaceAccessService().revoke(actor, weddingIdSchema.parse(params.weddingId), workspaceAccessIdSchema.parse(params.accessId))
    return withApiHeaders(new Response(null, { status: 204 }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
