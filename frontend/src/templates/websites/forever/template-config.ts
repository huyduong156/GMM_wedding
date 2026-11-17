import type { TemplateConfig } from '../../template-config'
import type { TemplateFieldConfig } from '../../../shared/api/weddings'
import { weddingWebsiteEditorFields } from '../../shared/website-editor-fields'

const foreverSectionFields: Record<string, Record<string, TemplateFieldConfig>> = {
  announcement: {
    message: {
      type: 'text',
      contentKey: 'announcement.message',
      label: 'Lời báo tin',
      maxLength: 600,
    },
  },
  hero: {
    eyebrow: { type: 'string', contentKey: 'hero.eyebrow', label: 'Dòng giới thiệu', maxLength: 100 },
    headline: { type: 'string', contentKey: 'hero.headline', label: 'Tiêu đề chính', maxLength: 180 },
    time: { type: 'string', contentKey: 'hero.time', label: 'Giờ hiển thị trên trang mở đầu', maxLength: 80 },
    location: { type: 'string', contentKey: 'hero.location', label: 'Địa điểm', maxLength: 120 },
    image: { type: 'image', contentKey: 'hero.image', label: 'Ảnh mở đầu', mediaRole: 'hero' },
  },
  couple: {
    image: { type: 'image', contentKey: 'couple.image', label: 'Ảnh cặp đôi', mediaRole: 'couple', mediaValue: 'url' },
    bio: { type: 'text', contentKey: 'couple.bio', label: 'Giới thiệu cặp đôi', maxLength: 600 },
    albumImages: { type: 'images', contentKey: 'couple.albumImages', label: 'Ảnh album câu chuyện của chúng mình', mediaRole: 'couple-album', minItems: 0, maxItems: 25 },
  },
  story: {
    heading: { type: 'text', contentKey: 'storyHeading', label: 'Tiêu đề câu chuyện', maxLength: 120 },
    items: {
      type: 'items',
      contentKey: 'story',
      label: 'Các cột mốc',
      maxItems: 12,
      itemFields: {
        date: { type: 'date', label: 'Mốc thời gian', required: true },
        title: { type: 'string', label: 'Tiêu đề', required: true, maxLength: 100 },
        body: { type: 'text', label: 'Nội dung', maxLength: 600 },
        images: { type: 'images', label: 'Ảnh cột mốc', mediaRole: 'story', minItems: 0, maxItems: 10 },
      },
    },
  },
  events: {
    dateEyebrow: { type: 'string', contentKey: 'events.dateEyebrow', label: 'Dòng nhỏ trên phần ngày', maxLength: 80 },
    introEyebrow: { type: 'string', contentKey: 'events.introEyebrow', label: 'Dòng giới thiệu sự kiện', maxLength: 80 },
    introHeading: { type: 'text', contentKey: 'events.introHeading', label: 'Tiêu đề lời hẹn (dùng | để xuống dòng, {location} lấy từ địa điểm ở phần mở đầu)', maxLength: 180 },
    introMessage: { type: 'text', contentKey: 'events.introMessage', label: 'Lời nhắn dưới tiêu đề', maxLength: 600 },
    'summary.hours': { type: 'string', contentKey: 'events.summary.hours', label: 'Khung giờ đón khách hiển thị', maxLength: 100 },
    'summary.venue': { type: 'string', contentKey: 'events.summary.venue', label: 'Địa điểm hiển thị', maxLength: 120 },
    agendaHeading: { type: 'string', contentKey: 'events.agendaHeading', label: 'Tiêu đề lịch trình', maxLength: 100 },
    items: {
      type: 'items',
      contentKey: 'events.items',
      label: 'Các sự kiện trong ngày',
      maxItems: 12,
      itemFields: {
        type: { type: 'string', label: 'Nhãn hiển thị', maxLength: 60 },
        title: { type: 'string', label: 'Tên sự kiện', required: true, maxLength: 120 },
        time: { type: 'string', label: 'Thời gian', maxLength: 80 },
        date: { type: 'string', label: 'Ngày diễn ra', maxLength: 100 },
        venue: { type: 'string', label: 'Địa điểm', maxLength: 120 },
        address: { type: 'string', label: 'Địa chỉ', maxLength: 180 },
        mapUrl: { type: 'url', label: 'Liên kết bản đồ', maxLength: 500 },
      },
    },
  },
  gallery: {
    title: { type: 'string', contentKey: 'gallery.heading', label: 'Tiêu đề album' },
    images: {
      type: 'images',
      contentKey: 'gallery.images',
      label: 'Ảnh trong album',
      mediaRole: 'gallery',
      minItems: 4,
      maxItems: 10,
    },
  },
  venues: {
    image: { type: 'image', contentKey: 'venues.image', label: 'Ảnh địa điểm', mediaRole: 'venue' },
    heading: { type: 'text', contentKey: 'venues.heading', label: 'Tiêu đề địa điểm', maxLength: 120 },
    note: { type: 'text', contentKey: 'venues.note', label: 'Giới thiệu địa điểm', maxLength: 600 },
    address: { type: 'string', contentKey: 'venues.address', label: 'Địa chỉ', maxLength: 180 },
    mapUrl: { type: 'url', contentKey: 'venues.mapUrl', label: 'Liên kết bản đồ', maxLength: 500 },
  },
  dressCode: {
    heading: { type: 'text', contentKey: 'dressCode.heading', label: 'Tiêu đề dress code', maxLength: 120 },
    message: { type: 'text', contentKey: 'dressCode.message', label: 'Hướng dẫn trang phục', maxLength: 600 },
    colors: { type: 'colors', contentKey: 'dressCode.colors', label: 'Màu trang phục gợi ý', maxItems: 8 },
  },
  rsvp: {
    heading: { type: 'string', contentKey: 'rsvp.heading', label: 'Tiêu đề xác nhận tham dự', maxLength: 120 },
    message: { type: 'text', contentKey: 'rsvp.message', label: 'Lời nhắn xác nhận tham dự', maxLength: 600 },
    note: { type: 'text', contentKey: 'rsvp.note', label: 'Ghi chú bên dưới nút', maxLength: 300 },
  },
  guestbook: {
    heading: { type: 'string', contentKey: 'guestbook.heading', label: 'Tiêu đề sổ lời chúc', maxLength: 120 },
  },
  gift: {
    heading: { type: 'string', contentKey: 'gift.heading', label: 'Tiêu đề mừng cưới', maxLength: 120 },
    message: { type: 'text', contentKey: 'gift.message', label: 'Lời cảm ơn', maxLength: 600 },
    qrImage: { type: 'image', contentKey: 'gift.qrImage', label: 'Ảnh QR chuyển khoản (không bắt buộc)', mediaRole: 'gift-qr', mediaValue: 'url' },
  },
  faq: {
    items: {
      type: 'items',
      contentKey: 'faq.items',
      label: 'Câu hỏi thường gặp',
      maxItems: 20,
      itemFields: {
        question: { type: 'string', label: 'Câu hỏi', required: true, maxLength: 180 },
        answer: { type: 'text', label: 'Câu trả lời', required: true, maxLength: 600 },
      },
    },
  },
  activities: {
    heading: { type: 'string', contentKey: 'activities.heading', label: 'Tiêu đề hoạt động' },
    items: {
      type: 'items',
      contentKey: 'activities.items',
      label: 'Hoạt động trong tiệc',
      maxItems: 10,
      recommendedMinItems: 2,
      itemFields: {
        title: { type: 'string', label: 'Tiêu đề', required: true, maxLength: 100 },
        image: { type: 'image', label: 'Ảnh hoạt động', required: true, mediaRole: 'activity', mediaValue: 'url' },
      },
    },
  },
  weddingParty: {
    title: { type: 'string', contentKey: 'weddingParty.title', label: 'Tiêu đề nhóm' },
    groups: {
      type: 'items', contentKey: 'weddingParty.groups', label: 'Nhóm người đồng hành', maxItems: 8,
      itemFields: {
        title: { type: 'string', label: 'Tên nhóm', required: true, maxLength: 80 },
        members: {
          type: 'items', label: 'Thành viên', maxItems: 20,
          itemFields: {
            name: { type: 'string', label: 'Tên', required: true, maxLength: 80 },
            role: { type: 'string', label: 'Vai trò', maxLength: 80 },
            biography: { type: 'text', label: 'Giới thiệu', maxLength: 600 },
            mediaId: { type: 'image', label: 'Ảnh chân dung', mediaRole: 'wedding-party' },
          },
        },
      },
    },
  },
  footer: {
    ...weddingWebsiteEditorFields.footer,
    backgroundImage: { type: 'image', contentKey: 'footer.backgroundImage', label: 'Ảnh nền cuối trang', mediaRole: 'footer', mediaValue: 'url' },
  },
  music: {
    backgroundMusicUrl: { type: 'audio', contentKey: 'music.backgroundMusicUrl', audioNameKey: 'music.backgroundMusicName', label: 'Bản nhạc nền' },
    backgroundMusicAutoplay: { type: 'boolean', contentKey: 'music.backgroundMusicAutoplay', label: 'Tự phát nhạc nền', default: true },
  },
}

export const foreverTemplateConfig = {
  templateKey: 'forever', displayName: 'Forever', productType: 'WEDDING_WEBSITE',
  templateVersion: '1.0.2', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1,
  status: 'ready', type: 'website', previewPath: '/templates/websites/forever/preview',
  quickEdit: [
    { contentKey: 'hero.brideName', label: 'Tên cô dâu' },
    { contentKey: 'hero.groomName', label: 'Tên chú rể' },
    { contentKey: 'hero.date', label: 'Ngày cưới' },
  ],
  description: 'A modern, minimal wedding website with an editorial layout.',
  capabilities: { commonRsvp: true, guestbook: true, backgroundMusic: true, seo: true },
  theme: { palettes: ['warm-paper'], heroStyles: ['full-bleed-editorial'], storyStyles: ['editorial-list'], galleryStyles: ['editorial-grid'], default: { palette: 'warm-paper', heroStyle: 'full-bleed-editorial', storyStyle: 'editorial-list', galleryStyle: 'editorial-grid', typographyScale: 'BALANCED', motionLevel: 'SUBTLE' } },
  sections: ([['hero', 'Trang mở đầu', true, false, false], ['announcement', 'Lời báo tin', true, false, false],
  ['couple', 'Cặp đôi', true, false, true], ['story', 'Chuyện chúng mình', false, true, true], ['events', 'Sự kiện', true, false, true],
  ['activities', 'Hoạt động trong tiệc', false, true, true],
  ['countdown', 'Đếm ngược', false, true, true], ['venues', 'Địa điểm', true, false, true], ['gallery', 'Album ảnh', false, true, true],
  ['weddingParty', 'Người đồng hành', false, false, false], ['dressCode', 'Dress code', false, true, true],
  ['faq', 'Câu hỏi thường gặp', false, true, true], ['rsvp', 'Xác nhận tham dự', false, true, true],
  ['guestbook', 'Lời chúc', false, true, true], ['gift', 'Mừng cưới', false, true, true], ['footer', 'Footer', true, false, false], ['music', 'Nhạc nền', false, true, false],
  ] as Array<readonly [string, string, boolean, boolean, boolean]>).map(([sectionKey, label, required, canToggle, canReorder]) => ({ sectionKey, label, required, canToggle, canReorder, editorHidden: sectionKey === 'weddingParty', fields: foreverSectionFields[sectionKey] ?? weddingWebsiteEditorFields[sectionKey] ?? {} })),
} as const satisfies TemplateConfig
