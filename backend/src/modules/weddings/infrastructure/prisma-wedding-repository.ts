import { Prisma, type PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import type {
  CreateWeddingData, CreateWeddingEventData, DashboardActivityView, UpdateWeddingData,
  UpdateWeddingEventData, WeddingDashboardView, WeddingEventView, WeddingRepository, WeddingView,
} from '../application/ports'

const weddingSelect = {
  id: true, name: true, status: true, visibility: true, timezone: true, locale: true,
  primaryDate: true, revision: true, publishedAt: true, archivedAt: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WeddingSelect

const eventSelect = {
  id: true, weddingId: true, name: true, eventType: true, startsAt: true, endsAt: true, timezone: true,
  venueName: true, addressLine: true, mapUrl: true, latitude: true, longitude: true, sortOrder: true,
  isPublic: true, revision: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WeddingEventSelect

type WeddingRow = Prisma.WeddingGetPayload<{ select: typeof weddingSelect }>
type EventRow = Prisma.WeddingEventGetPayload<{ select: typeof eventSelect }>

function weddingView(row: WeddingRow): WeddingView { return row }
function eventView(row: EventRow): WeddingEventView {
  return { ...row, latitude: row.latitude?.toString() ?? null, longitude: row.longitude?.toString() ?? null }
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

  private ownedWhere(userId: string, weddingId: string) { return { id: weddingId, createdById: userId, deletedAt: null } as const }
  private async isOwned(userId: string, weddingId: string) { return Boolean(await this.prisma.wedding.findFirst({ where: this.ownedWhere(userId, weddingId), select: { id: true } })) }
  private buildTrend(since: Date, values: Date[]) {
    const counts = new Map<string, number>()
    for (const value of values) { const key = value.toISOString().slice(0, 10); counts.set(key, (counts.get(key) ?? 0) + 1) }
    return Array.from({ length: 30 }, (_, index) => { const date = new Date(since.getTime() + index * 86_400_000).toISOString().slice(0, 10); return { date, count: counts.get(date) ?? 0 } })
  }
}
