import { describe, expect, it, vi, type Mock } from 'vitest'
import { MusicError, MusicService } from './music-service'

type PrismaMock = { musicTrack: { create: Mock; findMany: Mock; findFirst: Mock; update: Mock } }
type StorageMock = { createUploadIntent: Mock; head: Mock; publicUrl: Mock }

const row = (overrides: Record<string, unknown> = {}) => ({
  id: 'track-1',
  scope: 'PERSONAL',
  status: 'READY',
  displayName: 'Song',
  artistName: null,
  durationSeconds: null,
  mimeType: 'audio/mpeg',
  sizeBytes: BigInt(100),
  storageKey: 'music/personal/track-1.mp3',
  licenseType: null,
  licenseReference: null,
  creditText: null,
  revision: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

function makeService() {
  const prisma: PrismaMock = {
    musicTrack: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  }
  const storage: StorageMock = {
    createUploadIntent: vi.fn(),
    head: vi.fn(),
    publicUrl: vi.fn((key: string) => `https://cdn.test/${key}`),
  }
  return { service: new MusicService(prisma as never, storage as never), prisma, storage }
}

describe('MusicService', () => {
  it('creates a personal upload intent with a private owner', async () => {
    const { service, prisma, storage } = makeService()
    storage.createUploadIntent.mockResolvedValue({
      uploadUrl: 'https://upload.test',
      method: 'PUT',
      headers: {},
      expiresAt: new Date(),
    })
    prisma.musicTrack.create.mockResolvedValue(row({ status: 'DRAFT' }))
    const result = await service.createPersonalIntent('user-1', {
      displayName: ' Song ',
      mimeType: 'audio/mpeg',
      sizeBytes: 100,
    })
    expect(result.upload.uploadUrl).toBe('https://upload.test')
    expect(prisma.musicTrack.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ownerUserId: 'user-1', scope: 'PERSONAL' }),
      }),
    )
  })

  it('requires license metadata for system music', async () => {
    const { service } = makeService()
    await expect(
      service.createAdminIntent('admin-1', {
        displayName: 'Song',
        mimeType: 'audio/mpeg',
        sizeBytes: 100,
      }),
    ).rejects.toMatchObject({ code: 'MUSIC_LICENSE_REQUIRED' })
  })

  it('rejects unsupported or oversized uploads before storage access', async () => {
    const { service, storage } = makeService()
    await expect(
      service.createPersonalIntent('user-1', {
        displayName: 'Song',
        mimeType: 'audio/wav',
        sizeBytes: 100,
      }),
    ).rejects.toBeInstanceOf(MusicError)
    await expect(
      service.createPersonalIntent('user-1', {
        displayName: 'Song',
        mimeType: 'audio/mpeg',
        sizeBytes: 15 * 1024 * 1024 + 1,
      }),
    ).rejects.toMatchObject({ code: 'MUSIC_INVALID_INPUT' })
    expect(storage.createUploadIntent).not.toHaveBeenCalled()
  })
})
