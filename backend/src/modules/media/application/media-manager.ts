import { createHash, randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { ObjectStorage } from '@/platform/storage/object-storage'
import type { FakeObjectStorage } from '@/platform/storage/fake-object-storage'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MIME_EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
export class MediaError extends Error { constructor(readonly code: string, readonly status: number, message: string) { super(message); this.name = 'MediaError' } }
export class MediaManager {
  constructor(private readonly prisma: PrismaClient, private readonly storage: ObjectStorage) {}
  private async owner(userId: string, weddingId: string) { return this.prisma.wedding.findFirst({ where: { id: weddingId, createdById: userId, deletedAt: null }, select: { id: true } }) }
  async createIntent(userId: string, weddingId: string, input: { mimeType: string; sizeBytes: number; originalName?: string | undefined; altText?: string | undefined }) {
    if (!await this.owner(userId, weddingId)) throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (!MIME_EXT[input.mimeType] || input.sizeBytes < 1 || input.sizeBytes > MAX_IMAGE_BYTES) throw new MediaError('MEDIA_INVALID', 400, 'Only image/jpeg, image/png, image/webp and image/gif up to 10MB are supported')
    const id = randomUUID(); const key = `weddings/${weddingId}/${id}.${MIME_EXT[input.mimeType]}`
    const intent = await this.storage.createUploadIntent(key, input.mimeType, input.sizeBytes)
    const asset = await this.prisma.mediaAsset.create({ data: { id, weddingId, uploadedById: userId, storageKey: key, mimeType: input.mimeType, sizeBytes: input.sizeBytes, ...(input.originalName !== undefined ? { originalName: input.originalName.slice(0, 255) } : {}), ...(input.altText !== undefined ? { altText: input.altText.slice(0, 500) } : {}) }, select: { id: true, storageKey: true, status: true, mimeType: true, sizeBytes: true } })
    return { media: { ...asset, sizeBytes: Number(asset.sizeBytes), publicUrl: this.storage.publicUrl(asset.storageKey) }, upload: intent }
  }
  async uploadFake(userId: string, weddingId: string, mediaId: string, body: Uint8Array, mimeType: string) {
    if (!await this.owner(userId, weddingId)) throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const asset = await this.prisma.mediaAsset.findFirst({ where: { id: mediaId, weddingId, deletedAt: null, status: 'PENDING_UPLOAD' } })
    if (!asset) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    if (body.byteLength > MAX_IMAGE_BYTES || asset.mimeType !== mimeType) throw new MediaError('MEDIA_INVALID', 400, 'Uploaded object does not match the requested image')
    const fake = this.storage as FakeObjectStorage
    if (typeof fake.put !== 'function') throw new MediaError('MEDIA_STORAGE_UNAVAILABLE', 503, 'Fake upload endpoint is only available with fake storage')
    await fake.put(asset.storageKey, body, mimeType)
    return { accepted: true, mediaId }
  }
  async complete(userId: string, weddingId: string, mediaId: string) {
    if (!await this.owner(userId, weddingId)) throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const asset = await this.prisma.mediaAsset.findFirst({ where: { id: mediaId, weddingId, deletedAt: null } })
    if (!asset) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    const stored = await this.storage.head(asset.storageKey)
    if (!stored) throw new MediaError('MEDIA_UPLOAD_INCOMPLETE', 409, 'Upload has not completed')
    if (stored.sizeBytes > MAX_IMAGE_BYTES) throw new MediaError('MEDIA_INVALID', 400, 'Image exceeds maximum size')
    const updated = await this.prisma.mediaAsset.update({ where: { id: mediaId }, data: { status: 'READY', sizeBytes: stored.sizeBytes }, select: { id: true, storageKey: true, mimeType: true, sizeBytes: true, status: true, originalName: true, altText: true, width: true, height: true } })
    return { media: { ...updated, sizeBytes: Number(updated.sizeBytes), publicUrl: this.storage.publicUrl(updated.storageKey) } }
  }
  async list(userId: string, weddingId: string) {
    if (!await this.owner(userId, weddingId)) throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const rows = await this.prisma.mediaAsset.findMany({ where: { weddingId, deletedAt: null }, orderBy: { createdAt: 'desc' }, select: { id: true, storageKey: true, originalName: true, mimeType: true, sizeBytes: true, width: true, height: true, status: true, altText: true, createdAt: true } })
    return rows.map((row) => ({ ...row, sizeBytes: Number(row.sizeBytes), publicUrl: this.storage.publicUrl(row.storageKey) }))
  }
  async remove(userId: string, weddingId: string, mediaId: string) {
    if (!await this.owner(userId, weddingId)) throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const row = await this.prisma.mediaAsset.findFirst({ where: { id: mediaId, weddingId, deletedAt: null }, select: { storageKey: true } })
    if (!row) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    await this.prisma.mediaAsset.update({ where: { id: mediaId }, data: { deletedAt: new Date(), status: 'REJECTED' } })
    await this.storage.delete(row.storageKey)
  }
}
