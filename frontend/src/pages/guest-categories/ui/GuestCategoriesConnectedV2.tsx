import { useEffect, useMemo, useState } from 'react'
import { CaretDown, CaretRight, FolderSimple, Plus, TreeStructure, UsersThree, X } from '@phosphor-icons/react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { guestCategoryApi, type GuestCategory, type Wedding } from '../../../shared/api/weddings'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { GuestCategoriesPage } from './GuestCategoriesPage'

const alertError = (text: string) => Swal.fire({ icon: 'error', title: 'Không thể thực hiện', text, confirmButtonText: 'Đã hiểu' })
const alertSuccess = (text: string) => Swal.fire({ icon: 'success', title: 'Đã cập nhật', text, timer: 900, timerProgressBar: true, showConfirmButton: false })

export function GuestCategoriesConnectedV2() {
  const workspace = useOptionalWeddingWorkspace()
  if (!workspace) return <GuestCategoriesPage />
  return <GuestCategoriesContent activeWedding={workspace.activeWedding} />
}

function GuestCategoriesContent({ activeWedding }: { activeWedding: Wedding | null }) {
  const [items, setItems] = useState<GuestCategory[]>([])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [parent, setParent] = useState<GuestCategory | null | undefined>(undefined)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    if (!activeWedding) return
    setLoading(true); setError('')
    try { const result = await guestCategoryApi.list(activeWedding.id); setItems(result.items); setExpanded(new Set(result.items.filter((item) => item.depth < 3).map((item) => item.id))) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải danh mục.') }
    finally { setLoading(false) }
  }
  // The wedding id is the refresh boundary for this screen.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load() }, [activeWedding?.id])

  const roots = useMemo(() => items.filter((item) => item.parentId === null), [items])
  const childrenOf = (id: string) => items.filter((item) => item.parentId === id)
  const closeDialog = () => { setParent(undefined); setName(''); setError('') }
  const openCreate = (value: GuestCategory | null) => { setParent(value); setName(''); setError('') }
  const create = async () => {
    if (!activeWedding || !name.trim()) return
    if ((parent?.depth ?? 0) >= 3) { setError('Danh mục chỉ được tối đa 3 cấp.'); return }
    setBusy(true)
    try { await guestCategoryApi.create(activeWedding.id, { name: name.trim(), ...(parent ? { parentId: parent.id } : {}) }); closeDialog(); await load(); await alertSuccess('Danh mục đã được thêm vào cây.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tạo danh mục.') }
    finally { setBusy(false) }
  }
  const remove = async () => {
    if (!activeWedding || !selected.length) return
    const result = await Swal.fire({ icon: 'warning', title: 'Xóa danh mục?', text: `${selected.length} danh mục sẽ được xóa. Danh mục con sẽ trở thành danh mục gốc.`, showCancelButton: true, confirmButtonText: 'Xóa danh mục', cancelButtonText: 'Hủy', confirmButtonColor: '#a43d34' })
    if (!result.isConfirmed) return
    setBusy(true)
    try { await guestCategoryApi.removeMany(activeWedding.id, selected); setSelected([]); await load(); await alertSuccess('Danh mục đã được xóa.') }
    catch (cause) { await alertError(cause instanceof Error ? cause.message : 'Không thể xóa danh mục.') }
    finally { setBusy(false) }
  }
  const toggle = (id: string) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const render = (item: GuestCategory): JSX.Element => { const nested = childrenOf(item.id); const isOpen = expanded.has(item.id); return <li key={item.id}><div className="category-card-row" style={{ '--category-depth': item.depth } as React.CSSProperties}><button className="category-toggle" type="button" disabled={!nested.length} onClick={() => toggle(item.id)} aria-label={`${isOpen ? 'Thu gọn' : 'Mở rộng'} ${item.name}`}>{nested.length ? isOpen ? <CaretDown size={15} /> : <CaretRight size={15} /> : <span />}</button><input className="guest-checkbox" type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} aria-label={`Chọn ${item.name}`} /><span className="category-folder"><FolderSimple size={18} weight={isOpen ? 'fill' : 'regular'} /></span><div className="category-card-copy"><strong>{item.name}</strong><span>Cấp {item.depth} · {item.guestCount ?? 0} khách</span></div>{item.depth < 3 && <button className="category-add-child" type="button" onClick={() => openCreate(item)}><Plus size={14} /> <span>Thêm cấp con</span></button>}</div>{nested.length && isOpen ? <ul>{nested.map(render)}</ul> : null}</li> }

  return <section className="categories-page" aria-labelledby="categories-heading"><header className="categories-heading"><div><p className="breadcrumb">Đám cưới <span>/</span> Khách mời <span>/</span> Danh mục</p><h1 id="categories-heading">Danh mục khách mời</h1><p>Tổ chức khách theo cây danh mục tối đa 3 cấp để lọc thuận tiện hơn.</p></div><button className="button button-primary" type="button" onClick={() => openCreate(null)}><Plus size={17} /> Thêm danh mục</button></header><div className="category-summary"><div><TreeStructure size={19} /><span><strong>{items.length}</strong> danh mục</span></div><p><strong>3 cấp tối đa</strong><span>Danh mục con được giữ lại khi xóa danh mục cha.</span></p></div><div className="panel category-tree-panel"><header><div><h2>Cây danh mục</h2><p>Chọn danh mục để xóa hàng loạt.</p></div>{selected.length ? <button className="button button-secondary" type="button" disabled={busy} onClick={() => void remove()}>Xóa {selected.length} mục</button> : <span><UsersThree size={14} /> {roots.length} danh mục gốc</span>}</header>{loading ? <div className="guest-empty">Đang tải danh mục…</div> : error ? <div className="guest-empty"><p>{error}</p><button className="button button-secondary" type="button" onClick={() => void load()}>Thử lại</button></div> : <ul className="category-tree category-card-tree">{roots.map(render)}</ul>}</div>{parent !== undefined && <div className="category-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog() }}><section className="category-dialog" role="dialog" aria-modal="true"><header><div><h2>{parent ? 'Thêm danh mục con' : 'Thêm danh mục gốc'}</h2><p>{parent ? `Nằm trong “${parent.name}” · Cấp ${parent.depth + 1}` : 'Danh mục cấp 1'}</p></div><button type="button" onClick={closeDialog} aria-label="Đóng"><X size={18} /></button></header><label htmlFor="category-name">Tên danh mục</label><input id="category-name" autoFocus value={name} onChange={(event) => { setName(event.target.value); setError('') }} onKeyDown={(event) => { if (event.key === 'Enter') void create() }} placeholder="Ví dụ: Họ nội, Bạn đại học" />{error && <p className="field-error">{error}</p>}<footer><button className="button button-secondary" type="button" onClick={closeDialog}>Hủy</button><button className="button button-primary" type="button" disabled={busy || !name.trim()} onClick={() => void create()}>Tạo danh mục</button></footer></section></div>}</section>
}
