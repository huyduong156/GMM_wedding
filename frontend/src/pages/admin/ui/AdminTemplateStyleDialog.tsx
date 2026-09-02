import { Check, FloppyDisk, Tag, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { adminTemplateStylesApi, type TemplateStyle } from '../../../shared/api/admin-template-styles'
import { notifications } from '../../../shared/ui/notifications/notifications'

export function AdminTemplateStyleDialog({ templateKey, templateName, close }: { templateKey: string; templateName: string; close: () => void }) {
  const [styles, setStyles] = useState<TemplateStyle[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void Promise.all([adminTemplateStylesApi.list(), adminTemplateStylesApi.templateStyles(templateKey)])
      .then(([catalog, assigned]) => { if (active) { setStyles(catalog.items); setSelectedIds(assigned.items.map((style) => style.id)) } })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Không thể tải danh mục của template.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [templateKey])

  const toggle = (styleId: string) => setSelectedIds((current) => current.includes(styleId) ? current.filter((id) => id !== styleId) : [...current, styleId])
  const save = async () => {
    setSaving(true); setError('')
    try { await adminTemplateStylesApi.replaceTemplateStyles(templateKey, selectedIds); await notifications.success('Đã cập nhật danh mục cho template'); close() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể lưu danh mục. Vui lòng thử lại.') }
    finally { setSaving(false) }
  }

  return <div className="admin-template-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) close() }}>
    <section className="admin-template-dialog admin-template-style-dialog" role="dialog" aria-modal="true" aria-labelledby="template-style-dialog-title">
      <header><div><Tag size={20} /><span><h2 id="template-style-dialog-title">Điều chỉnh danh mục</h2><p>{templateName} · {templateKey}</p></span></div><button type="button" aria-label="Đóng" onClick={close} disabled={saving}><X /></button></header>
      <div className="admin-template-style-content">
        <p className="admin-template-style-help">Chọn một hoặc nhiều danh mục dùng để phân loại template này.</p>
        {loading ? <div className="admin-style-skeleton" aria-label="Đang tải danh mục" /> : error ? <div className="admin-template-dialog-error" role="alert">{error}</div> : styles.length ? <div className="admin-template-style-checks">{styles.map((style) => <label key={style.id} className={`${selectedIds.includes(style.id) ? 'is-selected' : ''} ${style.status === 'ARCHIVED' ? 'is-archived' : ''}`}><input type="checkbox" checked={selectedIds.includes(style.id)} disabled={style.status === 'ARCHIVED' && !selectedIds.includes(style.id)} onChange={() => toggle(style.id)} /><span className="admin-template-style-check"><Check size={15} /><span><strong>{style.name}</strong><small>{style.key}{style.status === 'ARCHIVED' ? ' · Đã lưu trữ' : ''}</small></span></span></label>)}</div> : <div className="admin-assignment-empty"><Tag size={28} /><p>Chưa có danh mục phong cách. Hãy tạo danh mục trước khi gán cho template.</p></div>}
      </div>
      <footer className="admin-template-style-footer"><button className="button button-secondary" type="button" onClick={close} disabled={saving}>Hủy</button><button className="button button-primary" type="button" onClick={() => void save()} disabled={loading || saving || Boolean(error) || !styles.length}><FloppyDisk /> {saving ? 'Đang lưu…' : 'Lưu danh mục'}</button></footer>
    </section>
  </div>
}
