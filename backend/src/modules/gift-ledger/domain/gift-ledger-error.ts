export type GiftLedgerErrorCode = 'WEDDING_NOT_FOUND' | 'GIFT_ENTRY_NOT_FOUND' | 'GIFT_GUEST_NOT_FOUND' | 'GIFT_ALREADY_LINKED' | 'GIFT_INVALID' | 'GIFT_REVISION_CONFLICT'
export class GiftLedgerError extends Error { constructor(public readonly code: GiftLedgerErrorCode, public readonly status: number, message: string) { super(message); this.name = 'GiftLedgerError' } }
