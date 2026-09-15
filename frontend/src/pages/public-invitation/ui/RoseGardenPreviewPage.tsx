import { useEffect, useState } from 'react'
import {
  RoseGardenInvitation,
  type RoseGardenData,
  type RoseGardenSectionConfig,
} from '../../../templates/invitations/rose-garden/RoseGardenInvitation'
import { roseGardenFixture } from '../../../templates/invitations/rose-garden/fixture'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'

export function RoseGardenPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState<RoseGardenData>(stored?.data ?? roseGardenFixture)
  const [sectionConfig, setSectionConfig] = useState<RoseGardenSectionConfig | undefined>(stored?.sectionConfig)

  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<{ data: RoseGardenData; sectionConfig: RoseGardenSectionConfig }>(event.data)) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<RoseGardenSectionConfig['order'][number]>(event.data)) {
        document.querySelector(`[data-editor-section="${event.data.payload.sectionKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])

  return (
    <>
      {!editorMode ? (
        <aside className="rg-preview-toolbar" aria-label="Tùy chọn xem trước">
          <div><strong>Rose Garden</strong><span>Botanical couture invitation · Phase 3</span></div>
          <a href="/studio/invites/themes">Đóng xem trước</a>
        </aside>
      ) : null}
      <RoseGardenInvitation data={data} sectionConfig={sectionConfig} editorMode={editorMode} />
    </>
  )
}

function readPreviewState(): { data?: RoseGardenData; sectionConfig?: RoseGardenSectionConfig } | null {
  try {
    return JSON.parse(sessionStorage.getItem('gmm-invitation-preview:rose-garden') ?? 'null') as {
      data?: RoseGardenData
      sectionConfig?: RoseGardenSectionConfig
    } | null
  } catch {
    return null
  }
}
