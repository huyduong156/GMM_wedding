export type TheWeddingRollMedia = {
  src: string
  alt: string
}

export type TheWeddingRollAlbumSource =
  | { type: 'INTERNAL_ALBUM'; albumId: string; label: string }
  | { type: 'EXTERNAL_ALBUM_LINK'; href: string; label: string }

export type TheWeddingRollChapter = {
  id: string
  dateLabel: string
  title: string
  description: string
  gallery: TheWeddingRollMedia[]
  /** Legacy value retained for drafts saved before chapter galleries were added. */
  cover?: TheWeddingRollMedia
}

export type TheWeddingRollMoment = {
  id: string
  title: string
  momentLabel: string
  description: string
  cover: TheWeddingRollMedia
}

export type TheWeddingRollRecapContent = {
  hero: {
    couple: string
    date: string
    issueLabel: string
    titleLines: [string, string, string]
    emphasisLine: number
    tagline: string
    ctaLabel: string
    secondaryCtaLabel: string
    cover: TheWeddingRollMedia
    frameNote: string
    stampLabel: string
    stampCount: string
    stampCaption: string
  }
  ourStory: {
    eyebrow: string
    quote: string
    body: string
    media: TheWeddingRollMedia
    mediaLabel: string
  }
  tickerItems: string[]
  chaptersIntro: { eyebrow: string; title: string; description: string }
  chapters: TheWeddingRollChapter[]
  momentsIntro: { eyebrow: string; title: string; description: string }
  moments: TheWeddingRollMoment[]
  filmStrip: TheWeddingRollMedia[]
  photoDelivery: {
    eyebrow: string
    title: string
    body: string
    ctaLabel: string
    marker: string
    albums: TheWeddingRollAlbumSource[]
  }
  thankYou: {
    eyebrow: string
    title: string
    body: string
    signature: string
    date: string
    footerNote: string
  }
  optionalIndex: {
    eyebrow: string
    title: string
    body: string
  }
  optional: {
    guestbook: {
      enabled: boolean
      eyebrow: string
      title: string
      intro: string
      wishes: Array<{ id: string; author: string; message: string }>
    }
    peopleBehindTheDay: {
      enabled: boolean
      eyebrow: string
      title: string
      intro: string
      people: Array<{ id: string; name: string; role: string; portrait?: TheWeddingRollMedia }>
    }
    weddingFilm: {
      enabled: boolean
      eyebrow: string
      title: string
      body: string
      poster: TheWeddingRollMedia
      videoSrc?: string
      duration?: string
      playLabel: string
      linkLabel: string
    }
    soundtrack: {
      enabled: boolean
      eyebrow: string
      title: string
      intro: string
      audioSrc?: string
    }
    behindTheScenes: {
      enabled: boolean
      eyebrow: string
      title: string
      intro: string
      items: Array<{ id: string; title: string; caption: string; cover?: TheWeddingRollMedia }>
    }
    memoryCapsule: {
      enabled: boolean
      eyebrow: string
      title: string
      message: string
    }
  }
}
