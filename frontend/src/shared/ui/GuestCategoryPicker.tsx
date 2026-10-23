import { Check, FolderSimple, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import type { GuestCategory } from '../api/weddings'

type GuestCategoryPickerProps = {
  categories: GuestCategory[]
  value: string
  onChange: (categoryId: string) => void
  emptyValueLabel: string
  title: string
  description: string
  ariaLabel: string
  className?: string
  disabled?: boolean
  emptyValueSelectable?: boolean
  actionOptions?: Array<{ value: string; label: string }>
}

const sides = [
  { key: 'GROOM', label: 'Nhà trai' },
  { key: 'BRIDE', label: 'Nhà gái' },
  { key: '', label: 'Chung' },
] as const

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')
    .trim()

export function GuestCategoryPicker({
  categories,
  value,
  onChange,
  emptyValueLabel,
  title,
  description,
  ariaLabel,
  className = '',
  disabled = false,
  emptyValueSelectable = true,
  actionOptions = [],
}: GuestCategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selected = categories.find((category) => category.id === value)
  const selectedPath = useMemo(() => {
    if (!selected) return emptyValueLabel
    const names = [selected.name]
    let parentId = selected.parentId
    while (parentId) {
      const parent = categories.find((category) => category.id === parentId)
      if (!parent) break
      names.unshift(parent.name)
      parentId = parent.parentId
    }
    return names.join(' / ')
  }, [categories, emptyValueLabel, selected])

  const childrenOf = (parentId: string | null) =>
    categories.filter((category) => category.parentId === parentId)
  const categoryPath = (category: GuestCategory) => {
    const names = [category.name]
    let parentId = category.parentId
    while (parentId) {
      const parent = categories.find((candidate) => candidate.id === parentId)
      if (!parent) break
      names.unshift(parent.name)
      parentId = parent.parentId
    }
    return names.join(' / ')
  }
  const search = normalize(query)
  const matchesTree = (category: GuestCategory): boolean => {
    if (!search) return true
    return (
      normalize(categoryPath(category)).includes(search) ||
      childrenOf(category.id).some(matchesTree)
    )
  }

  const close = () => {
    setOpen(false)
    setQuery('')
  }
  const select = (categoryId: string) => {
    onChange(categoryId)
    close()
  }
  const renderCategory = (category: GuestCategory): JSX.Element => {
    const selfMatches = normalize(categoryPath(category)).includes(search)
    const children = childrenOf(category.id).filter(
      (child) => !search || selfMatches || matchesTree(child),
    )
    return (
      <li key={category.id}>
        <button
          type="button"
          className={`guest-category-picker-row${value === category.id ? ' is-selected' : ''}`}
          style={{ '--category-depth': category.depth } as React.CSSProperties}
          onClick={() => select(category.id)}
          aria-current={value === category.id ? 'true' : undefined}
        >
          <FolderSimple size={18} weight={value === category.id ? 'fill' : 'regular'} />
          <span className="guest-category-picker-copy">
            <strong>{category.name}</strong>
            <small>
              Cấp {category.depth} · {categoryPath(category)}
            </small>
          </span>
          {value === category.id ? <Check size={17} aria-label="Đang chọn" /> : null}
        </button>
        {children.length ? <ul>{children.map(renderCategory)}</ul> : null}
      </li>
    )
  }

  return (
    <>
      <button
        type="button"
        className={`guest-category-picker-trigger ${className}`.trim()}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <span>{selectedPath}</span>
        <span className="guest-category-picker-trigger-action">Chọn nhóm</span>
      </button>
      {open ? (
        <div
          className="category-dialog-backdrop guest-category-picker-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
          onKeyDown={(event) => {
            event.stopPropagation()
            if (event.key === 'Escape') close()
          }}
        >
          <section
            className="category-dialog guest-category-picker-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-category-picker-title"
          >
            <header>
              <div>
                <h2 id="guest-category-picker-title">{title}</h2>
                <p>{description}</p>
              </div>
              <button type="button" onClick={close} aria-label="Đóng">
                <X size={18} />
              </button>
            </header>
            <label className="guest-category-picker-search">
              <MagnifyingGlass size={17} aria-hidden="true" />
              <span className="sr-only">Tìm nhóm khách</span>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên nhóm…"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Xóa nội dung tìm kiếm"
                >
                  <X size={15} />
                </button>
              ) : null}
            </label>
            <div className="guest-category-picker-options">
              {emptyValueSelectable ? (
                <button
                  type="button"
                  className={`guest-category-picker-empty${value ? '' : ' is-selected'}`}
                  onClick={() => select('')}
                >
                  <span>{emptyValueLabel}</span>
                  {!value ? <Check size={17} /> : null}
                </button>
              ) : (
                <div className="guest-category-picker-empty is-placeholder" aria-disabled="true">
                  <span>{emptyValueLabel}</span>
                </div>
              )}
              {actionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="guest-category-picker-empty guest-category-picker-action"
                  disabled={disabled}
                  onClick={() => select(option.value)}
                >
                  <span>{option.label}</span>
                </button>
              ))}
              {sides.map(({ key, label }) => {
                const roots = childrenOf(null).filter(
                  (category) => (category.familySide ?? '') === key && matchesTree(category),
                )
                if (!roots.length) return null
                return (
                  <section className="category-family-block" key={label}>
                    <header className="category-family-block-header">
                      <div>
                        <h3>{label}</h3>
                        <span>{roots.length} nhóm gốc</span>
                      </div>
                    </header>
                    <ul className="category-tree category-card-tree guest-category-picker-tree">
                      {roots.map(renderCategory)}
                    </ul>
                  </section>
                )
              })}
              {categories.length === 0 ? (
                <p className="guest-category-picker-no-results">Chưa có nhóm khách nào.</p>
              ) : null}
              {categories.length > 0 &&
              !sides.some(({ key }) =>
                childrenOf(null).some(
                  (category) => (category.familySide ?? '') === key && matchesTree(category),
                ),
              ) ? (
                <p className="guest-category-picker-no-results">
                  Không tìm thấy nhóm khách phù hợp.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
