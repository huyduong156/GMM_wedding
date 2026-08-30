import { createHash } from 'node:crypto'
import { Prisma, type PrismaClient } from '@prisma/client'
import type { ObjectStorage } from '@/platform/storage/object-storage'
import type { RecapPublishInput, RecapSaveInput } from '../interface/recap-schemas'
import { validateRecapContent } from './recap-content-validation'

export class RecapError extends Error {
  constructor(readonly code: string, readonly status: number, message: string, readonly fieldErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'RecapError'
  }
}

export type RecapView = {
  id: string
  weddingId: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  slug: string | null
  title: string
  thankYouMessage: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImageUrl: string | null
  content: unknown
  themeConfig: unknown
  sectionConfig: { enabled: string[]; order: string[] }
  revision: number
  publishedAt: Date | null
  updatedAt: Date
  templateVersion: { id: string; key: string; version: string; config: unknown }
  mediaItems: Array<{ id: string; mediaAssetId: string; caption: string | null; sortOrder: number; publicUrl: string }>
  wishSelections: Array<{ id: string; wishId: string; sortOrder: number; authorName: string; content: string; isPinned: boolean }>
}

export type PublishedRecapView = {
  id: string
  recapId: string
  slug: string
  version: number
  payload: unknown
  payloadHash: string
  publishedAt: Date
  templateVersion: { key: string; version: string }
}

class RecapRevisionConflictError extends Error {}

const recapInclude = {
  templateVersion: { include: { template: true } },
  mediaItems: { include: { mediaAsset: true }, orderBy: { sortOrder: 'asc' as const } },
  wishSelections: { include: { wish: true }, orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.WeddingRecapInclude

function sectionKey(item: unknown) {
  if (typeof item === 'string') return item
  if (!item || typeof item !== 'object') return ''
  const value = item as { sectionKey?: unknown; key?: unknown }
  return typeof value.sectionKey === 'string' ? value.sectionKey : typeof value.key === 'string' ? value.key : ''
}

function sectionKeys(config: unknown) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return []
  const sections = (config as { sections?: unknown }).sections
  return Array.isArray(sections) ? sections.map(sectionKey).filter(Boolean) : []
}

function normalizeSectionConfig(templateConfig: unknown, input: { enabled: string[]; order: string[] }) {
  const supported = sectionKeys(templateConfig)
  if (!supported.length) throw new RecapError('RECAP_TEMPLATE_INVALID', 400, 'Recap template has no supported sections')
  const supportedSet = new Set(supported)
  const uniqueEnabled = [...new Set(input.enabled)]
  const uniqueOrder = [...new Set(input.order)]
  if (uniqueEnabled.length !== input.enabled.length || uniqueOrder.length !== input.order.length || uniqueOrder.length !== supported.length || uniqueOrder.some((key) => !supportedSet.has(key)) || uniqueEnabled.some((key) => !supportedSet.has(key))) {
    throw new RecapError('RECAP_SECTION_INVALID', 400, 'Recap section configuration is not supported by the selected template')
  }
  return { enabled: uniqueEnabled, order: uniqueOrder }
}

export class RecapService {
  constructor(private readonly prisma: PrismaClient, private readonly storage: ObjectStorage) {}

  async getDraft(userId: string, weddingId: string) {
    const owned = await this.prisma.wedding.findFirst({ where: { id: weddingId, createdById: userId, deletedAt: null }, select: { id: true } })
    if (!owned) throw new RecapError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const recap = await this.prisma.weddingRecap.findUnique({ where: { weddingId }, include: recapInclude })
    return recap ? this.view(recap) : null
  }
  async saveDraft(userId: string, weddingId: string, input: RecapSaveInput) {
    const owned = weddingId ? await this.prisma.wedding.findFirst({ where: { id: weddingId, createdById: userId, deletedAt: null }, select: { id: true } }) : null
    if (!owned) throw new RecapError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const template = await this.template(input.templateVersionId)
    const contentIssues = validateRecapContent(template.template.key, input.content)
    if (contentIssues.length) {
      const fieldErrors = contentIssues.reduce<Record<string, string[]>>((result, issue) => { result[issue.path] = [...(result[issue.path] ?? []), issue.message]; return result }, {})
      throw new RecapError('RECAP_CONTENT_INVALID', 400, 'Recap content is invalid', fieldErrors)
    }
    const sectionConfig = normalizeSectionConfig(template.config, input.sectionConfig)
    const refs = await this.validateReferences(weddingId, { mediaItems: input.mediaItems.map((item) => ({ ...item, caption: item.caption ?? null })), wishSelections: input.wishSelections })
    const current = await this.prisma.weddingRecap.findUnique({ where: { weddingId }, select: { id: true, revision: true } })
    if (current && current.revision !== input.revision) throw new RecapError('RECAP_REVISION_CONFLICT', 409, 'Wedding recap was changed by another request')
    if (!current && input.revision !== 1) throw new RecapError('RECAP_REVISION_CONFLICT', 409, 'Wedding recap was changed by another request')
    try {
      await this.prisma.$transaction(async (tx) => {
        const data = {
          templateVersionId: template.id,
          title: input.title,
          thankYouMessage: input.thankYouMessage ?? null,
          ogTitle: input.ogTitle ?? null,
          ogDescription: input.ogDescription ?? null,
          ogImageUrl: input.ogImageUrl ?? null,
          content: input.content as Prisma.InputJsonValue,
          themeConfig: input.themeConfig as Prisma.InputJsonValue,
          sectionConfig: sectionConfig as Prisma.InputJsonValue,
          status: 'DRAFT' as const,
          ...(current ? { revision: { increment: 1 } } : {}),
        }
        if (current) {
          const result = await tx.weddingRecap.updateMany({ where: { weddingId, revision: input.revision }, data })
          if (result.count !== 1) throw new RecapRevisionConflictError()
        } else {
          await tx.weddingRecap.create({ data: { weddingId, ...data, revision: 1 } })
        }
        await tx.recapMediaItem.deleteMany({ where: { recapId: current?.id ?? (await tx.weddingRecap.findUniqueOrThrow({ where: { weddingId }, select: { id: true } })).id } })
        const recapId = current?.id ?? (await tx.weddingRecap.findUniqueOrThrow({ where: { weddingId }, select: { id: true } })).id
        if (refs.media.length) await tx.recapMediaItem.createMany({ data: refs.media.map((item) => ({ recapId, mediaAssetId: item.mediaAssetId, caption: item.caption ?? null, sortOrder: item.sortOrder })) })
        await tx.recapWishSelection.deleteMany({ where: { recapId } })
        if (refs.wishes.length) await tx.recapWishSelection.createMany({ data: refs.wishes.map((item) => ({ recapId, wishId: item.wishId, sortOrder: item.sortOrder })) })
      })
    } catch (error) {
      if (error instanceof RecapRevisionConflictError || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw new RecapError('RECAP_REVISION_CONFLICT', 409, 'Wedding recap was changed by another request')
      throw error
    }
    return this.getDraft(userId, weddingId)
  }

  async publish(userId: string, weddingId: string, input: RecapPublishInput) {
    const owned = weddingId ? await this.prisma.wedding.findFirst({ where: { id: weddingId, createdById: userId, deletedAt: null }, select: { id: true, slug: true } }) : null
    if (!owned) throw new RecapError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (!owned.slug) throw new RecapError('WEDDING_SLUG_MISSING', 400, 'Wedding public slug is not configured')
    const slug = owned.slug
    const recap = await this.prisma.weddingRecap.findUnique({ where: { weddingId }, include: recapInclude })
    if (!recap) throw new RecapError('RECAP_NOT_FOUND', 404, 'Wedding recap not found')
    if (recap.revision !== input.revision) throw new RecapError('RECAP_REVISION_CONFLICT', 409, 'Wedding recap was changed by another request')
    const template = await this.template(recap.templateVersionId)
    const sectionConfig = normalizeSectionConfig(template.config, recap.sectionConfig as { enabled: string[]; order: string[] })
    const refs = await this.validateReferences(weddingId, { mediaItems: recap.mediaItems.map((item) => ({ mediaAssetId: item.mediaAssetId, caption: item.caption, sortOrder: item.sortOrder })), wishSelections: recap.wishSelections.map((item) => ({ wishId: item.wishId, sortOrder: item.sortOrder })) })
    const payload = {
      surface: 'RECAP',
      template: { key: template.template.key, version: template.version, config: template.config },
      title: recap.title,
      thankYouMessage: recap.thankYouMessage,
      seo: { title: recap.ogTitle, description: recap.ogDescription, imageUrl: recap.ogImageUrl },
      content: recap.content,
      theme: { themeConfig: recap.themeConfig, sectionConfig },
      mediaItems: refs.media.map((item) => {
        const source = recap.mediaItems.find((row) => row.mediaAssetId === item.mediaAssetId)
        const asset = item.asset
        return { mediaAssetId: item.mediaAssetId, caption: source?.caption ?? null, sortOrder: source?.sortOrder ?? item.sortOrder, publicUrl: this.storage.publicUrl(asset.storageKey), altText: asset.altText, mimeType: asset.mimeType, width: asset.width, height: asset.height }
      }),
      wishes: refs.wishes.map((item) => ({ wishId: item.wishId, authorName: item.wish.authorName, content: item.wish.content, isPinned: item.wish.isPinned, submittedAt: item.wish.submittedAt })),
    }
    const payloadHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex')
    const live = await this.prisma.publishedRecapSnapshot.findFirst({ where: { recapId: recap.id, unpublishedAt: null }, include: { templateVersion: { include: { template: true } }, }, orderBy: { version: 'desc' } })
    if (live?.slug === slug && live.payloadHash === payloadHash) return this.snapshotView(live)
    const slugConflict = await this.slugTaken(slug, weddingId)
    if (slugConflict) throw new RecapError('RECAP_SLUG_TAKEN', 409, 'Recap slug is already in use')
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const claimed = await tx.weddingRecap.updateMany({ where: { id: recap.id, revision: input.revision }, data: { status: 'PUBLISHED', slug: slug, publishedAt: new Date(), revision: { increment: 1 } } })
        if (claimed.count !== 1) throw new RecapRevisionConflictError()
        await tx.publishedRecapSnapshot.updateMany({ where: { recapId: recap.id, unpublishedAt: null }, data: { unpublishedAt: new Date() } })
        const previous = await tx.publishedRecapSnapshot.aggregate({ where: { recapId: recap.id }, _max: { version: true } })
        const snapshot = await tx.publishedRecapSnapshot.create({ data: { recapId: recap.id, templateVersionId: template.id, version: (previous._max.version ?? 0) + 1, slug: slug, payload: payload as Prisma.InputJsonValue, payloadHash }, include: { templateVersion: { include: { template: true } } } })
        await tx.wedding.update({ where: { id: weddingId }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
        return snapshot
      })
      return this.snapshotView(created)
    } catch (error) {
      if (error instanceof RecapRevisionConflictError) throw new RecapError('RECAP_REVISION_CONFLICT', 409, 'Wedding recap was changed by another request')
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new RecapError('RECAP_SLUG_TAKEN', 409, 'Recap slug is already in use')
      throw error
    }
  }

  async unpublish(userId: string, weddingId: string, revision: number) {
    const owned = weddingId ? await this.prisma.wedding.findFirst({ where: { id: weddingId, createdById: userId, deletedAt: null }, select: { id: true } }) : null
    if (!owned) throw new RecapError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    const recap = await this.prisma.weddingRecap.findUnique({ where: { weddingId }, select: { id: true, revision: true } })
    if (!recap) throw new RecapError('RECAP_NOT_FOUND', 404, 'Wedding recap not found')
    try {
      await this.prisma.$transaction(async (tx) => {
        const updated = await tx.weddingRecap.updateMany({ where: { id: recap.id, revision }, data: { status: 'DRAFT', slug: null, publishedAt: null, revision: { increment: 1 } } })
        if (updated.count !== 1) throw new RecapRevisionConflictError()
        await tx.publishedRecapSnapshot.updateMany({ where: { recapId: recap.id, unpublishedAt: null }, data: { unpublishedAt: new Date() } })
        const liveWedding = await tx.publishedWeddingSnapshot.count({ where: { weddingId, unpublishedAt: null } })
        const liveRecap = await tx.publishedRecapSnapshot.count({ where: { recapId: recap.id, unpublishedAt: null } })
        if (liveWedding === 0 && liveRecap === 0) await tx.wedding.update({ where: { id: weddingId }, data: { status: 'DRAFT', publishedAt: null } })
      })
    } catch (error) {
      if (error instanceof RecapRevisionConflictError) throw new RecapError('RECAP_REVISION_CONFLICT', 409, 'Wedding recap was changed by another request')
      throw error
    }
  }

  async publicSnapshot(slug: string) {
    const row = await this.prisma.publishedRecapSnapshot.findFirst({ where: { unpublishedAt: null, recap: { wedding: { slug, status: 'PUBLISHED', visibility: 'PUBLIC', deletedAt: null } } }, include: { templateVersion: { include: { template: true } } }, orderBy: { version: 'desc' } })
    if (!row) throw new RecapError('RECAP_PUBLIC_NOT_FOUND', 404, 'Published recap not found')
    return this.snapshotView(row)
  }

  async slugAvailable(userId: string, slug: string, weddingId?: string) {
    const owned = weddingId ? await this.prisma.wedding.findFirst({ where: { id: weddingId, createdById: userId, deletedAt: null }, select: { id: true } }) : null
    if (weddingId && !owned) throw new RecapError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) return false
    return !(await this.slugTaken(slug, weddingId))
  }

  private async template(templateVersionId: string) {
    const template = await this.prisma.templateVersion.findUnique({ where: { id: templateVersionId }, include: { template: true } })
    if (!template || template.template.productType !== 'RECAP' || !template.releasedAt || template.deprecatedAt) throw new RecapError('RECAP_TEMPLATE_NOT_FOUND', 404, 'Released recap template not found')
    return template
  }

  private async validateReferences(weddingId: string, input: { mediaItems: Array<{ mediaAssetId: string; caption?: string | null; sortOrder: number }>; wishSelections: Array<{ wishId: string; sortOrder: number }> }) {
    const mediaIds = input.mediaItems.map((item) => item.mediaAssetId)
    const wishIds = input.wishSelections.map((item) => item.wishId)
    if (new Set(mediaIds).size !== mediaIds.length || new Set(wishIds).size !== wishIds.length) throw new RecapError('RECAP_REFERENCE_DUPLICATE', 400, 'Recap media and wishes cannot be duplicated')
    const [media, wishes] = await Promise.all([
      this.prisma.mediaAsset.findMany({ where: { id: { in: mediaIds }, weddingId, deletedAt: null, status: 'READY' }, select: { id: true, storageKey: true, altText: true, mimeType: true, width: true, height: true } }),
      this.prisma.wish.findMany({ where: { id: { in: wishIds }, weddingId, deletedAt: null, status: 'APPROVED' }, select: { id: true, authorName: true, content: true, isPinned: true, submittedAt: true } }),
    ])
    if (media.length !== mediaIds.length) throw new RecapError('RECAP_MEDIA_NOT_READY', 400, 'Every selected recap media asset must be ready')
    if (wishes.length !== wishIds.length) throw new RecapError('RECAP_WISH_NOT_APPROVED', 400, 'Every selected recap wish must be approved')
    const mediaById = new Map(media.map((item) => [item.id, item]))
    const wishById = new Map(wishes.map((item) => [item.id, item]))
    return { media: input.mediaItems.map((item) => ({ ...item, asset: mediaById.get(item.mediaAssetId)! })), wishes: input.wishSelections.map((item) => ({ ...item, wish: wishById.get(item.wishId)! })) }
  }

  private async slugTaken(slug: string, weddingId?: string) {
    const [weddingSnapshot, recapSnapshot] = await Promise.all([
      this.prisma.publishedWeddingSnapshot.findFirst({ where: { slug, unpublishedAt: null, ...(weddingId ? { NOT: { weddingId } } : {}) }, select: { id: true } }),
      this.prisma.publishedRecapSnapshot.findFirst({ where: { slug, unpublishedAt: null, ...(weddingId ? { recap: { NOT: { weddingId } } } : {}) }, select: { id: true } }),
    ])
    return Boolean(weddingSnapshot || recapSnapshot)
  }

  private view(row: Prisma.WeddingRecapGetPayload<{ include: typeof recapInclude }>): RecapView {
    return {
      id: row.id, weddingId: row.weddingId, status: row.status, slug: row.slug, title: row.title,
      thankYouMessage: row.thankYouMessage, ogTitle: row.ogTitle, ogDescription: row.ogDescription, ogImageUrl: row.ogImageUrl,
      content: row.content, themeConfig: row.themeConfig, sectionConfig: row.sectionConfig as { enabled: string[]; order: string[] },
      revision: row.revision, publishedAt: row.publishedAt, updatedAt: row.updatedAt,
      templateVersion: { id: row.templateVersion.id, key: row.templateVersion.template.key, version: row.templateVersion.version, config: row.templateVersion.config },
      mediaItems: row.mediaItems.map((item) => ({ id: item.id, mediaAssetId: item.mediaAssetId, caption: item.caption, sortOrder: item.sortOrder, publicUrl: this.storage.publicUrl(item.mediaAsset.storageKey) })),
      wishSelections: row.wishSelections.map((item) => ({ id: item.id, wishId: item.wishId, sortOrder: item.sortOrder, authorName: item.wish.authorName, content: item.wish.content, isPinned: item.wish.isPinned })),
    }
  }

  private snapshotView(row: Prisma.PublishedRecapSnapshotGetPayload<{ include: { templateVersion: { include: { template: true } } } }>): PublishedRecapView {
    return { id: row.id, recapId: row.recapId, slug: row.slug, version: row.version, payload: row.payload, payloadHash: row.payloadHash, publishedAt: row.publishedAt, templateVersion: { key: row.templateVersion.template.key, version: row.templateVersion.version } }
  }
}
