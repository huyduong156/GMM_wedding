import { Prisma, type PrismaClient, type SystemRole } from '@prisma/client'

import type {
  AuthenticatedSession,
  IdentityRepository,
  IdentityUser,
} from '@/modules/identity/application/ports'

const userSelection = {
  id: true,
  email: true,
  passwordHash: true,
  displayName: true,
  emailVerifiedAt: true,
  locale: true,
  timezone: true,
  status: true,
  roles: {
    select: { role: true, expiresAt: true, revokedAt: true },
  },
} satisfies Prisma.UserSelect

type SelectedUser = Prisma.UserGetPayload<{ select: typeof userSelection }>

function toIdentityUser(user: SelectedUser, now = new Date()): IdentityUser {
  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    displayName: user.displayName,
    emailVerifiedAt: user.emailVerifiedAt,
    locale: user.locale,
    timezone: user.timezone,
    status: user.status,
    roles: user.roles
      .filter((item) => !item.revokedAt && (!item.expiresAt || item.expiresAt > now))
      .map((item) => item.role as SystemRole),
  }
}

export class PrismaIdentityRepository implements IdentityRepository {
  constructor(private readonly db: PrismaClient) {}

  async findUserByEmail(email: string) {
    const user = await this.db.user.findUnique({ where: { email }, select: userSelection })
    return user ? toIdentityUser(user) : null
  }

  async updatePasswordHash(userId: string, passwordHash: string) {
    await this.db.user.update({ where: { id: userId }, data: { passwordHash } })
  }

  async registerUser(input: {
    email: string
    passwordHash: string
    displayName?: string
    tokenHash: string
    tokenExpiresAt: Date
    encryptedToken: string
  }) {
    try {
      return await this.db.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { email: input.email }, select: { id: true } })
      if (existing) return { created: false }

      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash: input.passwordHash,
          ...(input.displayName ? { displayName: input.displayName } : {}),
        },
        select: { id: true },
      })
      await tx.verificationToken.create({
        data: {
          identifier: input.email,
          purpose: 'EMAIL_VERIFICATION',
          tokenHash: input.tokenHash,
          expiresAt: input.tokenExpiresAt,
        },
      })
      const outbox = await tx.outboxEvent.create({
        data: {
          aggregateType: 'User',
          aggregateId: user.id,
          eventType: 'IdentityVerificationEmailRequestedV1',
          payload: {
            userId: user.id,
            encryptedToken: input.encryptedToken,
            expiresAt: input.tokenExpiresAt.toISOString(),
          },
        },
        select: { id: true },
      })
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'identity.registered',
          resourceType: 'User',
          resourceId: user.id,
        },
      })
        return { created: true, userId: user.id, outboxId: outbox.id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return { created: false }
      }
      throw error
    }
  }

  async verifyEmail(tokenHash: string, now: Date) {
    return this.db.$transaction(async (tx) => {
      const token = await tx.verificationToken.findUnique({ where: { tokenHash } })
      if (!token || token.purpose !== 'EMAIL_VERIFICATION' || token.usedAt || token.expiresAt <= now) {
        return false
      }
      const claimed = await tx.verificationToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      })
      if (claimed.count !== 1) return false

      const user = await tx.user.update({
        where: { email: token.identifier },
        data: { emailVerifiedAt: now, status: 'ACTIVE' },
        select: { id: true },
      })
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'identity.email_verified',
          resourceType: 'User',
          resourceId: user.id,
        },
      })
      return true
    })
  }

  async createVerificationResend(input: {
    userId: string
    email: string
    tokenHash: string
    tokenExpiresAt: Date
    encryptedToken: string
  }) {
    return this.db.$transaction(async (tx) => {
      const now = new Date()
      const pendingUser = await tx.user.findFirst({
        where: {
          id: input.userId,
          email: input.email,
          status: 'PENDING_VERIFICATION',
          emailVerifiedAt: null,
          passwordHash: { not: null },
        },
        select: { id: true },
      })
      if (!pendingUser) return { created: false }
      await tx.verificationToken.updateMany({
        where: { identifier: input.email, purpose: 'EMAIL_VERIFICATION', usedAt: null },
        data: { usedAt: now },
      })
      await tx.verificationToken.create({
        data: {
          identifier: input.email,
          purpose: 'EMAIL_VERIFICATION',
          tokenHash: input.tokenHash,
          expiresAt: input.tokenExpiresAt,
        },
      })
      const outbox = await tx.outboxEvent.create({
        data: {
          aggregateType: 'User',
          aggregateId: input.userId,
          eventType: 'IdentityVerificationEmailRequestedV1',
          payload: {
            userId: input.userId,
            encryptedToken: input.encryptedToken,
            expiresAt: input.tokenExpiresAt.toISOString(),
          },
        },
        select: { id: true },
      })
      await tx.auditLog.create({
        data: {
          actorUserId: input.userId,
          action: 'identity.verification_resent',
          resourceType: 'User',
          resourceId: input.userId,
        },
      })
      return { created: true, outboxId: outbox.id }
    })
  }

  async createPasswordReset(input: {
    userId: string
    email: string
    tokenHash: string
    tokenExpiresAt: Date
    encryptedToken: string
  }) {
    return this.db.$transaction(async (tx) => {
      const now = new Date()
      await tx.verificationToken.updateMany({
        where: { identifier: input.email, purpose: 'PASSWORD_RESET', usedAt: null },
        data: { usedAt: now },
      })
      await tx.verificationToken.create({
        data: { identifier: input.email, purpose: 'PASSWORD_RESET', tokenHash: input.tokenHash, expiresAt: input.tokenExpiresAt },
      })
      const outbox = await tx.outboxEvent.create({
        data: {
          aggregateType: 'User', aggregateId: input.userId,
          eventType: 'IdentityPasswordResetEmailRequestedV1',
          payload: { userId: input.userId, encryptedToken: input.encryptedToken, expiresAt: input.tokenExpiresAt.toISOString() },
        },
        select: { id: true },
      })
      await tx.auditLog.create({
        data: { actorUserId: input.userId, action: 'identity.password_reset_requested', resourceType: 'User', resourceId: input.userId },
      })
      return { outboxId: outbox.id }
    })
  }

  async resetPassword(tokenHash: string, passwordHash: string, now: Date) {
    return this.db.$transaction(async (tx) => {
      const token = await tx.verificationToken.findUnique({ where: { tokenHash } })
      if (!token || token.purpose !== 'PASSWORD_RESET' || token.usedAt || token.expiresAt <= now) return false
      const user = await tx.user.findUnique({
        where: { email: token.identifier },
        select: { id: true, status: true, roles: { where: { role: 'ADMIN', revokedAt: null }, select: { expiresAt: true } } },
      })
      if (!user || user.status !== 'ACTIVE' || user.roles.some((role) => !role.expiresAt || role.expiresAt > now)) return false
      const claimed = await tx.verificationToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now },
      })
      if (claimed.count !== 1) return false
      await tx.user.update({ where: { id: user.id }, data: { passwordHash } })
      await tx.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: now } })
      await tx.verificationToken.updateMany({
        where: { identifier: token.identifier, purpose: 'PASSWORD_RESET', usedAt: null }, data: { usedAt: now },
      })
      await tx.auditLog.create({
        data: { actorUserId: user.id, action: 'identity.password_reset_completed', resourceType: 'User', resourceId: user.id },
      })
      return true
    })
  }

  async createSession(input: {
    userId: string
    sessionHash: string
    expiresAt: Date
    ipHash?: string
    userAgent?: string
  }) {
    return this.db.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          userId: input.userId,
          sessionHash: input.sessionHash,
          expiresAt: input.expiresAt,
          ...(input.ipHash ? { ipHash: input.ipHash } : {}),
          ...(input.userAgent ? { userAgent: input.userAgent.slice(0, 512) } : {}),
        },
        select: { id: true },
      })
      await tx.user.update({ where: { id: input.userId }, data: { lastLoginAt: new Date() } })
      return session.id
    })
  }

  async findSession(sessionHash: string, now: Date): Promise<AuthenticatedSession | null> {
    const session = await this.db.session.findUnique({
      where: { sessionHash },
      select: {
        id: true,
        expiresAt: true,
        lastSeenAt: true,
        revokedAt: true,
        user: { select: userSelection },
      },
    })
    if (!session) return null
    return { ...session, user: toIdentityUser(session.user, now) }
  }

  async touchSession(sessionId: string, seenBefore: Date, now: Date) {
    await this.db.session.updateMany({
      where: { id: sessionId, revokedAt: null, lastSeenAt: { lte: seenBefore } },
      data: { lastSeenAt: now },
    })
  }

  async revokeSession(sessionHash: string, now: Date) {
    await this.db.session.updateMany({ where: { sessionHash, revokedAt: null }, data: { revokedAt: now } })
  }

  async markOutboxCompleted(outboxId: string, now: Date) {
    await this.db.outboxEvent.update({
      where: { id: outboxId },
      data: { status: 'COMPLETED', processedAt: now, attempts: { increment: 1 } },
    })
  }
}
