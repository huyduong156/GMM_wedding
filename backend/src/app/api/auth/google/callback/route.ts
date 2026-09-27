import { applyGoogleCookies, googleCallback, googleErrorRedirect } from '@/platform/auth/google-oauth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const result = await googleCallback(request)
    return applyGoogleCookies(Response.redirect(result.redirect), result.token)
  } catch {
    return googleErrorRedirect()
  }
}
