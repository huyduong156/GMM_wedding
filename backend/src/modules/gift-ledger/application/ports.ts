import type { GiftLedgerError } from '../domain/gift-ledger-error'
export type GiftType = 'money' | 'gold' | 'physicalGift'
export type GiftReceiveMethod = 'cash' | 'bankTransfer' | 'physicalGift' | 'other'
export type ReciprocityStatus = 'pending' | 'returned' | 'notApplicable'
export type GiftLedgerView = {
  id: string
  weddingId: string
  guestId: string | null
  guestDisplayNameSnapshot: string
  giftType: GiftType
  amountMinor: string | null
  currency: string | null
  goldWeight: string | null
  goldUnit: string | null
  goldType: string | null
  giftDescription: string | null
  receiveMethod: GiftReceiveMethod
  receivedAt: Date
  note: string | null
  reciprocityStatus: ReciprocityStatus
  returnedAt: Date | null
  revision: number
  createdAt: Date
  updatedAt: Date
  linkedGuest: { id: string; displayName: string } | null
}
export type GiftListFilter = {
  query?: string | undefined
  giftType?: GiftType | undefined
  receiveMethod?: GiftReceiveMethod | undefined
  reciprocityStatus?: ReciprocityStatus | undefined
  guestId?: string | undefined
  from?: Date | undefined
  to?: Date | undefined
  limit: number
  cursor?: string | undefined
}
export type GiftDateFilter = { from?: Date | undefined; to?: Date | undefined }
export type CreateGiftData = {
  guestName: string
  guestId?: string | undefined
  giftType: GiftType
  amountMinor?: bigint | undefined
  currency?: string | undefined
  goldWeight?: string | undefined
  goldUnit?: string | undefined
  goldType?: string | undefined
  giftDescription?: string | undefined
  receiveMethod: GiftReceiveMethod
  receivedAt: Date
  note?: string | undefined
  reciprocityStatus?: ReciprocityStatus | undefined
  returnedAt?: Date | undefined
}
export type UpdateGiftData = Partial<Omit<CreateGiftData, 'guestId' | 'guestName'>> & {
  guestName?: string | undefined
  guestId?: string | null | undefined
  revision: number
}
export type GiftSummary = {
  entryCount: number
  pendingCount: number
  returnedCount: number
  notApplicableCount: number
  money: { count: number; totals: Array<{ currency: string; amountMinor: string }> }
  gold: { count: number; totals: Array<{ unit: string; type: string | null; weight: string }> }
  physicalGiftCount: number
}
export interface GiftLedgerRepository {
  listOwned(
    userId: string,
    weddingId: string,
    filter: GiftListFilter,
  ): Promise<{ items: GiftLedgerView[]; nextCursor: string | null } | null>
  findOwned(userId: string, weddingId: string, entryId: string): Promise<GiftLedgerView | null>
  createOwned(
    userId: string,
    weddingId: string,
    data: CreateGiftData,
  ): Promise<GiftLedgerView | null>
  updateOwned(
    userId: string,
    weddingId: string,
    entryId: string,
    data: UpdateGiftData,
  ): Promise<GiftLedgerView | 'conflict' | null>
  deleteOwned(userId: string, weddingId: string, entryId: string): Promise<boolean | null>
  summaryOwned(
    userId: string,
    weddingId: string,
    filter: GiftDateFilter,
  ): Promise<GiftSummary | null>
  exportOwned(
    userId: string,
    weddingId: string,
    filter: GiftDateFilter,
  ): Promise<GiftLedgerView[] | null>
  promoteToGuest(
    userId: string,
    weddingId: string,
    entryId: string,
    displayName: string,
  ): Promise<GiftLedgerView | null>
  linkGuest(
    userId: string,
    weddingId: string,
    entryId: string,
    guestId: string,
  ): Promise<GiftLedgerView | null>
  unlinkGuest(userId: string, weddingId: string, entryId: string): Promise<GiftLedgerView | null>
}
export type GiftLedgerResult<T> = T | null | 'conflict'
export type GiftLedgerFailure = GiftLedgerError
