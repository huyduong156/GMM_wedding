import type { WeddingMemberRole } from '@prisma/client'
import { prisma } from '@/platform/database/prisma'
import { WeddingError } from '../domain/wedding-error'

export type WeddingPermission = 'READ' | 'EDIT' | 'OWNER'

const allowedRoles: Record<WeddingPermission, WeddingMemberRole[]> = {
  READ: ['OWNER', 'EDITOR', 'VIEWER'],
  EDIT: ['OWNER', 'EDITOR'],
  OWNER: ['OWNER'],
}

/** Resolves short-lived per-request workspace access; roles are never stored in the session. */
export async function requireWeddingPermission(
  userId: string,
  weddingId: string,
  permission: WeddingPermission,
) {
  const member = await prisma.weddingMember.findFirst({
    where: {
      userId,
      weddingId,
      status: 'ACTIVE',
      wedding: { deletedAt: null },
    },
    select: { id: true, role: true },
  })
  if (!member) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
  if (!allowedRoles[permission].includes(member.role))
    throw new WeddingError('WEDDING_ACCESS_DENIED', 403, 'Wedding access is not permitted')
  return member
}
