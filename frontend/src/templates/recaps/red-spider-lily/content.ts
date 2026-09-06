export type RedSpiderLilyMedia = {
  src: string
  alt: string
  mediaAssetId?: string
  role:
    | 'hero'
    | 'story'
    | 'chapter'
    | 'moment'
    | 'finale'
    | 'video-poster'
    | 'guestbook'
    | 'person'
    | 'soundtrack'
    | 'behind-the-scenes'
    | 'capsule'
}

export type RedSpiderLilyAlbumSource =
  | { type: 'INTERNAL_ALBUM'; albumId: string }
  | { type: 'EXTERNAL_ALBUM_LINK'; href: string; label: string }

export type RedSpiderLilyChapter = {
  id: string
  dateLabel: string
  title: string
  description: string
  cover: RedSpiderLilyMedia
  gallery?: RedSpiderLilyMedia[]
  album?: RedSpiderLilyAlbumSource
}

export type RedSpiderLilyMoment = {
  id: string
  title: string
  description: string
  cover: RedSpiderLilyMedia
  gallery?: RedSpiderLilyMedia[]
  album?: RedSpiderLilyAlbumSource
}

export type RedSpiderLilyWish = { id: string; author: string; message: string }
export type RedSpiderLilyPerson = {
  id: string
  name: string
  role: string
  media: RedSpiderLilyMedia
  gallery?: RedSpiderLilyMedia[]
}
export type RedSpiderLilyBehindScene = {
  id: string
  title: string
  caption: string
  media: RedSpiderLilyMedia
  gallery?: RedSpiderLilyMedia[]
}
export type RedSpiderLilyOptionalContent = {
  enabled: boolean
  title: string
  body: string
  eyebrow?: string
  intro?: string
  wishes?: RedSpiderLilyWish[]
  people?: RedSpiderLilyPerson[]
  poster?: RedSpiderLilyMedia
  duration?: string
  ctaLabel?: string
  track?: string
  artist?: string
  cover?: RedSpiderLilyMedia
  items?: RedSpiderLilyBehindScene[]
  date?: string
  media?: RedSpiderLilyMedia
  gallery?: RedSpiderLilyMedia[]
}

export type RedSpiderLilyRecapContent = {
  hero: {
    couple: string
    date: string
    place?: string
    tagline: string
    ctaLabel: string
    media?: RedSpiderLilyMedia
  }
  ourStory: {
    eyebrow: string
    title: string
    body: string
    quote?: string
    media: RedSpiderLilyMedia[]
  }
  chapters: RedSpiderLilyChapter[]
  moments: RedSpiderLilyMoment[]
  photoDelivery: {
    eyebrow: string
    title: string
    body: string
    ctaLabel: string
    albumUrl?: string
    albums: RedSpiderLilyAlbumSource[]
    media?: RedSpiderLilyMedia[]
  }
  thankYou: {
    title: string
    body: string
    signature: string
    date: string
    media?: RedSpiderLilyMedia
  }
  optional: {
    guestbook: RedSpiderLilyOptionalContent
    peopleBehindTheDay: RedSpiderLilyOptionalContent
    weddingFilm: RedSpiderLilyOptionalContent
    soundtrack: RedSpiderLilyOptionalContent
    behindTheScenes: RedSpiderLilyOptionalContent
    memoryCapsule: RedSpiderLilyOptionalContent
  }
}

export const redSpiderLilyRecapContent: RedSpiderLilyRecapContent = {
  hero: {
    couple: 'Minh & Anh',
    date: '20.08.2026',
    place: 'Hà Nội',
    tagline: 'Những ngày đã qua, những điều còn ở lại',
    ctaLabel: 'Mở album',
  },
  ourStory: {
    eyebrow: 'Lời dẫn',
    title: 'Một ngày được giữ lại bằng những người ta yêu thương',
    body: 'Có những khoảnh khắc chỉ thật sự trọn vẹn khi được nhìn lại cùng những người đã hiện diện. Cảm ơn vì đã cùng chúng mình viết nên ngày hôm ấy.',
    quote: 'Ký ức nở lại khi ta cùng nhau nhìn về.',
    media: [],
  },
  chapters: [
    {
      id: 'engagement',
      dateLabel: '01.01.2026',
      title: 'Lễ đính hôn',
      description: 'Một ngày nhỏ đánh dấu một hành trình lớn.',
      cover: { src: '', alt: 'Ảnh đại diện lễ đính hôn', role: 'chapter' },
    },
    {
      id: 'bride-arrival',
      dateLabel: '20.08.2026',
      title: 'Ngày rước dâu',
      description: 'Khoảnh khắc hai gia đình chính thức trở thành một.',
      cover: { src: '', alt: 'Ảnh đại diện ngày rước dâu', role: 'chapter' },
    },
    {
      id: 'the-wedding',
      dateLabel: '20.08.2026',
      title: 'Ngày chúng mình cưới',
      description: 'Một buổi chiều đỏ son, rất nhiều nụ cười và một lời hứa ở lại.',
      cover: { src: '', alt: 'Ảnh đại diện ngày cưới', role: 'chapter' },
    },
  ],
  moments: [
    {
      id: 'photobooth',
      title: 'Photobooth',
      description: 'Những nụ cười và những kiểu tạo dáng không thể diễn lại lần hai.',
      cover: { src: '', alt: 'Ảnh bìa photobooth', role: 'moment' },
    },
    {
      id: 'bubble-memories',
      title: 'Bubble Memories',
      description: 'Những chiếc bong bóng và tiếng cười trong buổi tiệc.',
      cover: { src: '', alt: 'Ảnh bìa bubble memories', role: 'moment' },
    },
    {
      id: 'friends-family',
      title: 'Bạn bè & gia đình',
      description: 'Những người đã làm ngày hôm ấy trở nên đặc biệt.',
      cover: { src: '', alt: 'Ảnh bìa bạn bè và gia đình', role: 'moment' },
    },
  ],
  photoDelivery: {
    eyebrow: 'Trả ảnh',
    title: 'Khoảnh khắc của bạn đang ở đây',
    body: 'Hãy tìm lại những khung hình có bạn trong ngày hôm ấy.',
    ctaLabel: 'Xem & tải ảnh',
    albums: [],
    media: [],
  },
  thankYou: {
    title: 'Cảm ơn vì đã trở thành một phần trong câu chuyện của chúng mình',
    body: 'Sự hiện diện của mọi người đã làm cho ngày hôm ấy trở nên đặc biệt hơn rất nhiều.',
    signature: 'Minh & Anh',
    date: '20 · 08 · 2026',
  },
  optional: {
    guestbook: {
      enabled: true,
      title: 'Lời chúc ở lại',
      body: 'Những lời chúc đã được gửi đến hai chúng mình.',
    },
    peopleBehindTheDay: {
      enabled: true,
      title: 'Những người phía sau ngày hôm ấy',
      body: 'Gia đình và bạn bè đã cùng làm nên ngày này.',
    },
    weddingFilm: {
      enabled: true,
      title: 'Thước phim của ngày hôm ấy',
      body: 'Một đoạn phim ngắn để xem lại những chuyển động thân thương.',
    },
    soundtrack: {
      enabled: true,
      title: 'Âm thanh của ký ức',
      body: 'Một bản nhạc tùy chọn đồng hành cùng album.',
    },
    behindTheScenes: {
      enabled: true,
      title: 'Phía sau cánh hoa',
      body: 'Những khoảnh khắc chuẩn bị trước khi buổi lễ bắt đầu.',
    },
    memoryCapsule: {
      enabled: true,
      title: 'Chương tiếp theo',
      body: 'Một lời nhắn ngắn gửi đến những ngày sắp tới.',
    },
  },
}
