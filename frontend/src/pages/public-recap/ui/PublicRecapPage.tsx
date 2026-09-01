import { useEffect, useState } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { RedSpiderLilyRecap } from '../../../templates/recaps/red-spider-lily/RedSpiderLilyRecap'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'
import { WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { StatusPage } from '../../status/ui/StatusPage'

type SectionConfig = { enabled: string[]; order: string[] }

type DraftPayload = { content?: unknown; theme?: unknown }

export function PublicRecapPage({ slug }: { slug: string }) {
  const auth = useOptionalAuth()
  const [content, setContent] = useState<RedSpiderLilyRecapContent>()
  const [sectionConfig, setSectionConfig] = useState<SectionConfig>()
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setNotFound(false)
      try {
        let payload: DraftPayload
        if (auth?.user) {
          const weddings = await weddingApi.list()
          const wedding = weddings.items.find((item) => item.slug === slug)
          if (!wedding) { setNotFound(true); return }
          const result = (await weddingApi.recap(wedding.id)).recap
          if (!result) { setNotFound(true); return }
          payload = { content: result.content, theme: { sectionConfig: result.sectionConfig } }
        } else {
          payload = (await weddingApi.publicRecap(slug)).snapshot.payload as DraftPayload
        }
        if (!active) return
        if (!payload.content || typeof payload.content !== 'object') throw new Error(auth?.user ? 'Dữ liệu recap không hợp lệ.' : 'Published recap payload is invalid.')
        setContent(payload.content as RedSpiderLilyRecapContent)
        const theme = payload.theme
        if (theme && typeof theme === 'object' && 'sectionConfig' in theme) setSectionConfig((theme as { sectionConfig?: SectionConfig }).sectionConfig)
      } catch (cause) {
        if (!active) return
        if (cause instanceof WeddingApiError && cause.status === 404) { setNotFound(true); return }
        setError(cause instanceof Error ? cause.message : 'Unable to load this recap.')
      }
    }
    void load()
    return () => { active = false }
  }, [auth?.user, slug])

  if (notFound) return <StatusPage kind="not-found" />
  if (error) return <StatusPage kind="server-error" />
  if (!content) return <main style={{ padding: 32 }}><p>Loading recap...</p></main>
  return <RedSpiderLilyRecap data={content} sectionConfig={sectionConfig} />
}