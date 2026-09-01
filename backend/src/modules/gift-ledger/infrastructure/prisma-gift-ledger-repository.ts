import { Prisma, type PrismaClient } from '@prisma/client'
import type {
  CreateGiftData,
  GiftDateFilter,
  GiftLedgerRepository,
  GiftLedgerView,
  GiftListFilter,
  GiftReceiveMethod,
  GiftSummary,
  GiftType,
  ReciprocityStatus,
  UpdateGiftData,
} from '../application/ports'
import { GiftLedgerError } from '../domain/gift-ledger-error'

const entrySelect = {
  id: true,
  weddingId: true,
  guestId: true,
  guestDisplayNameSnapshot: true,
  giftType: true,
  amountMinor: true,
  currency: true,
  goldWeight: true,
  goldUnit: true,
  goldType: true,
  giftDescription: true,
  receiveMethod: true,
  receivedAt: true,
  note: true,
  reciprocityStatus: true,
  returnedAt: true,
  revision: true,
  createdAt: true,
  updatedAt: true,
  guest: { select: { id: true, displayName: true, deletedAt: true } },
} satisfies Prisma.GiftLedgerEntrySelect
const encode = (value: { receivedAt: Date; id: string }) =>
  Buffer.from(JSON.stringify([value.receivedAt.toISOString(), value.id])).toString('base64url')
function decode(cursor?: string) {
  if (!cursor) return undefined
  try {
    const [receivedAt, id] = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as [
      string,
      string,
    ]
    const date = new Date(receivedAt)
    return date.toString() !== 'Invalid Date' && typeof id === 'string'
      ? { receivedAt: date, id }
      : undefined
  } catch {
    return undefined
  }
}
const dbGiftType = (value: GiftType) =>
  value === 'physicalGift' ? ('PHYSICAL_GIFT' as const) : (value.toUpperCase() as 'MONEY' | 'GOLD')
const dbReceiveMethod = (value: GiftReceiveMethod) =>
  value === 'bankTransfer'
    ? ('BANK_TRANSFER' as const)
    : value === 'physicalGift'
      ? ('PHYSICAL_GIFT' as const)
      : (value.toUpperCase() as 'CASH' | 'OTHER')
const dbReciprocity = (value: ReciprocityStatus) =>
  value === 'notApplicable'
    ? ('NOT_APPLICABLE' as const)
    : (value.toUpperCase() as 'PENDING' | 'RETURNED')
function map(
  row: Prisma.GiftLedgerEntryGetPayload<{ select: typeof entrySelect }>,
): GiftLedgerView {
  const { guest, ...entry } = row
  return {
    ...entry,
    giftType:
      row.giftType === 'PHYSICAL_GIFT' ? 'physicalGift' : (row.giftType.toLowerCase() as GiftType),
    receiveMethod:
      row.receiveMethod === 'BANK_TRANSFER'
        ? 'bankTransfer'
        : row.receiveMethod === 'PHYSICAL_GIFT'
          ? 'physicalGift'
          : (row.receiveMethod.toLowerCase() as GiftReceiveMethod),
    reciprocityStatus:
      row.reciprocityStatus === 'NOT_APPLICABLE'
        ? 'notApplicable'
        : (row.reciprocityStatus.toLowerCase() as ReciprocityStatus),
    amountMinor: row.amountMinor?.toString() ?? null,
    goldWeight: row.goldWeight?.toString() ?? null,
    linkedGuest:
      guest && !guest.deletedAt ? { id: guest.id, displayName: guest.displayName } : null,
  }
}

export class PrismaGiftLedgerRepository implements GiftLedgerRepository {
  constructor(private readonly prisma: PrismaClient) {}
  private ownedWhere(userId: string, weddingId: string) {
    return { id: weddingId, createdById: userId, deletedAt: null } as const
  }
  private async owns(userId: string, weddingId: string) {
    return Boolean(
      await this.prisma.wedding.findFirst({
        where: this.ownedWhere(userId, weddingId),
        select: { id: true },
      }),
    )
  }
  private async guest(userId: string, weddingId: string, guestId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.guest.findFirst({
      where: { id: guestId, weddingId, deletedAt: null },
      select: { id: true, displayName: true },
    })
  }
  private validateUpdate(
    current: Prisma.GiftLedgerEntryGetPayload<{ select: typeof entrySelect }>,
    data: UpdateGiftData,
  ) {
    const type =
      data.giftType ??
      (current.giftType === 'PHYSICAL_GIFT'
        ? 'physicalGift'
        : (current.giftType.toLowerCase() as GiftType))
    const method =
      data.receiveMethod ??
      (current.receiveMethod === 'BANK_TRANSFER'
        ? 'bankTransfer'
        : current.receiveMethod === 'PHYSICAL_GIFT'
          ? 'physicalGift'
          : (current.receiveMethod.toLowerCase() as GiftReceiveMethod))
    const amountMinor = data.amountMinor ?? current.amountMinor ?? undefined
    const currency = data.currency ?? current.currency ?? undefined
    const goldWeight = data.goldWeight ?? current.goldWeight?.toString() ?? undefined
    const goldUnit = data.goldUnit ?? current.goldUnit ?? undefined
    const description = data.giftDescription ?? current.giftDescription ?? undefined
    if (type === 'money' && (amountMinor === undefined || !currency))
      throw new GiftLedgerError('GIFT_INVALID', 400, 'Money requires amountMinor and currency')
    if (type === 'gold' && (!goldWeight || !goldUnit))
      throw new GiftLedgerError('GIFT_INVALID', 400, 'Gold requires weight and unit')
    if (type === 'physicalGift' && !description)
      throw new GiftLedgerError('GIFT_INVALID', 400, 'Physical gift requires description')
    if (type === 'money' && method === 'physicalGift')
      throw new GiftLedgerError('GIFT_INVALID', 400, 'Money cannot use physicalGift receive method')
    if (type !== 'money' && (method === 'cash' || method === 'bankTransfer'))
      throw new GiftLedgerError(
        'GIFT_INVALID',
        400,
        'Gold or physical gift must use physicalGift or other',
      )
  }
  async listOwned(userId: string, weddingId: string, filter: GiftListFilter) {
    if (!(await this.owns(userId, weddingId))) return null
    const cursor = decode(filter.cursor)
    const where: Prisma.GiftLedgerEntryWhereInput = {
      weddingId,
      deletedAt: null,
      ...(filter.giftType ? { giftType: dbGiftType(filter.giftType) } : {}),
      ...(filter.receiveMethod ? { receiveMethod: dbReceiveMethod(filter.receiveMethod) } : {}),
      ...(filter.reciprocityStatus
        ? { reciprocityStatus: dbReciprocity(filter.reciprocityStatus) }
        : {}),
      ...(filter.guestId ? { guestId: filter.guestId } : {}),
      ...(filter.query
        ? { guestDisplayNameSnapshot: { contains: filter.query, mode: 'insensitive' } }
        : {}),
      ...(filter.from || filter.to
        ? {
            receivedAt: {
              ...(filter.from ? { gte: filter.from } : {}),
              ...(filter.to ? { lte: filter.to } : {}),
            },
          }
        : {}),
      ...(cursor
        ? {
            OR: [
              { receivedAt: { lt: cursor.receivedAt } },
              { receivedAt: cursor.receivedAt, id: { lt: cursor.id } },
            ],
          }
        : {}),
    }
    const rows = await this.prisma.giftLedgerEntry.findMany({
      where,
      select: entrySelect,
      orderBy: [{ receivedAt: 'desc' }, { id: 'desc' }],
      take: filter.limit + 1,
    })
    const hasNextPage = rows.length > filter.limit
    const items = rows.slice(0, filter.limit).map(map)
    return {
      items,
      nextCursor: hasNextPage && items.length ? encode(items[items.length - 1]!) : null,
    }
  }
  async findOwned(userId: string, weddingId: string, entryId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    const row = await this.prisma.giftLedgerEntry.findFirst({
      where: { id: entryId, weddingId, deletedAt: null },
      select: entrySelect,
    })
    return row ? map(row) : null
  }
  async createOwned(userId: string, weddingId: string, data: CreateGiftData) {
    if (!(await this.owns(userId, weddingId))) return null
    if (data.guestId) {
      const guest = await this.guest(userId, weddingId, data.guestId)
      if (!guest) throw new GiftLedgerError('GIFT_GUEST_NOT_FOUND', 404, 'Guest not found')
    }
    const row = await this.prisma.giftLedgerEntry.create({
      data: {
        weddingId,
        guestDisplayNameSnapshot: data.guestName,
        giftType: dbGiftType(data.giftType),
        receiveMethod: dbReceiveMethod(data.receiveMethod),
        receivedAt: data.receivedAt,
        reciprocityStatus: dbReciprocity(data.reciprocityStatus ?? 'pending'),
        ...(data.guestId ? { guestId: data.guestId } : {}),
        ...(data.amountMinor !== undefined ? { amountMinor: data.amountMinor } : {}),
        ...(data.currency ? { currency: data.currency } : {}),
        ...(data.goldWeight ? { goldWeight: new Prisma.Decimal(data.goldWeight) } : {}),
        ...(data.goldUnit ? { goldUnit: data.goldUnit } : {}),
        ...(data.goldType ? { goldType: data.goldType } : {}),
        ...(data.giftDescription ? { giftDescription: data.giftDescription } : {}),
        ...(data.note !== undefined ? { note: data.note } : {}),
        ...(data.returnedAt ? { returnedAt: data.returnedAt } : {}),
      },
      select: entrySelect,
    })
    return map(row)
  }
  async updateOwned(userId: string, weddingId: string, entryId: string, data: UpdateGiftData) {
    if (!(await this.owns(userId, weddingId))) return null
    const current = await this.prisma.giftLedgerEntry.findFirst({
      where: { id: entryId, weddingId, deletedAt: null },
      select: entrySelect,
    })
    if (!current) return null
    if (
      data.guestId !== undefined &&
      data.guestId !== null &&
      !(await this.guest(userId, weddingId, data.guestId))
    )
      throw new GiftLedgerError('GIFT_GUEST_NOT_FOUND', 404, 'Guest not found')
    this.validateUpdate(current, data)
    const nextStatus = data.reciprocityStatus
      ? dbReciprocity(data.reciprocityStatus)
      : current.reciprocityStatus
    const returnedAt =
      nextStatus === 'RETURNED' ? (data.returnedAt ?? current.returnedAt ?? new Date()) : null
    const result = await this.prisma.giftLedgerEntry.updateMany({
      where: { id: entryId, weddingId, deletedAt: null, revision: data.revision },
      data: {
        ...(data.guestName !== undefined ? { guestDisplayNameSnapshot: data.guestName } : {}),
        ...(data.guestId !== undefined ? { guestId: data.guestId } : {}),
        ...(data.giftType !== undefined ? { giftType: dbGiftType(data.giftType) } : {}),
        ...(data.amountMinor !== undefined ? { amountMinor: data.amountMinor } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.goldWeight !== undefined
          ? { goldWeight: new Prisma.Decimal(data.goldWeight) }
          : {}),
        ...(data.goldUnit !== undefined ? { goldUnit: data.goldUnit } : {}),
        ...(data.goldType !== undefined ? { goldType: data.goldType } : {}),
        ...(data.giftDescription !== undefined ? { giftDescription: data.giftDescription } : {}),
        ...(data.receiveMethod !== undefined
          ? { receiveMethod: dbReceiveMethod(data.receiveMethod) }
          : {}),
        ...(data.receivedAt !== undefined ? { receivedAt: data.receivedAt } : {}),
        ...(data.note !== undefined ? { note: data.note } : {}),
        ...(data.reciprocityStatus !== undefined
          ? { reciprocityStatus: nextStatus, returnedAt }
          : {}),
        ...(data.returnedAt !== undefined && data.reciprocityStatus === 'returned'
          ? { returnedAt: data.returnedAt }
          : {}),
        revision: { increment: 1 },
      },
    })
    if (!result.count) return 'conflict'
    const row = await this.prisma.giftLedgerEntry.findUnique({
      where: { id: entryId },
      select: entrySelect,
    })
    return row ? map(row) : null
  }
  async deleteOwned(userId: string, weddingId: string, entryId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    const result = await this.prisma.giftLedgerEntry.updateMany({
      where: { id: entryId, weddingId, deletedAt: null },
      data: { deletedAt: new Date(), revision: { increment: 1 } },
    })
    return result.count === 1
  }
  private async rowsForSummary(userId: string, weddingId: string, filter: GiftDateFilter) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.giftLedgerEntry.findMany({
      where: {
        weddingId,
        deletedAt: null,
        ...(filter.from || filter.to
          ? {
              receivedAt: {
                ...(filter.from ? { gte: filter.from } : {}),
                ...(filter.to ? { lte: filter.to } : {}),
              },
            }
          : {}),
      },
      select: {
        giftType: true,
        amountMinor: true,
        currency: true,
        goldWeight: true,
        goldUnit: true,
        goldType: true,
        reciprocityStatus: true,
      },
    })
  }
  async summaryOwned(
    userId: string,
    weddingId: string,
    filter: GiftDateFilter,
  ): Promise<GiftSummary | null> {
    const rows = await this.rowsForSummary(userId, weddingId, filter)
    if (!rows) return null
    const money = new Map<string, bigint>()
    const gold = new Map<
      string,
      { unit: string; type: string | null; weight: Prisma.Decimal; count: number }
    >()
    let pendingCount = 0
    let returnedCount = 0
    let notApplicableCount = 0
    let physicalGiftCount = 0
    let moneyCount = 0
    let goldCount = 0
    for (const row of rows) {
      if (row.reciprocityStatus === 'PENDING') pendingCount++
      else if (row.reciprocityStatus === 'RETURNED') returnedCount++
      else notApplicableCount++
      if (row.giftType === 'MONEY') {
        moneyCount++
        const key = row.currency ?? 'UNKNOWN'
        money.set(key, (money.get(key) ?? 0n) + (row.amountMinor ?? 0n))
      } else if (row.giftType === 'GOLD') {
        goldCount++
        const key = `${row.goldUnit ?? 'unknown'}\u0000${row.goldType ?? ''}`
        const existing = gold.get(key)
        if (existing) {
          existing.weight = existing.weight.add(row.goldWeight ?? 0)
          existing.count++
        } else
          gold.set(key, {
            unit: row.goldUnit ?? 'unknown',
            type: row.goldType,
            weight: row.goldWeight ?? new Prisma.Decimal(0),
            count: 1,
          })
      } else physicalGiftCount++
    }
    return {
      entryCount: rows.length,
      pendingCount,
      returnedCount,
      notApplicableCount,
      money: {
        count: moneyCount,
        totals: [...money.entries()].map(([currency, amountMinor]) => ({
          currency,
          amountMinor: amountMinor.toString(),
        })),
      },
      gold: {
        count: goldCount,
        totals: [...gold.values()].map((v) => ({
          unit: v.unit,
          type: v.type,
          weight: v.weight.toString(),
        })),
      },
      physicalGiftCount,
    }
  }
  async exportOwned(userId: string, weddingId: string, filter: GiftDateFilter) {
    if (!(await this.owns(userId, weddingId))) return null
    const rows = await this.prisma.giftLedgerEntry.findMany({
      where: {
        weddingId,
        deletedAt: null,
        ...(filter.from || filter.to
          ? {
              receivedAt: {
                ...(filter.from ? { gte: filter.from } : {}),
                ...(filter.to ? { lte: filter.to } : {}),
              },
            }
          : {}),
      },
      select: entrySelect,
      orderBy: [{ receivedAt: 'asc' }, { id: 'asc' }],
    })
    return rows.map(map)
  }
  async promoteToGuest(userId: string, weddingId: string, entryId: string, displayName: string) {
    if (!(await this.owns(userId, weddingId))) return null
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.giftLedgerEntry.findFirst({
        where: { id: entryId, weddingId, deletedAt: null },
        select: { guestId: true, guestDisplayNameSnapshot: true },
      })
      if (!entry) return null
      if (entry.guestId)
        throw new GiftLedgerError(
          'GIFT_ALREADY_LINKED',
          409,
          'Gift entry is already linked to a guest',
        )
      const guest = await tx.guest.create({
        data: { weddingId, displayName, maxPartySize: 1, tags: [] },
        select: { id: true, displayName: true },
      })
      const row = await tx.giftLedgerEntry.update({
        where: { id: entryId },
        data: {
          guestId: guest.id,
          guestDisplayNameSnapshot: guest.displayName,
          revision: { increment: 1 },
        },
        select: entrySelect,
      })
      return map(row)
    })
  }
  async linkGuest(userId: string, weddingId: string, entryId: string, guestId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    const guest = await this.guest(userId, weddingId, guestId)
    if (!guest) throw new GiftLedgerError('GIFT_GUEST_NOT_FOUND', 404, 'Guest not found')
    const result = await this.prisma.giftLedgerEntry.updateMany({
      where: { id: entryId, weddingId, deletedAt: null },
      data: {
        guestId: guest.id,
        guestDisplayNameSnapshot: guest.displayName,
        revision: { increment: 1 },
      },
    })
    if (!result.count) return null
    const row = await this.prisma.giftLedgerEntry.findUnique({
      where: { id: entryId },
      select: entrySelect,
    })
    return row ? map(row) : null
  }
  async unlinkGuest(userId: string, weddingId: string, entryId: string) {
    if (!(await this.owns(userId, weddingId))) return null
    const result = await this.prisma.giftLedgerEntry.updateMany({
      where: { id: entryId, weddingId, deletedAt: null },
      data: { guestId: null, revision: { increment: 1 } },
    })
    if (!result.count) return null
    const row = await this.prisma.giftLedgerEntry.findUnique({
      where: { id: entryId },
      select: entrySelect,
    })
    return row ? map(row) : null
  }
}
