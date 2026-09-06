import { useEffect, useState } from 'react'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'
import {
  ChibiDaydreamInvitation,
  type ChibiDaydreamData,
} from '../../../templates/invitations/chibi-daydream/ChibiDaydreamInvitation'

export function ChibiDaydreamPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState<ChibiDaydreamData | undefined>(stored?.data)
  const [sectionConfig, setSectionConfig] = useState<
    { enabled: string[]; order: string[] } | undefined
  >(stored?.sectionConfig)
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (
        isLiveEditorUpdate<{
          data: ChibiDaydreamData
          sectionConfig: { enabled: string[]; order: string[] }
        }>(event.data)
      ) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<string>(event.data))
        document
          .querySelector(`[data-editor-section="${event.data.payload.sectionKey}"]`)
          ?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])
  return (
    <>
      {!editorMode ? (
        <aside className="cd-preview-toolbar" aria-label="Tùy chọn xem trước">
          <div>
            <strong>Mây Hồng Có Đôi</strong>
            <span>Chibi storybook · v1.1</span>
          </div>
          <a href="/studio/invites/themes">Đóng xem trước</a>
        </aside>
      ) : null}
      <ChibiDaydreamInvitation data={data} sectionConfig={sectionConfig} editorMode={editorMode} />
    </>
  )
}

function readPreviewState(): {
  data?: ChibiDaydreamData
  sectionConfig?: { enabled: string[]; order: string[] }
} | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-invitation-preview:chibi-daydream') ?? 'null',
    ) as { data?: ChibiDaydreamData; sectionConfig?: { enabled: string[]; order: string[] } } | null
  } catch {
    return null
  }
}
