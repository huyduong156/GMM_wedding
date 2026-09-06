import type { NextRequest } from 'next/server'
import { FakeObjectStorage } from '@/platform/storage/fake-object-storage'
type Context = { params: Promise<{ key: string[] }> }
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest, context: Context) {
  try {
    const key = (await context.params).key.join('/')
    const body = await new FakeObjectStorage().read(key)
    const type = key.endsWith('.mp3') ? 'audio/mpeg' : key.endsWith('.wav') ? 'audio/wav' : key.endsWith('.ogg') ? 'audio/ogg' : key.endsWith('.m4a') ? 'audio/mp4' : key.endsWith('.aac') ? 'audio/aac' : key.endsWith('.png') ? 'image/png' : key.endsWith('.webp') ? 'image/webp' : key.endsWith('.gif') ? 'image/gif' : 'image/jpeg'
    return new Response(body, {
      headers: { 'content-type': type, 'cache-control': 'public, max-age=31536000, immutable' },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
