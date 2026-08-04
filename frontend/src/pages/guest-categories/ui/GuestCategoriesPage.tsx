import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  CaretDown,
  CaretRight,
  DotsThree,
  FolderSimple,
  Plus,
  TreeStructure,
  UsersThree,
  X,
} from '@phosphor-icons/react'

type Category = {
  id: number
  name: string
  parentId: number | null
  depth: 1 | 2 | 3
  guestCount: number
}

const initialCategories: Category[] = [
  { id: 1, name: 'Nhà trai', parentId: null, depth: 1, guestCount: 46 },
  { id: 2, name: 'Gia đình', parentId: 1, depth: 2, guestCount: 24 },
  { id: 3, name: 'Họ nội', parentId: 2, depth: 3, guestCount: 14 },
  { id: 4, name: 'Họ ngoại', parentId: 2, depth: 3, guestCount: 10 },
  { id: 5, name: 'Bạn bè', parentId: 1, depth: 2, guestCount: 22 },
  { id: 6, name: 'Nhà gái', parentId: null, depth: 1, guestCount: 52 },
  { id: 7, name: 'Gia đình', parentId: 6, depth: 2, guestCount: 28 },
  { id: 8, name: 'Bạn bè', parentId: 6, depth: 2, guestCount: 16 },
  { id: 9, name: 'Đồng nghiệp', parentId: 6, depth: 2, guestCount: 8 },
  { id: 10, name: 'Khách chung', parentId: null, depth: 1, guestCount: 22 },
]

export function GuestCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [expanded, setExpanded] = useState(() => new Set([1, 2, 6]))
  const [parentForNew, setParentForNew] = useState<Category | null | undefined>(undefined)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const roots = useMemo(() => categories.filter((category) => category.parentId === null), [categories])
  const childrenOf = (parentId: number) => categories.filter((category) => category.parentId === parentId)

  const toggle = (id: number) => setExpanded((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const openCreate = (parent: Category | null) => {
    setParentForNew(parent)
    setName('')
    setError('')
  }

  const createCategory = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Nhập tên danh mục để tiếp tục.')
      return
    }
    const depth = parentForNew ? parentForNew.depth + 1 : 1
    if (depth > 3) {
      setError('Danh mục chỉ được tối đa 3 cấp.')
      return
    }
    const id = Math.max(...categories.map((category) => category.id)) + 1
    setCategories((current) => [...current, { id, name: trimmedName, parentId: parentForNew?.id ?? null, depth: depth as 1 | 2 | 3, guestCount: 0 }])
    if (parentForNew) setExpanded((current) => new Set(current).add(parentForNew.id))
    setParentForNew(undefined)
  }

  const renderCategory = (category: Category) => {
    const children = childrenOf(category.id)
    const isExpanded = expanded.has(category.id)
    return <li key={category.id}>
      <div className="category-row" style={{ '--category-depth': category.depth } as CSSProperties}>
        <button className="category-toggle" type="button" onClick={() => toggle(category.id)} aria-label={`${isExpanded ? 'Thu gọn' : 'Mở rộng'} ${category.name}`} aria-expanded={isExpanded} disabled={!children.length}>
          {children.length ? isExpanded ? <CaretDown size={15} /> : <CaretRight size={15} /> : <span />}
        </button>
        <span className="category-folder" aria-hidden="true"><FolderSimple size={18} weight={children.length && isExpanded ? 'fill' : 'regular'} /></span>
        <div className="category-copy"><strong>{category.name}</strong><span>Cấp {category.depth}</span></div>
        <span className="category-count"><UsersThree size={14} /> {category.guestCount} khách</span>
        {category.depth < 3 ? <button className="category-add-child" type="button" onClick={() => openCreate(category)}><Plus size={14} /> Thêm cấp con</button> : <span className="category-limit">Cấp cuối</span>}
        <button className="row-menu" type="button" aria-label={`Tùy chọn danh mục ${category.name}`}><DotsThree size={18} weight="bold" /></button>
      </div>
      {children.length && isExpanded ? <ul>{children.map(renderCategory)}</ul> : null}
    </li>
  }

  return (
    <section className="categories-page" aria-labelledby="categories-heading">
      <header className="categories-heading">
        <div><p className="breadcrumb">Mai & Đức <span>/</span> Khách mời <span>/</span> Danh mục</p><h1 id="categories-heading">Danh mục khách mời</h1><p>Tổ chức khách theo cây danh mục tối đa 3 cấp để lọc và gửi thiệp thuận tiện hơn.</p></div>
        <button className="button button-primary" type="button" onClick={() => openCreate(null)}><Plus size={17} /> Thêm danh mục</button>
      </header>

      <div className="category-summary" aria-label="Tổng quan danh mục">
        <div><TreeStructure size={19} /><span><strong>{categories.length}</strong> danh mục</span></div>
        <p><strong>3 cấp tối đa</strong><span>Cấp 1: phía gia đình · Cấp 2: nhóm quan hệ · Cấp 3: nhánh chi tiết</span></p>
      </div>

      <div className="panel category-tree-panel">
        <header><div><h2>Cây danh mục</h2><p>Số khách ở danh mục cha bao gồm khách thuộc các danh mục con.</p></div><span>{roots.length} danh mục gốc</span></header>
        <ul className="category-tree">{roots.map(renderCategory)}</ul>
      </div>

      {parentForNew !== undefined ? <div className="category-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setParentForNew(undefined) }}>
        <section className="category-dialog" role="dialog" aria-modal="true" aria-labelledby="new-category-title">
          <header><div><h2 id="new-category-title">{parentForNew ? 'Thêm danh mục con' : 'Thêm danh mục gốc'}</h2><p>{parentForNew ? `Nằm trong “${parentForNew.name}” · Cấp ${parentForNew.depth + 1}` : 'Danh mục cấp 1'}</p></div><button type="button" onClick={() => setParentForNew(undefined)} aria-label="Đóng"><X size={18} /></button></header>
          <label htmlFor="category-name">Tên danh mục</label>
          <input id="category-name" autoFocus value={name} onChange={(event) => { setName(event.target.value); setError('') }} placeholder="Ví dụ: Họ nội, Bạn đại học" aria-invalid={Boolean(error)} aria-describedby={error ? 'category-error' : 'category-helper'} onKeyDown={(event) => { if (event.key === 'Enter') createCategory(); if (event.key === 'Escape') setParentForNew(undefined) }} />
          {error ? <p className="field-error" id="category-error">{error}</p> : <p className="field-helper" id="category-helper">Bạn có thể đổi tên hoặc di chuyển danh mục sau.</p>}
          <footer><button className="button button-secondary" type="button" onClick={() => setParentForNew(undefined)}>Hủy</button><button className="button button-primary" type="button" onClick={createCategory}>Tạo danh mục</button></footer>
        </section>
      </div> : null}
    </section>
  )
}
