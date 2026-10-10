import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[startup] DATABASE_URL is required before starting the web server')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
const timeoutMs = Number(process.env.STARTUP_DATABASE_TIMEOUT_MS ?? 10_000)
let timeoutHandle
const timeout = new Promise((_, reject) => {
  timeoutHandle = setTimeout(
    () => reject(new Error(`database preflight timed out after ${timeoutMs}ms`)),
    timeoutMs,
  )
})

try {
  await Promise.race([
    client.connect().then(() => client.query('SELECT 1')),
    timeout,
  ])
  console.log('[startup] database preflight passed; starting web server')
} catch (error) {
  const message = error instanceof Error ? error.message : 'unknown database preflight error'
  console.error(`[startup] database preflight failed; web server will not start: ${message}`)
  process.exitCode = 1
} finally {
  clearTimeout(timeoutHandle)
  await client.end().catch(() => undefined)
}

if (process.exitCode === 1) {
  process.exit(1)
}

await import('../server.js')
