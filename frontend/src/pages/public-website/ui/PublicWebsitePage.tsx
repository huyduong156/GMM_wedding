import { useEffect, useState } from 'react'
import { weddingApi, type PublishedWeddingSnapshot } from '../../../shared/api/weddings'
import { EditorialVowsWebsite } from '../../../templates/websites/editorial-vows/EditorialVowsWebsite'
import type { EditorialVowsData, EditorialVowsSectionConfig } from '../../../templates/websites/editorial-vows/content'
import { GreenHydrangeaWebsite } from '../../../templates/websites/green-hydrangea/GreenHydrangeaWebsite'
import type { GreenHydrangeaData, GreenHydrangeaSectionConfig } from '../../../templates/websites/green-hydrangea/content'
import { EnchantedForestWebsite } from '../../../templates/websites/enchanted-forest/EnchantedForestWebsite'
import type { EnchantedForestData, EnchantedForestSectionConfig } from '../../../templates/websites/enchanted-forest/content'
import { CherryBlossomGardenWebsite } from '../../../templates/websites/cherry-blossom-garden/CherryBlossomGardenWebsite'
import type { CherryBlossomData, CherrySectionConfig } from '../../../templates/websites/cherry-blossom-garden/content'

type Snapshot = PublishedWeddingSnapshot

export function PublicWebsitePage({ weddingSlug }: { weddingSlug: string }) {
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [error, setError] = useState('')
  useEffect(() => { void weddingApi.publicWebsite(weddingSlug).then((result) => setSnapshot(result.snapshot)).catch((cause) => setError(cause instanceof Error ? cause.message : 'Không thể tải website cưới.')) }, [weddingSlug])
  if (error) return <main style={{ padding: 32 }}><h1>Không thể mở website</h1><p>{error}</p></main>
  if (!snapshot) return <main style={{ padding: 32 }}><p>Đang tải website cưới…</p></main>
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
