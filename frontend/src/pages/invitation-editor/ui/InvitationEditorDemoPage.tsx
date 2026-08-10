import { useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Desktop, DeviceMobile, Eye, FloppyDisk, MapPin, PencilSimple } from '@phosphor-icons/react'

import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'

type SectionKey = 'cover' | 'invitation' | 'families' | 'eventDetails' | 'gallery' | 'rsvp' | 'gift'
type EditorContent = { bride: string; groom: string; invitationTitle: string; invitationMessage: string; date: string; time: string; venue: string; address: string }

const sectionLabels: Record<SectionKey, string> = { cover: 'Bìa thiệp', invitation: 'Lời mời', families: 'Hai gia đình', eventDetails: 'Ngày & địa điểm', gallery: 'Album ảnh', rsvp: 'Xác nhận tham dự', gift: 'Mừng cưới' }
const requiredSections: SectionKey[] = ['cover', 'invitation', 'families', 'eventDetails']
const initialOrder: SectionKey[] = ['cover', 'invitation', 'families', 'eventDetails', 'gallery', 'rsvp', 'gift']

export function InvitationEditorDemoPage() {
  const [selected, setSelected] = useState<SectionKey>('cover')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [order, setOrder] = useState(initialOrder)
  const [enabled, setEnabled] = useState<SectionKey[]>(initialOrder)
  const [content, setContent] = useState<EditorContent>({ bride: 'Mai', groom: 'Đức', invitationTitle: 'Trân trọng kính mời', invitationMessage: 'Đến chung vui và chứng kiến khoảnh khắc chúng mình bắt đầu một hành trình mới.', date: '18/10/2026', time: '17:30', venue: 'The Garden Hall', address: 'Hà Nội' })
  const visibleSections = useMemo(() => order.filter((key) => enabled.includes(key)), [enabled, order])
  const update = (field: keyof EditorContent, value: string) => setContent((current) => ({ ...current, [field]: value }))
  const toggleSection = (key: SectionKey) => {
    if (requiredSections.includes(key)) return
    setEnabled((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
  }
  const moveSection = (key: SectionKey, direction: -1 | 1) => setOrder((current) => {
    const from = current.indexOf(key); const to = from + direction
    if (to < 0 || to >= current.length) return current
    const next = [...current]; [next[from], next[to]] = [next[to], next[from]]
    return next
  })

  return <section className="invitation-editor" aria-labelledby="invitation-editor-heading">
    <header className="editor-toolbar">
      <div className="editor-toolbar-title"><AppLink to={studioRoutes.inviteThemes} ariaLabel="Quay lại kho giao diện"><ArrowLeft size={18} /></AppLink><div><p>Thiệp online · Élan d’Amour v2.3</p><h1 id="invitation-editor-heading">Chỉnh sửa thiệp của bạn <span>Demo</span></h1></div></div>
      <div className="editor-toolbar-actions"><span className="editor-demo-status">Bản demo · thay đổi chỉ lưu trong phiên này</span><div className="editor-device-toggle" aria-label="Kích thước xem trước"><button type="button" className={device === 'desktop' ? 'is-active' : ''} aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')} aria-label="Xem dạng máy tính"><Desktop size={17} /></button><button type="button" className={device === 'mobile' ? 'is-active' : ''} aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')} aria-label="Xem dạng điện thoại"><DeviceMobile size={17} /></button></div><AppLink className="button button-secondary" to={publicTemplateRoutes.modernLuxePreview}><Eye size={16} /> Xem thiệp mẫu</AppLink><button className="button button-primary" type="button" disabled title="Sẽ được bật khi nối API lưu nội dung"><FloppyDisk size={16} /> Lưu thay đổi</button></div>
    </header>
    <div className="editor-workspace">
      <aside className="editor-sections" aria-label="Các phần của thiệp"><header><div><strong>Nội dung thiệp</strong><small>{visibleSections.length}/{order.length} phần đang hiển thị</small></div></header><ol>{order.map((key, index) => {
        const isEnabled = enabled.includes(key); const required = requiredSections.includes(key)
        return <li key={key} className={`${selected === key ? 'is-selected' : ''} ${isEnabled ? '' : 'is-disabled'}`}><button className="editor-section-select" type="button" onClick={() => setSelected(key)} aria-current={selected === key ? 'true' : undefined}><PencilSimple size={15} /><span>{sectionLabels[key]}{required ? <small>Bắt buộc</small> : null}</span></button><div className="editor-section-tools"><button type="button" onClick={() => moveSection(key, -1)} disabled={index === 0} aria-label={`Đưa ${sectionLabels[key]} lên`}><ArrowUp size={13} /></button><button type="button" onClick={() => moveSection(key, 1)} disabled={index === order.length - 1} aria-label={`Đưa ${sectionLabels[key]} xuống`}><ArrowDown size={13} /></button><button type="button" className={`editor-switch ${isEnabled ? 'is-on' : ''}`} role="switch" aria-checked={isEnabled} disabled={required} onClick={() => toggleSection(key)} aria-label={`${isEnabled ? 'Ẩn' : 'Hiện'} ${sectionLabels[key]}`}><span /></button></div></li>
      })}</ol></aside>
      <main className="editor-canvas" aria-label="Bản xem trước thiệp"><div className={`editor-preview ${device === 'mobile' ? 'is-mobile' : ''}`}><div className="editor-preview-paper">
        {visibleSections.includes('cover') ? <section className="preview-cover"><small>Save the date</small><h2>{content.bride} <i>&</i> {content.groom}</h2><p>{content.date}</p></section> : null}
        {visibleSections.includes('invitation') ? <section className="preview-invitation"><small>{content.invitationTitle}</small><p>{content.invitationMessage}</p></section> : null}
        {visibleSections.includes('families') ? <section className="preview-families"><span>Nhà gái<br /><b>Gia đình cô dâu</b></span><i /><span>Nhà trai<br /><b>Gia đình chú rể</b></span></section> : null}
        {visibleSections.includes('eventDetails') ? <section className="preview-event"><strong>{content.time} · {content.date}</strong><span><MapPin size={13} /> {content.venue} · {content.address}</span></section> : null}
        {visibleSections.includes('gallery') ? <section className="preview-gallery" aria-label="Ảnh mẫu"><i /><i /><i /></section> : null}
        {visibleSections.includes('rsvp') ? <section className="preview-rsvp"><strong>Bạn sẽ đến chung vui chứ?</strong><button type="button">Xác nhận tham dự</button></section> : null}
        {visibleSections.includes('gift') ? <section className="preview-gift"><small>Một lời chúc chân thành đã là món quà quý giá.</small></section> : null}
      </div></div></main>
      <aside className="editor-properties" aria-label={`Chỉnh sửa ${sectionLabels[selected]}`}><header><small>Đang chỉnh sửa</small><h2>{sectionLabels[selected]}</h2><p>Thay đổi được cập nhật ngay trên bản xem trước.</p></header><div className="editor-fields">
        {selected === 'cover' ? <><EditorField label="Tên cô dâu" value={content.bride} onChange={(value) => update('bride', value)} /><EditorField label="Tên chú rể" value={content.groom} onChange={(value) => update('groom', value)} /><EditorField label="Ngày cưới" value={content.date} onChange={(value) => update('date', value)} /></> : null}
        {selected === 'invitation' ? <><EditorField label="Tiêu đề lời mời" value={content.invitationTitle} onChange={(value) => update('invitationTitle', value)} /><EditorField label="Nội dung lời mời" value={content.invitationMessage} multiline onChange={(value) => update('invitationMessage', value)} /></> : null}
        {selected === 'eventDetails' ? <><EditorField label="Ngày" value={content.date} onChange={(value) => update('date', value)} /><EditorField label="Giờ" value={content.time} onChange={(value) => update('time', value)} /><EditorField label="Địa điểm" value={content.venue} onChange={(value) => update('venue', value)} /><EditorField label="Địa chỉ" value={content.address} onChange={(value) => update('address', value)} /></> : null}
        {!['cover', 'invitation', 'eventDetails'].includes(selected) ? <div className="editor-field-placeholder"><PencilSimple size={22} /><strong>Cấu hình cơ bản đã sẵn sàng</strong><p>Form chi tiết của phần này sẽ được bổ sung khi xác nhận nội dung và nối API.</p></div> : null}
      </div></aside>
    </div>
  </section>
}

function EditorField({ label, value, multiline, onChange }: { label: string; value: string; multiline?: boolean; onChange: (value: string) => void }) {
  return <label className="editor-field"><span>{label}</span>{multiline ? <textarea rows={5} value={value} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>
}
