import { WeddingService } from './application/wedding-service'
import { PrismaWeddingRepository } from './infrastructure/prisma-wedding-repository'
import { prisma } from '@/platform/database/prisma'
import { WorkspaceAccessService } from './application/workspace-access/workspace-access-service'

let weddingService: WeddingService | undefined
let workspaceAccessService: WorkspaceAccessService | undefined

export function getWeddingService() {
  weddingService ??= new WeddingService(new PrismaWeddingRepository(prisma))
  return weddingService
}

export function getWorkspaceAccessService() {
  workspaceAccessService ??= new WorkspaceAccessService(prisma)
  return workspaceAccessService
}
