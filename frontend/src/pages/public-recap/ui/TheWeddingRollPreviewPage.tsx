import { useEffect, useState } from 'react'
import { TheWeddingRollRecap } from '../../../templates/recaps/the-wedding-roll/TheWeddingRollRecap'
import type { TheWeddingRollRecapContent } from '../../../templates/recaps/the-wedding-roll/content'
import { theWeddingRollRecapFixture } from '../../../templates/recaps/the-wedding-roll/fixture'
import { normalizePeopleGroups } from '../../../templates/recaps/the-wedding-roll/people-groups'
import { liveEditorEvents, isLiveEditorUpdate } from '../../../shared/lib/live-template-editor'

type PreviewState = {
  data?: TheWeddingRollRecapContent
  wishes?: Array<{ id?: string; authorName: string; content: string }>
}
const PREVIEW_ALBUM_URL = 'https://drive.google.com'

function mergePreviewContent(value: Partial<TheWeddingRollRecapContent>): TheWeddingRollRecapContent {
  const merge = (base: unknown, override: unknown): unknown => {
    if (
      !override ||
      typeof override !== 'object' ||
      Array.isArray(override) ||
      !base ||
      typeof base !== 'object' ||
      Array.isArray(base)
    ) return override ?? base
    return Object.fromEntries(
      Object.entries({ ...base, ...override }).map(([key, item]) => [
        key,
        key in override ? merge((base as Record<string, unknown>)[key], item) : item,
      ]),
    )
  }
  const merged = merge(
    theWeddingRollRecapFixture,
    value,
  ) as TheWeddingRollRecapContent
  const storedOptional =
    value.optional && typeof value.optional === 'object'
      ? (value.optional as Record<string, unknown>)
      : {}
  const storedPeopleBehind =
    storedOptional.peopleBehindTheDay && typeof storedOptional.peopleBehindTheDay === 'object'
      ? (storedOptional.peopleBehindTheDay as Record<string, unknown>)
      : {}
  const storedBehindTheScenes =
    storedOptional.behindTheScenes && typeof storedOptional.behindTheScenes === 'object'
      ? (storedOptional.behindTheScenes as Record<string, unknown>)
      : undefined
  const optional = merged.optional as unknown as Record<string, unknown>
  const peopleBehind = optional.peopleBehindTheDay as Record<string, unknown>
  peopleBehind.groups = normalizePeopleGroups(storedPeopleBehind, storedBehindTheScenes)
  delete peopleBehind.people
  const storedDelivery = value.photoDelivery as Record<string, unknown> | undefined
  const delivery = merged.photoDelivery as unknown as Record<string, unknown>
  delivery.featuredPhotos = Array.isArray(storedDelivery?.featuredPhotos)
    ? storedDelivery.featuredPhotos
    : Array.isArray(storedDelivery?.media)
      ? storedDelivery.media
      : []
  delivery.externalAlbumUrl =
    typeof storedDelivery?.externalAlbumUrl === 'string'
      ? storedDelivery.externalAlbumUrl
      : ''
  delivery.albums = []
  delete delivery.media
  delete delivery.albumUrl
  return merged
}

export function TheWeddingRollPreviewPage() {
  const draft = new URLSearchParams(window.location.search).get('editor') === '1'
  const templateKey =
    new URLSearchParams(window.location.search).get('template') ?? 'the-wedding-roll-recap'
  const [data, setData] = useState(() => {
    const saved = draft ? readPreviewState(templateKey)?.data : undefined
    return saved ? mergePreviewContent(saved) : undefined
  })
  const [wishes, setWishes] = useState(() =>
    draft ? readPreviewState(templateKey)?.wishes : undefined,
  )
  useEffect(() => {
    if (!draft) return
    const send = (type: string) =>
      window.parent.postMessage({ type, version: 1 }, window.location.origin)
    send(liveEditorEvents.ready)
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        !isLiveEditorUpdate<PreviewState>(event.data)
      )
        return
      const next = event.data.payload.data
      if (next) {
        const merged = mergePreviewContent(next)
        const nextWishes = event.data.payload.wishes
        setData(merged)
        setWishes(nextWishes)
        sessionStorage.setItem(
          'gmm-recap-preview:' + templateKey,
          JSON.stringify({ data: merged, wishes: nextWishes }),
        )
      }
      send(liveEditorEvents.hydrated)
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [draft, templateKey])
  const previewContent = data ?? theWeddingRollRecapFixture
  const contentWithAlbumExample = previewContent.photoDelivery.externalAlbumUrl.trim()
    ? previewContent
    : {
        ...previewContent,
        photoDelivery: {
          ...previewContent.photoDelivery,
          externalAlbumUrl: PREVIEW_ALBUM_URL,
        },
      }
  return <TheWeddingRollRecap content={contentWithAlbumExample} wishes={wishes} />
}

function readPreviewState(templateKey: string): PreviewState | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-recap-preview:' + templateKey) ?? 'null',
    ) as PreviewState | null
  } catch {
    return null
  }
}
