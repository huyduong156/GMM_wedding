import { prisma } from '@/platform/database/prisma'
import { getObjectStorage } from '@/platform/storage/composition'
import { MusicService } from './application/music-service'
let service: MusicService | undefined
export function getMusicService() {
  if (!service) service = new MusicService(prisma, getObjectStorage())
  return service
}
