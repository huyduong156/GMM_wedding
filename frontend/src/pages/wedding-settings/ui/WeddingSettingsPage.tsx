import { useEffect, useState } from 'react'
import { Archive, CalendarBlank, ClockCountdown, FloppyDisk, Globe, Trash } from '@phosphor-icons/react'
import { useWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { weddingApi, WeddingApiError, type WeddingVisibility } from '../../../shared/api/weddings'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/ConfirmDialog'
import { DatePickerField } from '../../../shared/ui/form-controls/DatePickerField'
import { SelectField } from '../../../shared/ui/form-controls/SelectField'


function CountdownSection({ date }: { date: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Date.parse(`${date}T00:00:00`) - Date.now()))
  useEffect(() => { const getRemaining = () => Math.max(0, Date.parse(`${date}T00:00:00`) - Date.now()); setRemaining(getRemaining()); const timer = window.setInterval(() => setRemaining(getRemaining()), 1000); return () => window.clearInterval(timer) }, [date])
  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const expired = remaining === 0
  return <section className="settings-panel settings-countdown-panel"><header><ClockCountdown size={20} /><div><h2>Đếm ngược ngày cưới</h2><p>{expired ? 'Ngày cưới đã đến.' : 'Thời gian còn lại đến ngày cưới chính.'}</p></div></header><div className="settings-countdown" aria-label="Đếm ngược ngày cưới"><div><strong>{days}</strong><span>Ngày</span></div><div><strong>{String(hours).padStart(2, '0')}</strong><span>Giờ</span></div><div><strong>{String(minutes).padStart(2, '0')}</strong><span>Phút</span></div><div><strong>{String(seconds).padStart(2, '0')}</strong><span>Giây</span></div></div></section>
}
export function WeddingSettingsPage() {
  const { activeWedding, replaceWedding, removeWedding } = useWeddingWorkspace()
  const [name, setName] = useState(''), [date, setDate] = useState(''), [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh')
  const [visibility, setVisibility] = useState<WeddingVisibility>('PUBLIC'), [saving, setSaving] = useState(false), [message, setMessage] = useState<string | null>(null), [deleteOpen, setDeleteOpen] = useState(false), [deleting, setDeleting] = useState(false)
  useEffect(() => { if (!activeWedding) return; setName(activeWedding.name); setDate(activeWedding.primaryDate?.slice(0, 10) ?? ''); setTimezone(activeWedding.timezone); setVisibility(activeWedding.visibility) }, [activeWedding])
  if (!activeWedding) return null
  const wedding = activeWedding
  async function save(event: React.FormEvent) { event.preventDefault(); setSaving(true); setMessage(null); try { const result = await weddingApi.update(wedding.id, { name: name.trim(), primaryDate: date ? new Date(`${date}T12:00:00+07:00`).toISOString() : null, timezone, visibility, revision: wedding.revision }); replaceWedding(result.wedding); setMessage('Đã lưu thay đổi.') } catch (cause) { setMessage(cause instanceof WeddingApiError && cause.status === 409 ? 'Dữ liệu vừa thay đổi ở nơi khác. Hãy tải lại trước khi lưu.' : cause instanceof Error ? cause.message : 'Không thể lưu thay đổi.') } finally { setSaving(false) } }
  async function toggleArchive() { const result = await weddingApi.update(wedding.id, { status: wedding.status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED', revision: wedding.revision }); replaceWedding(result.wedding) }
  async function destroy() { setDeleting(true); try { await weddingApi.remove(wedding.id); removeWedding(wedding.id); setDeleteOpen(false) } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Không thể xóa đám cưới.') } finally { setDeleting(false) } }
  return <div className="wedding-page settings-page"><header className="workspace-page-heading"><div><p className="eyebrow">Không gian cưới</p><h1>Cài đặt chung</h1><p>Cập nhật thông tin được dùng xuyên suốt dashboard, thiệp và các sự kiện.</p></div></header><form className="settings-layout" onSubmit={save}><section className="settings-panel settings-basic-panel"><header><CalendarBlank size={20} /><div><h2>Thông tin cơ bản</h2><p>Tên, ngày cưới và múi giờ mặc định.</p></div></header><div className="settings-fields"><label>Tên đám cưới<input required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} /></label><DatePickerField id="wedding-date" label="Ngày cưới chính" value={date} onChange={setDate} /><SelectField id="wedding-timezone" label="Múi giờ" value={timezone} onChange={setTimezone} options={[{ value: "Asia/Ho_Chi_Minh", label: "Việt Nam (GMT+7)" }, { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" }, { value: "Asia/Singapore", label: "Singapore (GMT+8)" }]} /></div></section>{date ? <CountdownSection date={date} /> : null}<section className="settings-panel"><header><Globe size={20} /><div><h2>Quyền riêng tư mặc định</h2><p>Áp dụng cho hồ sơ cưới; publish vẫn là một bước riêng.</p></div></header><SelectField id="wedding-visibility" label="Quyền riêng tư mặc định" value={visibility} onChange={(value) => setVisibility(value as WeddingVisibility)} options={[{ value: "PUBLIC", label: "Công khai" }, { value: "PASSWORD_PROTECTED", label: "Có mật khẩu" }, { value: "INVITE_ONLY", label: "Chỉ người được mời" }]} /></section>{message ? <p className="workspace-save-message" role="status">{message}</p> : null}<div className="settings-save"><button className="button button-primary" disabled={saving}><FloppyDisk size={17} /> {saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div></form><section className="danger-zone"><div><h2>Trạng thái & xóa dữ liệu</h2><p>Lưu trữ có thể mở lại. Xóa là thao tác cuối cùng và không có khôi phục trong MVP.</p></div><div><button className="button button-secondary" onClick={() => void toggleArchive()}><Archive size={17} /> {activeWedding.status === 'ARCHIVED' ? 'Mở lại bản nháp' : 'Lưu trữ'}</button><button className="button button-danger" onClick={() => setDeleteOpen(true)}><Trash size={17} /> Xóa đám cưới</button></div></section><ConfirmDialog open={deleteOpen} title="Xóa đám cưới này?" description={`“${wedding.name}” sẽ bị xóa vĩnh viễn và không thể hoàn tác.`} confirmLabel="Xóa đám cưới" busy={deleting} onCancel={() => setDeleteOpen(false)} onConfirm={destroy} /></div>
}
