import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Check, CheckCircle, Copy, Desktop, DeviceMobile, Eye, FacebookLogo, FloppyDisk, ImageSquare, Link, Minus, PaperPlaneTilt, Plus, Quotes, ShareNetwork, X } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { MediaAsset, RecapDraft, TemplateFieldConfig, WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { useLiveEditorBridge } from '../../../shared/lib/live-template-editor'
import { EditorPreviewModal } from '../../../shared/ui/EditorPreviewModal'
import { MobileEditorAdviceModal } from '../../../shared/ui/MobileEditorAdviceModal'
import { NativeDateField } from '../../../shared/ui/form-controls/NativeDateField'
import { useMediaLibrary } from '../../../features/media/model/useMediaLibrary'
import { MediaManagerModal } from '../../../features/media/ui/MediaManagerModal'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { redSpiderLilyRecapTemplateConfig } from '../../../templates/recaps/red-spider-lily/template-config'
import { redSpiderLilyRecapFixture } from '../../../templates/recaps/red-spider-lily/fixture'
import type { RedSpiderLilyRecapContent } from '../../../templates/recaps/red-spider-lily/content'
import './recap.css'
import './recap-accordion.css'
import './recap-repeatable.css'

type EditorSection = { key: string; label: string; detail: string; title: string; body: string; required: boolean; canToggle: boolean; canReorder: boolean; repeatable: boolean; minItems?: number; maxItems?: number; itemMediaField?: string; galleryField?: string; maxMediaPerItem?: number; interaction?: string; mediaRoles?: string[]; itemFields?: Record<string, TemplateFieldConfig>; fields?: Record<string, TemplateFieldConfig> }

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

function buildEditorSections(config: { sections?: readonly unknown[] } = redSpiderLilyRecapTemplateConfig): EditorSection[] {
  const sections = (Array.isArray(config.sections) && config.sections.length ? config.sections : redSpiderLilyRecapTemplateConfig.sections) as readonly unknown[]
  return sections.map((entry) => {
    const section = typeof entry === 'string' ? { sectionKey: entry } : entry && typeof entry === 'object' ? entry as Record<string, unknown> : {}
    const sectionKey = typeof section.sectionKey === 'string' ? section.sectionKey : 'section'
    const fallbackEntry = redSpiderLilyRecapTemplateConfig.sections.find((item) => typeof item === 'string' ? item === sectionKey : item.sectionKey === sectionKey)
    const fallback = fallbackEntry && typeof fallbackEntry === 'object' ? fallbackEntry as Record<string, unknown> : {}
    const required = typeof section.required === 'boolean' ? section.required : Boolean(fallback.required)
    const canToggle = required ? false : typeof section.canToggle === 'boolean' ? section.canToggle : typeof fallback.canToggle === 'boolean' ? fallback.canToggle : true
    const canReorder = typeof section.canReorder === 'boolean' ? section.canReorder : typeof fallback.canReorder === 'boolean' ? fallback.canReorder : true
    const copy = labels[sectionKey] ?? { label: sectionKey, detail: 'Nội dung section', title: typeof section.label === 'string' ? section.label : sectionKey, body: 'Nội dung section.' }
    const rule = section.repeatable || fallback.repeatable ? { ...fallback, ...section } : null
    const fields = section.fields && typeof section.fields === 'object' ? section.fields as Record<string, TemplateFieldConfig> : fallback.fields && typeof fallback.fields === 'object' ? fallback.fields as Record<string, TemplateFieldConfig> : undefined
    const itemFieldConfig = fields ? Object.values(fields).find((field) => field && typeof field === 'object' && field.type === 'items') : undefined
    const itemFields = section.itemFields && typeof section.itemFields === 'object' ? section.itemFields as Record<string, TemplateFieldConfig> : itemFieldConfig?.itemFields
    return { key: sectionKey, ...copy, fields, itemFields, required, canToggle, canReorder, repeatable: Boolean(rule), minItems: typeof rule?.minItems === 'number' ? rule.minItems : undefined, maxItems: typeof rule?.maxItems === 'number' ? rule.maxItems : undefined, itemMediaField: typeof rule?.itemMediaField === 'string' ? rule.itemMediaField : undefined, maxMediaPerItem: typeof rule?.maxMediaPerItem === 'number' ? rule.maxMediaPerItem : undefined, galleryField: typeof rule?.galleryField === 'string' ? rule.galleryField : undefined, interaction: typeof rule?.interaction === 'string' ? rule.interaction : undefined, mediaRoles: Array.isArray(rule?.mediaRoles) ? rule.mediaRoles.filter((role): role is string => typeof role === 'string') : undefined }
  })
}

const editorSections = buildEditorSections()
const normalizeSectionConfig = (value: { enabled?: unknown; order?: unknown } | null | undefined, sections: EditorSection[]) => {
  const keys = sections.map((section) => section.key)
  const order = [...new Set((Array.isArray(value?.order) ? value.order : []).filter((key): key is string => typeof key === 'string' && keys.includes(key)))]
  keys.forEach((key) => { if (!order.includes(key)) order.push(key) })
  const required = new Set(sections.filter((section) => section.required).map((section) => section.key))
  const enabled = [...new Set((Array.isArray(value?.enabled) ? value.enabled : []).filter((key): key is string => typeof key === 'string' && order.includes(key)))]
  required.forEach((key) => { if (!enabled.includes(key)) enabled.push(key) })
  return { order, enabled: order.filter((key) => enabled.includes(key) || required.has(key)) }
}

const clone = <T,>(value: T): T => structuredClone(value)
const mergeRecords = (base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> => Object.entries(override).reduce((result, [key, value]) => {
  const baseValue = result[key]
  result[key] = value && typeof value === 'object' && !Array.isArray(value) && baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)
    ? mergeRecords(baseValue as Record<string, unknown>, value as Record<string, unknown>)
    : value
  return result
}, clone(base))
const recapSlug = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56) || 'wedding-recap'
const mergeContent = (stored: Record<string, unknown>): RedSpiderLilyRecapContent => {
  const merged = mergeRecords(clone(redSpiderLilyRecapFixture.content) as unknown as Record<string, unknown>, stored)
  const ourStory = merged.ourStory
  if (ourStory && typeof ourStory === 'object' && !Array.isArray(ourStory)) {
    const media = (ourStory as Record<string, unknown>).media
    if (media && !Array.isArray(media) && typeof media === 'object') (ourStory as Record<string, unknown>).media = [media]
  }
  return merged as unknown as RedSpiderLilyRecapContent
}
const getPath = (value: Record<string, unknown>, path: string) => path ? path.split('.').reduce<unknown>((current, part) => current && typeof current === 'object' ? (current as Record<string, unknown>)[part] : undefined, value) : undefined
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
  templateKey?: string
}

function SectionForm({ section, content, updateContent, titleValue, bodyValue, onTitleChange, onBodyChange, itemCount, galleryCount, updateCount, updateGallery, onChange, isOpen, templateKey }: SectionFormProps) {
  if (content && updateContent && templateKey === 'red-spider-lily-recap') return <DetailedSectionForm section={section} content={content} update={updateContent} isOpen={isOpen} />
  if (content && updateContent) return <ConfigDrivenSectionForm section={section} content={content as unknown as Record<string, unknown>} update={updateContent} isOpen={isOpen} />
  return <div className={`recap-accordion ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}><div className="recap-accordion-content"><div className="recap-form-panel"><div className="recap-form-eyebrow">Đang chỉnh sửa</div><h2>{titleValue || section.title}</h2><p className="recap-form-lead">{bodyValue || section.body}</p><label className="recap-field"><span>Tiêu đề hien thi</span><input value={titleValue} onChange={(event) => onTitleChange(event.target.value)} tabIndex={isOpen ? 0 : -1} /></label><label className="recap-field"><span>Lời kể</span><textarea value={bodyValue} onChange={(event) => onBodyChange(event.target.value)} rows={5} tabIndex={isOpen ? 0 : -1} /></label>{section.repeatable ? <div className="recap-repeatable-panel"><div className="recap-repeatable-heading"><div><strong>Danh sách có thể lặp</strong><small>{section.interaction}</small></div><button type="button" className="recap-add-button" onClick={() => updateCount(section.key, 1, section.maxItems ?? 24)} tabIndex={isOpen ? 0 : -1}><Plus size={16} /> Thêm card</button></div><div className="recap-count-control"><span>{itemCount} card</span><button type="button" aria-label="Giảm số card" onClick={() => updateCount(section.key, -1, section.maxItems ?? 24)} tabIndex={isOpen ? 0 : -1}><Minus size={16} /></button><button type="button" aria-label="Tăng số card" onClick={() => updateCount(section.key, 1, section.maxItems ?? 24)} tabIndex={isOpen ? 0 : -1}><Plus size={16} /></button><small>Tối đa {section.maxItems}</small></div><div className="recap-repeatable-list">{Array.from({ length: Math.min(itemCount, 6) }, (_, index) => <div className="recap-repeatable-item" key={index}><div><strong>Card {String(index + 1).padStart(2, '0')}</strong><small>{section.key === 'peopleBehindTheDay' ? 'Cover người / nhóm người' : 'Cover khoảnh khắc'}</small></div><button type="button" className="recap-media-control" onClick={onChange} tabIndex={isOpen ? 0 : -1}><ImageSquare size={16} /> Thêm ảnh cover</button>{section.galleryField ? <div className="recap-gallery-control"><span>{galleryCount} anh trong gallery</span><button type="button" aria-label="Thêm ảnh vào gallery" onClick={() => updateGallery(section.key, 1, section.maxMediaPerItem ?? 12)} tabIndex={isOpen ? 0 : -1}><Plus size={16} /></button><button type="button" aria-label="Giảm ảnh trong gallery" onClick={() => updateGallery(section.key, -1, section.maxMediaPerItem ?? 12)} tabIndex={isOpen ? 0 : -1}><X size={14} /></button></div> : null}</div>)}</div>{itemCount > 6 ? <small className="recap-repeatable-overflow">Còn {itemCount - 6} card sẽ hiện trong rail và preview.</small> : null}</div> : null}<div className="recap-editor-tools"><button type="button" onClick={onChange} tabIndex={isOpen ? 0 : -1}><ImageSquare size={18} /> Chọn ảnh từ album</button></div></div></div></div>
}

const fieldLimits: Record<string, number> = { couple: 80, date: 40, place: 80, tagline: 240, ctaLabel: 80, eyebrow: 80, title: 180, body: 800, quote: 300, signature: 100, dateLabel: 40, description: 360, name: 100, role: 160, caption: 360, intro: 500, duration: 20, track: 120, artist: 120 }

function RecapTextField({ label, path, value, update, multiline = false, maxLength, type = 'text', disabled = false }: { label: string; path: string; value: string; update: (path: string, value: unknown) => void; multiline?: boolean; maxLength?: number; type?: 'text' | 'url' | 'date'; disabled?: boolean }) {
  const limit = maxLength ?? fieldLimits[path.split('.').at(-1) ?? '']
  return <label className="recap-field"><span>{label}{type !== 'date' && limit ? <small>{value.length}/{limit}</small> : null}</span>{type === 'date' ? <NativeDateField value={value} disabled={disabled} onChange={(event) => update(path, event.target.value)} aria-label={label} /> : multiline ? <textarea disabled={disabled} value={value} maxLength={limit} rows={4} onChange={(event) => update(path, event.target.value)} /> : <input disabled={disabled} type={type} value={value} maxLength={limit} onChange={(event) => update(path, event.target.value)} />}</label>
}

type RecapMediaRole = string
type RecapMediaContextValue = { assets: MediaAsset[]; selectedIds: Set<string>; openManager: (target?: string, role?: RecapMediaRole, multiple?: boolean) => void }
const RecapMediaContext = createContext<RecapMediaContextValue | null>(null)

function PhotoDeliverySourceField({ content, update }: { content: RedSpiderLilyRecapContent; update: (path: string, value: unknown) => void }) {
  const albums = content.photoDelivery.albums ?? []
  const [sourceMode, setSourceMode] = useState<'internal' | 'external'>(content.photoDelivery.albumUrl ? 'external' : 'internal')
  const external = sourceMode === 'external'
  const selectedAlbum = albums.find((album) => album.type === 'INTERNAL_ALBUM')
  useEffect(() => { if (content.photoDelivery.albumUrl) setSourceMode('external') }, [content.photoDelivery.albumUrl])
  const media = useContext(RecapMediaContext)
  const setMode = (mode: string) => {
    setSourceMode(mode === 'external' ? 'external' : 'internal')
    if (mode === 'external') { update('photoDelivery.albums', []); update('photoDelivery.media', []); return }
    update('photoDelivery.albumUrl', '')
    update('photoDelivery.albums', [{ type: 'INTERNAL_ALBUM', albumId: selectedAlbum?.albumId ?? 'guest-gallery' }])
  }
  return <div className="recap-source-field"><span className="recap-source-label">Nguồn album ảnh</span><div className="recap-source-tabs" role="tablist" aria-label="Nguồn album ảnh"><button type="button" role="tab" aria-selected={!external} className={!external ? 'is-active' : ''} onClick={() => setMode('internal')}>Album hệ thống</button><button type="button" role="tab" aria-selected={external} className={external ? 'is-active' : ''} onClick={() => setMode('external')}>URL bên ngoài</button></div>{external ? <RecapTextField label="URL album ảnh" path="photoDelivery.albumUrl" value={content.photoDelivery.albumUrl ?? ''} update={update} type="url" maxLength={2048} /> : <div className="recap-album-library"><div className="recap-album-actions"><button type="button" className="recap-media-control" onClick={() => media?.openManager('photoDelivery.media', 'hero', true)}><ImageSquare size={16} /> Tải ảnh lên</button><button type="button" className="recap-media-control" onClick={() => media?.openManager(undefined, 'hero', true)}><ImageSquare size={16} /> Chọn ảnh đã tải lên</button></div><AlbumSelectionStatus value={content.photoDelivery.media} /></div>}</div>
}

function AlbumSelectionStatus({ value }: { value: unknown }) {
  const count = Array.isArray(value) ? value.length : 0
  return <small className={'recap-album-selection ' + (count ? 'has-selection' : '')}>Đã chọn {count} ảnh</small>
}

function CardList({ path, fields, content, update, isOpen, galleryField, maxMediaPerItem }: { path: string; fields: Array<{ key: string; label: string; multiline?: boolean; maxLength?: number }>; content: RedSpiderLilyRecapContent; update: (path: string, value: unknown) => void; isOpen: boolean; galleryField?: string; maxMediaPerItem?: number }) {
  const media = useContext(RecapMediaContext)
  const items = (getPath(content as unknown as Record<string, unknown>, path) as Array<Record<string, unknown>> | undefined) ?? []
  const isMoments = path.endsWith('moments')
  const isChapters = path.endsWith('chapters')
  const isPeople = path.endsWith('people')
  const add = () => {
    const role = isMoments ? 'moment' : isChapters ? 'chapter' : isPeople ? 'person' : 'behind-the-scenes'
    const item = isPeople ? { id: `person-${Date.now()}`, name: '', role: '', media: { src: '', alt: 'Anh chan dung', role } } : path.endsWith('items') ? { id: `behind-${Date.now()}`, title: '', caption: '', media: { src: '', alt: 'Anh hau truong', role } } : { id: `${path}-${Date.now()}`, ...(isChapters ? { dateLabel: '' } : {}), title: '', description: '', cover: { src: '', alt: 'Ảnh cover', role } }
    update(path, [...items, item])
  }
  const role: RecapMediaRole = isMoments ? 'moment' : isChapters ? 'chapter' : isPeople ? 'person' : 'behind-the-scenes'
  const mediaField = isPeople || path.endsWith('items') ? 'media' : 'cover'
  return <div className="recap-card-editor"><div className="recap-repeatable-heading"><div><strong>{isChapters ? 'Các chapter' : isMoments ? 'Các nhóm khoảnh khắc' : isPeople ? 'Những người phía sau' : 'Các khoảnh khắc hậu trường'}</strong><small>{items.length} card</small></div><button type="button" className="recap-add-button" onClick={add} disabled={!isOpen}><Plus size={16} /> Thêm card</button></div>{items.map((item, index) => <article className="recap-card-editor-item" key={String(item.id ?? index)}><header><strong>Card {String(index + 1).padStart(2, '0')}</strong><button type="button" className="recap-card-remove" onClick={() => update(path, items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Xóa card ${index + 1}`}><X size={15} /></button></header>{fields.map((field) => <RecapTextField key={field.key} label={field.label} path={`${path}.${index}.${field.key}`} value={String(item[field.key] ?? '')} update={update} multiline={field.multiline} maxLength={field.maxLength} type={field.key === 'dateLabel' ? 'date' : 'text'} disabled={!isOpen} />)}<div className="recap-card-media-actions"><button type="button" className="recap-media-control" onClick={() => media?.openManager(path + '.' + index + '.' + mediaField, role)} disabled={!isOpen}><ImageSquare size={16} /> {item[mediaField] ? 'Thay ảnh cover' : 'Thêm ảnh cover'}</button>{galleryField ? <><button type="button" className="recap-media-control" onClick={() => media?.openManager(path + '.' + index + '.' + galleryField, role, true)} disabled={!isOpen}>{Array.isArray(item[galleryField]) && item[galleryField].length ? 'Thay album \u1ea3nh' : 'Ch\u1ecdn album \u1ea3nh'}</button><AlbumSelectionStatus value={item[galleryField]} /></> : null}</div></article>)}{!items.length ? <small className="recap-card-empty">Chưa có card. Thêm card để bắt đầu nhập nội dung.</small> : null}</div>
}


function mediaRoleFor(section: EditorSection, field: TemplateFieldConfig, fallback: string) { return section.mediaRoles?.[0] ?? field.mediaRole ?? fallback }

function mediaValueForRole(role: string) { return { src: '', alt: '', role } }

function ConfigDrivenItemList({ path, section, content, update, isOpen }: { path: string; section: EditorSection; content: Record<string, unknown>; update: (path: string, value: unknown) => void; isOpen: boolean }) {
  const media = useContext(RecapMediaContext)
  const itemFields = section.itemFields ?? {}
  const mediaConfig = section.itemMediaField ? itemFields[section.itemMediaField] ?? { type: 'image', label: 'Ảnh cover' } as TemplateFieldConfig : undefined
  const galleryConfig = section.galleryField ? itemFields[section.galleryField] ?? { type: 'images', label: 'Album ảnh' } as TemplateFieldConfig : undefined
  const items = (getPath(content, path) as Array<Record<string, unknown>> | undefined) ?? []
  const mediaField = section.itemMediaField
  const add = () => {
    const item = Object.fromEntries(Object.entries(itemFields).map(([key, field]) => {
      if (field.type === 'image') return [key, mediaValueForRole(mediaRoleFor(section, field, `${section.key}-image`))]
      if (field.type === 'images') return [key, []]
      if (field.type === 'boolean') return [key, Boolean(field.default)]
      return [key, field.default ?? '']
    }))
    update(path, [...items, item])
  }
  const openMedia = (index: number, field: string, fieldConfig: TemplateFieldConfig, multiple: boolean) => media?.openManager(`${path}.${index}.${field}`, mediaRoleFor(section, fieldConfig, section.key), multiple)
  return <div className="recap-card-editor"><div className="recap-repeatable-heading"><div><strong>{section.label}</strong><small>{items.length} card</small></div><button type="button" className="recap-add-button" onClick={add} disabled={!isOpen}><Plus size={16} /> Thêm card</button></div>{items.map((item, index) => <article className="recap-card-editor-item" key={String(item.id ?? index)}><header><strong>Card {String(index + 1).padStart(2, '0')}</strong><button type="button" className="recap-card-remove" disabled={!isOpen || (section.minItems !== undefined && items.length <= section.minItems)} onClick={() => update(path, items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Xóa card ${index + 1}`}><X size={15} /></button></header>{Object.entries(itemFields).filter(([key]) => key !== mediaField && key !== section.galleryField).map(([key, field]) => { const itemPath=`${path}.${index}.${key}`; const value=getPath(content,itemPath); if(field.type === 'image' || field.type === 'images') return <button key={itemPath} type="button" className="recap-media-control" disabled={!isOpen} onClick={() => openMedia(index,key,field,field.type === 'images')}><ImageSquare size={16} /> {field.label ?? key}</button>; if(field.type === 'boolean') return <label className="recap-field" key={itemPath}><span>{field.label ?? key}</span><input type="checkbox" disabled={!isOpen} checked={Boolean(value)} onChange={(event) => update(itemPath,event.target.checked)} /></label>; return <RecapTextField key={itemPath} label={field.label ?? key} path={itemPath} value={typeof value === 'string' ? value : ''} update={update} multiline={field.type === 'text'} type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'} maxLength={field.maxLength} disabled={!isOpen} /> })}<div className="recap-card-media-actions">{mediaField && mediaConfig ? <button type="button" className="recap-media-control" disabled={!isOpen} onClick={() => openMedia(index,mediaField,mediaConfig,mediaConfig.type === 'images')}><ImageSquare size={16} /> {item[mediaField] ? 'Thay ảnh cover' : 'Thêm ảnh cover'}</button> : null}{section.galleryField && galleryConfig ? <><button type="button" className="recap-media-control" disabled={!isOpen} onClick={() => openMedia(index,section.galleryField!,galleryConfig,true)}><ImageSquare size={16} /> {Array.isArray(item[section.galleryField]) && (item[section.galleryField] as unknown[]).length ? 'Thay album ảnh' : 'Chọn album ảnh'}</button><AlbumSelectionStatus value={item[section.galleryField]} /></> : null}</div></article>)}{!items.length ? <small className="recap-card-empty">Chưa có card. Thêm card để bắt đầu nhập nội dung.</small> : null}</div>
}

function ConfigDrivenSectionForm({ section, content, update, isOpen }: { section: EditorSection; content: Record<string, unknown>; update: (path: string, value: unknown) => void; isOpen: boolean }) {
  const media = useContext(RecapMediaContext)
  const fields = section.fields ?? {}
  const entries = Object.entries(fields)
  const repeatableEntry = entries.find(([, field]) => field.type === 'items') ?? (section.repeatable && section.itemFields ? ['items', { type: 'items', contentKey: section.key, itemFields: section.itemFields } as TemplateFieldConfig] as const : undefined)
  const fallbackFields = entries.length ? entries : [['title', { type: 'string', label: 'Tiêu đề' }], ['body', { type: 'text', label: 'Nội dung' }]] as const
  return <div className={`recap-accordion ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}><div className="recap-accordion-content"><div className="recap-form-panel"><div className="recap-form-eyebrow">Đang chỉnh sửa</div><h2>{section.title}</h2><p className="recap-form-lead">{section.body}</p>{fallbackFields.filter(([key]) => key !== repeatableEntry?.[0]).map(([key, config]) => { const field = config as TemplateFieldConfig; const path = field.contentKey ?? `${section.key}.${key}`; const value = getPath(content, path); if (field.type === 'items') return null; if (field.type === 'image' || field.type === 'images') return <button key={path} type="button" className="recap-media-control" disabled={!isOpen} onClick={() => media?.openManager(path, mediaRoleFor(section, field, section.key), field.type === 'images')}><ImageSquare size={18} /> {field.label ?? key}</button>; if (field.type === 'boolean') return <label className="recap-field" key={path}><span>{field.label ?? key}</span><input type="checkbox" disabled={!isOpen} checked={Boolean(value)} onChange={(event) => update(path, event.target.checked)} /></label>; return <RecapTextField key={path} label={field.label ?? key} path={path} value={typeof value === 'string' ? value : ''} update={update} multiline={field.type === 'text'} type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'} maxLength={field.maxLength} disabled={!isOpen} /> })}{repeatableEntry ? <ConfigDrivenItemList path={(repeatableEntry[1] as TemplateFieldConfig).contentKey ?? `${section.key}.${repeatableEntry[0]}`} section={section} content={content} update={update} isOpen={isOpen} /> : null}</div></div></div>
}

function DetailedSectionForm({ section, content, update, isOpen }: { section: EditorSection; content: RedSpiderLilyRecapContent; update: (path: string, value: unknown) => void; isOpen: boolean }) {
  const media = useContext(RecapMediaContext)
  const imageControls: Record<string, { path: string; role: RecapMediaRole }> = { hero: { path: 'hero.media', role: 'hero' }, ourStory: { path: 'ourStory.media.0', role: 'story' }, thankYou: { path: 'thankYou.media', role: 'finale' }, guestbook: { path: 'optional.guestbook.media', role: 'guestbook' }, weddingFilm: { path: 'optional.weddingFilm.poster', role: 'video-poster' }, soundtrack: { path: 'optional.soundtrack.cover', role: 'soundtrack' }, memoryCapsule: { path: 'optional.memoryCapsule.media', role: 'capsule' } }
  const imageControl = imageControls[section.key]
  const values = sectionContentFields[section.key]
  const value = (path: string, fallback: string) => String(getPath(content as unknown as Record<string, unknown>, path) ?? fallback)
  const field = (label: string, path: string, multiline = false, maxLength?: number, type: 'text' | 'date' = 'text') => <RecapTextField label={label} path={path} value={value(path, '')} update={update} multiline={multiline} maxLength={maxLength} type={type} disabled={!isOpen} />
  return <div className={`recap-accordion ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}><div className="recap-accordion-content"><div className="recap-form-panel"><div className="recap-form-eyebrow">Đang chỉnh sửa</div><h2>{value(values?.title ?? '', section.title)}</h2><p className="recap-form-lead">{value(values?.body ?? '', section.body)}</p>{section.key === 'hero' ? <>{field('Tên cặp đôi', 'hero.couple')}{field('Ngày hiển thị', 'hero.date', false, undefined, 'date')}{field('Địa điểm', 'hero.place')}{field('Tagline', 'hero.tagline', true)}</> : section.key === 'ourStory' ? <>{field('Dòng mở đầu', 'ourStory.eyebrow')}{field('Tiêu đề lời dẫn', 'ourStory.title', true)}{field('Nội dung loi dan', 'ourStory.body', true)}{field('Trích dẫn', 'ourStory.quote', true)}</> : section.key === 'photoDelivery' ? <><>{field('Dòng mở đầu', 'photoDelivery.eyebrow')}{field('Tiêu đề', 'photoDelivery.title', true)}{field('Nội dung', 'photoDelivery.body', true)}</><PhotoDeliverySourceField content={content} update={update} /></> : section.key === 'thankYou' ? <>{field('Tiêu đề lời cảm ơn', 'thankYou.title', true)}{field('Nội dung', 'thankYou.body', true)}{field('Chữ ký', 'thankYou.signature')}{field('Ngày kết', 'thankYou.date', false, undefined, 'date')}</> : section.key === 'chapters' ? <CardList path="chapters" fields={[{ key: 'dateLabel', label: 'Ngày / mốc thời gian' }, { key: 'title', label: 'Tiêu đề chapter' }, { key: 'description', label: 'Mô tả', multiline: true }]} content={content} update={update} isOpen={isOpen} galleryField={section.galleryField} maxMediaPerItem={section.maxMediaPerItem} /> : section.key === 'moments' ? <CardList path="moments" fields={[{ key: 'title', label: 'Tên nhóm khoảnh khắc' }, { key: 'description', label: 'Mô tả', multiline: true }]} content={content} update={update} isOpen={isOpen} galleryField={section.galleryField} maxMediaPerItem={section.maxMediaPerItem} /> : section.key === 'peopleBehindTheDay' ? <><>{field('Tiêu đề section', 'optional.peopleBehindTheDay.title', true)}{field('Mô tả section', 'optional.peopleBehindTheDay.body', true)}</><CardList path="optional.peopleBehindTheDay.people" fields={[{ key: 'name', label: 'Tên người / nhóm' }, { key: 'role', label: 'Vai trò / ghi chú', multiline: true }]} content={content} update={update} isOpen={isOpen} galleryField={section.galleryField} maxMediaPerItem={section.maxMediaPerItem} /></> : section.key === 'behindTheScenes' ? <><>{field('Tiêu đề section', 'optional.behindTheScenes.title', true)}{field('Mô tả section', 'optional.behindTheScenes.body', true)}</><CardList path="optional.behindTheScenes.items" fields={[{ key: 'title', label: 'Tiêu đề khoảnh khắc' }, { key: 'caption', label: 'Ghi chú', multiline: true }]} content={content} update={update} isOpen={isOpen} galleryField={section.galleryField} maxMediaPerItem={section.maxMediaPerItem} /></> : section.key === 'guestbook' ? <>{field('Tiêu đề section', 'optional.guestbook.title', true)}{field('Lời dẫn lời chúc', 'optional.guestbook.intro', true)}<p className='recap-wish-note'>Chỉ những lời chúc đã được duyệt sẽ hiển thị ở đây.</p></> : section.key === 'weddingFilm' ? <>{field('Tiêu đề section', 'optional.weddingFilm.title', true)}{field('Mô tả section', 'optional.weddingFilm.body', true)}{field('Thời lượng video', 'optional.weddingFilm.duration')}</> : section.key === 'soundtrack' ? <>{field('Tiêu đề section', 'optional.soundtrack.title', true)}{field('Mô tả section', 'optional.soundtrack.body', true)}{field('Tên track', 'optional.soundtrack.track')}{field('Nghệ sĩ', 'optional.soundtrack.artist')}{field('Thời lượng', 'optional.soundtrack.duration')}</> : section.key === 'memoryCapsule' ? <>{field('Tiêu đề section', 'optional.memoryCapsule.title', true)}{field('Lời nhắn', 'optional.memoryCapsule.body', true)}{field('Mốc thời gian', 'optional.memoryCapsule.date', false, undefined, 'date')}</> : null}{imageControl ? <div className="recap-editor-tools"><button type="button" className="recap-media-control" onClick={() => media?.openManager(imageControl.path, imageControl.role)} disabled={!isOpen}><ImageSquare size={18} /> {getPath(content as unknown as Record<string, unknown>, imageControl.path) ? 'Thay ảnh' : 'Thêm ảnh'}</button></div> : null}</div></div></div>
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
  const [published, setPublished] = useState(false); const [mobileAdviceOpen, setMobileAdviceOpen] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(max-width: 767px)').matches))
  const [publishing, setPublishing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [publicWeddingSlug, setPublicWeddingSlug] = useState<string | null>(wedding?.slug ?? null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({ chapters: 3, moments: 3, peopleBehindTheDay: 3, behindTheScenes: 5 })
  const [galleryCounts, setGalleryCounts] = useState<Record<string, number>>({ peopleBehindTheDay: 2, behindTheScenes: 2 })
  const [history, setHistory] = useState<Array<{ order: string[]; enabled: string[] }>>([])
  const [future, setFuture] = useState<Array<{ order: string[]; enabled: string[] }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [mediaManagerOpen, setMediaManagerOpen] = useState(false)
  const { assets: mediaAssets, loading: mediaLoading, uploading: mediaUploading, error: mediaError, setError: setMediaError, upload: uploadRecapMedia } = useMediaLibrary({ weddingId: wedding?.id ?? null })
  const [mediaTarget, setMediaTarget] = useState<{ path: string; role: RecapMediaRole; multiple: boolean } | null>(null)
  const [mediaSelectionMode, setMediaSelectionMode] = useState<'single' | 'multiple'>('single')
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const templateSections = buildEditorSections((recap?.templateVersion.config ?? redSpiderLilyRecapTemplateConfig) as { sections?: readonly unknown[] })
  const visibleSections = order.filter((key) => enabled.includes(key))
  const { frameRef, ready, hydrated, sendState, scrollToSection } = useLiveEditorBridge<{ data: RedSpiderLilyRecapContent; sectionConfig: { enabled: string[]; order: string[] } }, string>({ data: content, sectionConfig: { enabled, order } })

  const load = useCallback(async () => {
    if (!wedding) { setLoading(false); return }
    setLoading(true); setError('')
    setShareUrl('')
    setPublished(false)
    try {
      const resolvedWedding = wedding.slug ? wedding : (await weddingApi.get(wedding.id)).wedding
      setPublicWeddingSlug(resolvedWedding.slug)
      const result = (await weddingApi.recap(wedding.id)).recap
      if (!result) { setError(''); setRecap(null); return }
      setRecap(result)
      const recapSlug = result.slug ?? resolvedWedding.slug
      setPublicWeddingSlug(recapSlug)
      if (result.status === 'PUBLISHED' && recapSlug) { setPublished(true); setShareUrl(window.location.origin + '/' + encodeURIComponent(recapSlug) + '/recaps') }
      const isRedSpiderLily = result.templateVersion.key === 'red-spider-lily-recap'
      setContent(isRedSpiderLily ? mergeContent(result.content) : result.content as unknown as RedSpiderLilyRecapContent)
      const normalized = normalizeSectionConfig(result.sectionConfig, buildEditorSections((result.templateVersion.config ?? redSpiderLilyRecapTemplateConfig) as { sections?: readonly unknown[] }))
      setOrder(normalized.order)
      setEnabled(normalized.enabled)
      setActive(normalized.order[0] ?? 'hero')
      setSaved(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải nội dung recap.')
    } finally { setLoading(false) }
  }, [wedding])

  useEffect(() => { void load() }, [load])

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
  const moveSection = (key: string, direction: -1 | 1) => { const index = order.indexOf(key); const nextIndex = index + direction; const section = templateSections.find((item) => item.key === key); const target = templateSections.find((item) => item.key === order[nextIndex]); if (!section?.canReorder || !target?.canReorder || nextIndex < 0 || nextIndex >= order.length) return; checkpoint(); const next = [...order]; [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; setOrder(next); setSaved(false) }
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
  const attachMediaAsset = (asset: MediaAsset, target: { path: string; role: RecapMediaRole }) => {
    updateContent(target.path, { src: asset.publicUrl, alt: asset.originalName ?? 'Ảnh đã tải lên', role: target.role, mediaAssetId: asset.id })
    setRecap((current) => {
      if (!current || current.mediaItems.some((item) => item.mediaAssetId === asset.id)) return current
      return { ...current, mediaItems: [...current.mediaItems, { id: asset.id, mediaAssetId: asset.id, caption: null, sortOrder: current.mediaItems.length, publicUrl: asset.publicUrl }] }
    })
    setSaved(false)
  }
  const attachMediaAssets = (assets: MediaAsset[], target: { path: string; role: RecapMediaRole }) => {
    updateContent(target.path, assets.map((asset) => ({ src: asset.publicUrl, alt: asset.originalName ?? 'Ảnh đã tải lên', role: target.role, mediaAssetId: asset.id })))
    setRecap((current) => {
      if (!current) return current
      const existing = new Set(current.mediaItems.map((item) => item.mediaAssetId))
      const additions = assets.filter((asset) => !existing.has(asset.id)).map((asset, index) => ({ id: asset.id, mediaAssetId: asset.id, caption: null, sortOrder: current.mediaItems.length + index, publicUrl: asset.publicUrl }))
      return additions.length ? { ...current, mediaItems: [...current.mediaItems, ...additions] } : current
    })
    setSaved(false)
  }
  const toggleMedia = (asset: MediaAsset) => {
    if (mediaTarget) {
      attachMediaAsset(asset, mediaTarget)
      setMediaManagerOpen(false)
      return
    }
    setRecap((current) => {
      if (!current) return current
      const mediaItems = selectedMediaIds.has(asset.id)
        ? current.mediaItems.filter((item) => item.mediaAssetId !== asset.id)
        : [...current.mediaItems, { id: asset.id, mediaAssetId: asset.id, caption: null, sortOrder: current.mediaItems.length, publicUrl: asset.publicUrl }]
      return { ...current, mediaItems: mediaItems.map((item, index) => ({ ...item, sortOrder: index })) }
    })
    setSaved(false)
  }
  const save = async (): Promise<boolean> => {
    if (!wedding || !recap || saving) return false
    const validationErrors = recap.templateVersion.key === 'red-spider-lily-recap' ? validateRecapContent(content) : []
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
      setRecap(result.recap); setContent(result.recap.templateVersion.key === 'red-spider-lily-recap' ? mergeContent(result.recap.content) : result.recap.content as unknown as RedSpiderLilyRecapContent); setSaved(true)
      notifications.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu recap', showConfirmButton: false, timer: 1800, timerProgressBar: true })
      return true
    } catch (cause) {
      setError(cause instanceof WeddingApiError && cause.status === 409 ? 'Nội dung vừa thay đổi ở nơi khác. Hãy tải lại để tiếp tục.' : cause instanceof Error ? cause.message : 'Không thể lưu nội dung recap.')
      if (cause instanceof WeddingApiError && cause.code === 'RECAP_REVISION_CONFLICT') await load()
      return false
    } finally { setSaving(false) }
  }

  const managerSelectedIds = mediaTarget ? new Set(mediaAssets.filter((asset) => { const value = getPath(content as unknown as Record<string, unknown>, mediaTarget.path); const values = Array.isArray(value) ? value : [value]; return values.some((item) => item && typeof item === 'object' && ((item as Record<string, unknown>).mediaAssetId === asset.id || (item as Record<string, unknown>).src === asset.publicUrl)) }).map((asset) => asset.id)) : mediaSelectionMode === 'multiple' ? new Set(mediaAssets.map((asset) => asset.id)) : selectedMediaIds
  const openDraftPreview = async () => {
    const slug = recap?.slug ?? publicWeddingSlug ?? wedding?.slug ?? (wedding ? (await weddingApi.get(wedding.id)).wedding.slug : null)
    if (!slug) { setError('Wedding chưa có slug để mở recap.'); return }
    window.open(window.location.origin + '/' + encodeURIComponent(slug) + '/recaps', '_blank', 'noopener,noreferrer')
  }

  const publishRecap = async () => {
    if (!wedding || !recap || saving || publishing) return
    setPublishing(true)
    setError('')
    const didSave = saved || await save()
    if (!didSave) { setPublishing(false); return }
    try {
      const resolvedSlug = recap.slug ?? publicWeddingSlug ?? wedding.slug ?? (await weddingApi.get(wedding.id)).wedding.slug
      if (!resolvedSlug) { setError('Wedding chưa sẵn sàng để chia sẻ recap. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.'); return }
      const latest = (await weddingApi.recap(wedding.id)).recap
      if (!latest) return
      const result = await weddingApi.publishRecap(wedding.id, { revision: latest.revision })
      const publishedSlug = result.snapshot.slug || resolvedSlug
      setPublicWeddingSlug(publishedSlug)
      const publicUrl = window.location.origin + '/' + encodeURIComponent(publishedSlug) + '/recaps'
      setPublished(true)
      setShareUrl(publicUrl)
      setShareOpen(true)
      setCopied(false)
      notifications.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã xuất bản recap', showConfirmButton: false, timer: 2600, timerProgressBar: true })
    } catch (cause) { const message = cause instanceof Error ? cause.message : 'Không thể xuất bản recap.'; setError(message); notifications.fire({ toast: true, position: 'top-end', icon: 'error', title: message, showConfirmButton: false, timer: 3200, timerProgressBar: true }) } finally { setPublishing(false) }
  }

    const unpublishRecap = async () => {
    if (!wedding || !recap || publishing) return
    setPublishing(true)
    setError('')
    try {
      await weddingApi.unpublish(wedding.id, { surface: 'RECAP', revision: recap.revision })
      setPublished(false)
      setShareUrl('')
      setShareOpen(false); await load(); await notifications.success('Đã tạm đóng recap')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Không thể tạm đóng recap.'
      setError(message)
      await notifications.error('Không thể tạm đóng recap', message)
    } finally { setPublishing(false) }
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

  return <RecapMediaContext.Provider value={{ assets: mediaAssets, selectedIds: selectedMediaIds, openManager: (target, role = 'hero', multiple = false) => { setMediaError(''); setMediaTarget(target ? { path: target, role, multiple } : null); setMediaSelectionMode(multiple ? 'multiple' : 'single'); setMediaManagerOpen(true) } }}><section className="recap-editor-page" aria-labelledby="recap-editor-heading">
    <header className="recap-editor-toolbar"><div className="recap-editor-title"><AppLink to={studioRoutes.recapThemes} ariaLabel="Quay lại kho giao diện recap"><ArrowLeft size={18} /></AppLink><div><p className="breadcrumb">Wedding Recap <span>/</span> Dấu Son Bỉ Ngạn</p><h1 id="recap-editor-heading">Kể lại ngày vui của bạn</h1></div></div><div className="recap-editor-actions"><span className={`recap-save-state ${saved ? 'is-saved' : ''}`}><Check size={14} /> {loading ? 'Đang tải' : saving ? 'Đang lưu' : error || (saved ? 'Đã lưu' : 'Chưa lưu')}</span><div className="recap-history-actions"><button type="button" disabled={!history.length} onClick={undo} aria-label="Hoàn tác"><ArrowUp size={15} /></button><button type="button" disabled={!future.length} onClick={redo} aria-label="Làm lại"><ArrowDown size={15} /></button></div><div className="recap-device-toggle" aria-label="Kích thước xem trước"><button type="button" className={device === 'desktop' ? 'is-active' : ''} aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')} aria-label="Xem dạng máy tính"><Desktop size={15} /></button><button type="button" className={device === 'mobile' ? 'is-active' : ''} aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')} aria-label="Xem dạng điện thoại"><DeviceMobile size={15} /></button></div><button className="button button-secondary" type="button" onClick={() => window.open(window.location.origin + publicTemplateRoutes.redSpiderLilyRecapPreview)}><Eye size={16} /> Xem thiệp mẫu</button><button className="button button-secondary" type="button" disabled={!recap || saving || loading} onClick={() => void save()}><FloppyDisk size={16} /> {saving ? 'Đang lưu' : 'Lưu thay đổi'}</button><button className="button button-secondary" type="button" disabled={!recap || saving || loading} onClick={openDraftPreview}><Eye size={16} /> Xem recap của tôi</button>{published ? <button className="button button-secondary" type="button" disabled={!shareUrl} onClick={() => { setCopied(false); setShareOpen(true) }}><ShareNetwork size={16} /> Chia sẻ recap</button> : null}<button className="button button-primary" type="button" disabled={!recap || saving || loading || publishing} onClick={() => void (published ? unpublishRecap() : publishRecap())}><PaperPlaneTilt size={16} /> {publishing ? (published ? 'Đang tạm đóng…' : 'Đang công khai…') : published ? 'Tạm đóng recap' : 'Công khai recap'}</button></div></header>
    <div className="recap-editor-layout"><aside className="recap-section-panel"><div className="recap-panel-intro"><span>DAU SON BI NGAN</span><strong>{visibleSections.length}/{order.length} section đang hiển thị</strong><small>Mở từng phần để chỉnh sửa nội dung.</small>{published ? <div className="recap-publication-status"><span>Recap đang được công khai</span>{shareUrl ? <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a> : null}</div> : null}</div><ol>{order.map((key, index) => { const section = templateSections.find((item) => item.key === key) ?? { key, label: key, detail: 'Nội dung section', title: key, body: 'Nội dung section', required: false, canToggle: true, canReorder: true, repeatable: false }; const isEnabled = enabled.includes(key); const fields = sectionContentFields[key] ?? { title: `${key}.title`, body: `${key}.body` }; const titleValue = String(getPath(content as unknown as Record<string, unknown>, fields.title) ?? section.title); const bodyValue = String(getPath(content as unknown as Record<string, unknown>, fields.body) ?? section.body); return <li className={`recap-section-card ${active === key ? 'is-active' : ''} ${isEnabled ? '' : 'is-disabled'}`} key={key}><div className="recap-section-row"><button className="recap-section-item" type="button" aria-expanded={active === key} onClick={() => { setActive((value) => value === key ? null : key); scrollToSection(key); setSaved(false) }}><span className="recap-section-index">{String(index + 1).padStart(2, '0')}</span><span><strong>{section.label}</strong><small>{section.required ? 'Bắt buộc' : isEnabled ? section.detail : 'Đang ẩn'}</small></span><Check className="recap-section-check" size={16} weight="bold" /></button><div className="recap-section-tools"><button type="button" disabled={!section.canReorder || index === 0 || !templateSections.find((item) => item.key === order[index - 1])?.canReorder} onClick={() => moveSection(key, -1)} aria-label={`Đưa ${section.label} lên`}><ArrowUp size={14} /></button><button type="button" disabled={!section.canReorder || index === order.length - 1 || !templateSections.find((item) => item.key === order[index + 1])?.canReorder} onClick={() => moveSection(key, 1)} aria-label={`Đưa ${section?.label ?? key} xuống`}><ArrowDown size={14} /></button><button type="button" role="switch" aria-checked={isEnabled} disabled={!section.canToggle} className={`editor-switch ${isEnabled ? 'is-on' : ''}`} onClick={() => toggleSection(section)} aria-label={`${isEnabled ? 'An' : 'Hien'} ${(section?.label ?? key)}`}><span /></button></div></div><SectionForm section={section} content={content} updateContent={updateContent} titleValue={titleValue} bodyValue={bodyValue} onTitleChange={(value) => fields && updateContent(fields.title, value)} onBodyChange={(value) => fields && updateContent(fields.body, value)} itemCount={itemCounts[key] ?? 0} galleryCount={galleryCounts[key] ?? 0} updateCount={updateCount} updateGallery={updateGallery} onChange={() => setSaved(false)} isOpen={active === key} templateKey={recap?.templateVersion.key} /></li> })}</ol></aside>
      <aside className="recap-live-preview"><div className="recap-live-preview-head"><span>Preview</span><small>{device === 'desktop' ? 'Desktop' : 'Mobile'}</small></div><RecapPreviewFrame templateKey={recap?.templateVersion.key ?? 'red-spider-lily-recap'} frameRef={frameRef} route={`${typeof recap?.templateVersion.config.previewPath === 'string' ? recap.templateVersion.config.previewPath : publicTemplateRoutes.redSpiderLilyRecapPreview}?editor=1&template=${encodeURIComponent(recap?.templateVersion.key ?? 'red-spider-lily-recap')}`} device={device} ready={ready && hydrated} open={previewOpen} onToggleOpen={() => setPreviewOpen((value) => !value)} onLoad={sendState} /><AppLink className="recap-open-preview" to={studioRoutes.recapThemes}>Đổi giao diện recap</AppLink></aside></div>
    {pendingNavigation ? <div className="recap-unsaved-backdrop" role="presentation"><section className="recap-unsaved-dialog" role="dialog" aria-modal="true" aria-labelledby="recap-unsaved-title"><FloppyDisk size={28} /><h2 id="recap-unsaved-title">Bạn có thay đổi chưa lưu</h2><p>Bạn có muốn lưu nội dung recap trước khi rời khỏi trang này không?</p><footer><button className="button button-secondary" type="button" onClick={() => setPendingNavigation(null)}>Ở lại</button><button className="button button-secondary" type="button" onClick={() => { const target = pendingNavigation; setPendingNavigation(null); navigate(target) }}>Rời đi không lưu</button><button className="button button-primary" type="button" disabled={saving} onClick={() => void (async () => { const didSave = await save(); if (didSave) { const target = pendingNavigation; setPendingNavigation(null); navigate(target) } })()}>{saving ? 'Đang lưu…' : 'Lưu và rời đi'}</button></footer></section></div> : null}
    <MobileEditorAdviceModal open={mobileAdviceOpen} onClose={() => setMobileAdviceOpen(false)} />{shareOpen && shareUrl ? <ShareRecapModal url={shareUrl} copied={copied} onClose={() => setShareOpen(false)} onCopy={async () => { await navigator.clipboard?.writeText(shareUrl); setCopied(true) }} onNativeShare={async () => { if (navigator.share) await navigator.share({ title: 'Wedding recap', url: shareUrl }) }} /> : null}
    <MediaManagerModal selectionMode={mediaSelectionMode} open={mediaManagerOpen} assets={mediaAssets} selectedIds={managerSelectedIds} loading={mediaLoading} uploading={mediaUploading} error={mediaError} onClose={() => setMediaManagerOpen(false)} onUpload={uploadRecapMedia} onConfirm={(selected) => { if (mediaTarget) { if (selected.length) { if (mediaTarget.multiple) attachMediaAssets(selected, mediaTarget); else attachMediaAsset(selected[0], mediaTarget) } else { updateContent(mediaTarget.path, mediaTarget.multiple ? [] : { src: '', alt: '', role: mediaTarget.role }) } } else { setRecap((current) => current ? { ...current, mediaItems: selected.map((asset, index) => ({ id: asset.id, mediaAssetId: asset.id, caption: null, sortOrder: index, publicUrl: asset.publicUrl })) } : current); setSaved(false) }; setMediaManagerOpen(false) }} />
  </section></RecapMediaContext.Provider>
}

function ShareRecapModal({ url, copied, onClose, onCopy, onNativeShare }: { url: string; copied: boolean; onClose: () => void; onCopy: () => Promise<void>; onNativeShare: () => Promise<void> }) {
  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
  return <div className='publication-share-backdrop' role='presentation' onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className='publication-share-dialog' role='dialog' aria-modal='true' aria-labelledby='publication-share-title'>
      <button type='button' className='publication-share-close' onClick={onClose} aria-label='Đóng'><X size={18} /></button>
      <span className='publication-share-kicker'>RECAP ĐÃ SẴN SÀNG</span><h2 id='publication-share-title'>Chia sẻ câu chuyện của hai bạn</h2><p>Gửi đường dẫn recap đến gia đình và bạn bè.</p>
      <div className='publication-share-link'><Link size={17} /><span>{url}</span><button type='button' onClick={() => void onCopy()} aria-label='Sao chép đường dẫn'><Copy size={17} /></button></div>
      <div className='publication-share-actions'><a className='button button-secondary' href={facebookUrl} target='_blank' rel='noreferrer'><FacebookLogo size={17} /> Facebook</a>{typeof navigator !== 'undefined' && 'share' in navigator ? <button className='button button-secondary' type='button' onClick={() => void onNativeShare()}><ShareNetwork size={17} /> Chia sẻ</button> : null}<button className='button button-primary' type='button' onClick={() => void onCopy()}><Copy size={17} /> {copied ? 'Đã sao chép' : 'Sao chép link'}</button></div>
    </section>
  </div>
}

function RecapPreviewFrame({ frameRef, route, device, ready, open, onToggleOpen, onLoad, templateKey }: { frameRef: React.Ref<HTMLIFrameElement>; route: string; device: 'desktop' | 'mobile'; ready: boolean; open: boolean; onToggleOpen: () => void; onLoad: () => void; templateKey: string }) {
  return <EditorPreviewModal frameRef={frameRef} route={route} device={device} defaultDevice="desktop" ready={ready} templateKey={templateKey} title="Bản xem trước recap" open={open} onToggleOpen={onToggleOpen} onDeviceChange={(next) => window.dispatchEvent(new CustomEvent('gmm-editor-preview-device-change', { detail: next }))} onLoad={onLoad} />
}



