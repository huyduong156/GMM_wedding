import { createHmac } from 'node:crypto'

import { createClient, type RedisClientType } from 'redis'

import type { RateLimiter } from '@/modules/identity/application/ports'
import { log } from '@/shared/observability/logger'

const REDIS_OPERATION_TIMEOUT_MS = 2_000

type Bucket = { count: number; resetAt: number }

export function rateLimitKey(secret: string, scope: string, value: string): string {
  const digest = createHmac('sha256', secret).update(value, 'utf8').digest('hex')
  return `auth:${scope}:${digest}`
}

export class DisabledRateLimiter implements RateLimiter {
  async consume() {
    return { allowed: true, retryAfter: 0 }
  }
}

export class MemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>()

  async consume(key: string, limit: number, windowSeconds: number) {
    const now = Date.now()
    const current = this.buckets.get(key)
    const bucket =
      !current || current.resetAt <= now
        ? { count: 0, resetAt: now + windowSeconds * 1_000 }
        : current
    bucket.count += 1
    this.buckets.set(key, bucket)
    return {
      allowed: bucket.count <= limit,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
    }
  }
}

export class RedisRateLimiter implements RateLimiter {
  private readonly client: RedisClientType
  private connecting: Promise<unknown> | undefined

  constructor(url: string) {
    this.client = createClient({ url })
    this.client.on('error', (error) => {
      log('error', 'Redis rate limiter client error', { error })
    })
  }

  private async connect() {
    if (this.client.isReady) return

    this.connecting ??= (async () => {
      try {
        // isOpen only means that a socket lifecycle exists. A client can remain
        // open while its connection is no longer ready to accept commands.
        if (this.client.isOpen) this.client.destroy()
        await this.withTimeout(this.client.connect())
        await this.withTimeout(this.client.ping())
      } catch (error) {
        this.client.destroy()
        throw error
      }
    })().finally(() => {
      this.connecting = undefined
    })
    await this.connecting
  }

  private async withTimeout<T>(operation: Promise<T>) {
    let timeout: ReturnType<typeof setTimeout> | undefined
    try {
      return await Promise.race([
        operation,
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Redis rate limiter operation timed out')),
            REDIS_OPERATION_TIMEOUT_MS,
          )
        }),
      ])
    } finally {
      if (timeout) clearTimeout(timeout)
    }
  }

  async healthCheck() {
    await this.connect()
  }

  async consume(key: string, limit: number, windowSeconds: number) {
    await this.connect()
    try {
      const result = (await this.withTimeout(
        this.client.eval(
          `local count = redis.call('INCR', KEYS[1])
           if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
           local ttl = redis.call('TTL', KEYS[1])
           return {count, ttl}`,
          { keys: [key], arguments: [String(windowSeconds)] },
        ),
      )) as [number, number]
      return { allowed: result[0] <= limit, retryAfter: Math.max(1, result[1]) }
    } catch (error) {
      this.client.destroy()
      throw error
    }
  }
}
