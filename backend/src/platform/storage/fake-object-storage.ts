import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { getServerEnv } from '@/platform/config/env'
import type { ObjectStorage, StoredObject, UploadIntent } from './object-storage'

function safePath(root: string, key: string) {
  const target = resolve(root, key)
  const rel = relative(root, target)
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Invalid storage key')
  return target
}

export class FakeObjectStorage implements ObjectStorage {
  private root() { return resolve(process.cwd(), getServerEnv().MEDIA_FAKE_ROOT) }
  async createUploadIntent(key: string, mimeType: string, sizeBytes: number): Promise<UploadIntent> {
    void key; void mimeType; void sizeBytes
    return { uploadUrl: 'backend-upload', method: 'PUT', headers: { 'content-type': mimeType }, expiresAt: new Date(Date.now() + 15 * 60_000) }
  }
  async put(key: string, body: Uint8Array, mimeType: string): Promise<StoredObject> {
    const target = safePath(this.root(), key)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, body)
    return { sizeBytes: body.byteLength, mimeType }
  }
  async head(key: string): Promise<StoredObject | null> {
    try { const target = safePath(this.root(), key); const info = await stat(target); return { sizeBytes: info.size, mimeType: 'application/octet-stream' } } catch { return null }
  }
  async delete(key: string) { try { await unlink(safePath(this.root(), key)) } catch { /* idempotent */ } }
  publicUrl(key: string) { const base = getServerEnv().MEDIA_PUBLIC_BASE_URL ?? '/api/media/fake-assets'; return `${base.replace(/\/$/, '')}/${key}` }
  async read(key: string) { return readFile(safePath(this.root(), key)) }
}
