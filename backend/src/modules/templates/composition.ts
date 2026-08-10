import { prisma } from '@/platform/database/prisma'
import { TemplateAdminService } from './application/template-admin-service'
let service: TemplateAdminService | undefined
export function getTemplateAdminService() { service ??= new TemplateAdminService(prisma); return service }
