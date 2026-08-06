import { WeddingService } from './application/wedding-service'
import { PrismaWeddingRepository } from './infrastructure/prisma-wedding-repository'
import { prisma } from '@/platform/database/prisma'

let weddingService: WeddingService | undefined

export function getWeddingService() {
  weddingService ??= new WeddingService(new PrismaWeddingRepository(prisma))
  return weddingService
}
