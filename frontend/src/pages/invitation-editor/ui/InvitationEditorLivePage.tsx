import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { ArrowClockwise, ArrowDown, ArrowLeft, ArrowUUpLeft, ArrowUUpRight, ArrowUp, ArrowsOut, CaretDown, CheckCircle, Desktop, DeviceMobile, Eye, FloppyDisk, Image, Monitor, MusicNote, Plus, RocketLaunch, Trash, UploadSimple, X } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { readEditorImages, useEditorSections, useLiveEditorBridge } from '../../../shared/lib/live-template-editor'
import type { ModernLuxeActivityItem, ModernLuxeData } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { modernLuxeDisplayStyles, modernLuxeTemplateConfig } from '../../../templates/invitations/modern-luxe/template-config'
import { resolveEditorSections, validateSchemaContent, type EditorSectionDefinition } from './invitation-editor-schema'

type Section = string
type EditorData = ModernLuxeData & Record<string, unknown>
type EditorValue = unknown
type FieldErrors = Record<string, string>
const labels: Record<string, string> = { cover: 'Bìa & cặp đôi', banner: 'Banner cặp đôi', invitation: 'Lời mời', families: 'Hai gia đình', eventDetails: 'Thời gian hôn lễ', ceremony: 'Lễ thành hôn', reception: 'Tiệc cưới', countdown: 'Lịch & đếm ngược', calendar: 'Lịch ngày cưới', timeline: 'Lịch trình', venue: 'Địa điểm & bản đồ', map: 'Bản đồ', activities: 'Hoạt động trong tiệc', gallery: 'Album ảnh', rsvp: 'Xác nhận tham dự', guestbook: 'Sổ lưu bút', gift: 'Thông tin mừng cưới', thanks: 'Lời cảm ơn', loveJourney: 'Hành trình tình yêu', music: 'Nhạc nền' }
const allSections = Object.keys(labels).filter((key) => key !== 'music')
const initialData: ModernLuxeData = { brideName: 'Mai', groomName: 'Đức', weddingDate: '18 · 10 · 2026', eyebrow: 'Trân trọng kính mời', invitationTitle: 'Đến chung vui trong ngày thành hôn', invitationMessage: 'Sự hiện diện của bạn là niềm vui và món quà quý giá trong ngày chúng mình bắt đầu một hành trình mới.', ceremonyTime: '09:00', receptionTime: '11:00', venueName: 'The Garden Hall', venueAddress: 'Hà Nội', brideFatherTitle: 'Ông', brideFather: 'Nguyễn Văn An', brideMotherTitle: 'Bà', brideMother: 'Trần Thu Hà', groomFatherTitle: 'Ông', groomFather: 'Phạm Văn Minh', groomMotherTitle: 'Bà', groomMother: 'Lê Ngọc Lan', timelineItems: [{ time: '09:00', title: 'Đón khách', detail: 'Gặp gỡ và chụp ảnh cùng khách mời.' }, { time: '10:00', title: 'Lễ thành hôn', detail: 'Cùng chứng kiến nghi thức thành hôn.' }, { time: '11:00', title: 'Khai tiệc', detail: 'Khai tiệc và chung vui cùng hai gia đình.' }], activities: [{ title: 'Photobooth kỷ niệm', image: '/assets/images/templates/modern-luxe/wedding-detail.jpg' }, { title: 'Chụp hình cùng cô dâu chú rể', image: '/assets/images/templates/modern-luxe/couple-portrait.jpg' }, { title: 'Góc bong bóng cho bé', image: '/assets/images/login-wedding-luxury.jpg' }], activitiesStyle: 'activity-cards', galleryStyle: 'deck-3d', backgroundMusicAutoplay: true, rsvpDeadline: '10.10.2026', rsvpMessage: 'Vui lòng xác nhận để chúng mình chuẩn bị đón tiếp bạn thật chu đáo.', giftMessage: 'Tình cảm và sự hiện diện của bạn là món quà ý nghĩa nhất.', galleryImages: [] }

export function InvitationEditorLivePage() {
  const { navigate } = useNavigation()
  const workspace = useOptionalWeddingWorkspace()
  const activeWedding = workspace?.activeWedding ?? null
  const activeWeddingId = activeWedding?.id ?? null
  const [device, setDevice] = useState<'desktop' | 'mobile'>('mobile')
  const [isMobileEditor, setIsMobileEditor] = useState(() => window.matchMedia?.('(max-width: 767px)').matches ?? false)
  const [sectionDefinitions, setSectionDefinitions] = useState<EditorSectionDefinition[]>(() => resolveEditorSections({ sections: modernLuxeTemplateConfig.sections }, allSections))
  const sectionDefinitionsRef = useRef(sectionDefinitions); sectionDefinitionsRef.current = sectionDefinitions
  const requiredSections = sectionDefinitions.filter((section) => section.required).map((section) => section.sectionKey)
  const { setSelected, order, enabled, move, toggle, reset } = useEditorSections(sectionDefinitions.map((section) => section.sectionKey), requiredSections, (key) => sectionDefinitionsRef.current.find((section) => section.sectionKey === key)?.canReorder !== false)
  const [data, setData] = useState<EditorData>(initialData), [palette, setPalette] = useState('champagne')
  const [, setPaletteOptions] = useState<string[]>(['champagne', 'midnight', 'sage'])
  const [imageError, setImageError] = useState('')
  const [musicError, setMusicError] = useState('')
  const [expandedSection, setExpandedSection] = useState<Section | null>('cover')
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [mobileAdviceOpen, setMobileAdviceOpen] = useState(isMobileEditor)
  const [contentRevision, setContentRevision] = useState<number | null>(null)
  const [templateVersionId, setTemplateVersionId] = useState<string | null>(null)
  const [templateKey, setTemplateKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(activeWedding))
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const [conflicted, setConflicted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const historyRef = useRef<Array<{ data: EditorData; palette: string; order: string[]; enabled: string[] }>>([])
  const futureRef = useRef<Array<{ data: EditorData; palette: string; order: string[]; enabled: string[] }>>([])
  const [historyVersion, setHistoryVersion] = useState(0)
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishSlug, setPublishSlug] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const baselineRef = useRef('')
  const allowNavigationRef = useRef(false)
  const previewDevice = isMobileEditor ? 'mobile' : device
  const loadContent = useCallback(async () => {
    if (!activeWeddingId) return
    setLoading(true); setApiError(''); setSaveMessage(''); setConflicted(false); setFieldErrors({})
    try {
      const loaded = (await weddingApi.content(activeWeddingId, 'ONLINE_INVITATION')).content
      if (!loaded.templateVersion) throw new Error('Hãy chọn giao diện thiệp trước khi chỉnh sửa.')
      const stored = loaded.content as EditorData
      const storedPalette = typeof loaded.themeConfig.palette === 'string' ? loaded.themeConfig.palette : undefined
      const definitions = resolveEditorSections(loaded.templateVersion.config, loaded.sectionConfig.order)
      const validKeys = definitions.map((section) => section.sectionKey)
      const nextOrder = loaded.sectionConfig.order.filter((key) => validKeys.includes(key))
      const nextEnabled = loaded.sectionConfig.enabled.filter((key) => validKeys.includes(key))
      setSectionDefinitions(definitions)
      setData({ ...initialData, ...stored })
      const configuredPalettes = ((loaded.templateVersion.config.palettes ?? []) as Array<{ key: string }>).map((item) => item.key)
      setPaletteOptions(configuredPalettes.length ? configuredPalettes : ['champagne', 'midnight', 'sage'])
      const loadedPalette = storedPalette ?? configuredPalettes[0] ?? 'champagne'
      const loadedOrder = nextOrder.length ? nextOrder : validKeys
      const loadedEnabled = nextEnabled.length ? nextEnabled : validKeys
      setPalette(loadedPalette); reset(loadedOrder, loadedEnabled)
      baselineRef.current = editorSignature({ ...initialData, ...stored }, loadedPalette, loadedOrder, loadedEnabled)
      setContentRevision(loaded.revision); setTemplateVersionId(loaded.templateVersion.id); setTemplateKey(loaded.templateVersion.key); setDirty(false)
    } catch (cause) { setApiError(friendlyEditorError(cause, 'Không thể tải nội dung thiệp. Vui lòng thử lại.')) }
    finally { setLoading(false) }
  }, [activeWeddingId, reset])
  useEffect(() => { void loadContent() }, [loadContent])
  useEffect(() => {
    if (!saveMessage || conflicted) return
    const timeout = window.setTimeout(() => setSaveMessage(''), 1800)
    return () => window.clearTimeout(timeout)
  }, [conflicted, saveMessage])
  useEffect(() => {
    const query = window.matchMedia?.('(max-width: 767px)')
    if (!query) return
    const updateViewport = (event: MediaQueryListEvent) => { setIsMobileEditor(event.matches); if (event.matches) setDevice('mobile') }
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])
  const { frameRef, ready, sendState, scrollToSection } = useLiveEditorBridge<{ data: EditorData; palette: string; sectionConfig: { enabled: string[]; order: string[] } }, Section>({ data, palette, sectionConfig: { enabled, order } })
  const snapshot = () => ({ data: structuredClone(data), palette, order: [...order], enabled: [...enabled] })
  const recordHistory = () => { historyRef.current.push(snapshot()); if (historyRef.current.length > 50) historyRef.current.shift(); futureRef.current = []; setHistoryVersion((value) => value + 1) }
  const restoreSnapshot = (value: ReturnType<typeof snapshot>) => { setData(value.data); setPalette(value.palette); reset(value.order, value.enabled); setDirty(true); setSaveMessage(''); setHistoryVersion((version) => version + 1) }
  const undo = () => { const previous = historyRef.current.pop(); if (!previous) return; futureRef.current.push(snapshot()); restoreSnapshot(previous) }
  const redo = () => { const next = futureRef.current.pop(); if (!next) return; historyRef.current.push(snapshot()); restoreSnapshot(next) }
  const update = (key: string, value: EditorValue) => { recordHistory(); setData((current) => ({ ...current, [key]: value })); setFieldErrors((current) => { const next = { ...current }; delete next[key]; return next }); setDirty(true); setSaveMessage('') }
  const choosePalette = (value: string) => { recordHistory(); setPalette(value); setDirty(true); setSaveMessage('') }
  const focusPreviewSection = (key: Section) => { if (key !== 'music') scrollToSection(key) }
  const selectSection = (key: Section) => { setSelected(key); setExpandedSection((current) => current === key ? null : key); focusPreviewSection(key) }
  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    const accepted = [...files].filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024).slice(0, Math.max(0, 12 - (data.galleryImages?.length ?? 0)))
    if (!activeWedding) { const result = await readEditorImages(files, data.galleryImages?.length ?? 0); setImageError(result.rejected ? 'Chỉ nhận ảnh JPG, PNG hoặc WebP tối đa 5MB.' : ''); update('galleryImages', [...(data.galleryImages ?? []), ...result.images]); return }
    if (accepted.length !== files.length) setImageError('Chỉ nhận ảnh JPG, PNG hoặc WebP tối đa 5MB, tối đa 12 ảnh.')
    try { const assets = await Promise.all(accepted.map((file) => weddingApi.uploadMedia(activeWedding.id, file))); update('galleryImages', [...(data.galleryImages ?? []), ...assets.map((asset) => asset.publicUrl)]) }
    catch (cause) { setImageError(cause instanceof Error ? cause.message : 'Không thể tải ảnh lên.') }
  }
  const uploadMusic = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith('audio/') || file.size > 15 * 1024 * 1024) { setMusicError('Chỉ nhận file âm thanh tối đa 15MB.'); return }
    const url = await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file) })
    setMusicError(''); setData((current) => ({ ...current, backgroundMusicUrl: url, backgroundMusicName: file.name })); setDirty(true)
  }
  const uploadActivityImage = async (index: number, files: FileList | null) => {
    if (activeWedding && files?.[0]) {
      const file = files[0]
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setImageError('Chỉ nhận ảnh JPG, PNG hoặc WebP tối đa 5MB.'); return }
      try { const asset = await weddingApi.uploadMedia(activeWedding.id, file); setImageError(''); update('activities', (data.activities ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, image: asset.publicUrl } : item)) }
      catch (cause) { setImageError(cause instanceof Error ? cause.message : 'Không thể tải ảnh lên.') }
      return
    }
    const result = await readEditorImages(files, 0, 1)
    if (!result.images[0]) { setImageError(result.rejected ? 'Chỉ nhận ảnh JPG, PNG hoặc WebP tối đa 5MB.' : ''); return }
    setImageError(''); update('activities', (data.activities ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, image: result.images[0] } : item))
  }
  const save = async (): Promise<boolean> => {
    if (!activeWedding || !templateVersionId || contentRevision === null) return false
    const validationErrors = validateSchemaContent(data as Record<string, unknown>, sectionDefinitions, enabled)
    if (Object.keys(validationErrors).length) {
      showFirstInvalidField(validationErrors, sectionDefinitions, setFieldErrors, setExpandedSection, setSelected)
      setApiError('Vui lòng kiểm tra các nội dung được đánh dấu.'); setSaveMessage('')
      return false
    }
    setSaving(true); setApiError(''); setSaveMessage('')
    try {
      const persistedData = { ...data }
      const localMusicOnly = persistedData.backgroundMusicUrl?.startsWith('data:')
      if (localMusicOnly) { delete persistedData.backgroundMusicUrl; delete persistedData.backgroundMusicName }
      const sectionConfig = { enabled, order }
      const saved = await weddingApi.saveContent(activeWedding.id, { surface: 'ONLINE_INVITATION', templateVersionId, content: persistedData, themeConfig: { palette }, sectionConfig, revision: contentRevision })
      setContentRevision(saved.content.revision); baselineRef.current = editorSignature(data, palette, order, enabled); setDirty(false); setSaveMessage(localMusicOnly ? 'Đã lưu nội dung thiệp. Nhạc demo chỉ được giữ trong phiên chỉnh sửa này.' : 'Đã lưu thay đổi.')
      return true
    } catch (cause) {
      if (cause instanceof WeddingApiError && cause.status === 409) { setConflicted(true); setSaveMessage('Nội dung đã thay đổi ở nơi khác. Tải lại bản mới để tiếp tục.') }
      else if (cause instanceof WeddingApiError && cause.status === 400) {
        const errors = mapServerFieldErrors(cause.fieldErrors)
        if (Object.keys(errors).length) showFirstInvalidField(errors, sectionDefinitions, setFieldErrors, setExpandedSection, setSelected)
        setApiError(Object.keys(errors).length ? 'Vui lòng kiểm tra các nội dung được đánh dấu.' : 'Một số nội dung chưa hợp lệ. Vui lòng kiểm tra lại rồi thử lưu.')
      } else setApiError(friendlyEditorError(cause, 'Có lỗi xảy ra khi lưu thiệp. Vui lòng thử lại.'))
      return false
    } finally { setSaving(false) }
  }
  const openFullPreview = () => {
    if (!templateKey) return
    sessionStorage.setItem(`gmm-invitation-preview:${templateKey}`, JSON.stringify({ data, palette, sectionConfig: { enabled, order } }))
    window.open(previewRoute(templateKey), '_blank', 'noopener,noreferrer')
  }
  const publish = async () => {
    if (!activeWedding || dirty || !publishSlug.trim()) return
    setPublishing(true); setApiError('')
    try {
      const slug = publishSlug.trim().toLocaleLowerCase('vi').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
      const availability = await weddingApi.slugAvailable(slug, activeWedding.id)
      if (!availability.available) { setApiError('Đường dẫn này đã được sử dụng. Vui lòng chọn đường dẫn khác.'); return }
      await weddingApi.publish(activeWedding.id, { surface: 'ONLINE_INVITATION', slug, revision: activeWedding.revision })
      setPublishOpen(false); setPublishSlug(slug); setSaveMessage('Thiệp đã được xuất bản thành công.'); await workspace?.refresh()
    } catch (cause) { setApiError(friendlyEditorError(cause, 'Không thể xuất bản thiệp. Vui lòng thử lại.')) }
    finally { setPublishing(false) }
  }
  const unpublish = async () => {
    if (!activeWedding || publishing || !window.confirm('Bạn muốn gỡ thiệp khỏi đường dẫn công khai? Nội dung đã lưu vẫn được giữ nguyên.')) return
    setPublishing(true); setApiError('')
    try {
      await weddingApi.unpublish(activeWedding.id, 'ONLINE_INVITATION')
      setSaveMessage('Đã gỡ xuất bản thiệp. Nội dung chỉnh sửa vẫn được giữ nguyên.'); await workspace?.refresh()
    } catch (cause) { setApiError(friendlyEditorError(cause, 'Không thể gỡ xuất bản thiệp. Vui lòng thử lại.')) }
    finally { setPublishing(false) }
  }
  const hasUnsavedChanges = useCallback(() => dirty && editorSignature(data, palette, order, enabled) !== baselineRef.current, [data, dirty, enabled, order, palette])
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (hasUnsavedChanges()) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsavedChanges])
  useEffect(() => {
    const interceptLink = (event: MouseEvent) => {
      if (allowNavigationRef.current || !hasUnsavedChanges() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank') return
      const target = new URL(anchor.href, window.location.href)
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname) return
      event.preventDefault(); event.stopPropagation(); setPendingNavigation(`${target.pathname}${target.search}${target.hash}`)
    }
    document.addEventListener('click', interceptLink, true)
    return () => document.removeEventListener('click', interceptLink, true)
  }, [hasUnsavedChanges])
  return <section className="invitation-editor" aria-labelledby="invitation-editor-heading">
    <header className="editor-toolbar"><div className="editor-toolbar-title"><AppLink to={studioRoutes.inviteThemes} ariaLabel="Quay lại kho giao diện"><ArrowLeft /></AppLink><div><p>Thiệp online · {templateKey ?? 'Đang tải giao diện'}</p><h1 id="invitation-editor-heading">Chỉnh sửa thiệp</h1></div></div><div className="editor-toolbar-actions"><span className={`editor-live-status ${ready ? 'is-ready' : ''}`}>{loading ? 'Đang tải nội dung…' : saving ? 'Đang lưu…' : dirty ? 'Có thay đổi chưa lưu' : saveMessage || (templateVersionId ? 'Nội dung đã sẵn sàng' : ready ? 'Bản xem trước đã sẵn sàng' : 'Đang chuẩn bị…')}</span><div className="editor-history-actions" data-history-version={historyVersion}><button type="button" disabled={!historyRef.current.length} onClick={undo} aria-label="Hoàn tác"><ArrowUUpLeft /></button><button type="button" disabled={!futureRef.current.length} onClick={redo} aria-label="Làm lại"><ArrowUUpRight /></button></div>{activeWedding ? <button className="button button-secondary" type="button" disabled={loading || saving} onClick={() => void loadContent()}><ArrowClockwise /> Tải lại</button> : null}<div className="editor-device-toggle" aria-hidden={isMobileEditor}><button type="button" aria-label="Xem dạng máy tính" aria-pressed={previewDevice === 'desktop'} className={previewDevice === 'desktop' ? 'is-active' : ''} onClick={() => setDevice('desktop')}><Desktop /></button><button type="button" aria-label="Xem dạng điện thoại" aria-pressed={previewDevice === 'mobile'} className={previewDevice === 'mobile' ? 'is-active' : ''} onClick={() => setDevice('mobile')}><DeviceMobile /></button></div><button className="button button-secondary" type="button" onClick={openFullPreview}><Eye /> Toàn màn hình</button><button className="button button-secondary" type="button" disabled={dirty || saving || !templateVersionId} onClick={() => setPublishOpen(true)}><RocketLaunch /> Xuất bản</button><button className="button button-primary" type="button" disabled={!activeWedding || !templateVersionId || loading || saving} onClick={() => void save()}><FloppyDisk /> {saving ? 'Đang lưu' : 'Lưu thiệp'}</button></div></header>
    {apiError ? <div className="editor-api-feedback is-error" role="alert"><span>{apiError}</span>{Object.keys(fieldErrors).length ? <button type="button" onClick={() => setApiError('')}>Đóng</button> : <button type="button" onClick={() => void loadContent()}>Thử lại</button>}</div> : saveMessage ? <div className={`editor-api-feedback ${conflicted ? 'is-error' : 'is-success'}`} role={conflicted ? 'alert' : 'status'}>{!conflicted ? <CheckCircle className="editor-success-check" size={42} weight="fill" /> : null}<span>{saveMessage}</span>{conflicted ? <button type="button" onClick={() => void loadContent()}>Tải lại bản mới</button> : null}</div> : null}
    {activeWedding?.status === 'PUBLISHED' ? <div className="editor-published-bar"><span>Thiệp đang được công khai{publishSlug ? ` tại /${publishSlug}` : ''}.</span><button className="button button-secondary" type="button" disabled={publishing} onClick={() => void unpublish()}>{publishing ? 'Đang xử lý…' : 'Gỡ xuất bản'}</button></div> : null}
    <div className="editor-workspace editor-workspace-two-column">
      <aside className="editor-sections editor-section-accordion" aria-label="Cấu trúc và nội dung thiệp" aria-busy={loading}><header><div><strong>Cấu trúc thiệp</strong><small>{loading ? 'Đang tải nội dung đã lưu…' : 'Mở từng phần để chỉnh sửa nội dung'}</small></div><div className="editor-couple-quick-edit"><Input fieldKey="brideName" label="Tên cô dâu" value={data.brideName} error={fieldErrors.brideName} onChange={(v) => update('brideName', v)} /><Input fieldKey="groomName" label="Tên chú rể" value={data.groomName} error={fieldErrors.groomName} onChange={(v) => update('groomName', v)} /></div></header><ol>{order.map((key, index) => <EditorSectionCard key={key} sectionKey={key} definition={sectionDefinitions.find((section) => section.sectionKey === key)} index={index} order={order} expanded={expandedSection === key} shown={enabled.includes(key)} select={() => selectSection(key)} focus={() => { setSelected(key); focusPreviewSection(key) }} move={(step) => { move(key, step); setDirty(true); focusPreviewSection(key) }} toggle={() => { toggle(key); setDirty(true) }}><Fields section={key} definition={sectionDefinitions.find((section) => section.sectionKey === key)} data={data} palette={palette} fieldErrors={fieldErrors} update={update} setPalette={choosePalette} upload={upload} uploadMusic={uploadMusic} uploadActivityImage={uploadActivityImage} imageError={imageError} musicError={musicError} /></EditorSectionCard>)}</ol></aside>
      <main className={`editor-canvas editor-iframe-canvas ${mobilePreviewOpen ? 'is-mobile-preview-open' : ''}`} aria-label="Bản xem trước thiệp"><button className="editor-mobile-preview-toggle" type="button" onClick={() => setMobilePreviewOpen((current) => !current)} aria-expanded={mobilePreviewOpen}>{mobilePreviewOpen ? <X /> : <ArrowsOut />}<span>{mobilePreviewOpen ? 'Thu nhỏ' : 'Xem thiệp'}</span></button><EditorPreviewFrame device={previewDevice} templateKey={templateKey} frameRef={frameRef} onLoad={sendState} ready={ready} /><button className="editor-mobile-preview-hitbox" type="button" onClick={() => setMobilePreviewOpen(true)} aria-label="Mở rộng bản xem trước thiệp" /></main>
    </div>
    {mobileAdviceOpen ? <div className="editor-mobile-advice-backdrop" role="presentation"><section className="editor-mobile-advice" role="dialog" aria-modal="true" aria-labelledby="mobile-editor-advice-title"><Monitor size={30} /><h2 id="mobile-editor-advice-title">Chỉnh thiệp dễ hơn trên máy tính</h2><p>Bạn vẫn có thể chỉnh sửa đầy đủ trên điện thoại. Với màn hình lớn, việc nhập nội dung và quan sát toàn bộ thiệp sẽ trực quan hơn.</p><button className="button button-primary" type="button" onClick={() => setMobileAdviceOpen(false)}>Đã hiểu, tiếp tục</button></section></div> : null}
    {pendingNavigation ? <div className="editor-publish-backdrop"><section className="editor-publish-dialog" role="dialog" aria-modal="true" aria-labelledby="unsaved-dialog-title"><FloppyDisk size={28} /><h2 id="unsaved-dialog-title">Bạn có thay đổi chưa lưu</h2><p>Bạn có muốn lưu nội dung thiệp trước khi rời khỏi trang này không?</p><footer className="editor-unsaved-actions"><button className="button button-secondary" type="button" onClick={() => setPendingNavigation(null)}>Ở lại</button><button className="button button-secondary" type="button" onClick={() => { const target = pendingNavigation; allowNavigationRef.current = true; setPendingNavigation(null); navigate(target) }}>Rời đi không lưu</button><button className="button button-primary" type="button" disabled={saving} onClick={() => void (async () => { if (await save()) { const target = pendingNavigation; allowNavigationRef.current = true; setPendingNavigation(null); navigate(target) } })()}>{saving ? 'Đang lưu…' : 'Lưu và rời đi'}</button></footer></section></div> : null}
    {publishOpen ? <div className="editor-publish-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPublishOpen(false) }}><section className="editor-publish-dialog" role="dialog" aria-modal="true" aria-labelledby="publish-dialog-title"><RocketLaunch size={28} /><h2 id="publish-dialog-title">Xuất bản thiệp online</h2><p>Chọn đường dẫn dễ nhớ để gửi thiệp cho khách mời.</p><label className="editor-field"><span>Đường dẫn thiệp</span><div className="editor-slug-input"><span>/</span><input autoFocus value={publishSlug} onChange={(event) => setPublishSlug(event.target.value)} placeholder="mai-va-duc" /></div></label><footer><button className="button button-secondary" type="button" onClick={() => setPublishOpen(false)}>Hủy</button><button className="button button-primary" type="button" disabled={publishing || publishSlug.trim().length < 3} onClick={() => void publish()}>{publishing ? 'Đang xuất bản…' : 'Xuất bản thiệp'}</button></footer></section></div> : null}
  </section>
}

function mapServerFieldErrors(serverErrors?: Record<string, string[]>): FieldErrors {
  const result: FieldErrors = {}
  if (!serverErrors) return result
  for (const [path, messages] of Object.entries(serverErrors)) {
    const key = path.replace(/^content\./, '').split('.')[0]
    if (key && key !== 'themeConfig' && key !== 'sectionConfig') result[key] = messages[0] || 'Nội dung chưa hợp lệ.'
  }
  return result
}

function showFirstInvalidField(errors: FieldErrors, definitions: EditorSectionDefinition[], setErrors: (errors: FieldErrors) => void, openSection: (section: Section) => void, selectSection: (section: Section) => void) {
  setErrors(errors)
  const firstKey = Object.keys(errors)[0]
  const rootKey = firstKey?.split('.')[0]
  const section = definitions.find((item) => rootKey in item.fields)?.sectionKey
  if (!firstKey || !section) return
  openSection(section); selectSection(section)
  window.requestAnimationFrame(() => {
    const field = document.querySelector(`.editor-accordion-content [data-editor-field="${String(firstKey)}"]`) as HTMLElement | null
    field?.focus()
  })
}

const previewViewports = { desktop: { width: 1200, height: 800 }, mobile: { width: 550, height: 950 } } as const
function editorSignature(data: EditorData, palette: string, order: string[], enabled: string[]) { return JSON.stringify({ data, palette, order, enabled }) }
const previewRoute = (key: string | null) => key === 'verdant-promise' ? publicTemplateRoutes.verdantPromisePreview : key === 'chibi-daydream' ? publicTemplateRoutes.chibiDaydreamPreview : publicTemplateRoutes.modernLuxePreview
function friendlyEditorError(cause: unknown, fallback: string) {
  if (cause instanceof WeddingApiError) {
    if (cause.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    if (cause.status === 400) return 'Một số nội dung chưa hợp lệ. Vui lòng kiểm tra lại rồi thử lưu.'
    if (cause.status >= 500) return 'Hệ thống đang bận. Vui lòng thử lại sau ít phút.'
  }
  return fallback
}

function EditorPreviewFrame({ device, templateKey, frameRef, onLoad, ready }: { device: keyof typeof previewViewports; templateKey: string | null; frameRef: RefObject<HTMLIFrameElement>; onLoad: () => void; ready: boolean }) {
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
  const route = previewRoute(templateKey)
  return <div className={`editor-iframe-shell is-${device}`}><div className="editor-browser-bar"><i /><i /><i /><span>{device === 'desktop' ? 'Desktop · 1200 × 800' : 'Mobile · 550 × 950'}</span></div><div ref={viewportRef} className="editor-preview-viewport" style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}>{!ready ? <div className="editor-preview-loading" role="status"><span aria-hidden="true" /><strong>Đang tải bản xem trước…</strong><small>Đang chuẩn bị giao diện thiệp</small></div> : null}<iframe ref={frameRef} style={frameStyle} title={`Bản xem trước thiệp ${templateKey ?? 'đang chọn'}`} src={`${route}?editor=1`} onLoad={onLoad} /></div></div>
}

function EditorSectionCard({ sectionKey, definition, index, order, expanded, shown, select, focus, move, toggle, children }: { sectionKey: Section; definition?: EditorSectionDefinition; index: number; order: Section[]; expanded: boolean; shown: boolean; select: () => void; focus: () => void; move: (step: -1 | 1) => void; toggle: () => void; children: React.ReactNode }) {
  const label = definition?.label ?? labels[sectionKey] ?? sectionKey
  const reorderable = definition?.canReorder !== false
  const canMoveUp = reorderable && index > 0
  const canMoveDown = reorderable && index < order.length - 1
  return <li className={`editor-accordion-card ${expanded ? 'is-expanded' : ''} ${shown ? '' : 'is-disabled'}`}><header><button type="button" className="editor-accordion-trigger" onClick={select} aria-expanded={expanded}><span><strong>{label}</strong><small>{definition?.required ? 'Bắt buộc' : shown ? 'Đang hiển thị' : 'Đang ẩn'}</small></span><CaretDown /></button><div className="editor-section-tools"><button type="button" disabled={!canMoveUp} onClick={() => move(-1)} aria-label={`Đưa ${label} lên`} title={reorderable ? 'Đưa lên' : 'Vị trí được khóa bởi giao diện'}><ArrowUp /></button><button type="button" disabled={!canMoveDown} onClick={() => move(1)} aria-label={`Đưa ${label} xuống`} title={reorderable ? 'Đưa xuống' : 'Vị trí được khóa bởi giao diện'}><ArrowDown /></button><button type="button" role="switch" aria-checked={shown} aria-label={`${shown ? 'Ẩn' : 'Hiện'} ${label}`} disabled={definition?.canToggle === false || definition?.required} className={`editor-switch ${shown ? 'is-on' : ''}`} onClick={toggle}><span /></button></div></header>{expanded ? <div className="editor-accordion-content" onFocusCapture={focus}>{children}</div> : null}</li>
}

function Input({ fieldKey, label, ariaLabel, value, type = 'text', area, error, onChange }: { fieldKey?: string; label: string; ariaLabel?: string; value?: string; type?: string; area?: boolean; error?: string; onChange: (value: string) => void }) {
  const errorId = fieldKey ? `editor-error-${fieldKey}` : undefined
  const common = { 'aria-label': ariaLabel, 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined, 'data-editor-field': fieldKey }
  return <label className={`editor-field ${error ? 'has-error' : ''}`}><span>{label}</span>{area ? <textarea {...common} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} /> : <input {...common} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}{error ? <small id={errorId} className="editor-field-error">{error}</small> : null}</label>
}
function FamilyPersonFields({ person, title, name, updateTitle, updateName }: { person: string; title?: string; name?: string; updateTitle: (value: string) => void; updateName: (value: string) => void }) {
  return <div className="editor-family-person-fields"><strong>{person}</strong><div className="editor-family-person-grid"><Input label="Danh xưng" ariaLabel={`Danh xưng ${person.toLowerCase()}`} value={title} onChange={updateTitle} /><Input label="Họ tên" ariaLabel={`Họ tên ${person.toLowerCase()}`} value={name} onChange={updateName} /></div></div>
}
type FieldsProps = { section: Section; definition?: EditorSectionDefinition; data: EditorData; palette: string; fieldErrors: FieldErrors; update: (key: string, value: EditorValue) => void; setPalette: (p: string) => void; upload: (files: FileList | null) => Promise<void>; uploadMusic: (files: FileList | null) => Promise<void>; uploadActivityImage: (index: number, files: FileList | null) => Promise<void>; imageError: string; musicError: string }
function Fields({ section, definition, data, palette, fieldErrors, update, setPalette, upload, uploadMusic, uploadActivityImage, imageError, musicError }: FieldsProps) {
  if (section === 'cover') return <><div className="editor-palette">{(['champagne', 'midnight', 'sage'] as const).map((p) => <button type="button" key={p} className={palette === p ? 'is-active' : ''} onClick={() => setPalette(p)}><i className={`palette-dot ${p}`} />{p}</button>)}</div><Input fieldKey="eyebrow" label="Dòng mở đầu" value={data.eyebrow} error={fieldErrors.eyebrow} onChange={(v) => update('eyebrow', v)} /><div className="editor-field-grid"><Input fieldKey="brideName" label="Tên cô dâu" value={data.brideName} error={fieldErrors.brideName} onChange={(v) => update('brideName', v)} /><Input fieldKey="groomName" label="Tên chú rể" value={data.groomName} error={fieldErrors.groomName} onChange={(v) => update('groomName', v)} /></div><Input fieldKey="weddingDate" label="Ngày cưới hiển thị" value={data.weddingDate} error={fieldErrors.weddingDate} onChange={(v) => update('weddingDate', v)} /></>
  if (section === 'invitation') return <><Input fieldKey="invitationTitle" label="Tiêu đề lời mời" value={data.invitationTitle} error={fieldErrors.invitationTitle} onChange={(v) => update('invitationTitle', v)} /><Input fieldKey="invitationMessage" label="Nội dung lời mời" area value={data.invitationMessage} error={fieldErrors.invitationMessage} onChange={(v) => update('invitationMessage', v)} /></>
  if (section === 'families') return <><div className="editor-field-divider">Nhà gái</div><FamilyPersonFields person="Cha cô dâu" title={data.brideFatherTitle} name={data.brideFather} updateTitle={(v) => update('brideFatherTitle', v)} updateName={(v) => update('brideFather', v)} /><FamilyPersonFields person="Mẹ cô dâu" title={data.brideMotherTitle} name={data.brideMother} updateTitle={(v) => update('brideMotherTitle', v)} updateName={(v) => update('brideMother', v)} /><div className="editor-field-divider">Nhà trai</div><FamilyPersonFields person="Cha chú rể" title={data.groomFatherTitle} name={data.groomFather} updateTitle={(v) => update('groomFatherTitle', v)} updateName={(v) => update('groomFather', v)} /><FamilyPersonFields person="Mẹ chú rể" title={data.groomMotherTitle} name={data.groomMother} updateTitle={(v) => update('groomMotherTitle', v)} updateName={(v) => update('groomMother', v)} /></>
  if (section === 'eventDetails') return <div className="editor-field-grid"><Input label="Giờ đón khách" type="time" value={data.ceremonyTime} onChange={(v) => update('ceremonyTime', v)} /><Input label="Giờ khai tiệc" type="time" value={data.receptionTime} onChange={(v) => update('receptionTime', v)} /></div>
  if (section === 'timeline') return <TimelineFields items={data.timelineItems ?? []} onChange={(items) => update('timelineItems', items)} />
  if (section === 'venue') return <><Input fieldKey="venueName" label="Tên địa điểm" value={data.venueName} error={fieldErrors.venueName} onChange={(v) => update('venueName', v)} /><Input fieldKey="venueAddress" label="Địa chỉ" area value={data.venueAddress} error={fieldErrors.venueAddress} onChange={(v) => update('venueAddress', v)} /><Input fieldKey="mapUrl" label="Link Google Maps" type="url" value={data.mapUrl} error={fieldErrors.mapUrl} onChange={(v) => update('mapUrl', v)} /></>
  if (section === 'activities') return <ActivityFields items={data.activities ?? []} style={data.activitiesStyle ?? 'activity-cards'} update={update} uploadImage={uploadActivityImage} imageError={imageError} />
  if (section === 'gallery') return <><DisplayStyleField label="Kiểu hiển thị album" value={data.galleryStyle ?? 'deck-3d'} options={modernLuxeDisplayStyles.gallery} onChange={(value) => update('galleryStyle', value)} /><label className="editor-upload"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { void upload(e.target.files); e.target.value = '' }} /><UploadSimple /><strong>Thêm ảnh vào album</strong><span>Tối đa 12 ảnh · 5MB/ảnh</span></label>{imageError ? <p className="editor-upload-error">{imageError}</p> : null}<div className="editor-image-grid">{(data.galleryImages ?? []).map((src, i) => <figure key={`${src.slice(0, 20)}-${i}`}><img src={src} alt={`Ảnh album ${i + 1}`} /><button type="button" onClick={() => update('galleryImages', (data.galleryImages ?? []).filter((_, index) => index !== i))}>×</button></figure>)}</div>{!data.galleryImages?.length ? <div className="editor-field-placeholder"><Image /><strong>Đang dùng ảnh mẫu</strong><p>Tải ảnh lên để thay ngay trong thiệp.</p></div> : null}</>
  if (section === 'rsvp') return <><Input fieldKey="rsvpDeadline" label="Hạn phản hồi" value={data.rsvpDeadline} error={fieldErrors.rsvpDeadline} onChange={(v) => update('rsvpDeadline', v)} /><Input fieldKey="rsvpMessage" label="Lời nhắn RSVP" area value={data.rsvpMessage} error={fieldErrors.rsvpMessage} onChange={(v) => update('rsvpMessage', v)} /></>
  if (section === 'gift') return <Input fieldKey="giftMessage" label="Lời nhắn mừng cưới" area value={data.giftMessage} error={fieldErrors.giftMessage} onChange={(v) => update('giftMessage', v)} />
  if (section === 'music') return <><label className="editor-upload editor-audio-upload"><input type="file" accept="audio/*" onChange={(event) => { void uploadMusic(event.target.files); event.target.value = '' }} /><MusicNote /><strong>{data.backgroundMusicUrl ? 'Thay nhạc nền' : 'Tải nhạc nền lên'}</strong><span>File âm thanh · tối đa 15MB</span></label>{musicError ? <p className="editor-upload-error">{musicError}</p> : null}<label className="editor-setting-row"><span><strong>Tự động phát</strong><small>Phát nhạc khi khách mở thiệp</small></span><button type="button" role="switch" aria-checked={data.backgroundMusicAutoplay !== false} className={`editor-switch ${data.backgroundMusicAutoplay !== false ? 'is-on' : ''}`} onClick={() => update('backgroundMusicAutoplay', data.backgroundMusicAutoplay === false)}><span /></button></label>{data.backgroundMusicUrl ? <div className="editor-audio-selected"><MusicNote /><span><strong>{data.backgroundMusicName || 'Nhạc nền'}</strong><small>Nhấn nút loa trong preview để nghe thử</small></span><button type="button" onClick={() => setDataMusicEmpty(update)} aria-label="Xóa nhạc nền"><Trash /></button></div> : <div className="editor-field-placeholder"><MusicNote /><strong>Chưa có nhạc nền</strong><p>Tải file lên để nghe thử trực tiếp trong preview.</p></div>}</>
  if (definition && Object.keys(definition.fields).length) return <SchemaFields definition={definition} data={data} errors={fieldErrors} update={update} />
  return <div className="editor-field-placeholder"><strong>Section tự động</strong><p>Section này dùng thông tin chung đã nhập. Bạn có thể đổi vị trí hoặc bật/tắt trong danh sách.</p></div>
}

function SchemaFields({ definition, data, errors, update }: { definition: EditorSectionDefinition; data: EditorData; errors: FieldErrors; update: FieldsProps['update'] }) {
  return <div className="editor-schema-fields">{Object.entries(definition.fields).map(([key, field]) => {
    if (['image', 'images', 'audio'].includes(field.type)) return null
    if (field.type === 'boolean') return <label className="editor-setting-row" key={key}><span><strong>{field.label ?? key}</strong></span><button type="button" role="switch" aria-checked={Boolean(data[key])} className={`editor-switch ${data[key] ? 'is-on' : ''}`} onClick={() => update(key, !data[key])}><span /></button></label>
    if (field.type === 'select') return <DisplayStyleField key={key} label={field.label ?? key} value={String(data[key] ?? field.default ?? '')} options={field.options ?? []} onChange={(value) => update(key, value)} />
    if (field.type === 'items') return <SchemaItems key={key} fieldKey={key} label={field.label ?? key} value={Array.isArray(data[key]) ? data[key] as Record<string, unknown>[] : []} maxItems={field.maxItems ?? 10} itemFields={field.itemFields ?? {}} errors={errors} onChange={(value) => update(key, value)} />
    return <Input key={key} fieldKey={key} label={field.label ?? key} type={field.type === 'url' ? 'url' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'} area={field.type === 'text'} value={typeof data[key] === 'string' ? data[key] as string : ''} error={errors[key]} onChange={(value) => update(key, value)} />
  })}</div>
}

function SchemaItems({ fieldKey, label, value, maxItems, itemFields, errors, onChange }: { fieldKey: string; label: string; value: Record<string, unknown>[]; maxItems: number; itemFields: Record<string, import('../../../shared/api/weddings').TemplateFieldConfig>; errors: FieldErrors; onChange: (value: Record<string, unknown>[]) => void }) {
  const change = (index: number, key: string, nextValue: string) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: nextValue } : item))
  return <div className="editor-timeline-fields"><strong>{label}</strong>{value.map((item, index) => <article key={index}><header><strong>Mục {index + 1}</strong><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Xóa mục ${index + 1}`}><Trash /></button></header>{Object.entries(itemFields).map(([key, field]) => <Input key={key} fieldKey={`${fieldKey}.${index}.${key}`} label={field.label ?? key} type={field.type === 'time' ? 'time' : field.type === 'url' ? 'url' : 'text'} area={field.type === 'text'} value={typeof item[key] === 'string' ? item[key] as string : ''} error={errors[`${fieldKey}.${index}.${key}`]} onChange={(nextValue) => change(index, key, nextValue)} />)}</article>)}<button className="editor-add-item" type="button" disabled={value.length >= maxItems} onClick={() => onChange([...value, Object.fromEntries(Object.keys(itemFields).map((key) => [key, '']))])}><Plus /> Thêm mục</button></div>
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
