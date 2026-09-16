import { createHash, randomBytes } from 'node:crypto'
import type { PrismaClient, WeddingMemberRole, WorkspaceAccessRole } from '@prisma/client'
import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import { WeddingError } from '../../domain/wedding-error'

type CreateInput = { role: WorkspaceAccessRole; email?: string | undefined }

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function normalizeEmail(email?: string) {
  const value = email?.trim().toLowerCase()
  return value || null
}

export class WorkspaceAccessService {
  constructor(private readonly db: PrismaClient) {}

  async create(actor: AuthenticatedUserActor, weddingId: string, input: CreateInput) {
    await this.requireOwner(actor.userId, weddingId)
    const token = randomBytes(32).toString('base64url')
    const access = await this.db.weddingWorkspaceAccess.create({
      data: {
        weddingId,
        createdByUserId: actor.userId,
        email: normalizeEmail(input.email),
        role: input.role,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
    return { access, token }
  }

  async list(actor: AuthenticatedUserActor, weddingId: string) {
    await this.requireMember(actor.userId, weddingId)
    const rows = await this.db.weddingWorkspaceAccess.findMany({
      where: { weddingId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        weddingId: true,
        createdByUserId: true,
        acceptedByUserId: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return rows.map((access) => ({
      id: access.id,
      weddingId: access.weddingId,
      createdByUserId: access.createdByUserId,
      acceptedByUserId: access.acceptedByUserId,
      email: access.email,
      role: access.role,
      status: access.status,
      expiresAt: access.expiresAt,
      acceptedAt: access.acceptedAt,
      revokedAt: access.revokedAt,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
    }))
  }

  async revoke(actor: AuthenticatedUserActor, weddingId: string, accessId: string) {
    await this.requireOwner(actor.userId, weddingId)
    const result = await this.db.weddingWorkspaceAccess.updateMany({
      where: { id: accessId, weddingId, status: 'PENDING' },
      data: { status: 'REVOKED', revokedAt: new Date() },
    })
    if (!result.count) throw new WeddingError('WORKSPACE_ACCESS_NOT_FOUND', 404, 'Access link not found')
  }

  async resolve(token: string) {
    const access = await this.db.weddingWorkspaceAccess.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { wedding: { select: { id: true, name: true } } },
    })
    if (!access || access.status !== 'PENDING') throw new WeddingError('WORKSPACE_ACCESS_INVALID', 404, 'Access link is invalid')
    if (access.expiresAt <= new Date()) {
      await this.db.weddingWorkspaceAccess.updateMany({ where: { id: access.id, status: 'PENDING' }, data: { status: 'EXPIRED' } })
      throw new WeddingError('WORKSPACE_ACCESS_EXPIRED', 410, 'Access link has expired')
    }
    return { id: access.id, weddingId: access.weddingId, weddingName: access.wedding.name, role: access.role, expiresAt: access.expiresAt }
  }

  async accept(actor: AuthenticatedUserActor, token: string) {
    const tokenHash = hashToken(token)
    return this.db.$transaction(async (tx) => {
      const now = new Date()
      const access = await tx.weddingWorkspaceAccess.findUnique({ where: { tokenHash } })
      if (!access || access.status !== 'PENDING') throw new WeddingError('WORKSPACE_ACCESS_INVALID', 404, 'Access link is invalid')
      if (access.expiresAt <= now) {
        await tx.weddingWorkspaceAccess.updateMany({ where: { id: access.id, status: 'PENDING' }, data: { status: 'EXPIRED' } })
        throw new WeddingError('WORKSPACE_ACCESS_EXPIRED', 410, 'Access link has expired')
      }
      const user = await tx.user.findUnique({ where: { id: actor.userId }, select: { email: true } })
      if (access.email && user?.email.toLowerCase() !== access.email) throw new WeddingError('WORKSPACE_ACCESS_EMAIL_MISMATCH', 403, 'Access link is restricted to another email')
      const existing = await tx.weddingMember.findUnique({ where: { weddingId_userId: { weddingId: access.weddingId, userId: actor.userId } } })
      if (existing?.status === 'ACTIVE')
        throw new WeddingError('WORKSPACE_MEMBER_EXISTS', 409, 'User is already a member')
      const member = existing
        ? await tx.weddingMember.update({
            where: { id: existing.id },
            data: {
              role: access.role,
              status: 'ACTIVE',
              invitedAt: access.createdAt,
              joinedAt: now,
              revokedAt: null,
            },
          })
        : await tx.weddingMember.create({
            data: {
              weddingId: access.weddingId,
              userId: actor.userId,
              role: access.role,
              status: 'ACTIVE',
              invitedAt: access.createdAt,
              joinedAt: now,
            },
          })
      const claimed = await tx.weddingWorkspaceAccess.updateMany({ where: { id: access.id, status: 'PENDING' }, data: { status: 'ACCEPTED', acceptedByUserId: actor.userId, acceptedAt: now } })
      if (!claimed.count) throw new WeddingError('WORKSPACE_ACCESS_INVALID', 409, 'Access link was already used')
      return member
    })
  }

  async listMembers(actor: AuthenticatedUserActor, weddingId: string) {
    await this.requireMember(actor.userId, weddingId)
    return this.db.weddingMember.findMany({
      where: { weddingId, status: 'ACTIVE' },
      include: { user: { select: { id: true, email: true, displayName: true, avatarUrl: true } } },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
    })
  }

  async changeMemberRole(
    actor: AuthenticatedUserActor,
    weddingId: string,
    memberId: string,
    role: Exclude<WeddingMemberRole, 'OWNER'>,
  ) {
    await this.requireOwner(actor.userId, weddingId)
    const result = await this.db.weddingMember.updateMany({
      where: { id: memberId, weddingId, status: 'ACTIVE', role: { not: 'OWNER' } },
      data: { role },
    })
    if (!result.count) throw new WeddingError('WORKSPACE_MEMBER_NOT_FOUND', 404, 'Member not found')
    return this.db.weddingMember.findUniqueOrThrow({
      where: { id: memberId },
      include: { user: { select: { id: true, email: true, displayName: true, avatarUrl: true } } },
    })
  }

  async removeMember(actor: AuthenticatedUserActor, weddingId: string, memberId: string) {
    await this.requireOwner(actor.userId, weddingId)
    const result = await this.db.weddingMember.updateMany({
      where: { id: memberId, weddingId, status: 'ACTIVE', role: { not: 'OWNER' } },
      data: { status: 'REVOKED', revokedAt: new Date() },
    })
    if (!result.count) throw new WeddingError('WORKSPACE_MEMBER_NOT_FOUND', 404, 'Member not found')
  }

  async leave(actor: AuthenticatedUserActor, weddingId: string) {
    const member = await this.requireMember(actor.userId, weddingId)
    if (member.role === 'OWNER') throw new WeddingError('WORKSPACE_OWNER_CANNOT_LEAVE', 409, 'Owner cannot leave the workspace')
    await this.db.weddingMember.update({
      where: { id: member.id },
      data: { status: 'REVOKED', revokedAt: new Date() },
    })
  }

  private async requireOwner(userId: string, weddingId: string) {
    const member = await this.requireMember(userId, weddingId)
    if (member.role !== 'OWNER')
      throw new WeddingError('WEDDING_ACCESS_DENIED', 403, 'Wedding access is not permitted')
  }

  private async requireMember(userId: string, weddingId: string) {
    const member = await this.db.weddingMember.findFirst({
      where: { userId, weddingId, status: 'ACTIVE', wedding: { deletedAt: null } },
      select: { id: true, role: true },
    })
    if (!member) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    return member
  }
}
