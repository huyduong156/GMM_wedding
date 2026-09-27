import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getServerEnv } from '@/platform/config/env'
import type { ObjectStorage, StoredObject, UploadIntent } from './object-storage'

type S3CompatibleStorageConfig = {
  endpoint: string
  publicEndpoint?: string | undefined
  publicBaseUrl?: string | undefined
  bucket: string
  region: string
  forcePathStyle: boolean
  accessKeyId: string
  secretAccessKey: string
  createBucket: boolean
}

export class S3ObjectStorage implements ObjectStorage {
  private readonly config: S3CompatibleStorageConfig
  private readonly client: S3Client
  private readonly presignClient: S3Client
  private bucketReady: Promise<void> | undefined

  constructor(config?: S3CompatibleStorageConfig) {
    const env = getServerEnv()
    const resolvedConfig =
      config ??
      (env.S3_ENDPOINT && env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
        ? {
            endpoint: env.S3_ENDPOINT,
            publicEndpoint: env.S3_PUBLIC_ENDPOINT,
            bucket: env.S3_BUCKET,
            region: env.S3_REGION,
            forcePathStyle: env.S3_FORCE_PATH_STYLE,
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
            createBucket: true,
          }
        : undefined)
    if (!resolvedConfig) throw new Error('S3 storage requires endpoint, bucket and credentials')
    this.config = resolvedConfig
    const credentials = {
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
    }
    this.client = new S3Client({
      region: this.config.region,
      endpoint: this.config.endpoint,
      forcePathStyle: this.config.forcePathStyle,
      credentials,
    })
    this.presignClient = new S3Client({
      region: this.config.region,
      endpoint: this.config.publicEndpoint ?? this.config.endpoint,
      forcePathStyle: this.config.forcePathStyle,
      credentials,
    })
  }

  async createUploadIntent(
    key: string,
    mimeType: string,
    sizeBytes: number,
  ): Promise<UploadIntent> {
    await this.ensureBucket()
    void sizeBytes
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: mimeType,
    })
    const signed = await getSignedUrl(this.presignClient, command, { expiresIn: 900 })
    return {
      uploadUrl: signed,
      method: 'PUT',
      headers: { 'content-type': mimeType },
      expiresAt: new Date(Date.now() + 900_000),
    }
  }

  async put(key: string, body: Uint8Array, mimeType: string): Promise<StoredObject> {
    await this.ensureBucket()
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
        ContentLength: body.byteLength,
      }),
    )
    return { sizeBytes: body.byteLength, mimeType }
  }

  async head(key: string): Promise<StoredObject | null> {
    try {
      await this.ensureBucket()
      const result = await this.client.send(
        new HeadObjectCommand({ Bucket: this.config.bucket, Key: key }),
      )
      return result.ContentLength === undefined
        ? null
        : {
            sizeBytes: result.ContentLength,
            mimeType: result.ContentType ?? 'application/octet-stream',
          }
    } catch {
      return null
    }
  }

  async delete(key: string) {
    await this.ensureBucket()
    await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }))
  }
  publicUrl(key: string) {
    const endpoint = (this.config.publicBaseUrl ?? this.config.publicEndpoint ?? this.config.endpoint).replace(
      new RegExp('/+$'),
      '',
    )
    return this.config.publicBaseUrl
      ? `${endpoint}/${key}`
      : `${endpoint}/${this.config.bucket}/${key}`
  }

  private ensureBucket() {
    if (!this.config.createBucket) return Promise.resolve()
    this.bucketReady ??= this.client
      .send(new CreateBucketCommand({ Bucket: this.config.bucket }))
      .then(() => undefined)
      .catch((error: unknown) => {
        if (
          error instanceof Error &&
          /BucketAlreadyOwnedByYou|BucketAlreadyExists/i.test(error.name + error.message)
        )
          return
        throw error
      })
    return this.bucketReady
  }
}

export class R2ObjectStorage extends S3ObjectStorage {
  constructor() {
    const env = getServerEnv()
    if (!env.R2_ENDPOINT || !env.R2_BUCKET || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY)
      throw new Error('R2 storage requires endpoint, bucket and credentials')
    super({
      endpoint: env.R2_ENDPOINT,
      publicEndpoint: env.R2_ENDPOINT,
      publicBaseUrl: env.R2_PUBLIC_BASE_URL,
      bucket: env.R2_BUCKET,
      region: env.R2_REGION,
      forcePathStyle: false,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      createBucket: false,
    })
  }
}
