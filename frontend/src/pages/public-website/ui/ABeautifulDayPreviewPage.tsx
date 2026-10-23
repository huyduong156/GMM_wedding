import { useEffect, useState } from 'react'
import { ABeautifulDayWebsite } from '../../../templates/websites/a-beautiful-day/ABeautifulDayWebsite'
import type { ABeautifulDaySectionConfig } from '../../../templates/websites/a-beautiful-day/content'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'
import { aBeautifulDayRenderData } from './a-beautiful-day-render-data'

type State = { data?: Record<string, unknown>; events?: unknown[]; themeConfig?: { motionLevel?: string }; sectionConfig?: ABeautifulDaySectionConfig }
export function ABeautifulDayPreviewPage() {
  const editorMode = new URLSearchParams(window.location.search).get('editor') === '1'
  const [state, setState] = useState<State | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('gmm-website-preview:a-beautiful-day') ?? 'null') as State | null } catch { return null }
  })
  useEffect(() => {
    if (!editorMode) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<State>(event.data)) setState(event.data.payload)
      else if (isLiveEditorScroll<string>(event.data)) {
        const target = [...document.querySelectorAll<HTMLElement>('[data-editor-section]')].find(element => element.dataset.editorSection === event.data.payload.sectionKey)
        target?.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [editorMode])
  useEffect(() => {
    if (editorMode && state) window.parent.postMessage({ type: liveEditorEvents.hydrated, version: 1 }, window.location.origin)
  }, [editorMode, state])
  if (editorMode && !state) return null
  return <ABeautifulDayWebsite data={state?.data ? aBeautifulDayRenderData({ content: state.data, events: state.events }) : undefined} sectionConfig={state?.sectionConfig} themeConfig={state?.themeConfig} editorMode={editorMode} />
}
