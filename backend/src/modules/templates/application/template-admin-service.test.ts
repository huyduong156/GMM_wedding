import { describe, expect, it, vi } from 'vitest'
import {
  TemplateAdminService,
  templateCompatibility,
  templateConfigHash,
  templateContentChanged,
} from './template-admin-service'

describe('templateCompatibility', () => {
  it('accepts the currently supported contracts', () => {
    expect(
      templateCompatibility({
        templateConfigVersion: 1,
        contentSchemaVersion: 1,
        rendererApiVersion: 1,
        config: { sections: ['hero'] },
      }),
    ).toMatchObject({ compatible: true, issues: [] })
  })

  it('reports every incompatible contract before release', () => {
    const result = templateCompatibility({
      templateConfigVersion: 2,
      contentSchemaVersion: 3,
      rendererApiVersion: 4,
      config: [],
    })
    expect(result.compatible).toBe(false)
    expect(result.issues).toHaveLength(4)
  })
})

describe('templateConfigHash', () => {
  it('keeps lifecycle-only source metadata outside the immutable config hash', () => {
    expect(
      templateConfigHash({
        sections: [{ sectionKey: 'hero' }],
        sourceHash: 'raw-source',
        sourceContentHash: 'content-a',
      }),
    ).toBe(
      templateConfigHash({
        sections: [{ sectionKey: 'hero' }],
        sourceHash: 'raw-source',
        sourceContentHash: 'content-b',
      }),
    )
  })

  it('migrates a scanner-era record when only lifecycle source metadata changed', () => {
    const existingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceFile: 'invitations/example/template-config.ts',
      sourceHash: 'review-source',
    }
    const incomingConfig = {
      ...existingConfig,
      sourceHash: 'ready-source',
      sourceContentHash: 'same-template-content',
    }

    expect(
      templateContentChanged(existingConfig, templateConfigHash(existingConfig), incomingConfig),
    ).toBe(false)
  })

  it('still detects a real content change after sourceContentHash is available', () => {
    const existingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-a',
      sourceContentHash: 'content-a',
    }
    const incomingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-b',
      sourceContentHash: 'content-b',
    }

    expect(
      templateContentChanged(existingConfig, templateConfigHash(existingConfig), incomingConfig),
    ).toBe(true)
  })
})

describe('TemplateAdminService sync concurrency', () => {
  it('requires a version bump when released config changes in production', async () => {
    const existingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-a',
      sourceContentHash: 'content-a',
    }
    const versionUpdate = vi.fn()
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
          update: vi.fn(),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([{
            id: 'version-id',
            version: '1.0.0',
            config: existingConfig,
            configHash: templateConfigHash(existingConfig),
            codeRevision: 'revision-a',
            templateConfigVersion: 1,
            contentSchemaVersion: 1,
            rendererApiVersion: 1,
            sourceStatus: 'READY',
            releasedAt: new Date('2026-01-01T00:00:00.000Z'),
            deprecatedAt: null,
          }]),
          update: versionUpdate,
        },
        auditLog: { create: vi.fn() },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never)

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-04T00:00:00.000Z',
          sourceRevision: 'revision-b',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '1.0.0',
              sourceStatus: 'READY',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config: {
                sections: [{ sectionKey: 'hero' }],
                sourceHash: 'source-b',
                sourceContentHash: 'content-b',
              },
            },
          ],
        },
        'request-id',
      ),
    ).rejects.toMatchObject({ code: 'TEMPLATE_VERSION_HASH_CONFLICT', status: 409 })
    expect(versionUpdate).not.toHaveBeenCalled()
  })

  it('updates a released row in place when patch version increases within the same major', async () => {
    const existingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-a',
      sourceContentHash: 'content-a',
    }
    const incomingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-b',
      sourceContentHash: 'content-b',
    }
    const versionUpdate = vi.fn().mockResolvedValue({})
    const auditCreate = vi.fn().mockResolvedValue({})
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
          update: vi.fn(),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: 'version-id',
              version: '1.0.0',
              config: existingConfig,
              configHash: templateConfigHash(existingConfig),
              codeRevision: 'revision-a',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              sourceStatus: 'READY',
              releasedAt: new Date('2026-01-01T00:00:00.000Z'),
              deprecatedAt: null,
            },
          ]),
          update: versionUpdate,
        },
        auditLog: { create: auditCreate },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never)

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-04T00:00:00.000Z',
          sourceRevision: 'revision-b',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '1.0.1',
              sourceStatus: 'READY',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config: incomingConfig,
            },
          ],
        },
        'request-id',
      ),
    ).resolves.toMatchObject({ created: 0, updated: 1, unchanged: 0 })
    expect(versionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'version-id' },
        data: expect.objectContaining({ version: '1.0.1', config: incomingConfig }),
      }),
    )
    expect(auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'template.version_updated',
          metadata: expect.objectContaining({ previousVersion: '1.0.0', version: '1.0.1' }),
        }),
      }),
    )
  })

  it('does not apply a review revision over a released major', async () => {
    const config = {
      sections: [{ sectionKey: 'hero' }],
      sourceContentHash: 'content-a',
    }
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: 'version-id',
              version: '1.0.0',
              config,
              configHash: templateConfigHash(config),
              codeRevision: 'revision-a',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              sourceStatus: 'READY',
              releasedAt: new Date('2026-01-01T00:00:00.000Z'),
              deprecatedAt: null,
            },
          ]),
        },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never)

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-04T00:00:00.000Z',
          sourceRevision: 'revision-b',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '1.0.1',
              sourceStatus: 'REVIEW',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config,
            },
          ],
        },
        'request-id',
      ),
    ).rejects.toMatchObject({ code: 'TEMPLATE_SOURCE_NOT_READY', status: 409 })
  })

  it('creates a new row only when the incoming version has a new major', async () => {
    const versionCreate = vi.fn().mockResolvedValue({ id: 'version-v2' })
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
          update: vi.fn(),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([{ version: '1.0.2' }]),
          create: versionCreate,
        },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never)

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-04T00:00:00.000Z',
          sourceRevision: 'revision-v2',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '2.0.1',
              sourceStatus: 'READY',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config: { sections: [{ sectionKey: 'hero' }] },
            },
          ],
        },
        'request-id',
      ),
    ).resolves.toMatchObject({ created: 1, updated: 0, unchanged: 0 })
    expect(versionCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ version: '2.0.1' }) }),
    )
  })

  it('rejects a version downgrade within the same major', async () => {
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([{ version: '1.0.2' }]),
        },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never)

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-04T00:00:00.000Z',
          sourceRevision: 'revision',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '1.0.1',
              sourceStatus: 'READY',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config: { sections: [{ sectionKey: 'hero' }] },
            },
          ],
        },
        'request-id',
      ),
    ).rejects.toMatchObject({ code: 'TEMPLATE_VERSION_DOWNGRADE', status: 409 })
  })

  it('updates a released version in place only when the local override is enabled', async () => {
    const existingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-a',
      sourceContentHash: 'content-a',
    }
    const incomingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceHash: 'source-b',
      sourceContentHash: 'content-b',
    }
    const versionUpdate = vi.fn().mockResolvedValue({})
    const auditCreate = vi.fn().mockResolvedValue({})
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
          update: vi.fn(),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([{
            id: 'version-id',
            version: '1.0.0',
            config: existingConfig,
            configHash: templateConfigHash(existingConfig),
            codeRevision: 'revision-a',
            templateConfigVersion: 1,
            contentSchemaVersion: 1,
            rendererApiVersion: 1,
            sourceStatus: 'READY',
            releasedAt: new Date('2026-01-01T00:00:00.000Z'),
            deprecatedAt: null,
          }]),
          update: versionUpdate,
        },
        auditLog: { create: auditCreate },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never, {
      allowSameVersionMutation: true,
    })

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-04T00:00:00.000Z',
          sourceRevision: 'revision-b',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '1.0.0',
              sourceStatus: 'READY',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config: incomingConfig,
            },
          ],
        },
        'request-id',
      ),
    ).resolves.toMatchObject({ created: 0, updated: 1, unchanged: 0 })
    expect(versionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'version-id' },
        data: expect.objectContaining({ config: incomingConfig }),
      }),
    )
    expect(auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'template.version_synced_local_override' }),
      }),
    )
  })

  it('upgrades a released scanner-era fingerprint without creating a new version', async () => {
    const existingConfig = {
      sections: [{ sectionKey: 'hero' }],
      sourceFile: 'invitations/modern-luxe/template-config.ts',
      sourceHash: 'scanner-source',
    }
    const incomingConfig = {
      ...existingConfig,
      sourceHash: 'bundle-source',
      sourceContentHash: 'stable-content',
    }
    const versionUpdate = vi.fn().mockResolvedValue({})
    const transaction = vi.fn(async (operation: (tx: unknown) => unknown) =>
      operation({
        template: {
          upsert: vi.fn().mockResolvedValue({
            id: 'template-id',
            productType: 'ONLINE_INVITATION',
          }),
          update: vi.fn(),
        },
        templateVersion: {
          findMany: vi.fn().mockResolvedValue([{
            id: 'version-id',
            version: '1.0.0',
            config: existingConfig,
            configHash: templateConfigHash(existingConfig),
            codeRevision: 'revision-a',
            templateConfigVersion: 1,
            contentSchemaVersion: 1,
            rendererApiVersion: 1,
            sourceStatus: 'READY',
            releasedAt: new Date('2026-01-01T00:00:00.000Z'),
            deprecatedAt: null,
          }]),
          update: versionUpdate,
          create: vi.fn(),
        },
        auditLog: { create: vi.fn() },
      }),
    )
    const service = new TemplateAdminService({ $transaction: transaction } as never)

    await expect(
      service.sync(
        { userId: 'admin' } as never,
        {
          bundleVersion: 1,
          generatedAt: '2026-10-03T00:00:00.000Z',
          sourceRevision: 'revision',
          templates: [
            {
              templateKey: 'modern-luxe',
              displayName: 'Modern Luxe',
              productType: 'ONLINE_INVITATION',
              templateVersion: '1.0.0',
              sourceStatus: 'READY',
              templateConfigVersion: 1,
              contentSchemaVersion: 1,
              rendererApiVersion: 1,
              config: incomingConfig,
            },
          ],
        },
        'request-id',
      ),
    ).resolves.toMatchObject({ created: 0, updated: 1, unchanged: 0 })
    expect(versionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'version-id' },
        data: expect.objectContaining({
          configHash: templateConfigHash(incomingConfig),
          config: incomingConfig,
          sourceStatus: 'READY',
        }),
      }),
    )
  })

  it('retries database races and returns a stable conflict instead of a 500', async () => {
    const transaction = vi.fn().mockRejectedValue({ code: 'P2002' })
    const service = new TemplateAdminService({ $transaction: transaction } as never)
    const sync = service.sync(
      { userId: 'admin' } as never,
      {
        bundleVersion: 1,
        generatedAt: '2026-10-03T00:00:00.000Z',
        sourceRevision: 'revision',
        templates: [
          {
            templateKey: 'modern-luxe',
            displayName: 'Modern Luxe',
            productType: 'ONLINE_INVITATION',
            templateVersion: '1.0.0',
            sourceStatus: 'READY',
            templateConfigVersion: 1,
            contentSchemaVersion: 1,
            rendererApiVersion: 1,
            config: { sections: [{ sectionKey: 'hero' }] },
          },
        ],
      },
      'request-id',
    )

    await expect(sync).rejects.toMatchObject({ code: 'TEMPLATE_SYNC_CONFLICT', status: 409 })
    expect(transaction).toHaveBeenCalledTimes(3)
  })

  it('retries one Neon transaction timeout and returns a stable 503', async () => {
    const transaction = vi.fn().mockRejectedValue({ code: 'P2028' })
    const service = new TemplateAdminService({ $transaction: transaction } as never)
    const sync = service.sync(
      { userId: 'admin' } as never,
      {
        bundleVersion: 1,
        generatedAt: '2026-10-03T00:00:00.000Z',
        sourceRevision: 'revision',
        templates: [
          {
            templateKey: 'modern-luxe',
            displayName: 'Modern Luxe',
            productType: 'ONLINE_INVITATION',
            templateVersion: '1.0.0',
            sourceStatus: 'READY',
            templateConfigVersion: 1,
            contentSchemaVersion: 1,
            rendererApiVersion: 1,
            config: { sections: [{ sectionKey: 'hero' }] },
          },
        ],
      },
      'request-id',
    )

    await expect(sync).rejects.toMatchObject({
      code: 'TEMPLATE_SYNC_DATABASE_TIMEOUT',
      status: 503,
    })
    expect(transaction).toHaveBeenCalledTimes(2)
  })
})
