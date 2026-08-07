export interface UploadIntent { uploadUrl: string; method: 'PUT'; headers: Record<string, string>; expiresAt: Date }
export interface StoredObject { sizeBytes: number; mimeType: string }
export interface ObjectStorage {
  createUploadIntent(key: string, mimeType: string, sizeBytes: number): Promise<UploadIntent>
  put(key: string, body: Uint8Array, mimeType: string): Promise<StoredObject>
  head(key: string): Promise<StoredObject | null>
  delete(key: string): Promise<void>
  publicUrl(key: string): string
}
