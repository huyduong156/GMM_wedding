import { createHmac } from 'node:crypto'

import type {
  IdentityRepository,
  IdentityUser,
  PasswordHasher,
  RateLimiter,
  IdentityEmailSender,
} from './ports'
import type { SystemRole } from '@prisma/client'
import { AuthError } from '../domain/auth-error'
import { normalizeEmail } from '../domain/normalize-email'
import { createOpaqueToken, hashOpaqueToken } from '@/platform/auth/opaque-token'
import {
  SESSION_ABSOLUTE_TTL_SECONDS,
  SESSION_IDLE_TTL_SECONDS,
} from '@/platform/auth/session-policy'
import type { TokenProtector } from '@/platform/auth/token-protector'
import { rateLimitKey } from '@/platform/auth/rate-limiter'

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1_000
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1_000
const SESSION_TOUCH_INTERVAL_MS = 5 * 60 * 1_000

export type PublicUser = Omit<IdentityUser, 'passwordHash'>

function publicUser(user: IdentityUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    emailVerifiedAt: user.emailVerifiedAt,
    locale: user.locale,
    timezone: user.timezone,
    status: user.status,
    roles: user.roles,
  }
}

export class AuthService {
  constructor(
    private readonly repository: IdentityRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly rateLimiter: RateLimiter,
    private readonly emailSender: IdentityEmailSender,
    private readonly tokenProtector: TokenProtector,
    private readonly rateLimitSecret: string,
  ) {}

  private async limit(scope: string, value: string, max: number, windowSeconds: number) {
    const result = await this.rateLimiter.consume(
      rateLimitKey(this.rateLimitSecret, scope, value || 'unknown'),
      max,
      windowSeconds,
    )
    if (!result.allowed) {
      throw new AuthError('RATE_LIMITED', 429, 'Too many requests', result.retryAfter)
    }
  }

  async register(input: { email: string; password: string; displayName?: string }, ip: string) {
    const email = normalizeEmail(input.email)
    await Promise.all([
      this.limit('register-ip', ip, 5, 60 * 60),
      this.limit('register-email', email, 3, 60 * 60),
    ])
    if (await this.repository.findUserByEmail(email)) return

    const passwordHash = await this.passwordHasher.hash(input.password)
    const token = createOpaqueToken()
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS)
    const result = await this.repository.registerUser({
      email,
      passwordHash,
      ...(input.displayName ? { displayName: input.displayName.trim() } : {}),
      tokenHash: hashOpaqueToken(token),
      tokenExpiresAt: expiresAt,
      encryptedToken: this.tokenProtector.encrypt(token),
    })
    if (!result.created || !result.outboxId) return

    try {
      await this.emailSender.sendVerificationEmail({ email, token, expiresAt })
      await this.repository.markOutboxCompleted(result.outboxId, new Date())
    } catch {
      // The durable outbox event remains pending for a retry worker.
    }
  }

  async verifyEmail(token: string, ip: string) {
    await this.limit('verify-ip', ip, 20, 60 * 60)
    const verified = await this.repository.verifyEmail(hashOpaqueToken(token), new Date())
    if (!verified) {
      throw new AuthError('INVALID_VERIFICATION_TOKEN', 400, 'Verification token is invalid or expired')
    }
  }

  async resendVerification(emailInput: string, ip: string) {
    const email = normalizeEmail(emailInput)
    await Promise.all([
      this.limit('resend-verification-ip', ip, 5, 60 * 60),
      this.limit('resend-verification-email', email, 3, 60 * 60),
    ])
    const user = await this.repository.findUserByEmail(email)
    if (!user?.passwordHash || user.status !== 'PENDING_VERIFICATION' || user.emailVerifiedAt) return

    const token = createOpaqueToken()
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS)
    const result = await this.repository.createVerificationResend({
      userId: user.id,
      email,
      tokenHash: hashOpaqueToken(token),
      tokenExpiresAt: expiresAt,
      encryptedToken: this.tokenProtector.encrypt(token),
    })
    if (!result.created || !result.outboxId) return
    try {
      await this.emailSender.sendVerificationEmail({ email, token, expiresAt })
      await this.repository.markOutboxCompleted(result.outboxId, new Date())
    } catch {
      // The durable outbox event remains pending for a retry worker.
    }
  }

  async forgotPassword(emailInput: string, ip: string) {
    const email = normalizeEmail(emailInput)
    await Promise.all([
      this.limit('forgot-password-ip', ip, 10, 60 * 60),
      this.limit('forgot-password-email', email, 3, 60 * 60),
    ])
    const user = await this.repository.findUserByEmail(email)
    if (!user?.passwordHash || user.status !== 'ACTIVE' || user.roles.includes('ADMIN')) return

    const token = createOpaqueToken()
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS)
    const result = await this.repository.createPasswordReset({
      userId: user.id,
      email,
      tokenHash: hashOpaqueToken(token),
      tokenExpiresAt: expiresAt,
      encryptedToken: this.tokenProtector.encrypt(token),
    })
    try {
      await this.emailSender.sendPasswordResetEmail({ email, token, expiresAt })
      await this.repository.markOutboxCompleted(result.outboxId, new Date())
    } catch {
      // The durable outbox event remains pending for a retry worker.
    }
  }

  async resetPassword(token: string, password: string, ip: string) {
    await this.limit('reset-password-ip', ip, 10, 60 * 60)
    const passwordHash = await this.passwordHasher.hash(password)
    const reset = await this.repository.resetPassword(hashOpaqueToken(token), passwordHash, new Date())
    if (!reset) {
      throw new AuthError('INVALID_PASSWORD_RESET_TOKEN', 400, 'Password reset token is invalid or expired')
    }
  }

  async login(
    input: { email: string; password: string },
    context: { ip: string; userAgent?: string },
    requiredRole?: SystemRole,
  ) {
    const email = normalizeEmail(input.email)
    await Promise.all([
      this.limit('login-ip', context.ip, 10, 15 * 60),
      this.limit('login-email', email, 5, 15 * 60),
    ])
    const user = await this.repository.findUserByEmail(email)
    if (!user?.passwordHash) {
      await this.passwordHasher.verifyDummy(input.password)
      throw new AuthError('INVALID_CREDENTIALS', 401, 'Email or password is incorrect')
    }

    const valid = await this.passwordHasher.verify(user.passwordHash, input.password)
    if (!valid) throw new AuthError('INVALID_CREDENTIALS', 401, 'Email or password is incorrect')
    if (user.status === 'PENDING_VERIFICATION' || !user.emailVerifiedAt) {
      throw new AuthError('EMAIL_VERIFICATION_REQUIRED', 403, 'Email verification is required')
    }
    if (user.status !== 'ACTIVE') {
      throw new AuthError('ACCOUNT_SUSPENDED', 403, 'Account is not active')
    }
    if (requiredRole && !user.roles.includes(requiredRole)) {
      throw new AuthError('ADMIN_ACCESS_REQUIRED', 403, 'This account cannot access the administration portal')
    }
    if (this.passwordHasher.needsRehash(user.passwordHash)) {
      await this.repository.updatePasswordHash(user.id, await this.passwordHasher.hash(input.password))
    }

    const token = createOpaqueToken()
    const expiresAt = new Date(Date.now() + SESSION_ABSOLUTE_TTL_SECONDS * 1_000)
    const sessionId = await this.repository.createSession({
      userId: user.id,
      sessionHash: hashOpaqueToken(token),
      expiresAt,
      ipHash: createHmac('sha256', this.rateLimitSecret).update(context.ip).digest('hex'),
      ...(context.userAgent ? { userAgent: context.userAgent } : {}),
    })
    return { token, expiresAt, sessionId, user: publicUser(user) }
  }

  async authenticate(token: string | undefined) {
    if (!token) throw new AuthError('AUTHENTICATION_REQUIRED', 401, 'Authentication is required')
    const now = new Date()
    const session = await this.repository.findSession(hashOpaqueToken(token), now)
    const idleExpiresAt = session
      ? session.lastSeenAt.getTime() + SESSION_IDLE_TTL_SECONDS * 1_000
      : 0
    if (!session || session.revokedAt || session.expiresAt <= now || idleExpiresAt <= now.getTime()) {
      throw new AuthError('SESSION_EXPIRED', 401, 'Session is invalid or expired')
    }
    if (session.user.status !== 'ACTIVE') {
      throw new AuthError('ACCOUNT_SUSPENDED', 403, 'Account is not active')
    }
    await this.repository.touchSession(
      session.id,
      new Date(now.getTime() - SESSION_TOUCH_INTERVAL_MS),
      now,
    )
    return { sessionId: session.id, user: publicUser(session.user) }
  }

  async logout(token: string | undefined) {
    if (token) await this.repository.revokeSession(hashOpaqueToken(token), new Date())
  }
}
