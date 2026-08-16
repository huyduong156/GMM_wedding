import type { Prisma, PrismaClient, SystemRole, UserStatus } from '@prisma/client'
import { AdminUserError } from '../domain/admin-user-error'

type ListFilter = { query?: string | undefined; status?: UserStatus | undefined; role?: SystemRole | undefined; limit: number; cursor?: string | undefined }
const roleWhere = (role: SystemRole, now: Date) => ({ some: { role, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } })

type AdminUserRow = { id: string; email: string; displayName: string | null; avatarUrl: string | null; phone: string | null; status: UserStatus; emailVerifiedAt: Date | null; lastLoginAt: Date | null; createdAt: Date; updatedAt: Date; roles: Array<{ role: SystemRole; expiresAt: Date | null }>; _count: { memberships: number; createdWeddings: number } }

export class AdminUserService {
  constructor(private readonly db: PrismaClient) {}

  async list(filter: ListFilter) {
    const now = new Date()
    const cursorRow = filter.cursor ? await this.db.user.findFirst({ where: { id: filter.cursor, deletedAt: null }, select: { id: true, createdAt: true } }) : null
    const where = {
      deletedAt: null,
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.role ? { roles: roleWhere(filter.role, now) } : {}),
      AND: [
        ...(filter.query ? [{ OR: [{ email: { contains: filter.query, mode: 'insensitive' as const } }, { displayName: { contains: filter.query, mode: 'insensitive' as const } }] }] : []),
        ...(cursorRow ? [{ OR: [{ createdAt: { lt: cursorRow.createdAt } }, { createdAt: cursorRow.createdAt, id: { lt: cursorRow.id } }] }] : []),
      ],
    }
    const rows = await this.db.user.findMany({ where, take: filter.limit + 1, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], select: this.userSelect(now) })
    const hasNext = rows.length > filter.limit
    const items = rows.slice(0, filter.limit).map((row) => this.toDto(row))
    const [total, active, pending, suspended] = await Promise.all([
      this.db.user.count({ where: { deletedAt: null } }),
      this.db.user.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      this.db.user.count({ where: { deletedAt: null, status: 'PENDING_VERIFICATION' } }),
      this.db.user.count({ where: { deletedAt: null, status: 'SUSPENDED' } }),
    ])
    return { items, nextCursor: hasNext ? items.at(-1)?.id ?? null : null, summary: { total, active, pendingVerification: pending, suspended } }
  }

  async get(userId: string) {
    const row = await this.db.user.findFirst({ where: { id: userId, deletedAt: null }, select: this.userSelect(new Date()) })
    if (!row) throw new AdminUserError('USER_NOT_FOUND', 404, 'User not found')
    return { user: this.toDto(row) }
  }

  async update(actorUserId: string, userId: string, input: { status?: UserStatus | undefined; roles?: SystemRole[] | undefined }, requestId?: string) {
    if (actorUserId === userId) throw new AdminUserError('SELF_ADMIN_USER_MUTATION_FORBIDDEN', 409, 'You cannot change your own admin account')
    const current = await this.db.user.findFirst({ where: { id: userId, deletedAt: null }, select: { id: true, status: true, roles: { where: { revokedAt: null }, select: { role: true, expiresAt: true } } } })
    if (!current) throw new AdminUserError('USER_NOT_FOUND', 404, 'User not found')
    const now = new Date()
    const activeAdmin = current.roles.some((role) => role.role === 'ADMIN' && (!role.expiresAt || role.expiresAt > now))
    const removingAdmin = input.roles !== undefined && activeAdmin && !input.roles.includes('ADMIN')
    if (removingAdmin) {
      const adminCount = await this.db.user.count({ where: { deletedAt: null, status: 'ACTIVE', roles: roleWhere('ADMIN', now) } })
      if (adminCount <= 1) throw new AdminUserError('LAST_ADMIN_REQUIRED', 409, 'At least one active platform administrator is required')
    }
    const result = await this.db.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id: userId }, data: input.status ? { status: input.status } : {}, select: { id: true } })
      if (input.roles !== undefined) {
        await tx.userRole.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } })
        if (input.roles.length) await tx.userRole.createMany({ data: input.roles.map((role) => ({ userId, role, grantedById: actorUserId, reason: 'Updated by platform admin' })) })
      }
      await tx.auditLog.create({ data: { actorUserId, action: 'admin.user_updated', resourceType: 'User', resourceId: userId, ...(requestId ? { requestId } : {}), metadata: { status: input.status ?? null, roles: input.roles ?? null } } })
      return user
    })
    return this.get(result.id)
  }

  async bulkStatus(actorUserId: string, userIds: string[], status: UserStatus, requestId?: string) {
    const uniqueIds = [...new Set(userIds)]
    if (uniqueIds.includes(actorUserId)) throw new AdminUserError('SELF_ADMIN_USER_MUTATION_FORBIDDEN', 409, 'You cannot change your own admin account')
    if (status !== 'SUSPENDED' && status !== 'ACTIVE' && status !== 'PENDING_VERIFICATION') throw new AdminUserError('INVALID_USER_STATUS', 400, 'This user status cannot be set by admin')
    if (status !== 'ACTIVE') {
      const now = new Date()
      const [adminCount, affectedAdminCount] = await Promise.all([
        this.db.user.count({ where: { deletedAt: null, status: 'ACTIVE', roles: roleWhere('ADMIN', now) } }),
        this.db.user.count({ where: { id: { in: uniqueIds }, deletedAt: null, status: 'ACTIVE', roles: roleWhere('ADMIN', now) } }),
      ])
      if (adminCount - affectedAdminCount < 1) throw new AdminUserError('LAST_ADMIN_REQUIRED', 409, 'At least one active platform administrator is required')
    }
    const result = await this.db.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({ where: { id: { in: uniqueIds }, deletedAt: null }, data: { status } })
      await tx.auditLog.create({ data: { actorUserId, action: 'admin.users_bulk_status_updated', resourceType: 'User', ...(requestId ? { requestId } : {}), metadata: { userIds: uniqueIds, status, updatedCount: updated.count } } })
      return updated.count
    })
    return { updatedCount: result }
  }

  async audit(userId: string, limit: number, cursor?: string) {
    const logs = await this.db.auditLog.findMany({ where: { resourceType: 'User', resourceId: userId, ...(cursor ? { id: { lt: cursor } } : {}) }, take: limit + 1, orderBy: { occurredAt: 'desc' }, select: { id: true, action: true, reason: true, metadata: true, occurredAt: true, actorUser: { select: { id: true, email: true, displayName: true } } } })
    const hasNext = logs.length > limit
    return { items: logs.slice(0, limit), nextCursor: hasNext ? logs[limit - 1]?.id ?? null : null }
  }

  async revokeSessions(actorUserId: string, userId: string, requestId?: string) {
    if (actorUserId === userId) throw new AdminUserError('SELF_ADMIN_USER_MUTATION_FORBIDDEN', 409, 'You cannot change your own admin account')
    const user = await this.db.user.findFirst({ where: { id: userId, deletedAt: null }, select: { id: true } })
    if (!user) throw new AdminUserError('USER_NOT_FOUND', 404, 'User not found')
    const result = await this.db.$transaction(async (tx) => {
      const revoked = await tx.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
      await tx.auditLog.create({ data: { actorUserId, action: 'admin.user_sessions_revoked', resourceType: 'User', resourceId: userId, ...(requestId ? { requestId } : {}), metadata: { revokedCount: revoked.count } } })
      return revoked.count
    })
    return { revokedCount: result }
  }
  private userSelect(now: Date): Prisma.UserSelect {
    return { id: true, email: true, displayName: true, avatarUrl: true, phone: true, status: true, emailVerifiedAt: true, lastLoginAt: true, createdAt: true, updatedAt: true, roles: { where: { revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }, select: { role: true, expiresAt: true } }, _count: { select: { memberships: true, createdWeddings: true } } }
  }

  private toDto(row: AdminUserRow) {
    return { id: row.id, email: row.email, displayName: row.displayName, avatarUrl: row.avatarUrl, phone: row.phone, status: row.status, emailVerifiedAt: row.emailVerifiedAt, lastLoginAt: row.lastLoginAt, createdAt: row.createdAt, updatedAt: row.updatedAt, roles: row.roles.map((role: { role: SystemRole }) => role.role), weddingCount: row._count.memberships }
  }
}
