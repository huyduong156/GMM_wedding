import sharp from 'sharp'

const SUPPORTED_INPUT_FORMATS = new Set(['jpeg', 'png', 'webp'])

export interface ConvertedImage {
  body: Uint8Array
  mimeType: 'image/webp'
  sizeBytes: number
  width: number
  height: number
}

export type ImageConversionOptions = {
  maxDimension?: number | null
  quality?: number
}

export class ImageConversionError extends Error {
  constructor(message = 'Image could not be converted to WebP') {
    super(message)
    this.name = 'ImageConversionError'
  }
}

export class ImageConversionService {
  async convert(
    body: Uint8Array,
    mimeType: string,
    options: ImageConversionOptions = {},
  ): Promise<ConvertedImage> {
    if (!SUPPORTED_INPUT_FORMATS.has(mimeType.replace('image/', ''))) {
      throw new ImageConversionError('Only JPEG, PNG and WebP images are supported')
    }

    try {
      const image = sharp(body)
      const metadata = await image.metadata()
      if (!metadata.format || !SUPPORTED_INPUT_FORMATS.has(metadata.format)) {
        throw new ImageConversionError('Uploaded content is not a supported image')
      }

      let pipeline = image.rotate()
      const maxDimension = options.maxDimension === undefined ? 2400 : options.maxDimension
      if (maxDimension !== null)
        pipeline = pipeline.resize({
          width: maxDimension,
          height: maxDimension,
          fit: 'inside',
          withoutEnlargement: true,
        })
      const converted = await pipeline
        .webp({ quality: options.quality ?? 82 })
        .toBuffer({ resolveWithObject: true })

      return {
        body: converted.data,
        mimeType: 'image/webp',
        sizeBytes: converted.data.byteLength,
        width: converted.info.width,
        height: converted.info.height,
      }
    } catch (error) {
      if (error instanceof ImageConversionError) throw error
      throw new ImageConversionError()
    }
  }
}
