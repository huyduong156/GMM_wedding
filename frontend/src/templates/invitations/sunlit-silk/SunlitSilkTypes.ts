export type SunlitSilkSectionKey =
  | 'opening'
  | 'cover'
  | 'invitation'
  | 'families'
  | 'eventDetails'
  | 'countdown'
  | 'timeline'
  | 'venue'
  | 'gallery'
  | 'rsvp'
  | 'guestbook'
  | 'gift'
  | 'music'
  | 'footer'

export type SunlitSilkSectionConfig = {
  enabled: SunlitSilkSectionKey[]
  order: SunlitSilkSectionKey[]
}

export type SunlitSilkMedia = {
  src: string
  alt?: string
  mediaAssetId?: string
  role?: string
}

export type SunlitSilkFamilySide = {
  label?: string
  fatherTitle?: string
  father?: string
  motherTitle?: string
  mother?: string
  address?: string
}

export type SunlitSilkTimelineItem = {
  time?: string
  title?: string
  description?: string
}

export type SunlitSilkData = {
  couple?: {
    brideName?: string
    groomName?: string
    brideRole?: string
    groomRole?: string
    brideMedia?: SunlitSilkMedia | string | null
    groomMedia?: SunlitSilkMedia | string | null
  }
  event?: {
    weddingDate?: string
    time?: string
    venueName?: string
    venueAddress?: string
    mapUrl?: string
  }
  opening?: { title?: string; message?: string }
  cover?: {
    eyebrow?: string
    message?: string
    phraseFrom?: string
    phraseTo?: string
  }
  invitation?: { title?: string; message?: string }
  families?: {
    title?: string
    note?: string
    /** @deprecated Use note for new content. Kept so older drafts still render. */
    message?: string
    brideSide?: SunlitSilkFamilySide
    groomSide?: SunlitSilkFamilySide
  }
  eventDetails?: {
    title?: string
    items?: Array<{ title?: string; image?: SunlitSilkMedia | string | null }>
    /** @deprecated Kept for older drafts; eventDetails now renders activity items. */
    ceremonyLabel?: string
    ceremonyTime?: string
    /** @deprecated Kept for older drafts; eventDetails now renders activity items. */
    receptionLabel?: string
    receptionTime?: string
  }
  timeline?: { title?: string; message?: string; items?: SunlitSilkTimelineItem[] }
  venue?: { title?: string; name?: string; address?: string; mapUrl?: string; message?: string }
  gallery?: { kicker?: string; title?: string; message?: string }
  galleryImages?: Array<string | SunlitSilkMedia>
  rsvp?: {
    kicker?: string
    title?: string
    message?: string
    successMessage?: string
    attendingLabel?: string
    notAttendingLabel?: string
  }
  guestbook?: { title?: string; message?: string; successMessage?: string }
  gift?: { title?: string; message?: string; thankYouMessage?: string }
  giftQrMedia?: SunlitSilkMedia | null
  music?: {
    backgroundMusicUrl?: string
    backgroundMusicName?: string
    backgroundMusicAutoplay?: boolean
  }
  footer?: {
    title?: string
    message?: string
    image?: SunlitSilkMedia | string | null
  }
}
