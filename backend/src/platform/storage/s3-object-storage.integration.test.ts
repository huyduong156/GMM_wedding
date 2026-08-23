import { describe, expect, it } from 'vitest'
import { S3ObjectStorage } from './s3-object-storage'

describe.skipIf(process.env.S3_INTEGRATION !== 'true')('S3ObjectStorage with MinIO', () => {
  it('creates an upload intent, stores, heads and deletes an object', async () => {
    const storage = new S3ObjectStorage()
    const key = `tests/music-${Date.now()}.mp3`
    const body = Buffer.from('fake-mp3-content')
    const intent = await storage.createUploadIntent(key, 'audio/mpeg', body.length)
    const response = await fetch(intent.uploadUrl, { method: intent.method, headers: intent.headers, body })
    expect(response.ok).toBe(true)
    await expect(storage.head(key)).resolves.toMatchObject({ sizeBytes: body.length })
    await storage.delete(key)
    await expect(storage.head(key)).resolves.toBeNull()
  })
})
