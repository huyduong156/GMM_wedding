import sharp from 'sharp'
import { describe, expect, it, vi } from 'vitest'
import type { ObjectStorage } from '@/platform/storage/object-storage'
import { PublicShareImageService } from './public-share-image'

describe('PublicShareImageService', () => {
  it('serves a bounded JPEG derived from the stored owner avatar', async () => {
    const source = await sharp({
      create: {
        width: 1800,
        height: 1200,
        channels: 4,
        background: { r: 220, g: 120, b: 80, alpha: 0.5 },
      },
    })
      .webp()
      .toBuffer()
    const storage = {
      keyFromPublicUrl: vi.fn(() => 'weddings/wedding-id/avatar.webp'),
      head: vi.fn(async () => ({ sizeBytes: source.byteLength, mimeType: 'image/webp' })),
      get: vi.fn(async () => new Uint8Array(source)),
    } as unknown as ObjectStorage

    const result = await new PublicShareImageService(storage).jpegFromPublicUrl(
      'https://media.example/weddings/wedding-id/avatar.webp',
    )

    expect(result).toBeInstanceOf(Uint8Array)
    const metadata = await sharp(result!).metadata()
    expect(metadata).toMatchObject({ format: 'jpeg', width: 1200, height: 800 })
    expect(metadata.hasAlpha).toBe(false)
  })

  it('rejects URLs outside the configured storage public origin', async () => {
    const storage = {
      keyFromPublicUrl: vi.fn(() => null),
      head: vi.fn(),
      get: vi.fn(),
    } as unknown as ObjectStorage

    await expect(
      new PublicShareImageService(storage).jpegFromPublicUrl('https://example.com/image.webp'),
    ).resolves.toBeNull()
    expect(storage.head).not.toHaveBeenCalled()
  })
})
