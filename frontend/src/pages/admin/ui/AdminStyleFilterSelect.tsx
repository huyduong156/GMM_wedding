import { CaretDown, Check, Tag } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { TemplateStyle } from '../../../shared/api/admin-template-styles'

export function AdminStyleFilterSelect({
  styles,
  value,
  onChange,
}: {
  styles: TemplateStyle[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = styles.find((style) => style.key === value)
  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  const choose = (nextValue: string) => {
    onChange(nextValue)
    setOpen(false)
  }
  return (
    <div ref={rootRef} className={`admin-style-filter ${open ? 'is-open' : ''}`}>
      <Tag size={16} aria-hidden="true" />
      <button
        type="button"
        className="admin-style-filter-trigger"
        aria-label="Lọc theo danh mục phong cách"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.name ?? 'Tất cả phong cách'}</span>
        <CaretDown size={15} aria-hidden="true" />
      </button>
      {open ? (
        <div className="admin-style-filter-menu" role="listbox" aria-label="Danh mục phong cách">
          <button
            type="button"
            role="option"
            aria-selected={!value}
            className={!value ? 'is-selected' : ''}
            onClick={() => choose('')}
          >
            <span>Tất cả phong cách</span>
            {!value ? <Check size={15} /> : null}
          </button>
          {styles.map((style) => (
            <button
              type="button"
              role="option"
              aria-selected={value === style.key}
              className={value === style.key ? 'is-selected' : ''}
              key={style.id}
              onClick={() => choose(style.key)}
            >
              <span>{style.name}</span>
              {value === style.key ? <Check size={15} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
