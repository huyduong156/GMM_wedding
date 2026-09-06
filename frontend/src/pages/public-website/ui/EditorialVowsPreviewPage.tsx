import { useEffect, useState } from 'react'
import { EditorialVowsWebsite } from '../../../templates/websites/editorial-vows/EditorialVowsWebsite'
import type {
  EditorialVowsData,
  EditorialVowsSectionConfig,
} from '../../../templates/websites/editorial-vows/content'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'

type PreviewState = { data?: EditorialVowsData; sectionConfig?: EditorialVowsSectionConfig }

export function EditorialVowsPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState(stored?.data),
    [sectionConfig, setSectionConfig] = useState(stored?.sectionConfig)
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (
        isLiveEditorUpdate<{ data: EditorialVowsData; sectionConfig: EditorialVowsSectionConfig }>(
          event.data,
        )
      ) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<EditorialVowsSectionConfig['order'][number]>(event.data))
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
      <EditorialVowsWebsite data={data} sectionConfig={sectionConfig} editorMode={editorMode} />
      {!editorMode ? (
        <a className="ev-preview-exit" href="/studio/site/themes">
          Đóng xem trước
        </a>
      ) : null}
    </>
  )
}

function readPreviewState(): PreviewState | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-website-preview:editorial-vows') ?? 'null',
    ) as PreviewState | null
  } catch {
    return null
  }
}
