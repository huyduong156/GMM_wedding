import type { NextRequest } from 'next/server'
import { getPublicInteractionService } from '@/modules/public-interactions'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
type Context = { params: Promise<{ invitationToken: string }> }
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const token = (await context.params).invitationToken
    return jsonResponse(await getPublicInteractionService().resolveToken(token))
  } catch (error) { return guestErrorResponse(error, requestId) }
}
