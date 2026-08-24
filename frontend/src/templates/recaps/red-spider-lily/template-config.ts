import { redSpiderLilyMediaContract } from './media-contract'

const requiredSections = ['hero', 'ourStory', 'chapters', 'moments', 'photoDelivery', 'thankYou'] as const
const optionalSections = ['guestbook', 'peopleBehindTheDay', 'weddingFilm', 'soundtrack', 'behindTheScenes', 'memoryCapsule'] as const

export const redSpiderLilyRecapTemplateConfig = {
  templateKey: 'red-spider-lily-recap',
  displayName: 'Dấu Son Bỉ Ngạn',
  productType: 'WEDDING_RECAP',
  templateVersion: '0.1.0',
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
  status: 'draft',
  type: 'recap',
  description: 'Wedding recap editorial về những ký ức còn nở lại sau ngày cưới.',
  previewPath: '/templates/recaps/red-spider-lily/preview',
  capabilities: { seo: true, share: true, download: true, externalAlbumLinks: true, soundtrack: true, weddingFilm: true },
  theme: {
    palettes: ['vermilion-paper', 'ink-ivory'],
    default: { palette: 'vermilion-paper', motionLevel: 'EXPRESSIVE', galleryStyle: 'editorial-album-portal' },
    identity: ['red-spider-lily', 'paper-grain', 'botanical-frame', 'chapter-bloom'],
  },
  mediaContract: redSpiderLilyMediaContract,
  sections: [
    ...requiredSections.map((sectionKey, index) => ({ sectionKey, label: sectionKey, required: true, canToggle: false, canReorder: index > 0 && index < requiredSections.length - 1 })),
    ...optionalSections.map((sectionKey) => ({ sectionKey, label: sectionKey, required: false, canToggle: true, canReorder: true, defaultEnabled: false })),
  ],
  authoring: {
    phase: 2,
    requiredSections,
    optionalSections,
    primaryLanguage: 'vi',
    maxEnglishQuotes: 3,
    mediaIndependent: true,
    designRead: 'Post-wedding digital album with botanical-editorial memory chapters.',
    signatureDirection: 'A renderer-owned red spider lily thread that connects the album chapters.',
  },
} as const
