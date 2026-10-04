import { prisma } from '@/platform/database/prisma'
import { getServerEnv } from '@/platform/config/env'
import { TemplateAdminService } from './application/template-admin-service'
let service: TemplateAdminService | undefined
export function getTemplateAdminService() {
  const env = getServerEnv()
  service ??= new TemplateAdminService(prisma, {
    allowSameVersionMutation: env.APP_ENV === 'local' && env.NODE_ENV === 'development',
  })
  return service
}
