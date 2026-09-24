import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { ObjectStorage } from '@/platform/storage/object-storage'
import { ImageConversionService } from './image-conversion-service'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function toWebpFileName(fileName: string) {
  const lastDot = fileName.lastIndexOf('.')
  const stem = lastDot > 0 ? fileName.slice(0, lastDot) : fileName
  return `${stem}.webp`
}

export class MediaError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'MediaError'
  }
}
export class MediaManager {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly storage: ObjectStorage,
    private readonly imageConverter = new ImageConversionService(),
  ) {}
  private async owner(userId: string, weddingId: string) {
    return this.prisma.wedding.findFirst({
      where: {
        id: weddingId,
        deletedAt: null,
        members: { some: { userId, status: 'ACTIVE', role: { in: ['OWNER', 'EDITOR'] } } },
      },
      select: { id: true },
    })
  }
  async createIntent(
    userId: string,
    weddingId: string,
    input: {
      mimeType: string
      sizeBytes: number
      originalName?: string | undefined
      altText?: string | undefined
    },
  ) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (!MIME_EXT[input.mimeType] || input.sizeBytes < 1 || input.sizeBytes > MAX_IMAGE_BYTES)
      throw new MediaError(
        'MEDIA_INVALID',
        400,
        'Only image/jpeg, image/png and image/webp up to 10MB are supported',
      )
    const id = randomUUID()
    const key = `weddings/${weddingId}/${id}.webp`
    const intent = {
      uploadUrl: 'backend-upload',
      method: 'PUT' as const,
      headers: { 'content-type': input.mimeType },
      expiresAt: new Date(Date.now() + 15 * 60_000),
    }
    const asset = await this.prisma.mediaAsset.create({
      data: {
        id,
        weddingId,
        uploadedById: userId,
        storageKey: key,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        ...(input.originalName !== undefined
          ? { originalName: toWebpFileName(input.originalName).slice(0, 255) }
          : {}),
        ...(input.altText !== undefined ? { altText: input.altText.slice(0, 500) } : {}),
      },
      select: { id: true, storageKey: true, status: true, mimeType: true, sizeBytes: true },
    })
    return {
      media: {
        ...asset,
        sizeBytes: Number(asset.sizeBytes),
        publicUrl: this.storage.publicUrl(asset.storageKey),
      },
      upload: intent,
    }
  }
  async uploadBytes(
    userId: string,
    weddingId: string,
    mediaId: string,
    body: Uint8Array,
    mimeType: string,
  ) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id: mediaId, weddingId, deletedAt: null, status: 'PENDING_UPLOAD' },
    })
    if (!asset) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    if (
      body.byteLength !== Number(asset.sizeBytes) ||
      body.byteLength > MAX_IMAGE_BYTES ||
      asset.mimeType !== mimeType
    )
      throw new MediaError(
        'MEDIA_INVALID',
        400,
        'Uploaded object does not match the requested image',
      )
    let converted
    try {
      converted = await this.imageConverter.convert(body, mimeType)
      await this.storage.put(asset.storageKey, converted.body, converted.mimeType)
    } catch (error) {
      await this.prisma.mediaAsset.update({
        where: { id: mediaId },
        data: { status: 'FAILED' },
      })
      if (error instanceof Error && error.name === 'ImageConversionError') {
        throw new MediaError('MEDIA_INVALID', 400, error.message)
      }
      throw error
    }

    await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: {
        mimeType: converted.mimeType,
        sizeBytes: converted.sizeBytes,
        width: converted.width,
        height: converted.height,
        status: 'PROCESSING',
        ...(asset.originalName !== null
          ? { originalName: toWebpFileName(asset.originalName).slice(0, 255) }
          : {}),
      },
    })
    return { accepted: true, mediaId }
  }
  async complete(userId: string, weddingId: string, mediaId: string) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id: mediaId, weddingId, deletedAt: null },
    })
    if (!asset) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    const stored = await this.storage.head(asset.storageKey)
    if (!stored) throw new MediaError('MEDIA_UPLOAD_INCOMPLETE', 409, 'Upload has not completed')
    if (
      stored.sizeBytes !== Number(asset.sizeBytes) ||
      stored.sizeBytes > MAX_IMAGE_BYTES ||
      (stored.mimeType !== 'application/octet-stream' && stored.mimeType !== 'image/webp')
    )
      throw new MediaError(
        'MEDIA_INVALID',
        400,
        'Uploaded object does not match the requested image',
      )
    const updated = await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: { status: 'READY', sizeBytes: stored.sizeBytes },
      select: {
        id: true,
        storageKey: true,
        mimeType: true,
        sizeBytes: true,
        status: true,
        originalName: true,
        altText: true,
        width: true,
        height: true,
      },
    })
    return {
      media: {
        ...updated,
        sizeBytes: Number(updated.sizeBytes),
        publicUrl: this.storage.publicUrl(updated.storageKey),
      },
    }
  }
  async list(userId: string, weddingId: string) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const rows = await this.prisma.mediaAsset.findMany({
      where: { weddingId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        storageKey: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        width: true,
        height: true,
        status: true,
        altText: true,
        createdAt: true,
      },
    })
    return rows.map((row) => ({
      ...row,
      sizeBytes: Number(row.sizeBytes),
      publicUrl: this.storage.publicUrl(row.storageKey),
    }))
  }
  async get(userId: string, weddingId: string, mediaId: string) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const row = await this.prisma.mediaAsset.findFirst({
      where: { id: mediaId, weddingId, deletedAt: null },
      select: {
        id: true,
        storageKey: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        width: true,
        height: true,
        status: true,
        altText: true,
        createdAt: true,
      },
    })
    if (!row) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    return {
      ...row,
      sizeBytes: Number(row.sizeBytes),
      publicUrl: this.storage.publicUrl(row.storageKey),
    }
  }
  async updateMetadata(
    userId: string,
    weddingId: string,
    mediaId: string,
    input: { altText?: string | null },
  ) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const row = await this.prisma.mediaAsset.findFirst({
      where: { id: mediaId, weddingId, deletedAt: null },
      select: { id: true },
    })
    if (!row) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    const updated = await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: input,
      select: {
        id: true,
        storageKey: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        width: true,
        height: true,
        status: true,
        altText: true,
        createdAt: true,
      },
    })
    return {
      ...updated,
      sizeBytes: Number(updated.sizeBytes),
      publicUrl: this.storage.publicUrl(updated.storageKey),
    }
  }
  async remove(userId: string, weddingId: string, mediaId: string) {
    if (!(await this.owner(userId, weddingId)))
      throw new MediaError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const row = await this.prisma.mediaAsset.findFirst({
      where: { id: mediaId, weddingId, deletedAt: null },
      select: { storageKey: true },
    })
    if (!row) throw new MediaError('MEDIA_NOT_FOUND', 404, 'Media asset not found')
    await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: { deletedAt: new Date(), status: 'REJECTED' },
    })
    await this.storage.delete(row.storageKey)
  }
}
