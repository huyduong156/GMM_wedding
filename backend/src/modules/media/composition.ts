import { prisma } from '@/platform/database/prisma'
import { getObjectStorage } from '@/platform/storage/composition'
import { MediaManager } from './application/media-manager'

let manager: MediaManager | undefined
export function getMediaManager() {
  if (!manager) manager = new MediaManager(prisma, getObjectStorage())
  return manager
}
