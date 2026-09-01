import type { PrismaClient } from '@prisma/client'
import type { PasswordHasher } from './ports'
import { AuthError } from '../domain/auth-error'

export class PasswordChangeService {
  constructor(
    private readonly db: PrismaClient,
    private readonly hasher: PasswordHasher,
  ) {}

  async change(
    userId: string,
    currentSessionId: string,
    currentPassword: string,
    nextPassword: string,
  ) {
    const user = await this.db.user.findFirst({
      where: { id: userId, deletedAt: null, status: 'ACTIVE' },
      select: { passwordHash: true },
    })
    if (!user?.passwordHash || !(await this.hasher.verify(user.passwordHash, currentPassword)))
      throw new AuthError('INVALID_CURRENT_PASSWORD', 400, 'Current password is incorrect')
    const passwordHash = await this.hasher.hash(nextPassword)
    const now = new Date()
    await this.db.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { passwordHash } })
      await tx.session.updateMany({
        where: { userId, id: { not: currentSessionId }, revokedAt: null },
        data: { revokedAt: now },
      })
      await tx.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'identity.password_changed',
          resourceType: 'User',
          resourceId: userId,
        },
      })
    })
  }
}
