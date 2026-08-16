import { prisma } from '@/platform/database/prisma'
import { AdminUserService } from './application/admin-user-service'

let service: AdminUserService | undefined
export function getAdminUserService() { service ??= new AdminUserService(prisma); return service }
