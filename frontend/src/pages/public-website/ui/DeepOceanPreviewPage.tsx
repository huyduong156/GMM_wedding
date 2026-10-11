import { useEffect, useState } from 'react'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'
import { smoothScrollTo } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { DeepOceanWebsite } from '../../../templates/websites/deep-ocean/DeepOceanWebsite'
import type { DeepOceanData, DeepOceanSectionConfig } from '../../../templates/websites/deep-ocean/content'

type PreviewState = { data?: DeepOceanData; sectionConfig?: DeepOceanSectionConfig }

export function DeepOceanPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState(stored?.data)
  const [sectionConfig, setSectionConfig] = useState(stored?.sectionConfig)

  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<PreviewState>(event.data)) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<DeepOceanSectionConfig['order'][number]>(event.data)) {
        smoothScrollTo(`[data-editor-section="${event.data.payload.sectionKey}"]`, { block: 'center' })
      }
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])

  return (
    <>
      <DeepOceanWebsite data={data} sectionConfig={sectionConfig} editorMode={editorMode} />
      {!editorMode ? <a className="do-preview-exit" href="/studio/site/themes">Đóng xem trước</a> : null}
    </>
  )
}

function readPreviewState(): PreviewState | null {
  try {
    return JSON.parse(sessionStorage.getItem('gmm-website-preview:deep-ocean') ?? 'null') as PreviewState | null
  } catch {
    return null
  }
}
