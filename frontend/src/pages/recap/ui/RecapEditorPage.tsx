import { useState } from 'react'
import { Check, Eye, FloppyDisk, ImageSquare, Minus, MusicNotes, PaperPlaneTilt, Plus, Quotes, X } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { redSpiderLilyRecapTemplateConfig } from '../../../templates/recaps/red-spider-lily/template-config'
import './recap.css'
import './recap-accordion.css'
import './recap-repeatable.css'

type EditorSection = { key: string; label: string; detail: string; title: string; body: string; repeatable: boolean; maxItems?: number; maxMediaPerItem?: number; galleryField?: string; interaction?: string }

const labels: Record<string, { label: string; detail: string; title: string; body: string }> = {
  hero: { label: 'Mo dau', detail: 'Anh bia, ten cap doi va tagline', title: 'Minh & Anh', body: 'Anh chu dao, ten cap doi va loi dan ngan.' },
  ourStory: { label: 'Cau chuyen cua minh', detail: 'Loi ke ngan sau ngay cuoi', title: 'Loi dan', body: 'Mot loi ke ngan de dan vao album.' },
  chapters: { label: 'Nhung chuong da qua', detail: 'Chuoi ky uc theo trinh tu', title: 'Chapters', body: 'Them, xoa va sap xep cac chapter.' },
  moments: { label: 'Khoanh khac', detail: 'Album chon loc va caption', title: 'Moments', body: 'Moi nhom khoanh khac co cover rieng.' },
  photoDelivery: { label: 'Gui album', detail: 'Album noi bo va link ngoai', title: 'Photo delivery', body: 'Noi dung huong dan xem va tai anh.' },
  guestbook: { label: 'Loi chuc o lai', detail: 'Loi chuc da duyet va anh ho tro', title: 'Guestbook', body: 'Chon loi chuc va them anh trang loi chuc.' },
  peopleBehindTheDay: { label: 'Nhung nguoi phia sau', detail: 'Card nguoi va gallery khoanh khac', title: 'People behind the day', body: 'Moi card co cover va gallery nhieu anh.' },
  weddingFilm: { label: 'Thuoc phim', detail: 'Poster, video va thoi luong', title: 'Wedding film', body: 'Them poster va lien ket video.' },
  soundtrack: { label: 'Am thanh ky uc', detail: 'Track, artist va cover', title: 'Soundtrack', body: 'Them track tuy chon, khong autoplay.' },
  behindTheScenes: { label: 'Phia sau canh hoa', detail: 'Card hau truong va gallery', title: 'Behind the scenes', body: 'Moi card co cover va gallery nhieu anh.' },
  memoryCapsule: { label: 'Chuong tiep theo', detail: 'Thu gui cho nhung ngay sau', title: 'Memory capsule', body: 'Them loi nhan va anh ket.' },
  thankYou: { label: 'Loi cam on', detail: 'Loi ket va chu ky cap doi', title: 'Thank you', body: 'Loi cam on, chu ky va ngay thang.' },
}

const editorSections: EditorSection[] = redSpiderLilyRecapTemplateConfig.sections.map((section) => {
  const copy = labels[section.sectionKey] ?? { label: section.sectionKey, detail: 'Noi dung section', title: section.label, body: 'Noi dung section.' }
  const rule = 'repeatable' in section && section.repeatable ? section : null
  return { key: section.sectionKey, ...copy, repeatable: Boolean(rule), maxItems: rule?.maxItems, maxMediaPerItem: rule?.maxMediaPerItem, galleryField: rule && 'galleryField' in rule ? rule.galleryField : undefined, interaction: rule?.interaction }
})

export function RecapEditorPage() {
  const [active, setActive] = useState<string | null>('hero')
  const [saved, setSaved] = useState(true)
  const [published, setPublished] = useState(false)
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({ chapters: 3, moments: 3, peopleBehindTheDay: 3, behindTheScenes: 5 })
  const [galleryCounts, setGalleryCounts] = useState<Record<string, number>>({ peopleBehindTheDay: 2, behindTheScenes: 2 })
  const current = editorSections.find((section) => section.key === active)

  const updateCount = (key: string, delta: number, max: number) => {
    setItemCounts((value) => ({ ...value, [key]: Math.max(0, Math.min(max, (value[key] ?? 0) + delta)) }))
    setSaved(false)
  }
  const updateGallery = (key: string, delta: number, max: number) => {
    setGalleryCounts((value) => ({ ...value, [key]: Math.max(0, Math.min(max, (value[key] ?? 0) + delta)) }))
    setSaved(false)
  }

  return <section className="recap-editor-page" aria-labelledby="recap-editor-heading">
    <header className="recap-editor-toolbar"><div><p className="breadcrumb">Wedding Recap <span>/</span> Dau Son Bi Ngan</p><h1 id="recap-editor-heading">Ke lai ngay vui cua ban</h1></div><div className="recap-editor-actions"><span className={`recap-save-state ${saved ? 'is-saved' : ''}`}><Check size={14} /> {saved ? 'Da luu' : 'Chua luu'}</span><AppLink className="button button-secondary" to={publicTemplateRoutes.redSpiderLilyRecapPreview}><Eye size={16} /> Xem truoc</AppLink><button className="button button-secondary" type="button" onClick={() => setSaved(true)}><FloppyDisk size={16} /> Luu thay doi</button><button className="button button-primary" type="button" onClick={() => setPublished(true)}><PaperPlaneTilt size={16} /> {published ? 'Da chia se' : 'Chia se recap'}</button></div></header>
    <div className="recap-editor-layout"><aside className="recap-section-panel"><div className="recap-panel-intro"><span>DAU SON BI NGAN</span><strong>{editorSections.length} section trong cau chuyen</strong><small>Section va field duoc doc tu template config.</small></div>{editorSections.map((section, index) => <button className={`recap-section-item ${active === section.key ? 'is-active' : ''}`} key={section.key} type="button" aria-expanded={active === section.key} onClick={() => { setActive((value) => value === section.key ? null : section.key); setSaved(false) }}><span className="recap-section-index">{String(index + 1).padStart(2, '0')}</span><span><strong>{section.label}</strong><small>{section.detail}</small></span><Check className="recap-section-check" size={16} weight="bold" /></button>)}<div className="recap-editor-note"><MusicNotes size={18} /><span>Nhac va video duoc chon theo tung recap, khong gan cung vao theme.</span></div></aside>
      <main className={`recap-form-panel ${active ? '' : 'is-collapsed'}`} aria-hidden={!active}><div className="recap-form-eyebrow">Dang chinh sua</div><h2>{current?.title}</h2><p className="recap-form-lead">{current?.body}</p><label className="recap-field"><span>Tieu de hien thi</span><input defaultValue={current?.title ?? ''} onChange={() => setSaved(false)} /></label><label className="recap-field"><span>Loi ke</span><textarea defaultValue={current?.body ?? ''} rows={5} onChange={() => setSaved(false)} /></label>{current?.repeatable ? <div className="recap-repeatable-panel"><div className="recap-repeatable-heading"><div><strong>Danh sach co the lap</strong><small>{current.interaction}</small></div><button type="button" className="recap-add-button" onClick={() => updateCount(current.key, 1, current.maxItems ?? 24)}><Plus size={16} /> Them card</button></div><div className="recap-count-control"><span>{itemCounts[current.key] ?? 0} card</span><button type="button" aria-label="Giam so card" onClick={() => updateCount(current.key, -1, current.maxItems ?? 24)}><Minus size={16} /></button><button type="button" aria-label="Tang so card" onClick={() => updateCount(current.key, 1, current.maxItems ?? 24)}><Plus size={16} /></button><small>Toi da {current.maxItems}</small></div><div className="recap-repeatable-list">{Array.from({ length: Math.min(itemCounts[current.key] ?? 0, 6) }, (_, index) => <div className="recap-repeatable-item" key={index}><div><strong>Card {String(index + 1).padStart(2, '0')}</strong><small>{current.key === 'peopleBehindTheDay' ? 'Cover nguoi / nhom nguoi' : 'Cover khoanh khac'}</small></div><button type="button" className="recap-media-control" onClick={() => setSaved(false)}><ImageSquare size={16} /> Them anh cover</button>{current.galleryField ? <div className="recap-gallery-control"><span>{galleryCounts[current.key] ?? 0} anh trong gallery</span><button type="button" aria-label="Them anh vao gallery" onClick={() => updateGallery(current.key, 1, current.maxMediaPerItem ?? 12)}><Plus size={16} /></button><button type="button" aria-label="Giam anh trong gallery" onClick={() => updateGallery(current.key, -1, current.maxMediaPerItem ?? 12)}><X size={14} /></button></div> : null}</div>)}</div>{(itemCounts[current.key] ?? 0) > 6 ? <small className="recap-repeatable-overflow">Con {(itemCounts[current.key] ?? 0) - 6} card se hien trong rail va preview.</small> : null}</div> : null}<div className="recap-editor-tools"><button type="button" onClick={() => setSaved(false)}><ImageSquare size={18} /> Chon anh tu album</button><button type="button" onClick={() => setSaved(false)}><Quotes size={18} /> Chon loi chuc da duyet</button></div></main>
      <aside className="recap-live-preview"><div className="recap-live-preview-head"><span>Preview</span><small>Desktop</small></div><div className="recap-live-frame"><div className="recap-live-image"><span>Dau Son Bi Ngan</span><strong>Minh <i>&</i> Anh</strong><small>Ha Noi · 20.08.2026</small></div><div className="recap-live-caption">{current?.label ?? 'Chua chon phan'}</div></div><AppLink className="recap-open-preview" to={studioRoutes.recapThemes}>Doi giao dien recap</AppLink></aside></div>
  </section>
}
