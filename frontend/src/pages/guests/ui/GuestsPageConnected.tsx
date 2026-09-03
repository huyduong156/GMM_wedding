import { NativeSelectField } from '../../../shared/ui/form-controls/NativeSelectField'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { useEffect, useMemo, useState } from 'react'
import { Archive, ArrowSquareOut, Check, CircleNotch, Copy, DotsThree, MagnifyingGlass, PaperPlaneTilt, Plus, UploadSimple, UserPlus, Users, WarningCircle, X } from '@phosphor-icons/react'
import { guestApi, guestCategoryApi, weddingApi, type Guest, type GuestCategory, type Wedding } from '../../../shared/api/weddings'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { GuestsPage } from './GuestsPage'

type FormState = { name: string; displayName: string; phone: string; email: string; tableName: string; maxPartySize: string; categoryId: string; note: string }
const REMOVE_CATEGORY = '__remove_category__'
const blank: FormState = { name: '', displayName: '', phone: '', email: '', tableName: '', maxPartySize: '1', categoryId: '', note: '' }
const guestName = (guest: Guest) => guest.name || guest.displayName || 'Chưa có tên'
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase() || '?'
const date = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(value))
const catName = (categories: GuestCategory[], id: string | null) => categories.find((item) => item.id === id)?.name ?? 'Chưa phân loại'

function GuestShareDialog({ weddingId, weddingSlug, guest, close }: { weddingId: string; weddingSlug: string | null; guest: Guest; close: () => void }) {
  const [state, setState] = useState<'loading' | 'ready' | 'not-public' | 'error'>('loading')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        if (!weddingSlug) throw new Error('Đám cưới chưa có đường dẫn công khai.')
        const dashboardResult = await weddingApi.dashboard(weddingId)
        const publication = dashboardResult.dashboard.publication.invitation
        if (!publication.published) {
          if (active) setState('not-public')
          return
        }
        if (!guest.slug) throw new Error('Khách mời chưa có guest-slug để tạo link riêng.')
        await weddingApi.publicInvitationGuest(weddingSlug, guest.slug)
        if (active) {
          setUrl(`${window.location.origin}/${encodeURIComponent(weddingSlug)}/invitation/${encodeURIComponent(guest.slug)}`)
          setState('ready')
        }
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Không thể tạo link gửi thiệp.')
          setState('error')
        }
      }
    }
    void load()
    return () => { active = false }
  }, [guest.id, weddingId, weddingSlug])

  const copy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return <div className="category-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="category-dialog guest-share-dialog" role="dialog" aria-modal="true" aria-labelledby="guest-share-dialog-title"><header><div><h2 id="guest-share-dialog-title">Gửi thiệp cho {guestName(guest)}</h2><p>Link này chỉ dành cho khách mời đang chọn.</p></div><button type="button" onClick={close} aria-label="Đóng"><X size={18} /></button></header>{state === 'loading' ? <div className="guest-share-state"><CircleNotch size={28} className="is-spinning" /><strong>Đang kiểm tra trạng thái thiệp…</strong><p>Đang lấy link riêng của khách mời.</p></div> : state === 'ready' ? <div className="guest-share-content"><div className="guest-share-success"><Check size={18} weight="bold" /><span>Thiệp đã được công khai</span></div><label htmlFor="guest-share-url">Link thiệp riêng</label><div className="guest-share-url"><input id="guest-share-url" value={url} readOnly /><button type="button" onClick={() => void copy()} aria-label="Sao chép link">{copied ? <Check size={17} /> : <Copy size={17} />}</button></div>{copied && <p className="guest-share-copied" role="status">Đã sao chép link.</p>}<footer><button className="button button-secondary" type="button" onClick={close}>Đóng</button><a className="button button-primary" href={url} target="_blank" rel="noreferrer"><ArrowSquareOut size={17} /> Mở thiệp</a></footer></div> : state === 'not-public' ? <div className="guest-share-state is-warning"><WarningCircle size={28} /><strong>Cần công khai thiệp trước</strong><p>Hãy công khai thiệp cưới để có thể tạo link riêng gửi cho khách mời.</p><footer><button className="button button-secondary" type="button" onClick={close}>Đóng</button></footer></div> : <div className="guest-share-state is-error"><WarningCircle size={28} /><strong>Không thể lấy link gửi thiệp</strong><p>{error}</p><footer><button className="button button-secondary" type="button" onClick={close}>Đóng</button></footer></div>}</section></div>
}
function GuestDialogLoading() { return <div className="guest-dialog-loading" role="status" aria-live="polite"><CircleNotch size={22} aria-hidden="true" /><span>Đang lưu thông tin…</span></div> }

function GuestDialog({ form, categories, editing, busy, error, change, save, close }: { form: FormState; categories: GuestCategory[]; editing: boolean; busy: boolean; error: string; change: (key: keyof FormState, value: string) => void; save: () => void; close: () => void }) { const [nameTouched, setNameTouched] = useState(false); const nameError = nameTouched ? (!form.name.trim() ? 'Vui lòng nhập tên khách mời.' : form.name.trim().length > 160 ? 'Tên khách mời không được vượt quá 160 ký tự.' : '') : '';
  return <div className="category-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="category-dialog guest-dialog" role="dialog" aria-modal="true" aria-labelledby="guest-dialog-title"><header><div><h2 id="guest-dialog-title">{editing ? 'Chỉnh sửa khách mời' : 'Thêm khách mời'}</h2><p>Thông tin riêng tư trong không gian cưới của bạn.</p></div><button type="button" onClick={close} aria-label="Đóng"><X size={18} /></button></header><label htmlFor="guest-name">Tên khách mời</label><input id="guest-name" autoFocus maxLength={160} aria-invalid={Boolean(nameError)} onBlur={() => setNameTouched(true)} value={form.name} onChange={(event) => change('name', event.target.value)} placeholder="Nguyễn Văn A" />{nameError && <p className="field-error guest-name-error">{nameError}</p>}<label htmlFor="guest-display-name">Tên hiển thị trên thiệp <span className="field-hint">(tùy chọn)</span></label><input id="guest-display-name" value={form.displayName} onChange={(event) => change('displayName', event.target.value)} placeholder="Ví dụ: anh Ba Hưng" /><div className="guest-form-grid"><label>Số điện thoại<input value={form.phone} onChange={(event) => change('phone', event.target.value)} /></label><label>Email<input type="email" value={form.email} onChange={(event) => change('email', event.target.value)} /></label><label>Số người tối đa<input type="number" min="1" max="50" value={form.maxPartySize} onChange={(event) => change('maxPartySize', event.target.value)} /></label><label>Bàn / khu vực<input value={form.tableName} onChange={(event) => change('tableName', event.target.value)} /></label></div><label>Danh mục<NativeSelectField value={form.categoryId} onChange={(event) => change('categoryId', event.target.value)}><option value="">Chưa phân loại</option>{categories.map((item) => <option key={item.id} value={item.id}>{'— '.repeat(item.depth - 1)}{item.name}</option>)}</NativeSelectField></label><label>Ghi chú<textarea rows={3} value={form.note} onChange={(event) => change('note', event.target.value)} /></label>{error && <p className="field-error">{error}</p>}<footer><button className="button button-secondary" type="button" onClick={close}>Hủy</button><button className="button button-primary" type="button" disabled={busy} onClick={() => { setNameTouched(true); if (form.name.trim() && form.name.trim().length <= 160) save() }}>{busy ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Thêm khách'}</button></footer>{busy && <GuestDialogLoading />}</section></div>
}

export function GuestsPageConnected() {
  const workspace = useOptionalWeddingWorkspace()
  if (!workspace) return <GuestsPage />
  return <GuestsPageConnectedContent activeWedding={workspace.activeWedding} />
}

function GuestsPageConnectedContent({ activeWedding }: { activeWedding: Wedding | null }) {
  const [guests, setGuests] = useState<Guest[]>([]); const [sharingGuest, setSharingGuest] = useState<Guest | null>(null); const [categories, setCategories] = useState<GuestCategory[]>([]); const [query, setQuery] = useState(''); const [categoryId, setCategoryId] = useState(''); const [selected, setSelected] = useState<string[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [feedback, setFeedback] = useState(''); const [form, setForm] = useState(blank); const [editing, setEditing] = useState<Guest | null>(null); const [creating, setCreating] = useState(false); const [busy, setBusy] = useState(false); const [bulkCategoryAction, setBulkCategoryAction] = useState('')
  const load = async () => { if (!activeWedding) return; setLoading(true); setError(''); try { const [guestResult, categoryResult] = await Promise.all([guestApi.list(activeWedding.id, { q: query.trim() || undefined, categoryId: categoryId || undefined }), guestCategoryApi.list(activeWedding.id)]); setGuests(guestResult.items); setCategories(categoryResult.items); setSelected([]) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải danh sách khách mời.') } finally { setLoading(false) } }
  // The request inputs are the explicit refresh boundary; load itself is intentionally local to this screen.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load() }, [activeWedding?.id, query, categoryId])
  const totalParty = useMemo(() => guests.reduce((sum, guest) => sum + guest.maxPartySize, 0), [guests]); const allSelected = guests.length > 0 && guests.every((guest) => selected.includes(guest.id))
  const openShare = (guest: Guest) => setSharingGuest(guest); const openCreate = () => { setCreating(true); setEditing(null); setForm({ ...blank }); setFeedback('') }; const openEdit = (guest: Guest) => { setCreating(false); setEditing(guest); setForm({ name: guestName(guest), displayName: guest.displayName ?? '', phone: guest.phone ?? '', email: guest.email ?? '', tableName: guest.tableName ?? '', maxPartySize: String(guest.maxPartySize), categoryId: guest.categoryId ?? '', note: guest.note ?? '' }); setFeedback('') }
  const change = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value })); const close = () => { setCreating(false); setEditing(null); setFeedback('') }; const closeShare = () => setSharingGuest(null)
  const save = async () => { if (!activeWedding || !form.name.trim()) return; setBusy(true); setFeedback(''); const input = { name: form.name.trim(), displayName: form.displayName.trim() || null, phone: form.phone || null, email: form.email || null, tableName: form.tableName || null, note: form.note || null, maxPartySize: Math.max(1, Math.min(50, Number(form.maxPartySize) || 1)), categoryId: form.categoryId || null }; try { if (editing) { const result = await guestApi.update(activeWedding.id, editing.id, input); setGuests((items) => items.map((item) => item.id === editing.id ? result.guest : item)) } else { const result = await guestApi.create(activeWedding.id, input); setGuests((items) => [result.guest, ...items]) }; await notifications.success(editing ? 'Đã cập nhật khách mời' : 'Đã thêm khách mời'); const keepCreateDialogOpen = !editing && typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches; if (keepCreateDialogOpen) { setForm({ ...blank }); setFeedback(''); } else { close() } } catch (cause) { setFeedback(cause instanceof Error ? cause.message : 'Không thể lưu khách mời.') } finally { setBusy(false) } }
  const remove = async () => {
    if (!activeWedding || !selected.length) return
    const result = await notifications.fire({ icon: 'warning', title: 'Xóa khách mời?', text: `${selected.length} khách mời sẽ được xóa khỏi danh sách.`, showCancelButton: true, confirmButtonText: 'Xóa khách mời', cancelButtonText: 'Hủy', confirmButtonColor: '#a43d34' })
    if (!result.isConfirmed) return
    setBusy(true)
    try {
      await guestApi.removeMany(activeWedding.id, selected)
      setGuests((items) => items.filter((item) => !selected.includes(item.id)))
      setSelected([])
      await notifications.fire({ icon: 'success', title: 'Đã xóa khách mời', timer: 900, timerProgressBar: true, showConfirmButton: false })
    } catch (cause) {
      await notifications.fire({ icon: 'error', title: 'Không thể xóa khách mời', text: cause instanceof Error ? cause.message : 'Vui lòng thử lại.', confirmButtonText: 'Đã hiểu' })
    } finally {
      setBusy(false)
    }
  }
  const assign = async (value: string) => { if (!activeWedding || !selected.length) return; setBusy(true); try { await guestApi.assignCategory(activeWedding.id, selected, value || null); setGuests((items) => items.map((item) => selected.includes(item.id) ? { ...item, categoryId: value || null } : item)); setSelected([]); setFeedback('Đã cập nhật danh mục.'); await notifications.success('Đã cập nhật danh mục') } catch (cause) { setFeedback(cause instanceof Error ? cause.message : 'Không thể cập nhật danh mục.') } finally { setBusy(false) } }
  const toggle = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  const handleBulkCategoryChange = (value: string) => { setBulkCategoryAction(''); void assign(value === REMOVE_CATEGORY ? '' : value) }
  const dialog = sharingGuest ? <GuestShareDialog weddingId={activeWedding?.id ?? ''} weddingSlug={activeWedding?.slug ?? null} guest={sharingGuest} close={closeShare} /> : creating || editing ? <GuestDialog form={form} categories={categories} editing={Boolean(editing)} busy={busy} error={feedback} change={change} save={() => void save()} close={close} /> : null
  return <section className="guests-page"><header className="guests-heading"><div><p className="breadcrumb">Đám cưới <span>/</span> Khách mời</p><h1>Quản lý khách mời</h1><p>Danh sách riêng tư của đám cưới, được đồng bộ trực tiếp với máy chủ.</p></div><div className="page-actions"><button className="button button-secondary" type="button" disabled><UploadSimple size={17} /> Nhập danh sách</button><button className="button button-primary" type="button" onClick={openCreate}><UserPlus size={17} weight="bold" /> Thêm khách mời</button></div></header><div className="guest-summary"><div><span><Users size={17} /> Tổng khách mời</span><strong>{guests.length}</strong><small>Đang hiển thị theo bộ lọc</small></div><div><span><Users size={17} /> Số người dự kiến</span><strong>{totalParty}</strong><small>Theo số người tối đa</small></div><div><span><Archive size={17} /> Có danh mục</span><strong>{guests.filter((guest) => guest.categoryId).length}</strong><small>Đã được phân loại</small></div></div><div className="guest-directory panel"><div className="guest-toolbar"><label className="guest-search"><MagnifyingGlass size={17} aria-hidden="true" /><span className="sr-only">Tìm khách mời</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên khách…" /></label><label className="guest-group-filter"><span>Danh mục</span><NativeSelectField value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Tất cả danh mục</option>{categories.map((item) => <option key={item.id} value={item.id}>{'— '.repeat(item.depth - 1)}{item.name}</option>)}</NativeSelectField></label></div>{selected.length > 0 && <div className="guest-bulk-bar"><strong>{selected.length} khách đã chọn</strong><div><label className="bulk-category-select">Gán danh mục <NativeSelectField value={bulkCategoryAction} disabled={busy} onChange={(event) => handleBulkCategoryChange(event.target.value)}><option value="">Chọn…</option><option value={REMOVE_CATEGORY}>Gỡ danh mục</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</NativeSelectField></label><button type="button" className="danger" disabled={busy} onClick={() => void remove()}><Archive size={15} /> Xóa</button><button type="button" className="bulk-close" onClick={() => setSelected([])}>Bỏ chọn</button></div></div>}{loading ? <div className="guest-empty"><Users size={28} /><h2>Đang tải khách mời…</h2></div> : error ? <div className="guest-empty"><Users size={28} /><h2>Không thể tải dữ liệu</h2><p>{error}</p><button className="button button-secondary" type="button" onClick={() => void load()}>Thử lại</button></div> : guests.length === 0 ? <div className="guest-empty"><Users size={28} /><h2>Chưa có khách mời</h2><p>Thêm khách đầu tiên để bắt đầu quản lý danh sách.</p><button className="button button-secondary" type="button" onClick={openCreate}>Thêm khách mời</button></div> : <><div className="guest-table-wrap"><table className="guest-table"><caption className="sr-only">Danh sách khách mời</caption><thead><tr><th><input className="guest-checkbox" type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : guests.map((guest) => guest.id))} aria-label="Chọn tất cả" /></th><th>Khách mời</th><th>Tên hiển thị</th><th>Danh mục</th><th>Số người</th><th /></tr></thead><tbody>{guests.map((guest) => <tr key={guest.id} className={selected.includes(guest.id) ? 'is-selected' : ''}><td><input className="guest-checkbox" type="checkbox" checked={selected.includes(guest.id)} onChange={() => toggle(guest.id)} aria-label={`Chọn ${guestName(guest)}`} /></td><td><div className="guest-identity"><span>{initials(guestName(guest))}</span><div><div className="guest-name-row"><button type="button" onClick={() => openEdit(guest)}>{guestName(guest)}</button><button type="button" className="guest-share-button" onClick={() => openShare(guest)}><span>Gửi thiệp</span><PaperPlaneTilt size={14} weight="fill" aria-hidden="true" /></button></div><small>{guest.phone || guest.email || 'Chưa có liên hệ'}</small></div></div></td><td>{guest.displayName || '—'}</td><td><span className="guest-group-tag">{catName(categories, guest.categoryId)}</span></td><td>{guest.maxPartySize}</td><td><button className="row-menu" type="button" onClick={() => openEdit(guest)} aria-label={`Sửa ${guestName(guest)}`}><DotsThree size={20} weight="bold" /></button></td></tr>)}</tbody></table></div><div className="guest-mobile-list">{guests.map((guest) => <article className={selected.includes(guest.id) ? 'guest-card is-selected' : 'guest-card'} key={guest.id}><div className="guest-card-top"><input className="guest-checkbox" type="checkbox" checked={selected.includes(guest.id)} onChange={() => toggle(guest.id)} aria-label={`Chọn ${guestName(guest)}`} /><div className="guest-identity"><span>{initials(guestName(guest))}</span><div><div className="guest-name-row"><button type="button" onClick={() => openEdit(guest)}>{guestName(guest)}</button><button type="button" className="guest-share-button" onClick={() => openShare(guest)}><span>Gửi thiệp</span><PaperPlaneTilt size={14} weight="fill" aria-hidden="true" /></button></div><small>{catName(categories, guest.categoryId)}</small></div></div><button className="row-menu" type="button" onClick={() => openEdit(guest)} aria-label={`Sửa ${guestName(guest)}`}><DotsThree size={20} weight="bold" /></button></div><div className="guest-card-meta"><span>{guest.maxPartySize} người</span><span>Tên trên thiệp: {guest.displayName || '—'}</span><span>{guest.phone || guest.email || 'Chưa có liên hệ'}</span><span>{date(guest.updatedAt)}</span></div></article>)}</div><footer className="guest-pagination"><span>Đang hiển thị <strong>{guests.length}</strong> khách</span></footer></>}</div><button className="guest-mobile-add" type="button" onClick={openCreate} aria-label="Thêm khách mời"><Plus size={22} weight="bold" /></button>{feedback && !creating && !editing && <div className="guest-feedback" role="status">{feedback}</div>}{dialog}</section>
}
