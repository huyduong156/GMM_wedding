import { prisma } from '@/platform/database/prisma'
import { AdminUserService } from './application/admin-user-service'
import { AdminDashboardService } from './application/admin-dashboard-service'

let service: AdminUserService | undefined
let dashboardService: AdminDashboardService | undefined
export function getAdminUserService() {
  service ??= new AdminUserService(prisma)
  return service
}

export function getAdminDashboardService() {
  dashboardService ??= new AdminDashboardService(prisma)
  return dashboardService
}
