import sharp from 'sharp'
import type { ObjectStorage } from '@/platform/storage/object-storage'

const MAX_SOURCE_BYTES = 10 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export class PublicShareImageService {
  constructor(private readonly storage: ObjectStorage) {}

  async jpegFromPublicUrl(publicUrl: string | null): Promise<Uint8Array | null> {
    if (!publicUrl) return null
    const key = this.storage.keyFromPublicUrl(publicUrl)
    if (!key) return null

    const stored = await this.storage.head(key)
    if (!stored || stored.sizeBytes < 1 || stored.sizeBytes > MAX_SOURCE_BYTES)
      return null
    if (!SUPPORTED_IMAGE_TYPES.has(stored.mimeType)) return null

    const body = await this.storage.get(key)
    if (!body || body.byteLength !== stored.sizeBytes) return null

    try {
      return await sharp(body)
        .rotate()
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 88, progressive: true })
        .toBuffer()
    } catch {
      return null
    }
  }
}
