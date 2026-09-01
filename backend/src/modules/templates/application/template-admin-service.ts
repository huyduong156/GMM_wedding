import { createHash } from 'node:crypto'
import type { Prisma, PrismaClient } from '@prisma/client'

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
  return createHash('sha256').update(stableJson(config)).digest('hex')
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
  constructor(private readonly db: PrismaClient) {}

  async list(query: AdminTemplateListQuery) {
    const rows = await this.db.template.findMany({
      ...(query.productType ? { where: { productType: query.productType } } : {}),
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { invitationSelections: true, websiteSelections: true, recaps: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })
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
        versions: template.versions
          .map((version) => ({
            ...version,
            reviewStatus: reviewStatus(version),
            compatibility: templateCompatibility(version),
            usageCount:
              template.productType === 'ONLINE_INVITATION'
                ? version._count.invitationSelections
                : template.productType === 'WEDDING_WEBSITE'
                  ? version._count.websiteSelections
                  : version._count.recaps,
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
          template.versions.length > 0 && (!query.reviewStatus || template.versions.length > 0),
      )
    const pendingReviewCount = rows.reduce(
      (count, template) =>
        count +
        template.versions.filter(
          (version) =>
            version.sourceStatus !== 'DEVELOPMENT' && reviewStatus(version) === 'PENDING_REVIEW',
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

  async sync(actor: PlatformAdminActor, bundle: TemplateReleaseBundle, requestId: string) {
    return this.db.$transaction(async (tx) => {
      let created = 0
      let unchanged = 0
      const results: Array<{
        templateKey: string
        version: string
        result: 'CREATED' | 'UNCHANGED'
      }> = []
      for (const entry of bundle.templates) {
        const hash = templateConfigHash(entry.config)
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
        const existing = await tx.templateVersion.findUnique({
          where: {
            templateId_version: { templateId: template.id, version: entry.templateVersion },
          },
        })
        if (entry.sourceStatus === 'DEVELOPMENT') {
          if (existing?.releasedAt)
            throw new TemplateAdminError(
              'TEMPLATE_VERSION_IMMUTABLE',
              409,
              'Released template cannot move back to development',
            )
          if (existing && existing.sourceStatus !== 'DEVELOPMENT')
            await tx.templateVersion.update({
              where: { id: existing.id },
              data: { sourceStatus: 'DEVELOPMENT' },
            })
          unchanged += existing ? 1 : 0
          if (existing)
            results.push({
              templateKey: entry.templateKey,
              version: entry.templateVersion,
              result: 'UNCHANGED',
            })
          continue
        }
        if (existing) {
          if (existing.releasedAt && existing.configHash !== hash) {
            throw new TemplateAdminError(
              'TEMPLATE_VERSION_IMMUTABLE',
              409,
              `Released template ${entry.templateKey}@${entry.templateVersion} cannot be changed; create a new version`,
            )
          }
          if (!existing.releasedAt) {
            await tx.templateVersion.update({
              where: { id: existing.id },
              data: {
                configHash: hash,
                templateConfigVersion: entry.templateConfigVersion,
                contentSchemaVersion: entry.contentSchemaVersion,
                rendererApiVersion: entry.rendererApiVersion,
                codeRevision: bundle.sourceRevision,
                sourceStatus: entry.sourceStatus,
                ...(entry.sourceStatus === 'DEPRECATED'
                  ? { deprecatedAt: existing.deprecatedAt ?? new Date() }
                  : { deprecatedAt: null }),
                config: entry.config as Prisma.InputJsonValue,
              },
            })
          }
          if (entry.sourceStatus === 'DEPRECATED')
            await tx.template.update({ where: { id: template.id }, data: { status: 'DEPRECATED' } })
          unchanged += 1
          results.push({
            templateKey: entry.templateKey,
            version: entry.templateVersion,
            result: 'UNCHANGED',
          })
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
      return { created, unchanged, results }
    })
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
