import { useCallback, useEffect, useRef, useState } from 'react'

export const liveEditorEvents = {
  ready: 'GMM_LIVE_EDITOR_READY',
  hydrated: 'GMM_LIVE_EDITOR_HYDRATED',
  update: 'GMM_LIVE_EDITOR_UPDATE',
  scrollToSection: 'GMM_LIVE_EDITOR_SCROLL_TO_SECTION',
} as const

export type LiveEditorUpdateMessage<T> = { type: typeof liveEditorEvents.update; version: 1; payload: T }
export type LiveEditorScrollMessage<T extends string> = { type: typeof liveEditorEvents.scrollToSection; version: 1; payload: { sectionKey: T } }

export function isLiveEditorUpdate<T>(value: unknown): value is LiveEditorUpdateMessage<T> {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<LiveEditorUpdateMessage<T>>
  return message.type === liveEditorEvents.update && message.version === 1 && Boolean(message.payload)
}

export function isLiveEditorScroll<T extends string>(value: unknown): value is LiveEditorScrollMessage<T> {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<LiveEditorScrollMessage<T>>
  return message.type === liveEditorEvents.scrollToSection && message.version === 1 && typeof message.payload?.sectionKey === 'string'
}

export function useLiveEditorBridge<T, S extends string>(state: T) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const sendState = useCallback(() => {
    const message: LiveEditorUpdateMessage<T> = { type: liveEditorEvents.update, version: 1, payload: state }
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin)
  }, [state])
  const scrollToSection = useCallback((sectionKey: S) => {
    const message: LiveEditorScrollMessage<S> = { type: liveEditorEvents.scrollToSection, version: 1, payload: { sectionKey } }
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin)
  }, [])
  useEffect(() => { if (ready) sendState() }, [ready, sendState])
  useEffect(() => {
    const receiveReady = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow || event.data?.version !== 1) return
      if (event.data?.type === liveEditorEvents.ready) { setReady(true); setHydrated(false) }
      if (event.data?.type === liveEditorEvents.hydrated) setHydrated(true)
    }
    window.addEventListener('message', receiveReady)
    return () => window.removeEventListener('message', receiveReady)
  }, [])
  return { frameRef, ready, hydrated, sendState, scrollToSection }
}

export function useEditorSections<S extends string>(initial: S[], required: S[], canReorder: (section: S) => boolean = () => true) {
  const initialSectionRef = useRef(initial[0])
  const [selected, setSelected] = useState(initial[0])
  const [order, setOrder] = useState(initial)
  const [enabled, setEnabled] = useState(initial)
  const move = (key: S, step: -1 | 1) => setOrder((current) => {
    const from = current.indexOf(key); const to = from + step
    if (to < 0 || to >= current.length || !canReorder(key) || !canReorder(current[to])) return current
    const next = [...current]; [next[from], next[to]] = [next[to], next[from]]
    return next
  })
  const toggle = (key: S) => {
    if (required.includes(key)) return
    setEnabled((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
  }
  const reset = useCallback((nextOrder: S[], nextEnabled: S[]) => {
    setOrder(nextOrder); setEnabled(nextEnabled); setSelected(nextOrder[0] ?? initialSectionRef.current)
  }, [])
  return { selected, setSelected, order, enabled, move, toggle, reset }
}

export async function readEditorImages(files: FileList | null, currentCount: number, maxItems = 12, maxBytes = 5 * 1024 * 1024) {
  if (!files?.length) return { images: [] as string[], rejected: false }
  const accepted = [...files].filter((file) => file.type.startsWith('image/') && file.size <= maxBytes)
  const images = await Promise.all(accepted.slice(0, Math.max(0, maxItems - currentCount)).map((file) => new Promise<string>((resolve) => {
    const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file)
  })))
  return { images, rejected: accepted.length !== files.length }
}
