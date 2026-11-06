import { useEffect, useMemo, useState } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { RedSpiderLilyRecap } from '../../../templates/recaps/red-spider-lily/RedSpiderLilyRecap'
import { TheWeddingRollRecap } from '../../../templates/recaps/the-wedding-roll/TheWeddingRollRecap'
import type { TheWeddingRollRecapContent } from '../../../templates/recaps/the-wedding-roll/content'
import { theWeddingRollRecapFixture } from '../../../templates/recaps/the-wedding-roll/fixture'
import { normalizePeopleGroups } from '../../../templates/recaps/the-wedding-roll/people-groups'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'
import { redSpiderLilyRecapFixture } from '../../../templates/recaps/red-spider-lily/fixture'
import { WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { StatusPage } from '../../status/ui/StatusPage'
import { publicSurfaceMetadata, usePageMetadata } from '../../../shared/lib/page-metadata'

type SectionConfig = { enabled: string[]; order: string[] }
type DraftPayload = {
  content?: unknown
  theme?: unknown
  templateKey?: string
  template?: { key?: string }
  templateVersion?: { key?: string }
  mediaItems?: Array<{ publicUrl: string; altText?: string | null; caption?: string | null }>
  wishes?: Array<{ wishId?: string; authorName: string; content: string }>
}
type PublicAlbumItem = { src: string; alt: string; caption?: string | null }

const cloneRecap = <T,>(value: T): T => structuredClone(value)
const mergeRecapRecords = (
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> =>
  Object.entries(override).reduce((result, [key, value]) => {
    const baseValue = result[key]
    result[key] =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
        ? mergeRecapRecords(baseValue as Record<string, unknown>, value as Record<string, unknown>)
        : value
    return result
  }, cloneRecap(base))
const mergeRecapContent = (stored: Record<string, unknown>): RedSpiderLilyRecapContent =>
  mergeRecapRecords(
    cloneRecap(redSpiderLilyRecapFixture.content) as unknown as Record<string, unknown>,
    stored,
  ) as unknown as RedSpiderLilyRecapContent
const mergeWeddingRollContent = (stored: Record<string, unknown>): TheWeddingRollRecapContent => {
  const merged = mergeRecapRecords(
    cloneRecap(theWeddingRollRecapFixture) as unknown as Record<string, unknown>,
    stored,
  ) as unknown as TheWeddingRollRecapContent
  const storedOptional =
    stored.optional && typeof stored.optional === 'object'
      ? (stored.optional as Record<string, unknown>)
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
  const storedDelivery =
    stored.photoDelivery && typeof stored.photoDelivery === 'object'
      ? (stored.photoDelivery as Record<string, unknown>)
      : {}
  const legacyAlbums = Array.isArray(storedDelivery.albums) ? storedDelivery.albums : []
  const legacyExternalAlbum = legacyAlbums.find(
    (value) =>
      value &&
      typeof value === 'object' &&
      (value as Record<string, unknown>).type === 'EXTERNAL_ALBUM_LINK',
  ) as Record<string, unknown> | undefined
  const featuredPhotos = Array.isArray(storedDelivery.featuredPhotos)
    ? storedDelivery.featuredPhotos
    : Array.isArray(storedDelivery.media)
      ? storedDelivery.media
      : []
  const externalAlbumUrl =
    typeof storedDelivery.externalAlbumUrl === 'string'
      ? storedDelivery.externalAlbumUrl
      : typeof storedDelivery.albumUrl === 'string'
        ? storedDelivery.albumUrl
        : typeof legacyExternalAlbum?.href === 'string'
          ? legacyExternalAlbum.href
          : ''

  return {
    ...merged,
    photoDelivery: { ...merged.photoDelivery, albums: [], featuredPhotos, externalAlbumUrl },
  }
}

export function PublicRecapPage({ slug }: { slug: string }) {
  const auth = useOptionalAuth()
  const checkUserSession = auth?.checkUserSession
  const [content, setContent] = useState<RedSpiderLilyRecapContent>()
  const [weddingRollContent, setWeddingRollContent] = useState<TheWeddingRollRecapContent>()
  const [templateKey, setTemplateKey] = useState('red-spider-lily-recap')
  const [albumItems, setAlbumItems] = useState<PublicAlbumItem[]>([])
  const [weddingRollWishes, setWeddingRollWishes] = useState<
    Array<{ id?: string; authorName: string; content: string }> | undefined
  >()
  const [sectionConfig, setSectionConfig] = useState<SectionConfig>()
  const [weddingName, setWeddingName] = useState<string>()
  const [ownerAvatarUrl, setOwnerAvatarUrl] = useState<string | null>()
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const metadataContent = content ?? weddingRollContent
  const metadata = useMemo(
    () =>
      metadataContent
        ? publicSurfaceMetadata(
            {
              content: metadataContent as unknown as Record<string, unknown>,
              weddingName,
              ownerAvatarUrl,
            },
            'recap',
            `/${encodeURIComponent(slug)}/recaps`,
          )
        : undefined,
    [metadataContent, ownerAvatarUrl, slug, weddingName],
  )
  usePageMetadata(metadata)

  useEffect(() => {
    let active = true

    const loadOwnerDraft = async (): Promise<DraftPayload | null> => {
      const weddings = await weddingApi.list()
      const wedding = weddings.items.find((item) => item.slug === slug)
      if (!wedding) return null
      const result = (await weddingApi.recap(wedding.id)).recap
      if (!result) return null
      return {
        content: result.content,
        templateKey: result.templateVersion.key,
        mediaItems: result.mediaItems.map((item) => ({
          publicUrl: item.publicUrl,
          altText: null,
          caption: item.caption,
        })),
        wishes: result.wishSelections.map((wish) => ({
          wishId: wish.wishId,
          authorName: wish.authorName,
          content: wish.content,
        })),
        theme: { sectionConfig: result.sectionConfig },
      }
    }

    const load = async () => {
      setNotFound(false)
      setError('')

      try {
        let payload: DraftPayload | null = null
        const signedIn = checkUserSession ? await checkUserSession() : false

        if (signedIn) payload = await loadOwnerDraft()
        if (!payload) {
          const result = await weddingApi.publicRecap(slug)
          payload = result.snapshot.payload as DraftPayload
          setWeddingName(result.snapshot.weddingName)
          setOwnerAvatarUrl(result.snapshot.ownerAvatarUrl ?? null)
        }

        if (!active) return
        setAlbumItems(
          (payload.mediaItems ?? []).map((item) => ({
            src: item.publicUrl,
            alt: item.altText ?? item.caption ?? 'Ảnh trong album cưới',
            caption: item.caption,
          })),
        )
        setWeddingRollWishes(
          Array.isArray(payload.wishes)
            ? payload.wishes.map((wish) => ({
                id: wish.wishId,
                authorName: wish.authorName,
                content: wish.content,
              }))
            : undefined,
        )
        if (!payload.content || typeof payload.content !== 'object') {
          throw new Error('Dữ liệu recap không hợp lệ.')
        }

        const key =
          payload.templateVersion?.key ??
          payload.template?.key ??
          payload.templateKey ??
          'red-spider-lily-recap'
        setTemplateKey(key)
        if (key === 'the-wedding-roll-recap') {
          setWeddingRollContent(mergeWeddingRollContent(payload.content as Record<string, unknown>))
          setContent(undefined)
        } else {
          setContent(mergeRecapContent(payload.content as Record<string, unknown>))
          setWeddingRollContent(undefined)
        }
        const theme = payload.theme
        if (theme && typeof theme === 'object' && 'sectionConfig' in theme) {
          setSectionConfig((theme as { sectionConfig?: SectionConfig }).sectionConfig)
        }
      } catch (cause) {
        if (!active) return
        if (cause instanceof WeddingApiError && cause.status === 404) {
          setNotFound(true)
          return
        }
        setError(cause instanceof Error ? cause.message : 'Unable to load this recap.')
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [checkUserSession, slug])

  if (notFound) return <StatusPage kind="not-found" />
  if (error) return <StatusPage kind="server-error" />
  if (!content && !weddingRollContent)
    return (
      <main style={{ padding: 32 }}>
        <p>Loading recap...</p>
      </main>
    )
  if (templateKey === 'the-wedding-roll-recap' && weddingRollContent)
    return (
      <TheWeddingRollRecap
        content={weddingRollContent}
        albumItems={albumItems}
        wishes={weddingRollWishes}
      />
    )
  return content ? <RedSpiderLilyRecap data={content} sectionConfig={sectionConfig} /> : null
}
