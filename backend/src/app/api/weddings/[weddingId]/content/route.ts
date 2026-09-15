import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getWeddingService } from '@/modules/weddings'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { requireWeddingPermission } from '@/modules/weddings/interface/wedding-authorizer'
import {
  contentQuerySchema,
  saveWeddingContentSchema,
  weddingIdSchema,
} from '@/modules/weddings/interface/wedding-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const surface = contentQuerySchema.parse({
      surface: request.nextUrl.searchParams.get('surface') ?? undefined,
    }).surface
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    await requireWeddingPermission(actor.userId, weddingId, 'READ')
    return withApiHeaders(
      jsonResponse({ content: await getWeddingService().getContent(actor, weddingId, surface) }),
      requestId,
    )
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
export async function PUT(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    const input = await parseJson(request, saveWeddingContentSchema)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    await requireWeddingPermission(actor.userId, weddingId, 'EDIT')
    return withApiHeaders(
      jsonResponse({ content: await getWeddingService().saveContent(actor, weddingId, input) }),
      requestId,
    )
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
