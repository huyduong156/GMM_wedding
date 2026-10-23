import { useEffect, useRef, useState } from 'react'
import type { ABeautifulDayMediaProjection } from './content'

export function ABeautifulDayGallery({ images, onError, editorMode, onOpenChange }: { images: ABeautifulDayMediaProjection[]; onError: (url: string) => void; editorMode: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const selected = images.findIndex((image) => image.id === selectedId)
  const image = images[selected]
  const opened = selectedId !== null && Boolean(image)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !opened) return
    onOpenChange(true)
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    dialog.querySelector<HTMLButtonElement>('.abd-lightbox__close')?.focus()
    return () => {
      onOpenChange(false)
      document.documentElement.style.overflow = previousOverflow
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
      const opener = openerRef.current
      if (opener?.isConnected) opener.focus({ preventScroll: true })
      else document.getElementById('abd-gallery-title')?.focus({ preventScroll: true })
    }
  }, [opened, onOpenChange])
  const step = (direction: number) => setSelectedId(images[(selected + direction + images.length) % images.length]?.id ?? null)
  return <>
    <p className="abd-gallery__hint" data-motion-variant="copy">Chọn một tấm ảnh để xem trọn khoảnh khắc.</p>
    <div className="abd-gallery__grid">
      {images.map((item, index) => <figure data-motion-variant="image" data-motion-order={index % 6} className={`abd-gallery__item abd-gallery__item--${(index % 3) + 1}`} key={item.id}>
        <button className="abd-gallery__open" type="button" aria-label={`Xem ảnh ${index + 1}: ${item.altText}`} disabled={editorMode} onClick={(event) => { openerRef.current = event.currentTarget; setSelectedId(item.id) }}>
          <img src={item.publicUrl} alt={item.altText ?? ''} loading="lazy" decoding="async" onError={() => onError(item.publicUrl)} />
          <span className="abd-gallery__expand" aria-hidden="true">↗</span>
        </button>
        <figcaption>Khoảnh khắc {String(index + 1).padStart(2, '0')}</figcaption>
      </figure>)}
    </div>
    <dialog ref={dialogRef} className="abd-lightbox" aria-label="Album ảnh cưới" onCancel={(event) => { event.preventDefault(); setSelectedId(null) }} onKeyDown={(event) => {
      if (event.key === 'Escape') { event.preventDefault(); setSelectedId(null) }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1) }
      if (event.key === 'Home') { event.preventDefault(); setSelectedId(images[0]?.id ?? null) }
      if (event.key === 'End') { event.preventDefault(); setSelectedId(images.at(-1)?.id ?? null) }
      if (event.key === 'Tab') {
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
        const first = buttons[0]; const last = buttons.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }} onClick={(event) => { if (event.target === event.currentTarget) setSelectedId(null) }}>
      <div className="abd-lightbox__surface" data-lenis-prevent>
        <div className="abd-lightbox__toolbar"><p aria-live="polite">{opened ? `${selected + 1} / ${images.length}` : ''}</p><button className="abd-lightbox__close" type="button" onClick={() => setSelectedId(null)} aria-label="Đóng album">Đóng <span aria-hidden="true">×</span></button></div>
        {opened ? <figure><img key={image.id} src={image.publicUrl} alt={image.altText ?? ''} onError={() => onError(image.publicUrl)} /><figcaption>{image.altText}</figcaption></figure> : null}
        <div className="abd-lightbox__controls"><button type="button" disabled={images.length < 2} onClick={() => step(-1)} aria-label="Ảnh trước">← <span>Ảnh trước</span></button><button type="button" disabled={images.length < 2} onClick={() => step(1)} aria-label="Ảnh tiếp theo"><span>Ảnh tiếp</span> →</button></div>
      </div>
    </dialog>
  </>
}
