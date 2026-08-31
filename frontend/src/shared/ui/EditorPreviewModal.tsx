import { ArrowsOut, Desktop, DeviceMobile, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type Ref } from 'react'
import { useDraggablePreviewPosition } from './useDraggablePreviewPosition'

export type EditorPreviewDevice = 'desktop' | 'mobile'

type Props = {
  frameRef: Ref<HTMLIFrameElement>
  route: string
  device: EditorPreviewDevice
  defaultDevice: EditorPreviewDevice
  ready: boolean
  templateKey: string | null
  title: string
  open: boolean
  onToggleOpen: () => void
  onDeviceChange: (device: EditorPreviewDevice) => void
  onLoad: () => void
  embedded?: boolean
}

const viewports = { desktop: { width: 1200, height: 800 }, mobile: { width: 550, height: 950 } } as const

export function EditorPreviewModal({ frameRef, route, device, defaultDevice, ready, templateKey, title, open, onToggleOpen, onDeviceChange, onLoad, embedded = false }: Props) {
  const draggable = useDraggablePreviewPosition()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [switching, setSwitching] = useState(false)
  const dimensions = viewports[device]

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof ResizeObserver === 'undefined') return
    const resize = () => setScale(viewport.clientWidth / dimensions.width)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [dimensions.width])

  const frameStyle = { width: dimensions.width, height: dimensions.height, transform: `scale(${scale})`, transformOrigin: 'top left' }
  const changeDevice = (next: EditorPreviewDevice) => {
    if (next === device) return
    setSwitching(true)
    onDeviceChange(next)
    window.setTimeout(() => setSwitching(false), 180)
  }
  const toggleOpen = () => { onDeviceChange(defaultDevice); onToggleOpen() }
  const deviceSwitch = <div className="editor-preview-device-switch" aria-label="Chọn thiết bị xem trước">
    <button type="button" className={device === 'desktop' ? 'is-active' : ''} aria-label="Xem desktop" aria-pressed={device === 'desktop'} onClick={() => changeDevice('desktop')}><Desktop /><span>Desktop</span></button>
    <button type="button" className={device === 'mobile' ? 'is-active' : ''} aria-label="Xem mobile" aria-pressed={device === 'mobile'} onClick={() => changeDevice('mobile')}><DeviceMobile /><span>Mobile</span></button>
  </div>
  const surface = <>
    {deviceSwitch}
    <div className={`editor-iframe-shell is-${device}`}>
      <div className="editor-browser-bar"><i /><i /><i /><span>{device === 'desktop' ? 'Desktop · 1200 × 800' : 'Mobile · 550 × 950'}</span></div>
      <div ref={viewportRef} className="editor-preview-viewport" style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}>
        {!ready ? <div className="editor-preview-loading" role="status"><span aria-hidden="true" /><strong>Đang tải bản xem trước…</strong><small>{templateKey ? `Đang chuẩn bị ${templateKey}` : 'Đang chuẩn bị giao diện'}</small></div> : null}
        {switching ? <div className="editor-preview-switching" role="status"><span aria-hidden="true" /><small>Đang chuyển chế độ xem…</small></div> : null}
        <iframe ref={frameRef} title={`${title} ${templateKey ?? 'đang chọn'}`} src={route} onLoad={onLoad} style={frameStyle} />
      </div>
    </div>
  </>
  if (embedded) return surface
  return <main className={`editor-iframe-canvas ${open ? 'is-mobile-preview-open' : ''}`} aria-label={title} style={open ? undefined : draggable.style} {...draggable.dragHandlers}>
    <button className="editor-mobile-preview-toggle" type="button" onClick={toggleOpen} aria-expanded={open}><span className="editor-preview-drag-handle" data-preview-drag-handle>{open ? <X /> : <ArrowsOut />}</span><span>{open ? 'Thu nhỏ' : `Xem ${defaultDevice === 'desktop' ? 'desktop' : 'mobile'}`}</span></button>
    {surface}
    <button className="editor-mobile-preview-hitbox" type="button" onClick={toggleOpen} aria-label={`Mở rộng ${title}`} />
  </main>
}
