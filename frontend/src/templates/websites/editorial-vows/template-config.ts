import type { TemplateConfig } from '../../template-config'
import { weddingWebsiteEditorFields } from '../../shared/website-editor-fields'
export const editorialVowsTemplateConfig = {
  templateKey: 'editorial-vows', displayName: 'Editorial Vows', productType: 'WEDDING_WEBSITE', templateVersion: '1.0.0', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, status: 'ready', type: 'website',
  previewPath: '/templates/websites/editorial-vows/preview', description: 'Editorial cinematic màu xanh cobalt với love-story chapters.',
  capabilities: { commonRsvp: true, guestbook: true, backgroundMusic: true, seo: true },
  theme: { palettes: ['porcelain-cobalt'], heroStyles: ['full-bleed-editorial'], storyStyles: ['sticky-chapters'], galleryStyles: ['editorial-grid'], default: { palette: 'porcelain-cobalt', heroStyle: 'full-bleed-editorial', storyStyle: 'sticky-chapters', galleryStyle: 'editorial-grid', typographyScale: 'COMPACT', motionLevel: 'EXPRESSIVE' } },
  sections: ([
    ['navigation', 'Điều hướng', true, false, false], ['hero', 'Trang mở đầu', true, false, false], ['announcement', 'Lời báo tin', true, false, false], ['couple', 'Cặp đôi', true, false, true], ['story', 'Chuyện chúng mình', false, true, true], ['events', 'Sự kiện', true, false, true], ['countdown', 'Đếm ngược', false, true, true], ['venues', 'Địa điểm', true, false, true], ['gallery', 'Album ảnh', false, true, true], ['schedule', 'Lịch trình', false, true, true], ['weddingParty', 'Người đồng hành', false, true, true], ['dressCode', 'Dress code', false, true, true], ['travel', 'Di chuyển và lưu trú', false, true, true], ['faq', 'Câu hỏi thường gặp', false, true, true], ['rsvp', 'Xác nhận tham dự', false, true, true], ['guestbook', 'Lời chúc', false, true, true], ['gift', 'Mừng cưới', false, true, true], ['footer', 'Kết trang', true, false, false], ['music', 'Nhạc nền', false, true, false],
  ] as Array<readonly [string, string, boolean, boolean, boolean]>).map(([sectionKey, label, required, canToggle, canReorder]: readonly [string, string, boolean, boolean, boolean]) => ({ sectionKey, label, required, canToggle, canReorder, fields: weddingWebsiteEditorFields[String(sectionKey)] ?? {} })),
} as const satisfies TemplateConfig









