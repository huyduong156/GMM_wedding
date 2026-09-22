import { useEffect, useState } from 'react'
import { AureliaCourtRenderer } from '../../../templates/invitations/aurelia-court/AureliaCourtRenderer'
import type { AureliaCourtData, AureliaCourtSectionConfig } from '../../../templates/invitations/aurelia-court/AureliaCourtTypes'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'

export function AureliaCourtPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const [data, setData] = useState<AureliaCourtData>()
  const [sectionConfig, setSectionConfig] = useState<AureliaCourtSectionConfig>()
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<{ data: AureliaCourtData; palette: string; sectionConfig: AureliaCourtSectionConfig }>(event.data)) {
        setData(event.data.payload.data)
        setSectionConfig(event.data.payload.sectionConfig)
      } else if (isLiveEditorScroll(event.data)) {
        const target = document.querySelector(`[data-editor-section="${event.data.payload.sectionKey}"]`)
        if (target) {
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

  return <AureliaCourtRenderer data={data} sectionConfig={sectionConfig} editorMode={editorMode} />
}
