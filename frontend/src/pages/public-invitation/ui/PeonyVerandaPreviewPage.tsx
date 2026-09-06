import { useEffect, useState } from 'react'
import {
  PeonyVerandaInvitation,
  type PeonyVerandaData,
  type PeonyVerandaSectionConfig,
} from '../../../templates/invitations/peony-veranda/PeonyVerandaInvitation'
import { peonyVerandaFixture } from '../../../templates/invitations/peony-veranda/fixture'
import { isLiveEditorScroll, liveEditorEvents } from '../../../shared/lib/live-template-editor'

export function PeonyVerandaPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState()
  const [data, setData] = useState<PeonyVerandaData>(stored?.data ?? peonyVerandaFixture)
  const [sectionConfig, setSectionConfig] = useState<PeonyVerandaSectionConfig | undefined>(
    stored?.sectionConfig,
  )

  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (event.data?.type === liveEditorEvents.update && event.data?.payload?.data) {
        setData(event.data.payload.data as PeonyVerandaData)
        setSectionConfig(event.data.payload.sectionConfig as PeonyVerandaSectionConfig | undefined)
      } else if (isLiveEditorScroll<string>(event.data)) {
        const target = document.querySelector(
          `[data-editor-section="${event.data.payload.sectionKey}"]`,
        )
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])

  return (
    <>
      {!editorMode ? (
        <aside className="pv-preview-toolbar" aria-label="Tùy chọn xem trước">
          <div>
            <strong>Peony Veranda</strong>
            <span>Peony botanical invitation · v0.1</span>
          </div>
          <a href="/studio/invites/themes">Đóng xem trước</a>
        </aside>
      ) : null}
      <PeonyVerandaInvitation editorMode={editorMode} data={data} sectionConfig={sectionConfig} />
    </>
  )
}

function readPreviewState(): {
  data?: PeonyVerandaData
  sectionConfig?: PeonyVerandaSectionConfig
} | null {
  try {
    return JSON.parse(sessionStorage.getItem('gmm-invitation-preview:peony-veranda') ?? 'null') as {
      data?: PeonyVerandaData
      sectionConfig?: PeonyVerandaSectionConfig
    } | null
  } catch {
    return null
  }
}
