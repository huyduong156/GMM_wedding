export type AureliaCourtMedia = { src: string; alt: string }

export type AureliaCourtFamilySide = {
  label: string
  fatherTitle: string
  father: string
  motherTitle: string
  mother: string
  address: string
}

export type AureliaCourtData = {
  couple: { brideName: string; groomName: string }
  event: { weddingDate: string; time: string; venueName: string; venueAddress: string; mapUrl: string; calendarUrl: string }
  opening: { eyebrow: string; title: string; message: string }
  cover: { eyebrow: string; title: string; message: string; heroMedia: AureliaCourtMedia | null }
  invitation: { title: string; message: string }
  families: { title: string; subtitle: string; message: string; brideSide: AureliaCourtFamilySide; groomSide: AureliaCourtFamilySide }
  eventDetails: { title: string; message: string }
  countdown: { enabled: boolean }
  timeline: { title: string; message: string; items: Array<{ time: string; title: string; detail: string }> }
  venue: { title: string; name: string; address: string; message: string; mapUrl: string; calendarUrl: string }
  activities: { title: string; message: string; items: Array<{ title: string; image: AureliaCourtMedia | null }> }
  gallery: { title: string; message: string; images: AureliaCourtMedia[] }
  rsvp: { title: string; message: string; deadline: string }
  guestbook: { title: string; message: string }
  gift: { title: string; message: string; thankYouMessage: string; qrMedia: AureliaCourtMedia | null }
  music: { title: string; trackName: string; backgroundMusicUrl: string; backgroundMusicName: string; backgroundMusicAutoplay: boolean }
  footer: { title: string; message: string }
}

export type AureliaCourtSectionConfig = { enabled: string[]; order: string[] }
