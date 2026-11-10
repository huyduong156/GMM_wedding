export type ForeverSectionKey = 'hero' | 'announcement' | 'couple' | 'story' | 'events' | 'activities' | 'countdown' | 'venues' | 'gallery' | 'dressCode' | 'faq' | 'rsvp' | 'gift' | 'guestbook' | 'footer' | 'weddingParty' | 'music'
export type ForeverSectionConfig = { enabled: ForeverSectionKey[]; order: ForeverSectionKey[] }
export type ForeverStoryImage = { src: string; alt: string; mediaAssetId?: string; role?: string }
export type ForeverData = {
  hero: { brideName: string; groomName: string; eyebrow: string; headline: string; date: string; time: string; location: string; image: string; imageAlt: string }
  announcement: { message: string }
  couple: { image: string; bio: string; albumImages?: Array<{ src: string; alt: string; mediaAssetId?: string; role?: string }> }
  storyHeading: string
  story: Array<{ date: string; title: string; body: string; image?: string; images?: ForeverStoryImage[]; year?: string }>
  events: {
    dateEyebrow: string
    introEyebrow: string
    introHeading: string
    introMessage: string
    agendaHeading: string
    agendaSubheading: string
    mapLinkLabel: string
    summary: { weekday: string; date: string; arrivalLabel: string; hours: string; venueLabel: string; venue: string }
    items: Array<{ type: string; title: string; time: string; date: string; venue: string; address: string; mapUrl: string }>
  }
  activities: { heading: string; items: Array<{ title: string; image: string }> }
  countdown: { message: string }
  venues: { image: string; heading: string; note: string; address: string; mapUrl: string }
  gallery: { heading: string; images: Array<{ src: string; alt: string }> }
  weddingParty: { title?: string; groups: Array<{ id: string; title: string; members: Array<{ id: string; name: string; role?: string; biography?: string; mediaId: string | null; portraitUrl?: string | null }> }> }
  dressCode: { heading: string; message: string; colors: string[] }
  faq: { items: Array<{ question: string; answer: string }> }
  rsvp: { heading: string; message: string; note: string }
  gift: { heading: string; message: string; qrImage: string }
  guestbook: { heading: string }
  footer: { message: string; signature: string; backgroundImage: string }
  music: { backgroundMusicUrl: string; backgroundMusicName: string; backgroundMusicAutoplay: boolean }
}
