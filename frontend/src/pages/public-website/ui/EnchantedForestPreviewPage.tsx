import { useEffect, useState } from 'react'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'
import { EnchantedForestWebsite } from '../../../templates/websites/enchanted-forest/EnchantedForestWebsite'
import type {
  EnchantedForestData,
  EnchantedForestSectionConfig,
} from '../../../templates/websites/enchanted-forest/content'

type PreviewState = { data?: EnchantedForestData; sectionConfig?: EnchantedForestSectionConfig }

export function EnchantedForestPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState(stored?.data),
    [sectionConfig, setSectionConfig] = useState(stored?.sectionConfig)
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<PreviewState>(event.data)) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<EnchantedForestSectionConfig['order'][number]>(event.data))
        document
          .querySelector(`[data-editor-section="${event.data.payload.sectionKey}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])
  return (
    <>
      <EnchantedForestWebsite data={data} sectionConfig={sectionConfig} />
      {!editorMode ? (
        <a className="ef-preview-exit" href="/studio/site/themes">
          Đóng xem trước
        </a>
      ) : null}
    </>
  )
}

function readPreviewState(): PreviewState | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-website-preview:enchanted-forest') ?? 'null',
    ) as PreviewState | null
  } catch {
    return null
  }
}
