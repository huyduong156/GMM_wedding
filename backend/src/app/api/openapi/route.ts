import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { getServerEnv } from '@/platform/config/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!getServerEnv().API_DOCS_ENABLED) return new Response('Not found', { status: 404 })
  const specification = await readFile(join(process.cwd(), 'openapi', 'openapi.yaml'), 'utf8')
  return new Response(specification, {
    headers: {
      'content-type': 'application/yaml; charset=utf-8',
      'cache-control': 'no-store',
      'content-disposition': 'inline; filename="gmm-wedding-openapi.yaml"',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
    },
  })
}
