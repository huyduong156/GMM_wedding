import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packageRoot = dirname(require.resolve('swagger-ui-dist/package.json'))
const targetRoot = join(process.cwd(), 'public', 'swagger-ui-assets')

await mkdir(targetRoot, { recursive: true })
await Promise.all([
  copyFile(join(packageRoot, 'swagger-ui.css'), join(targetRoot, 'swagger-ui.css')),
  copyFile(join(packageRoot, 'swagger-ui-bundle.js'), join(targetRoot, 'swagger-ui-bundle.js')),
])
