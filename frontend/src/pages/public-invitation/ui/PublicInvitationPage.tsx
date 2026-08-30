import { useEffect, useState } from 'react'
import { weddingApi, type PublishedWeddingSnapshot } from '../../../shared/api/weddings'
import { ModernLuxeInvitation, type ModernLuxeData, type ModernLuxePalette, type ModernLuxeSectionConfig } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { VerdantPromiseInvitation } from '../../../templates/invitations/verdant-promise/VerdantPromiseInvitation'
import type { ModernLuxeData as VerdantPromiseData, ModernLuxeSectionConfig as VerdantPromiseSectionConfig } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { ChibiDaydreamInvitation } from '../../../templates/invitations/chibi-daydream/ChibiDaydreamInvitation'
import type { ChibiDaydreamData } from '../../../templates/invitations/chibi-daydream/ChibiDaydreamInvitation'

type Props = { weddingSlug: string; guestSlug?: string }
type Snapshot = PublishedWeddingSnapshot

export function PublicInvitationPage({ weddingSlug, guestSlug }: Props) {
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [error, setError] = useState('')
  useEffect(() => {
    const load = guestSlug
      ? Promise.all([weddingApi.publicInvitation(weddingSlug), weddingApi.publicInvitationGuest(weddingSlug, guestSlug)])
      : weddingApi.publicInvitation(weddingSlug)
    void load.then((result) => setSnapshot(Array.isArray(result) ? result[0].snapshot : result.snapshot))
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Không thể tải thiệp cưới.'))
  }, [guestSlug, weddingSlug])
  if (error) return <main style={{ padding: 32 }}><h1>Không thể mở thiệp</h1><p>{error}</p></main>
  if (!snapshot) return <main style={{ padding: 32 }}><p>Đang tải thiệp cưới…</p></main>
  return <InvitationSnapshot snapshot={snapshot} />
}

function InvitationSnapshot({ snapshot }: { snapshot: Snapshot }) {
  const payload = snapshot.payload as { template: { key: string }; content?: unknown; theme?: { themeConfig?: Record<string, unknown>; sectionConfig?: unknown } }
  const content = payload.content ?? {}
  const theme = payload.theme ?? {}
  const sectionConfig = theme.sectionConfig
  switch (payload.template.key) {
    case 'modern-luxe':
      return <ModernLuxeInvitation data={content as ModernLuxeData} palette={(theme.themeConfig?.palette as ModernLuxePalette | undefined) ?? 'champagne'} sectionConfig={sectionConfig as ModernLuxeSectionConfig | undefined} />
    case 'verdant-promise':
      return <VerdantPromiseInvitation data={content as VerdantPromiseData} sectionConfig={sectionConfig as VerdantPromiseSectionConfig | undefined} />
    case 'chibi-daydream':
      return <ChibiDaydreamInvitation data={content as ChibiDaydreamData} sectionConfig={sectionConfig as { enabled: string[]; order: string[] } | undefined} />
    default:
      return <main style={{ padding: 32 }}><h1>Template chưa được hỗ trợ</h1><p>Template {payload.template.key} chưa có renderer trên phiên bản frontend này.</p></main>
  }
}
