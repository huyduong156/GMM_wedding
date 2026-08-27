export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
const priorities: Record<LogLevel, number> = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 }

function shouldLog(level: LogLevel) {
  const configured = (process.env.LOG_LEVEL as LogLevel | undefined) ?? 'info'
  return priorities[level] <= (priorities[configured] ?? priorities.info)
}

function write(level: LogLevel, output: string) {
  if (level === 'fatal' || level === 'error') console.error(output)
  else if (level === 'warn') console.warn(output)
  else console.info(output)
}

export function serializeError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) return { value: error }
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause instanceof Error ? serializeError(error.cause) : error.cause,
  }
}

export function log(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  if (!shouldLog(level)) return
  const payload = Object.fromEntries(Object.entries(context).map(([key, value]) => [key, value instanceof Error ? serializeError(value) : value]))
  const output = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${Object.keys(payload).length ? ` ${JSON.stringify(payload)}` : ''}`
  write(level, output)
}

function localTimestamp(date = new Date()) {
  const pad = (value: number, size = 2) => String(value).padStart(size, '0')
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export interface HttpAccessLog {
  requestId: string
  method: string
  path: string
  status: number
  durationMs: number
  ip: string
}

export function logHttpAccess(event: HttpAccessLog) {
  if (!shouldLog('info') || process.env.ACCESS_LOGGING === 'false') return
  const status = String(event.status).padStart(3)
  const duration = `${event.durationMs.toFixed(3)}ms`.padStart(12)
  write('info', `[HTTP] ${localTimestamp()} | ${status} | ${duration} | ${event.ip.padStart(15)} | ${event.method.padEnd(7)} "${event.path}" requestId=${event.requestId}`)
}

function formatParams(params: string) {
  if (process.env.DATABASE_QUERY_LOG_PARAMS !== 'true') return 'params=[redacted]'
  if (params.length > 2_000) return `params=${params.slice(0, 2_000)}...`
  return `params=${params}`
}

export interface DatabaseQueryLog {
  query: string
  params: string
  durationMs: number
  target?: string
}

export function logDatabaseQuery(event: DatabaseQueryLog) {
  if (!shouldLog('debug')) return
  const source = event.target ? `prisma:${event.target}` : 'prisma:query'
  write('debug', `${localTimestamp()} ${source}\n[${event.durationMs.toFixed(3)}ms] ${event.query}\n${formatParams(event.params)}`)
}

export function logHttpError(error: unknown, context: Record<string, unknown>) {
  log('error', 'HTTP request failed', { ...context, error })
}
