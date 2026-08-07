import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { contentQuerySchema, saveWeddingContentSchema, weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const surface = contentQuerySchema.parse({ surface: request.nextUrl.searchParams.get('surface') ?? undefined }).surface
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    return withAuthHeaders(jsonResponse({ content: await getWeddingService().getContent(actor, weddingId, surface) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, saveWeddingContentSchema)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    return withAuthHeaders(jsonResponse({ content: await getWeddingService().saveContent(actor, weddingId, input) }), requestId)
  } catch (error) { return weddingErrorResponse(error, requestId) }
}
