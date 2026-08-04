import { createHmac } from 'node:crypto'

import { createClient, type RedisClientType } from 'redis'

import type { RateLimiter } from '@/modules/identity/application/ports'

type Bucket = { count: number; resetAt: number }

export function rateLimitKey(secret: string, scope: string, value: string): string {
  const digest = createHmac('sha256', secret).update(value, 'utf8').digest('hex')
  return `auth:${scope}:${digest}`
}

export class MemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>()

  async consume(key: string, limit: number, windowSeconds: number) {
    const now = Date.now()
    const current = this.buckets.get(key)
    const bucket = !current || current.resetAt <= now
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
  }

  private async connect() {
    if (!this.client.isOpen) {
      this.connecting ??= this.client.connect().finally(() => { this.connecting = undefined })
      await this.connecting
    }
  }

  async consume(key: string, limit: number, windowSeconds: number) {
    await this.connect()
    const result = await this.client.eval(
      `local count = redis.call('INCR', KEYS[1])
       if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
       local ttl = redis.call('TTL', KEYS[1])
       return {count, ttl}`,
      { keys: [key], arguments: [String(windowSeconds)] },
    ) as [number, number]
    return { allowed: result[0] <= limit, retryAfter: Math.max(1, result[1]) }
  }
}
