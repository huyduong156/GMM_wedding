import { Prisma, type PrismaClient } from '@prisma/client'
import type { RsvpRepository, RsvpView } from '../application/ports'
import type { GuestView } from '@/modules/guests/application/ports'
import { RsvpError } from '../domain/rsvp-error'

const encode = (value: { submittedAt: Date; id: string }) =>
  Buffer.from(JSON.stringify([value.submittedAt.toISOString(), value.id])).toString('base64url')
const guestSelect = {
  id: true,
  weddingId: true,
  categoryId: true,
  groupId: true,
  displayName: true,
  phone: true,
  email: true,
  note: true,
  tableName: true,
  maxPartySize: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.GuestSelect
function decode(cursor?: string) {
  if (!cursor) return undefined
  try {
    const [submittedAt, id] = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as [
      string,
      string,
    ]
    const date = new Date(submittedAt)
    return Number.isNaN(date.getTime()) ? undefined : { submittedAt: date, id }
  } catch {
    return undefined
  }
}

export class PrismaRsvpRepository implements RsvpRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private ownedWedding(userId: string, weddingId: string) {
    return { id: weddingId, createdById: userId, deletedAt: null }
  }

  async listOwned(
    userId: string,
    weddingId: string,
    filter: Parameters<RsvpRepository['listOwned']>[2],
  ) {
    const owned = await this.prisma.wedding.findFirst({
      where: this.ownedWedding(userId, weddingId),
      select: { id: true },
    })
    if (!owned) return null
    const cursor = decode(filter.cursor)
    const where: Prisma.RsvpResponseWhereInput = {
      weddingId,
      ...(filter.attendance ? { attendance: filter.attendance } : {}),
      ...(filter.eventId ? { eventSelections: { some: { weddingEventId: filter.eventId } } } : {}),
      ...(filter.from || filter.to
        ? {
            submittedAt: {
              ...(filter.from ? { gte: filter.from } : {}),
              ...(filter.to ? { lte: filter.to } : {}),
            },
          }
        : {}),
      ...(filter.categoryId || filter.groupId || filter.query
        ? {
            invitation: {
              ...(filter.categoryId || filter.groupId
                ? {
                    guest: {
                      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
                      ...(filter.groupId ? { groupId: filter.groupId } : {}),
                    },
                  }
                : {}),
              ...(filter.query
                ? {
                    OR: [
                      { label: { contains: filter.query, mode: 'insensitive' } },
                      { guest: { displayName: { contains: filter.query, mode: 'insensitive' } } },
                    ],
                  }
                : {}),
            },
          }
        : {}),
      ...(cursor
        ? {
            OR: [
              { submittedAt: { lt: cursor.submittedAt } },
              { submittedAt: cursor.submittedAt, id: { lt: cursor.id } },
            ],
          }
        : {}),
    }
    const rows = await this.prisma.rsvpResponse.findMany({
      where,
      orderBy: [{ submittedAt: 'desc' }, { id: 'desc' }],
      take: filter.limit + 1,
      select: {
        id: true,
        weddingId: true,
        invitationId: true,
        attendance: true,
        partySize: true,
        mealPreference: true,
        specialRequest: true,
        message: true,
        submittedAt: true,
        updatedAt: true,
        revision: true,
        invitation: {
          select: {
            label: true,
            status: true,
            guest: {
              select: {
                id: true,
                displayName: true,
                phone: true,
                email: true,
                categoryId: true,
                groupId: true,
              },
            },
          },
        },
        eventSelections: {
          select: { attending: true, weddingEvent: { select: { id: true, name: true } } },
          orderBy: { weddingEvent: { startsAt: 'asc' } },
        },
        companions: {
          select: { id: true, displayName: true, mealPreference: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
    const hasNextPage = rows.length > filter.limit
    const items = rows.slice(0, filter.limit).map((row): RsvpView => ({
      id: row.id,
      weddingId: row.weddingId,
      invitationId: row.invitationId,
      guestId: row.invitation.guest?.id ?? null,
      guestName: row.invitation.guest?.displayName ?? row.invitation.label ?? 'Guest',
      guestPhone: row.invitation.guest?.phone ?? null,
      guestEmail: row.invitation.guest?.email ?? null,
      categoryId: row.invitation.guest?.categoryId ?? null,
      groupId: row.invitation.guest?.groupId ?? null,
      invitationLabel: row.invitation.label,
      invitationStatus: row.invitation.status,
      attendance: row.attendance,
      partySize: row.partySize,
      mealPreference: row.mealPreference,
      specialRequest: row.specialRequest,
      message: row.message,
      submittedAt: row.submittedAt,
      updatedAt: row.updatedAt,
      revision: row.revision,
      eventSelections: row.eventSelections.map((selection) => ({
        eventId: selection.weddingEvent.id,
        eventName: selection.weddingEvent.name,
        attending: selection.attending,
      })),
      companions: row.companions,
    }))
    return {
      items,
      nextCursor: hasNextPage && items.length ? encode(items[items.length - 1]!) : null,
    }
  }

  private async owns(userId: string, weddingId: string) {
    return Boolean(
      await this.prisma.wedding.findFirst({
        where: this.ownedWedding(userId, weddingId),
        select: { id: true },
      }),
    )
  }

  private async validateGuestReferences(
    tx: Prisma.TransactionClient,
    weddingId: string,
    data: { categoryId?: string | undefined; groupId?: string | undefined },
  ) {
    if (
      data.categoryId &&
      !(await tx.guestCategory.findFirst({
        where: { id: data.categoryId, weddingId, deletedAt: null },
        select: { id: true },
      }))
    ) {
      throw new RsvpError('GUEST_CATEGORY_NOT_FOUND', 404, 'Guest category not found')
    }
    if (
      data.groupId &&
      !(await tx.guestGroup.findFirst({
        where: { id: data.groupId, weddingId, deletedAt: null },
        select: { id: true },
      }))
    ) {
      throw new RsvpError('GUEST_GROUP_NOT_FOUND', 404, 'Guest group not found')
    }
  }

  async promoteToGuest(
    userId: string,
    weddingId: string,
    rsvpId: string,
    data: {
      displayName?: string | undefined
      categoryId?: string | undefined
      groupId?: string | undefined
    },
  ) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(
      async (tx): Promise<{ guest: GuestView; invitationId: string } | 'conflict' | null> => {
        const response = await tx.rsvpResponse.findFirst({
          where: { id: rsvpId, weddingId },
          select: {
            partySize: true,
            invitation: { select: { id: true, guestId: true, label: true } },
          },
        })
        if (!response) return null
        if (response.invitation.guestId) {
          const guest = await tx.guest.findFirst({
            where: { id: response.invitation.guestId, weddingId },
            select: guestSelect,
          })
          return guest ? { guest, invitationId: response.invitation.id } : null
        }
        const displayName = data.displayName ?? response.invitation.label
        if (!displayName)
          throw new RsvpError('RSVP_GUEST_NAME_REQUIRED', 400, 'Guest name is required')
        await this.validateGuestReferences(tx, weddingId, data)
        const guest = await tx.guest.create({
          data: {
            weddingId,
            displayName,
            maxPartySize: Math.max(1, response.partySize),
            tags: [],
            ...(data.categoryId ? { categoryId: data.categoryId } : {}),
            ...(data.groupId ? { groupId: data.groupId } : {}),
          },
          select: guestSelect,
        })
        const linked = await tx.invitation.updateMany({
          where: { id: response.invitation.id, weddingId, guestId: null },
          data: { guestId: guest.id },
        })
        if (!linked.count) {
          await tx.guest.delete({ where: { id: guest.id } })
          const current = await tx.rsvpResponse.findFirst({
            where: { id: rsvpId, weddingId },
            select: { invitation: { select: { guestId: true, id: true } } },
          })
          if (!current?.invitation.guestId) return 'conflict'
          const currentGuest = await tx.guest.findFirst({
            where: { id: current.invitation.guestId, weddingId },
            select: guestSelect,
          })
          return currentGuest
            ? { guest: currentGuest, invitationId: current.invitation.id }
            : 'conflict'
        }
        return { guest, invitationId: response.invitation.id }
      },
    )
  }

  async linkGuest(userId: string, weddingId: string, rsvpId: string, guestId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(
      async (tx): Promise<{ guest: GuestView; invitationId: string } | 'conflict' | null> => {
        const guest = await tx.guest.findFirst({
          where: { id: guestId, weddingId, deletedAt: null },
          select: guestSelect,
        })
        if (!guest) return null
        const response = await tx.rsvpResponse.findFirst({
          where: { id: rsvpId, weddingId },
          select: { invitation: { select: { id: true, guestId: true } } },
        })
        if (!response) return null
        if (response.invitation.guestId === guestId)
          return { guest, invitationId: response.invitation.id }
        if (response.invitation.guestId) return 'conflict'
        const linked = await tx.invitation.updateMany({
          where: { id: response.invitation.id, weddingId, guestId: null },
          data: { guestId },
        })
        if (!linked.count) {
          const current = await tx.rsvpResponse.findFirst({
            where: { id: rsvpId, weddingId },
            select: { invitation: { select: { guestId: true } } },
          })
          return current?.invitation.guestId === guestId
            ? { guest, invitationId: response.invitation.id }
            : 'conflict'
        }
        return { guest, invitationId: response.invitation.id }
      },
    )
  }
}
