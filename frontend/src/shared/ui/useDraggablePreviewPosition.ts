import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type PreviewPosition = { x: number; y: number }

const initialPosition: PreviewPosition = { x: 0, y: 0 }

export function useDraggablePreviewPosition() {
  const [position, setPosition] = useState<PreviewPosition>(initialPosition)
  const positionRef = useRef(position)
  const suppressClickRef = useRef(false)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null)

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target
    if (window.matchMedia?.('(min-width: 768px)').matches) return
    if (!(target instanceof Element) || !target.closest('[data-preview-drag-handle]')) return
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: positionRef.current.x, originY: positionRef.current.y }
  }, [])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) suppressClickRef.current = true
    const next = { x: drag.originX + deltaX, y: drag.originY + deltaY }
    positionRef.current = next
    setPosition(next)
  }, [])

  const stopDragging = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }, [])

  const onClickCapture = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }, [])

  return {
    position,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp: stopDragging, onPointerCancel: stopDragging, onClickCapture },
    style: { transform: `translate3d(${position.x}px, ${position.y}px, 0)` },
  }
}
