import { createOpaqueToken, hashOpaqueToken } from '@/platform/auth/opaque-token'
import { TokenProtector } from '@/platform/auth/token-protector'
import { normalizeEmail } from '../domain/normalize-email'
import { AdminUserError } from '../domain/admin-user-error'
import type { IdentityEmailSender } from './ports'
import type { PrismaClient } from '@prisma/client'

const INVITE_TTL_MS = 30 * 60 * 1_000

export class AdminInviteService {
  constructor(private readonly db: PrismaClient, private readonly emailSender: IdentityEmailSender, private readonly tokenProtector: TokenProtector) {}
  async invite(actorUserId: string, input: { email: string; displayName?: string | undefined }, requestId?: string) {
    const email = normalizeEmail(input.email)
    const token = createOpaqueToken()
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS)
    const result = await this.db.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { email }, select: { id: true, deletedAt: true } })
      if (existing) throw new AdminUserError('USER_EMAIL_EXISTS', 409, 'An account with this email already exists')
      const user = await tx.user.create({ data: { email, ...(input.displayName ? { displayName: input.displayName.trim() } : {}), status: 'ACTIVE', emailVerifiedAt: new Date() }, select: { id: true } })
      await tx.verificationToken.create({ data: { identifier: email, purpose: 'PASSWORD_RESET', tokenHash: hashOpaqueToken(token), expiresAt } })
      const outbox = await tx.outboxEvent.create({ data: { aggregateType: 'User', aggregateId: user.id, eventType: 'IdentityAdminInviteRequestedV1', payload: { userId: user.id, encryptedToken: this.tokenProtector.encrypt(token), expiresAt: expiresAt.toISOString() } }, select: { id: true } })
      await tx.auditLog.create({ data: { actorUserId, action: 'admin.user_invited', resourceType: 'User', resourceId: user.id, ...(requestId ? { requestId } : {}) } })
      return { userId: user.id, outboxId: outbox.id }
    })
    try {
      await this.emailSender.sendPasswordResetEmail({ email, token, expiresAt })
      await this.db.outboxEvent.update({ where: { id: result.outboxId }, data: { status: 'COMPLETED', processedAt: new Date(), attempts: { increment: 1 } } })
    } catch { /* Keep the outbox pending for the delivery worker. */ }
    return { userId: result.userId, status: 'INVITED' as const }
  }
}