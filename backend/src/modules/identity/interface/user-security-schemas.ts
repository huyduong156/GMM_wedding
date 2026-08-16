import { z } from 'zod'
export const sessionIdSchema = z.string().uuid()
export const revokeAllSessionsSchema = z.object({ includeCurrent: z.boolean().default(false) }).strict()
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(12).max(128) }).strict().refine((value) => value.currentPassword !== value.newPassword, { message: 'New password must differ from current password', path: ['newPassword'] })
