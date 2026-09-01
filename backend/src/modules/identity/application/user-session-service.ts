import type { PrismaClient } from '@prisma/client'
import { AdminUserError } from '../domain/admin-user-error'

export class UserSessionService {
  constructor(private readonly db: PrismaClient) {}

  async list(userId: string, currentSessionId: string) {
    const sessions = await this.db.session.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastSeenAt: 'desc' },
      select: { id: true, createdAt: true, lastSeenAt: true, expiresAt: true, userAgent: true },
    })
    return {
      sessions: sessions.map((session) => ({
        ...session,
        isCurrent: session.id === currentSessionId,
      })),
    }
  }

  async revoke(userId: string, sessionId: string) {
    const result = await this.db.session.updateMany({
      where: { id: sessionId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    if (!result.count) throw new AdminUserError('SESSION_NOT_FOUND', 404, 'Session not found')
  }

  async revokeAll(userId: string, currentSessionId: string, includeCurrent: boolean) {
    const result = await this.db.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(includeCurrent ? {} : { id: { not: currentSessionId } }),
      },
      data: { revokedAt: new Date() },
    })
    await this.db.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'identity.sessions_revoked_all',
        resourceType: 'User',
        resourceId: userId,
        metadata: { includeCurrent, count: result.count },
      },
    })
    return { revokedCount: result.count }
  }
}
