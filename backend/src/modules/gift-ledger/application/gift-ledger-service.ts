import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import { GiftLedgerError } from '../domain/gift-ledger-error'
import type { CreateGiftData, GiftDateFilter, GiftLedgerRepository, GiftListFilter, UpdateGiftData } from './ports'
export class GiftLedgerService {
  constructor(private readonly repository: GiftLedgerRepository) {}
  list(actor: AuthenticatedUserActor, weddingId: string, filter: GiftListFilter) { return this.require(this.repository.listOwned(actor.userId, weddingId, filter)) }
  get(actor: AuthenticatedUserActor, weddingId: string, entryId: string) { return this.requireEntry(this.repository.findOwned(actor.userId, weddingId, entryId)) }
  create(actor: AuthenticatedUserActor, weddingId: string, data: CreateGiftData) { return this.requireEntry(this.repository.createOwned(actor.userId, weddingId, data)) }
  async update(actor: AuthenticatedUserActor, weddingId: string, entryId: string, data: UpdateGiftData) { const result = await this.repository.updateOwned(actor.userId, weddingId, entryId, data); if (result === 'conflict') throw new GiftLedgerError('GIFT_REVISION_CONFLICT', 409, 'Gift entry was changed by another request'); return this.requireEntry(result) }
  async remove(actor: AuthenticatedUserActor, weddingId: string, entryId: string) { const result = await this.repository.deleteOwned(actor.userId, weddingId, entryId); if (result === null) throw new GiftLedgerError('WEDDING_NOT_FOUND', 404, 'Wedding not found'); if (!result) throw new GiftLedgerError('GIFT_ENTRY_NOT_FOUND', 404, 'Gift entry not found') }
  summary(actor: AuthenticatedUserActor, weddingId: string, filter: GiftDateFilter) { return this.require(this.repository.summaryOwned(actor.userId, weddingId, filter)) }
  async exportCsv(actor: AuthenticatedUserActor, weddingId: string, filter: GiftDateFilter) { const rows = this.require(await this.repository.exportOwned(actor.userId, weddingId, filter)); const esc = (value: unknown) => { const text = value === null || value === undefined ? '' : String(value); return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text }; const lines = [['Tên khách', 'Guest ID', 'Loại', 'Số tiền minor', 'Currency', 'Trọng lượng vàng', 'Đơn vị vàng', 'Loại vàng', 'Mô tả quà', 'Hình thức nhận', 'Ngày nhận', 'Trạng thái mừng lại', 'Ngày mừng lại', 'Ghi chú'], ...rows.map((row) => [row.guestDisplayNameSnapshot, row.guestId, row.giftType, row.amountMinor, row.currency, row.goldWeight, row.goldUnit, row.goldType, row.giftDescription, row.receiveMethod, row.receivedAt.toISOString(), row.reciprocityStatus, row.returnedAt?.toISOString() ?? null, row.note])]; return '\uFEFF' + lines.map((line) => line.map(esc).join(',')).join('\r\n') + '\r\n' }
  promote(actor: AuthenticatedUserActor, weddingId: string, entryId: string, displayName: string) { return this.requireEntry(this.repository.promoteToGuest(actor.userId, weddingId, entryId, displayName)) }
  link(actor: AuthenticatedUserActor, weddingId: string, entryId: string, guestId: string) { return this.requireEntry(this.repository.linkGuest(actor.userId, weddingId, entryId, guestId)) }
  unlink(actor: AuthenticatedUserActor, weddingId: string, entryId: string) { return this.requireEntry(this.repository.unlinkGuest(actor.userId, weddingId, entryId)) }
  private require<T>(value: T | null): T { if (value === null) throw new GiftLedgerError('WEDDING_NOT_FOUND', 404, 'Wedding not found'); return value }
  private requireEntry<T>(value: T | null): T { if (value === null) throw new GiftLedgerError('GIFT_ENTRY_NOT_FOUND', 404, 'Gift entry not found'); return value }
}
