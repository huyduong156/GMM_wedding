import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, ArrowsOut, CaretDown, Desktop, DeviceMobile, Eye, FloppyDisk, Image, Monitor, MusicNote, Plus, Trash, UploadSimple, X } from '@phosphor-icons/react'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { readEditorImages, useEditorSections, useLiveEditorBridge } from '../../../shared/lib/live-template-editor'
import type { ModernLuxeEditorPayload } from '../../../templates/invitations/modern-luxe/editor-message'
import type { ModernLuxeActivityItem, ModernLuxeData, ModernLuxePalette, ModernLuxeSectionKey } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { modernLuxeDisplayStyles, modernLuxeTemplateConfig } from '../../../templates/invitations/modern-luxe/template-config'

type Section = Exclude<ModernLuxeSectionKey, 'loveJourney'>
type EditorValue = string | boolean | string[] | NonNullable<ModernLuxeData['timelineItems']> | ModernLuxeActivityItem[]
const labels: Record<Section, string> = { cover: 'Bìa & cặp đôi', invitation: 'Lời mời', families: 'Hai gia đình', eventDetails: 'Thời gian hôn lễ', countdown: 'Lịch & đếm ngược', timeline: 'Lịch trình', venue: 'Địa điểm & bản đồ', activities: 'Hoạt động trong tiệc', gallery: 'Album ảnh', rsvp: 'Xác nhận tham dự', guestbook: 'Sổ lưu bút', gift: 'Thông tin mừng cưới', music: 'Nhạc nền' }
const allSections = Object.keys(labels) as Section[]
const required: Section[] = ['cover', 'invitation', 'families', 'eventDetails']
const fixedSections = new Set<string>(modernLuxeTemplateConfig.sections.filter((section) => section.canReorder === false).map((section) => section.sectionKey))
const canReorderSection = (section: Section) => !fixedSections.has(section)
const initialData: ModernLuxeData = { brideName: 'Mai', groomName: 'Đức', weddingDate: '18 · 10 · 2026', eyebrow: 'Trân trọng kính mời', invitationTitle: 'Đến chung vui trong ngày thành hôn', invitationMessage: 'Sự hiện diện của bạn là niềm vui và món quà quý giá trong ngày chúng mình bắt đầu một hành trình mới.', ceremonyTime: '09:00', receptionTime: '11:00', venueName: 'The Garden Hall', venueAddress: 'Hà Nội', brideFatherTitle: 'Ông', brideFather: 'Nguyễn Văn An', brideMotherTitle: 'Bà', brideMother: 'Trần Thu Hà', groomFatherTitle: 'Ông', groomFather: 'Phạm Văn Minh', groomMotherTitle: 'Bà', groomMother: 'Lê Ngọc Lan', timelineItems: [{ time: '09:00', title: 'Đón khách', detail: 'Gặp gỡ và chụp ảnh cùng khách mời.' }, { time: '10:00', title: 'Lễ thành hôn', detail: 'Cùng chứng kiến nghi thức thành hôn.' }, { time: '11:00', title: 'Khai tiệc', detail: 'Khai tiệc và chung vui cùng hai gia đình.' }], activities: [{ title: 'Photobooth kỷ niệm', image: '/assets/images/templates/modern-luxe/wedding-detail.jpg' }, { title: 'Chụp hình cùng cô dâu chú rể', image: '/assets/images/templates/modern-luxe/couple-portrait.jpg' }, { title: 'Góc bong bóng cho bé', image: '/assets/images/login-wedding-luxury.jpg' }], activitiesStyle: 'activity-cards', galleryStyle: 'deck-3d', backgroundMusicAutoplay: true, rsvpDeadline: '10.10.2026', rsvpMessage: 'Vui lòng xác nhận để chúng mình chuẩn bị đón tiếp bạn thật chu đáo.', giftMessage: 'Tình cảm và sự hiện diện của bạn là món quà ý nghĩa nhất.', galleryImages: [] }

export function InvitationEditorLivePage() {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('mobile')
  const [isMobileEditor, setIsMobileEditor] = useState(() => window.matchMedia?.('(max-width: 767px)').matches ?? false)
  const { setSelected, order, enabled, move, toggle } = useEditorSections(allSections, required, canReorderSection)
  const [data, setData] = useState(initialData), [palette, setPalette] = useState<ModernLuxePalette>('champagne')
  const [imageError, setImageError] = useState('')
  const [musicError, setMusicError] = useState('')
  const [expandedSection, setExpandedSection] = useState<Section | null>('cover')
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [mobileAdviceOpen, setMobileAdviceOpen] = useState(isMobileEditor)
  const previewDevice = isMobileEditor ? 'mobile' : device
  useEffect(() => {
    const query = window.matchMedia?.('(max-width: 767px)')
    if (!query) return
    const updateViewport = (event: MediaQueryListEvent) => { setIsMobileEditor(event.matches); if (event.matches) setDevice('mobile') }
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])
  const { frameRef, ready, sendState, scrollToSection } = useLiveEditorBridge<ModernLuxeEditorPayload, Section>({ data, palette, sectionConfig: { enabled, order } })
  const update = (key: keyof ModernLuxeData, value: EditorValue) => setData((current) => ({ ...current, [key]: value }))
  const focusPreviewSection = (key: Section) => { if (key !== 'music') scrollToSection(key) }
  const selectSection = (key: Section) => { setSelected(key); setExpandedSection((current) => current === key ? null : key); focusPreviewSection(key) }
  const upload = async (files: FileList | null) => {
    const result = await readEditorImages(files, data.galleryImages?.length ?? 0)
    setImageError(result.rejected ? 'Chỉ nhận ảnh JPG, PNG hoặc WebP tối đa 5MB.' : '')
    update('galleryImages', [...(data.galleryImages ?? []), ...result.images])
  }
  const uploadMusic = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith('audio/') || file.size > 15 * 1024 * 1024) { setMusicError('Chỉ nhận file âm thanh tối đa 15MB.'); return }
    const url = await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file) })
    setMusicError(''); setData((current) => ({ ...current, backgroundMusicUrl: url, backgroundMusicName: file.name }))
  }
  const uploadActivityImage = async (index: number, files: FileList | null) => {
    const result = await readEditorImages(files, 0, 1)
    if (!result.images[0]) { setImageError(result.rejected ? 'Chỉ nhận ảnh JPG, PNG hoặc WebP tối đa 5MB.' : ''); return }
    setImageError(''); update('activities', (data.activities ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, image: result.images[0] } : item))
  }
  return <section className="invitation-editor" aria-labelledby="invitation-editor-heading">
    <header className="editor-toolbar"><div className="editor-toolbar-title"><AppLink to={studioRoutes.inviteThemes} ariaLabel="Quay lại kho giao diện"><ArrowLeft /></AppLink><div><p>Thiệp online · Élan d’Amour v2.3</p><h1 id="invitation-editor-heading">Chỉnh sửa thiệp <span>Live demo</span></h1></div></div><div className="editor-toolbar-actions"><span className={`editor-live-status ${ready ? 'is-ready' : ''}`}>{ready ? 'Preview đã kết nối' : 'Đang kết nối…'}</span><div className="editor-device-toggle" aria-hidden={isMobileEditor}><button type="button" aria-label="Xem dạng máy tính" aria-pressed={previewDevice === 'desktop'} className={previewDevice === 'desktop' ? 'is-active' : ''} onClick={() => setDevice('desktop')}><Desktop /></button><button type="button" aria-label="Xem dạng điện thoại" aria-pressed={previewDevice === 'mobile'} className={previewDevice === 'mobile' ? 'is-active' : ''} onClick={() => setDevice('mobile')}><DeviceMobile /></button></div><AppLink className="button button-secondary" to={publicTemplateRoutes.modernLuxePreview}><Eye /> Toàn màn hình</AppLink><button className="button button-primary" disabled title="Sẽ bật khi nối API"><FloppyDisk /> Lưu</button></div></header>
    <div className="editor-workspace editor-workspace-two-column">
      <aside className="editor-sections editor-section-accordion" aria-label="Cấu trúc và nội dung thiệp"><header><div><strong>Cấu trúc thiệp</strong><small>Mở từng phần để chỉnh sửa nội dung</small></div><div className="editor-couple-quick-edit"><Input label="Tên cô dâu" value={data.brideName} onChange={(v) => update('brideName', v)} /><Input label="Tên chú rể" value={data.groomName} onChange={(v) => update('groomName', v)} /></div></header><ol>{order.map((key, index) => <EditorSectionCard key={key} sectionKey={key} index={index} order={order} expanded={expandedSection === key} shown={enabled.includes(key)} select={() => selectSection(key)} focus={() => { setSelected(key); focusPreviewSection(key) }} move={(step) => { move(key, step); focusPreviewSection(key) }} toggle={() => toggle(key)}><Fields section={key} data={data} palette={palette} update={update} setPalette={setPalette} upload={upload} uploadMusic={uploadMusic} uploadActivityImage={uploadActivityImage} imageError={imageError} musicError={musicError} /></EditorSectionCard>)}</ol></aside>
      <main className={`editor-canvas editor-iframe-canvas ${mobilePreviewOpen ? 'is-mobile-preview-open' : ''}`} aria-label="Bản xem trước thiệp"><button className="editor-mobile-preview-toggle" type="button" onClick={() => setMobilePreviewOpen((current) => !current)} aria-expanded={mobilePreviewOpen}>{mobilePreviewOpen ? <X /> : <ArrowsOut />}<span>{mobilePreviewOpen ? 'Thu nhỏ' : 'Xem thiệp'}</span></button><EditorPreviewFrame device={previewDevice} frameRef={frameRef} onLoad={sendState} ready={ready} /><button className="editor-mobile-preview-hitbox" type="button" onClick={() => setMobilePreviewOpen(true)} aria-label="Mở rộng bản xem trước thiệp" /></main>
    </div>
    {mobileAdviceOpen ? <div className="editor-mobile-advice-backdrop" role="presentation"><section className="editor-mobile-advice" role="dialog" aria-modal="true" aria-labelledby="mobile-editor-advice-title"><Monitor size={30} /><h2 id="mobile-editor-advice-title">Chỉnh thiệp dễ hơn trên máy tính</h2><p>Bạn vẫn có thể chỉnh sửa đầy đủ trên điện thoại. Với màn hình lớn, việc nhập nội dung và quan sát toàn bộ thiệp sẽ trực quan hơn.</p><button className="button button-primary" type="button" onClick={() => setMobileAdviceOpen(false)}>Đã hiểu, tiếp tục</button></section></div> : null}
  </section>
}

const previewViewports = { desktop: { width: 1200, height: 800 }, mobile: { width: 550, height: 950 } } as const

function EditorPreviewFrame({ device, frameRef, onLoad, ready }: { device: keyof typeof previewViewports; frameRef: RefObject<HTMLIFrameElement>; onLoad: () => void; ready: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const dimensions = previewViewports[device]
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof ResizeObserver === 'undefined') return
    const resize = () => setScale(viewport.clientWidth / dimensions.width)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [dimensions.width])
  const frameStyle = { width: dimensions.width, height: dimensions.height, transform: `scale(${scale})` } as CSSProperties
  return <div className={`editor-iframe-shell is-${device}`}><div className="editor-browser-bar"><i /><i /><i /><span>{device === 'desktop' ? 'Desktop · 1200 × 800' : 'Mobile · 550 × 950'}</span></div><div ref={viewportRef} className="editor-preview-viewport" style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}>{!ready ? <div className="editor-preview-loading" role="status"><span aria-hidden="true" /><strong>Đang tải bản xem trước…</strong><small>Đang chuẩn bị giao diện thiệp</small></div> : null}<iframe ref={frameRef} style={frameStyle} title="Bản xem trước thiệp Élan d’Amour" src={`${publicTemplateRoutes.modernLuxePreview}?editor=1`} onLoad={onLoad} /></div></div>
}

function EditorSectionCard({ sectionKey, index, order, expanded, shown, select, focus, move, toggle, children }: { sectionKey: Section; index: number; order: Section[]; expanded: boolean; shown: boolean; select: () => void; focus: () => void; move: (step: -1 | 1) => void; toggle: () => void; children: React.ReactNode }) {
  const reorderable = canReorderSection(sectionKey)
  const canMoveUp = reorderable && index > 0 && canReorderSection(order[index - 1])
  const canMoveDown = reorderable && index < order.length - 1 && canReorderSection(order[index + 1])
  return <li className={`editor-accordion-card ${expanded ? 'is-expanded' : ''} ${shown ? '' : 'is-disabled'}`}><header><button type="button" className="editor-accordion-trigger" onClick={select} aria-expanded={expanded}><span><strong>{labels[sectionKey]}</strong><small>{required.includes(sectionKey) ? 'Bắt buộc' : shown ? 'Đang hiển thị' : 'Đang ẩn'}</small></span><CaretDown /></button><div className="editor-section-tools"><button type="button" disabled={!canMoveUp} onClick={() => move(-1)} aria-label={`Đưa ${labels[sectionKey]} lên`} title={reorderable ? 'Đưa lên' : 'Vị trí được khóa bởi giao diện'}><ArrowUp /></button><button type="button" disabled={!canMoveDown} onClick={() => move(1)} aria-label={`Đưa ${labels[sectionKey]} xuống`} title={reorderable ? 'Đưa xuống' : 'Vị trí được khóa bởi giao diện'}><ArrowDown /></button><button type="button" role="switch" aria-checked={shown} aria-label={`${shown ? 'Ẩn' : 'Hiện'} ${labels[sectionKey]}`} disabled={required.includes(sectionKey)} className={`editor-switch ${shown ? 'is-on' : ''}`} onClick={toggle}><span /></button></div></header>{expanded ? <div className="editor-accordion-content" onFocusCapture={focus}>{children}</div> : null}</li>
}

function Input({ label, ariaLabel, value, type = 'text', area, onChange }: { label: string; ariaLabel?: string; value?: string; type?: string; area?: boolean; onChange: (value: string) => void }) { return <label className="editor-field"><span>{label}</span>{area ? <textarea aria-label={ariaLabel} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} /> : <input aria-label={ariaLabel} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}</label> }
function FamilyPersonFields({ person, title, name, updateTitle, updateName }: { person: string; title?: string; name?: string; updateTitle: (value: string) => void; updateName: (value: string) => void }) {
  return <div className="editor-family-person-fields"><strong>{person}</strong><div className="editor-family-person-grid"><Input label="Danh xưng" ariaLabel={`Danh xưng ${person.toLowerCase()}`} value={title} onChange={updateTitle} /><Input label="Họ tên" ariaLabel={`Họ tên ${person.toLowerCase()}`} value={name} onChange={updateName} /></div></div>
}
type FieldsProps = { section: Section; data: ModernLuxeData; palette: ModernLuxePalette; update: (key: keyof ModernLuxeData, value: EditorValue) => void; setPalette: (p: ModernLuxePalette) => void; upload: (files: FileList | null) => Promise<void>; uploadMusic: (files: FileList | null) => Promise<void>; uploadActivityImage: (index: number, files: FileList | null) => Promise<void>; imageError: string; musicError: string }
function Fields({ section, data, palette, update, setPalette, upload, uploadMusic, uploadActivityImage, imageError, musicError }: FieldsProps) {
  if (section === 'cover') return <><div className="editor-palette">{(['champagne', 'midnight', 'sage'] as const).map((p) => <button type="button" key={p} className={palette === p ? 'is-active' : ''} onClick={() => setPalette(p)}><i className={`palette-dot ${p}`} />{p}</button>)}</div><Input label="Dòng mở đầu" value={data.eyebrow} onChange={(v) => update('eyebrow', v)} /><div className="editor-field-grid"><Input label="Tên cô dâu" value={data.brideName} onChange={(v) => update('brideName', v)} /><Input label="Tên chú rể" value={data.groomName} onChange={(v) => update('groomName', v)} /></div><Input label="Ngày cưới hiển thị" value={data.weddingDate} onChange={(v) => update('weddingDate', v)} /></>
  if (section === 'invitation') return <><Input label="Tiêu đề lời mời" value={data.invitationTitle} onChange={(v) => update('invitationTitle', v)} /><Input label="Nội dung lời mời" area value={data.invitationMessage} onChange={(v) => update('invitationMessage', v)} /></>
  if (section === 'families') return <><div className="editor-field-divider">Nhà gái</div><FamilyPersonFields person="Cha cô dâu" title={data.brideFatherTitle} name={data.brideFather} updateTitle={(v) => update('brideFatherTitle', v)} updateName={(v) => update('brideFather', v)} /><FamilyPersonFields person="Mẹ cô dâu" title={data.brideMotherTitle} name={data.brideMother} updateTitle={(v) => update('brideMotherTitle', v)} updateName={(v) => update('brideMother', v)} /><div className="editor-field-divider">Nhà trai</div><FamilyPersonFields person="Cha chú rể" title={data.groomFatherTitle} name={data.groomFather} updateTitle={(v) => update('groomFatherTitle', v)} updateName={(v) => update('groomFather', v)} /><FamilyPersonFields person="Mẹ chú rể" title={data.groomMotherTitle} name={data.groomMother} updateTitle={(v) => update('groomMotherTitle', v)} updateName={(v) => update('groomMother', v)} /></>
  if (section === 'eventDetails') return <div className="editor-field-grid"><Input label="Giờ đón khách" type="time" value={data.ceremonyTime} onChange={(v) => update('ceremonyTime', v)} /><Input label="Giờ khai tiệc" type="time" value={data.receptionTime} onChange={(v) => update('receptionTime', v)} /></div>
  if (section === 'timeline') return <TimelineFields items={data.timelineItems ?? []} onChange={(items) => update('timelineItems', items)} />
  if (section === 'venue') return <><Input label="Tên địa điểm" value={data.venueName} onChange={(v) => update('venueName', v)} /><Input label="Địa chỉ" area value={data.venueAddress} onChange={(v) => update('venueAddress', v)} /><Input label="Link Google Maps" type="url" value={data.mapUrl} onChange={(v) => update('mapUrl', v)} /></>
  if (section === 'activities') return <ActivityFields items={data.activities ?? []} style={data.activitiesStyle ?? 'activity-cards'} update={update} uploadImage={uploadActivityImage} imageError={imageError} />
  if (section === 'gallery') return <><DisplayStyleField label="Kiểu hiển thị album" value={data.galleryStyle ?? 'deck-3d'} options={modernLuxeDisplayStyles.gallery} onChange={(value) => update('galleryStyle', value)} /><label className="editor-upload"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { void upload(e.target.files); e.target.value = '' }} /><UploadSimple /><strong>Thêm ảnh vào album</strong><span>Tối đa 12 ảnh · 5MB/ảnh</span></label>{imageError ? <p className="editor-upload-error">{imageError}</p> : null}<div className="editor-image-grid">{(data.galleryImages ?? []).map((src, i) => <figure key={`${src.slice(0, 20)}-${i}`}><img src={src} alt={`Ảnh album ${i + 1}`} /><button type="button" onClick={() => update('galleryImages', (data.galleryImages ?? []).filter((_, index) => index !== i))}>×</button></figure>)}</div>{!data.galleryImages?.length ? <div className="editor-field-placeholder"><Image /><strong>Đang dùng ảnh mẫu</strong><p>Tải ảnh lên để thay ngay trong thiệp.</p></div> : null}</>
  if (section === 'rsvp') return <><Input label="Hạn phản hồi" value={data.rsvpDeadline} onChange={(v) => update('rsvpDeadline', v)} /><Input label="Lời nhắn RSVP" area value={data.rsvpMessage} onChange={(v) => update('rsvpMessage', v)} /></>
  if (section === 'gift') return <Input label="Lời nhắn mừng cưới" area value={data.giftMessage} onChange={(v) => update('giftMessage', v)} />
  if (section === 'music') return <><label className="editor-upload editor-audio-upload"><input type="file" accept="audio/*" onChange={(event) => { void uploadMusic(event.target.files); event.target.value = '' }} /><MusicNote /><strong>{data.backgroundMusicUrl ? 'Thay nhạc nền' : 'Tải nhạc nền lên'}</strong><span>File âm thanh · tối đa 15MB</span></label>{musicError ? <p className="editor-upload-error">{musicError}</p> : null}<label className="editor-setting-row"><span><strong>Tự động phát</strong><small>Phát nhạc khi khách mở thiệp</small></span><button type="button" role="switch" aria-checked={data.backgroundMusicAutoplay !== false} className={`editor-switch ${data.backgroundMusicAutoplay !== false ? 'is-on' : ''}`} onClick={() => update('backgroundMusicAutoplay', data.backgroundMusicAutoplay === false)}><span /></button></label>{data.backgroundMusicUrl ? <div className="editor-audio-selected"><MusicNote /><span><strong>{data.backgroundMusicName || 'Nhạc nền'}</strong><small>Nhấn nút loa trong preview để nghe thử</small></span><button type="button" onClick={() => setDataMusicEmpty(update)} aria-label="Xóa nhạc nền"><Trash /></button></div> : <div className="editor-field-placeholder"><MusicNote /><strong>Chưa có nhạc nền</strong><p>Tải file lên để nghe thử trực tiếp trong preview.</p></div>}</>
  return <div className="editor-field-placeholder"><strong>Section tự động</strong><p>Section dùng thông tin chung đã nhập. Bạn có thể đổi vị trí hoặc bật/tắt ở danh sách bên trái.</p></div>
}

function setDataMusicEmpty(update: FieldsProps['update']) { update('backgroundMusicUrl', ''); update('backgroundMusicName', '') }

function TimelineFields({ items, onChange }: { items: NonNullable<ModernLuxeData['timelineItems']>; onChange: (items: NonNullable<ModernLuxeData['timelineItems']>) => void }) {
  const updateItem = (index: number, key: 'time' | 'title' | 'detail', value: string) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))
  return <div className="editor-timeline-fields">{items.map((item, index) => <article key={index}><header><strong>Hạng mục {index + 1}</strong><button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Xóa hạng mục ${index + 1}`}><Trash /></button></header><div className="editor-field-grid"><Input label="Thời gian" type="time" value={item.time} onChange={(value) => updateItem(index, 'time', value)} /><Input label="Tên hạng mục" value={item.title} onChange={(value) => updateItem(index, 'title', value)} /></div><Input label="Mô tả" area value={item.detail} onChange={(value) => updateItem(index, 'detail', value)} /></article>)}<button className="editor-add-item" type="button" disabled={items.length >= 10} onClick={() => onChange([...items, { time: '', title: '', detail: '' }])}><Plus /> Thêm hạng mục</button></div>
}

function DisplayStyleField({ label, value, options, onChange }: { label: string; value: string; options: readonly { key: string; label: string }[]; onChange: (value: string) => void }) {
  return <label className="editor-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}</select></label>
}

function ActivityFields({ items, style, update, uploadImage, imageError }: { items: ModernLuxeActivityItem[]; style: string; update: FieldsProps['update']; uploadImage: FieldsProps['uploadActivityImage']; imageError: string }) {
  const updateItem = (index: number, title: string) => update('activities', items.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item))
  return <><DisplayStyleField label="Kiểu hiển thị hoạt động" value={style} options={modernLuxeDisplayStyles.activities} onChange={(value) => update('activitiesStyle', value)} /><div className="editor-activity-fields">{items.map((item, index) => <article key={index}><header><strong>Hoạt động {index + 1}</strong><button type="button" onClick={() => update('activities', items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Xóa hoạt động ${index + 1}`}><Trash /></button></header><Input label="Tên hoạt động" value={item.title} onChange={(value) => updateItem(index, value)} /><label className="editor-activity-image"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { void uploadImage(index, event.target.files); event.target.value = '' }} /><img src={item.image} alt="" /><span><UploadSimple /> Thay ảnh</span></label></article>)}</div>{imageError ? <p className="editor-upload-error">{imageError}</p> : null}<button className="editor-add-item" type="button" disabled={items.length >= 8} onClick={() => update('activities', [...items, { title: 'Hoạt động mới', image: '/assets/images/templates/modern-luxe/wedding-detail.jpg' }])}><Plus /> Thêm hoạt động</button></>
}
