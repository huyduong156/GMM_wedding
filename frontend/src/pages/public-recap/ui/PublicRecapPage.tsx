import { useEffect, useState } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { RedSpiderLilyRecap } from '../../../templates/recaps/red-spider-lily/RedSpiderLilyRecap'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'
import { redSpiderLilyRecapFixture } from '../../../templates/recaps/red-spider-lily/fixture'
import { WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { StatusPage } from '../../status/ui/StatusPage'

type SectionConfig = { enabled: string[]; order: string[] }
type DraftPayload = { content?: unknown; theme?: unknown }

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

export function PublicRecapPage({ slug }: { slug: string }) {
  const auth = useOptionalAuth()
  const [content, setContent] = useState<RedSpiderLilyRecapContent>()
  const [sectionConfig, setSectionConfig] = useState<SectionConfig>()
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true

    const loadOwnerDraft = async (): Promise<DraftPayload | null> => {
      const weddings = await weddingApi.list()
      const wedding = weddings.items.find((item) => item.slug === slug)
      if (!wedding) return null
      const result = (await weddingApi.recap(wedding.id)).recap
      if (!result) return null
      return { content: result.content, theme: { sectionConfig: result.sectionConfig } }
    }

    const load = async () => {
      setNotFound(false)
      setError('')

      try {
        let payload: DraftPayload | null = null
        const signedIn = auth?.checkUserSession ? await auth.checkUserSession() : false

        if (signedIn) payload = await loadOwnerDraft()
        if (!payload)
          payload = (await weddingApi.publicRecap(slug)).snapshot.payload as DraftPayload

        if (!active) return
        if (!payload.content || typeof payload.content !== 'object') {
          throw new Error('Dữ liệu recap không hợp lệ.')
        }

        setContent(mergeRecapContent(payload.content as Record<string, unknown>))
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
  }, [auth?.checkUserSession, slug])

  if (notFound) return <StatusPage kind="not-found" />
  if (error) return <StatusPage kind="server-error" />
  if (!content)
    return (
      <main style={{ padding: 32 }}>
        <p>Loading recap...</p>
      </main>
    )
  return <RedSpiderLilyRecap data={content} sectionConfig={sectionConfig} />
}
