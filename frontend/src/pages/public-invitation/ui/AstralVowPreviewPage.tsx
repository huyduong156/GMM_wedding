import { useEffect, useState } from 'react'
import { AstralVowInvitation, type AstralVowData, type AstralVowSectionConfig } from '../../../templates/invitations/astral-vow/AstralVowInvitation'
import { astralVowFixture } from '../../../templates/invitations/astral-vow/fixture'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'
import { smoothScrollTo } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { weddingApi } from '../../../shared/api/weddings'

export function AstralVowPreviewPage() {
  const params = new URLSearchParams(window.location.search)
  const editorMode = params.get('editor') === '1'
  const weddingId = params.get('weddingId')
  const [data, setData] = useState<AstralVowData>(astralVowFixture)
  const [sectionConfig, setSectionConfig] = useState<AstralVowSectionConfig | undefined>()
  useEffect(() => {
    if (editorMode || !weddingId) return
    let active = true
    void weddingApi.content(weddingId, 'ONLINE_INVITATION').then(({ content }) => {
      if (!active) return
      setData(content.content as AstralVowData)
      setSectionConfig(content.sectionConfig as AstralVowSectionConfig)
    })
    return () => {
      active = false
    }
  }, [editorMode, weddingId])
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<{ data: AstralVowData; sectionConfig: AstralVowSectionConfig }>(event.data)) { setData(event.data.payload.data); setSectionConfig(event.data.payload.sectionConfig) }
      else if (isLiveEditorScroll<AstralVowSectionConfig['order'][number]>(event.data)) smoothScrollTo(`[data-editor-section="${event.data.payload.sectionKey}"]`, { block: 'start' })
    }
    window.addEventListener('message', receive); window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])
  return <><AstralVowInvitation data={data} sectionConfig={sectionConfig} editorMode={editorMode}/></>
}
