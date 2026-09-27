import { getServerEnv } from '@/platform/config/env'
import { FakeObjectStorage } from './fake-object-storage'
import { R2ObjectStorage, S3ObjectStorage } from './s3-object-storage'
import type { ObjectStorage } from './object-storage'

export function getObjectStorage(): ObjectStorage {
  const env = getServerEnv()
  if (env.MEDIA_STORAGE_DRIVER === 'r2') return new R2ObjectStorage()
  if (env.APP_ENV === 'production' || env.MEDIA_STORAGE_DRIVER === 's3') return new S3ObjectStorage()
  return new FakeObjectStorage()
}
