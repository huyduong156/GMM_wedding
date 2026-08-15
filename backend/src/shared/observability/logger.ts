type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
const priorities: Record<LogLevel, number> = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 }
export function log(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  const configured = (process.env.LOG_LEVEL as LogLevel | undefined) ?? 'info'
  if (priorities[level] > (priorities[configured] ?? priorities.info)) return
  const payload = Object.fromEntries(Object.entries(context).map(([key, value]) => [key, value instanceof Error ? { name: value.name, message: value.message, stack: value.stack } : value]))
  const output = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${Object.keys(payload).length ? ` ${JSON.stringify(payload)}` : ''}`
  if (level === 'fatal' || level === 'error') console.error(output)
  else if (level === 'warn') console.warn(output)
  else console.info(output)
}
export function logHttpError(error: unknown, context: Record<string, unknown>) { log('error', 'HTTP request failed', { ...context, error }) }
