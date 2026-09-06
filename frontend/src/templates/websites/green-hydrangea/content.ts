export type GreenHydrangeaSectionKey =
  | 'navigation'
  | 'hero'
  | 'announcement'
  | 'couple'
  | 'story'
  | 'events'
  | 'countdown'
  | 'venues'
  | 'gallery'
  | 'schedule'
  | 'dressCode'
  | 'faq'
  | 'rsvp'
  | 'guestbook'
  | 'footer'
export type GreenHydrangeaSectionConfig = {
  enabled: GreenHydrangeaSectionKey[]
  order: GreenHydrangeaSectionKey[]
}
export type GreenHydrangeaData = {
  hero: {
    brideName: string
    groomName: string
    eyebrow: string
    date: string
    venue: string
    image: string
  }
  announcement: { title: string; message: string }
  couple: {
    bride: { name: string; role: string; bio: string; image: string }
    groom: { name: string; role: string; bio: string; image: string }
  }
  story: Array<{ year: string; title: string; body: string; image: string }>
  events: Array<{ date: string; time: string; title: string; venue: string; address: string }>
  venues?: { title: string; address: string; mapUrl: string }
  rsvp?: { title: string; message: string; deadline: string }
  gallery: Array<{ src: string; alt: string }>
  schedule: Array<{ time: string; title: string; detail: string }>
  dressCode: { title: string; message: string; colors: string[] }
  faq: Array<{ question: string; answer: string }>
  guestbook: Array<{ author: string; message: string }>
  footer: { message: string; signature: string }
}
