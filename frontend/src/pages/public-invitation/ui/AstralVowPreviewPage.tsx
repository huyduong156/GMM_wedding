import { useEffect, useState } from 'react'
import { AstralVowInvitation, type AstralVowData, type AstralVowSectionConfig } from '../../../templates/invitations/astral-vow/AstralVowInvitation'
import { astralVowFixture } from '../../../templates/invitations/astral-vow/fixture'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'

export function AstralVowPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const [data, setData] = useState<AstralVowData>(astralVowFixture)
  const [sectionConfig, setSectionConfig] = useState<AstralVowSectionConfig>()
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<{ data: AstralVowData; sectionConfig: AstralVowSectionConfig }>(event.data)) { setData(event.data.payload.data); setSectionConfig(event.data.payload.sectionConfig) }
      else if (isLiveEditorScroll<AstralVowSectionConfig['order'][number]>(event.data)) document.querySelector(`[data-editor-section="${event.data.payload.sectionKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener('message', receive); window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])
  return <><AstralVowInvitation data={data} sectionConfig={sectionConfig} editorMode={editorMode}/></>
}
