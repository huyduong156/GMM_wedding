import { useEffect, useState } from 'react'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'
import { CherryBlossomGardenWebsite } from '../../../templates/websites/cherry-blossom-garden/CherryBlossomGardenWebsite'
import type {
  CherryBlossomData,
  CherrySectionConfig,
} from '../../../templates/websites/cherry-blossom-garden/content'

type PreviewState = { data?: CherryBlossomData; sectionConfig?: CherrySectionConfig }

export function CherryBlossomGardenPreviewPage() {
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
      } else if (isLiveEditorScroll<CherrySectionConfig['order'][number]>(event.data))
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
      <CherryBlossomGardenWebsite data={data} sectionConfig={sectionConfig} />
      {!editorMode ? (
        <a className="cb-preview-exit" href="/studio/site/themes">
          Đóng xem trước
        </a>
      ) : null}
    </>
  )
}

function readPreviewState(): PreviewState | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-website-preview:cherry-blossom-garden') ?? 'null',
    ) as PreviewState | null
  } catch {
    return null
  }
}
