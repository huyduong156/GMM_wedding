import { useEffect, useState } from 'react'
import {
  VanHyInvitation,
  type VanHyData,
  type VanHySectionConfig,
} from '../../../templates/invitations/van-hy/VanHyInvitation'
import { vanHyFixture } from '../../../templates/invitations/van-hy/fixture'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'

export function VanHyPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState<VanHyData>(stored?.data ?? vanHyFixture)
  const [sectionConfig, setSectionConfig] = useState<VanHySectionConfig | undefined>(
    stored?.sectionConfig,
  )

  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (
        isLiveEditorUpdate<{
          data: VanHyData
          palette: string
          sectionConfig: VanHySectionConfig
        }>(event.data)
      ) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<VanHySectionConfig['order'][number]>(event.data)) {
        document
          .querySelector(`[data-editor-section="${event.data.payload.sectionKey}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])

  return (
    <>
      {!editorMode ? (
        <aside className="template-preview-toolbar" aria-label="Tùy chọn xem trước">
          <div>
            <strong>Vạn Hỷ</strong>
            <span>Hỷ sự đỏ đô · v1.0</span>
          </div>
          <a href="/studio/invites/themes">Đóng xem trước</a>
        </aside>
      ) : null}
      <VanHyInvitation data={data} sectionConfig={sectionConfig} />
    </>
  )
}

function readPreviewState(): {
  data?: VanHyData
  sectionConfig?: VanHySectionConfig
} | null {
  try {
    return JSON.parse(sessionStorage.getItem('gmm-invitation-preview:van-hy') ?? 'null') as {
      data?: VanHyData
      sectionConfig?: VanHySectionConfig
    } | null
  } catch {
    return null
  }
}
