import { useEffect, useMemo, useState } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { weddingApi, type PublishedWeddingSnapshot } from '../../../shared/api/weddings'
import { PageLoading } from '../../../shared/ui/PageLoading'
import { StatusPage } from '../../status/ui/StatusPage'
import { EditorialVowsWebsite } from '../../../templates/websites/editorial-vows/EditorialVowsWebsite'
import { GreenHydrangeaWebsite } from '../../../templates/websites/green-hydrangea/GreenHydrangeaWebsite'
import { EnchantedForestWebsite } from '../../../templates/websites/enchanted-forest/EnchantedForestWebsite'
import { CherryBlossomGardenWebsite } from '../../../templates/websites/cherry-blossom-garden/CherryBlossomGardenWebsite'
import { ABeautifulDayWebsite } from '../../../templates/websites/a-beautiful-day/ABeautifulDayWebsite'
import type { ABeautifulDaySectionConfig } from '../../../templates/websites/a-beautiful-day/content'
import { aBeautifulDayRenderData } from './a-beautiful-day-render-data'
import { usePublicGuest } from '../../../shared/lib/navigation/usePublicGuest'
import { usePublicRsvp } from '../../../shared/lib/navigation/usePublicRsvp'
import { usePublicWishes } from '../../../shared/lib/navigation/usePublicWishes'
import { musicApi } from '../../../shared/api/music'
import type { MusicTrack } from '../../../shared/api/admin-music'
import { publicSurfaceMetadata, usePageMetadata } from '../../../shared/lib/page-metadata'

export function PublicWebsitePageNext({ weddingSlug, guestSlug }: { weddingSlug: string; guestSlug?: string }) {
  const auth = useOptionalAuth()
  const checkUserSession = auth?.checkUserSession
  const [snapshot, setSnapshot] = useState<PublishedWeddingSnapshot>()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const metadata = useMemo(
    () =>
      snapshot
        ? publicSurfaceMetadata(
            { ...snapshot.payload, weddingName: snapshot.weddingName, ownerAvatarUrl: snapshot.ownerAvatarUrl },
            'website',
            `/${encodeURIComponent(weddingSlug)}/website`,
          )
        : undefined,
    [snapshot, weddingSlug],
  )
  usePageMetadata(metadata)
  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)
    setError('')
    void (async () => {
      try {
        const result = await weddingApi.publicWebsite(weddingSlug)
        if (active) setSnapshot(result.snapshot)
        return
      } catch {
        const signedIn = checkUserSession ? await checkUserSession() : false
        if (!signedIn) {
          if (active) setNotFound(true)
          return
        }
        try {
          const wedding = (await weddingApi.list()).items.find((item) => item.slug === weddingSlug)
          if (!wedding) throw new Error('not found')
          const content = (await weddingApi.content(wedding.id, 'WEDDING_WEBSITE')).content
          if (!content.templateVersion) throw new Error('not found')
          if (active)
            setSnapshot({
              id: `draft-${wedding.id}`,
              weddingId: wedding.id,
              surface: 'WEDDING_WEBSITE',
              slug: wedding.slug ?? weddingSlug,
              version: 0,
              publishedAt: new Date(0).toISOString(),
              payload: {
                surface: 'WEDDING_WEBSITE',
                template: {
                  key: content.templateVersion.key,
                  version: content.templateVersion.version,
                },
                content: content.content,
                theme: { themeConfig: content.themeConfig, sectionConfig: content.sectionConfig },
              },
              templateVersion: {
                key: content.templateVersion.key,
                version: content.templateVersion.version,
              },
            })
        } catch {
          if (active) setNotFound(true)
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [checkUserSession, weddingSlug])
  if (notFound) return <StatusPage kind="not-found" />
  if (loading || !snapshot)
    return (
      <PageLoading
        label="Đang chuẩn bị website cưới"
        detail="Một chút nữa thôi, website đang được mở ra."
      />
    )
  if (error) return <StatusPage kind="server-error" />
  const payload = snapshot.payload as {
    template: { key: string }
    content?: unknown
    theme?: { sectionConfig?: unknown }
  }
  const content = payload.content ?? {}
  const config = payload.theme?.sectionConfig
  switch (payload.template.key) {
    case 'editorial-vows':
      return <EditorialVowsWebsite data={content as never} sectionConfig={config as never} />
    case 'green-hydrangea':
      return <GreenHydrangeaWebsite data={content as never} sectionConfig={config as never} />
    case 'enchanted-forest':
      return <EnchantedForestWebsite data={content as never} sectionConfig={config as never} />
    case 'cherry-blossom-garden':
      return <CherryBlossomGardenWebsite data={content as never} sectionConfig={config as never} />
    case 'a-beautiful-day':
      return <ABeautifulDayPublicRenderer
        weddingSlug={weddingSlug}
        guestSlug={guestSlug}
        payload={payload as Record<string, unknown>}
        sectionConfig={config as ABeautifulDaySectionConfig | undefined}
        themeConfig={(payload as { theme?: { themeConfig?: Record<string, unknown> } }).theme?.themeConfig}
        enabled={!snapshot.id.startsWith('draft-')}
      />
    default:
      return <StatusPage kind="not-found" />
  }
}

function ABeautifulDayPublicRenderer({ weddingSlug, guestSlug, payload, sectionConfig, themeConfig, enabled }: {
  weddingSlug: string
  guestSlug?: string
  payload: Record<string, unknown>
  sectionConfig?: ABeautifulDaySectionConfig
  themeConfig?: Record<string, unknown>
  enabled: boolean
}) {
  const guest = usePublicGuest({ weddingSlug, guestSlug })
  const rsvp = usePublicRsvp({ weddingSlug, guestSlug })
  const wishes = usePublicWishes({ weddingSlug, guestSlug, enabled })
  const interactions = { isPersonalized: Boolean(guestSlug), guestName: guest.guestName, rsvp, wishes }
  const content = (payload.content ?? {}) as { music?: { musicTrackId?: unknown } }
  const selected = typeof content.music?.musicTrackId === 'string' ? content.music.musicTrackId : ''
  const [track, setTrack] = useState<MusicTrack>()
  useEffect(() => {
    if (!enabled || !selected) { setTrack(undefined); return }
    let active = true
    void musicApi.list().then(({ items }) => {
      if (!active) return
      setTrack(items.find((item) => item.status === 'READY' && item.playbackUrl && (item.id === selected || item.playbackUrl === selected)))
    }).catch(() => { if (active) setTrack(undefined) })
    return () => { active = false }
  }, [enabled, selected])
  const data = aBeautifulDayRenderData({ ...payload, guestName: guest.guestName })
  return <ABeautifulDayWebsite
    data={data}
    sectionConfig={sectionConfig}
    themeConfig={themeConfig}
    interactions={interactions}
    music={track?.playbackUrl ? { trackId: selected, url: track.playbackUrl } : undefined}
    editorMode={!enabled}
  />
}
