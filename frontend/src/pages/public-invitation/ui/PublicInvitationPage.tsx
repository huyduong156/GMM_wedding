import { useEffect, useState } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { WeddingApiError, weddingApi, type PublishedWeddingSnapshot } from '../../../shared/api/weddings'
import { ModernLuxeInvitation, type ModernLuxeData, type ModernLuxePalette, type ModernLuxeSectionConfig } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { VerdantPromiseInvitation } from '../../../templates/invitations/verdant-promise/VerdantPromiseInvitation'
import type { ModernLuxeData as VerdantPromiseData, ModernLuxeSectionConfig as VerdantPromiseSectionConfig } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { ChibiDaydreamInvitation } from '../../../templates/invitations/chibi-daydream/ChibiDaydreamInvitation'
import type { ChibiDaydreamData } from '../../../templates/invitations/chibi-daydream/ChibiDaydreamInvitation'
import { StatusPage } from '../../status/ui/StatusPage'
import { PageLoading } from '../../../shared/ui/PageLoading'
import { usePublicRsvp } from '../../../shared/lib/navigation/usePublicRsvp'
import { usePublicWishes } from '../../../shared/lib/navigation/usePublicWishes'
import { usePublicGuest } from '../../../shared/lib/navigation/usePublicGuest'

type Props = { weddingSlug: string; guestSlug?: string }
type Snapshot = PublishedWeddingSnapshot

export function PublicInvitationPage({ weddingSlug, guestSlug }: Props) {
  const auth = useOptionalAuth()
  const checkUserSession = auth?.checkUserSession
  const guest = usePublicGuest({ weddingSlug, guestSlug })
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  useEffect(() => {
    let active = true
    const load = async () => {
      setError('')
      setNotFound(false)
      try {
        if (guestSlug) {
          const result = await weddingApi.publicInvitation(weddingSlug)
          if (active) setSnapshot(result.snapshot)
          return
        }

        try {
          const result = await weddingApi.publicInvitation(weddingSlug)
          if (active) setSnapshot(result.snapshot)
          return
        } catch (cause) {
          // A private draft is only available to its authenticated owner.
          if (!(cause instanceof WeddingApiError) || cause.status !== 404) throw cause
        }

        const signedIn = checkUserSession ? await checkUserSession() : false
        if (!signedIn) throw new WeddingApiError(404, 'PUBLIC_INVITATION_NOT_FOUND', 'Invitation not found')

        const weddings = await weddingApi.list()
        const wedding = weddings.items.find((item) => item.slug === weddingSlug)
        if (!wedding) throw new WeddingApiError(404, 'PUBLIC_INVITATION_NOT_FOUND', 'Invitation not found')
        const content = (await weddingApi.content(wedding.id, 'ONLINE_INVITATION')).content
        if (!content.templateVersion) throw new WeddingApiError(404, 'PUBLIC_INVITATION_NOT_FOUND', 'Invitation not found')
        if (active) setSnapshot({
          id: `draft-${wedding.id}`,
          weddingId: wedding.id,
          surface: 'ONLINE_INVITATION',
          slug: wedding.slug ?? weddingSlug,
          version: 0,
          publishedAt: new Date(0).toISOString(),
          payload: {
            surface: 'ONLINE_INVITATION',
            template: { key: content.templateVersion.key, version: content.templateVersion.version },
            content: content.content,
            theme: { themeConfig: content.themeConfig, sectionConfig: content.sectionConfig },
          },
          templateVersion: { key: content.templateVersion.key, version: content.templateVersion.version },
        })
      } catch (cause) {
        if (!active) return
        if (cause instanceof WeddingApiError && cause.status === 404) setNotFound(true)
        else setError(cause instanceof Error ? cause.message : 'Không thể tải thiệp cưới.')
      }
    }
    void load()
    return () => { active = false }
  }, [checkUserSession, guestSlug, weddingSlug])
  if (notFound || guest.notFound) return <StatusPage kind="not-found" />
  if (error) return <main style={{ padding: 32 }}><h1>Không thể mở thiệp</h1><p>{error}</p></main>
  if (!snapshot) return <PageLoading label="Đang chuẩn bị thiệp cưới" detail="Một chút nữa thôi, thiệp của bạn đang được mở ra." />
  return <InvitationSnapshot snapshot={snapshot} weddingSlug={weddingSlug} guestSlug={guestSlug} guestName={guest.guestName} />
}

function InvitationSnapshot({ snapshot, weddingSlug, guestSlug, guestName }: { snapshot: Snapshot; weddingSlug: string; guestSlug?: string; guestName: string | null }) {
  const enabled = !snapshot.id.startsWith('draft-')
  const rsvp = usePublicRsvp({ weddingSlug, guestSlug })
  const wishes = usePublicWishes({ weddingSlug, guestSlug, enabled })
  const interactions = { isPersonalized: Boolean(guestSlug), guestName, rsvp, wishes }
  const payload = snapshot.payload as { template: { key: string }; content?: unknown; theme?: { themeConfig?: Record<string, unknown>; sectionConfig?: unknown } }
  const content = payload.content ?? {}
  const theme = payload.theme ?? {}
  const sectionConfig = theme.sectionConfig
  switch (payload.template.key) {
    case 'modern-luxe':
      return <ModernLuxeInvitation data={content as ModernLuxeData} palette={(theme.themeConfig?.palette as ModernLuxePalette | undefined) ?? 'champagne'} sectionConfig={sectionConfig as ModernLuxeSectionConfig | undefined} interactions={interactions} />
    case 'verdant-promise':
      return <VerdantPromiseInvitation data={content as VerdantPromiseData} sectionConfig={sectionConfig as VerdantPromiseSectionConfig | undefined} interactions={interactions} />
    case 'chibi-daydream':
      return <ChibiDaydreamInvitation data={content as ChibiDaydreamData} sectionConfig={sectionConfig as { enabled: string[]; order: string[] } | undefined} interactions={interactions} />
    default:
      return <main style={{ padding: 32 }}><h1>Template chưa được hỗ trợ</h1><p>Template {payload.template.key} chưa có renderer trên phiên bản frontend này.</p></main>
  }
}
