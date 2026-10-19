import { NextResponse, type NextRequest } from 'next/server'
import { getWeddingService } from '@/modules/weddings'
import { PublicShareImageService } from '@/modules/weddings/application/public-share-image'
import { weddingErrorResponse } from '@/modules/weddings/interface/wedding-http'
import { getObjectStorage } from '@/platform/storage/composition'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { getRequestId } from '@/shared/http/api-response'

type Context = { params: Promise<{ weddingSlug: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse

let shareImageService: PublicShareImageService | undefined

export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  const { weddingSlug } = await context.params
  try {
    const snapshot = await getWeddingService().publicSnapshot(weddingSlug, 'ONLINE_INVITATION')
    shareImageService ??= new PublicShareImageService(getObjectStorage())
    const image = await shareImageService.jpegFromPublicUrl(snapshot.ownerAvatarUrl)
    if (!image) return withApiHeaders(new NextResponse(null, { status: 404 }), requestId)
    const body = new Uint8Array(new ArrayBuffer(image.byteLength))
    body.set(image)

    return withApiHeaders(
      new NextResponse(body, {
        headers: {
          'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          'content-type': 'image/jpeg',
          'x-robots-tag': 'noindex',
        },
      }),
      requestId,
    )
  } catch (error) {
    return weddingErrorResponse(error, requestId)
  }
}
