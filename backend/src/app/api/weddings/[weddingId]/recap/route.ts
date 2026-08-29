import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getRecapService } from '@/modules/recaps'
import { recapErrorResponse, recapSaveSchema } from '@/modules/recaps/interface'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    return withApiHeaders(jsonResponse({ recap: await getRecapService().getDraft(actor.userId, weddingId) }), requestId)
  } catch (error) { return recapErrorResponse(error, requestId) }
}

export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, recapSaveSchema)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    return withApiHeaders(jsonResponse({ recap: await getRecapService().saveDraft(actor.userId, weddingId, input) }), requestId)
  } catch (error) { return recapErrorResponse(error, requestId) }
}