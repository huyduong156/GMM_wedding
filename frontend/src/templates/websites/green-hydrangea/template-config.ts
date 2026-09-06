import type { TemplateConfig } from '../../template-config'
import { weddingWebsiteEditorFields } from '../../shared/website-editor-fields'
export const greenHydrangeaTemplateConfig = {
  templateKey: 'green-hydrangea',
  displayName: 'Green Hydrangea Wedding',
  productType: 'WEDDING_WEBSITE',
  templateVersion: '1.0.0',
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
  status: 'ready',
  type: 'website',
  previewPath: '/templates/websites/green-hydrangea/preview',
  description: 'Website cưới botanical watercolor với cẩm tú cầu xanh sage và nền giấy kem.',
  capabilities: { commonRsvp: true, guestbook: true, backgroundMusic: false, seo: true },
  theme: {
    palettes: ['sage-hydrangea'],
    heroStyles: ['layered-memory'],
    storyStyles: ['alternating-timeline'],
    galleryStyles: ['editorial-grid'],
    default: {
      palette: 'sage-hydrangea',
      heroStyle: 'layered-memory',
      storyStyle: 'alternating-timeline',
      galleryStyle: 'editorial-grid',
      typographyScale: 'BALANCED',
      motionLevel: 'SUBTLE',
    },
  },
  sections: (
    [
      ['navigation', 'Điều hướng', true, false, false],
      ['hero', 'Trang mở đầu', true, false, false],
      ['announcement', 'Lời báo tin', true, false, false],
      ['couple', 'Cặp đôi', true, false, true],
      ['story', 'Chuyện chúng mình', false, true, true],
      ['events', 'Sự kiện', true, false, true],
      ['countdown', 'Đếm ngược', false, true, true],
      ['venues', 'Địa điểm', true, false, true],
      ['gallery', 'Album ảnh', false, true, true],
      ['schedule', 'Lịch trình', false, true, true],
      ['dressCode', 'Dress code', false, true, true],
      ['faq', 'Câu hỏi thường gặp', false, true, true],
      ['rsvp', 'Xác nhận tham dự', false, true, true],
      ['guestbook', 'Lời chúc', false, true, true],
      ['footer', 'Kết trang', true, false, false],
    ] as Array<readonly [string, string, boolean, boolean, boolean]>
  ).map(
    ([sectionKey, label, required, canToggle, canReorder]: readonly [
      string,
      string,
      boolean,
      boolean,
      boolean,
    ]) => ({
      sectionKey,
      label,
      required,
      canToggle,
      canReorder,
      fields: weddingWebsiteEditorFields[String(sectionKey)] ?? {},
    }),
  ),
} as const satisfies TemplateConfig
