export type GiftMethod = 'cash' | 'bank' | 'physical'
export type GiftKind = 'money' | 'gold' | 'gift'
export type ReciprocityStatus = 'pending' | 'returned' | 'notApplicable'
export type GiftEntry = { id: string; guestName: string; initials: string; group: string; kind: GiftKind; amount?: number; goldWeight?: number; goldType?: string; description?: string; method: GiftMethod; receivedAt: string; reciprocity: ReciprocityStatus; note?: string }

export const initialGiftEntries: GiftEntry[] = [
  { id: 'gift-01', guestName: 'Nguyễn Minh Anh', initials: 'MA', group: 'Bạn cô dâu', kind: 'money', amount: 1000000, method: 'bank', receivedAt: '28/07/2026', reciprocity: 'pending', note: 'Chuyển khoản sau tiệc' },
  { id: 'gift-02', guestName: 'Trần Hoàng Nam', initials: 'HN', group: 'Đồng nghiệp chú rể', kind: 'money', amount: 2000000, method: 'cash', receivedAt: '27/07/2026', reciprocity: 'pending' },
  { id: 'gift-03', guestName: 'Cô Lan & chú Hải', initials: 'LH', group: 'Họ nhà gái', kind: 'money', amount: 5000000, method: 'cash', receivedAt: '27/07/2026', reciprocity: 'notApplicable', note: 'Người thân trong gia đình' },
  { id: 'gift-04', guestName: 'Phạm Gia Huy', initials: 'GH', group: 'Bạn chú rể', kind: 'gift', description: 'Bộ chăn ga cưới', method: 'physical', receivedAt: '26/07/2026', reciprocity: 'pending' },
  { id: 'gift-07', guestName: 'Dì Hương', initials: 'DH', group: 'Họ nhà trai', kind: 'gold', goldWeight: 2, goldType: 'Vàng 24K', method: 'physical', receivedAt: '26/07/2026', reciprocity: 'notApplicable' },
  { id: 'gift-05', guestName: 'Đỗ Ngọc Linh', initials: 'NL', group: 'Bạn cô dâu', kind: 'money', amount: 1000000, method: 'bank', receivedAt: '25/07/2026', reciprocity: 'returned', note: 'Đã mừng lại ngày 12/06/2027' },
  { id: 'gift-06', guestName: 'Vũ Quỳnh Trang', initials: 'QT', group: 'Đồng nghiệp cô dâu', kind: 'money', amount: 500000, method: 'cash', receivedAt: '25/07/2026', reciprocity: 'pending' },
]
export const methodLabels: Record<GiftMethod, string> = { cash: 'Tiền mặt', bank: 'Chuyển khoản', physical: 'Quà tặng' }
export const reciprocityLabels: Record<ReciprocityStatus, string> = { pending: 'Chưa mừng lại', returned: 'Đã mừng lại', notApplicable: 'Không áp dụng' }
