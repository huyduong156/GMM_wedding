import { prisma } from '@/platform/database/prisma'
import { getObjectStorage } from '@/platform/storage/composition'
import { RecapService } from './application/recap-service'

let recapService: RecapService | undefined
export function getRecapService() {
  recapService ??= new RecapService(prisma, getObjectStorage())
  return recapService
}
