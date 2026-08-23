import { Prisma, type PrismaClient } from '@prisma/client'
import { createHash, randomUUID } from 'node:crypto'

import type {
  CreateWeddingData, CreateWeddingEventData, DashboardActivityView, UpdateWeddingData,
  PublishWeddingData, PublishedSnapshotView, SaveWeddingContentData, TemplateView, UpdateWeddingEventData, WeddingAnalyticsView, WeddingContentView, WeddingDashboardView, WeddingEventView, WeddingRepository, WeddingSurfaceValue, WeddingView, WishView,
} from '../application/ports'
import type { GuestView } from '@/modules/guests/application/ports'
import { WeddingError } from '../domain/wedding-error'

const legacyTemplateSections: Record<string, string[]> = {
  'modern-luxe': ['cover', 'invitation', 'loveJourney', 'families', 'eventDetails', 'countdown', 'timeline', 'venue', 'activities', 'gallery', 'rsvp', 'guestbook', 'gift', 'music'],
  'verdant-promise': ['cover', 'invitation', 'families', 'eventDetails', 'countdown', 'timeline', 'venue', 'gallery', 'rsvp', 'guestbook', 'gift'],
  'chibi-daydream': ['cover', 'banner', 'invitation', 'families', 'ceremony', 'reception', 'calendar', 'gallery', 'timeline', 'rsvp', 'map', 'guestbook', 'gift', 'thanks'],
  'editorial-vows': ['navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'weddingParty', 'dressCode', 'travel', 'faq', 'rsvp', 'guestbook', 'gift', 'footer', 'music'],
  'green-hydrangea': ['navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'dressCode', 'faq', 'rsvp', 'guestbook', 'footer'],
  'enchanted-forest': ['navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'dressCode', 'faq', 'rsvp', 'guestbook', 'footer'],
  'cherry-blossom-garden': ['navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'dressCode', 'faq', 'rsvp', 'guestbook', 'footer'],
}

type TemplateSection = { sectionKey?: unknown; key?: unknown; required?: unknown }
type SectionConfig = { enabled?: unknown; order?: unknown }

function sectionKey(item: unknown) {
  if (typeof item === 'string') return item
  if (!item || typeof item !== 'object') return ''
  const section = item as TemplateSection
  return typeof section.sectionKey === 'string' ? section.sectionKey : typeof section.key === 'string' ? section.key : ''
}

function reconcileSectionConfig(rawSections: unknown[], rawConfig: SectionConfig) {
  const sections = rawSections.map(sectionKey).filter(Boolean)
  const supported = new Set(sections)
  const required = new Set(rawSections.filter((item) => typeof item === 'object' && item !== null && (item as TemplateSection).required === true).map(sectionKey).filter(Boolean))
  const requestedEnabled = Array.isArray(rawConfig.enabled) ? rawConfig.enabled.filter((key): key is string => typeof key === 'string' && supported.has(key)) : []
  const rawOrder = Array.isArray(rawConfig.order) ? rawConfig.order.filter((key): key is string => typeof key === 'string' && supported.has(key)) : []
  const knownSections = new Set([...requestedEnabled, ...rawOrder])
  const newlyDiscovered = sections.filter((key) => !knownSections.has(key))
  const enabled = new Set(requestedEnabled.length ? [...requestedEnabled, ...newlyDiscovered] : sections)
  for (const key of required) enabled.add(key)
  const requestedOrder = rawOrder
  const order = requestedOrder.length ? [...requestedOrder] : [...sections]
  for (const key of sections) {
    if (order.includes(key)) continue
    const nextKnown = sections.slice(sections.indexOf(key) + 1).find((candidate) => order.includes(candidate))
    const insertionIndex = nextKnown ? order.indexOf(nextKnown) : order.length
    order.splice(insertionIndex, 0, key)
  }
  for (const key of enabled) if (!order.includes(key)) order.push(key)
  return { enabled: [...enabled], order, supported, required }
}

function effectiveTemplateConfig(templateKey: string, config: unknown) {
  const objectConfig = config && typeof config === 'object' && !Array.isArray(config) ? config as Record<string, unknown> : {}
  const configuredSections = Array.isArray(objectConfig.sections) ? objectConfig.sections : []
  const fallbackSections = legacyTemplateSections[templateKey] ?? []
  const configuredByKey = new Map(configuredSections.map((item) => [sectionKey(item), item]))
  const fallbackKeys = new Set(fallbackSections)
  const sections = fallbackSections.length
    ? [...fallbackSections.map((key) => configuredByKey.get(key) ?? key), ...configuredSections.filter((item) => !fallbackKeys.has(sectionKey(item)))]
    : configuredSections
  return { ...objectConfig, sections }
}

const weddingSelect = {
  id: true, name: true, status: true, visibility: true, timezone: true, locale: true,
  primaryDate: true, revision: true, publishedAt: true, archivedAt: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WeddingSelect

const eventSelect = {
  id: true, weddingId: true, name: true, eventType: true, startsAt: true, endsAt: true, timezone: true,
  venueName: true, addressLine: true, mapUrl: true, latitude: true, longitude: true, sortOrder: true,
  isPublic: true, revision: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WeddingEventSelect
const guestSelect = { id: true, weddingId: true, categoryId: true, groupId: true, displayName: true, phone: true, email: true, note: true, tableName: true, maxPartySize: true, tags: true, createdAt: true, updatedAt: true } satisfies Prisma.GuestSelect
const encodeWishCursor = (value: { submittedAt: Date; id: string }) => Buffer.from(JSON.stringify([value.submittedAt.toISOString(), value.id])).toString('base64url')
function decodeWishCursor(cursor?: string) {
  if (!cursor) return undefined
  try { const [submittedAt, id] = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as [string, string]; const date = new Date(submittedAt); return Number.isNaN(date.getTime()) ? undefined : { submittedAt: date, id } } catch { return undefined }
}

type WeddingRow = Prisma.WeddingGetPayload<{ select: typeof weddingSelect }>
type EventRow = Prisma.WeddingEventGetPayload<{ select: typeof eventSelect }>
class WeddingPublishConflictError extends Error {}
class WeddingContentConflictError extends Error {}

function weddingView(row: WeddingRow): WeddingView { return row }
function eventView(row: EventRow): WeddingEventView {
  return { ...row, latitude: row.latitude?.toString() ?? null, longitude: row.longitude?.toString() ?? null }
}

function collectMediaIds(value: unknown, key = '', result = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectMediaIds(item, key, result)
    return result
  }
  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && /(?:media|asset)id$/i.test(key)) result.add(value)
    return result
  }
  for (const [childKey, childValue] of Object.entries(value)) collectMediaIds(childValue, childKey, result)
  return result
}

export class PrismaWeddingRepository implements WeddingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, data: CreateWeddingData): Promise<WeddingView> {
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.wedding.create({
        data: {
          createdById: userId, name: data.name, timezone: data.timezone, locale: data.locale,
          visibility: data.visibility, ...(data.primaryDate ? { primaryDate: data.primaryDate } : {}),
          members: { create: { userId, role: 'OWNER', status: 'ACTIVE', joinedAt: new Date() } },
        }, select: weddingSelect,
      })
      return weddingView(row)
    })
  }

  async listOwned(userId: string): Promise<WeddingView[]> {
    const rows = await this.prisma.wedding.findMany({
      where: { createdById: userId, deletedAt: null }, select: weddingSelect,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    })
    return rows.map(weddingView)
  }

  async findOwned(userId: string, weddingId: string): Promise<WeddingView | null> {
    const row = await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: weddingSelect })
    return row ? weddingView(row) : null
  }

  async updateOwned(userId: string, weddingId: string, data: UpdateWeddingData): Promise<WeddingView | 'conflict' | null> {
    const exists = await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { revision: true } })
    if (!exists) return null
    if (exists.revision !== data.revision) return 'conflict'
    const archivedAt = data.status === 'ARCHIVED' ? new Date() : data.status === 'DRAFT' ? null : undefined
    const result = await this.prisma.wedding.updateMany({
      where: { ...this.ownedWhere(userId, weddingId), revision: data.revision },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.primaryDate !== undefined ? { primaryDate: data.primaryDate } : {}),
        ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
        ...(data.locale !== undefined ? { locale: data.locale } : {}),
        ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(archivedAt !== undefined ? { archivedAt } : {}), revision: { increment: 1 },
      },
    })
    if (result.count === 0) return 'conflict'
    return this.findOwned(userId, weddingId)
  }

  async softDeleteOwned(userId: string, weddingId: string): Promise<boolean> {
    const result = await this.prisma.wedding.updateMany({
      where: this.ownedWhere(userId, weddingId),
      data: { deletedAt: new Date(), status: 'ARCHIVED', archivedAt: new Date(), revision: { increment: 1 }, slug: null },
    })
    return result.count === 1
  }

  async listEventsOwned(userId: string, weddingId: string): Promise<WeddingEventView[] | null> {
    if (!await this.isOwned(userId, weddingId)) return null
    const rows = await this.prisma.weddingEvent.findMany({
      where: { weddingId, deletedAt: null }, select: eventSelect,
      orderBy: [{ sortOrder: 'asc' }, { startsAt: 'asc' }, { id: 'asc' }],
    })
    return rows.map(eventView)
  }

  async createEventOwned(userId: string, weddingId: string, data: CreateWeddingEventData): Promise<WeddingEventView | null> {
    const eventId = randomUUID()
    try {
      const wedding = await this.prisma.wedding.update({
        where: this.ownedWhere(userId, weddingId),
        data: { events: { create: {
          id: eventId, name: data.name, eventType: data.eventType, startsAt: data.startsAt, timezone: data.timezone,
          sortOrder: data.sortOrder, isPublic: data.isPublic,
          ...(data.endsAt ? { endsAt: data.endsAt } : {}), ...(data.venueName ? { venueName: data.venueName } : {}),
          ...(data.addressLine ? { addressLine: data.addressLine } : {}), ...(data.mapUrl ? { mapUrl: data.mapUrl } : {}),
          ...(data.latitude !== undefined ? { latitude: data.latitude } : {}), ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
        } } },
        select: { events: { where: { id: eventId }, take: 1, select: eventSelect } },
      })
      return wedding.events[0] ? eventView(wedding.events[0]) : null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return null
      throw error
    }
  }

  async findEventOwned(userId: string, weddingId: string, eventId: string): Promise<WeddingEventView | null> {
    if (!await this.isOwned(userId, weddingId)) return null
    const row = await this.prisma.weddingEvent.findFirst({ where: { id: eventId, weddingId, deletedAt: null }, select: eventSelect })
    return row ? eventView(row) : null
  }

  async updateEventOwned(userId: string, weddingId: string, eventId: string, data: UpdateWeddingEventData): Promise<WeddingEventView | 'conflict' | null> {
    const result = await this.prisma.weddingEvent.updateMany({
      where: { id: eventId, weddingId, deletedAt: null, revision: data.revision, wedding: { createdById: userId, deletedAt: null } },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}), ...(data.eventType !== undefined ? { eventType: data.eventType } : {}),
        ...(data.startsAt !== undefined ? { startsAt: data.startsAt } : {}), ...(data.endsAt !== undefined ? { endsAt: data.endsAt } : {}),
        ...(data.timezone !== undefined ? { timezone: data.timezone } : {}), ...(data.venueName !== undefined ? { venueName: data.venueName } : {}),
        ...(data.addressLine !== undefined ? { addressLine: data.addressLine } : {}), ...(data.mapUrl !== undefined ? { mapUrl: data.mapUrl } : {}),
        ...(data.latitude !== undefined ? { latitude: data.latitude } : {}), ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}), ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
        revision: { increment: 1 },
      },
    })
    if (result.count === 0) {
      const current = await this.findEventOwned(userId, weddingId, eventId)
      return current ? 'conflict' : null
    }
    return this.findEventOwned(userId, weddingId, eventId)
  }

  async deleteEventOwned(userId: string, weddingId: string, eventId: string): Promise<boolean | null> {
    if (!await this.isOwned(userId, weddingId)) return null
    const result = await this.prisma.weddingEvent.updateMany({
      where: { id: eventId, weddingId, deletedAt: null, wedding: { createdById: userId, deletedAt: null } },
      data: { deletedAt: new Date(), revision: { increment: 1 } },
    })
    return result.count === 1
  }

  async dashboardOwned(userId: string, weddingId: string, now: Date): Promise<WeddingDashboardView | null> {
    const wedding = await this.findOwned(userId, weddingId)
    if (!wedding) return null
    const since = new Date(now.getTime() - 29 * 86_400_000)
    since.setUTCHours(0, 0, 0, 0)
    const [guests, invitations, activeInvitations, activeResponses, attendanceGroups, partySize, companions, wishGroups, nextEventRow,
      invitationDesign, website, recap, invitationSnapshot, websiteSnapshot, recentRsvps, recentWishes, trendRows] = await Promise.all([
      this.prisma.guest.count({ where: { weddingId, deletedAt: null } }),
      this.prisma.invitation.count({ where: { weddingId } }),
      this.prisma.invitation.count({ where: { weddingId, status: 'ACTIVE' } }),
      this.prisma.rsvpResponse.count({ where: { weddingId, invitation: { status: 'ACTIVE' } } }),
      this.prisma.rsvpResponse.groupBy({ by: ['attendance'], where: { weddingId, invitation: { status: 'ACTIVE' } }, _count: { _all: true } }),
      this.prisma.rsvpResponse.aggregate({ where: { weddingId, attendance: 'ATTENDING', invitation: { status: 'ACTIVE' } }, _sum: { partySize: true } }),
      this.prisma.rsvpCompanion.count({ where: { rsvpResponse: { weddingId, invitation: { status: 'ACTIVE' } } } }),
      this.prisma.wish.groupBy({ by: ['status'], where: { weddingId, deletedAt: null }, _count: { _all: true } }),
      this.prisma.weddingEvent.findFirst({ where: { weddingId, deletedAt: null, startsAt: { gte: now } }, select: eventSelect, orderBy: [{ startsAt: 'asc' }, { sortOrder: 'asc' }] }),
      this.prisma.invitationDesign.findUnique({ where: { weddingId }, include: { templateVersion: { include: { template: true } } } }),
      this.prisma.weddingWebsite.findUnique({ where: { weddingId }, include: { templateVersion: { include: { template: true } } } }),
      this.prisma.weddingRecap.findUnique({ where: { weddingId } }),
      this.prisma.publishedWeddingSnapshot.findFirst({ where: { weddingId, surface: 'ONLINE_INVITATION', unpublishedAt: null }, orderBy: { version: 'desc' } }),
      this.prisma.publishedWeddingSnapshot.findFirst({ where: { weddingId, surface: 'WEDDING_WEBSITE', unpublishedAt: null }, orderBy: { version: 'desc' } }),
      this.prisma.rsvpResponse.findMany({ where: { weddingId, invitation: { status: 'ACTIVE' } }, take: 10, orderBy: { submittedAt: 'desc' }, include: { invitation: { include: { guest: true } } } }),
      this.prisma.wish.findMany({ where: { weddingId, deletedAt: null }, take: 10, orderBy: { submittedAt: 'desc' } }),
      this.prisma.rsvpResponse.findMany({ where: { weddingId, submittedAt: { gte: since }, invitation: { status: 'ACTIVE' } }, select: { submittedAt: true } }),
    ])
    const responseCounts = Object.fromEntries(attendanceGroups.map((group) => [group.attendance, group._count._all]))
    const wishCounts = Object.fromEntries(wishGroups.map((group) => [group.status, group._count._all]))
    const responses = attendanceGroups.reduce((sum, group) => sum + group._count._all, 0)
    const activity: DashboardActivityView[] = [
      ...recentRsvps.map((item) => ({ id: item.id, type: 'RSVP_SUBMITTED' as const, displayName: item.invitation.guest?.displayName ?? item.invitation.label ?? 'Khách mời', attendance: item.attendance, partySize: item.partySize, occurredAt: item.submittedAt })),
      ...recentWishes.map((item) => ({ id: item.id, type: 'WISH_SUBMITTED' as const, displayName: item.authorName, attendance: null, partySize: null, occurredAt: item.submittedAt })),
    ].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, 10)
    return {
      wedding,
      publication: {
        invitation: { configured: Boolean(invitationDesign?.templateVersionId), published: Boolean(invitationSnapshot), slug: invitationSnapshot?.slug ?? null, templateName: invitationDesign?.templateVersion?.template.name ?? null, templateVersion: invitationDesign?.templateVersion?.version ?? null, views: null },
        website: { configured: Boolean(website?.templateVersionId), published: Boolean(website?.isPublished && websiteSnapshot), slug: websiteSnapshot?.slug ?? website?.slug ?? null, templateName: website?.templateVersion?.template.name ?? null, templateVersion: website?.templateVersion?.version ?? null, views: null },
        recap: { configured: Boolean(recap), published: recap?.status === 'PUBLISHED', slug: recap?.slug ?? null, views: null },
      },
      metrics: { guests, invitations, activeInvitations, responses, attending: responseCounts.ATTENDING ?? 0, declined: responseCounts.DECLINED ?? 0, maybe: responseCounts.MAYBE ?? 0, pendingResponses: Math.max(activeInvitations - activeResponses, 0), attendingPartySize: partySize._sum.partySize ?? 0, companions, pendingWishes: wishCounts.PENDING ?? 0, approvedWishes: wishCounts.APPROVED ?? 0 },
      nextEvent: nextEventRow ? eventView(nextEventRow) : null,
      responseTrend: this.buildTrend(since, trendRows.map((row) => row.submittedAt)),
      recentActivity: activity,
    }
  }

  async analyticsOwned(userId: string, weddingId: string): Promise<WeddingAnalyticsView | null> {
    if (!await this.isOwned(userId, weddingId)) return null
    const [guestTotal, attending, taskGroups, priorityGroups, recentCompleted, giftEntries, linkedGiftGuests, wishGroups] = await Promise.all([
      this.prisma.guest.count({ where: { weddingId, deletedAt: null } }),
      this.prisma.rsvpResponse.count({ where: { weddingId, attendance: 'ATTENDING', invitation: { status: 'ACTIVE' } } }),
      this.prisma.weddingTask.groupBy({ by: ['status'], where: { weddingId, deletedAt: null }, _count: { _all: true } }),
      this.prisma.weddingTask.groupBy({ by: ['priority'], where: { weddingId, deletedAt: null }, _count: { _all: true } }),
      this.prisma.weddingTask.findMany({ where: { weddingId, status: 'DONE', deletedAt: null }, select: { id: true, title: true, completedAt: true }, orderBy: [{ completedAt: 'desc' }, { id: 'desc' }], take: 5 }),
      this.prisma.giftLedgerEntry.count({ where: { weddingId, deletedAt: null } }),
      this.prisma.giftLedgerEntry.findMany({ where: { weddingId, deletedAt: null, guestId: { not: null } }, select: { guestId: true }, distinct: ['guestId'] }),
      this.prisma.wish.groupBy({ by: ['status'], where: { weddingId, deletedAt: null }, _count: { _all: true } }),
    ])
    const statuses = Object.fromEntries(taskGroups.map((group) => [group.status, group._count._all]))
    const priorities = Object.fromEntries(priorityGroups.map((group) => [group.priority, group._count._all]))
    const wishes = Object.fromEntries(wishGroups.map((group) => [group.status, group._count._all]))
    const completed = statuses.DONE ?? 0
    const total = taskGroups.reduce((sum, group) => sum + group._count._all, 0)
    const rate = (value: number, denominator: number) => denominator ? Math.round((value / denominator) * 1000) / 10 : 0
    return { guests: { total: guestTotal, attending, attendanceRate: rate(attending, guestTotal) }, tasks: { total, completed, completedRate: rate(completed, total), byStatus: { todo: statuses.TODO ?? 0, inProgress: statuses.IN_PROGRESS ?? 0, done: completed, cancelled: statuses.CANCELLED ?? 0 }, byPriority: { low: priorities.LOW ?? 0, medium: priorities.MEDIUM ?? 0, high: priorities.HIGH ?? 0, urgent: priorities.URGENT ?? 0 }, recentCompleted: recentCompleted.map((task) => ({ ...task, completedAt: task.completedAt ?? new Date(0) })) }, gifts: { entryCount: giftEntries, linkedGuestCount: linkedGiftGuests.length, anonymousEntryCount: giftEntries - linkedGiftGuests.length }, wishes: { total: wishGroups.reduce((sum, group) => sum + group._count._all, 0), pending: wishes.PENDING ?? 0, approved: wishes.APPROVED ?? 0, rejected: wishes.REJECTED ?? 0, spam: wishes.SPAM ?? 0, hidden: wishes.HIDDEN ?? 0 } }
  }

  async listTemplates(productType?: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE'): Promise<TemplateView[]> {
    const rows = await this.prisma.template.findMany({
      where: { status: 'ACTIVE', ...(productType ? { productType } : {}) },
      include: { versions: { where: { releasedAt: { not: null }, deprecatedAt: null }, orderBy: { createdAt: 'desc' } } },
      orderBy: { name: 'asc' },
    })
    return rows.map((row) => ({ key: row.key, name: row.name, productType: row.productType, status: row.status, description: row.description, versions: row.versions }))
  }

  async getTemplateVersion(templateKey: string, version: string): Promise<TemplateView | null> {
    const row = await this.prisma.template.findFirst({ where: { key: templateKey, status: 'ACTIVE' }, include: { versions: { where: { version, releasedAt: { not: null }, deprecatedAt: null } } } })
    if (!row || row.versions.length === 0) return null
    return { key: row.key, name: row.name, productType: row.productType, status: row.status, description: row.description, versions: row.versions }
  }

  async getContentOwned(userId: string, weddingId: string, surface: WeddingSurfaceValue): Promise<WeddingContentView | null> {
    const wedding = await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { id: true } })
    if (!wedding) return null
    const [content, theme, selection] = await Promise.all([
      this.prisma.weddingContent.findUnique({ where: { weddingId } }),
      this.prisma.weddingTheme.findUnique({ where: { weddingId_surface: { weddingId, surface } } }),
      surface === 'ONLINE_INVITATION'
        ? this.prisma.invitationDesign.findUnique({ where: { weddingId }, include: { templateVersion: { include: { template: true } } } })
        : this.prisma.weddingWebsite.findUnique({ where: { weddingId }, include: { templateVersion: { include: { template: true } } } }),
    ])
    const effectiveConfig = selection?.templateVersion ? effectiveTemplateConfig(selection.templateVersion.template.key, selection.templateVersion.config) : null
    const templateVersion = selection?.templateVersion && effectiveConfig ? { id: selection.templateVersion.id, key: selection.templateVersion.template.key, version: selection.templateVersion.version, config: effectiveConfig } : null
    const rawSections = effectiveConfig && Array.isArray(effectiveConfig.sections) ? effectiveConfig.sections : []
    const sectionConfig = rawSections.length ? reconcileSectionConfig(rawSections, (theme?.sectionConfig ?? {}) as SectionConfig) : { enabled: [], order: [] }
    return { content: content?.content ?? {}, schemaVersion: content?.schemaVersion ?? 1, revision: content?.revision ?? 1, surface, themeConfig: theme?.themeConfig ?? {}, sectionConfig: { enabled: sectionConfig.enabled, order: sectionConfig.order }, templateVersion }
  }

  async saveContentOwned(userId: string, weddingId: string, data: SaveWeddingContentData): Promise<WeddingContentView | 'conflict' | 'template-not-found' | 'template-incompatible' | 'section-invalid' | null> {
    const owned = await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { id: true } })
    if (!owned) return null
    const template = await this.prisma.templateVersion.findUnique({ where: { id: data.templateVersionId }, include: { template: true } })
    if (!template || template.deprecatedAt) return 'template-not-found'
    const expectedProduct = data.surface === 'ONLINE_INVITATION' ? 'ONLINE_INVITATION' : 'WEDDING_WEBSITE'
    if (template.template.productType !== expectedProduct) return 'template-incompatible'
    const config = effectiveTemplateConfig(template.template.key, template.config)
    const rawSections = config.sections
    const normalized = reconcileSectionConfig(rawSections, data.sectionConfig)
    const normalizedSectionConfig = { enabled: normalized.enabled, order: normalized.order }
    if (!normalized.supported.size || normalized.order.length !== normalized.supported.size || new Set(normalized.order).size !== normalized.order.length || normalized.order.some((key) => !normalized.supported.has(key)) || normalized.enabled.some((key) => !normalized.supported.has(key)) || [...normalized.required].some((key) => !normalized.enabled.includes(key))) return 'section-invalid'
    const currentContent = await this.prisma.weddingContent.findUnique({ where: { weddingId }, select: { revision: true } })
    if ((currentContent?.revision ?? 1) !== data.revision) return 'conflict'
    try {
      await this.prisma.$transaction(async (tx) => {
        const nextRevision = data.revision + 1
        if (currentContent) {
          const claimed = await tx.weddingContent.updateMany({ where: { weddingId, revision: data.revision }, data: { schemaVersion: template.contentSchemaVersion, content: data.content as Prisma.InputJsonValue, revision: nextRevision } })
          if (claimed.count !== 1) throw new WeddingContentConflictError()
        } else {
          await tx.weddingContent.create({ data: { weddingId, schemaVersion: template.contentSchemaVersion, content: data.content as Prisma.InputJsonValue, revision: nextRevision } })
        }
        await tx.weddingTheme.upsert({ where: { weddingId_surface: { weddingId, surface: data.surface } }, create: { weddingId, surface: data.surface, configVersion: template.templateConfigVersion, themeConfig: data.themeConfig as Prisma.InputJsonValue, sectionConfig: normalizedSectionConfig as Prisma.InputJsonValue, revision: nextRevision }, update: { configVersion: template.templateConfigVersion, themeConfig: data.themeConfig as Prisma.InputJsonValue, sectionConfig: normalizedSectionConfig as Prisma.InputJsonValue, revision: nextRevision } })
        if (data.surface === 'ONLINE_INVITATION') await tx.invitationDesign.upsert({ where: { weddingId }, create: { weddingId, templateVersionId: template.id, revision: nextRevision }, update: { templateVersionId: template.id, revision: nextRevision } })
        else await tx.weddingWebsite.upsert({ where: { weddingId }, create: { weddingId, templateVersionId: template.id, revision: nextRevision }, update: { templateVersionId: template.id, revision: nextRevision } })
      })
    } catch (error) {
      if (error instanceof WeddingContentConflictError || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) return 'conflict'
      throw error
    }
    return this.getContentOwned(userId, weddingId, data.surface) as Promise<WeddingContentView>
  }

  async publishOwned(userId: string, weddingId: string, data: PublishWeddingData): Promise<PublishedSnapshotView | 'not-ready' | 'slug-taken' | 'conflict' | null> {
    const wedding = await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { id: true, revision: true } })
    if (!wedding) return null
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug.length > 64) return 'slug-taken'
    const [content, theme, selection, events, wishes] = await Promise.all([
      this.prisma.weddingContent.findUnique({ where: { weddingId } }),
      this.prisma.weddingTheme.findUnique({ where: { weddingId_surface: { weddingId, surface: data.surface } } }),
      data.surface === 'ONLINE_INVITATION' ? this.prisma.invitationDesign.findUnique({ where: { weddingId }, include: { templateVersion: { include: { template: true } } } }) : this.prisma.weddingWebsite.findUnique({ where: { weddingId }, include: { templateVersion: { include: { template: true } } } }),
      this.prisma.weddingEvent.findMany({ where: { weddingId, deletedAt: null, isPublic: true }, select: { id: true, name: true, eventType: true, startsAt: true, endsAt: true, timezone: true, venueName: true, addressLine: true, mapUrl: true, latitude: true, longitude: true, sortOrder: true }, orderBy: [{ sortOrder: 'asc' }, { startsAt: 'asc' }] }),
      this.prisma.wish.findMany({ where: { weddingId, status: 'APPROVED', deletedAt: null }, select: { id: true, authorName: true, content: true, submittedAt: true, isPinned: true }, orderBy: [{ isPinned: 'desc' }, { submittedAt: 'desc' }], take: 100 }),
    ])
    if (!content || !theme || !selection?.templateVersion || selection.templateVersion.deprecatedAt) return 'not-ready'
    const config = effectiveTemplateConfig(selection.templateVersion.template.key, selection.templateVersion.config)
    const sectionConfig = theme.sectionConfig as { enabled?: unknown; order?: unknown }
    const rawSections = Array.isArray(config.sections) && config.sections.length > 0 ? config.sections : (legacyTemplateSections[selection.templateVersion.template.key] ?? [])
    const normalizedSectionConfig = reconcileSectionConfig(rawSections, sectionConfig)
    const { enabled, order, supported, required } = normalizedSectionConfig
    if (enabled.length === 0 || order.length !== supported.size || new Set(enabled).size !== enabled.length || new Set(order).size !== order.length || enabled.some((key) => !supported.has(key)) || order.some((key) => !supported.has(key)) || [...required].some((key) => !enabled.includes(key))) return 'not-ready'
    const mediaIds = [...collectMediaIds(content.content), ...collectMediaIds(theme.themeConfig)]
    if (mediaIds.length > 0) {
      const readyCount = await this.prisma.mediaAsset.count({ where: { id: { in: [...new Set(mediaIds)] }, weddingId, status: 'READY', deletedAt: null } })
      if (readyCount !== new Set(mediaIds).size) return 'not-ready'
    }
    const payload = { surface: data.surface, template: { key: selection.templateVersion.template.key, version: selection.templateVersion.version, config }, content: content.content, theme: { themeConfig: theme.themeConfig, sectionConfig: { enabled, order } }, events: events.map((event) => ({ ...event, latitude: event.latitude?.toString() ?? null, longitude: event.longitude?.toString() ?? null })), wishes }
    const payloadHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex')
    const live = await this.prisma.publishedWeddingSnapshot.findFirst({ where: { weddingId, surface: data.surface, unpublishedAt: null }, include: { templateVersion: { include: { template: true } } }, orderBy: { version: 'desc' } })
    if (live?.slug === data.slug && live.payloadHash === payloadHash) return this.snapshotView(live)
    if (wedding.revision !== data.revision) return 'conflict'
    try {
      const snapshot = await this.prisma.$transaction(async (tx) => {
        const claimed = await tx.wedding.updateMany({ where: { ...this.ownedWhere(userId, weddingId), revision: data.revision }, data: { status: 'PUBLISHED', publishedAt: new Date(), revision: { increment: 1 } } })
        if (claimed.count !== 1) throw new WeddingPublishConflictError()
        await tx.publishedWeddingSnapshot.updateMany({ where: { weddingId, surface: data.surface, unpublishedAt: null }, data: { unpublishedAt: new Date() } })
        await tx.weddingTheme.update({ where: { weddingId_surface: { weddingId, surface: data.surface } }, data: { sectionConfig: { enabled, order } as Prisma.InputJsonValue } })
        const previous = await tx.publishedWeddingSnapshot.aggregate({ where: { weddingId, surface: data.surface }, _max: { version: true } })
        const created = await tx.publishedWeddingSnapshot.create({ data: { weddingId, templateVersionId: selection.templateVersion!.id, version: (previous._max.version ?? 0) + 1, surface: data.surface, slug: data.slug, payload: payload as Prisma.InputJsonValue, payloadHash, contentSchemaVersion: selection.templateVersion!.contentSchemaVersion, rendererApiVersion: selection.templateVersion!.rendererApiVersion }, include: { templateVersion: { include: { template: true } } } })
        if (data.surface === 'ONLINE_INVITATION') await tx.invitationDesign.update({ where: { weddingId }, data: { slug: data.slug, isPublished: true, revision: { increment: 1 } } })
        else await tx.weddingWebsite.update({ where: { weddingId }, data: { slug: data.slug, isPublished: true, revision: { increment: 1 } } })
        return created
      })
      return this.snapshotView(snapshot)
    } catch (error) {
      if (error instanceof WeddingPublishConflictError) return 'conflict'
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return 'slug-taken'
      throw error
    }
  }

  async unpublishOwned(userId: string, weddingId: string, surface: WeddingSurfaceValue): Promise<boolean | null> {
    const wedding = await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { id: true } })
    if (!wedding) return null
    await this.prisma.$transaction(async (tx) => {
      await tx.publishedWeddingSnapshot.updateMany({ where: { weddingId, surface, unpublishedAt: null }, data: { unpublishedAt: new Date() } })
      if (surface === 'ONLINE_INVITATION') await tx.invitationDesign.updateMany({ where: { weddingId }, data: { slug: null, isPublished: false, revision: { increment: 1 } } })
      else await tx.weddingWebsite.updateMany({ where: { weddingId }, data: { slug: null, isPublished: false, revision: { increment: 1 } } })
      const otherLive = await tx.publishedWeddingSnapshot.count({ where: { weddingId, surface: { not: surface }, unpublishedAt: null } })
      if (otherLive === 0) await tx.wedding.update({ where: { id: weddingId }, data: { status: 'DRAFT', publishedAt: null, revision: { increment: 1 } } })
    })
    return true
  }

  async slugAvailable(userId: string, slug: string, weddingId?: string): Promise<boolean> {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) return false
    const row = await this.prisma.publishedWeddingSnapshot.findFirst({ where: { slug, unpublishedAt: null, ...(weddingId ? { NOT: { weddingId } } : {}) }, select: { id: true } })
    return !row
  }

  async getPublicSnapshot(slug: string, surface: WeddingSurfaceValue): Promise<PublishedSnapshotView | null> {
    const row = await this.prisma.publishedWeddingSnapshot.findFirst({ where: { slug, surface, unpublishedAt: null, wedding: { status: 'PUBLISHED', visibility: 'PUBLIC', deletedAt: null } }, include: { templateVersion: { include: { template: true } } }, orderBy: { version: 'desc' } })
    return row ? this.snapshotView(row) : null
  }

  private snapshotView(row: Prisma.PublishedWeddingSnapshotGetPayload<{ include: { templateVersion: { include: { template: true } } } }>): PublishedSnapshotView {
    return { id: row.id, weddingId: row.weddingId, surface: row.surface, slug: row.slug, version: row.version, payload: row.payload, publishedAt: row.publishedAt, templateVersion: { key: row.templateVersion.template.key, version: row.templateVersion.version } }
  }

  private wishView(row: { id: string; authorName: string; content: string; status: string; isPinned: boolean; submittedAt: Date; moderatedAt: Date | null; invitationId: string | null; guestId: string | null; guest: { displayName: string } | null }): WishView {
    return { id: row.id, authorName: row.authorName, guestName: row.guest?.displayName ?? row.authorName, guestId: row.guestId, invitationId: row.invitationId, content: row.content, status: row.status, isPinned: row.isPinned, submittedAt: row.submittedAt, moderatedAt: row.moderatedAt }
  }

  async listWishesOwned(userId: string, weddingId: string, filter: { status?: string | undefined; query?: string | undefined; from?: Date | undefined; to?: Date | undefined; limit: number; cursor?: string | undefined }): Promise<{ items: WishView[]; nextCursor: string | null } | null> {
    if (!await this.isOwned(userId, weddingId)) return null
    const cursor = decodeWishCursor(filter.cursor)
    const andFilters: Prisma.WishWhereInput[] = []
    if (filter.query) andFilters.push({ OR: [{ authorName: { contains: filter.query, mode: 'insensitive' } }, { content: { contains: filter.query, mode: 'insensitive' } }, { guest: { displayName: { contains: filter.query, mode: 'insensitive' } } }] })
    if (filter.from || filter.to) andFilters.push({ submittedAt: { ...(filter.from ? { gte: filter.from } : {}), ...(filter.to ? { lte: filter.to } : {}) } })
    if (cursor) andFilters.push({ OR: [{ submittedAt: { lt: cursor.submittedAt } }, { submittedAt: cursor.submittedAt, id: { lt: cursor.id } }] })
    const rows = await this.prisma.wish.findMany({
      where: {
        weddingId, deletedAt: null,
        ...(filter.status ? { status: filter.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM' | 'HIDDEN' } : {}),
        ...(andFilters.length ? { AND: andFilters } : {}),
      },
      select: { id: true, authorName: true, content: true, status: true, isPinned: true, submittedAt: true, moderatedAt: true, invitationId: true, guestId: true, guest: { select: { displayName: true } } },
      orderBy: [{ submittedAt: 'desc' }, { id: 'desc' }], take: filter.limit + 1,
    })
    const hasNextPage = rows.length > filter.limit
    const items = rows.slice(0, filter.limit).map((row) => this.wishView(row))
    return { items, nextCursor: hasNextPage && items.length ? encodeWishCursor(items[items.length - 1]!) : null }
  }

  async moderateWishOwned(userId: string, weddingId: string, wishId: string, status?: string, isPinned?: boolean): Promise<WishView | 'not-found' | null> {
    if (!await this.isOwned(userId, weddingId)) return null
    const current = await this.prisma.wish.findFirst({ where: { id: wishId, weddingId, deletedAt: null }, select: { id: true } })
    if (!current) return 'not-found'
    const row = await this.prisma.wish.update({ where: { id: wishId }, data: { ...(status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM' | 'HIDDEN', moderatedAt: new Date() } : {}), ...(isPinned !== undefined ? { isPinned } : {}) }, select: { id: true, authorName: true, content: true, status: true, isPinned: true, submittedAt: true, moderatedAt: true, invitationId: true, guestId: true, guest: { select: { displayName: true } } } })
    return this.wishView(row)
  }

  private async validateWishGuestReferences(tx: Prisma.TransactionClient, weddingId: string, data: { categoryId?: string | undefined; groupId?: string | undefined }) {
    if (data.categoryId && !await tx.guestCategory.findFirst({ where: { id: data.categoryId, weddingId, deletedAt: null }, select: { id: true } })) throw new WeddingError('WEDDING_GUEST_CATEGORY_NOT_FOUND', 404, 'Guest category not found')
    if (data.groupId && !await tx.guestGroup.findFirst({ where: { id: data.groupId, weddingId, deletedAt: null }, select: { id: true } })) throw new WeddingError('WEDDING_GUEST_GROUP_NOT_FOUND', 404, 'Guest group not found')
  }

  async promoteWishToGuest(userId: string, weddingId: string, wishId: string, data: { displayName?: string | undefined; categoryId?: string | undefined; groupId?: string | undefined }) {
    if (!await this.isOwned(userId, weddingId)) return null
    return this.prisma.$transaction(async (tx): Promise<{ guest: GuestView; wishId: string; invitationId: string | null } | 'conflict' | null> => {
      const wish = await tx.wish.findFirst({ where: { id: wishId, weddingId, deletedAt: null }, select: { id: true, authorName: true, guestId: true, invitationId: true, invitation: { select: { id: true, guestId: true, label: true } } } })
      if (!wish) return null
      const linkedGuestId = wish.guestId ?? wish.invitation?.guestId ?? null
      if (linkedGuestId) {
        const guest = await tx.guest.findFirst({ where: { id: linkedGuestId, weddingId }, select: guestSelect })
        return guest ? { guest, wishId: wish.id, invitationId: wish.invitationId } : null
      }
      const displayName = data.displayName ?? wish.authorName
      await this.validateWishGuestReferences(tx, weddingId, data)
      const guest = await tx.guest.create({ data: { weddingId, displayName, maxPartySize: 1, tags: [], ...(data.categoryId ? { categoryId: data.categoryId } : {}), ...(data.groupId ? { groupId: data.groupId } : {}) }, select: guestSelect })
      const updatedWish = await tx.wish.updateMany({ where: { id: wish.id, weddingId, guestId: null }, data: { guestId: guest.id } })
      const updatedInvitation = wish.invitationId ? await tx.invitation.updateMany({ where: { id: wish.invitationId, weddingId, guestId: null }, data: { guestId: guest.id } }) : { count: 0 }
      if (!updatedWish.count || (wish.invitationId && !updatedInvitation.count)) {
        await tx.guest.delete({ where: { id: guest.id } })
        const current = await tx.wish.findFirst({ where: { id: wish.id, weddingId }, select: { guestId: true, invitationId: true, invitation: { select: { guestId: true } } } })
        const currentGuestId = current?.guestId ?? current?.invitation?.guestId
        if (!currentGuestId) return 'conflict'
        const currentGuest = await tx.guest.findFirst({ where: { id: currentGuestId, weddingId }, select: guestSelect })
        return currentGuest ? { guest: currentGuest, wishId: wish.id, invitationId: current?.invitationId ?? null } : 'conflict'
      }
      return { guest, wishId: wish.id, invitationId: wish.invitationId }
    })
  }

  async linkWishGuest(userId: string, weddingId: string, wishId: string, guestId: string) {
    if (!await this.isOwned(userId, weddingId)) return null
    return this.prisma.$transaction(async (tx): Promise<{ guest: GuestView; wishId: string; invitationId: string | null } | 'conflict' | null> => {
      const guest = await tx.guest.findFirst({ where: { id: guestId, weddingId, deletedAt: null }, select: guestSelect })
      if (!guest) return null
      const wish = await tx.wish.findFirst({ where: { id: wishId, weddingId, deletedAt: null }, select: { id: true, guestId: true, invitationId: true, invitation: { select: { id: true, guestId: true } } } })
      if (!wish) return null
      const existingGuestId = wish.guestId ?? wish.invitation?.guestId
      if (existingGuestId === guestId) return { guest, wishId: wish.id, invitationId: wish.invitationId }
      if (existingGuestId) return 'conflict'
      const updatedWish = await tx.wish.updateMany({ where: { id: wish.id, weddingId, guestId: null }, data: { guestId } })
      const updatedInvitation = wish.invitationId ? await tx.invitation.updateMany({ where: { id: wish.invitationId, weddingId, guestId: null }, data: { guestId } }) : { count: 1 }
      if (!updatedWish.count || !updatedInvitation.count) return 'conflict'
      return { guest, wishId: wish.id, invitationId: wish.invitationId }
    })
  }

  private ownedWhere(userId: string, weddingId: string) { return { id: weddingId, createdById: userId, deletedAt: null } as const }
  private async isOwned(userId: string, weddingId: string) { return Boolean(await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { id: true } })) }
  private buildTrend(since: Date, values: Date[]) {
    const counts = new Map<string, number>()
    for (const value of values) { const key = value.toISOString().slice(0, 10); counts.set(key, (counts.get(key) ?? 0) + 1) }
    return Array.from({ length: 30 }, (_, index) => { const date = new Date(since.getTime() + index * 86_400_000).toISOString().slice(0, 10); return { date, count: counts.get(date) ?? 0 } })
  }
}
