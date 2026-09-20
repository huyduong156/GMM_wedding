import type { TemplateConfig } from '../../template-config'

const text = (label: string, contentKey?: string, extra: Record<string, unknown> = {}) => ({
  type: 'string' as const,
  label,
  ...(contentKey ? { contentKey } : {}),
  ...extra,
})
const multiline = (label: string, contentKey: string, maxLength = 600) => ({
  type: 'text' as const,
  label,
  contentKey,
  maxLength,
})
const image = (label: string, contentKey: string, mediaRole: string, mediaValue: 'url' | 'object' = 'object') => ({
  type: 'image' as const,
  label,
  contentKey,
  mediaRole,
  mediaValue,
})

export const vanHyTemplateConfig = {
  templateKey: 'van-hy',
  displayName: 'Vạn Hỷ',
  templateVersion: '1.0.0',
  templateConfigVersion: '1.0',
  contentSchemaVersion: '1.0',
  rendererApiVersion: '1.0',
  status: 'ready',
  productType: 'ONLINE_INVITATION',
  type: 'invitation',
  previewPath: '/templates/invitations/van-hy/preview',
  quickEdit: [
    { contentKey: 'brideName', label: 'Tên cô dâu' },
    { contentKey: 'groomName', label: 'Tên chú rể' },
    { contentKey: 'weddingDate', label: 'Ngày cưới' },
  ],
  palettes: [{ key: 'van-hy', label: 'Đỏ đô Vạn Hỷ', default: true }],
  capabilities: {
    commonRsvp: true, guestbook: true, gallery: true, calendar: true, maps: true,
    gift: true, backgroundMusic: true, smoothScroll: true, reducedMotion: true,
  },
  theme: {
    identity: ['van-hy', 'burgundy-card', 'floating-hy', 'paper-cut-celebration'],
    default: { palette: 'van-hy', motionLevel: 'EXPRESSIVE', galleryStyle: 'editorial-grid' },
    artworkManifest: 'ASSET_MANIFEST.md',
  },
  composition: {
    defaultLayout: 'mobile-red-card-scroll',
    layouts: {
      opening: 'full-screen-card-reveal', cover: 'layered-paper-theatre', invitation: 'seal-and-ribbon',
      families: 'dual-cards', countdown: 'four-unit-grid', venue: 'venue-card-over-map',
      timeline: 'vertical-timeline', gallery: 'editorial-grid', rsvp: 'single-card-form',
      guestbook: 'stacked-notes', gift: 'dual-floating-envelope-modal', music: 'sticky-action-chip', footer: 'closing-letter',
    },
    mobileFallback: 'native-vertical-scroll-2d',
    reducedMotionFallback: 'static-layered-composition',
  },
  motion: {
    level: 'EXPRESSIVE',
    smoothScroll: { desktop: 'native-progressive-enhancement', mobile: 'native-scroll', reducedMotion: 'native-scroll' },
    signature: 'full-screen-hy-card-reveal',
    performanceBudget: { maxAnimatedNodes: 24, maxConcurrentDecor: 8, pauseWhenHidden: true },
  },
  sections: [
    { sectionKey: 'opening', label: 'Mở thiệp Hỷ sự', required: true, canToggle: false, canReorder: false, fields: { openingTitle: text('Tiêu đề mở thiệp'), openingMessage: multiline('Lời nhắn mở thiệp', 'openingMessage', 180) } },
    { sectionKey: 'cover', label: 'Bìa thiệp', required: true, canToggle: false, canReorder: false, fields: { coverEyebrow: text('Dòng giới thiệu bìa'), brideName: text('Tên cô dâu', 'brideName', { required: true, maxLength: 80 }), groomName: text('Tên chú rể', 'groomName', { required: true, maxLength: 80 }), weddingDate: text('Ngày cưới', 'weddingDate', { required: true, maxLength: 40 }) } },
    { sectionKey: 'families', label: 'Lời báo hỷ và hai bên gia đình', required: true, canToggle: false, canReorder: false, fields: { familiesTitle: text('Tiêu đề gia đình', 'familiesTitle'), familiesMessage: multiline('Lời nhắn hai gia đình', 'familiesMessage'), brideFatherTitle: text('Danh xưng bố cô dâu', 'brideFatherTitle'), brideFather: text('Tên bố cô dâu', 'brideFather'), brideMotherTitle: text('Danh xưng mẹ cô dâu', 'brideMotherTitle'), brideMother: text('Tên mẹ cô dâu', 'brideMother'), brideFamilyAddress: text('Địa chỉ gia đình cô dâu', 'brideFamilyAddress'), groomFatherTitle: text('Danh xưng bố chú rể', 'groomFatherTitle'), groomFather: text('Tên bố chú rể', 'groomFather'), groomMotherTitle: text('Danh xưng mẹ chú rể', 'groomMotherTitle'), groomMother: text('Tên mẹ chú rể', 'groomMother'), groomFamilyAddress: text('Địa chỉ gia đình chú rể', 'groomFamilyAddress') } },
    { sectionKey: 'countdown', label: 'Đếm ngược và địa điểm ngày vui', canToggle: true, canReorder: true, fields: { countdownTitle: text('Tiêu đề đếm ngược', 'countdownTitle'), venueName: text('Tên địa điểm', 'venueName'), venueAddress: text('Địa chỉ', 'venueAddress'), venueTime: { type: 'time' as const, label: 'Thời gian', contentKey: 'venueTime' }, mapUrl: { type: 'url' as const, label: 'Đường dẫn bản đồ', contentKey: 'mapUrl' } } },
    { sectionKey: 'timeline', label: 'Lịch trình trong ngày', canToggle: true, canReorder: true, fields: { timelineTitle: text('Tiêu đề lịch trình'), timelineItems: { type: 'items' as const, label: 'Các mốc thời gian', contentKey: 'timelineItems', maxItems: 10, itemFields: { time: { type: 'time' as const, label: 'Thời gian', required: true }, title: text('Tên hoạt động', undefined, { required: true }), detail: multiline('Mô tả', 'detail', 240) } } } },
    { sectionKey: 'gallery', label: 'Album ảnh', canToggle: true, canReorder: true, fields: { galleryTitle: text('Tiêu đề album'), galleryImages: { type: 'images' as const, label: 'Ảnh trong album', contentKey: 'galleryImages', mediaRole: 'gallery', mediaValue: 'url' as const, maxItems: 12 } } },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true, fields: { rsvpTitle: text('Tiêu đề xác nhận'), rsvpDeadline: text('Hạn phản hồi', 'rsvpDeadline') } },
    { sectionKey: 'guestbook', label: 'Sổ lưu bút', canToggle: true, canReorder: true, fields: { guestbookTitle: text('Tiêu đề sổ lưu bút'), guestbookMessage: multiline('Lời mời gửi lời chúc', 'guestbookMessage', 240) } },
    { sectionKey: 'gift', label: 'Quà mừng cưới', canToggle: true, canReorder: true, fields: { giftTitle: text('Tiêu đề quà mừng'), giftMessage: multiline('Lời nhắn quà mừng', 'giftMessage', 240) } },
    { sectionKey: 'music', label: 'Nhạc nền', canToggle: true, canReorder: false, fields: { backgroundMusicUrl: { type: 'audio' as const, label: 'Nhạc nền', contentKey: 'backgroundMusicUrl', audioNameKey: 'backgroundMusicName' }, backgroundMusicAutoplay: { type: 'boolean' as const, label: 'Tự động phát', contentKey: 'backgroundMusicAutoplay', default: false } } },
    { sectionKey: 'footer', label: 'Lời cảm ơn', required: true, canToggle: false, canReorder: false, fields: { footerMessage: multiline('Lời cảm ơn', 'footerMessage', 300), footerMedia: image('Ảnh trang trí cuối thiệp', 'footerMedia', 'footer') } },
  ],
} as const satisfies TemplateConfig