import type { TemplateConfig, TemplateSectionConfig } from '../../template-config'

const section = (sectionKey: string, label: string, required = false): TemplateSectionConfig => ({
  sectionKey,
  label,
  required,
  canToggle: !required,
  canReorder: !required,
  fields: {},
})

const sections: TemplateSectionConfig[] = [
  // sectionKey: 'opening' · sectionKey: 'cover' · sectionKey: 'invitation' · sectionKey: 'families'
  // sectionKey: 'eventDetails' · sectionKey: 'countdown' · sectionKey: 'calendar' · sectionKey: 'timeline'
  // sectionKey: 'venue' · sectionKey: 'activities' · sectionKey: 'gallery' · sectionKey: 'rsvp'
  // sectionKey: 'guestbook' · sectionKey: 'gift' · sectionKey: 'music' · sectionKey: 'footer'
  section('opening', 'Mở thiệp', true),
  section('cover', 'Bìa thiệp', true),
  section('invitation', 'Lời báo hỷ', true),
  section('families', 'Hai bên gia đình', true),
  section('eventDetails', 'Ngày và giờ', true),
  section('countdown', 'Đếm ngược'),
  section('calendar', 'Lịch trực quan'),
  section('timeline', 'Lịch trình'),
  section('venue', 'Địa điểm và bản đồ'),
  section('activities', 'Hoạt động trong tiệc'),
  section('gallery', 'Album ảnh'),
  section('rsvp', 'Xác nhận tham dự'),
  section('guestbook', 'Gửi lời chúc'),
  section('gift', 'Thông tin mừng cưới'),
  section('music', 'Nhạc nền'),
  section('footer', 'Lời cảm ơn', true),
]

export const sunlitSilkTemplateConfig = {
  templateKey: 'sunlit-silk',
  displayName: 'Nắng Trên Lụa',
  templateVersion: '0.3.0',
  templateConfigVersion: '1.0',
  contentSchemaVersion: '1.0',
  rendererApiVersion: '1.0',
  status: 'draft',
  productType: 'ONLINE_INVITATION',
  type: 'invitation',
  previewPath: '/templates/invitations/sunlit-silk/preview',
  palettes: [{ key: 'sunlit-silk', label: 'Nắng trên lụa', default: true }],
  sections,
  composition: {
    defaultLayout: 'sunlit-silk-paper-scroll',
    layouts: {
      opening: 'envelope-reveal', cover: 'layered-paper-theatre', invitation: 'seal-and-ribbon',
      families: 'dual-cards', eventDetails: 'date-diptych', countdown: 'floating-counters',
      calendar: 'linen-month-grid', timeline: 'vertical-timeline', venue: 'venue-card-over-map',
      activities: 'stitched-list', gallery: 'linen-stack', rsvp: 'reply-card', guestbook: 'stacked-notes',
      gift: 'single-qr-card', music: 'music-dock', footer: 'closing-letter',
    },
    mobileFallback: 'native-vertical-scroll',
  },
  theme: { identity: ['sunlit-silk', 'raw-linen', 'antique-brass', 'quiet-editorial'], artworkManifest: 'ASSET-MANIFEST.md' },
} as const satisfies TemplateConfig
