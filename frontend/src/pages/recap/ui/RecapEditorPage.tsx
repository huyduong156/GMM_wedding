import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Check, CheckCircle, Desktop, DeviceMobile, Eye, FloppyDisk, ImageSquare, Minus, MusicNotes, PaperPlaneTilt, Plus, Quotes, X } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { MediaAsset, RecapDraft, WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { useLiveEditorBridge } from '../../../shared/lib/live-template-editor'
import { EditorPreviewModal } from '../../../shared/ui/EditorPreviewModal'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { redSpiderLilyRecapTemplateConfig } from '../../../templates/recaps/red-spider-lily/template-config'
import { redSpiderLilyRecapFixture } from '../../../templates/recaps/red-spider-lily/fixture'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'
import './recap.css'
import './recap-accordion.css'
import './recap-repeatable.css'

type EditorSection = { key: string; label: string; detail: string; title: string; body: string; required: boolean; canToggle: boolean; canReorder: boolean; repeatable: boolean; maxItems?: number; maxMediaPerItem?: number; galleryField?: string; interaction?: string }

const labels: Record<string, { label: string; detail: string; title: string; body: string }> = {
  hero: { label: 'Mở đầu', detail: 'Ảnh bìa, tên cặp đôi và tagline', title: 'Minh & Anh', body: 'Ảnh chủ đạo, tên cặp đôi và lời dẫn ngắn.' },
  ourStory: { label: 'Câu chuyện của mình', detail: 'Lời kể ngắn sau ngày cưới', title: 'Lời dẫn', body: 'Một lời kể ngắn để dẫn vào album.' },
  chapters: { label: 'Những chương đã qua', detail: 'Chuỗi ký ức theo trình tự', title: 'Những chương ký ức', body: 'Thêm, xóa và sắp xếp các chapter.' },
  moments: { label: 'Những khoảnh khắc', detail: 'Album chọn lọc và caption', title: 'Những khoảnh khắc', body: 'Mỗi nhóm khoảnh khắc có ảnh bìa riêng.' },
  photoDelivery: { label: 'Gửi album', detail: 'Album nội bộ hoặc URL bên ngoài', title: 'Gửi album', body: 'Nội dung hướng dẫn xem và tải ảnh.' },
  guestbook: { label: 'Lời chúc ở lại', detail: 'Lời chúc đã duyệt và ảnh hỗ trợ', title: 'Lời chúc ở lại', body: 'Chọn lời chúc và thêm ảnh trang lời chúc.' },
  peopleBehindTheDay: { label: 'Những người phía sau', detail: 'Card người và gallery khoảnh khắc', title: 'Những người phía sau', body: 'Mỗi card có ảnh bìa và gallery nhiều ảnh.' },
  weddingFilm: { label: 'Thước phim', detail: 'Poster, video và thời lượng', title: 'Thước phim ngày cưới', body: 'Thêm poster và liên kết video.' },
  soundtrack: { label: 'Âm thanh ký ức', detail: 'Track, nghệ sĩ và ảnh bìa', title: 'Âm thanh ký ức', body: 'Thêm track tùy chọn, không tự phát.' },
  behindTheScenes: { label: 'Phía sau cánh hoa', detail: 'Card hậu trường và gallery', title: 'Phía sau cánh hoa', body: 'Mỗi card có ảnh bìa và gallery nhiều ảnh.' },
  memoryCapsule: { label: 'Chương tiếp theo', detail: 'Thư gửi cho những ngày sau', title: 'Chương tiếp theo', body: 'Thêm lời nhắn và ảnh kết.' },
  thankYou: { label: 'Lời cảm ơn', detail: 'Lời kết và chữ ký cặp đôi', title: 'Lời cảm ơn', body: 'Lời cảm ơn, chữ ký và ngày tháng.' },
}

const editorSections: EditorSection[] = redSpiderLilyRecapTemplateConfig.sections.map((section) => {
  const copy = labels[section.sectionKey] ?? { label: section.sectionKey, detail: 'Nội dung section', title: section.label, body: 'Nội dung section.' }
  const rule = 'repeatable' in section && section.repeatable ? section : null
  return { key: section.sectionKey, ...copy, required: section.required, canToggle: section.canToggle, canReorder: section.canReorder, repeatable: Boolean(rule), maxItems: rule?.maxItems, maxMediaPerItem: rule?.maxMediaPerItem, galleryField: rule && 'galleryField' in rule ? rule.galleryField : undefined, interaction: rule?.interaction }
})

const clone = <T,>(value: T): T => structuredClone(value)
const mergeRecords = (base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> => Object.entries(override).reduce((result, [key, value]) => {
  const baseValue = result[key]
  result[key] = value && typeof value === 'object' && !Array.isArray(value) && baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)
    ? mergeRecords(baseValue as Record<string, unknown>, value as Record<string, unknown>)
    : value
  return result
}, clone(base))
const mergeContent = (stored: Record<string, unknown>): RedSpiderLilyRecapContent => mergeRecords(clone(redSpiderLilyRecapFixture.content) as unknown as Record<string, unknown>, stored) as unknown as RedSpiderLilyRecapContent
const getPath = (value: Record<string, unknown>, path: string) => path.split('.').reduce<unknown>((current, part) => current && typeof current === 'object' ? (current as Record<string, unknown>)[part] : undefined, value)
const setPath = (value: RedSpiderLilyRecapContent, path: string, nextValue: unknown): RedSpiderLilyRecapContent => { const next = clone(value) as Record<string, unknown>; const parts = path.split('.'); let cursor = next; parts.slice(0, -1).forEach((part) => { cursor[part] = cursor[part] && typeof cursor[part] === 'object' ? cursor[part] : {}; cursor = cursor[part] as Record<string, unknown> }); cursor[parts.at(-1)!] = nextValue; return next as RedSpiderLilyRecapContent }
const sectionContentFields: Record<string, { title: string; body: string }> = {
  hero: { title: 'hero.couple', body: 'hero.tagline' },
  ourStory: { title: 'ourStory.title', body: 'ourStory.body' },
  photoDelivery: { title: 'photoDelivery.title', body: 'photoDelivery.body' },
  thankYou: { title: 'thankYou.title', body: 'thankYou.body' },
  guestbook: { title: 'optional.guestbook.title', body: 'optional.guestbook.body' },
  peopleBehindTheDay: { title: 'optional.peopleBehindTheDay.title', body: 'optional.peopleBehindTheDay.body' },
  weddingFilm: { title: 'optional.weddingFilm.title', body: 'optional.weddingFilm.body' },
  soundtrack: { title: 'optional.soundtrack.title', body: 'optional.soundtrack.body' },
  behindTheScenes: { title: 'optional.behindTheScenes.title', body: 'optional.behindTheScenes.body' },
  memoryCapsule: { title: 'optional.memoryCapsule.title', body: 'optional.memoryCapsule.body' },
}

const recapTextRules = [
  ['hero.couple', 80, true], ['hero.date', 40, true], ['hero.place', 80, false], ['hero.tagline', 240, true], ['hero.ctaLabel', 80, true],
  ['ourStory.eyebrow', 80, false], ['ourStory.title', 180, true], ['ourStory.body', 800, true], ['ourStory.quote', 300, false],
  ['photoDelivery.eyebrow', 80, false], ['photoDelivery.title', 180, true], ['photoDelivery.body', 800, true], ['photoDelivery.ctaLabel', 80, true], ['photoDelivery.albumUrl', 2048, false],
  ['thankYou.title', 180, true], ['thankYou.body', 800, true], ['thankYou.signature', 100, true], ['thankYou.date', 40, true],
  ['optional.guestbook.title', 180, true], ['optional.guestbook.body', 800, true], ['optional.guestbook.intro', 500, false],
  ['optional.peopleBehindTheDay.title', 180, true], ['optional.peopleBehindTheDay.body', 800, true], ['optional.weddingFilm.title', 180, true], ['optional.weddingFilm.body', 800, true], ['optional.weddingFilm.duration', 20, false], ['optional.weddingFilm.ctaLabel', 80, false],
  ['optional.soundtrack.title', 180, true], ['optional.soundtrack.body', 800, true], ['optional.soundtrack.track', 120, false], ['optional.soundtrack.artist', 120, false], ['optional.soundtrack.duration', 20, false], ['optional.behindTheScenes.title', 180, true], ['optional.behindTheScenes.body', 800, true], ['optional.memoryCapsule.title', 180, true], ['optional.memoryCapsule.body', 800, true], ['optional.memoryCapsule.date', 80, false],
] as const

function validateRecapContent(content: RedSpiderLilyRecapContent) {
  const errors: string[] = []
  for (const [path, max, required] of recapTextRules) {
    const value = getPath(content as unknown as Record<string, unknown>, path)
    if (required && (typeof value !== 'string' || !value.trim())) errors.push(`${path} khong duoc de trong`)
    else if (typeof value === 'string' && value.length > max) errors.push(`${path} vuot qua ${max} ky tu`)
    else if (path === 'photoDelivery.albumUrl' && typeof value === 'string' && value.trim()) { try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol)) errors.push(`${path} khong phai URL hop le`) } catch { errors.push(`${path} khong phai URL hop le`) } }
  }
  for (const [path, min, max] of [['chapters', 1, 12], ['moments', 1, 12], ['optional.peopleBehindTheDay.people', 0, 24], ['optional.behindTheScenes.items', 0, 24]] as const) {
    const value = getPath(content as unknown as Record<string, unknown>, path)
    if (Array.isArray(value) && (value.length < min || value.length > max)) errors.push(`${path} phai co tu ${min} den ${max} card`)
  }
  for (const [path, fields] of [['chapters', [['dateLabel', 40, true], ['title', 180, true], ['description', 360, true]]], ['moments', [['title', 180, true], ['description', 360, true]]], ['optional.peopleBehindTheDay.people', [['name', 100, true], ['role', 160, true]]], ['optional.behindTheScenes.items', [['title', 180, true], ['caption', 360, true]]] ] as const) {
    const items = getPath(content as unknown as Record<string, unknown>, path)
    if (!Array.isArray(items)) continue
    items.forEach((item, index) => fields.forEach(([field, max, required]) => { const value = item && typeof item === 'object' ? (item as Record<string, unknown>)[field] : undefined; if (required && (typeof value !== 'string' || !value.trim())) errors.push(`${path}.${index}.${field} khong duoc de trong`); else if (typeof value === 'string' && value.length > max) errors.push(`${path}.${index}.${field} vuot qua ${max} ky tu`) }))
  }
  return errors
}

type SectionFormProps = {
  section: EditorSection
  content?: RedSpiderLilyRecapContent
  updateContent?: (path: string, value: unknown) => void
  titleValue: string
  bodyValue: string
  onTitleChange: (value: string) => void
  onBodyChange: (value: string) => void
  itemCount: number
  galleryCount: number
  updateCount: (key: string, delta: number, max: number) => void
  updateGallery: (key: string, delta: number, max: number) => void
  onChange: () => void
  isOpen: boolean
}

function SectionForm({ section, content, updateContent, titleValue, bodyValue, onTitleChange, onBodyChange, itemCount, galleryCount, updateCount, updateGallery, onChange, isOpen }: SectionFormProps) {
  if (content && updateContent) return <DetailedSectionForm section={section} content={content} update={updateContent} isOpen={isOpen} />
  return <div className={`recap-accordion ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}><div className="recap-accordion-content"><div className="recap-form-panel"><div className="recap-form-eyebrow">Đang chỉnh sửa</div><h2>{titleValue || section.title}</h2><p className="recap-form-lead">{bodyValue || section.body}</p><label className="recap-field"><span>Tiêu đề hien thi</span><input value={titleValue} onChange={(event) => onTitleChange(event.target.value)} tabIndex={isOpen ? 0 : -1} /></label><label className="recap-field"><span>Lời kể</span><textarea value={bodyValue} onChange={(event) => onBodyChange(event.target.value)} rows={5} tabIndex={isOpen ? 0 : -1} /></label>{section.repeatable ? <div className="recap-repeatable-panel"><div className="recap-repeatable-heading"><div><strong>Danh sách có thể lặp</strong><small>{section.interaction}</small></div><button type="button" className="recap-add-button" onClick={() => updateCount(section.key, 1, section.maxItems ?? 24)} tabIndex={isOpen ? 0 : -1}><Plus size={16} /> Thêm card</button></div><div className="recap-count-control"><span>{itemCount} card</span><button type="button" aria-label="Giảm số card" onClick={() => updateCount(section.key, -1, section.maxItems ?? 24)} tabIndex={isOpen ? 0 : -1}><Minus size={16} /></button><button type="button" aria-label="Tăng số card" onClick={() => updateCount(section.key, 1, section.maxItems ?? 24)} tabIndex={isOpen ? 0 : -1}><Plus size={16} /></button><small>Tối đa {section.maxItems}</small></div><div className="recap-repeatable-list">{Array.from({ length: Math.min(itemCount, 6) }, (_, index) => <div className="recap-repeatable-item" key={index}><div><strong>Card {String(index + 1).padStart(2, '0')}</strong><small>{section.key === 'peopleBehindTheDay' ? 'Cover người / nhóm người' : 'Cover khoảnh khắc'}</small></div><button type="button" className="recap-media-control" onClick={onChange} tabIndex={isOpen ? 0 : -1}><ImageSquare size={16} /> Thêm ảnh cover</button>{section.galleryField ? <div className="recap-gallery-control"><span>{galleryCount} anh trong gallery</span><button type="button" aria-label="Thêm ảnh vào gallery" onClick={() => updateGallery(section.key, 1, section.maxMediaPerItem ?? 12)} tabIndex={isOpen ? 0 : -1}><Plus size={16} /></button><button type="button" aria-label="Giảm ảnh trong gallery" onClick={() => updateGallery(section.key, -1, section.maxMediaPerItem ?? 12)} tabIndex={isOpen ? 0 : -1}><X size={14} /></button></div> : null}</div>)}</div>{itemCount > 6 ? <small className="recap-repeatable-overflow">Còn {itemCount - 6} card sẽ hiện trong rail và preview.</small> : null}</div> : null}<div className="recap-editor-tools"><button type="button" onClick={onChange} tabIndex={isOpen ? 0 : -1}><ImageSquare size={18} /> Chọn ảnh từ album</button><button type="button" onClick={onChange} tabIndex={isOpen ? 0 : -1}><Quotes size={18} /> Chọn lời chúc đã duyệt</button></div></div></div></div>
}

const fieldLimits: Record<string, number> = { couple: 80, date: 40, place: 80, tagline: 240, ctaLabel: 80, eyebrow: 80, title: 180, body: 800, quote: 300, signature: 100, dateLabel: 40, description: 360, name: 100, role: 160, caption: 360, intro: 500, duration: 20, track: 120, artist: 120 }

function RecapTextField({ label, path, value, update, multiline = false, maxLength, type = 'text' }: { label: string; path: string; value: string; update: (path: string, value: unknown) => void; multiline?: boolean; maxLength?: number; type?: 'text' | 'url' }) {
  const limit = maxLength ?? fieldLimits[path.split('.').at(-1) ?? '']
  return <label className="recap-field"><span>{label}{limit ? <small>{value.length}/{limit}</small> : null}</span>{multiline ? <textarea value={value} maxLength={limit} rows={4} onChange={(event) => update(path, event.target.value)} /> : <input type={type} value={value} maxLength={limit} onChange={(event) => update(path, event.target.value)} />}</label>
}

type RecapMediaContextValue = { assets: MediaAsset[]; selectedIds: Set<string>; openManager: () => void }
const RecapMediaContext = createContext<RecapMediaContextValue | null>(null)

function RecapMediaManager({ open, assets, selectedIds, loading, uploading, error, onClose, onUpload, onToggle }: { open: boolean; assets: MediaAsset[]; selectedIds: Set<string>; loading: boolean; uploading: boolean; error: string; onClose: () => void; onUpload: (files: FileList | null) => void; onToggle: (asset: MediaAsset) => void }) {
  if (!open) return null
  return <div className="recap-media-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="recap-media-modal" role="dialog" aria-modal="true" aria-labelledby="recap-media-modal-title"><header><div><span className="recap-form-eyebrow">Album hệ thống</span><h3 id="recap-media-modal-title">Quản lý ảnh</h3></div><button type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button></header><label className="recap-upload-dropzone"><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={(event) => { onUpload(event.target.files); event.target.value = '' }} /><ImageSquare size={22} /><strong>{uploading ? 'Đang tải ảnh lên…' : 'Tải ảnh lên'}</strong><span>JPG, PNG hoặc WebP · tối đa 10MB mỗi ảnh</span></label>{error ? <p className="field-error" role="alert">{error}</p> : null}{loading ? <p className="recap-media-modal-empty">Đang tải kho ảnh…</p> : assets.length ? <div className="recap-uploaded-grid">{assets.map((asset) => <button type="button" key={asset.id} className={`recap-media-asset ${selectedIds.has(asset.id) ? 'is-selected' : ''}`} onClick={() => onToggle(asset)}><img src={asset.publicUrl} alt={asset.originalName ?? 'Ảnh đã tải lên'} /><span>{selectedIds.has(asset.id) ? <Check size={16} /> : null}{asset.originalName ?? 'Ảnh'}</span></button>)}</div> : <p className="recap-media-modal-empty">Chưa có ảnh. Hãy tải ảnh đầu tiên lên.</p>}<footer><button type="button" className="button button-primary" onClick={onClose}>Xong</button></footer></section></div>
}

function PhotoDeliverySourceField({ content, update }: { content: RedSpiderLilyRecapContent; update: (path: string, value: unknown) => void }) {
  const albums = content.photoDelivery.albums ?? []
  const [sourceMode, setSourceMode] = useState<'internal' | 'external'>(content.photoDelivery.albumUrl ? 'external' : 'internal')
  const external = sourceMode === 'external'
  const selectedAlbum = albums.find((album) => album.type === 'INTERNAL_ALBUM')
  useEffect(() => { if (content.photoDelivery.albumUrl) setSourceMode('external') }, [content.photoDelivery.albumUrl])
  const media = useContext(RecapMediaContext)
  const setMode = (mode: string) => {
    setSourceMode(mode === 'external' ? 'external' : 'internal')
    if (mode === 'external') { update('photoDelivery.albums', []); return }
    update('photoDelivery.albumUrl', '')
    update('photoDelivery.albums', [{ type: 'INTERNAL_ALBUM', albumId: selectedAlbum?.albumId ?? 'guest-gallery' }])
  }
  return <div className="recap-source-field"><span className="recap-source-label">Nguồn album ảnh</span><div className="recap-source-tabs" role="tablist" aria-label="Nguồn album ảnh"><button type="button" role="tab" aria-selected={!external} className={!external ? 'is-active' : ''} onClick={() => setMode('internal')}>Album hệ thống</button><button type="button" role="tab" aria-selected={external} className={external ? 'is-active' : ''} onClick={() => setMode('external')}>URL bên ngoài</button></div>{external ? <RecapTextField label="URL album ảnh" path="photoDelivery.albumUrl" value={content.photoDelivery.albumUrl ?? ''} update={update} type="url" maxLength={2048} /> : <div className="recap-album-library"><div className="recap-album-actions"><button type="button" className="recap-media-control" onClick={() => media?.openManager()}><ImageSquare size={16} /> Tải ảnh lên</button><button type="button" className="recap-media-control" onClick={() => media?.openManager()}><ImageSquare size={16} /> Chọn ảnh đã tải lên</button></div><small className="recap-album-hint">{media?.selectedIds.size ? `Đã chọn ${media.selectedIds.size} ảnh từ kho media.` : 'Mở trình quản lý ảnh để tải lên hoặc chọn ảnh.'}</small></div>}</div>
}

function CardList({ path, fields, content, update, isOpen }: { path: string; fields: Array<{ key: string; label: string; multiline?: boolean; maxLength?: number }>; content: RedSpiderLilyRecapContent; update: (path: string, value: unknown) => void; isOpen: boolean }) {
  const items = (getPath(content as unknown as Record<string, unknown>, path) as Array<Record<string, unknown>> | undefined) ?? []
  const isMoments = path.endsWith('moments')
  const isChapters = path.endsWith('chapters')
  const isPeople = path.endsWith('people')
  const add = () => {
    const role = isMoments ? 'moment' : isChapters ? 'chapter' : isPeople ? 'person' : 'behind-the-scenes'
    const item = isPeople ? { id: `person-${Date.now()}`, name: '', role: '', media: { src: '', alt: 'Anh chan dung', role } } : path.endsWith('items') ? { id: `behind-${Date.now()}`, title: '', caption: '', media: { src: '', alt: 'Anh hau truong', role } } : { id: `${path}-${Date.now()}`, ...(isChapters ? { dateLabel: '' } : {}), title: '', description: '', cover: { src: '', alt: 'Ảnh cover', role } }
    update(path, [...items, item])
  }
  return <div className="recap-card-editor"><div className="recap-repeatable-heading"><div><strong>{isChapters ? 'Các chapter' : isMoments ? 'Các nhóm khoảnh khắc' : isPeople ? 'Những người phía sau' : 'Các khoảnh khắc hậu trường'}</strong><small>{items.length} card</small></div><button type="button" className="recap-add-button" onClick={add} disabled={!isOpen}><Plus size={16} /> Thêm card</button></div>{items.map((item, index) => <article className="recap-card-editor-item" key={String(item.id ?? index)}><header><strong>Card {String(index + 1).padStart(2, '0')}</strong><button type="button" className="recap-card-remove" onClick={() => update(path, items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Xóa card ${index + 1}`}><X size={15} /></button></header>{fields.map((field) => <RecapTextField key={field.key} label={field.label} path={`${path}.${index}.${field.key}`} value={String(item[field.key] ?? '')} update={update} multiline={field.multiline} maxLength={field.maxLength} />)}<button type="button" className="recap-media-control" disabled><ImageSquare size={16} /> Thêm ảnh cover sau</button></article>)}{!items.length ? <small className="recap-card-empty">Chưa có card. Thêm card để bắt đầu nhập nội dung.</small> : null}</div>
}

function DetailedSectionForm({ section, content, update, isOpen }: { section: EditorSection; content: RedSpiderLilyRecapContent; update: (path: string, value: unknown) => void; isOpen: boolean }) {
  const values = sectionContentFields[section.key]
  const value = (path: string, fallback: string) => String(getPath(content as unknown as Record<string, unknown>, path) ?? fallback)
  const field = (label: string, path: string, multiline = false, maxLength?: number) => <RecapTextField label={label} path={path} value={value(path, '')} update={update} multiline={multiline} maxLength={maxLength} />
  return <div className={`recap-accordion ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}><div className="recap-accordion-content"><div className="recap-form-panel"><div className="recap-form-eyebrow">Đang chỉnh sửa</div><h2>{value(values?.title ?? '', section.title)}</h2><p className="recap-form-lead">{value(values?.body ?? '', section.body)}</p>{section.key === 'hero' ? <>{field('Tên cặp đôi', 'hero.couple')}{field('Ngày hiển thị', 'hero.date')}{field('Địa điểm', 'hero.place')}{field('Tagline', 'hero.tagline', true)}{field('Nhãn nút mở album', 'hero.ctaLabel')}</> : section.key === 'ourStory' ? <>{field('Dòng mở đầu', 'ourStory.eyebrow')}{field('Tiêu đề lời dẫn', 'ourStory.title', true)}{field('Nội dung loi dan', 'ourStory.body', true)}{field('Trích dẫn', 'ourStory.quote', true)}</> : section.key === 'photoDelivery' ? <><>{field('Dòng mở đầu', 'photoDelivery.eyebrow')}{field('Tiêu đề', 'photoDelivery.title', true)}{field('Nội dung', 'photoDelivery.body', true)}{field('Nhãn nút album', 'photoDelivery.ctaLabel')}</><PhotoDeliverySourceField content={content} update={update} /></> : section.key === 'thankYou' ? <>{field('Tiêu đề lời cảm ơn', 'thankYou.title', true)}{field('Nội dung', 'thankYou.body', true)}{field('Chữ ký', 'thankYou.signature')}{field('Ngày kết', 'thankYou.date')}</> : section.key === 'chapters' ? <CardList path="chapters" fields={[{ key: 'dateLabel', label: 'Ngày / mốc thời gian' }, { key: 'title', label: 'Tiêu đề chapter' }, { key: 'description', label: 'Mô tả', multiline: true }]} content={content} update={update} isOpen={isOpen} /> : section.key === 'moments' ? <CardList path="moments" fields={[{ key: 'title', label: 'Tên nhóm khoảnh khắc' }, { key: 'description', label: 'Mô tả', multiline: true }]} content={content} update={update} isOpen={isOpen} /> : section.key === 'peopleBehindTheDay' ? <><>{field('Tiêu đề section', 'optional.peopleBehindTheDay.title', true)}{field('Mô tả section', 'optional.peopleBehindTheDay.body', true)}</><CardList path="optional.peopleBehindTheDay.people" fields={[{ key: 'name', label: 'Tên người / nhóm' }, { key: 'role', label: 'Vai trò / ghi chú', multiline: true }]} content={content} update={update} isOpen={isOpen} /></> : section.key === 'behindTheScenes' ? <><>{field('Tiêu đề section', 'optional.behindTheScenes.title', true)}{field('Mô tả section', 'optional.behindTheScenes.body', true)}</><CardList path="optional.behindTheScenes.items" fields={[{ key: 'title', label: 'Tiêu đề khoảnh khắc' }, { key: 'caption', label: 'Ghi chú', multiline: true }]} content={content} update={update} isOpen={isOpen} /></> : section.key === 'guestbook' ? <>{field('Tiêu đề section', 'optional.guestbook.title', true)}{field('Mô tả section', 'optional.guestbook.body', true)}{field('Lời dẫn lời chúc', 'optional.guestbook.intro', true)}</> : section.key === 'weddingFilm' ? <>{field('Tiêu đề section', 'optional.weddingFilm.title', true)}{field('Mô tả section', 'optional.weddingFilm.body', true)}{field('Thời lượng video', 'optional.weddingFilm.duration')}{field('Nhãn nút video', 'optional.weddingFilm.ctaLabel')}</> : section.key === 'soundtrack' ? <>{field('Tiêu đề section', 'optional.soundtrack.title', true)}{field('Mô tả section', 'optional.soundtrack.body', true)}{field('Tên track', 'optional.soundtrack.track')}{field('Nghệ sĩ', 'optional.soundtrack.artist')}{field('Thời lượng', 'optional.soundtrack.duration')}</> : section.key === 'memoryCapsule' ? <>{field('Tiêu đề section', 'optional.memoryCapsule.title', true)}{field('Lời nhắn', 'optional.memoryCapsule.body', true)}{field('Mốc thời gian', 'optional.memoryCapsule.date')}</> : null}<div className="recap-editor-tools"><button type="button" className="recap-media-control" disabled><ImageSquare size={18} /> Thêm ảnh sau</button><button type="button" className="recap-media-control" disabled><Quotes size={18} /> Chọn lời chúc đã duyệt</button></div></div></div></div>
}

export function RecapEditorPage() {
  const { navigate } = useNavigation()
  const workspace = useOptionalWeddingWorkspace()
  const wedding = workspace?.activeWedding ?? null
  const [active, setActive] = useState<string | null>('hero')
  const [content, setContent] = useState<RedSpiderLilyRecapContent>(() => clone(redSpiderLilyRecapFixture.content))
  const [recap, setRecap] = useState<RecapDraft | null>(null)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [order, setOrder] = useState(() => editorSections.map((section) => section.key))
  const [enabled, setEnabled] = useState(() => editorSections.map((section) => section.key))
  const [saved, setSaved] = useState(true)
  const [published, setPublished] = useState(false)
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({ chapters: 3, moments: 3, peopleBehindTheDay: 3, behindTheScenes: 5 })
  const [galleryCounts, setGalleryCounts] = useState<Record<string, number>>({ peopleBehindTheDay: 2, behindTheScenes: 2 })
  const [history, setHistory] = useState<Array<{ order: string[]; enabled: string[] }>>([])
  const [future, setFuture] = useState<Array<{ order: string[]; enabled: string[] }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [mediaManagerOpen, setMediaManagerOpen] = useState(false)
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaUploading, setMediaUploading] = useState(false)
  const [mediaError, setMediaError] = useState('')
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const visibleSections = order.filter((key) => enabled.includes(key))
  const { frameRef, ready, sendState, scrollToSection } = useLiveEditorBridge<{ data: RedSpiderLilyRecapContent; sectionConfig: { enabled: string[]; order: string[] } }, string>({ data: content, sectionConfig: { enabled, order } })

  const load = useCallback(async () => {
    if (!wedding) { setLoading(false); return }
    setLoading(true); setError('')
    try {
      const result = (await weddingApi.recap(wedding.id)).recap
      if (!result) { setError(''); setRecap(null); return }
      setRecap(result)
      setContent(mergeContent(result.content))
      setOrder(result.sectionConfig.order)
      setEnabled(result.sectionConfig.enabled)
      setActive(result.sectionConfig.order[0] ?? 'hero')
      setSaved(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải nội dung recap.')
    } finally { setLoading(false) }
  }, [wedding])

  useEffect(() => { void load() }, [load])

  const loadMedia = useCallback(async () => {
    if (!wedding) return
    setMediaLoading(true); setMediaError('')
    try { setMediaAssets((await weddingApi.media(wedding.id)).items.filter((asset) => asset.status === 'READY')) }
    catch (cause) { setMediaError(cause instanceof Error ? cause.message : 'Không thể tải kho ảnh.') }
    finally { setMediaLoading(false) }
  }, [wedding])
  useEffect(() => { void loadMedia() }, [loadMedia])

  useEffect(() => {
    const receiveDeviceChange = (event: Event) => {
      const next = (event as CustomEvent<'desktop' | 'mobile'>).detail
      if (next === 'desktop' || next === 'mobile') setDevice(next)
    }
    window.addEventListener('gmm-editor-preview-device-change', receiveDeviceChange)
    return () => window.removeEventListener('gmm-editor-preview-device-change', receiveDeviceChange)
  }, [])
  useEffect(() => {
    if (ready && active) scrollToSection(active)
  }, [active, ready, scrollToSection])

  const checkpoint = () => { setHistory((items) => [...items.slice(-49), { order: [...order], enabled: [...enabled] }]); setFuture([]) }
  const moveSection = (key: string, direction: -1 | 1) => { const index = order.indexOf(key); const nextIndex = index + direction; const section = editorSections.find((item) => item.key === key); if (!section?.canReorder || nextIndex < 0 || nextIndex >= order.length) return; checkpoint(); const next = [...order]; [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; setOrder(next); setSaved(false) }
  const toggleSection = (section: EditorSection) => { if (!section.canToggle) return; checkpoint(); setEnabled((items) => items.includes(section.key) ? items.filter((key) => key !== section.key) : [...items, section.key]); setSaved(false) }
  const undo = () => { const previous = history.at(-1); if (!previous) return; setHistory((items) => items.slice(0, -1)); setFuture((items) => [...items, { order: [...order], enabled: [...enabled] }]); setOrder(previous.order); setEnabled(previous.enabled); setSaved(false) }
  const redo = () => { const next = future.at(-1); if (!next) return; setFuture((items) => items.slice(0, -1)); setHistory((items) => [...items, { order: [...order], enabled: [...enabled] }]); setOrder(next.order); setEnabled(next.enabled); setSaved(false) }

  const updateCount = (key: string, delta: number, max: number) => {
    setItemCounts((value) => ({ ...value, [key]: Math.max(0, Math.min(max, (value[key] ?? 0) + delta)) }))
    setSaved(false)
  }
  const updateGallery = (key: string, delta: number, max: number) => {
    setGalleryCounts((value) => ({ ...value, [key]: Math.max(0, Math.min(max, (value[key] ?? 0) + delta)) }))
    setSaved(false)
  }
  const updateContent = (path: string, value: unknown) => {
    setContent((current) => setPath(current, path, value))
    setSaved(false)
  }
  const selectedMediaIds = new Set((recap?.mediaItems ?? []).map((item) => item.mediaAssetId))
  const toggleMedia = (asset: MediaAsset) => {
    setRecap((current) => {
      if (!current) return current
      const mediaItems = selectedMediaIds.has(asset.id)
        ? current.mediaItems.filter((item) => item.mediaAssetId !== asset.id)
        : [...current.mediaItems, { id: asset.id, mediaAssetId: asset.id, caption: null, sortOrder: current.mediaItems.length, publicUrl: asset.publicUrl }]
      return { ...current, mediaItems: mediaItems.map((item, index) => ({ ...item, sortOrder: index })) }
    })
    setSaved(false)
  }
  const uploadRecapMedia = async (files: FileList | null) => {
    if (!wedding || !files?.length) return
    const accepted = [...files].filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 10 * 1024 * 1024)
    if (accepted.length !== files.length) setMediaError('Chỉ nhận ảnh JPG, PNG hoặc WebP, tối đa 10MB mỗi ảnh.')
    if (!accepted.length) return
    setMediaUploading(true)
    try {
      const uploaded = await Promise.all(accepted.map((file) => weddingApi.uploadMedia(wedding.id, file)))
      setMediaAssets((current) => [...uploaded, ...current.filter((asset) => !uploaded.some((next) => next.id === asset.id))])
      setMediaError('')
    } catch (cause) { setMediaError(cause instanceof Error ? cause.message : 'Không thể tải ảnh lên kho media.') }
    finally { setMediaUploading(false) }
  }
  const save = async (): Promise<boolean> => {
    if (!wedding || !recap || saving) return false
    const validationErrors = validateRecapContent(content)
    if (validationErrors.length) { setError(validationErrors[0]); return false }
    setSaving(true); setError('')
    try {
      const result = await weddingApi.saveRecap(wedding.id, {
        templateVersionId: recap.templateVersion.id,
        title: recap.title,
        thankYouMessage: recap.thankYouMessage,
        ogTitle: recap.ogTitle,
        ogDescription: recap.ogDescription,
        ogImageUrl: recap.ogImageUrl,
        content: content as unknown as Record<string, unknown>,
        themeConfig: recap.themeConfig,
        sectionConfig: { enabled, order },
        mediaItems: recap.mediaItems.map((item) => ({ mediaAssetId: item.mediaAssetId, caption: item.caption, sortOrder: item.sortOrder })),
        wishSelections: recap.wishSelections.map((item) => ({ wishId: item.wishId, sortOrder: item.sortOrder })),
        revision: recap.revision,
      })
      setRecap(result.recap); setContent(mergeContent(result.recap.content)); setSaved(true)
      notifications.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu recap', showConfirmButton: false, timer: 1800, timerProgressBar: true })
      return true
    } catch (cause) {
      setError(cause instanceof WeddingApiError && cause.status === 409 ? 'Nội dung vừa thay đổi ở nơi khác. Hãy tải lại để tiếp tục.' : cause instanceof Error ? cause.message : 'Không thể lưu nội dung recap.')
      if (cause instanceof WeddingApiError && cause.code === 'RECAP_REVISION_CONFLICT') await load()
      return false
    } finally { setSaving(false) }
  }

  const hasUnsavedChanges = saved === false
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (hasUnsavedChanges) { event.preventDefault(); event.returnValue = '' } }
    const intercept = (event: MouseEvent) => {
      if (!hasUnsavedChanges || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank') return
      const target = new URL(anchor.href, window.location.href)
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname) return
      event.preventDefault(); event.stopPropagation(); setPendingNavigation(`${target.pathname}${target.search}${target.hash}`)
    }
    window.addEventListener('beforeunload', warn); document.addEventListener('click', intercept, true)
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', intercept, true) }
  }, [hasUnsavedChanges])

  if (!wedding || (!loading && !recap)) return <section className="recap-editor-empty" aria-labelledby="recap-editor-empty-heading"><div className="recap-editor-empty-card"><CheckCircle size={48} weight="duotone" aria-hidden="true" /><h1 id="recap-editor-empty-heading">Bạn chưa chọn giao diện recap</h1><p>Hãy chọn một giao diện trong kho recap trước khi bắt đầu chỉnh sửa.</p><AppLink className="button button-primary" to={studioRoutes.recapThemes}>Đi đến kho giao diện recap</AppLink></div></section>

  return <RecapMediaContext.Provider value={{ assets: mediaAssets, selectedIds: selectedMediaIds, openManager: () => { setMediaError(''); setMediaManagerOpen(true) } }}><section className="recap-editor-page" aria-labelledby="recap-editor-heading">
    <header className="recap-editor-toolbar"><div className="recap-editor-title"><AppLink to={studioRoutes.recapThemes} ariaLabel="Quay lại kho giao diện recap"><ArrowLeft size={18} /></AppLink><div><p className="breadcrumb">Wedding Recap <span>/</span> Dấu Son Bỉ Ngạn</p><h1 id="recap-editor-heading">Kể lại ngày vui của bạn</h1></div></div><div className="recap-editor-actions"><span className={`recap-save-state ${saved ? 'is-saved' : ''}`}><Check size={14} /> {loading ? 'Đang tải' : saving ? 'Đang lưu' : error || (saved ? 'Đã lưu' : 'Chưa lưu')}</span><div className="recap-history-actions"><button type="button" disabled={!history.length} onClick={undo} aria-label="Hoàn tác"><ArrowUp size={15} /></button><button type="button" disabled={!future.length} onClick={redo} aria-label="Làm lại"><ArrowDown size={15} /></button></div><div className="recap-device-toggle" aria-label="Kích thước xem trước"><button type="button" className={device === 'desktop' ? 'is-active' : ''} aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')} aria-label="Xem dạng máy tính"><Desktop size={15} /></button><button type="button" className={device === 'mobile' ? 'is-active' : ''} aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')} aria-label="Xem dạng điện thoại"><DeviceMobile size={15} /></button></div><AppLink className="button button-secondary" to={publicTemplateRoutes.redSpiderLilyRecapPreview}><Eye size={16} /> Xem trước</AppLink><button className="button button-secondary" type="button" disabled={!recap || saving || loading} onClick={() => void save()}><FloppyDisk size={16} /> {saving ? 'Đang lưu' : 'Lưu thay đổi'}</button><button className="button button-primary" type="button" onClick={() => setPublished(true)}><PaperPlaneTilt size={16} /> {published ? 'Đã chia sẻ' : 'Chia sẻ recap'}</button></div></header>
    <div className="recap-editor-layout"><aside className="recap-section-panel"><div className="recap-panel-intro"><span>DAU SON BI NGAN</span><strong>{visibleSections.length}/{order.length} section đang hiển thị</strong><small>Mở từng phần để chỉnh sửa nội dung.</small></div><ol>{order.map((key, index) => { const section = editorSections.find((item) => item.key === key)!; const isEnabled = enabled.includes(key); const fields = sectionContentFields[key]; const titleValue = String(getPath(content as unknown as Record<string, unknown>, fields?.title ?? '') ?? section.title); const bodyValue = String(getPath(content as unknown as Record<string, unknown>, fields?.body ?? '') ?? section.body); return <li className={`recap-section-card ${active === key ? 'is-active' : ''} ${isEnabled ? '' : 'is-disabled'}`} key={key}><div className="recap-section-row"><button className="recap-section-item" type="button" aria-expanded={active === key} onClick={() => { setActive((value) => value === key ? null : key); scrollToSection(key); setSaved(false) }}><span className="recap-section-index">{String(index + 1).padStart(2, '0')}</span><span><strong>{section.label}</strong><small>{section.required ? 'Bắt buộc' : isEnabled ? section.detail : 'Đang ẩn'}</small></span><Check className="recap-section-check" size={16} weight="bold" /></button><div className="recap-section-tools"><button type="button" disabled={!section.canReorder || index === 0} onClick={() => moveSection(key, -1)} aria-label={`Đưa ${section.label} lên`}><ArrowUp size={14} /></button><button type="button" disabled={!section.canReorder || index === order.length - 1} onClick={() => moveSection(key, 1)} aria-label={`Đưa ${section.label} xuống`}><ArrowDown size={14} /></button><button type="button" role="switch" aria-checked={isEnabled} disabled={!section.canToggle} className={`editor-switch ${isEnabled ? 'is-on' : ''}`} onClick={() => toggleSection(section)} aria-label={`${isEnabled ? 'An' : 'Hien'} ${section.label}`}><span /></button></div></div><SectionForm section={section} content={content} updateContent={updateContent} titleValue={titleValue} bodyValue={bodyValue} onTitleChange={(value) => fields && updateContent(fields.title, value)} onBodyChange={(value) => fields && updateContent(fields.body, value)} itemCount={itemCounts[key] ?? 0} galleryCount={galleryCounts[key] ?? 0} updateCount={updateCount} updateGallery={updateGallery} onChange={() => setSaved(false)} isOpen={active === key} /></li> })}</ol><div className="recap-editor-note"><MusicNotes size={18} /><span>Nhạc và video được chọn theo từng recap, không gắn cứng vào theme.</span></div></aside>
      <aside className="recap-live-preview"><div className="recap-live-preview-head"><span>Preview</span><small>{device === 'desktop' ? 'Desktop' : 'Mobile'}</small></div><RecapPreviewFrame frameRef={frameRef} route={`${publicTemplateRoutes.redSpiderLilyRecapPreview}?editor=1`} device={device} ready={ready} open={previewOpen} onToggleOpen={() => setPreviewOpen((value) => !value)} onLoad={sendState} /><AppLink className="recap-open-preview" to={studioRoutes.recapThemes}>Đổi giao diện recap</AppLink></aside></div>
    {pendingNavigation ? <div className="recap-unsaved-backdrop" role="presentation"><section className="recap-unsaved-dialog" role="dialog" aria-modal="true" aria-labelledby="recap-unsaved-title"><FloppyDisk size={28} /><h2 id="recap-unsaved-title">Bạn có thay đổi chưa lưu</h2><p>Bạn có muốn lưu nội dung recap trước khi rời khỏi trang này không?</p><footer><button className="button button-secondary" type="button" onClick={() => setPendingNavigation(null)}>Ở lại</button><button className="button button-secondary" type="button" onClick={() => { const target = pendingNavigation; setPendingNavigation(null); navigate(target) }}>Rời đi không lưu</button><button className="button button-primary" type="button" disabled={saving} onClick={() => void (async () => { const didSave = await save(); if (didSave) { const target = pendingNavigation; setPendingNavigation(null); navigate(target) } })()}>{saving ? 'Đang lưu…' : 'Lưu và rời đi'}</button></footer></section></div> : null}
    <RecapMediaManager open={mediaManagerOpen} assets={mediaAssets} selectedIds={selectedMediaIds} loading={mediaLoading} uploading={mediaUploading} error={mediaError} onClose={() => setMediaManagerOpen(false)} onUpload={(files) => { void uploadRecapMedia(files) }} onToggle={toggleMedia} />
  </section></RecapMediaContext.Provider>
}

function RecapPreviewFrame({ frameRef, route, device, ready, open, onToggleOpen, onLoad }: { frameRef: React.Ref<HTMLIFrameElement>; route: string; device: 'desktop' | 'mobile'; ready: boolean; open: boolean; onToggleOpen: () => void; onLoad: () => void }) {
  return <EditorPreviewModal frameRef={frameRef} route={route} device={device} defaultDevice="desktop" ready={ready} templateKey="red-spider-lily-recap" title="Bản xem trước recap" open={open} onToggleOpen={onToggleOpen} onDeviceChange={(next) => window.dispatchEvent(new CustomEvent('gmm-editor-preview-device-change', { detail: next }))} onLoad={onLoad} />
}
