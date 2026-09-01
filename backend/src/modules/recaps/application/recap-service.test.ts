import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import type { ObjectStorage } from '@/platform/storage/object-storage'
import { RecapError, RecapService } from './recap-service'

const template = (overrides: Record<string, unknown> = {}) => ({
  id: 'template-version-1',
  version: '1.0.0',
  config: { sections: ['opening', 'chapters', 'filmstrip'] },
  releasedAt: new Date(),
  deprecatedAt: null,
  contentSchemaVersion: 1,
  template: { key: 'winter-wedding', productType: 'RECAP', name: 'Winter Wedding Recap' },
  ...overrides,
})

const recap = (overrides: Record<string, unknown> = {}) => ({
  id: 'recap-1',
  weddingId: 'wedding-1',
  status: 'DRAFT',
  slug: null,
  title: 'Ngày vui',
  thankYouMessage: null,
  ogTitle: null,
  ogDescription: null,
  ogImageUrl: null,
  content: { opening: { title: 'Ngày vui' } },
  themeConfig: {},
  sectionConfig: {
    enabled: ['opening', 'chapters', 'filmstrip'],
    order: ['opening', 'chapters', 'filmstrip'],
  },
  revision: 1,
  publishedAt: null,
  updatedAt: new Date(),
  templateVersion: template(),
  mediaItems: [],
  wishSelections: [],
  ...overrides,
})

function makeService() {
  const prisma = {
    wedding: { findFirst: vi.fn(), update: vi.fn() },
    weddingRecap: { findFirst: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn(), create: vi.fn() },
    templateVersion: { findUnique: vi.fn() },
    mediaAsset: { findMany: vi.fn() },
    wish: { findMany: vi.fn() },
    recapMediaItem: { deleteMany: vi.fn(), createMany: vi.fn() },
    recapWishSelection: { deleteMany: vi.fn(), createMany: vi.fn() },
    publishedRecapSnapshot: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      aggregate: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    publishedWeddingSnapshot: { findFirst: vi.fn(), count: vi.fn() },
    $transaction: vi.fn(),
  }
  prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) =>
    callback(prisma),
  )
  const storage = { publicUrl: vi.fn((key: string) => 'https://cdn.test/' + key) }
  return {
    service: new RecapService(
      prisma as unknown as PrismaClient,
      storage as unknown as ObjectStorage,
    ),
    prisma,
    storage,
  }
}

describe('RecapService', () => {
  it('returns an empty draft for an owned wedding without recap data', async () => {
    const { service, prisma } = makeService()
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1' })
    prisma.weddingRecap.findUnique.mockResolvedValue(null)
    await expect(service.getDraft('user-1', 'wedding-1')).resolves.toBeNull()
  })

  it('rejects a non-recap or unreleased template', async () => {
    const { service, prisma } = makeService()
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1' })
    prisma.templateVersion.findUnique.mockResolvedValue(template({ releasedAt: null }))
    await expect(
      service.saveDraft('user-1', 'wedding-1', {
        templateVersionId: 'template-version-1',
        title: 'Ngày vui',
        content: {},
        themeConfig: {},
        sectionConfig: { enabled: ['opening'], order: ['opening', 'chapters', 'filmstrip'] },
        mediaItems: [],
        wishSelections: [],
        revision: 1,
      }),
    ).rejects.toMatchObject({ code: 'RECAP_TEMPLATE_NOT_FOUND' })
  })

  it('rejects media that is not ready or does not belong to the wedding', async () => {
    const { service, prisma } = makeService()
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1' })
    prisma.templateVersion.findUnique.mockResolvedValue(template())
    prisma.mediaAsset.findMany.mockResolvedValue([])
    prisma.wish.findMany.mockResolvedValue([])
    await expect(
      service.saveDraft('user-1', 'wedding-1', {
        templateVersionId: 'template-version-1',
        title: 'Ngày vui',
        content: {},
        themeConfig: {},
        sectionConfig: { enabled: ['opening'], order: ['opening', 'chapters', 'filmstrip'] },
        mediaItems: [{ mediaAssetId: 'media-1', sortOrder: 0 }],
        wishSelections: [],
        revision: 1,
      }),
    ).rejects.toMatchObject({ code: 'RECAP_MEDIA_NOT_READY' })
  })

  it('rejects stale draft revisions before writing', async () => {
    const { service, prisma } = makeService()
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1' })
    prisma.templateVersion.findUnique.mockResolvedValue(template())
    prisma.mediaAsset.findMany.mockResolvedValue([])
    prisma.wish.findMany.mockResolvedValue([])
    prisma.weddingRecap.findUnique.mockResolvedValue({ id: 'recap-1', revision: 4 })
    await expect(
      service.saveDraft('user-1', 'wedding-1', {
        templateVersionId: 'template-version-1',
        title: 'Ngày vui',
        content: {},
        themeConfig: {},
        sectionConfig: { enabled: ['opening'], order: ['opening', 'chapters', 'filmstrip'] },
        mediaItems: [],
        wishSelections: [],
        revision: 3,
      }),
    ).rejects.toMatchObject({ code: 'RECAP_REVISION_CONFLICT' })
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('publishes a validated immutable snapshot', async () => {
    const { service, prisma } = makeService()
    const current = recap()
    const createdSnapshot = {
      id: 'snapshot-1',
      recapId: 'recap-1',
      slug: 'mai-duc-wedding',
      version: 1,
      payload: { surface: 'RECAP' },
      payloadHash: 'hash',
      publishedAt: new Date(),
      templateVersion: { template: { key: 'winter-wedding' }, version: '1.0.0' },
    }
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1', slug: 'mai-duc-wedding' })
    prisma.weddingRecap.findUnique.mockResolvedValue(current)
    prisma.templateVersion.findUnique.mockResolvedValue(template())
    prisma.mediaAsset.findMany.mockResolvedValue([])
    prisma.wish.findMany.mockResolvedValue([])
    prisma.publishedRecapSnapshot.findFirst.mockResolvedValue(null)
    prisma.publishedWeddingSnapshot.findFirst.mockResolvedValue(null)
    prisma.publishedRecapSnapshot.aggregate.mockResolvedValue({ _max: { version: null } })
    prisma.publishedRecapSnapshot.create.mockResolvedValue(createdSnapshot)
    prisma.weddingRecap.updateMany.mockResolvedValue({ count: 1 })
    prisma.publishedRecapSnapshot.updateMany.mockResolvedValue({ count: 0 })
    prisma.wedding.update.mockResolvedValue({})
    const result = await service.publish('user-1', 'wedding-1', { revision: 1 })
    expect(result).toMatchObject({ id: 'snapshot-1', slug: 'mai-duc-wedding', version: 1 })
    expect(prisma.publishedRecapSnapshot.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ recapId: 'recap-1', slug: 'mai-duc-wedding', version: 1 }),
      }),
    )
    expect(prisma.weddingRecap.updateMany).toHaveBeenCalled()
  })

  it('does not expose a public snapshot after it is unpublished', async () => {
    const { service, prisma } = makeService()
    prisma.publishedRecapSnapshot.findFirst.mockResolvedValue(null)
    await expect(service.publicSnapshot('missing-recap')).rejects.toMatchObject({
      code: 'RECAP_PUBLIC_NOT_FOUND',
    })
  })

  it('checks recap slugs against wedding and recap snapshots', async () => {
    const { service, prisma } = makeService()
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1' })
    prisma.publishedWeddingSnapshot.findFirst.mockResolvedValue({ id: 'wedding-snapshot' })
    prisma.publishedRecapSnapshot.findFirst.mockResolvedValue(null)
    await expect(service.slugAvailable('user-1', 'taken-slug', 'wedding-1')).resolves.toBe(false)
  })

  it('rejects unsupported section configuration', async () => {
    const { service, prisma } = makeService()
    prisma.wedding.findFirst.mockResolvedValue({ id: 'wedding-1' })
    prisma.templateVersion.findUnique.mockResolvedValue(template())
    await expect(
      service.saveDraft('user-1', 'wedding-1', {
        templateVersionId: 'template-version-1',
        title: 'Ngày vui',
        content: {},
        themeConfig: {},
        sectionConfig: { enabled: ['opening'], order: ['opening', 'unknown', 'filmstrip'] },
        mediaItems: [],
        wishSelections: [],
        revision: 1,
      }),
    ).rejects.toMatchObject({ code: 'RECAP_SECTION_INVALID' })
  })

  it('keeps domain errors typed', () => {
    const error = new RecapError('RECAP_NOT_FOUND', 404, 'Not found')
    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe('RECAP_NOT_FOUND')
  })
})
