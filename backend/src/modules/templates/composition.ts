import { prisma } from '@/platform/database/prisma'
import { getServerEnv } from '@/platform/config/env'
import { getObjectStorage } from '@/platform/storage/composition'
import { TemplateAdminService } from './application/template-admin-service'
let service: TemplateAdminService | undefined
export function getTemplateAdminService() {
  const env = getServerEnv()
  service ??= new TemplateAdminService(
    prisma,
    { allowSameVersionMutation: env.APP_ENV === 'local' && env.NODE_ENV === 'development' },
    getObjectStorage(),
  )
  return service
}
