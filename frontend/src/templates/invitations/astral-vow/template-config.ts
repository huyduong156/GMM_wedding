import type { TemplateConfig } from '../../template-config'
import { astralVowFixture } from './fixture'

const text = (label: string, contentKey: string, required = false) => ({ type: 'string' as const, label, contentKey, ...(required ? { required: true } : {}) })
const optional = (sectionKey: string, label: string, fields: Record<string, unknown> = {}) => ({ sectionKey, label, canToggle: true, canReorder: true, fields })
const astralVowSections = [
  { sectionKey: 'opening', label: 'Mở thiệp', required: true, canToggle: false, canReorder: false, mediaRoles: ['opening-back', 'opening-front'], fields: { title: text('Tiêu đề mở thiệp', 'opening.title'), message: text('Lời nhắn', 'opening.message'), openingMediaBack: { type: 'image' as const, label: 'Ảnh lớp sau khi mở thiệp', contentKey: 'openingMediaBack', mediaRole: 'opening-back', mediaValue: 'object' as const }, openingMediaFront: { type: 'image' as const, label: 'Ảnh lớp trước khi mở thiệp', contentKey: 'openingMediaFront', mediaRole: 'opening-front', mediaValue: 'object' as const } } },
  { sectionKey: 'cover', label: 'Bìa thiệp', required: true, canToggle: false, canReorder: false, fields: { brideName: text('Tên cô dâu', 'couple.brideName', true), groomName: text('Tên chú rể', 'couple.groomName', true), weddingDate: text('Ngày cưới', 'event.weddingDate', true), eyebrow: text('Dòng giới thiệu', 'cover.eyebrow'), title: text('Tiêu đề bìa', 'cover.title') } },
  { sectionKey: 'invitation', label: 'Lời mời', required: true, canToggle: false, canReorder: false, fields: { title: text('Tiêu đề lời mời', 'invitation.title'), message: { type: 'text' as const, label: 'Nội dung lời mời', contentKey: 'invitation.message', maxLength: 500 } } },
  { sectionKey: 'families', label: 'Thông tin hai gia đình', required: true, canToggle: false, canReorder: false, fields: { title: text('Tiêu đề', 'families.title'), subtitle: text('Dòng phụ', 'families.subtitle') } },
  { sectionKey: 'eventDetails', label: 'Thời gian hôn lễ', required: true, canToggle: false, canReorder: false, fields: { title: text('Tiêu đề', 'eventDetails.title'), date: text('Ngày hôn lễ', 'eventDetails.date') } },
  optional('countdown', 'Đếm ngược ngày vui'),
  optional('timeline', 'Lịch trình trong ngày', { items: { type: 'items' as const, contentKey: 'timeline.items', label: 'Các mốc thời gian', maxItems: 10 } }),
  optional('venue', 'Địa điểm và bản đồ', { name: text('Tên địa điểm', 'venue.name', true), address: text('Địa chỉ', 'venue.address', true), mapUrl: { type: 'url' as const, contentKey: 'venue.mapUrl', label: 'Đường dẫn bản đồ' } }),
  optional('gallery', 'Album ảnh', { images: { type: 'images' as const, contentKey: 'galleryImages', label: 'Ảnh trong album', mediaRole: 'gallery', mediaValue: 'url' as const, maxItems: 12 } }),
  optional('rsvp', 'Xác nhận tham dự', { title: text('Tiêu đề RSVP', 'rsvp.title'), message: { type: 'text' as const, label: 'Lời nhắn RSVP', contentKey: 'rsvp.message', maxLength: 240 } }),
  optional('guestbook', 'Sổ lưu bút', { title: text('Tiêu đề sổ lưu bút', 'guestbook.title') }),
  optional('gift', 'Thông tin mừng cưới', { title: text('Tiêu đề mừng cưới', 'gift.title'), qrMedia: { type: 'image' as const, label: 'Mã QR mừng cưới', contentKey: 'giftQrMedia', mediaRole: 'gift-qr', mediaValue: 'object' as const } }),
  { sectionKey: 'music', label: 'Nhạc nền', canToggle: true, canReorder: false, fields: { backgroundMusicUrl: { type: 'audio' as const, contentKey: 'music.backgroundMusicUrl', audioNameKey: 'music.backgroundMusicName', label: 'Nhạc nền' } } },
  { sectionKey: 'footer', label: 'Lời cảm ơn cuối thiệp', required: true, canToggle: false, canReorder: false, fields: { title: text('Tiêu đề cuối thiệp', 'footer.title'), message: { type: 'text' as const, label: 'Lời nhắn cuối thiệp', contentKey: 'footer.message', maxLength: 300 } } },
] as const

export const astralVowTemplateConfig = {
  templateKey: 'astral-vow', displayName: 'Astral Vow', templateVersion: '1.0.0', templateConfigVersion: '1.0', contentSchemaVersion: '1.0', rendererApiVersion: '1.0', status: 'review', productType: 'ONLINE_INVITATION', type: 'invitation',
  previewPath: '/templates/invitations/astral-vow/preview',
  quickEdit: [{ contentKey: 'couple.brideName', label: 'Tên cô dâu' }, { contentKey: 'couple.groomName', label: 'Tên chú rể' }, { contentKey: 'event.weddingDate', label: 'Ngày cưới' }], palettes: [{ key: 'astral-vow', label: 'Tinh hà huyền bí', default: true }], defaultData: astralVowFixture,
  capabilities: { commonRsvp: true, guestbook: true, gallery: true, calendar: true, maps: true, gift: true, backgroundMusic: true, reducedMotion: true },
  sections: astralVowSections,
  theme: { identity: ['astral-vow', 'celestial-invitation', 'midnight-nebula', 'eclipse-seal'], default: { palette: 'astral-vow', motionLevel: 'EXPRESSIVE', galleryStyle: 'constellation-stack' }, artworkManifest: 'ASSET_MANIFEST.md' },
  composition: { defaultLayout: 'mobile-celestial-scroll', layouts: { opening: 'eclipse-envelope-reveal', cover: 'constellation-hero', invitation: 'ornamental-plaque', families: 'dual-orbit-cards', eventDetails: 'celestial-program', countdown: 'four-unit-grid', timeline: 'orbit-route', venue: 'observatory-card', gallery: 'photo-constellation', rsvp: 'reply-card', guestbook: 'star-note', gift: 'minimal-bank-card', music: 'ambient-player-dock', footer: 'starfall-closing' }, mobileFallback: 'native-vertical-scroll', reducedMotionFallback: 'static-celestial-composition' },
} as const satisfies TemplateConfig
