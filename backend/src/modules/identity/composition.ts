import { AuthService } from './application/auth-service'
import { PrismaIdentityRepository } from './infrastructure/prisma-identity-repository'
import { SmtpVerificationEmailSender } from './infrastructure/smtp-verification-email-sender'
import { ArgonPasswordHasher } from '@/platform/auth/password-hasher'
import {
  DisabledRateLimiter,
  MemoryRateLimiter,
  RedisRateLimiter,
} from '@/platform/auth/rate-limiter'
import { TokenProtector } from '@/platform/auth/token-protector'
import { getServerEnv } from '@/platform/config/env'
import { prisma } from '@/platform/database/prisma'
import type { RateLimiter } from './application/ports'

let authService: AuthService | undefined
let rateLimiter: RateLimiter | undefined

export function getAuthRateLimiter(): RateLimiter {
  if (rateLimiter) return rateLimiter
  const env = getServerEnv()
  rateLimiter =
    env.AUTH_RATE_LIMIT_DRIVER === 'redis'
      ? new RedisRateLimiter(env.REDIS_URL as string)
      : env.AUTH_RATE_LIMIT_DRIVER === 'disabled'
        ? new DisabledRateLimiter()
        : new MemoryRateLimiter()
  return rateLimiter
}

export function getAuthService(): AuthService {
  if (authService) return authService
  const env = getServerEnv()

  authService = new AuthService(
    new PrismaIdentityRepository(prisma),
    new ArgonPasswordHasher(),
    getAuthRateLimiter(),
    new SmtpVerificationEmailSender(
      env.SMTP_HOST,
      env.SMTP_PORT,
      env.SMTP_SECURE,
      env.SMTP_FROM,
      env.APP_ORIGIN,
      ...(env.SMTP_USER && env.SMTP_PASSWORD
        ? [{ user: env.SMTP_USER, password: env.SMTP_PASSWORD }]
        : []),
    ),
    new TokenProtector(env.AUTH_TOKEN_ENCRYPTION_KEY),
    env.AUTH_RATE_LIMIT_SECRET,
  )
  return authService
}
