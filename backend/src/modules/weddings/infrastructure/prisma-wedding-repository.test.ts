import type { PrismaClient } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'

import type { WeddingContentView } from '../application/ports'
import { collectMediaIds, PrismaWeddingRepository } from './prisma-wedding-repository'

describe('PrismaWeddingRepository.saveContentOwned', () => {
  it('only validates persisted media asset UUIDs', () => {
    expect(
      [...
        collectMediaIds({
          heroMedia: { mediaAssetId: 'c7a1c6f2-7af9-40d6-890e-ac7a7c8dd3d0' },
          timeline: { image: { mediaAssetId: 'demo-couple-garden-walk' } },
        }),
      ],
    ).toEqual(['c7a1c6f2-7af9-40d6-890e-ac7a7c8dd3d0'])
  })

  it('keeps the published snapshot live while saving an invitation draft', async () => {
    const transaction = {
      weddingContent: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      publishedWeddingSnapshot: {
        updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        count: vi.fn(),
      },
      publishedRecapSnapshot: { count: vi.fn() },
      wedding: { update: vi.fn() },
    }
    const prisma = {
      wedding: {
        findFirst: vi.fn().mockResolvedValue({ id: 'wedding-1' }),
      },
      templateVersion: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'template-version-1',
          deprecatedAt: null,
          contentSchemaVersion: 1,
          config: { sections: [{ sectionKey: 'cover', required: true }] },
          template: { key: 'test-invitation', productType: 'ONLINE_INVITATION' },
        }),
      },
      weddingContent: {
        findUnique: vi.fn().mockResolvedValue({ revision: 1 }),
      },
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<void>) =>
        callback(transaction),
      ),
    }
    const repository = new PrismaWeddingRepository(prisma as unknown as PrismaClient)
    const saved: WeddingContentView = {
      content: {},
      schemaVersion: 1,
      revision: 2,
      surface: 'ONLINE_INVITATION',
      themeConfig: {},
      sectionConfig: { enabled: ['cover'], order: ['cover'] },
      templateVersion: {
        id: 'template-version-1',
        key: 'test-invitation',
        version: '1.0.0',
        config: {},
      },
      status: 'DRAFT',
      publishedAt: null,
    }
    vi.spyOn(repository, 'getContentOwned').mockResolvedValue(saved)

    await expect(
      repository.saveContentOwned('user-1', 'wedding-1', {
        surface: 'ONLINE_INVITATION',
        templateVersionId: 'template-version-1',
        content: {},
        themeConfig: {},
        sectionConfig: { enabled: ['cover'], order: ['cover'] },
        revision: 1,
      }),
    ).resolves.toEqual(saved)

    expect(transaction.weddingContent.updateMany).toHaveBeenCalledWith({
      where: { weddingId: 'wedding-1', surface: 'ONLINE_INVITATION', revision: 1 },
      data: {
        templateVersionId: 'template-version-1',
        schemaVersion: 1,
        content: {},
        themeConfig: {},
        sectionConfig: { enabled: ['cover'], order: ['cover'] },
        status: 'DRAFT',
        revision: 2,
      },
    })
  })
})
