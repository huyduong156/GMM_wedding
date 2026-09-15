import { z } from 'zod'

export const workspaceAccessRoleSchema = z.enum(['EDITOR', 'VIEWER'])
export const workspaceAccessCreateSchema = z.object({
  role: workspaceAccessRoleSchema,
  email: z.string().email().max(320).optional(),
})
export const workspaceAccessIdSchema = z.string().uuid()
export const workspaceAccessTokenSchema = z.string().min(32).max(200)
export const workspaceMemberRoleSchema = z.enum(['EDITOR', 'VIEWER'])
export const workspaceMemberUpdateSchema = z.object({ role: workspaceMemberRoleSchema })
export const workspaceMemberIdSchema = z.string().uuid()
