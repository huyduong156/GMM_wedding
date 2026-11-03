import { useEffect, useState } from 'react'
import { ForeverWebsite } from '../../../templates/websites/forever/ForeverWebsite'
import type { ForeverData, ForeverSectionConfig } from '../../../templates/websites/forever/content'
import { foreverFixture, foreverSections } from '../../../templates/websites/forever/fixture'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'
import { smoothScrollTo } from '../../../shared/lib/navigation/useSmoothInvitationScroll'

type PreviewState = { data?: ForeverData; sectionConfig?: ForeverSectionConfig }
export function ForeverPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const [state, setState] = useState<PreviewState>(() => readState() ?? {})
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<PreviewState>(event.data)) setState(event.data.payload)
      else if (isLiveEditorScroll<ForeverSectionConfig['order'][number]>(event.data)) smoothScrollTo(`[data-editor-section="${event.data.payload.sectionKey}"]`, { block: 'center' })
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])
  return <><ForeverWebsite data={state.data ?? foreverFixture} sectionConfig={state.sectionConfig ?? foreverSections} editorMode={editorMode} />{!editorMode ? <a className="ff-preview-exit" href="/studio/site/themes">Đóng xem trước</a> : null}</>
}
function readState(): PreviewState | null {
  try { return JSON.parse(sessionStorage.getItem('gmm-website-preview:forever') ?? 'null') as PreviewState | null } catch { return null }
}
