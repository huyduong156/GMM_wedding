import { log } from '@/shared/observability/logger'

export function register() {
  process.on('uncaughtException', (error) => log('fatal', 'Unhandled backend exception', { error }))
  process.on('unhandledRejection', (error) => log('fatal', 'Unhandled backend promise rejection', { error }))
}
