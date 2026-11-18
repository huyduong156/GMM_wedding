import { theWeddingRollMediaContract } from './media-contract'
import { theWeddingRollRecapFixture } from './fixture'

const defaultContent = theWeddingRollRecapFixture
const defaultChapters = defaultContent.chapters.map(({ id, title, description, gallery }) => ({
  id,
  dateLabel: '',
  title,
  description,
  gallery,
}))
const defaultMoments = defaultContent.moments.map(({ id, title, description, cover, gallery }) => ({
  id,
  title,
  description,
  cover,
  gallery,
}))
const defaultPeopleGroups = defaultContent.optional.peopleBehindTheDay.groups.map(
  ({ id, title, caption, photos }) => ({ id, title, caption, photos }),
)

const requiredSections = [
  'hero',
  'ourStory',
  'chapters',
  'moments',
  'photoDelivery',
  'thankYou',
] as const

const optionalSections = [
  'peopleBehindTheDay',
  'soundtrack',
  'guestbook',
  'memoryCapsule',
] as const

const labels = {
  hero: 'Trang bìa recap',
  ourStory: 'Lời dẫn ngắn',
  chapters: 'Các chương trong ngày',
  moments: 'Những khoảnh khắc',
  photoDelivery: 'Ảnh nổi bật & album đầy đủ',
  thankYou: 'Lời cảm ơn',
  guestbook: 'Lời chúc đã chọn',
  peopleBehindTheDay: 'Behind the Scenes',
  soundtrack: 'Giai điệu của ngày ấy',
  memoryCapsule: 'Gửi hai đứa mai sau',
} as const

const layouts = {
  hero: ['editorial-film-cover', 'portrait-roll-cover'],
  ourStory: ['large-quote-photo-spread', 'compact-editorial-note'],
  chapters: ['editorial-chapter-list', 'compact-film-timeline'],
  moments: ['three-dimensional-memory-carousel'],
  photoDelivery: ['dark-album-portal', 'album-index-list'],
  thankYou: ['film-roll-closing', 'paper-back-cover'],
  guestbook: ['compact-wish-cards', 'film-note-cards'],
  peopleBehindTheDay: ['three-card-photo-carousel'],
  soundtrack: ['optional-index-card'],
  memoryCapsule: ['short-letter-insert', 'dated-note-frame'],
} as const

const mediaRoles = {
  hero: ['cover-photo'],
  ourStory: ['story-photo'],
  chapters: ['chapter-gallery-photo'],
  moments: ['themed-moment-cover', 'moment-gallery-photo'],
  photoDelivery: ['featured-photo', 'internal-album', 'external-album-link'],
  thankYou: ['closing-photo'],
  guestbook: ['wish-support-photo'],
  peopleBehindTheDay: ['people-memory-photo'],
  soundtrack: [],
  memoryCapsule: ['capsule-support-photo'],
} as const

const repeatableRules = {
  chapters: {
    repeatable: true,
    minItems: 1,
    maxItems: 12,
    itemMediaField: 'gallery',
    maxMediaPerItem: 5,
    interaction: 'compact-chronological-list',
  },
  moments: {
    repeatable: true,
    minItems: 1,
    maxItems: 12,
    itemMediaField: 'cover',
    galleryField: 'gallery',
    maxMediaPerItem: 24,
    interaction: 'three-dimensional-themed-carousel',
  },
  peopleBehindTheDay: {
    repeatable: true,
    minItems: 0,
    maxItems: 10,
    galleryField: 'photos',
    maxMediaPerItem: 10,
    interaction: 'three-card-photo-carousel-lightbox',
  },
} as const

const sectionFields = {
  hero: {
    title: {
      type: 'text',
      label: 'Tiêu đề chính',
      contentKey: 'hero.title',
      default: defaultContent.hero.title,
      maxLength: 140,
    },
    body: {
      type: 'text',
      label: 'Lời giới thiệu',
      contentKey: 'hero.body',
      default: defaultContent.hero.body,
      maxLength: 280,
    },
    cover: {
      type: 'image',
      label: 'Ảnh bìa',
      contentKey: 'hero.cover',
      mediaRole: 'cover-photo',
      default: defaultContent.hero.cover,
    },
  },
  ourStory: {
    quote: {
      type: 'text',
      label: 'Câu dẫn nổi bật',
      contentKey: 'ourStory.quote',
      default: defaultContent.ourStory.quote,
      maxLength: 240,
    },
    body: {
      type: 'text',
      label: 'Lời dẫn câu chuyện',
      contentKey: 'ourStory.body',
      default: defaultContent.ourStory.body,
      maxLength: 600,
    },
    media: {
      type: 'image',
      label: 'Ảnh hỗ trợ',
      contentKey: 'ourStory.media',
      mediaRole: 'story-photo',
      default: defaultContent.ourStory.media,
    },
  },
  chapters: {
    heading: {
      type: 'string',
      label: 'Tiêu đề section',
      maxLength: 120,
      contentKey: 'chaptersIntro.title',
      default: defaultContent.chaptersIntro.title,
    },
    intro: {
      type: 'text',
      label: 'Lời giới thiệu các chương',
      maxLength: 400,
      contentKey: 'chaptersIntro.description',
      default: defaultContent.chaptersIntro.description,
    },
    items: {
      type: 'items',
      label: 'chương',
      addLabel: 'Thêm chương',
      contentKey: 'chapters',
      default: defaultChapters,
      minItems: 1,
      maxItems: 12,
      itemFields: {
        dateLabel: {
          type: 'datetime-local',
          label: 'Ngày và giờ',
          required: true,
          fallbackDateContentKey: 'hero.date',
        },
        title: { type: 'string', label: 'Tiêu đề', maxLength: 100 },
        description: { type: 'text', label: 'Mô tả ngắn', maxLength: 280 },
        gallery: {
          type: 'images',
          label: 'Ảnh của mốc (1–5 ảnh)',
          mediaRole: 'chapter-gallery-photo',
          minItems: 1,
          maxItems: 5,
          required: true,
        },
      },
    },
  },
  moments: {
    heading: {
      type: 'string',
      label: 'Tiêu đề khoảnh khắc',
      maxLength: 120,
      contentKey: 'momentsIntro.title',
      default: defaultContent.momentsIntro.title,
    },
    intro: {
      type: 'text',
      label: 'Lời giới thiệu khoảnh khắc',
      maxLength: 400,
      contentKey: 'momentsIntro.description',
      default: defaultContent.momentsIntro.description,
    },
    items: {
      type: 'items',
      contentKey: 'moments',
      default: defaultMoments,
      label: 'khoảnh khắc',
      addLabel: 'Thêm khoảnh khắc',
      minItems: 1,
      maxItems: 12,
      itemFields: {
        title: { type: 'string', label: 'Tên nhóm khoảnh khắc', maxLength: 100 },
        description: { type: 'text', label: 'Mô tả khoảnh khắc', maxLength: 280 },
        cover: { type: 'image', label: 'Ảnh bìa', mediaRole: 'themed-moment-cover' },
        gallery: {
          type: 'images',
          label: 'Ảnh trong khoảnh khắc',
          mediaRole: 'moment-gallery-photo',
          minItems: 0,
          maxItems: 24,
        },
      },
    },
  },
  photoDelivery: {
    title: {
      type: 'string',
      label: 'Tiêu đề trả ảnh',
      contentKey: 'photoDelivery.title',
      default: defaultContent.photoDelivery.title,
      maxLength: 120,
    },
    body: {
      type: 'text',
      label: 'Mô tả album',
      contentKey: 'photoDelivery.body',
      default: defaultContent.photoDelivery.body,
      maxLength: 500,
    },
    featuredPhotos: {
      type: 'images',
      label: 'Ảnh nổi bật (tối đa 50)',
      contentKey: 'photoDelivery.featuredPhotos',
      default: defaultContent.photoDelivery.featuredPhotos,
      maxItems: 50,
      mediaRole: 'featured-photo',
      emptyMessage:
        'Chọn tối đa 50 ảnh. Khi có ít nhất 1 ảnh, khách sẽ thấy nút “Xem ảnh nổi bật”; bấm nút sẽ mở lightbox để xem và tải từng ảnh.',
    },
    externalAlbumUrl: {
      type: 'url',
      label: 'URL album đầy đủ',
      contentKey: 'photoDelivery.externalAlbumUrl',
      maxLength: 2048,
      emptyMessage:
        'Thêm link album để hiện nút “Xem toàn bộ ảnh ngày hôm ấy”. Có thể dùng cùng lúc với ảnh nổi bật.',
    },
  },
  thankYou: {
    title: {
      type: 'string',
      label: 'Lời cảm ơn',
      contentKey: 'thankYou.title',
      default: defaultContent.thankYou.title,
      maxLength: 180,
    },
    body: {
      type: 'text',
      label: 'Nội dung cảm ơn',
      contentKey: 'thankYou.body',
      default: defaultContent.thankYou.body,
      maxLength: 500,
    },
  },
  guestbook: {
    notice: {
      type: 'info',
      label: 'Tất cả lời chúc được duyệt sẽ tự động hiển thị trong recap. Quản lý trạng thái lời chúc tại trang Lời chúc.',
    },
  },
  peopleBehindTheDay: {
    title: {
      type: 'string',
      label: 'Tiêu đề section',
      contentKey: 'optional.peopleBehindTheDay.title',
      default: defaultContent.optional.peopleBehindTheDay.title,
      maxLength: 120,
    },
    intro: {
      type: 'text',
      label: 'Lời giới thiệu',
      contentKey: 'optional.peopleBehindTheDay.intro',
      default: defaultContent.optional.peopleBehindTheDay.intro,
      maxLength: 500,
    },
    groups: {
      type: 'items',
      contentKey: 'optional.peopleBehindTheDay.groups',
      default: defaultPeopleGroups,
      label: 'Nhóm người góp sức',
      maxItems: 10,
      itemFields: {
        title: { type: 'string', label: 'Tên nhóm', maxLength: 80 },
        caption: { type: 'text', label: 'Lời nhắn cho nhóm', maxLength: 240 },
        photos: {
          type: 'images',
          label: 'Ảnh nhóm (tối đa 10)',
          minItems: 1,
          maxItems: 10,
          mediaRole: 'people-memory-photo',
          emptyMessage: 'Chọn từ 1 đến 10 ảnh. Ảnh đầu tiên làm ảnh bìa; bấm “Xem ảnh” để mở album.',
        },
      },
    },
  },
  soundtrack: {
    title: {
      type: 'string',
      label: 'Tiêu đề nhạc',
      contentKey: 'optional.soundtrack.title',
      default: defaultContent.optional.soundtrack.title,
      maxLength: 100,
    },
    intro: {
      type: 'text',
      label: 'Lời giới thiệu',
      contentKey: 'optional.soundtrack.intro',
      default: defaultContent.optional.soundtrack.intro,
      maxLength: 400,
    },
    audioSrc: {
      type: 'audio',
      label: 'Chọn nhạc từ kho nhạc dùng chung',
      contentKey: 'optional.soundtrack.audioSrc',
      audioNameKey: 'optional.soundtrack.trackName',
    },
    autoplay: {
      type: 'boolean',
      label: 'Tự động phát khi khách mở recap',
      contentKey: 'optional.soundtrack.autoplay',
      default: true,
    },
  },
  memoryCapsule: {
    message: {
      type: 'text',
      label: 'Lời nhắn tương lai',
      contentKey: 'optional.memoryCapsule.message',
      default: defaultContent.optional.memoryCapsule.message,
      maxLength: 600,
    },
    media: {
      type: 'image',
      label: 'Ảnh lá thư',
      contentKey: 'optional.memoryCapsule.media',
      mediaRole: 'capsule-support-photo',
    },
  },
} as const

export const theWeddingRollRecapTemplateConfig = {
  templateKey: 'the-wedding-roll-recap',
  displayName: 'The Wedding Roll',
  productType: 'WEDDING_RECAP',
  templateVersion: '1.0.0',
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
  status: 'ready',
  type: 'recap',
  description:
    'Album recap cưới gọn nhẹ, giúp khách mời xem lại khoảnh khắc và mở tải ảnh dễ dàng.',
  previewPath: '/templates/recaps/the-wedding-roll/preview',
  quickEdit: [
    {
      contentKey: 'hero.brideName',
      label: 'Tên cô dâu',
      maxLength: 80,
      fallbackContentKey: 'hero.couple',
      fallbackSplit: '&',
      fallbackIndex: 0,
    },
    {
      contentKey: 'hero.groomName',
      label: 'Tên chú rể',
      maxLength: 80,
      fallbackContentKey: 'hero.couple',
      fallbackSplit: '&',
      fallbackIndex: 1,
    },
    { contentKey: 'hero.date', label: 'Ngày cưới', type: 'date' },
  ],
  capabilities: {
    seo: true,
    share: true,
    download: true,
    externalAlbumLinks: true,
    soundtrack: true,
  },
  theme: {
    palettes: ['ivory-paper', 'rust-ink'],
    default: {
      palette: 'ivory-paper',
      motionLevel: 'SUBTLE',
      galleryStyle: '35mm-contact-sheet',
    },
    identity: [
      'continuous-ivory-paper',
      'rust-film-index',
      'css-paper-photo-frame',
      'floating-film-sprocket-marks',
      'slow-ivory-light-drift',
      'editorial-serif-and-mono-labels',
    ],
  },
  mediaContract: theWeddingRollMediaContract,
  composition: {
    order: ['hero', 'ourStory', 'chapters', 'moments', 'photoDelivery', 'optional', 'thankYou'],
    layouts: {
      hero: 'editorial-film-cover',
      ourStory: 'large-quote-photo-spread',
      chapters: 'editorial-chapter-list',
      moments: 'three-dimensional-memory-carousel',
      photoDelivery: 'dark-album-portal',
      guestbook: 'compact-curated-wishes',
      peopleBehindTheDay: 'three-card-photo-carousel',
      soundtrack: 'optional-index-card',
      memoryCapsule: 'short-letter-frame',
      thankYou: 'paper-back-cover',
    },
    transitions: {
      heroToOurStory: 'shared-paper-and-film-index',
      ourStoryToChapters: 'continuous-paper-thread',
      chaptersToMoments: 'numbered-timeline-to-three-dimensional-carousel',
      momentsToPhotoDelivery: 'film-roll-to-album-portal',
      optionalToThankYou: 'quiet-paper-close',
    },
    responsive: {
      desktop: 'asymmetric-editorial-photo-journal',
      tablet: 'reduced-column-count',
      mobile: 'compact-native-vertical-scroll-with-persistent-album-action',
      reducedMotion: 'static-composition',
    },
  },
  sections: [
    ...requiredSections.map((sectionKey, index) => ({
      sectionKey,
      label: labels[sectionKey],
      required: true,
      canToggle: false,
      canReorder: sectionKey === 'chapters' || sectionKey === 'moments',
      layouts: layouts[sectionKey],
      defaultLayout: layouts[sectionKey][0],
      mediaRoles: mediaRoles[sectionKey],
      fields: sectionFields[sectionKey],
      ...(repeatableRules[sectionKey as keyof typeof repeatableRules] ?? { repeatable: false }),
      ...(index === 0 ? { position: 'first' } : {}),
      ...(sectionKey === 'thankYou' ? { position: 'last-required' } : {}),
    })),
    ...optionalSections.map((sectionKey) => ({
      sectionKey,
      label: labels[sectionKey],
      required: false,
      canToggle: true,
      canReorder: true,
      defaultEnabled: false,
      layouts: layouts[sectionKey],
      defaultLayout: layouts[sectionKey][0],
      mediaRoles: mediaRoles[sectionKey],
      fields: sectionFields[sectionKey],
      ...(sectionKey === 'guestbook' ? { wishMode: 'all-approved' } : {}),
      ...(sectionKey === 'guestbook'
        ? { editorAction: { label: 'Quản lý lời chúc', href: '/studio/wishes' } }
        : {}),
      ...(repeatableRules[sectionKey as keyof typeof repeatableRules] ?? { repeatable: false }),
    })),
  ],
  authoring: {
    requiredSections,
    optionalSections,
    primaryLanguage: 'vi',
    maxEnglishQuotes: 3,
    mediaIndependent: true,
    designRead:
      'Compact post-wedding photo journal; guests should reach photo delivery quickly on mobile.',
    signatureDirection: 'Continuous ivory paper and a quiet renderer-owned 35mm film index.',
  },
} as const
