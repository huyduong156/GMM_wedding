import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { ImageConversionError, ImageConversionService } from './image-conversion-service'

describe('ImageConversionService', () => {
  const service = new ImageConversionService()

  it('converts a supported image to WebP and preserves dimensions', async () => {
    const source = await sharp({
      create: { width: 120, height: 80, channels: 3, background: '#ffffff' },
    })
      .png()
      .toBuffer()

    const result = await service.convert(source, 'image/png')
    const metadata = await sharp(result.body).metadata()

    expect(result.mimeType).toBe('image/webp')
    expect(result.sizeBytes).toBeGreaterThan(0)
    expect(result.width).toBe(120)
    expect(result.height).toBe(80)
    expect(metadata.format).toBe('webp')
  })

  it('rejects unsupported input MIME types before storing anything', async () => {
    await expect(service.convert(new Uint8Array([1, 2, 3]), 'image/gif')).rejects.toBeInstanceOf(
      ImageConversionError,
    )
  })

  it('rejects content whose bytes do not match the declared image type', async () => {
    await expect(service.convert(new Uint8Array([1, 2, 3]), 'image/png')).rejects.toBeInstanceOf(
      ImageConversionError,
    )
  })
})
