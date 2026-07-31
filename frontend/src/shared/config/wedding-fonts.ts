export type WeddingFontRole = 'display' | 'body' | 'accent'

export type WeddingFontOption = {
  key: string
  label: string
  cssFamily: string
  role: WeddingFontRole
  styles: readonly string[]
  recommendedWeight: string
  minimumSize?: number
}

export const weddingFontOptions: readonly WeddingFontOption[] = [
  { key: 'cormorant-garamond', label: 'Cormorant Garamond', cssFamily: 'var(--font-wedding-display)', role: 'display', styles: ['Thanh lịch', 'Luxury', 'Cổ điển'], recommendedWeight: '400–600', minimumSize: 28 },
  { key: 'playfair-display', label: 'Playfair Display', cssFamily: 'var(--font-wedding-editorial)', role: 'display', styles: ['Editorial', 'Tương phản', 'Sang trọng'], recommendedWeight: '500–700', minimumSize: 28 },
  { key: 'fraunces', label: 'Fraunces', cssFamily: 'var(--font-wedding-expressive)', role: 'display', styles: ['Mềm mại', 'Botanical', 'Artistic'], recommendedWeight: '500–700', minimumSize: 28 },
  { key: 'phudu', label: 'Phudu', cssFamily: 'var(--font-wedding-vietnamese-display)', role: 'display', styles: ['Việt Nam', 'Truyền thống mới', 'Cá tính'], recommendedWeight: '500–700', minimumSize: 24 },
  { key: 'tapestry', label: 'Tapestry', cssFamily: 'var(--font-wedding-ornamental)', role: 'display', styles: ['Trang trí', 'Heritage', 'Cổ điển'], recommendedWeight: '400', minimumSize: 30 },
  { key: 'lora', label: 'Lora', cssFamily: 'var(--font-wedding-warm-serif)', role: 'body', styles: ['Ấm áp', 'Thơ', 'Kể chuyện'], recommendedWeight: '400–600' },
  { key: 'be-vietnam-pro', label: 'Be Vietnam Pro', cssFamily: 'var(--font-wedding-body)', role: 'body', styles: ['Tiếng Việt', 'Hiện đại', 'Dễ đọc'], recommendedWeight: '400–600' },
  { key: 'montserrat', label: 'Montserrat', cssFamily: 'var(--font-wedding-geometric)', role: 'body', styles: ['Tối giản', 'Geometric', 'Hiện đại'], recommendedWeight: '400–600' },
  { key: 'nunito-sans', label: 'Nunito Sans', cssFamily: 'var(--font-wedding-soft-sans)', role: 'body', styles: ['Mềm', 'Thân thiện', 'Trẻ trung'], recommendedWeight: '400–700' },
  { key: 'dancing-script', label: 'Dancing Script', cssFamily: 'var(--font-wedding-script)', role: 'accent', styles: ['Lãng mạn', 'Chữ viết tay'], recommendedWeight: '500–600', minimumSize: 28 },
  { key: 'patrick-hand', label: 'Patrick Hand', cssFamily: 'var(--font-wedding-handwritten)', role: 'accent', styles: ['Tự nhiên', 'Lưu bút', 'Thân mật'], recommendedWeight: '400', minimumSize: 22 },
] as const

export const weddingFontPairings = [
  { name: 'Editorial Luxe', display: 'playfair-display', body: 'montserrat', accent: 'dancing-script' },
  { name: 'Vietnamese Heritage', display: 'phudu', body: 'be-vietnam-pro', accent: 'patrick-hand' },
  { name: 'Botanical Soft', display: 'fraunces', body: 'nunito-sans', accent: 'dancing-script' },
  { name: 'Classic Letter', display: 'cormorant-garamond', body: 'lora', accent: 'dancing-script' },
  { name: 'Ornamental Vow', display: 'tapestry', body: 'be-vietnam-pro', accent: 'patrick-hand' },
] as const
