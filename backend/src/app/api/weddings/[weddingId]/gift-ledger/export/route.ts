import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getGiftLedgerService } from '@/modules/gift-ledger'
import { giftLedgerErrorResponse } from '@/modules/gift-ledger/interface/gift-ledger-http'
import { giftDateQuerySchema } from '@/modules/gift-ledger/interface/gift-ledger-schemas'
import { getRequestId } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ weddingId: string }> }
export const OPTIONS = optionsResponse
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const weddingId = weddingIdSchema.parse((await context.params).weddingId)
    const filter = giftDateQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    const csv = await getGiftLedgerService().exportCsv(actor, weddingId, filter)
    return withApiHeaders(
      new Response(csv, {
        status: 200,
        headers: {
          'content-type': 'text/csv; charset=utf-8',
          'content-disposition': `attachment; filename="gift-ledger-${weddingId}.csv"`,
          'cache-control': 'no-store',
        },
      }),
      requestId,
    )
  } catch (error) {
    return giftLedgerErrorResponse(error, requestId)
  }
}
