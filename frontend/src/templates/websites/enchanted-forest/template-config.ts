import type { TemplateConfig } from '../../template-config'
import { weddingWebsiteEditorFields } from '../../shared/website-editor-fields'
const sections = ([
  ['navigation', 'Điều hướng', true, false, false], ['hero', 'Trang mở đầu', true, false, false], ['announcement', 'Lời báo tin', true, false, false], ['couple', 'Cặp đôi', true, false, true], ['story', 'Chuyện chúng mình', false, true, true], ['events', 'Sự kiện', true, false, true], ['countdown', 'Đếm ngược', false, true, true], ['venues', 'Địa điểm', true, false, true], ['gallery', 'Album ảnh', false, true, true], ['schedule', 'Lịch trình', false, true, true], ['dressCode', 'Dress code', false, true, true], ['faq', 'Câu hỏi thường gặp', false, true, true], ['rsvp', 'Xác nhận tham dự', false, true, true], ['guestbook', 'Lời chúc', false, true, true], ['footer', 'Kết trang', true, false, false],
] as Array<readonly [string, string, boolean, boolean, boolean]>).map(([sectionKey, label, required, canToggle, canReorder]: readonly [string, string, boolean, boolean, boolean]) => ({ sectionKey, label, required, canToggle, canReorder, fields: weddingWebsiteEditorFields[String(sectionKey)] ?? {} }))

export const enchantedForestTemplateConfig={templateKey:'enchanted-forest',displayName:'Enchanted Forest Wedding',productType:'WEDDING_WEBSITE',templateVersion:'1.0.0',templateConfigVersion:1,contentSchemaVersion:1,rendererApiVersion:1, status: 'ready', type: 'website',previewPath:'/templates/websites/enchanted-forest/preview',description:'Website cưới 2.5D rừng cổ thụ, rêu và ánh nắng xuyên tán.',capabilities:{commonRsvp:true,guestbook:true,backgroundMusic:false,seo:true},theme:{palettes:['enchanted-moss'],heroStyles:['layered-memory'],storyStyles:['sticky-chapters'],galleryStyles:['editorial-grid'],default:{palette:'enchanted-moss',heroStyle:'layered-memory',storyStyle:'sticky-chapters',galleryStyle:'editorial-grid',typographyScale:'BALANCED',motionLevel:'EXPRESSIVE'}},sections} as const satisfies TemplateConfig









