import type { SystemRole, UserStatus } from '@prisma/client'

export type IdentityUser = {
  id: string
  email: string
  passwordHash: string | null
  displayName: string | null
  emailVerifiedAt: Date | null
  locale: string
  timezone: string
  status: UserStatus
  roles: SystemRole[]
}

export type AuthenticatedSession = {
  id: string
  user: IdentityUser
  expiresAt: Date
  lastSeenAt: Date
  revokedAt: Date | null
}

export interface PasswordHasher {
  hash(password: string): Promise<string>
  verify(hash: string, password: string): Promise<boolean>
  verifyDummy(password: string): Promise<void>
  needsRehash(hash: string): boolean
}

export interface RateLimiter {
  consume(key: string, limit: number, windowSeconds: number): Promise<{
    allowed: boolean
    retryAfter: number
  }>
}

export interface VerificationEmailSender {
  sendVerificationEmail(input: { email: string; token: string; expiresAt: Date }): Promise<void>
}

export interface IdentityRepository {
  findUserByEmail(email: string): Promise<IdentityUser | null>
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>
  registerUser(input: {
    email: string
    passwordHash: string
    displayName?: string
    tokenHash: string
    tokenExpiresAt: Date
    encryptedToken: string
  }): Promise<{ created: boolean; userId?: string; outboxId?: string }>
  verifyEmail(tokenHash: string, now: Date): Promise<boolean>
  createSession(input: {
    userId: string
    sessionHash: string
    expiresAt: Date
    ipHash?: string
    userAgent?: string
  }): Promise<string>
  findSession(sessionHash: string, now: Date): Promise<AuthenticatedSession | null>
  touchSession(sessionId: string, seenBefore: Date, now: Date): Promise<void>
  revokeSession(sessionHash: string, now: Date): Promise<void>
  markOutboxCompleted(outboxId: string, now: Date): Promise<void>
}
