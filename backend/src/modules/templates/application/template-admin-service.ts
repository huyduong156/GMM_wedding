import { createHash } from 'node:crypto'
import type { Prisma, PrismaClient } from '@prisma/client'

import type { PlatformAdminActor } from '@/platform/auth/actor-context'
import { TemplateAdminError } from '../domain/template-admin-error'
import type { AdminTemplateListQuery, TemplateReleaseBundle } from '../interface/template-admin-schemas'

export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`
  return JSON.stringify(value)
}

export function templateConfigHash(config: unknown) { return createHash('sha256').update(stableJson(config)).digest('hex') }

function reviewStatus(version: { releasedAt: Date | null; deprecatedAt: Date | null }) {
  if (version.deprecatedAt) return 'DEPRECATED' as const
  if (version.releasedAt) return 'RELEASED' as const
  return 'PENDING_REVIEW' as const
}

export class TemplateAdminService {
  constructor(private readonly db: PrismaClient) {}

  async list(query: AdminTemplateListQuery) {
    const rows = await this.db.template.findMany({ ...(query.productType ? { where: { productType: query.productType } } : {}), include: { versions: { orderBy: { createdAt: 'desc' } } }, orderBy: { name: 'asc' } })
    const items = rows.map((template) => ({
      key: template.key, name: template.name, productType: template.productType, status: template.status, description: template.description,
      versions: template.versions.map((version) => ({ ...version, reviewStatus: reviewStatus(version) })).filter((version) => !query.reviewStatus || version.reviewStatus === query.reviewStatus),
    })).filter((template) => !query.reviewStatus || template.versions.length > 0)
    const pendingReviewCount = rows.reduce((count, template) => count + template.versions.filter((version) => reviewStatus(version) === 'PENDING_REVIEW').length, 0)
    return { pendingReviewCount, items }
  }

  async detail(templateKey: string, version: string) {
    const row = await this.db.template.findUnique({ where: { key: templateKey }, include: { versions: { where: { version } } } })
    const selected = row?.versions[0]
    if (!row || !selected) throw new TemplateAdminError('TEMPLATE_VERSION_NOT_FOUND', 404, 'Template version not found')
    return { key: row.key, name: row.name, productType: row.productType, status: row.status, description: row.description, version: { ...selected, reviewStatus: reviewStatus(selected) } }
  }

  async sync(actor: PlatformAdminActor, bundle: TemplateReleaseBundle, requestId: string) {
    return this.db.$transaction(async (tx) => {
      let created = 0; let unchanged = 0
      const results: Array<{ templateKey: string; version: string; result: 'CREATED' | 'UNCHANGED' }> = []
      for (const entry of bundle.templates) {
        const hash = templateConfigHash(entry.config)
        const template = await tx.template.upsert({ where: { key: entry.templateKey }, create: { key: entry.templateKey, name: entry.displayName, productType: entry.productType, description: entry.description ?? null }, update: { name: entry.displayName, description: entry.description ?? null } })
        if (template.productType !== entry.productType) throw new TemplateAdminError('TEMPLATE_PRODUCT_TYPE_CONFLICT', 409, `Product type cannot change for ${entry.templateKey}`)
        const existing = await tx.templateVersion.findUnique({ where: { templateId_version: { templateId: template.id, version: entry.templateVersion } } })
        if (existing) {
          if (existing.configHash !== hash) throw new TemplateAdminError('TEMPLATE_VERSION_HASH_CONFLICT', 409, `Template ${entry.templateKey}@${entry.templateVersion} already exists with different config`)
          unchanged += 1; results.push({ templateKey: entry.templateKey, version: entry.templateVersion, result: 'UNCHANGED' }); continue
        }
        const createdVersion = await tx.templateVersion.create({ data: { templateId: template.id, version: entry.templateVersion, configHash: hash, templateConfigVersion: entry.templateConfigVersion, contentSchemaVersion: entry.contentSchemaVersion, rendererApiVersion: entry.rendererApiVersion, codeRevision: bundle.sourceRevision, config: entry.config as Prisma.InputJsonValue } })
        await tx.auditLog.create({ data: { actorUserId: actor.userId, action: 'template.version_synced', resourceType: 'TemplateVersion', resourceId: createdVersion.id, requestId, metadata: { templateKey: entry.templateKey, version: entry.templateVersion, sourceRevision: bundle.sourceRevision } } })
        created += 1; results.push({ templateKey: entry.templateKey, version: entry.templateVersion, result: 'CREATED' })
      }
      return { created, unchanged, results }
    })
  }

  release(actor: PlatformAdminActor, templateKey: string, version: string, requestId: string) { return this.changeLifecycle(actor, templateKey, version, requestId, 'release') }
  deprecate(actor: PlatformAdminActor, templateKey: string, version: string, requestId: string) { return this.changeLifecycle(actor, templateKey, version, requestId, 'deprecate') }

  private async changeLifecycle(actor: PlatformAdminActor, templateKey: string, version: string, requestId: string, action: 'release' | 'deprecate') {
    return this.db.$transaction(async (tx) => {
      const template = await tx.template.findUnique({ where: { key: templateKey }, include: { versions: { where: { version } } } })
      const selected = template?.versions[0]
      if (!template || !selected) throw new TemplateAdminError('TEMPLATE_VERSION_NOT_FOUND', 404, 'Template version not found')
      if (action === 'release' && selected.deprecatedAt) throw new TemplateAdminError('TEMPLATE_VERSION_DEPRECATED', 409, 'A deprecated template version cannot be released')
      const now = new Date()
      const updated = action === 'release' ? await tx.templateVersion.update({ where: { id: selected.id }, data: { releasedAt: selected.releasedAt ?? now } }) : await tx.templateVersion.update({ where: { id: selected.id }, data: { deprecatedAt: selected.deprecatedAt ?? now } })
      if (action === 'release') await tx.template.update({ where: { id: template.id }, data: { status: 'ACTIVE' } })
      else {
        const remaining = await tx.templateVersion.count({ where: { templateId: template.id, id: { not: selected.id }, releasedAt: { not: null }, deprecatedAt: null } })
        if (remaining === 0) await tx.template.update({ where: { id: template.id }, data: { status: 'DEPRECATED' } })
      }
      await tx.auditLog.create({ data: { actorUserId: actor.userId, action: `template.version_${action === 'release' ? 'released' : 'deprecated'}`, resourceType: 'TemplateVersion', resourceId: selected.id, requestId, metadata: { templateKey, version } } })
      return { templateKey, version, reviewStatus: reviewStatus(updated), releasedAt: updated.releasedAt, deprecatedAt: updated.deprecatedAt }
    })
  }
}
