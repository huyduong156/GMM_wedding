import type { NextRequest } from "next/server"
import { getWeddingService } from "@/modules/weddings"
import { weddingErrorResponse } from "@/modules/weddings/interface/wedding-http"
import { optionsResponse, withApiHeaders } from "@/modules/identity/interface/auth-http"
import { getRequestId, jsonResponse } from "@/shared/http/api-response"

type Context = { params: Promise<{ weddingSlug: string }> }
export const dynamic = "force-dynamic"
export const OPTIONS = optionsResponse

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  const weddingSlug = (await context.params).weddingSlug
  try {
    const snapshot = await getWeddingService().publicSnapshot(weddingSlug, "ONLINE_INVITATION")
    return withApiHeaders(jsonResponse({ snapshot }, { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } }), requestId)
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}