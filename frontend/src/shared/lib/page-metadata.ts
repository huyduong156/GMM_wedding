import { useEffect } from 'react'

export type PageMetadata = {
  title: string
  description: string
  image?: string
  url?: string
  canonicalUrl?: string
  type?: 'website' | 'article'
  robots?: string
}

export type PublicSurface = 'invitation' | 'website' | 'recap'

export const DEFAULT_SOCIAL_IMAGE = '/assets/logo/ourday-logo.png'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

function nestedValue(source: unknown, path: readonly string[]): unknown {
  return path.reduce<unknown>((value, key) => (isRecord(value) ? value[key] : undefined), source)
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function mediaSource(value: unknown): string | undefined {
  const direct = nonEmptyString(value)
  if (direct) return direct
  if (!isRecord(value)) return undefined
  return nonEmptyString(value.src) ?? nonEmptyString(value.url) ?? nonEmptyString(value.publicUrl)
}

function firstNestedString(source: unknown, paths: readonly (readonly string[])[]) {
  for (const path of paths) {
    const value = nonEmptyString(nestedValue(source, path))
    if (value) return value
  }
  return undefined
}

function firstNestedMedia(source: unknown, paths: readonly (readonly string[])[]) {
  for (const path of paths) {
    const value = mediaSource(nestedValue(source, path))
    if (value) return value
  }
  return undefined
}

export function publicSurfaceMetadata(
  payload: Record<string, unknown>,
  surface: PublicSurface,
  canonicalPath: string,
): PageMetadata {
  const content = isRecord(payload.content) ? payload.content : payload
  const brideName = firstNestedString(content, [
    ['brideName'],
    ['couple', 'brideName'],
    ['hero', 'brideName'],
  ])
  const groomName = firstNestedString(content, [
    ['groomName'],
    ['couple', 'groomName'],
    ['hero', 'groomName'],
  ])
  const explicitTitle = firstNestedString(payload, [['ogTitle']])
  const explicitDescription = firstNestedString(payload, [['ogDescription']])
  const coupleName =
    [brideName, groomName].filter(Boolean).join(' & ') ||
    firstNestedString(content, [['hero', 'couple'], ['couple']])
  const image =
    firstNestedMedia(payload, [['ownerAvatarUrl'], ['avatarUrl']]) ??
    firstNestedMedia(payload, [['ogImageUrl']]) ??
    firstNestedMedia(content, [
      ['ogImageUrl'],
      ['heroMedia'],
      ['openingMediaFront'],
      ['coverBackgroundMedia'],
      ['hero', 'image'],
      ['hero', 'media'],
      ['cover', 'heroMedia'],
      ['cover', 'image'],
    ])

  const label =
    surface === 'invitation' ? 'Thiệp cưới' : surface === 'website' ? 'Website cưới' : 'Wedding Recap'
  const weddingName = firstNestedString(payload, [['weddingName']])
  const title = explicitTitle ?? weddingName ?? (coupleName ? `${coupleName} | ${label}` : `${label} | Ourday`)
  const description =
    explicitDescription ??
    (coupleName
      ? surface === 'recap'
        ? `Cùng nhìn lại những khoảnh khắc đáng nhớ trong ngày cưới của ${coupleName}.`
        : surface === 'website'
          ? `Cùng khám phá câu chuyện và những thông tin về ngày cưới của ${coupleName}.`
          : `Trân trọng mời bạn đến chung vui trong ngày cưới của ${coupleName}.`
      : surface === 'recap'
        ? 'Cùng nhìn lại những khoảnh khắc đáng nhớ trong ngày cưới.'
        : surface === 'website'
          ? 'Website cưới của chúng tôi.'
          : 'Thiệp mời cưới online.')

  return { title, description, image, canonicalUrl: canonicalPath, url: canonicalPath }
}

function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('/api/')) return `https://api.ourday.asia${value}`
  return new URL(value, window.location.origin).toString()
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.append(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value))
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }
  element.href = href
}

export function applyPageMetadata(metadata: PageMetadata) {
  const currentUrl = metadata.url ?? window.location.pathname
  const canonicalUrl = absoluteUrl(metadata.canonicalUrl ?? currentUrl)
  const socialUrl = absoluteUrl(currentUrl)
  const image = absoluteUrl(metadata.image ?? DEFAULT_SOCIAL_IMAGE)

  document.title = metadata.title
  upsertMeta('meta[name="description"]', { name: 'description', content: metadata.description })
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: metadata.robots ?? 'index,follow',
  })
  upsertMeta('meta[property="og:type"]', {
    property: 'og:type',
    content: metadata.type ?? 'website',
  })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Ourday' })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title })
  upsertMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: metadata.description,
  })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: socialUrl })
  upsertMeta('meta[name="twitter:card"]', {
    name: 'twitter:card',
    content: 'summary_large_image',
  })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title })
  upsertMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: metadata.description,
  })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
  upsertCanonical(canonicalUrl)
}

export function usePageMetadata(metadata: PageMetadata | undefined) {
  useEffect(() => {
    if (metadata) applyPageMetadata(metadata)
  }, [metadata])
}
