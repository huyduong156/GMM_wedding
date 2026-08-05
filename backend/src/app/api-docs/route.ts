import { getServerEnv } from '@/platform/config/env'

export const dynamic = 'force-dynamic'

const contentSecurityPolicy = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')

const html = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="referrer" content="no-referrer" />
    <title>GMM Wedding API Docs</title>
    <link rel="stylesheet" href="/swagger-ui-assets/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="/swagger-ui-assets/swagger-ui-bundle.js"></script>
    <script src="/swagger-initializer.js"></script>
  </body>
</html>`

export function GET() {
  if (!getServerEnv().API_DOCS_ENABLED) return new Response('Not found', { status: 404 })
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy': contentSecurityPolicy,
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
    },
  })
}
