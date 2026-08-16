import { z } from 'zod'

const uuid = z.string().uuid()
const systemRole = z.enum(['ADMIN', 'SUPPORT', 'MODERATOR'])
const userStatus = z.enum(['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED'])

export const adminUserListQuerySchema = z.object({
  q: z.string().trim().max(160).optional(),
  status: userStatus.optional(),
  role: systemRole.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
}).strict()

export const adminUserIdSchema = z.string().uuid()

export const adminUserUpdateSchema = z.object({
  status: userStatus.optional(),
  roles: z.array(systemRole).max(3).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required')

export const adminUserBulkStatusSchema = z.object({ userIds: z.array(uuid).min(1).max(500), status: userStatus }).strict()
export const adminUserAuditQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(100).default(50), cursor: uuid.optional() }).strict()

export const adminUserInviteSchema = z.object({ email: z.string().trim().email().max(320), displayName: z.string().trim().min(1).max(120).optional() }).strict()
