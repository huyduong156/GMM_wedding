import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { searchFeatures, type SearchFeature } from '../model/feature-search'
import './feature-search.css'

export function FeatureSearch({ features }: { features: SearchFeature[] }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useNavigation()
  const dialogId = useId()
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === 'k' &&
        !event.isComposing
      ) {
        // Do not open over another modal (e.g. an editor confirmation).
        if (document.querySelector('dialog[open], [aria-modal="true"]')) return
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        className="command-search"
        type="button"
        aria-label="Tìm tính năng"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlass size={17} aria-hidden="true" />
        <span>Tìm tính năng</span>
        <kbd>{isMac ? '⌘ K' : 'Ctrl K'}</kbd>
      </button>
      {open ? (
        <FeatureSearchDialog
          id={dialogId}
          features={features}
          onClose={() => {
            setOpen(false)
            triggerRef.current?.focus()
          }}
        />
      ) : null}
    </>
  )
}

function FeatureSearchDialog({
  id,
  features,
  onClose,
}: {
  id: string
  features: SearchFeature[]
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const { navigate } = useNavigation()
  const results = searchFeatures(features, query)
  const activeIndex = Math.min(selected, Math.max(0, results.length - 1))
  const listId = `${id}-results`

  useEffect(() => {
    const dialog = dialogRef.current!
    dialog.showModal()
    inputRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView?.({ block: 'nearest' })
  }, [listId, activeIndex, query])

  function dismiss() {
    dialogRef.current?.close()
    onClose()
  }

  function choose(feature: SearchFeature) {
    dismiss()
    navigate(feature.to)
  }

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className="feature-search-dialog"
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault()
        dismiss()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss()
      }}
    >
      <div className="feature-search-panel">
        <header>
          <h2 id={`${id}-title`}>Tìm tính năng</h2>
          <button type="button" aria-label="Đóng tìm kiếm" onClick={dismiss}>
            <X size={18} />
          </button>
        </header>
        <div className="feature-search-input">
          <MagnifyingGlass size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Tên tính năng"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
            placeholder="Ví dụ: khách mời, công việc, RSVP…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelected(0)
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                if (results.length)
                  setSelected(
                    (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + results.length) %
                      results.length,
                  )
              } else if (event.key === 'Enter') {
                event.preventDefault()
                if (results[activeIndex]) choose(results[activeIndex])
              }
            }}
          />
        </div>
        <p className="feature-search-count" role="status">
          {results.length
            ? `${results.length} tính năng`
            : 'Không tìm thấy tính năng. Thử từ khóa khác.'}
        </p>
        <ul id={listId} role="listbox" aria-label="Kết quả tìm tính năng">
          {results.map((feature, index) => (
            <li
              key={feature.to}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(feature)}
            >
              <span>
                <strong>{feature.label}</strong>
                {feature.group ? <small>{feature.group}</small> : null}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </li>
          ))}
        </ul>
        <footer>↑ ↓ chọn · Enter mở · Esc đóng</footer>
      </div>
    </dialog>
  )
}
