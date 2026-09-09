import { useEffect, useState } from 'react'
import {
  isLiveEditorScroll,
  isLiveEditorUpdate,
  liveEditorEvents,
} from '../../../shared/lib/live-template-editor'
import {
  WoodlandLetterpressInvitation,
  type WoodlandLetterpressData,
} from '../../../templates/invitations/woodland-letterpress/WoodlandLetterpressInvitation'
import { woodlandLetterpressFixture } from '../../../templates/invitations/woodland-letterpress/fixture'
import { studioRoutes } from '../../../shared/config/routes'
import './woodland-letterpress-preview.css'

type SectionConfig = { enabled: string[]; order: string[] }
export function WoodlandLetterpressPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const [stored] = useState(readState)
  const [data, setData] = useState<WoodlandLetterpressData | undefined>(stored?.data)
  const [sectionConfig, setSectionConfig] = useState<SectionConfig | undefined>(
    stored?.sectionConfig,
  )
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (
        isLiveEditorUpdate<{ data: WoodlandLetterpressData; sectionConfig: SectionConfig }>(
          event.data,
        )
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
        <header className="woodland-preview-toolbar" aria-label="Tùy chọn xem trước">
          <div>
            <strong>Woodland Letterpress</strong>
            <span>Thiệp mời · Xem trước</span>
          </div>
          <a href={studioRoutes.inviteThemes} aria-label="Đóng xem trước">
            Đóng <span aria-hidden="true">×</span>
          </a>
        </header>
      ) : null}
      <WoodlandLetterpressInvitation
        data={data ?? woodlandLetterpressFixture}
        sectionConfig={sectionConfig}
        editorMode={editorMode}
      />
    </>
  )
}
function readState(): { data?: WoodlandLetterpressData; sectionConfig?: SectionConfig } | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-invitation-preview:woodland-letterpress') ?? 'null',
    ) as { data?: WoodlandLetterpressData; sectionConfig?: SectionConfig } | null
  } catch {
    return null
  }
}
