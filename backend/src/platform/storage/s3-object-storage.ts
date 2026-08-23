import { CreateBucketCommand, DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getServerEnv } from '@/platform/config/env'
import type { ObjectStorage, StoredObject, UploadIntent } from './object-storage'

export class S3ObjectStorage implements ObjectStorage {
  private readonly bucket: string
  private readonly client: S3Client
  private readonly presignClient: S3Client
  private bucketReady: Promise<void> | undefined

  constructor() {
    const env = getServerEnv()
    if (!env.S3_ENDPOINT || !env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) throw new Error('S3 storage requires endpoint, bucket and credentials')
    this.bucket = env.S3_BUCKET
    const credentials = { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
    this.client = new S3Client({ region: env.S3_REGION, endpoint: env.S3_ENDPOINT, forcePathStyle: env.S3_FORCE_PATH_STYLE, credentials })
    this.presignClient = new S3Client({ region: env.S3_REGION, endpoint: env.S3_PUBLIC_ENDPOINT ?? env.S3_ENDPOINT, forcePathStyle: env.S3_FORCE_PATH_STYLE, credentials })
  }

  async createUploadIntent(key: string, mimeType: string, sizeBytes: number): Promise<UploadIntent> {
    await this.ensureBucket()
    void sizeBytes
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: mimeType })
    const signed = await getSignedUrl(this.presignClient, command, { expiresIn: 900 })
    return { uploadUrl: signed, method: 'PUT', headers: { 'content-type': mimeType }, expiresAt: new Date(Date.now() + 900_000) }
  }

  async put(key: string, body: Uint8Array, mimeType: string): Promise<StoredObject> {
    await this.ensureBucket()
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: mimeType, ContentLength: body.byteLength }))
    return { sizeBytes: body.byteLength, mimeType }
  }

  async head(key: string): Promise<StoredObject | null> {
    try {
      await this.ensureBucket()
      const result = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }))
      return result.ContentLength === undefined ? null : { sizeBytes: result.ContentLength, mimeType: result.ContentType ?? 'application/octet-stream' }
    } catch { return null }
  }

  async delete(key: string) { await this.ensureBucket(); await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key })) }
  publicUrl(key: string) { const env = getServerEnv(); const endpoint = (env.S3_PUBLIC_ENDPOINT ?? env.S3_ENDPOINT ?? '').replace(new RegExp('/+$'), ''); return `${endpoint}/${this.bucket}/${key}` }

  private ensureBucket() {
    this.bucketReady ??= this.client.send(new CreateBucketCommand({ Bucket: this.bucket })).then(() => undefined).catch((error: unknown) => {
      if (error instanceof Error && /BucketAlreadyOwnedByYou|BucketAlreadyExists/i.test(error.name + error.message)) return
      throw error
    })
    return this.bucketReady
  }
}
