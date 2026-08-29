import { useEffect, useState } from 'react'
import { RedSpiderLilyRecap } from '../../../templates/recaps/red-spider-lily/RedSpiderLilyRecap'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'
import { weddingApi } from '../../../shared/api/weddings'

export function PublicRecapPage({ slug }: { slug: string }) {
  const [content, setContent] = useState<RedSpiderLilyRecapContent>()
  const [sectionConfig, setSectionConfig] = useState<{ enabled: string[]; order: string[] }>()
  const [error, setError] = useState('')
  useEffect(() => { void weddingApi.publicRecap(slug).then((result) => { const payload = result.snapshot.payload; if (payload && typeof payload === 'object' && payload.content && typeof payload.content === 'object') { setContent(payload.content as RedSpiderLilyRecapContent); const theme = payload.theme; if (theme && typeof theme === 'object' && 'sectionConfig' in theme) setSectionConfig((theme as { sectionConfig?: { enabled: string[]; order: string[] } }).sectionConfig) } else setError('Published recap payload is invalid.') }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load this recap.')) }, [slug])
  if (error) return <main style={{ padding: 32 }}><h1>Recap unavailable</h1><p>{error}</p></main>
  if (!content) return <main style={{ padding: 32 }}><p>Loading recap...</p></main>
  return <RedSpiderLilyRecap data={content} sectionConfig={sectionConfig} />
}
