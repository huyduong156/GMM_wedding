import { useEffect, useState } from 'react'
import {
  ModernLuxeInvitation,
  type ModernLuxeData,
  type ModernLuxePalette,
  type ModernLuxeSectionConfig,
} from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { isModernLuxeEditorMessage } from '../../../templates/invitations/modern-luxe/editor-message'
import { isLiveEditorScroll, liveEditorEvents } from '../../../shared/lib/live-template-editor'

const palettes: Array<{ key: ModernLuxePalette; label: string }> = [
  { key: 'champagne', label: 'Champagne' },
  { key: 'midnight', label: 'Midnight' },
  { key: 'sage', label: 'Sage' },
]

export function ModernLuxePreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const stored = readPreviewState<{
    data?: ModernLuxeData
    palette?: ModernLuxePalette
    sectionConfig?: ModernLuxeSectionConfig
  }>('modern-luxe')
  const [palette, setPalette] = useState<ModernLuxePalette>(stored?.palette ?? 'champagne')
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
        setPalette(event.data.payload.palette)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll<ModernLuxeSectionConfig['order'][number]>(event.data)) {
        const target = document.querySelector(
          `[data-editor-section="${event.data.payload.sectionKey}"]`,
        )
        if (target) {
          if (event.data.payload.sectionKey === 'footer')
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          else
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY,
              behavior: 'smooth',
            })
        }
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
            <strong>Élan d’Amour</strong>
            <span>Couture 2.5D invitation · v2.3</span>
          </div>
          <div role="group" aria-label="Chọn bảng màu">
            {palettes.map((item) => (
              <button
                key={item.key}
                className={palette === item.key ? 'is-active' : ''}
                aria-pressed={palette === item.key}
                onClick={() => setPalette(item.key)}
              >
                <i className={`palette-dot ${item.key}`} />
                {item.label}
              </button>
            ))}
          </div>
          <a href="/studio/invites/themes">Đóng xem trước</a>
        </aside>
      ) : null}
      <ModernLuxeInvitation
        data={data}
        palette={palette}
        preview={!editorMode}
        editorMode={editorMode}
        sectionConfig={sectionConfig}
      />
    </>
  )
}

function readPreviewState<T>(key: string): T | null {
  try {
    return JSON.parse(sessionStorage.getItem(`gmm-invitation-preview:${key}`) ?? 'null') as T | null
  } catch {
    return null
  }
}
