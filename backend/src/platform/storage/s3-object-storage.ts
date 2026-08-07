import type { ObjectStorage, StoredObject, UploadIntent } from './object-storage'

/** S3-compatible boundary. Install/configure the chosen S3 SDK here without changing MediaManager. */
export class S3ObjectStorage implements ObjectStorage {
  async createUploadIntent(_key: string, _mimeType: string, _sizeBytes: number): Promise<UploadIntent> { throw new Error('S3 storage adapter is not configured') }
  async put(_key: string, _body: Uint8Array, _mimeType: string): Promise<StoredObject> { throw new Error('S3 storage adapter is not configured') }
  async head(_key: string): Promise<StoredObject | null> { throw new Error('S3 storage adapter is not configured') }
  async delete(_key: string) { throw new Error('S3 storage adapter is not configured') }
  publicUrl(_key: string): string { throw new Error('S3 storage adapter is not configured') }
}
