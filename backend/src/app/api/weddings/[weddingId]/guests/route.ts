import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { createGuestSchema, guestQuerySchema } from '@/modules/guests/interface/guest-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
async function id(context: Context) {
  return weddingIdSchema.parse((await context.params).weddingId)
}
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const parsed = guestQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    const result = await getGuestService().list(actor, await id(context), {
      query: parsed.q,
      categoryId: parsed.categoryId,
      groupId: parsed.groupId,
      familySide: parsed.familySide,
          familySideNull: parsed.familySideNull,
      limit: parsed.limit,
      cursor: parsed.cursor,
    })
    return withApiHeaders(
      jsonResponse({
        ...result,
        items: result.items.map((guest) => ({ ...guest, familySide: guest.familySide ?? null })),
      }),
      requestId,
    )
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}
export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    return withApiHeaders(
      jsonResponse(
        {
          guest: await getGuestService().create(
            actor,
            await id(context),
            await parseJson(request, createGuestSchema),
          ),
        },
        { status: 201 },
      ),
      requestId,
    )
  } catch (error) {
    return guestErrorResponse(error, requestId)
  }
}
