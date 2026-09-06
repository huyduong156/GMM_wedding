import { NativeDateField } from '../../../shared/ui/form-controls/NativeDateField'
import { NativeSelectField } from '../../../shared/ui/form-controls/NativeSelectField'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bank, Coins, CurrencyCircleDollar, DotsThree, Eye, EyeSlash, Gift, LockKey, MagnifyingGlass, Plus, ShieldCheck, X } from '@phosphor-icons/react'
import { giftApi, guestApi, type GiftLedgerEntry as ApiGiftEntry, type Guest } from '../../../shared/api/weddings'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { initialGiftEntries, methodLabels, type GiftEntry, type GiftKind, type ReciprocityStatus } from '../model/gift-ledger-data'
function fromApiEntry(entry: ApiGiftEntry): GiftEntry {
  const kind = entry.giftType === 'physicalGift' ? 'gift' : entry.giftType
  const method = entry.receiveMethod === 'bankTransfer' ? 'bank' : entry.receiveMethod === 'cash' ? 'cash' : 'physical'
  const guestName = entry.guestDisplayNameSnapshot
  return { id: entry.id, guestId: entry.guestId, guestName, initials: guestName.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase(), group: entry.linkedGuest ? 'Đã liên kết khách' : 'Chưa phân nhóm', kind, amount: entry.amountMinor ? Number(entry.amountMinor) : undefined, goldWeight: entry.goldWeight ? Number(entry.goldWeight) : undefined, goldType: entry.goldType ?? undefined, description: entry.giftDescription ?? undefined, method, receivedAt: new Intl.DateTimeFormat('vi-VN').format(new Date(entry.receivedAt)), reciprocity: entry.reciprocityStatus, returnedAt: entry.returnedAt ?? undefined, note: entry.note ?? undefined, revision: entry.revision }
}
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const isMobileViewport = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
const toast = (title: string, icon: 'success' | 'error' = 'success') => notifications.fire({ toast: true, position: 'top-end', icon, title, timer: 1500, timerProgressBar: true, showConfirmButton: false })

export function GiftLedgerPage() {
  const workspace = useOptionalWeddingWorkspace()
  const weddingId = workspace?.activeWedding?.id
  const [entries, setEntries] = useState<GiftEntry[]>(() => workspace ? [] : initialGiftEntries)
  const [loading, setLoading] = useState(Boolean(weddingId))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | ReciprocityStatus>('all')
  const [revealed, setRevealed] = useState(false)
  const [editing, setEditing] = useState<GiftEntry | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogClosing, setDialogClosing] = useState(false)
  const [guestPickerOpen, setGuestPickerOpen] = useState(false)
  const [guestPickerClosing, setGuestPickerClosing] = useState(false)
  const [linkingEntry, setLinkingEntry] = useState<GiftEntry | null>(null)
  const [guestQuery, setGuestQuery] = useState('')
  const [guestList, setGuestList] = useState<Guest[]>([])
  const [guestLoading, setGuestLoading] = useState(false)
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [amount, setAmount] = useState('')
  const [kind, setKind] = useState<GiftKind>('money')
  const [goldWeight, setGoldWeight] = useState('')
  const [goldType, setGoldType] = useState('Vàng 24K')
  const [giftDescription, setGiftDescription] = useState('')
  const [note, setNote] = useState('')
  const [receivedDate, setReceivedDate] = useState('2026-07-30')
  const [receiveMethod, setReceiveMethod] = useState<'cash' | 'bankTransfer' | 'physicalGift'>('cash')
  useEffect(() => {
    if (!guestPickerOpen || !weddingId) return
    let cancelled = false
    setGuestLoading(true)
    guestApi.list(weddingId, { q: guestQuery.trim() || undefined, limit: 100 }).then((result) => { if (!cancelled) setGuestList(result.items) }).catch(() => { if (!cancelled) setGuestList([]) }).finally(() => { if (!cancelled) setGuestLoading(false) })
    return () => { cancelled = true }
  }, [guestPickerOpen, guestQuery, weddingId])
  useEffect(() => {
    if (!workspace) { setEntries(initialGiftEntries); setLoading(false); return }
    if (!weddingId) { setEntries([]); setLoading(false); return }
    let cancelled = false
    setLoading(true)
    Promise.all([giftApi.list(weddingId, { limit: 100 }), giftApi.summary(weddingId)]).then(([result]) => { if (!cancelled) { setEntries(result.items.map(fromApiEntry)); setError(null) } }).catch((cause) => { if (!cancelled) setError(cause instanceof Error ? cause.message : 'Không thể tải sổ tiền mừng.') }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [weddingId, workspace])
  useEffect(() => {
    const handleEdit = (event: Event) => { const entry = entries.find((item) => item.id === (event as CustomEvent<string>).detail); if (entry) openEdit(entry) }
    const handleRemove = (event: Event) => { const entry = entries.find((item) => item.id === (event as CustomEvent<string>).detail); if (entry) void removeEntry(entry) }
    const handleLink = (event: Event) => { const entry = entries.find((item) => item.id === (event as CustomEvent<string>).detail); if (entry) openGuestPicker(entry) }
    const handleUnlink = (event: Event) => { const entry = entries.find((item) => item.id === (event as CustomEvent<string>).detail); if (entry) void unlinkGuest(entry) }
    window.addEventListener('gift-ledger:edit', handleEdit)
    window.addEventListener('gift-ledger:remove', handleRemove)
    window.addEventListener('gift-ledger:link', handleLink)
    window.addEventListener('gift-ledger:unlink', handleUnlink)
    return () => { window.removeEventListener('gift-ledger:edit', handleEdit); window.removeEventListener('gift-ledger:remove', handleRemove); window.removeEventListener('gift-ledger:link', handleLink); window.removeEventListener('gift-ledger:unlink', handleUnlink) }
  }, [entries]) // eslint-disable-line react-hooks/exhaustive-deps
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('vi'))
  const filtered = useMemo(() => loading ? [] : entries.filter((entry) => (status === 'all' || entry.reciprocity === status) && (!deferredQuery || `${entry.guestName} ${entry.group} ${entry.note ?? ''}`.toLocaleLowerCase('vi').includes(deferredQuery))), [deferredQuery, entries, loading, status])
  const total = entries.reduce((sum, entry) => sum + (entry.amount ?? 0), 0)
  const pending = entries.filter((entry) => entry.reciprocity === 'pending').length
  const editDirty = !editing || guestName !== editing.guestName || selectedGuestId !== (editing.guestId ?? null) || kind !== editing.kind || amount !== String(editing.amount ?? '') || goldWeight !== String(editing.goldWeight ?? '') || goldType !== (editing.goldType ?? 'Vàng 24K') || giftDescription !== (editing.description ?? '') || note !== (editing.note ?? '') || (receiveMethod === 'bankTransfer' ? 'bank' : receiveMethod) !== (editing.method === 'bank' ? 'bankTransfer' : editing.method)
  const detailValid = (kind === 'money' ? Number(amount.replace(/\D/g, '')) > 0 : kind === 'gold' ? Number(goldWeight) > 0 : giftDescription.trim().length > 0)
  function closeDialog() { if (!dialogOpen || dialogClosing) return; setDialogClosing(true); window.setTimeout(() => { setDialogOpen(false); setDialogClosing(false) }, 180) }
  function closeGuestPicker() { if (!guestPickerOpen || guestPickerClosing) return; setGuestPickerClosing(true); window.setTimeout(() => { setGuestPickerOpen(false); setGuestPickerClosing(false) }, 160) }
  function openCreate() { setError(null); setDialogClosing(false); setEditing(null); setLinkingEntry(null); setSelectedGuestId(null); setKind('money'); setGuestName(''); setAmount(''); setGoldWeight(''); setGiftDescription(''); setNote(''); setGoldType('Vàng 24K'); setReceivedDate('2026-07-30'); setReceiveMethod('cash'); setDialogOpen(true) }
  function openGuestPicker(entry?: GiftEntry) { setGuestPickerClosing(false); setLinkingEntry(entry ?? null); setGuestQuery(''); setGuestList([]); setGuestLoading(true); setGuestPickerOpen(true) }
  async function selectGuest(guest: Guest) {
    if (linkingEntry && weddingId) {
      setGuestLoading(true)
      try {
        const result = await giftApi.linkGuest(weddingId, linkingEntry.id, guest.id)
        setEntries((current) => current.map((item) => item.id === linkingEntry.id ? fromApiEntry(result.entry) : item))
        closeGuestPicker(); setLinkingEntry(null)
        await toast('Đã liên kết khách mời')
      } catch (cause) { await toast(cause instanceof Error ? cause.message : 'Không thể liên kết khách mời.', 'error') } finally { setGuestLoading(false) }
      return
    }
    setSelectedGuestId(guest.id); setGuestName(guest.displayName ?? guest.name ?? ''); closeGuestPicker()
  }
  function clearSelectedGuest() { setSelectedGuestId(null); setGuestName('') }
  function openEdit(entry: GiftEntry) {
    setError(null); setDialogClosing(false); setEditing(entry); setLinkingEntry(null); setSelectedGuestId(entry.guestId ?? null); setGuestName(entry.guestName ?? ''); setAmount(entry.amount ? String(entry.amount) : ''); setGoldWeight(entry.goldWeight ? String(entry.goldWeight) : ''); setGoldType(entry.goldType ?? 'Vàng 24K'); setGiftDescription(entry.description ?? ''); setNote(entry.note ?? ''); setKind(entry.kind); setReceiveMethod(entry.method === 'bank' ? 'bankTransfer' : entry.method === 'cash' ? 'cash' : 'physicalGift'); setDialogOpen(true)
  }
  const removeEntry = useCallback(async (entry: GiftEntry) => {
    if (!weddingId) return
    const confirmation = await notifications.fire({ icon: 'warning', title: 'Xóa khoản mừng?', text: 'Khoản của “' + entry.guestName + '” sẽ bị xóa khỏi sổ.', showCancelButton: true, confirmButtonText: 'Xóa khoản mừng', cancelButtonText: 'Hủy', confirmButtonColor: '#a43d34' })
    if (!confirmation.isConfirmed) { notifications.close(); return }
    try { await giftApi.remove(weddingId, entry.id); setEntries((current) => current.filter((item) => item.id !== entry.id)); await toast('Đã xóa khoản mừng') } catch (cause) { await toast(cause instanceof Error ? cause.message : 'Không thể xóa khoản mừng.', 'error') }
  }, [weddingId])
  async function unlinkGuest(entry: GiftEntry) {
    if (!weddingId || !entry.guestId) return
    const confirmation = await notifications.fire({ icon: 'warning', title: 'Gỡ liên kết khách mời?', text: 'Khoản mừng vẫn được giữ lại dưới dạng vô danh.', showCancelButton: true, confirmButtonText: 'Gỡ liên kết', cancelButtonText: 'Hủy', confirmButtonColor: '#a45d08' })
    if (!confirmation.isConfirmed) { notifications.close(); return }
    try { const result = await giftApi.unlinkGuest(weddingId, entry.id); setEntries((current) => current.map((item) => item.id === entry.id ? fromApiEntry(result.entry) : item)); await toast('Đã gỡ liên kết khách mời') } catch (cause) { await toast(cause instanceof Error ? cause.message : 'Không thể gỡ liên kết.', 'error') }
  }
  const addEntry = async () => {
    if (!weddingId || !guestName.trim() || !detailValid || saving) return
    const wasEditing = Boolean(editing)
    setSaving(true); setError(null)
    try {
      const receivedAt = receivedDate ? new Date(receivedDate + 'T12:00:00+07:00').toISOString() : new Date().toISOString()
      const effectiveReceiveMethod: 'cash' | 'bankTransfer' | 'physicalGift' = kind === 'money' ? (receiveMethod === 'bankTransfer' ? 'bankTransfer' : 'cash') : 'physicalGift'
      const input = kind === 'money' ? { guestName: guestName.trim(), guestId: selectedGuestId ?? undefined, giftType: 'money' as const, amountMinor: amount.replace(/\D/g, ''), currency: 'VND', receiveMethod: effectiveReceiveMethod, receivedAt, note: note.trim() || undefined } : kind === 'gold' ? { guestName: guestName.trim(), guestId: selectedGuestId ?? undefined, giftType: 'gold' as const, goldWeight, goldUnit: 'chỉ', goldType, receiveMethod: 'physicalGift' as const, receivedAt, note: note.trim() || undefined } : { guestName: guestName.trim(), guestId: selectedGuestId ?? undefined, giftType: 'physicalGift' as const, giftDescription: giftDescription.trim(), receiveMethod: 'physicalGift' as const, receivedAt, note: note.trim() || undefined }
      const { guestId: _guestId, ...updateInput } = input
      void _guestId
      const result = editing ? await giftApi.update(weddingId, editing.id, { ...updateInput, revision: editing.revision ?? 1 }) : await giftApi.create(weddingId, input)
      setEntries((current) => editing ? current.map((entry) => entry.id === result.entry.id ? fromApiEntry(result.entry) : entry) : [fromApiEntry(result.entry), ...current])
      await toast(editing ? 'Đã cập nhật khoản mừng' : 'Đã thêm khoản mừng')
      setGuestName(''); setSelectedGuestId(null); setAmount(''); setGoldWeight(''); setGiftDescription(''); setNote(''); setReceivedDate('2026-07-30'); setReceiveMethod('cash'); setEditing(null); if (!isMobileViewport() || wasEditing) closeDialog()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể lưu khoản mừng.'); await toast(cause instanceof Error ? cause.message : 'Không thể lưu khoản mừng.', 'error') } finally { setSaving(false) }
  }

  async function markReturned(entry: GiftEntry) {
    if (!weddingId || entry.reciprocity !== "pending" || saving) return
    const confirmation = await notifications.confirm({ icon: "question", title: "Xác nhận đã mừng lại?", text: "Khoản mừng của “" + entry.guestName + "” sẽ được đánh dấu là đã mừng lại.", confirmButtonText: "Xác nhận đã mừng lại", cancelButtonText: "Hủy" })
    if (!confirmation.isConfirmed) { notifications.close(); return }
    setSaving(true)
    try {
      const result = await giftApi.update(weddingId, entry.id, { reciprocityStatus: "returned", returnedAt: new Date().toISOString(), revision: entry.revision ?? 1 })
      setEntries((current) => current.map((item) => item.id === entry.id ? fromApiEntry(result.entry) : item))
      await toast("Đã cập nhật trạng thái mừng lại")
    } catch (cause) { await toast(cause instanceof Error ? cause.message : "Không thể cập nhật trạng thái mừng lại.", "error") } finally { setSaving(false) }
  }

  return <div className="gift-ledger-page">
    <header className="gift-ledger-heading"><div><p className="eyebrow">Chuẩn bị <span>/</span> Sổ tiền mừng</p><h1>Sổ tiền mừng</h1><p>Lưu lại tiền và quà mừng để tiện đối chiếu khi cần.</p></div><button className="button button-primary" type="button" onClick={openCreate}><Plus size={18} weight="bold" />Thêm khoản mừng</button></header>
    <div className="gift-privacy"><LockKey size={19} weight="fill" /><div><strong>Dữ liệu riêng tư</strong><span>Chỉ chủ tài khoản có thể xem và chỉnh sửa. Dữ liệu không hiển thị trên website cưới.</span></div><ShieldCheck size={20} /></div>{error ? <p className="gift-ledger-error" role="alert">{error}</p> : null}
    <section className="gift-summary" aria-label="Tổng quan sổ tiền mừng"><article className="gift-total"><span>Tổng tiền đã ghi</span><div><strong>{revealed ? money.format(total) : '••••••••••'}</strong><button type="button" aria-pressed={revealed} aria-label={revealed ? 'Ẩn tổng tiền mừng' : 'Hiện tổng tiền mừng'} onClick={() => setRevealed((value) => !value)}>{revealed ? <EyeSlash size={18} /> : <Eye size={18} />}</button></div><small>Không quy đổi vàng và quà hiện vật</small></article><article><span>Khoản đã ghi</span><strong>{entries.length}</strong><small>{entries.filter((entry) => entry.kind === 'money').length} tiền · {entries.filter((entry) => entry.kind === 'gold').length} vàng · {entries.filter((entry) => entry.kind === 'gift').length} quà</small></article><article><span>Chưa mừng lại</span><strong>{pending}</strong><small>Cần tham khảo khi có dịp</small></article></section>
    <section className="panel gift-ledger-panel"><div className="gift-toolbar"><label className="gift-search"><span className="sr-only">Tìm trong sổ tiền mừng</span><MagnifyingGlass size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên khách, nhóm hoặc ghi chú" /></label><label className="gift-filter"><span className="sr-only">Lọc trạng thái mừng lại</span><NativeSelectField value={status} onChange={(event) => setStatus(event.target.value as 'all' | ReciprocityStatus)}><option value="all">Tất cả trạng thái</option><option value="pending">Chưa mừng lại</option><option value="returned">Đã mừng lại</option><option value="notApplicable">Không áp dụng</option></NativeSelectField></label></div>
      {filtered.length ? <><div className="gift-table-wrap"><table className="gift-table" aria-label="Danh sách tiền và quà mừng"><thead><tr><th>Khách mời</th><th>Khoản mừng</th><th>Ngày nhận</th><th>Ghi chú</th><th className="gift-actions-heading" aria-label="Thao tác" /></tr></thead><tbody>{filtered.map((entry) => <GiftTableRow key={entry.id} entry={entry} revealed={revealed} onMarkReturned={markReturned} />)}</tbody></table></div><div className="gift-mobile-list">{filtered.map((entry) => <GiftCard key={entry.id} entry={entry} revealed={revealed} onMarkReturned={markReturned} />)}</div><footer className="gift-footer"><span>Hiển thị {filtered.length} trên {entries.length} khoản mừng</span><span>Sổ ghi chép thủ công · Không đối soát ngân hàng</span></footer></> : <div className="gift-empty"><Gift size={30} /><h2>Không tìm thấy khoản mừng</h2><p>Thử thay đổi từ khóa hoặc trạng thái.</p><button type="button" onClick={() => { setQuery(''); setStatus('all') }}>Xóa bộ lọc</button></div>}
    </section>
    {dialogOpen && <div className={"gift-dialog-backdrop" + (dialogClosing ? " is-closing" : "")} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isMobileViewport()) closeDialog() }}><div className="gift-dialog" role="dialog" aria-modal="true" aria-labelledby="gift-dialog-title"><header><div><h2 id="gift-dialog-title">{editing ? 'Sửa khoản mừng' : 'Thêm khoản mừng'}</h2><p>Chọn loại khoản mừng và nhập thông tin tương ứng.</p><small className="gift-mobile-modal-hint">Trên mobile, hộp thoại nhập sẽ không tự đóng.</small></div><button type="button" onClick={closeDialog} className="gift-dialog-close" aria-label="Đóng"><X size={18} /></button></header><label htmlFor="gift-guest">Tên khách mời</label><div className="gift-guest-field"><input id="gift-guest" autoFocus value={guestName} readOnly={Boolean(selectedGuestId)} onChange={(event) => setGuestName(event.target.value)} placeholder="Nhập tên khách hoặc để vô danh" /><input type="hidden" value={selectedGuestId ?? ""} readOnly />{selectedGuestId ? <button type="button" className="gift-guest-clear" onClick={clearSelectedGuest}>Xóa liên kết</button> : null}</div><div className="gift-guest-actions"><button type="button" className="button button-secondary" onClick={() => openGuestPicker()}>Chọn từ danh sách khách mời có sẵn</button>{selectedGuestId ? <span>Đã liên kết khách mời</span> : <small>Không chọn khách để ghi nhận vô danh.</small>}</div><fieldset className="gift-kind-picker"><legend>Loại khoản mừng</legend>{([{ value: 'money', label: 'Tiền', icon: CurrencyCircleDollar }, { value: 'gold', label: 'Vàng', icon: Coins }, { value: 'gift', label: 'Quà', icon: Gift }] as const).map(({ value, label, icon: Icon }) => <label key={value} className={kind === value ? 'is-selected' : ''}><input type="radio" name="gift-kind" value={value} checked={kind === value} onChange={() => setKind(value)} /><Icon size={17} /><span>{label}</span></label>)}</fieldset>{kind === 'money' ? <><label htmlFor="gift-amount">Số tiền (VND)</label><input id="gift-amount" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Ví dụ: 1.000.000" /></> : kind === 'gold' ? <div className="gift-dialog-grid"><label>Số lượng (chỉ)<input type="number" min="0.1" step="0.1" value={goldWeight} onChange={(event) => setGoldWeight(event.target.value)} placeholder="Ví dụ: 2" /></label><label>Loại vàng<NativeSelectField value={goldType} onChange={(event) => setGoldType(event.target.value)}><option>Vàng 24K</option><option>Vàng 18K</option><option>Vàng 14K</option><option>Vàng 10K</option><option>Vàng miếng SJC</option><option>Khác</option></NativeSelectField></label></div> : <><label htmlFor="gift-description">Tên hoặc mô tả quà</label><input id="gift-description" value={giftDescription} onChange={(event) => setGiftDescription(event.target.value)} placeholder="Ví dụ: Bộ chăn ga cưới" /></>}<div className="gift-dialog-grid"><label>Hình thức nhận<NativeSelectField key={kind} value={kind === 'money' ? (receiveMethod === 'bankTransfer' ? 'bank' : 'cash') : 'physical'} onChange={(event) => setReceiveMethod(event.target.value === 'bank' ? 'bankTransfer' : 'cash')} disabled={kind !== 'money'}><option value="cash">Tiền mặt</option><option value="bank">Chuyển khoản</option><option value="physical">Nhận trực tiếp</option></NativeSelectField></label><label>Ngày nhận<NativeDateField value={receivedDate} onChange={(event) => setReceivedDate(event.target.value)} /></label><label className="gift-dialog-note">Ghi chú<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: Đã chuyển khoản sau tiệc" rows={3} /></label></div><footer><button className="button button-secondary" type="button" onClick={closeDialog}>Hủy</button><button className="button button-primary" type="button" onClick={addEntry} disabled={!guestName.trim() || !detailValid || saving || (Boolean(editing) && !editDirty)}><Plus size={17} />{saving ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Lưu khoản mừng'}</button></footer></div></div>}{guestPickerOpen && <div className={"gift-guest-picker-backdrop" + (guestPickerClosing ? " is-closing" : "")} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeGuestPicker() }}><div className="gift-guest-picker" role="dialog" aria-modal="true" aria-labelledby="gift-guest-picker-title"><header><div><h2 id="gift-guest-picker-title">Chọn khách mời</h2><p>Liên kết khoản mừng với khách đã có trong danh sách.</p></div><button type="button" className="gift-dialog-close" onClick={closeGuestPicker} aria-label="Đóng"><X size={18} /></button></header><input className="gift-guest-search" value={guestQuery} onChange={(event) => setGuestQuery(event.target.value)} placeholder="Tìm theo tên khách mời" autoFocus />{guestLoading ? <p className="gift-picker-state">Đang tải danh sách khách…</p> : guestList.length ? <div className="gift-guest-list">{guestList.map((guest) => <button type="button" key={guest.id} onClick={() => selectGuest(guest)}><strong>{guest.displayName}</strong><small>{guest.phone ?? guest.email ?? "Chưa có thông tin liên hệ"}</small></button>)}</div> : <p className="gift-picker-state">Không tìm thấy khách mời.</p>}</div></div>}
  </div>
}

function entryValue(entry: GiftEntry, revealed: boolean) { if (entry.kind === 'money') return revealed ? money.format(entry.amount ?? 0) : '••••••••'; if (entry.kind === 'gold') return `${entry.goldWeight} chỉ · ${entry.goldType}`; return entry.description }
function GiftActions({ entry }: { entry: GiftEntry }) {
  const [open, setOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const closeOtherMenus = (event: Event) => { if ((event as CustomEvent<string>).detail !== entry.id) setOpen(false) }
    window.addEventListener('gift-ledger:close-actions', closeOtherMenus)
    return () => window.removeEventListener('gift-ledger:close-actions', closeOtherMenus)
  }, [entry.id])
  function toggleMenu() {
    if (!open) {
      window.dispatchEvent(new CustomEvent("gift-ledger:close-actions", { detail: entry.id }))
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) { const menuHeight = 124; const top = rect.bottom + menuHeight > window.innerHeight ? Math.max(8, rect.top - menuHeight - 5) : rect.bottom + 5; setMenuPosition({ top, left: Math.max(8, Math.min(rect.right - 154, window.innerWidth - 162)) }) }
    }
    setOpen((value) => !value)
  }
  return <div className="gift-entry-actions"><button ref={buttonRef} type="button" className="gift-more-button" aria-label={'Tùy chọn khoản mừng của ' + entry.guestName} aria-expanded={open} onClick={toggleMenu}><DotsThree size={20} weight="bold" /></button>{open && menuPosition ? createPortal(<div className="gift-action-menu" role="menu" style={menuPosition}><button type="button" role="menuitem" onClick={() => { window.dispatchEvent(new CustomEvent(entry.guestId ? 'gift-ledger:unlink' : 'gift-ledger:link', { detail: entry.id })); setOpen(false) }}>{entry.guestId ? 'Gỡ liên kết khách mời' : 'Liên kết khách mời'}</button><button type="button" role="menuitem" onClick={() => { window.dispatchEvent(new CustomEvent('gift-ledger:edit', { detail: entry.id })); setOpen(false) }}>Sửa</button><button type="button" role="menuitem" onClick={() => { window.dispatchEvent(new CustomEvent('gift-ledger:remove', { detail: entry.id })); setOpen(false) }}>Xóa</button></div>, document.body) : null}</div>
}
function GiftTableRow({ entry, revealed, onMarkReturned }: { entry: GiftEntry; revealed: boolean; onMarkReturned: (entry: GiftEntry) => void }) { return <tr><td><Identity entry={entry} /></td><td><div className="gift-value-cell"><span className="gift-value">{entryValue(entry, revealed)}</span><GiftMethodLabel entry={entry} /></div></td><td><div className="gift-received-cell"><strong>{entry.receivedAt}</strong><ReciprocityButton entry={entry} onMarkReturned={onMarkReturned} /></div></td><td><span className="gift-note">{entry.note ?? '—'}</span></td><td className="gift-table-actions"><GiftActions entry={entry} /></td></tr> }
function GiftMethodLabel({ entry }: { entry: GiftEntry }) {
  const label = entry.kind === "gold" ? "Vàng" : methodLabels[entry.method]
  const icon = entry.kind === "gold" ? <Coins size={12} /> : entry.method === "bank" ? <Bank size={12} /> : entry.method === "physical" ? <Gift size={12} /> : <CurrencyCircleDollar size={12} />
  return <span className={"gift-method gift-method-" + entry.method}>{icon}{label}</span>
}
function ReciprocityButton({ entry, onMarkReturned }: { entry: GiftEntry; onMarkReturned: (entry: GiftEntry) => void }) {
  const returned = entry.reciprocity === "returned"
  const notApplicable = entry.reciprocity === "notApplicable"
  const className = returned ? "gift-reciprocity-button is-returned" : notApplicable ? "gift-reciprocity-button is-not-applicable" : "gift-reciprocity-button"
  return <button type="button" className={className} disabled={returned || notApplicable} onClick={() => onMarkReturned(entry)}>{returned ? "Đã mừng lại" : notApplicable ? "Không áp dụng" : "Chưa mừng lại"}{!returned && !notApplicable ? " >" : ""}</button>
}
function Identity({ entry }: { entry: GiftEntry }) { return <div className="gift-identity"><i>{entry.initials}</i><span><strong>{entry.guestName}</strong><small>{entry.group}</small></span></div> }
function GiftCard({ entry, revealed, onMarkReturned }: { entry: GiftEntry; revealed: boolean; onMarkReturned: (entry: GiftEntry) => void }) { return <article><header><Identity entry={entry} /><div className="gift-card-actions"><div className="gift-value-cell"><span className="gift-value">{entryValue(entry, revealed)}</span></div><GiftActions entry={entry} /></div></header><dl><div className="gift-received-cell"><dt>Ngày nhận</dt><dd><strong>{entry.receivedAt}</strong><ReciprocityButton entry={entry} onMarkReturned={onMarkReturned} /></dd></div><div className="gift-mobile-reciprocity"><dd><ReciprocityButton entry={entry} onMarkReturned={onMarkReturned} /></dd></div><div><dt>Ghi chú</dt><dd>{entry.note ?? '—'}</dd></div></dl></article> }




















