import type { TemplateConfig } from '../../template-config'
import type { TemplateFieldConfig } from '../../../shared/api/weddings'
import { weddingWebsiteEditorFields } from '../../shared/website-editor-fields'

const foreverSectionFields: Record<string, Record<string, TemplateFieldConfig>> = {
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
  music: {
    musicTrackId: { type: 'audio', contentKey: 'music.musicTrackId', label: 'Bản nhạc nền' },
    autoplay: { type: 'boolean', contentKey: 'music.autoplay', label: 'Tự phát nhạc' },
  },
}

export const foreverTemplateConfig = {
  templateKey: 'forever', displayName: 'Forever', productType: 'WEDDING_WEBSITE',
  templateVersion: '1.0.0', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1,
  status: 'draft', type: 'website', previewPath: '/templates/websites/forever/preview',
  description: 'A modern, minimal wedding website with an editorial layout.',
  capabilities: { commonRsvp: true, guestbook: true, backgroundMusic: true, seo: true },
  theme: { palettes: ['warm-paper'], heroStyles: ['full-bleed-editorial'], storyStyles: ['editorial-list'], galleryStyles: ['editorial-grid'], default: { palette: 'warm-paper', heroStyle: 'full-bleed-editorial', storyStyle: 'editorial-list', galleryStyle: 'editorial-grid', typographyScale: 'BALANCED', motionLevel: 'SUBTLE' } },
  sections: ([ ['hero', 'Trang mở đầu', true, false, false], ['announcement', 'Lời báo tin', true, false, false],
    ['couple', 'Cặp đôi', true, false, true], ['story', 'Chuyện chúng mình', false, true, true], ['events', 'Sự kiện', true, false, true],
    ['countdown', 'Đếm ngược', false, true, true], ['venues', 'Địa điểm', true, false, true], ['gallery', 'Album ảnh', false, true, true],
    ['schedule', 'Lịch trình', false, true, true], ['weddingParty', 'Người đồng hành', false, true, true], ['dressCode', 'Dress code', false, true, true],
    ['travel', 'Di chuyển và lưu trú', false, true, true], ['faq', 'Câu hỏi thường gặp', false, true, true], ['rsvp', 'Xác nhận tham dự', false, true, true],
    ['guestbook', 'Lời chúc', false, true, true], ['gift', 'Mừng cưới', false, true, true], ['footer', 'Kết trang', true, false, false], ['music', 'Nhạc nền', false, true, false],
  ] as Array<readonly [string, string, boolean, boolean, boolean]>).map(([sectionKey, label, required, canToggle, canReorder]) => ({ sectionKey, label, required, canToggle, canReorder, fields: foreverSectionFields[sectionKey] ?? weddingWebsiteEditorFields[sectionKey] ?? {} })),
} as const satisfies TemplateConfig
