import { googleStart } from '@/platform/auth/google-oauth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return googleStart()
  } catch {
    return new Response('Google login is not configured', { status: 404 })
  }
}
