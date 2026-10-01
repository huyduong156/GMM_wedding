import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { log, logDatabaseQuery } from '@/shared/observability/logger'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

function createPrismaClient() {
  const queryLogging = process.env.DATABASE_QUERY_LOGGING === 'true'
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const client = new PrismaClient({
    adapter,
    log: queryLogging
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ]
      : [
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ],
  })

  client.$on('warn', (event) =>
    log('warn', 'Prisma warning', { message: event.message, target: event.target }),
  )
  client.$on('error', (event) =>
    log('error', 'Prisma error', { message: event.message, target: event.target }),
  )
  if (queryLogging) {
    client.$on('query', (event) => {
      logDatabaseQuery({
        query: event.query,
        params: event.params,
        durationMs: event.duration,
        target: event.target,
      })
    })
  }
  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
globalForPrisma.prisma = prisma
