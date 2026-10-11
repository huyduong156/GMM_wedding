export type DeepOceanSectionKey =
  | 'navigation'
  | 'hero'
  | 'story'
  | 'timeline'
  | 'weddingDay'
  | 'gallery'
  | 'memories'
  | 'people'
  | 'film'
  | 'wishes'
  | 'capsule'
  | 'footer'

export type DeepOceanSectionConfig = {
  enabled: readonly DeepOceanSectionKey[]
  order: readonly DeepOceanSectionKey[]
}

export type DeepOceanMedia = { src: string; alt: string; position?: string }

export type DeepOceanData = {
  music: { backgroundMusicUrl?: string; backgroundMusicName?: string; backgroundMusicAutoplay?: boolean }
  hero: { brideName: string; groomName: string; eyebrow: string; date: string; tagline: string; background: DeepOceanMedia }
  story: { eyebrow: string; title: string; body: string; image: DeepOceanMedia }
  timeline: Array<{ date: string; title: string; body: string }>
  weddingDay: { eyebrow: string; title: string; date: string; time: string; venue: string; address: string; background: DeepOceanMedia }
  gallery: Array<DeepOceanMedia>
  memories: { eyebrow: string; title: string; body: string; images: DeepOceanMedia[] }
  people: Array<{ name: string; role: string; image: DeepOceanMedia }>
  film: { title: string; message: string; poster: DeepOceanMedia; videoUrl: string }
  wishes: Array<{ author: string; message: string }>
  capsule: { eyebrow: string; title: string; message: string }
  footer: { message: string; signature: string; background: DeepOceanMedia }
}
