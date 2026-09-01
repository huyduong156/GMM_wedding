import { useEffect, useState } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { weddingApi, type PublishedWeddingSnapshot } from '../../../shared/api/weddings'
import { EditorialVowsWebsite } from '../../../templates/websites/editorial-vows/EditorialVowsWebsite'
import type { EditorialVowsData, EditorialVowsSectionConfig } from '../../../templates/websites/editorial-vows/content'
import { GreenHydrangeaWebsite } from '../../../templates/websites/green-hydrangea/GreenHydrangeaWebsite'
import type { GreenHydrangeaData, GreenHydrangeaSectionConfig } from '../../../templates/websites/green-hydrangea/content'
import { EnchantedForestWebsite } from '../../../templates/websites/enchanted-forest/EnchantedForestWebsite'
import type { EnchantedForestData, EnchantedForestSectionConfig } from '../../../templates/websites/enchanted-forest/content'
import { CherryBlossomGardenWebsite } from '../../../templates/websites/cherry-blossom-garden/CherryBlossomGardenWebsite'
import type { CherryBlossomData, CherrySectionConfig } from '../../../templates/websites/cherry-blossom-garden/content'
import { PageLoading } from '../../../shared/ui/PageLoading'
import { StatusPage } from '../../status/ui/StatusPage'

type Snapshot = PublishedWeddingSnapshot

export function PublicWebsitePage({ weddingSlug }: { weddingSlug: string }) {
  const auth = useOptionalAuth()
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  useEffect(() => { void weddingApi.publicWebsite(weddingSlug).then((result) => setSnapshot(result.snapshot)).catch((cause) => setError(cause instanceof Error ? cause.message : 'Không thể tải website cưới.')) }, [weddingSlug])
  if (error) return <main style={{ padding: 32 }}><h1>Không thể mở website</h1><p>{error}</p></main>
  if (!snapshot) return <main style={{ padding: 32 }}><p>Đang tải website cưới…</p></main>
  useEffect(() => {
    if (!error || snapshot) return
    let active = true
    void (async () => {
      const signedIn = auth?.checkUserSession ? await auth.checkUserSession() : false
      if (!signedIn) { if (active) setNotFound(true); return }
      try {
        const wedding = (await weddingApi.list()).items.find((item) => item.slug === weddingSlug)
        if (!wedding) throw new Error('Website not found')
        const content = (await weddingApi.content(wedding.id, 'WEDDING_WEBSITE')).content
        if (!content.templateVersion) throw new Error('Website not found')
        if (active) { setError(''); setSnapshot({ id: `draft-${wedding.id}`, weddingId: wedding.id, surface: 'WEDDING_WEBSITE', slug: wedding.slug ?? weddingSlug, version: 0, publishedAt: new Date(0).toISOString(), payload: { surface: 'WEDDING_WEBSITE', template: { key: content.templateVersion.key, version: content.templateVersion.version }, content: content.content, theme: { themeConfig: content.themeConfig, sectionConfig: content.sectionConfig } }, templateVersion: { key: content.templateVersion.key, version: content.templateVersion.version } }) }
      } catch { if (active) setNotFound(true) }
    })()
    return () => { active = false }
  }, [auth?.checkUserSession, error, snapshot, weddingSlug])
  if (notFound) return <StatusPage kind="not-found" />
  if (!snapshot) return <PageLoading label="Đang chuẩn bị website cưới" detail="Một chút nữa thôi, website đang được mở ra." />
  return <WebsiteSnapshot snapshot={snapshot} />
}

function WebsiteSnapshot({ snapshot }: { snapshot: Snapshot }) {
  const payload = snapshot.payload as { template: { key: string }; content?: unknown; theme?: { sectionConfig?: unknown } }
  const content = payload.content ?? {}
  const sectionConfig = payload.theme?.sectionConfig
  switch (payload.template.key) {
    case 'editorial-vows': return <EditorialVowsWebsite data={content as EditorialVowsData} sectionConfig={sectionConfig as EditorialVowsSectionConfig | undefined} />
    case 'green-hydrangea': return <GreenHydrangeaWebsite data={content as GreenHydrangeaData} sectionConfig={sectionConfig as GreenHydrangeaSectionConfig | undefined} />
    case 'enchanted-forest': return <EnchantedForestWebsite data={content as EnchantedForestData} sectionConfig={sectionConfig as EnchantedForestSectionConfig | undefined} />
    case 'cherry-blossom-garden': return <CherryBlossomGardenWebsite data={content as CherryBlossomData} sectionConfig={sectionConfig as CherrySectionConfig | undefined} />
    default: return <main style={{ padding: 32 }}><h1>Template chưa được hỗ trợ</h1><p>Template {payload.template.key} chưa có renderer trên phiên bản frontend này.</p></main>
  }
}
