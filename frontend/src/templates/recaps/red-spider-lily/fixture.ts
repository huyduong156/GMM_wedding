import {
  redSpiderLilyRecapContent,
  type RedSpiderLilyMedia,
  type RedSpiderLilyRecapContent,
} from './content'
import { redSpiderLilyMediaContract } from './media-contract'

const demoArch = '/assets/images/templates/red-spider-lily/demo/asian-couple-arch.jpg'
const demoPortrait = '/assets/images/templates/red-spider-lily/demo/asian-couple-portrait.jpg'
const demoBouquet = '/assets/images/templates/red-spider-lily/demo/bridal-bouquet-detail.jpg'
const demoTable = '/assets/images/templates/red-spider-lily/demo/wedding-table-detail.jpg'
const demoMedia = (
  role: RedSpiderLilyMedia['role'],
  alt: string,
  portrait = false,
): RedSpiderLilyMedia => ({ src: portrait ? demoPortrait : demoArch, alt, role })
const demoDetail = (
  role: RedSpiderLilyMedia['role'],
  alt: string,
  table = false,
): RedSpiderLilyMedia => ({ src: table ? demoTable : demoBouquet, alt, role })

const previewPeople = [
  {
    id: 'person-family',
    name: 'Gia dinh',
    role: 'Nhung nguoi luon o hang dau',
    media: demoMedia('person', 'Anh gia dinh'),
    gallery: [
      demoMedia('person', 'Khoanh khac gia dinh 1', true),
      demoMedia('person', 'Khoanh khac gia dinh 2'),
    ],
  },
  {
    id: 'person-friends',
    name: 'Ban than',
    role: 'Nhung nguoi giu tieng cuoi',
    media: demoMedia('person', 'Anh ban than', true),
    gallery: [
      demoMedia('person', 'Khoanh khac ban than 1'),
      demoMedia('person', 'Khoanh khac ban than 2', true),
      demoMedia('person', 'Khoanh khac ban than 3'),
    ],
  },
  {
    id: 'person-team',
    name: 'Doi ngu ngay cuoi',
    role: 'Cham chut tung chi tiet',
    media: demoMedia('person', 'Anh doi ngu'),
    gallery: [demoMedia('person', 'Khoanh khac doi ngu', true)],
  },
]

const previewBehindScenes = [
  {
    id: 'behind-morning',
    title: 'Buoi sang',
    caption: 'Nhung bo hoa dat canh cua so.',
    media: demoDetail('behind-the-scenes', 'Anh hoa buoi sang'),
    gallery: [
      demoDetail('behind-the-scenes', 'Anh hoa buoi sang 1'),
      demoDetail('behind-the-scenes', 'Anh hoa buoi sang 2', true),
    ],
  },
  {
    id: 'behind-dress',
    title: 'Chiec vay',
    caption: 'Mot khoang lang truoc khi canh cua mo ra.',
    media: demoDetail('behind-the-scenes', 'Anh chi tiet vai ao cuoi'),
    gallery: [demoDetail('behind-the-scenes', 'Anh chi tiet vai ao cuoi 1', true)],
  },
  {
    id: 'behind-table',
    title: 'Ban tiec',
    caption: 'Nhung chi tiet nho cho duoc nhin thay.',
    media: demoDetail('behind-the-scenes', 'Anh ban tiec', true),
    gallery: [demoDetail('behind-the-scenes', 'Anh ban tiec 1', true)],
  },
  {
    id: 'behind-stage',
    title: 'Sau canh ga',
    caption: 'Mot cai nam tay truoc khi buoc ra.',
    media: demoDetail('behind-the-scenes', 'Anh hoa sau canh ga'),
    gallery: [demoDetail('behind-the-scenes', 'Anh hoa sau canh ga 1', true)],
  },
  {
    id: 'behind-dance',
    title: 'Buoc nhay',
    caption: 'Mot khoanh khac them vao sau cung.',
    media: demoDetail('behind-the-scenes', 'Anh ban tiec buoc nhay', true),
    gallery: [demoDetail('behind-the-scenes', 'Anh ban tiec buoc nhay 1')],
  },
]

const previewContent = {
  ...redSpiderLilyRecapContent,
  optional: {
    ...redSpiderLilyRecapContent.optional,
    peopleBehindTheDay: {
      ...redSpiderLilyRecapContent.optional.peopleBehindTheDay,
      people: previewPeople,
    },
    behindTheScenes: {
      ...redSpiderLilyRecapContent.optional.behindTheScenes,
      items: previewBehindScenes,
    },
  },
}

export const redSpiderLilyRecapFixture = {
  content: {
    ...previewContent,
    hero: { ...previewContent.hero, media: demoMedia('hero', 'Anh demo cap doi chau A') },
    ourStory: { ...previewContent.ourStory, media: [demoMedia('story', 'Anh demo loi dan', true)] },
    chapters: previewContent.chapters.map((chapter, index) => ({
      ...chapter,
      cover: demoMedia('chapter', `Anh demo chapter ${index + 1}`, index % 2 === 1),
      gallery: [
        demoMedia('chapter', `Album chapter ${index + 1} anh 1`, index % 2 === 1),
        demoMedia('chapter', `Album chapter ${index + 1} anh 2`, index % 2 === 0),
      ],
    })),
    moments: previewContent.moments.map((moment, index) => ({
      ...moment,
      cover: demoMedia('moment', `Anh demo khoanh khac ${index + 1}`, index % 2 === 0),
      gallery: [
        demoMedia('moment', `Album khoanh khac ${index + 1} anh 1`, index % 2 === 0),
        demoMedia('moment', `Album khoanh khac ${index + 1} anh 2`, index % 2 === 1),
        demoMedia('moment', `Album khoanh khac ${index + 1} anh 3`, index % 2 === 0),
      ],
    })),
    thankYou: {
      ...previewContent.thankYou,
      media: demoMedia('finale', 'Anh demo loi cam on', true),
    },
    optional: {
      ...previewContent.optional,
      guestbook: {
        ...previewContent.optional.guestbook,
        media: demoMedia('guestbook', 'Anh ky niem tu ngay cuoi'),
        wishes: [
          {
            id: 'wish-linh',
            author: 'Linh & Khoa',
            message:
              'Chuc hai ban luon giu duoc su diu dang cua ngay hom nay. Cam on vi da cho chung minh duoc chung vui.',
          },
          {
            id: 'wish-mai',
            author: 'Mai',
            message:
              'Mot ngay that dep va am ap. Mong moi chuong tiep theo cua hai ban deu day tieng cuoi.',
          },
          {
            id: 'wish-gia-dinh',
            author: 'Gia dinh Anh',
            message: 'Thuong chuc hai con binh yen, hanh phuc va luon la noi tro ve cua nhau.',
          },
        ],
      },
      weddingFilm: {
        ...previewContent.optional.weddingFilm,
        poster: demoMedia('video-poster', 'Poster video demo', true),
      },
      soundtrack: {
        ...previewContent.optional.soundtrack,
        cover: demoMedia('soundtrack', 'Anh bia nhac demo'),
      },
      memoryCapsule: {
        ...previewContent.optional.memoryCapsule,
        media: demoMedia('capsule', 'Anh demo chuong tiep theo', true),
        gallery: [
          demoMedia('capsule', 'Ky uc them anh 1', true),
          demoMedia('capsule', 'Ky uc them anh 2'),
          demoMedia('capsule', 'Ky uc them anh 3', true),
        ],
      },
    },
  } as RedSpiderLilyRecapContent,
  mode: 'phase-4-motion-and-demo-media',
  mediaState: 'empty-user-media',
  albumMode: 'external-or-internal',
  mediaContract: redSpiderLilyMediaContract,
  independenceAudit: {
    neutralReplacementSet: redSpiderLilyMediaContract.independenceAudit.replacementSet,
    expectedIdentitySources: redSpiderLilyMediaContract.independenceAudit.identityMustRemainIn,
    forbiddenDependencies: redSpiderLilyMediaContract.independenceAudit.forbiddenDependencies,
  },
  externalAlbumExample: {
    type: 'EXTERNAL_ALBUM_LINK' as const,
    href: 'https://example.com/minh-anh-album',
    label: 'Mở album ảnh bên ngoài',
  },
} as const
