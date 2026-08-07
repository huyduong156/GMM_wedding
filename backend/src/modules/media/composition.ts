import { prisma } from '@/platform/database/prisma'
import { getServerEnv } from '@/platform/config/env'
import { FakeObjectStorage } from '@/platform/storage/fake-object-storage'
import { S3ObjectStorage } from '@/platform/storage/s3-object-storage'
import { MediaManager } from './application/media-manager'
let manager: MediaManager | undefined
export function getMediaManager() {
  if (!manager) { const env = getServerEnv(); const storage = env.MEDIA_STORAGE_DRIVER === 's3' ? new S3ObjectStorage() : new FakeObjectStorage(); manager = new MediaManager(prisma, storage) }
  return manager
}
