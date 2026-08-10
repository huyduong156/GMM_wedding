import type { ObjectStorage, StoredObject, UploadIntent } from './object-storage'

/** S3-compatible boundary. Install/configure the chosen S3 SDK here without changing MediaManager. */
export class S3ObjectStorage implements ObjectStorage {
  async createUploadIntent(key: string, mimeType: string, sizeBytes: number): Promise<UploadIntent> { void key; void mimeType; void sizeBytes; throw new Error('S3 storage adapter is not configured') }
  async put(key: string, body: Uint8Array, mimeType: string): Promise<StoredObject> { void key; void body; void mimeType; throw new Error('S3 storage adapter is not configured') }
  async head(key: string): Promise<StoredObject | null> { void key; throw new Error('S3 storage adapter is not configured') }
  async delete(key: string) { void key; throw new Error('S3 storage adapter is not configured') }
  publicUrl(key: string): string { void key; throw new Error('S3 storage adapter is not configured') }
}
