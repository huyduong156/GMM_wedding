import { createHash } from 'node:crypto'
import { Prisma, type PrismaClient } from '@prisma/client'

import type { PlatformAdminActor } from '@/platform/auth/actor-context'
import { TemplateAdminError } from '../domain/template-admin-error'
import type {
  AdminTemplateListQuery,
  TemplateReleaseBundle,
} from '../interface/template-admin-schemas'

export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object')
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(',')}}`
  return JSON.stringify(value)
}

export function templateConfigHash(config: unknown) {
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    const { sourceContentHash: _sourceContentHash, ...persistedConfig } = config as Record<
      string,
      unknown
    >
    void _sourceContentHash
    return createHash('sha256').update(stableJson(persistedConfig)).digest('hex')
  }
  return createHash('sha256').update(stableJson(config)).digest('hex')
}

function sourceContentHash(config: unknown) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return null
  const value = (config as Record<string, unknown>).sourceContentHash
  return typeof value === 'string' ? value : null
}

function comparableLegacyConfig(config: unknown) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return config
  const {
    sourceHash: _sourceHash,
    sourceContentHash: _sourceContentHash,
    ...comparable
  } = config as Record<string, unknown>
  void _sourceHash
  void _sourceContentHash
  return comparable
}

export function templateContentChanged(
  existingConfig: unknown,
  existingConfigHash: string,
  incomingConfig: unknown,
) {
  const incomingConfigHash = templateConfigHash(incomingConfig)
  if (existingConfigHash === incomingConfigHash) return false

  const existingContentHash = sourceContentHash(existingConfig)
  const incomingContentHash = sourceContentHash(incomingConfig)
  if (existingContentHash && incomingContentHash)
    return existingContentHash !== incomingContentHash

  // Scanner-era rows predate sourceContentHash. Compare their persisted
  // contract fields during the one-way migration so a status-only sourceHash
  // change does not look like an immutable template change.
  return (
    stableJson(comparableLegacyConfig(existingConfig)) !==
    stableJson(comparableLegacyConfig(incomingConfig))
  )
}

type ParsedTemplateVersion = {
  major: number
  minor: number
  patch: number
  prerelease: string[]
}

function parseTemplateVersion(version: string): ParsedTemplateVersion {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version)
  if (!match)
    throw new TemplateAdminError(
      'TEMPLATE_VERSION_INVALID',
      409,
      `Stored template version is invalid: ${version}`,
    )
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4]?.split('.') ?? [],
  }
}

export function templateVersionMajor(version: string) {
  return parseTemplateVersion(version).major
}

export function compareTemplateVersions(left: string, right: string) {
  const a = parseTemplateVersion(left)
  const b = parseTemplateVersion(right)
  for (const key of ['major', 'minor', 'patch'] as const) {
    if (a[key] !== b[key]) return a[key] > b[key] ? 1 : -1
  }
  if (!a.prerelease.length && !b.prerelease.length) return 0
  if (!a.prerelease.length) return 1
  if (!b.prerelease.length) return -1
  const length = Math.max(a.prerelease.length, b.prerelease.length)
  for (let index = 0; index < length; index += 1) {
    const leftIdentifier = a.prerelease[index]
    const rightIdentifier = b.prerelease[index]
    if (leftIdentifier === undefined) return -1
    if (rightIdentifier === undefined) return 1
    if (leftIdentifier === rightIdentifier) continue
    const leftNumeric = /^\d+$/.test(leftIdentifier)
    const rightNumeric = /^\d+$/.test(rightIdentifier)
    if (leftNumeric && rightNumeric)
      return Number(leftIdentifier) > Number(rightIdentifier) ? 1 : -1
    if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1
    return leftIdentifier.localeCompare(rightIdentifier) > 0 ? 1 : -1
  }
  return 0
}

function reviewStatus(version: { releasedAt: Date | null; deprecatedAt: Date | null }) {
  if (version.deprecatedAt) return 'DEPRECATED' as const
  if (version.releasedAt) return 'RELEASED' as const
  return 'PENDING_REVIEW' as const
}

const SUPPORTED_CONTRACT = {
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
} as const

export function templateCompatibility(version: {
  templateConfigVersion: number
  contentSchemaVersion: number
  rendererApiVersion: number
  config: unknown
}) {
  const issues: string[] = []
  if (version.templateConfigVersion !== SUPPORTED_CONTRACT.templateConfigVersion)
    issues.push(`Template config v${version.templateConfigVersion} chưa được hỗ trợ`)
  if (version.contentSchemaVersion !== SUPPORTED_CONTRACT.contentSchemaVersion)
    issues.push(`Content schema v${version.contentSchemaVersion} chưa được hỗ trợ`)
  if (version.rendererApiVersion !== SUPPORTED_CONTRACT.rendererApiVersion)
    issues.push(`Renderer API v${version.rendererApiVersion} chưa được hỗ trợ`)
  if (!version.config || typeof version.config !== 'object' || Array.isArray(version.config))
    issues.push('Config phải là một object JSON')
  else if (
    !Array.isArray((version.config as { sections?: unknown }).sections) ||
    (version.config as { sections: unknown[] }).sections.length === 0
  )
    issues.push('Config phải khai báo ít nhất một section')
  return { compatible: issues.length === 0, issues, supported: SUPPORTED_CONTRACT }
}

export class TemplateAdminService {
  constructor(
    private readonly db: PrismaClient,
    private readonly options: { allowSameVersionMutation?: boolean } = {},
  ) {}

  async list(query: AdminTemplateListQuery) {
    const rows = await this.db.template.findMany({
      ...(query.productType ? { where: { productType: query.productType } } : {}),
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                contentSelections: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })
    const templateIds = rows.map((template) => template.id)
    const styleRows = templateIds.length
      ? await this.db.$queryRaw<
          Array<{ templateId: string; id: string; key: string; name: string }>
        >`
          SELECT a."templateId", s.id, s.key, s.name
          FROM "TemplateStyleAssignment" a
          JOIN "TemplateStyle" s ON s.id = a."styleId"
          WHERE a."templateId" IN (${Prisma.join(templateIds.map((id) => Prisma.sql`${id}::uuid`))})
          ORDER BY s."sortOrder" ASC, s.name ASC`
      : []
    const stylesByTemplate = new Map<string, Array<{ id: string; key: string; name: string }>>()
    for (const style of styleRows) {
      const styles = stylesByTemplate.get(style.templateId) ?? []
      styles.push({ id: style.id, key: style.key, name: style.name })
      stylesByTemplate.set(style.templateId, styles)
    }
    const versionIds = rows.flatMap((template) => template.versions.map((version) => version.id))
    const auditRows = versionIds.length
      ? await this.db.auditLog.findMany({
          where: { resourceType: 'TemplateVersion', resourceId: { in: versionIds } },
          select: {
            id: true,
            resourceId: true,
            action: true,
            occurredAt: true,
            actorUser: { select: { displayName: true, email: true } },
          },
          orderBy: { occurredAt: 'desc' },
        })
      : []
    const auditByVersion = new Map<string, typeof auditRows>()
    for (const audit of auditRows) {
      if (!audit.resourceId) continue
      const entries = auditByVersion.get(audit.resourceId) ?? []
      if (entries.length < 10) entries.push(audit)
      auditByVersion.set(audit.resourceId, entries)
    }
    const items = rows
      .map((template) => ({
        key: template.key,
        name: template.name,
        productType: template.productType,
        status: template.status,
        description: template.description,
        styles: stylesByTemplate.get(template.id) ?? [],
        versions: template.versions
          .map((version) => ({
            ...version,
            reviewStatus: reviewStatus(version),
            compatibility: templateCompatibility(version),
            usageCount: version._count.contentSelections,
            recentAudit: auditByVersion.get(version.id) ?? [],
          }))
          .filter(
            (version) =>
              version.sourceStatus !== 'DEVELOPMENT' &&
              (!query.reviewStatus || version.reviewStatus === query.reviewStatus),
          ),
      }))
      .filter(
        (template) =>
          template.versions.length > 0 &&
          (!query.reviewStatus || template.versions.length > 0) &&
          (!query.styleKey || template.styles.some((style) => style.key === query.styleKey)),
      )
    const pendingReviewCount = rows.reduce(
      (count, template) =>
        count +
        template.versions.filter(
          (version) =>
            version.sourceStatus !== 'DEVELOPMENT' &&
            reviewStatus(version) === 'PENDING_REVIEW' &&
            (!query.styleKey ||
              (stylesByTemplate.get(template.id) ?? []).some(
                (style) => style.key === query.styleKey,
              )),
        ).length,
      0,
    )
    return { pendingReviewCount, items }
  }

  async detail(templateKey: string, version: string) {
    const row = await this.db.template.findUnique({
      where: { key: templateKey },
      include: { versions: { where: { version } } },
    })
    const selected = row?.versions[0]
    if (!row || !selected)
      throw new TemplateAdminError('TEMPLATE_VERSION_NOT_FOUND', 404, 'Template version not found')
    return {
      key: row.key,
      name: row.name,
      productType: row.productType,
      status: row.status,
      description: row.description,
      version: { ...selected, reviewStatus: reviewStatus(selected) },
    }
  }

  async updateThumbnail(
    actor: PlatformAdminActor,
    templateKey: string,
    version: string,
    thumbnailUrl: string | null,
    requestId: string,
  ) {
    const template = await this.db.template.findUnique({
      where: { key: templateKey },
      include: { versions: { where: { version } } },
    })
    const selected = template?.versions[0]
    if (!template || !selected)
      throw new TemplateAdminError('TEMPLATE_VERSION_NOT_FOUND', 404, 'Template version not found')
    const updated = await this.db.templateVersion.update({
      where: { id: selected.id },
      data: { thumbnailUrl },
    })
    await this.db.auditLog.create({
      data: {
        actorUserId: actor.userId,
        action: thumbnailUrl ? 'template.thumbnail_updated' : 'template.thumbnail_cleared',
        resourceType: 'TemplateVersion',
        resourceId: selected.id,
        requestId,
        metadata: { templateKey, version },
      },
    })
    return { ...updated, reviewStatus: reviewStatus(updated) }
  }

  async sync(actor: PlatformAdminActor, bundle: TemplateReleaseBundle, requestId: string) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.syncTransaction(actor, bundle, requestId)
      } catch (error) {
        const code =
          error && typeof error === 'object' && 'code' in error
            ? String((error as { code?: unknown }).code)
            : null
        const concurrencyConflict = code === 'P2002' || code === 'P2034'
        const transactionTimeout = code === 'P2028'
        if (concurrencyConflict && attempt < 2) continue
        if (transactionTimeout && attempt < 1) continue
        if (concurrencyConflict)
          throw new TemplateAdminError(
            'TEMPLATE_SYNC_CONFLICT',
            409,
            'Template catalog changed during sync; retry with the current release bundle',
          )
        if (transactionTimeout)
          throw new TemplateAdminError(
            'TEMPLATE_SYNC_DATABASE_TIMEOUT',
            503,
            'Template sync timed out while writing the database; retry the operation',
          )
        throw error
      }
    }
    throw new TemplateAdminError('TEMPLATE_SYNC_CONFLICT', 409, 'Template sync conflict')
  }

  private syncTransaction(
    actor: PlatformAdminActor,
    bundle: TemplateReleaseBundle,
    requestId: string,
  ) {
    return this.db.$transaction(
      async (tx) => {
        let created = 0
        let updated = 0
        let unchanged = 0
        const results: Array<{
          templateKey: string
          version: string
          result: 'CREATED' | 'UPDATED' | 'UNCHANGED'
        }> = []
        for (const entry of bundle.templates) {
          const hash = templateConfigHash(entry.config)
          const incomingMajor = templateVersionMajor(entry.templateVersion)
          const template = await tx.template.upsert({
            where: { key: entry.templateKey },
            create: {
              key: entry.templateKey,
              name: entry.displayName,
              productType: entry.productType,
              description: entry.description ?? null,
            },
            update: { name: entry.displayName, description: entry.description ?? null },
          })
          if (template.productType !== entry.productType)
            throw new TemplateAdminError(
              'TEMPLATE_PRODUCT_TYPE_CONFLICT',
              409,
              `Product type cannot change for ${entry.templateKey}`,
            )
          const majorVersions = (
            await tx.templateVersion.findMany({ where: { templateId: template.id } })
          ).filter((version) => templateVersionMajor(version.version) === incomingMajor)
          if (majorVersions.length > 1)
            throw new TemplateAdminError(
              'TEMPLATE_MAJOR_VERSION_CONFLICT',
              409,
              `Template ${entry.templateKey} has multiple stored rows for major version ${incomingMajor}; reset or consolidate the test catalog`,
            )
          const existing = majorVersions[0]
          if (existing) {
            const versionComparison = compareTemplateVersions(
              entry.templateVersion,
              existing.version,
            )
            if (versionComparison < 0)
              throw new TemplateAdminError(
                'TEMPLATE_VERSION_DOWNGRADE',
                409,
                `Template ${entry.templateKey} major ${incomingMajor} cannot move from ${existing.version} back to ${entry.templateVersion}`,
              )
            const contentChanged = templateContentChanged(
              existing.config,
              existing.configHash,
              entry.config,
            )
            const contractChanged =
              existing.templateConfigVersion !== entry.templateConfigVersion ||
              existing.contentSchemaVersion !== entry.contentSchemaVersion ||
              existing.rendererApiVersion !== entry.rendererApiVersion
            const definitionChanged = contentChanged || contractChanged
            const localSameVersionOverride =
              Boolean(this.options.allowSameVersionMutation) &&
              versionComparison === 0 &&
              definitionChanged
            if (
              existing.releasedAt &&
              versionComparison > 0 &&
              entry.sourceStatus !== 'READY' &&
              entry.sourceStatus !== 'DEPRECATED'
            )
              throw new TemplateAdminError(
                'TEMPLATE_SOURCE_NOT_READY',
                409,
                `Template ${entry.templateKey}@${entry.templateVersion} must be READY before updating its released major`,
              )
            const incomingCompatibility = templateCompatibility(entry)
            if (
              existing.releasedAt &&
              versionComparison > 0 &&
              !incomingCompatibility.compatible
            )
              throw new TemplateAdminError(
                'TEMPLATE_VERSION_INCOMPATIBLE',
                409,
                incomingCompatibility.issues.join('; '),
              )
            const migrateReleasedFingerprint =
              Boolean(existing.releasedAt || existing.deprecatedAt) &&
              !sourceContentHash(existing.config) &&
              Boolean(sourceContentHash(entry.config)) &&
              !contentChanged
            if (versionComparison === 0 && definitionChanged && !localSameVersionOverride)
              throw new TemplateAdminError(
                'TEMPLATE_VERSION_HASH_CONFLICT',
                409,
                `Template ${entry.templateKey}@${entry.templateVersion} changed without a version bump`,
              )
            const lifecycleChanged =
              existing.sourceStatus !== entry.sourceStatus ||
              Boolean(existing.deprecatedAt) !== (entry.sourceStatus === 'DEPRECATED')
            const metadataChanged = existing.configHash !== hash
            const shouldUpdate =
              versionComparison > 0 ||
              definitionChanged ||
              lifecycleChanged ||
              metadataChanged ||
              migrateReleasedFingerprint
            if (shouldUpdate) {
              await tx.templateVersion.update({
                where: { id: existing.id },
                data: {
                  version: entry.templateVersion,
                  configHash: hash,
                  templateConfigVersion: entry.templateConfigVersion,
                  contentSchemaVersion: entry.contentSchemaVersion,
                  rendererApiVersion: entry.rendererApiVersion,
                  codeRevision: bundle.sourceRevision,
                  sourceStatus: migrateReleasedFingerprint
                    ? existing.sourceStatus
                    : entry.sourceStatus,
                  ...(migrateReleasedFingerprint
                    ? {}
                    : entry.sourceStatus === 'DEPRECATED'
                      ? { deprecatedAt: existing.deprecatedAt ?? new Date() }
                      : { deprecatedAt: null }),
                  config: entry.config as Prisma.InputJsonValue,
                },
              })
              await tx.auditLog.create({
                data: {
                  actorUserId: actor.userId,
                  action: localSameVersionOverride
                    ? 'template.version_synced_local_override'
                    : 'template.version_updated',
                  resourceType: 'TemplateVersion',
                  resourceId: existing.id,
                  requestId,
                  metadata: {
                    templateKey: entry.templateKey,
                    previousVersion: existing.version,
                    version: entry.templateVersion,
                    sourceRevision: bundle.sourceRevision,
                  },
                },
              })
            }
            if (entry.sourceStatus === 'DEPRECATED')
              await tx.template.update({
                where: { id: template.id },
                data: { status: 'DEPRECATED' },
              })
            if (shouldUpdate) {
              updated += 1
              results.push({
                templateKey: entry.templateKey,
                version: entry.templateVersion,
                result: 'UPDATED',
              })
            } else {
              unchanged += 1
              results.push({
                templateKey: entry.templateKey,
                version: entry.templateVersion,
                result: 'UNCHANGED',
              })
            }
            continue
          }
          const createdVersion = await tx.templateVersion.create({
            data: {
              templateId: template.id,
              version: entry.templateVersion,
              configHash: hash,
              templateConfigVersion: entry.templateConfigVersion,
              contentSchemaVersion: entry.contentSchemaVersion,
              rendererApiVersion: entry.rendererApiVersion,
              codeRevision: bundle.sourceRevision,
              sourceStatus: entry.sourceStatus,
              ...(entry.sourceStatus === 'DEPRECATED' ? { deprecatedAt: new Date() } : {}),
              config: entry.config as Prisma.InputJsonValue,
            },
          })
          await tx.auditLog.create({
            data: {
              actorUserId: actor.userId,
              action: 'template.version_synced',
              resourceType: 'TemplateVersion',
              resourceId: createdVersion.id,
              requestId,
              metadata: {
                templateKey: entry.templateKey,
                version: entry.templateVersion,
                sourceRevision: bundle.sourceRevision,
              },
            },
          })
          created += 1
          results.push({
            templateKey: entry.templateKey,
            version: entry.templateVersion,
            result: 'CREATED',
          })
        }
        return { created, updated, unchanged, results }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10_000,
        timeout: 30_000,
      },
    )
  }

  release(actor: PlatformAdminActor, templateKey: string, version: string, requestId: string) {
    return this.changeLifecycle(actor, templateKey, version, requestId, 'release')
  }
  deprecate(actor: PlatformAdminActor, templateKey: string, version: string, requestId: string) {
    return this.changeLifecycle(actor, templateKey, version, requestId, 'deprecate')
  }

  private async changeLifecycle(
    actor: PlatformAdminActor,
    templateKey: string,
    version: string,
    requestId: string,
    action: 'release' | 'deprecate',
  ) {
    return this.db.$transaction(async (tx) => {
      const template = await tx.template.findUnique({
        where: { key: templateKey },
        include: { versions: { where: { version } } },
      })
      const selected = template?.versions[0]
      if (!template || !selected)
        throw new TemplateAdminError(
          'TEMPLATE_VERSION_NOT_FOUND',
          404,
          'Template version not found',
        )
      if (action === 'release' && selected.sourceStatus !== 'READY')
        throw new TemplateAdminError(
          'TEMPLATE_SOURCE_NOT_READY',
          409,
          'Template source must be READY before release',
        )
      if (action === 'release' && selected.deprecatedAt)
        throw new TemplateAdminError(
          'TEMPLATE_VERSION_DEPRECATED',
          409,
          'A deprecated template version cannot be released',
        )
      const compatibilityResult = templateCompatibility(selected)
      if (action === 'release' && !compatibilityResult.compatible)
        throw new TemplateAdminError(
          'TEMPLATE_VERSION_INCOMPATIBLE',
          409,
          compatibilityResult.issues.join('; '),
        )
      const now = new Date()
      const updated =
        action === 'release'
          ? await tx.templateVersion.update({
              where: { id: selected.id },
              data: { releasedAt: selected.releasedAt ?? now },
            })
          : await tx.templateVersion.update({
              where: { id: selected.id },
              data: { deprecatedAt: selected.deprecatedAt ?? now },
            })
      if (action === 'release')
        await tx.template.update({ where: { id: template.id }, data: { status: 'ACTIVE' } })
      else {
        const remaining = await tx.templateVersion.count({
          where: {
            templateId: template.id,
            id: { not: selected.id },
            releasedAt: { not: null },
            deprecatedAt: null,
          },
        })
        if (remaining === 0)
          await tx.template.update({ where: { id: template.id }, data: { status: 'DEPRECATED' } })
      }
      await tx.auditLog.create({
        data: {
          actorUserId: actor.userId,
          action: `template.version_${action === 'release' ? 'released' : 'deprecated'}`,
          resourceType: 'TemplateVersion',
          resourceId: selected.id,
          requestId,
          metadata: { templateKey, version },
        },
      })
      return {
        templateKey,
        version,
        reviewStatus: reviewStatus(updated),
        releasedAt: updated.releasedAt,
        deprecatedAt: updated.deprecatedAt,
      }
    })
  }
}
