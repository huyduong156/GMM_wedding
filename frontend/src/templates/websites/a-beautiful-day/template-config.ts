import type { TemplateConfig, TemplateFieldConfig } from '../../template-config'
import type { ABeautifulDaySectionKey } from './content'

const fields = (entries: Record<string, TemplateFieldConfig>) => entries
const media = (label: string, contentKey: string, mediaRole: string) => ({
  type: 'image' as const,
  contentKey,
  label,
  mediaRole,
  mediaValue: 'object' as const,
})

const sectionFields: Partial<Record<ABeautifulDaySectionKey, Record<string, TemplateFieldConfig>>> = {
  hero: fields({
    seoTitle: { type: 'string', contentKey: 'seo.title', label: 'Tiêu đề SEO', required: true, maxLength: 70 },
    seoDescription: { type: 'text', contentKey: 'seo.description', label: 'Mô tả SEO', required: true, maxLength: 180 },
    seoImage: media('Ảnh chia sẻ mạng xã hội', 'seo.ogImageId', 'seo'),
    brideName: { type: 'string', contentKey: 'hero.brideName', label: 'Tên cô dâu', required: true, maxLength: 80 },
    groomName: { type: 'string', contentKey: 'hero.groomName', label: 'Tên chú rể', required: true, maxLength: 80 },
    primaryEventId: { type: 'string', contentKey: 'hero.primaryEventId', label: 'Mã sự kiện chính', required: true, maxLength: 80 },
    heroMedia: media('Ảnh mở đầu', 'hero.heroMediaId', 'hero'),
  }),
  announcement: fields({
    title: { type: 'string', contentKey: 'announcement.title', label: 'Tiêu đề', maxLength: 120 },
    message: { type: 'text', contentKey: 'announcement.message', label: 'Lời báo tin', required: true, maxLength: 600 },
  }),
  couple: fields({
    brideName: { type: 'string', contentKey: 'couple.bride.displayName', label: 'Tên cô dâu', required: true, maxLength: 80 },
    brideBio: { type: 'text', contentKey: 'couple.bride.biography', label: 'Giới thiệu cô dâu', maxLength: 600 },
    bridePortrait: media('Ảnh cô dâu', 'couple.bride.portraitMediaId', 'couple-portrait'),
    groomName: { type: 'string', contentKey: 'couple.groom.displayName', label: 'Tên chú rể', required: true, maxLength: 80 },
    groomBio: { type: 'text', contentKey: 'couple.groom.biography', label: 'Giới thiệu chú rể', maxLength: 600 },
    groomPortrait: media('Ảnh chú rể', 'couple.groom.portraitMediaId', 'couple-portrait'),
    brideSocialLinks: { type: 'items', contentKey: 'couple.bride.socialLinks', label: 'Liên kết của cô dâu', maxItems: 8, itemFields: { label: { type: 'string', label: 'Tên liên kết', required: true, maxLength: 40 }, url: { type: 'url', label: 'Đường dẫn HTTPS', required: true } } },
    groomSocialLinks: { type: 'items', contentKey: 'couple.groom.socialLinks', label: 'Liên kết của chú rể', maxItems: 8, itemFields: { label: { type: 'string', label: 'Tên liên kết', required: true, maxLength: 40 }, url: { type: 'url', label: 'Đường dẫn HTTPS', required: true } } },
  }),
  story: fields({
    title: { type: 'string', contentKey: 'story.title', label: 'Tiêu đề câu chuyện', maxLength: 120 },
    introduction: { type: 'text', contentKey: 'story.introduction', label: 'Lời dẫn câu chuyện', maxLength: 600 },
    milestones: {
      type: 'items', contentKey: 'story.milestones', label: 'Các cột mốc', maxItems: 12,
      itemFields: {
        date: { type: 'string', label: 'Thời điểm', maxLength: 40 },
        title: { type: 'string', label: 'Tiêu đề', required: true, maxLength: 120 },
        body: { type: 'text', label: 'Nội dung', maxLength: 1200 },
        mediaId: { type: 'image', label: 'Ảnh cột mốc', mediaRole: 'story-moment', mediaValue: 'object' },
      },
    },
  }),
  events: fields({
    title: { type: 'string', contentKey: 'events.title', label: 'Tiêu đề sự kiện', maxLength: 120 },
    introduction: { type: 'text', contentKey: 'events.introduction', label: 'Lời dẫn sự kiện', maxLength: 600 },
    eventIds: {
      type: 'items', contentKey: 'events.eventIds', label: 'Sự kiện công khai', maxItems: 12,
      itemFields: { eventId: { type: 'string', label: 'Mã sự kiện', required: true, maxLength: 80 } },
    },
  }),
  countdown: fields({
    eventId: { type: 'string', contentKey: 'countdown.eventId', label: 'Mã sự kiện đếm ngược', required: true, maxLength: 80 },
  }),
  venues: fields({
    title: { type: 'string', contentKey: 'venues.title', label: 'Tiêu đề địa điểm', maxLength: 120 },
    eventIds: {
      type: 'items', contentKey: 'venues.eventIds', label: 'Sự kiện và địa điểm', maxItems: 12,
      itemFields: { eventId: { type: 'string', label: 'Mã sự kiện', required: true, maxLength: 80 } },
    },
    travelNote: { type: 'text', contentKey: 'venues.travelNote', label: 'Ghi chú di chuyển', maxLength: 600 },
  }),
  gallery: fields({
    title: { type: 'string', contentKey: 'gallery.title', label: 'Tiêu đề album', maxLength: 120 },
    introduction: { type: 'text', contentKey: 'gallery.introduction', label: 'Lời dẫn album', maxLength: 600 },
    images: { type: 'images', contentKey: 'gallery.mediaIds', label: 'Ảnh trong album', maxItems: 40, mediaRole: 'gallery', mediaValue: 'object' },
  }),
  schedule: fields({
    title: { type: 'string', contentKey: 'schedule.title', label: 'Tiêu đề lịch trình', maxLength: 120 },
    items: {
      type: 'items', contentKey: 'schedule.items', label: 'Các mốc chương trình', maxItems: 30,
      itemFields: {
        eventId: { type: 'string', label: 'Mã sự kiện', required: true },
        time: { type: 'time', label: 'Thời gian', required: true },
        title: { type: 'string', label: 'Hoạt động', required: true, maxLength: 120 },
        detail: { type: 'text', label: 'Chi tiết', maxLength: 600 },
      },
    },
  }),
  weddingParty: fields({
    title: { type: 'string', contentKey: 'weddingParty.title', label: 'Tiêu đề người đồng hành', maxLength: 120 },
    groups: {
      type: 'items', contentKey: 'weddingParty.groups', label: 'Nhóm người đồng hành', maxItems: 8,
      itemFields: {
        title: { type: 'string', label: 'Tên nhóm', required: true, maxLength: 100 },
        members: { type: 'items', label: 'Thành viên', maxItems: 20, itemFields: {
          name: { type: 'string', label: 'Họ tên', required: true, maxLength: 80 },
          role: { type: 'string', label: 'Vai trò', maxLength: 80 },
          biography: { type: 'text', label: 'Giới thiệu', maxLength: 600 },
          mediaId: { type: 'image', label: 'Ảnh thành viên', mediaRole: 'wedding-party', mediaValue: 'object' },
        } },
      },
    },
  }),
  dressCode: fields({
    title: { type: 'string', contentKey: 'dressCode.title', label: 'Tiêu đề dress code', maxLength: 120 },
    message: { type: 'text', contentKey: 'dressCode.message', label: 'Gợi ý trang phục', maxLength: 600 },
    colors: {
      type: 'items', contentKey: 'dressCode.colors', label: 'Bảng màu', maxItems: 12,
      itemFields: {
        label: { type: 'string', label: 'Tên màu', required: true, maxLength: 40 },
        hex: { type: 'string', label: 'Mã màu', required: true, maxLength: 7 },
      },
    },
  }),
  travel: fields({
    title: { type: 'string', contentKey: 'travel.title', label: 'Tiêu đề hướng dẫn', maxLength: 120 },
    items: {
      type: 'items', contentKey: 'travel.items', label: 'Hướng dẫn di chuyển', maxItems: 20,
      itemFields: {
        type: { type: 'select', label: 'Loại hướng dẫn', options: [
          { key: 'HOTEL', label: 'Khách sạn' }, { key: 'TRANSPORT', label: 'Di chuyển' },
          { key: 'PARKING', label: 'Đậu xe' }, { key: 'OTHER', label: 'Khác' },
        ] },
        title: { type: 'string', label: 'Tiêu đề', required: true, maxLength: 120 },
        detail: { type: 'text', label: 'Chi tiết', required: true, maxLength: 600 },
        url: { type: 'url', label: 'Đường dẫn HTTPS' },
      },
    },
  }),
  faq: fields({
    title: { type: 'string', contentKey: 'faq.title', label: 'Tiêu đề câu hỏi thường gặp', maxLength: 120 },
    items: {
      type: 'items', contentKey: 'faq.items', label: 'Câu hỏi và trả lời', maxItems: 20,
      itemFields: {
        question: { type: 'string', label: 'Câu hỏi', required: true, maxLength: 240 },
        answer: { type: 'text', label: 'Câu trả lời', required: true, maxLength: 1200 },
      },
    },
  }),
  rsvp: fields({
    title: { type: 'string', contentKey: 'rsvp.title', label: 'Tiêu đề RSVP', maxLength: 120 },
    message: { type: 'text', contentKey: 'rsvp.message', label: 'Lời nhắn RSVP', maxLength: 600 },
    deadline: { type: 'date', contentKey: 'rsvp.deadline', label: 'Hạn phản hồi' },
    eventIds: { type: 'items', contentKey: 'rsvp.eventIds', label: 'Sự kiện cần xác nhận', maxItems: 12, itemFields: { eventId: { type: 'string', label: 'Mã sự kiện', required: true } } },
  }),
  guestbook: fields({
    title: { type: 'string', contentKey: 'guestbook.title', label: 'Tiêu đề sổ lưu bút', maxLength: 120 },
    message: { type: 'text', contentKey: 'guestbook.message', label: 'Lời nhắn sổ lưu bút', maxLength: 600 },
  }),
  gift: fields({
    title: { type: 'string', contentKey: 'gift.title', label: 'Tiêu đề mừng cưới', maxLength: 120 },
    message: { type: 'text', contentKey: 'gift.message', label: 'Lời nhắn mừng cưới', maxLength: 600 },
    accounts: {
      type: 'items', contentKey: 'gift.accounts', label: 'Thông tin mừng cưới', maxItems: 8,
      itemFields: {
        ownerLabel: { type: 'string', label: 'Người nhận', required: true, maxLength: 100 },
        bankName: { type: 'string', label: 'Ngân hàng', maxLength: 100 },
        accountNumber: { type: 'string', label: 'Số tài khoản', maxLength: 40 },
        qrMediaId: { type: 'image', label: 'Mã QR', mediaRole: 'gift-qr', mediaValue: 'object' },
      },
    },
  }),
  music: fields({
    musicTrackId: { type: 'audio', contentKey: 'music.musicTrackId', label: 'Nhạc nền', audioNameKey: 'music.musicTrackName', maxSizeMb: 20 },
    autoplay: { type: 'boolean', contentKey: 'music.autoplay', label: 'Tự phát nhạc khi mở trang', default: false },
  }),
  footer: fields({
    message: { type: 'text', contentKey: 'footer.message', label: 'Lời nhắn cuối trang', required: true, maxLength: 600 },
    signature: { type: 'string', contentKey: 'footer.signature', label: 'Chữ ký', maxLength: 120 },
  }),
}

export const aBeautifulDayTemplateConfig = {
  templateKey: 'a-beautiful-day',
  displayName: 'A Beautiful Day',
  productType: 'WEDDING_WEBSITE',
  templateVersion: '0.1.0',
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
  status: 'draft',
  type: 'website',
  previewPath: '/templates/websites/a-beautiful-day/preview',
  description: 'Website cưới botanical editorial với ảnh cưới làm trung tâm và sắc màu khu vườn ngày nắng.',
  capabilities: { commonRsvp: true, guestbook: true, backgroundMusic: true, seo: true },
  theme: {
    palettes: ['quiet-ivory'],
    heroStyles: ['garden-editorial'],
    storyStyles: ['alternating-timeline'],
    galleryStyles: ['editorial-grid'],
    default: {
      palette: 'quiet-ivory',
      heroStyle: 'garden-editorial',
      storyStyle: 'alternating-timeline',
      galleryStyle: 'editorial-grid',
      typographyScale: 'BALANCED',
      motionLevel: 'SUBTLE',
    },
  },
  sections: [
    { sectionKey: 'navigation', label: 'Điều hướng', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'hero', label: 'Trang mở đầu', required: true, canToggle: false, canReorder: false, fields: sectionFields.hero },
    { sectionKey: 'announcement', label: 'Lời báo tin', required: true, canToggle: false, canReorder: false, fields: sectionFields.announcement },
    { sectionKey: 'couple', label: 'Cặp đôi', required: true, canToggle: false, canReorder: true, fields: sectionFields.couple },
    { sectionKey: 'story', label: 'Chuyện chúng mình', canToggle: true, canReorder: true, fields: sectionFields.story },
    { sectionKey: 'events', label: 'Sự kiện', required: true, canToggle: false, canReorder: true, fields: sectionFields.events },
    { sectionKey: 'countdown', label: 'Đếm ngược', canToggle: true, canReorder: true, fields: sectionFields.countdown },
    { sectionKey: 'venues', label: 'Địa điểm', required: true, canToggle: false, canReorder: true, fields: sectionFields.venues },
    { sectionKey: 'gallery', label: 'Album ảnh', canToggle: true, canReorder: true, fields: sectionFields.gallery },
    { sectionKey: 'schedule', label: 'Lịch trình', canToggle: true, canReorder: true, fields: sectionFields.schedule },
    { sectionKey: 'weddingParty', label: 'Người đồng hành', canToggle: true, canReorder: true, fields: sectionFields.weddingParty },
    { sectionKey: 'dressCode', label: 'Trang phục', canToggle: true, canReorder: true, fields: sectionFields.dressCode },
    { sectionKey: 'travel', label: 'Di chuyển và lưu trú', canToggle: true, canReorder: true, fields: sectionFields.travel },
    { sectionKey: 'faq', label: 'Câu hỏi thường gặp', canToggle: true, canReorder: true, fields: sectionFields.faq },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true, fields: sectionFields.rsvp },
    { sectionKey: 'guestbook', label: 'Lời chúc', canToggle: true, canReorder: true, fields: sectionFields.guestbook },
    { sectionKey: 'gift', label: 'Mừng cưới', canToggle: true, canReorder: true, fields: sectionFields.gift },
    { sectionKey: 'footer', label: 'Kết trang', required: true, canToggle: false, canReorder: false, fields: sectionFields.footer },
    { sectionKey: 'music', label: 'Nhạc nền', canToggle: true, canReorder: false, fields: sectionFields.music },
  ],
} as const satisfies TemplateConfig
