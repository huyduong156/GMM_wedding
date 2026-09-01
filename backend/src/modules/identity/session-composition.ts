import { prisma } from '@/platform/database/prisma'
import { ArgonPasswordHasher } from '@/platform/auth/password-hasher'
import { PasswordChangeService } from './application/password-change-service'
import { UserSessionService } from './application/user-session-service'

let sessions: UserSessionService | undefined
let passwords: PasswordChangeService | undefined
export function getUserSessionService() {
  sessions ??= new UserSessionService(prisma)
  return sessions
}
export function getPasswordChangeService() {
  passwords ??= new PasswordChangeService(prisma, new ArgonPasswordHasher())
  return passwords
}
