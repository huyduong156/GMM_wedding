import { prisma } from '@/platform/database/prisma'
import { getServerEnv } from '@/platform/config/env'
import { TokenProtector } from '@/platform/auth/token-protector'
import { SmtpVerificationEmailSender } from './infrastructure/smtp-verification-email-sender'
import { AdminInviteService } from './application/admin-invite-service'
let service: AdminInviteService | undefined
export function getAdminInviteService() {
  if (!service) {
    const env = getServerEnv()
    service = new AdminInviteService(
      prisma,
      new SmtpVerificationEmailSender(
        env.SMTP_HOST,
        env.SMTP_PORT,
        env.SMTP_SECURE,
        env.SMTP_FROM,
        env.APP_ORIGIN,
        ...(env.SMTP_USER && env.SMTP_PASSWORD
          ? [{ user: env.SMTP_USER, password: env.SMTP_PASSWORD }]
          : []),
      ),
      new TokenProtector(env.AUTH_TOKEN_ENCRYPTION_KEY),
    )
  }
  return service
}
