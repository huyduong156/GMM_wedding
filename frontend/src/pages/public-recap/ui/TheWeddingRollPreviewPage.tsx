import { useEffect, useState } from 'react'
import { TheWeddingRollRecap } from '../../../templates/recaps/the-wedding-roll/TheWeddingRollRecap'
import type { TheWeddingRollRecapContent } from '../../../templates/recaps/the-wedding-roll/content'
import { theWeddingRollRecapFixture } from '../../../templates/recaps/the-wedding-roll/fixture'
import { liveEditorEvents, isLiveEditorUpdate } from '../../../shared/lib/live-template-editor'

type PreviewState = { data?: TheWeddingRollRecapContent }

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
  return merge(theWeddingRollRecapFixture, value) as TheWeddingRollRecapContent
}

export function TheWeddingRollPreviewPage() {
  const draft = new URLSearchParams(window.location.search).get('editor') === '1'
  const templateKey =
    new URLSearchParams(window.location.search).get('template') ?? 'the-wedding-roll-recap'
  const [data, setData] = useState(() => {
    const saved = draft ? readPreviewState(templateKey)?.data : undefined
    return saved ? mergePreviewContent(saved) : undefined
  })
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
        setData(merged)
        sessionStorage.setItem('gmm-recap-preview:' + templateKey, JSON.stringify({ data: merged }))
      }
      send(liveEditorEvents.hydrated)
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [draft, templateKey])
  return <TheWeddingRollRecap content={data ?? theWeddingRollRecapFixture} />
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
