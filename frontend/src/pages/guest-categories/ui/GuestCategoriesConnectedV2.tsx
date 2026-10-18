import { notifications } from '../../../shared/ui/notifications/notifications'
import { ModalSavingStatus } from '../../../shared/ui/ModalSavingStatus'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CaretDown,
  CaretRight,
  FolderSimple,
  Plus,
  TreeStructure,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import {
  guestApi,
  guestCategoryApi,
  type GuestCategory,
  type Wedding,
} from '../../../shared/api/weddings'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { GuestCategoriesPage } from './GuestCategoriesPage'

const alertError = (text: string) =>
  notifications.fire({
    icon: 'error',
    title: 'Không thể thực hiện',
    text,
    confirmButtonText: 'Đã hiểu',
  })
const alertSuccess = (text: string) =>
  notifications.fire({
    icon: 'success',
    title: 'Đã cập nhật',
    text,
    timer: 900,
    timerProgressBar: true,
    showConfirmButton: false,
  })

export function GuestCategoriesConnectedV2() {
  const workspace = useOptionalWeddingWorkspace()
  if (!workspace) return <GuestCategoriesPage />
  return (
    <GuestCategoriesContent
      activeWedding={workspace.activeWedding}
      canEdit={workspace.activeRole === 'OWNER' || workspace.activeRole === 'EDITOR'}
    />
  )
}

function GuestCategoriesContent({
  activeWedding,
  canEdit,
}: {
  activeWedding: Wedding | null
  canEdit: boolean
}) {
  const [items, setItems] = useState<GuestCategory[]>([])
  const [totalGuestCount, setTotalGuestCount] = useState(0)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [parent, setParent] = useState<GuestCategory | null | undefined>(undefined)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [familySide, setFamilySide] = useState<'' | 'BRIDE' | 'GROOM'>('')

  const weddingId = activeWedding?.id
  const load = useCallback(async () => {
    if (!weddingId) return
    setLoading(true)
    setError('')
    try {
      const [result, guestResult] = await Promise.all([
        guestCategoryApi.list(weddingId),
        guestApi.list(weddingId, { limit: 1 }),
      ])
      setItems(result.items)
      setTotalGuestCount(guestResult.total)
      setExpanded(new Set(result.items.filter((item) => item.depth < 3).map((item) => item.id)))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải nhóm khách.')
    } finally {
      setLoading(false)
    }
  }, [weddingId])
  useEffect(() => {
    void load()
  }, [load])

  const roots = useMemo(() => items.filter((item) => item.parentId === null), [items])
  const childrenOf = (id: string) => items.filter((item) => item.parentId === id)
  const categoryFamilySide = (item: GuestCategory) => {
    let current = item
    while (current.parentId) {
      const parentCategory = items.find((candidate) => candidate.id === current.parentId)
      if (!parentCategory) break
      current = parentCategory
    }
    return current.familySide ?? null
  }
  const categoryPath = (item: GuestCategory) => {
    const names = [item.name]
    let parentId = item.parentId
    while (parentId) {
      const parent = items.find((candidate) => candidate.id === parentId)
      if (!parent) break
      names.unshift(parent.name)
      parentId = parent.parentId
    }
    return names.join(' / ')
  }
  const closeDialog = () => {
    setParent(undefined)
    setName('')
    setFamilySide('')
    setError('')
  }
  const openCreate = (value: GuestCategory | null, side: '' | 'BRIDE' | 'GROOM' = '') => {
    if (!canEdit) return
    setParent(value)
    setName('')
    setFamilySide(side || (value ? categoryFamilySide(value) : '') || '')
    setError('')
  }
  const create = async () => {
    if (!canEdit || !activeWedding || !name.trim()) return
    if ((parent?.depth ?? 0) >= 3) {
      setError('Nhóm khách chỉ được tối đa 3 cấp.')
      return
    }
    setBusy(true)
    try {
      await guestCategoryApi.create(activeWedding.id, {
        name: name.trim(),
        ...(parent ? { parentId: parent.id } : {}),
        familySide: familySide || null,
      })
      closeDialog()
      await load()
      await alertSuccess('Nhóm khách đã được thêm vào cây.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tạo nhóm khách.')
    } finally {
      setBusy(false)
    }
  }
  const remove = async () => {
    if (!canEdit || !activeWedding || !selected.length) return
    const result = await notifications.fire({
      icon: 'warning',
      title: 'Xóa nhóm khách?',
      text: `${selected.length} nhóm khách sẽ được xóa. Nhóm con sẽ trở thành nhóm gốc.`,
      showCancelButton: true,
      confirmButtonText: 'Xóa nhóm khách',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#a43d34',
    })
    if (!result.isConfirmed) return
    setBusy(true)
    try {
      await guestCategoryApi.removeMany(activeWedding.id, selected)
      setSelected([])
      await load()
      await alertSuccess('Nhóm khách đã được xóa.')
    } catch (cause) {
      await alertError(cause instanceof Error ? cause.message : 'Không thể xóa nhóm khách.')
    } finally {
      setBusy(false)
    }
  }
  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const render = (item: GuestCategory): JSX.Element => {
    const nested = childrenOf(item.id)
    const isOpen = expanded.has(item.id)
    return (
      <li key={item.id}>
        <div
          className={`category-card-row ${canEdit ? '' : 'is-read-only'}`}
          style={{ '--category-depth': item.depth } as React.CSSProperties}
        >
          <button
            className="category-toggle"
            type="button"
            disabled={!nested.length}
            onClick={() => toggle(item.id)}
            aria-label={`${isOpen ? 'Thu gọn' : 'Mở rộng'} ${item.name}`}
          >
            {nested.length ? isOpen ? <CaretDown size={15} /> : <CaretRight size={15} /> : <span />}
          </button>
          {canEdit ? (
            <input
              className="guest-checkbox"
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() =>
                setSelected((current) =>
                  current.includes(item.id)
                    ? current.filter((id) => id !== item.id)
                    : [...current, item.id],
                )
              }
              aria-label={`Chọn ${item.name}`}
            />
          ) : null}
          <span className="category-folder">
            <FolderSimple size={18} weight={isOpen ? 'fill' : 'regular'} />
          </span>
          <div className="category-card-copy">
            <strong>{item.name}</strong>
            <span>
              Cấp {item.depth} · {item.guestCount ?? 0} khách
            </span>
            <small className="category-parent-path">{categoryPath(item)}</small>
          </div>
          {canEdit && item.depth < 3 && (
            <button className="category-add-child" type="button" onClick={() => openCreate(item)}>
              <Plus size={14} /> <span>Thêm cấp con</span>
            </button>
          )}
        </div>
        {nested.length && isOpen ? <ul>{nested.map(render)}</ul> : null}
      </li>
    )
  }

  return (
    <section className="categories-page" aria-labelledby="categories-heading">
      <header className="categories-heading">
        <div>
          <p className="breadcrumb">
            Đám cưới <span>/</span> Khách mời <span>/</span> Nhóm khách
          </p>
          <h1 id="categories-heading">Nhóm khách mời</h1>
          <p>Sắp xếp khách theo cây nhóm tối đa 3 cấp để lọc thuận tiện hơn.</p>
        </div>
      </header>
      <div className="category-summary">
        <div>
          <TreeStructure size={19} />
          <span>
            <strong>{items.length}</strong> nhóm khách
          </span>
        </div>
        <div>
          <UsersThree size={19} />
          <span>
            <strong>{totalGuestCount}</strong> khách mời
          </span>
        </div>
        <p>
          <strong>3 cấp tối đa</strong>
          <span>Nhóm con được giữ lại khi xóa nhóm cha.</span>
        </p>
      </div>
      <div className="panel category-tree-panel">
        <header>
          <div>
            <h2>Cây nhóm khách</h2>
            <p>Chọn nhóm khách để xóa hàng loạt.</p>
          </div>
          {canEdit && selected.length ? (
            <button
              className="button button-secondary"
              type="button"
              disabled={busy}
              onClick={() => void remove()}
            >
              Xóa {selected.length} mục
            </button>
          ) : (
            <span>
              <UsersThree size={14} /> {roots.length} nhóm gốc
            </span>
          )}
        </header>
        {loading ? (
          <div className="guest-empty">Đang tải nhóm khách…</div>
        ) : error ? (
          <div className="guest-empty">
            <p>{error}</p>
            <button className="button button-secondary" type="button" onClick={() => void load()}>
              Thử lại
            </button>
          </div>
        ) : (
          <div className="category-family-blocks">
            {(
              [
                ['GROOM', 'Nhà trai'],
                ['BRIDE', 'Nhà gái'],
                ['', 'Chung'],
              ] as const
            ).map(([side, label]) => {
              const blockRoots = roots.filter((item) => (item.familySide ?? '') === side)
              return (
                <section
                  className="category-family-block"
                  key={label}
                  aria-labelledby={`category-family-${side || 'common'}`}
                >
                  <header className="category-family-block-header">
                    <div>
                      <h3 id={`category-family-${side || 'common'}`}>{label}</h3>
                      <span>{blockRoots.length} nhóm gốc</span>
                    </div>
                    <div className="category-family-block-actions">
                      <span className="category-family-block-count">
                        {blockRoots.reduce((count, root) => count + (root.guestCount ?? 0), 0)}{' '}
                        khách
                      </span>
                      {canEdit ? (
                        <button
                          className="button button-secondary category-family-add"
                          type="button"
                          onClick={() => openCreate(null, side)}
                        >
                          <Plus size={14} /> Thêm nhóm khách
                        </button>
                      ) : null}
                    </div>
                  </header>
                  {blockRoots.length ? (
                    <ul className="category-tree category-card-tree">{blockRoots.map(render)}</ul>
                  ) : (
                    <p className="category-family-empty">Chưa có nhóm khách.</p>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </div>
      {parent !== undefined && (
        <div
          className="category-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog()
          }}
        >
          <section className="category-dialog modal-saving-dialog" role="dialog" aria-modal="true">
            <header>
              <div>
                <h2>{parent ? 'Thêm nhóm con' : 'Thêm nhóm gốc'}</h2>
                <p>
                  {parent
                    ? `Nằm trong “${parent.name}” · Cấp ${parent.depth + 1}`
                    : 'Nhóm cấp 1'}
                </p>
              </div>
              <button type="button" onClick={closeDialog} aria-label="Đóng">
                <X size={18} />
              </button>
            </header>
            <label htmlFor="category-name">Tên nhóm khách</label>
            <input
              id="category-name"
              autoFocus
              value={name}
              autoComplete="off"
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void create()
              }}
              placeholder="Ví dụ: Họ nội, Bạn đại học"
            />
            <p className="field-helper">
              Nhóm này sẽ thuộc phía gia đình{' '}
              {familySide === 'GROOM' ? 'Nhà trai' : familySide === 'BRIDE' ? 'Nhà gái' : 'Chung'}.
            </p>
            {error && <p className="field-error">{error}</p>}
            <footer>
              <button className="button button-secondary" type="button" onClick={closeDialog}>
                Hủy
              </button>
              <button
                className="button button-primary"
                type="button"
                disabled={busy || !name.trim()}
                onClick={() => void create()}
              >
                Tạo nhóm khách
              </button>
            </footer>
            {busy ? <ModalSavingStatus /> : null}
          </section>
        </div>
      )}
    </section>
  )
}
