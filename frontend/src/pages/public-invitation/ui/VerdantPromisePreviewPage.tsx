import { useEffect, useState } from 'react'
import { VerdantPromiseInvitation } from '../../../templates/invitations/verdant-promise/VerdantPromiseInvitation'
import type {
  ModernLuxeData,
  ModernLuxeSectionConfig,
} from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { isModernLuxeEditorMessage } from '../../../templates/invitations/modern-luxe/editor-message'
import { isLiveEditorScroll, liveEditorEvents } from '../../../shared/lib/live-template-editor'

export function VerdantPromisePreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState<{
    data?: ModernLuxeData
    sectionConfig?: ModernLuxeSectionConfig
  }>()
  const [data, setData] = useState<ModernLuxeData | undefined>(stored?.data)
  const [sectionConfig, setSectionConfig] = useState<ModernLuxeSectionConfig | undefined>(
    stored?.sectionConfig,
  )
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isModernLuxeEditorMessage(event.data)) {
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
        <aside className="vp-toolbar" aria-label="Tùy chọn xem trước">
          <div>
            <strong>Verdant Promise</strong>
            <span>Botanical invitation · v1.3</span>
          </div>
          <a href="/studio/invites/themes">Đóng xem trước</a>
        </aside>
      ) : null}
      <VerdantPromiseInvitation preview={!editorMode} data={data} sectionConfig={sectionConfig} />
    </>
  )
}

function readPreviewState<T>(): T | null {
  try {
    return JSON.parse(
      sessionStorage.getItem('gmm-invitation-preview:verdant-promise') ?? 'null',
    ) as T | null
  } catch {
    return null
  }
}
