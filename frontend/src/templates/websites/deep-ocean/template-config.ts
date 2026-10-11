import type { TemplateConfig } from '../../template-config'
import { weddingWebsiteEditorFields } from '../../shared/website-editor-fields'
import type { DeepOceanSectionKey } from './content'

const sections: Array<[DeepOceanSectionKey, string, boolean, boolean, boolean]> = [
  ['navigation', 'Điều hướng', true, false, false],
  ['hero', 'Trang mở đầu', true, false, false],
  ['story', 'Our Story', true, true, true],
  ['timeline', 'Tide Timeline', true, true, true],
  ['weddingDay', 'The Wedding Day', true, false, true],
  ['gallery', 'Pearl Gallery', true, true, true],
  ['memories', 'Underwater Memories', true, true, true],
  ['people', 'The People We Love', false, true, true],
  ['film', 'Wedding Film', false, true, true],
  ['wishes', 'Wishes from the Shore', false, true, true],
  ['capsule', 'Memory Capsule', false, true, true],
  ['footer', 'Lời cảm ơn', true, false, false],
]

export const deepOceanTemplateConfig = {
  templateKey: 'deep-ocean',
  displayName: 'Deep Ocean Wedding',
  productType: 'WEDDING_WEBSITE',
  templateVersion: '1.0.0',
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
  status: 'ready',
  type: 'website',
  previewPath: '/templates/websites/deep-ocean/preview',
  description: 'Website cưới xanh sáng, mềm mại với ánh nước, ngọc trai và những kỷ niệm dịu dàng.',
  capabilities: { commonRsvp: false, guestbook: true, backgroundMusic: true, seo: true },
  theme: {
    palettes: ['deep-ocean-pearl'],
    heroStyles: ['sunlit-water'],
    storyStyles: ['pearl-current'],
    galleryStyles: ['floating-shells'],
    default: {
      palette: 'deep-ocean-pearl',
      heroStyle: 'sunlit-water',
      storyStyle: 'pearl-current',
      galleryStyle: 'floating-shells',
      typographyScale: 'AIRY',
      motionLevel: 'SUBTLE',
    },
  },
  sections: sections.map(([sectionKey, label, required, canToggle, canReorder]) => ({
    sectionKey,
    label,
    required,
    canToggle,
    canReorder,
    fields: sectionKey === 'navigation' ? {
      backgroundMusicUrl: {
        type: 'audio' as const,
        contentKey: 'music.backgroundMusicUrl',
        audioNameKey: 'music.backgroundMusicName',
        label: 'Nháº¡c ná»n',
      },
      backgroundMusicAutoplay: {
        type: 'boolean' as const,
        contentKey: 'music.backgroundMusicAutoplay',
        label: 'Tá»± Ä‘á»™ng phÃ¡t',
        default: false,
      },
    } : weddingWebsiteEditorFields[String(sectionKey)] ?? {},
  })),
} as const satisfies TemplateConfig
