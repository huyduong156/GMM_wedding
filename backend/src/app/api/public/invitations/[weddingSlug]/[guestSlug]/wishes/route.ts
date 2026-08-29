import type { NextRequest } from 'next/server'

import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { wishSchema } from '@/modules/public-interactions/public-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'

export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingSlug: string; guestSlug: string }> }

export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { weddingSlug, guestSlug } = await context.params
    return withApiHeaders(jsonResponse(await getPublicInteractionService().submitPersonalWish(weddingSlug, guestSlug, await parseJson(request, wishSchema)), { status: 201 }), requestId)
  } catch (error) { return guestErrorResponse(error, requestId) }
}
