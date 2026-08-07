import type { NextRequest } from 'next/server'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { assertSafeMutation, optionsResponse, parseJson, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { wishSchema } from '@/modules/public-interactions/public-schemas'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
type Context = { params: Promise<{ slug: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { return jsonResponse(await getPublicInteractionService().approvedWishes((await context.params).slug)) } catch (error) { return guestErrorResponse(error, requestId) }
}
export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try { assertSafeMutation(request); return withAuthHeaders(jsonResponse(await getPublicInteractionService().submitWish((await context.params).slug, await parseJson(request, wishSchema)), { status: 201 }), requestId) } catch (error) { return guestErrorResponse(error, requestId) }
}
