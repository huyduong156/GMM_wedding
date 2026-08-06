import type { NextRequest } from 'next/server'
import { optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGuestService } from '@/modules/guests'
import { guestErrorResponse } from '@/modules/guests/interface/guest-http'
import { getRequestId } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const OPTIONS = optionsResponse; type Context = { params: Promise<{ weddingId: string }> }
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { const { actor } = await requireAuthenticatedUser(request); const weddingId = weddingIdSchema.parse((await context.params).weddingId); const csv = await getGuestService().exportCsv(actor, weddingId); const response = new Response(csv, { status: 200, headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="guest-list-${weddingId}.csv"`, 'cache-control': 'no-store' } }); return withAuthHeaders(response, requestId) } catch (e) { return guestErrorResponse(e, requestId) } }
