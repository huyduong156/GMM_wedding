import { NativeDateField } from '../../../shared/ui/form-controls/NativeDateField'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import {
  ArrowClockwise,
  ArrowDown,
  ArrowLeft,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowUp,
  ArrowsOut,
  CaretDown,
  CheckCircle,
  Desktop,
  DeviceMobile,
  Eye,
  FloppyDisk,
  Image,
  MusicNote,
  Plus,
  RocketLaunch,
  ShareNetwork,
  Trash,
  X,
} from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { notifications } from '../../../shared/ui/notifications/notifications'
import { SharePublicationModal } from '../../../shared/ui/SharePublicationModal'
import { MobileEditorAdviceModal } from '../../../shared/ui/MobileEditorAdviceModal'
import { studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { EditorPreviewModal, type EditorPreviewDevice } from '../../../shared/ui/EditorPreviewModal'
import { TemplateSchemaFields } from '../../../shared/ui/template-editor/TemplateSchemaFields'
import { useEditorPreviewScrollLock } from '../../../shared/ui/useEditorPreviewScrollLock'
import { useDraggablePreviewPosition } from '../../../shared/ui/useDraggablePreviewPosition'
import { useMediaLibrary } from '../../../features/media/model/useMediaLibrary'
import { MediaManagerModal } from '../../../features/media/ui/MediaManagerModal'
import type { MediaAsset } from '../../../shared/api/weddings'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { useEditorSections, useLiveEditorBridge } from '../../../shared/lib/live-template-editor'
import type { ModernLuxeData } from '../../../templates/invitations/modern-luxe/ModernLuxeInvitation'
import { getInvitationTemplate } from '../../../templates/template-registry'
import {
  resolveEditorSections,
  validateSchemaContent,
  type EditorSectionDefinition,
} from './invitation-editor-schema'

type Section = string
type EditorData = ModernLuxeData & Record<string, unknown>
type EditorValue = unknown
type FieldErrors = Record<string, string>
type QuickEditField = { contentKey: string; label: string }
const readQuickEdit = (config: Record<string, unknown> | null | undefined): QuickEditField[] =>
  Array.isArray(config?.quickEdit)
    ? config.quickEdit.filter((item): item is QuickEditField =>
        Boolean(
          item &&
          typeof item === 'object' &&
          typeof (item as QuickEditField).contentKey === 'string' &&
          typeof (item as QuickEditField).label === 'string',
        ),
      )
    : []
const hydrateTemplateConfig = (templateKey: string, config: Record<string, unknown>) => {
  const fallback = getInvitationTemplate(templateKey)?.config as Record<string, unknown> | undefined
  if (!fallback) return config
  const fallbackSections = Array.isArray(fallback.sections) ? fallback.sections : []
  const configSections = Array.isArray(config.sections) ? config.sections : []
  if (!configSections.length) return { ...fallback, ...config, sections: fallback.sections }
  const sections = fallbackSections.map((fallbackSection) => {
    if (!fallbackSection || typeof fallbackSection !== 'object') return fallbackSection
    const fallbackRecord = fallbackSection as Record<string, any>
    const configSection = configSections.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        (item as Record<string, unknown>).sectionKey === fallbackRecord.sectionKey,
    ) as Record<string, any> | undefined
    if (!configSection) return fallbackSection
    const fallbackFields = fallbackRecord.fields ?? {}
    const configFields = configSection.fields ?? {}
    const fields = Object.fromEntries(
      Object.entries(fallbackFields).map(([key, field]) => [
        key,
        { ...((field ?? {}) as Record<string, unknown>), ...(configFields[key] ?? {}) },
      ]),
    )
    return { ...fallbackRecord, ...configSection, fields: { ...fields, ...configFields } }
  })
  return {
    ...fallback,
    ...config,
    previewPath: fallback.previewPath,
    sections: sections.length ? sections : configSections,
  }
}
function mergeSectionOrder(canonicalKeys: string[], storedKeys: string[]) {
  const next = [...new Set(storedKeys.filter((key) => canonicalKeys.includes(key)))]
  canonicalKeys.forEach((key, canonicalIndex) => {
    if (next.includes(key)) return
    let insertAt = 0
    for (let index = canonicalIndex - 1; index >= 0; index -= 1) {
      const previousIndex = next.indexOf(canonicalKeys[index])
      if (previousIndex >= 0) {
        insertAt = previousIndex + 1
        break
      }
    }
    next.splice(insertAt, 0, key)
  })
  return next
}
const initialTemplate = getInvitationTemplate('modern-luxe')!
const initialData: ModernLuxeData = {
  ...initialTemplate.fixture,
  ...(initialTemplate.config.defaultData as Partial<ModernLuxeData> | undefined),
}

export function InvitationEditorLivePage() {
  const { navigate } = useNavigation()
  const workspace = useOptionalWeddingWorkspace()
  const workspaceWedding = workspace?.activeWedding ?? null
  const activeWeddingId = workspaceWedding?.id ?? null
  const siteOrigin = typeof window === 'undefined' ? '' : window.location.origin
  const invitationUrl = workspaceWedding?.slug
    ? `${siteOrigin}/${encodeURIComponent(workspaceWedding.slug)}/invitation`
    : ''
  const [device, setDevice] = useState<'desktop' | 'mobile'>('mobile')
  const [isMobileEditor, setIsMobileEditor] = useState(
    () => window.matchMedia?.('(max-width: 767px)').matches ?? false,
  )
  const [sectionDefinitions, setSectionDefinitions] = useState<EditorSectionDefinition[]>(() =>
    resolveEditorSections(initialTemplate.config, []),
  )
  const [quickEditFields, setQuickEditFields] = useState<QuickEditField[]>(() =>
    readQuickEdit(initialTemplate.config),
  )
  const sectionDefinitionsRef = useRef(sectionDefinitions)
  sectionDefinitionsRef.current = sectionDefinitions
  const requiredSections = sectionDefinitions
    .filter((section) => section.required)
    .map((section) => section.sectionKey)
  const { setSelected, order, enabled, move, toggle, reset } = useEditorSections(
    sectionDefinitions.map((section) => section.sectionKey),
    requiredSections,
    (key) =>
      sectionDefinitionsRef.current.find((section) => section.sectionKey === key)?.canReorder !==
      false,
  )
  const [data, setData] = useState<EditorData>(initialData),
    [palette, setPalette] = useState('champagne')
  const [paletteOptions, setPaletteOptions] = useState<Array<{ key: string; label: string }>>(() =>
    (initialTemplate.config.palettes ?? []).map((item) => ({ key: item.key, label: item.label })),
  )
  const [mediaManagerOpen, setMediaManagerOpen] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<{
    kind: 'field'
    path: string
    multiple: boolean
    role: string
    mediaValue?: 'url' | 'object'
  } | null>(null)
  const {
    assets: mediaAssets,
    loading: mediaLoading,
    uploading: mediaUploading,
    error: mediaError,
    setError: setMediaError,
    upload: uploadMedia,
  } = useMediaLibrary({ weddingId: activeWeddingId })
  const [musicError, setMusicError] = useState('')
  const [expandedSection, setExpandedSection] = useState<Section | null>('cover')
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  useEditorPreviewScrollLock(mobilePreviewOpen)
  const draggablePreview = useDraggablePreviewPosition()
  const [mobileAdviceOpen, setMobileAdviceOpen] = useState(isMobileEditor)
  const [contentRevision, setContentRevision] = useState<number | null>(null)
  const [templateVersionId, setTemplateVersionId] = useState<string | null>(null)
  const [templateMissing, setTemplateMissing] = useState(false)
  const [templateKey, setTemplateKey] = useState<string | null>(null)
  const [previewPath, setPreviewPath] = useState<string>(initialTemplate.config.previewPath)
  const [loading, setLoading] = useState(Boolean(workspaceWedding))
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const [conflicted, setConflicted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const historyRef = useRef<
    Array<{ data: EditorData; palette: string; order: string[]; enabled: string[] }>
  >([])
  const futureRef = useRef<
    Array<{ data: EditorData; palette: string; order: string[]; enabled: string[] }>
  >([])
  const [historyVersion, setHistoryVersion] = useState(0)
  const [publishOpen, setPublishOpen] = useState(false)
  const [unpublishOpen, setUnpublishOpen] = useState(false)
  const [publishSlug, setPublishSlug] = useState('')
  const [pendingEditorAction, setPendingEditorAction] = useState<'invitation' | 'publish' | null>(
    null,
  )
  const [publishing, setPublishing] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [surfacePublished, setSurfacePublished] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const baselineRef = useRef('')
  const allowNavigationRef = useRef(false)
  const activeWedding = workspaceWedding
    ? {
        ...workspaceWedding,
        status: surfacePublished ? ('PUBLISHED' as const) : ('DRAFT' as const),
      }
    : null
  const previewDevice = device
  useEffect(() => {
    if (!mobilePreviewOpen) setDevice('mobile')
  }, [mobilePreviewOpen])
  useEffect(() => {
    const receiveDeviceChange = (event: Event) => {
      const next = (event as CustomEvent<'desktop' | 'mobile'>).detail
      if (next === 'desktop' || next === 'mobile') setDevice(next)
    }
    window.addEventListener('gmm-editor-preview-device-change', receiveDeviceChange)
    return () => window.removeEventListener('gmm-editor-preview-device-change', receiveDeviceChange)
  }, [])
  const loadContent = useCallback(async () => {
    if (!activeWeddingId) return
    setLoading(true)
    setApiError('')
    setSaveMessage('')
    setConflicted(false)
    setFieldErrors({})
    setTemplateMissing(false)
    try {
      const loaded = (await weddingApi.content(activeWeddingId, 'ONLINE_INVITATION')).content
      if (!loaded.templateVersion) {
        setTemplateMissing(true)
        setLoading(false)
        return
      }
      const stored = loaded.content as EditorData
      // A newly selected template can already have a WeddingContent row, while
      // its content payload is still empty. Ignore a stale row order in that state.
      const hasSavedContent = Object.keys(stored).length > 0
      const storedPalette =
        typeof loaded.themeConfig.palette === 'string' ? loaded.themeConfig.palette : undefined
      const templateConfig = hydrateTemplateConfig(
        loaded.templateVersion.key,
        loaded.templateVersion.config,
      )
      const definitions = resolveEditorSections(
        templateConfig,
        hasSavedContent ? loaded.sectionConfig.order : [],
      )
      const validKeys = definitions.map((section) => section.sectionKey)
      const storedOrder = hasSavedContent
        ? loaded.sectionConfig.order.filter((key) => validKeys.includes(key))
        : []
      const storedEnabled = new Set(
        loaded.sectionConfig.enabled.filter((key) => validKeys.includes(key)),
      )
      const nextOrder = mergeSectionOrder(validKeys, storedOrder)
      const nextEnabled = validKeys.filter(
        (key) =>
          storedEnabled.has(key) ||
          !storedOrder.includes(key) ||
          definitions.find((section) => section.sectionKey === key)?.required,
      )
      setSectionDefinitions(definitions)
      if (Array.isArray(templateConfig.quickEdit)) setQuickEditFields(readQuickEdit(templateConfig))
      const templateDefaults = (templateConfig.defaultData ?? {}) as Partial<EditorData>
      const nextData = { ...initialData, ...templateDefaults, ...stored }
      setData(nextData)
      const configuredPalettes = ((templateConfig.palettes ?? []) as Array<{ key: string }>).map(
        (item) => item.key,
      )
      setPaletteOptions(
        configuredPalettes.length
          ? configuredPalettes.map((key) => ({ key, label: key }))
          : (initialTemplate.config.palettes ?? []).map((item) => ({
              key: item.key,
              label: item.label,
            })),
      )
      const loadedPalette = storedPalette ?? configuredPalettes[0] ?? 'champagne'
      const loadedOrder = nextOrder.length ? nextOrder : validKeys
      const loadedEnabled = nextEnabled.length ? nextEnabled : validKeys
      setPalette(loadedPalette)
      reset(loadedOrder, loadedEnabled)
      baselineRef.current = editorSignature(
        nextData,
        loadedPalette,
        loadedOrder,
        loadedEnabled,
      )
      setContentRevision(loaded.revision)
      setTemplateVersionId(loaded.templateVersion.id)
      setTemplateKey(loaded.templateVersion.key)
      if (typeof templateConfig.previewPath === 'string') setPreviewPath(templateConfig.previewPath)
      setDirty(false)
    } catch (cause) {
      setApiError(friendlyEditorError(cause, 'Không thể tải nội dung thiệp. Vui lòng thử lại.'))
    } finally {
      setLoading(false)
    }
  }, [activeWeddingId, reset])
  useEffect(() => {
    void loadContent()
  }, [loadContent])
  useEffect(() => {
    if (!activeWeddingId) return
    void weddingApi
      .dashboard(activeWeddingId)
      .then((result) => setSurfacePublished(result.dashboard.publication.invitation.published))
      .catch(() => setSurfacePublished(false))
  }, [activeWeddingId, workspaceWedding?.revision])
  useEffect(() => {
    if (!saveMessage || conflicted) return
    const timeout = window.setTimeout(() => setSaveMessage(''), 1800)
    return () => window.clearTimeout(timeout)
  }, [conflicted, saveMessage])
  useEffect(() => {
    const query = window.matchMedia?.('(max-width: 767px)')
    if (!query) return
    const updateViewport = (event: MediaQueryListEvent) => {
      setIsMobileEditor(event.matches)
      if (event.matches) setDevice('mobile')
    }
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])
  const { frameRef, ready, sendState, scrollToSection } = useLiveEditorBridge<
    { data: EditorData; palette: string; sectionConfig: { enabled: string[]; order: string[] } },
    Section
  >({ data, palette, sectionConfig: { enabled, order } })
  const snapshot = () => ({
    data: structuredClone(data),
    palette,
    order: [...order],
    enabled: [...enabled],
  })
  const recordHistory = () => {
    historyRef.current.push(snapshot())
    if (historyRef.current.length > 50) historyRef.current.shift()
    futureRef.current = []
    setHistoryVersion((value) => value + 1)
  }
  const restoreSnapshot = (value: ReturnType<typeof snapshot>) => {
    setData(value.data)
    setPalette(value.palette)
    reset(value.order, value.enabled)
    setDirty(true)
    setSaveMessage('')
    setHistoryVersion((version) => version + 1)
  }
  const undo = () => {
    const previous = historyRef.current.pop()
    if (!previous) return
    futureRef.current.push(snapshot())
    restoreSnapshot(previous)
  }
  const redo = () => {
    const next = futureRef.current.pop()
    if (!next) return
    historyRef.current.push(snapshot())
    restoreSnapshot(next)
  }
  const update = (key: string, value: EditorValue) => {
    recordHistory()
    setData((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setDirty(true)
    setSaveMessage('')
  }
  const updatePath = (path: string, value: EditorValue) => {
    recordHistory()
    setData((current) => setNestedValue(current, path, value))
    setDirty(true)
    setSaveMessage('')
  }
  const choosePalette = (value: string) => {
    recordHistory()
    setPalette(value)
    setDirty(true)
    setSaveMessage('')
  }
  const uploadMusic = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith('audio/') || file.size > 15 * 1024 * 1024) {
      setMusicError('Chỉ nhận file âm thanh tối đa 15MB.')
      return
    }
    const url = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.readAsDataURL(file)
    })
    setMusicError('')
    setData((current) => ({ ...current, backgroundMusicUrl: url, backgroundMusicName: file.name }))
    setDirty(true)
  }
  const focusPreviewSection = (key: Section) => {
    if (key !== 'music') scrollToSection(key)
  }
  const selectSection = (key: Section) => {
    setSelected(key)
    setExpandedSection((current) => (current === key ? null : key))
    focusPreviewSection(key)
  }
  const openMediaManager = (target: NonNullable<typeof mediaTarget>) => {
    setMediaError('')
    setMediaTarget(target)
    setMediaManagerOpen(true)
  }
  const confirmMedia = (selected: MediaAsset[]) => {
    if (!mediaTarget || !selected.length) {
      setMediaManagerOpen(false)
      return
    }
    const values = selected.map((asset) => ({
      src: asset.publicUrl,
      alt: asset.originalName ?? 'Ảnh đã tải lên',
      role: mediaTarget.role,
      mediaAssetId: asset.id,
    }))
    updatePath(
      mediaTarget.path,
      mediaTarget.multiple
        ? values
        : mediaTarget.mediaValue === 'url'
          ? (values[0]?.src ?? '')
          : (values[0] ?? { src: '', alt: '', role: mediaTarget.role }),
    )
    setMediaManagerOpen(false)
  }
  const save = async (): Promise<boolean> => {
    if (!activeWedding || !templateVersionId || contentRevision === null) return false
    const validationErrors = validateSchemaContent(
      data as Record<string, unknown>,
      sectionDefinitions,
      enabled,
    )
    if (Object.keys(validationErrors).length) {
      showFirstInvalidField(
        validationErrors,
        sectionDefinitions,
        setFieldErrors,
        setExpandedSection,
        setSelected,
      )
      setApiError('Vui lòng kiểm tra các nội dung được đánh dấu.')
      setSaveMessage('')
      return false
    }
    setSaving(true)
    setApiError('')
    setSaveMessage('')
    try {
      const persistedData = { ...data }
      const localMusicOnly = persistedData.backgroundMusicUrl?.startsWith('data:')
      if (localMusicOnly) {
        delete persistedData.backgroundMusicUrl
        delete persistedData.backgroundMusicName
      }
      const sectionConfig = { enabled, order }
      const saved = await weddingApi.saveContent(activeWedding.id, {
        surface: 'ONLINE_INVITATION',
        templateVersionId,
        content: persistedData,
        themeConfig: { palette },
        sectionConfig,
        revision: contentRevision,
      })
      setContentRevision(saved.content.revision)
      baselineRef.current = editorSignature(data, palette, order, enabled)
      setDirty(false)
      if (surfacePublished) setSurfacePublished(false)
      setSaveMessage(
        localMusicOnly
          ? 'Đã lưu nội dung thiệp. Nhạc demo chỉ được giữ trong phiên chỉnh sửa này.'
          : 'Đã lưu thay đổi.',
      )
      return true
    } catch (cause) {
      if (cause instanceof WeddingApiError && cause.status === 409) {
        setConflicted(true)
        setSaveMessage('Nội dung đã thay đổi ở nơi khác. Tải lại bản mới để tiếp tục.')
      } else if (cause instanceof WeddingApiError && cause.status === 400) {
        const errors = mapServerFieldErrors(cause.fieldErrors)
        if (Object.keys(errors).length)
          showFirstInvalidField(
            errors,
            sectionDefinitions,
            setFieldErrors,
            setExpandedSection,
            setSelected,
          )
        setApiError(
          Object.keys(errors).length
            ? 'Vui lòng kiểm tra các nội dung được đánh dấu.'
            : 'Một số nội dung chưa hợp lệ. Vui lòng kiểm tra lại rồi thử lưu.',
        )
      } else
        setApiError(friendlyEditorError(cause, 'Có lỗi xảy ra khi lưu thiệp. Vui lòng thử lại.'))
      return false
    } finally {
      setSaving(false)
    }
  }
  const openFullPreview = () => {
    if (!templateKey) return
    sessionStorage.setItem(
      `gmm-invitation-preview:${templateKey}`,
      JSON.stringify({ data, palette, sectionConfig: { enabled, order } }),
    )
    window.open(previewPath, '_blank', 'noopener,noreferrer')
  }
  const openMyInvitation = () => {
    if (!activeWedding?.slug) {
      setApiError('Wedding chưa có slug để mở thiệp.')
      return
    }
    window.open(
      '/' + encodeURIComponent(activeWedding.slug) + '/invitation',
      '_blank',
      'noopener,noreferrer',
    )
  }
  const requestEditorAction = (action: 'invitation' | 'publish') => {
    if (hasUnsavedChanges()) {
      setPendingEditorAction(action)
      return
    }
    if (action === 'invitation') openMyInvitation()
    else setPublishOpen(true)
  }
  const saveAndContinueEditorAction = async () => {
    if (!pendingEditorAction || !(await save())) return
    const action = pendingEditorAction
    setPendingEditorAction(null)
    if (action === 'invitation') openMyInvitation()
    else setPublishOpen(true)
  }
  const publish = async () => {
    if (!activeWedding || dirty || !activeWedding.slug) return
    setPublishing(true)
    setApiError('')
    try {
      const slug = activeWedding.slug
      const availability = await weddingApi.slugAvailable(slug, activeWedding.id)
      if (!availability.available) {
        setApiError('Đường dẫn này đã được sử dụng. Vui lòng chọn đường dẫn khác.')
        return
      }
      if (contentRevision === null) return
      await weddingApi.publish(activeWedding.id, {
        surface: 'ONLINE_INVITATION',
        revision: contentRevision,
      })
      setPublishOpen(false)
      setPublishSlug(slug)
      setSurfacePublished(true)
      setSaveMessage('Thiệp đã được xuất bản thành công.')
      await notifications.success('Đã công khai thiệp')
      await workspace?.refresh()
    } catch (cause) {
      setApiError(friendlyEditorError(cause, 'Không thể xuất bản thiệp. Vui lòng thử lại.'))
    } finally {
      setPublishing(false)
    }
  }
  const unpublish = async () => {
    if (!activeWedding || publishing) return
    setPublishing(true)
    setApiError('')
    try {
      await weddingApi.unpublish(activeWedding.id, {
        surface: 'ONLINE_INVITATION',
        revision: contentRevision ?? undefined,
      })
      setSurfacePublished(false)
      setSaveMessage('Đã gỡ xuất bản thiệp. Nội dung chỉnh sửa vẫn được giữ nguyên.')
      await notifications.success('Đã tạm đóng thiệp')
      await loadContent()
      await workspace?.refresh()
    } catch (cause) {
      setApiError(friendlyEditorError(cause, 'Không thể gỡ xuất bản thiệp. Vui lòng thử lại.'))
    } finally {
      setPublishing(false)
    }
  }
  const hasUnsavedChanges = useCallback(
    () => dirty && editorSignature(data, palette, order, enabled) !== baselineRef.current,
    [data, dirty, enabled, order, palette],
  )
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsavedChanges])
  useEffect(() => {
    const interceptLink = (event: MouseEvent) => {
      if (
        allowNavigationRef.current ||
        !hasUnsavedChanges() ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const anchor = (event.target as Element | null)?.closest(
        'a[href]',
      ) as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank') return
      const target = new URL(anchor.href, window.location.href)
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname)
        return
      event.preventDefault()
      event.stopPropagation()
      setPendingNavigation(`${target.pathname}${target.search}${target.hash}`)
    }
    document.addEventListener('click', interceptLink, true)
    return () => document.removeEventListener('click', interceptLink, true)
  }, [hasUnsavedChanges])
  if (templateMissing && !loading)
    return (
      <section
        className="invitation-editor-empty"
        aria-labelledby="invitation-editor-empty-heading"
      >
        <div className="invitation-editor-empty-card">
          <CheckCircle size={48} weight="duotone" aria-hidden="true" />
          <h1 id="invitation-editor-empty-heading">Bạn chưa chọn giao diện thiệp</h1>
          <p>Hãy chọn một template trong kho giao diện trước khi bắt đầu chỉnh sửa thiệp.</p>
          <AppLink className="button button-primary" to={studioRoutes.inviteThemes}>
            Đi đến kho giao diện
          </AppLink>
        </div>
      </section>
    )
  return (
    <section className="invitation-editor" aria-labelledby="invitation-editor-heading">
      <header className="editor-toolbar">
        <div className="editor-toolbar-title">
          <AppLink to={studioRoutes.inviteThemes} ariaLabel="Quay lại kho giao diện">
            <ArrowLeft />
          </AppLink>
          <div>
            <p>Thiệp online · {templateKey ?? 'Đang tải giao diện'}</p>
            <h1 id="invitation-editor-heading">Chỉnh sửa thiệp</h1>
          </div>
        </div>
        <div className="editor-couple-quick-edit">
          {quickEditFields.map((field) => (
            <Input
              key={field.contentKey}
              fieldKey={field.contentKey}
              label={field.label}
              value={
                typeof getNestedValue(data, field.contentKey) === 'string'
                  ? (getNestedValue(data, field.contentKey) as string)
                  : ''
              }
              error={fieldErrors[field.contentKey]}
              onChange={(value) => update(field.contentKey, value)}
            />
          ))}
        </div>
        <div className="editor-toolbar-actions">
          <div className="editor-toolbar-main-actions">
            <span className={`editor-live-status ${ready ? 'is-ready' : ''}`}>
              {loading
                ? 'Đang tải nội dung…'
                : saving
                  ? 'Đang lưu…'
                  : dirty
                    ? 'Có thay đổi chưa lưu'
                    : saveMessage ||
                      (templateVersionId
                        ? 'Nội dung đã sẵn sàng'
                        : ready
                          ? 'Bản xem trước đã sẵn sàng'
                          : 'Đang chuẩn bị…')}
            </span>
            <div className="editor-history-actions" data-history-version={historyVersion}>
              <button
                type="button"
                disabled={!historyRef.current.length}
                onClick={undo}
                aria-label="Hoàn tác"
              >
                <ArrowUUpLeft />
              </button>
              <button
                type="button"
                disabled={!futureRef.current.length}
                onClick={redo}
                aria-label="Làm lại"
              >
                <ArrowUUpRight />
              </button>
            </div>
            {activeWedding ? (
              <button
                className="button button-secondary"
                type="button"
                disabled={loading || saving}
                onClick={() => void loadContent()}
              >
                <ArrowClockwise /> Tải lại
              </button>
            ) : null}
            <div className="editor-device-toggle" aria-hidden={isMobileEditor}>
              <button
                type="button"
                aria-label="Xem dạng máy tính"
                aria-pressed={previewDevice === 'desktop'}
                className={previewDevice === 'desktop' ? 'is-active' : ''}
                onClick={() => setDevice('desktop')}
              >
                <Desktop />
              </button>
              <button
                type="button"
                aria-label="Xem dạng điện thoại"
                aria-pressed={previewDevice === 'mobile'}
                className={previewDevice === 'mobile' ? 'is-active' : ''}
                onClick={() => setDevice('mobile')}
              >
                <DeviceMobile />
              </button>
            </div>
          </div>
          <div className="editor-toolbar-public-actions">
            <button className="button button-secondary" type="button" onClick={openFullPreview}>
              <Eye /> Xem thiệp mẫu
            </button>
            <button
              className="button button-secondary"
              type="button"
              disabled={!activeWedding || !templateVersionId || loading || saving}
              onClick={() => requestEditorAction('invitation')}
            >
              <Eye /> Xem thiệp của tôi
            </button>
            <button
              className="button button-secondary"
              type="button"
              disabled={!activeWedding || !templateVersionId || loading || saving || publishing}
              onClick={() =>
                activeWedding?.status === 'PUBLISHED'
                  ? setUnpublishOpen(true)
                  : requestEditorAction('publish')
              }
            >
              {activeWedding?.status === 'PUBLISHED' ? (
                <>
                  <RocketLaunch /> Tạm đóng thiệp
                </>
              ) : (
                <>
                  <RocketLaunch /> Công khai
                </>
              )}
            </button>
            <button
              className="button button-secondary"
              type="button"
              disabled={!activeWedding?.slug || publishing}
              onClick={() => setShareOpen(true)}
            >
              <ShareNetwork /> Chia sẻ
            </button>
            <button
              className="button button-primary"
              type="button"
              disabled={!activeWedding || !templateVersionId || loading || saving}
              onClick={() => void save()}
            >
              <FloppyDisk /> {saving ? 'Đang lưu' : 'Lưu thiệp'}
            </button>
          </div>
        </div>
      </header>
      {apiError ? (
        <div className="editor-api-feedback is-error" role="alert">
          <span>{apiError}</span>
          {Object.keys(fieldErrors).length ? (
            <button type="button" onClick={() => setApiError('')}>
              Đóng
            </button>
          ) : (
            <button type="button" onClick={() => void loadContent()}>
              Thử lại
            </button>
          )}
        </div>
      ) : saveMessage ? (
        <div
          className={`editor-api-feedback ${conflicted ? 'is-error' : 'is-success'}`}
          role={conflicted ? 'alert' : 'status'}
        >
          {!conflicted ? (
            <CheckCircle className="editor-success-check" size={42} weight="fill" />
          ) : null}
          <span>{saveMessage}</span>
          {conflicted ? (
            <button type="button" onClick={() => void loadContent()}>
              Tải lại bản mới
            </button>
          ) : null}
        </div>
      ) : null}
      {shareOpen && invitationUrl ? (
        <SharePublicationModal
          url={invitationUrl}
          surface="Thiệp online"
          onClose={() => setShareOpen(false)}
        />
      ) : null}

      <div className="editor-workspace editor-workspace-two-column">
        <aside
          className="editor-sections editor-section-accordion"
          aria-label="Cấu trúc và nội dung thiệp"
          aria-busy={loading}
        >
          <header>
            <div>
              <strong>Cấu trúc thiệp</strong>
              <small>
                {loading ? 'Đang tải nội dung đã lưu…' : 'Mở từng phần để chỉnh sửa nội dung'}
              </small>
            </div>
            {activeWedding?.status === 'PUBLISHED' ? (
              <div className="editor-structure-publication-status">
                <span>Thiệp đang được công khai</span>
                {invitationUrl ? (
                  <a href={invitationUrl} target="_blank" rel="noreferrer">
                    {invitationUrl}
                  </a>
                ) : null}
              </div>
            ) : null}
          </header>
          <ol>
            {order.map((key, index) => (
              <EditorSectionCard
                key={key}
                sectionKey={key}
                definition={sectionDefinitions.find((section) => section.sectionKey === key)}
                index={index}
                order={order}
                expanded={expandedSection === key}
                shown={enabled.includes(key)}
                select={() => selectSection(key)}
                focus={() => {
                  setSelected(key)
                  focusPreviewSection(key)
                }}
                move={(step) => {
                  move(key, step)
                  setDirty(true)
                  focusPreviewSection(key)
                }}
                toggle={() => {
                  toggle(key)
                  setDirty(true)
                }}
              >
                <Fields
                  section={key}
                  definition={sectionDefinitions.find((section) => section.sectionKey === key)}
                  data={data}
                  palette={palette}
                  fieldErrors={fieldErrors}
                  update={update}
                  setPalette={choosePalette}
                  paletteOptions={paletteOptions}
                  showPalette={index === 0}
                  uploadMusic={uploadMusic}
                  openMediaManager={openMediaManager}
                  useMediaManager={Boolean(activeWedding)}
                  musicError={musicError}
                />
              </EditorSectionCard>
            ))}
          </ol>
        </aside>
        <main
          className={`editor-canvas editor-iframe-canvas ${mobilePreviewOpen ? 'is-mobile-preview-open' : ''}`}
          aria-label="Bản xem trước thiệp"
          style={mobilePreviewOpen ? undefined : draggablePreview.style}
          {...draggablePreview.dragHandlers}
        >
          <button
            className="editor-mobile-preview-toggle"
            type="button"
            onClick={() => setMobilePreviewOpen((current) => !current)}
            aria-expanded={mobilePreviewOpen}
          >
            <span className="editor-preview-drag-handle" data-preview-drag-handle>
              {mobilePreviewOpen ? <X /> : <ArrowsOut />}
            </span>
            <span>{mobilePreviewOpen ? 'Thu nhỏ' : 'Xem thiệp'}</span>
          </button>
          <EditorPreviewFrame
            device={previewDevice}
            templateKey={templateKey}
            route={previewPath}
            frameRef={frameRef}
            onLoad={sendState}
            ready={ready}
          />
          <button
            className="editor-mobile-preview-hitbox"
            type="button"
            onClick={() => setMobilePreviewOpen(true)}
            aria-label="Mở rộng bản xem trước thiệp"
          />
        </main>
      </div>
      <MobileEditorAdviceModal open={mobileAdviceOpen} onClose={() => setMobileAdviceOpen(false)} />
      {pendingEditorAction ? (
        <div className="editor-publish-backdrop">
          <section
            className="editor-publish-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsaved-action-title"
          >
            <FloppyDisk size={28} />
            <h2 id="unsaved-action-title">Bạn có thay đổi chưa lưu</h2>
            <p>
              {pendingEditorAction === 'publish'
                ? 'Hãy lưu nội dung trước khi công khai thiệp.'
                : 'Hãy lưu nội dung trước khi xem thiệp thực tế của bạn.'}
            </p>
            <footer className="editor-unsaved-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setPendingEditorAction(null)}
              >
                Ở lại
              </button>
              {pendingEditorAction === 'invitation' ? (
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    setPendingEditorAction(null)
                    openMyInvitation()
                  }}
                >
                  Tiếp tục không lưu
                </button>
              ) : null}
              <button
                className="button button-primary"
                type="button"
                disabled={saving}
                onClick={() => void saveAndContinueEditorAction()}
              >
                {saving ? 'Đang lưu…' : 'Lưu và tiếp tục'}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
      {unpublishOpen ? (
        <div
          className="editor-publish-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setUnpublishOpen(false)
          }}
        >
          <section
            className="editor-publish-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unpublish-dialog-title"
          >
            <RocketLaunch size={28} />
            <h2 id="unpublish-dialog-title">Tạm đóng thiệp?</h2>
            <p>
              Sau khi tạm đóng, khách mời sẽ không thể truy cập đường dẫn thiệp công khai. Nội dung
              đã lưu vẫn được giữ nguyên để bạn có thể công khai lại bất cứ lúc nào.
            </p>
            <footer>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setUnpublishOpen(false)}
              >
                Hủy
              </button>
              <button
                className="button button-primary"
                type="button"
                disabled={publishing}
                onClick={() => {
                  setUnpublishOpen(false)
                  void unpublish()
                }}
              >
                {publishing ? 'Đang xử lý…' : 'Tạm đóng thiệp'}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
      {pendingNavigation ? (
        <div className="editor-publish-backdrop">
          <section
            className="editor-publish-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsaved-dialog-title"
          >
            <FloppyDisk size={28} />
            <h2 id="unsaved-dialog-title">Bạn có thay đổi chưa lưu</h2>
            <p>Bạn có muốn lưu nội dung thiệp trước khi rời khỏi trang này không?</p>
            <footer className="editor-unsaved-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setPendingNavigation(null)}
              >
                Ở lại
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  const target = pendingNavigation
                  allowNavigationRef.current = true
                  setPendingNavigation(null)
                  navigate(target)
                }}
              >
                Rời đi không lưu
              </button>
              <button
                className="button button-primary"
                type="button"
                disabled={saving}
                onClick={() =>
                  void (async () => {
                    if (await save()) {
                      const target = pendingNavigation
                      allowNavigationRef.current = true
                      setPendingNavigation(null)
                      navigate(target)
                    }
                  })()
                }
              >
                {saving ? 'Đang lưu…' : 'Lưu và rời đi'}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
      {activeWedding ? (
        <MediaManagerModal
          selectionMode={mediaTarget?.multiple ? 'multiple' : 'single'}
          open={mediaManagerOpen}
          assets={mediaAssets}
          selectedIds={
            new Set(
              mediaTarget?.kind === 'field'
                ? mediaIdsAtValue(getNestedValue(data, mediaTarget.path))
                : [],
            )
          }
          loading={mediaLoading}
          uploading={mediaUploading}
          error={mediaError}
          onClose={() => setMediaManagerOpen(false)}
          onUpload={uploadMedia}
          onConfirm={confirmMedia}
        />
      ) : null}
      {publishOpen ? (
        <div
          className="editor-publish-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPublishOpen(false)
          }}
        >
          <section
            className="editor-publish-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-dialog-title"
          >
            <RocketLaunch size={28} />
            <h2 id="publish-dialog-title">Công khai thiệp online</h2>
            <p>Thiệp sẽ dùng đường dẫn wedding do hệ thống cấp để khách mời truy cập.</p>
            <div className="editor-publish-url">
              <span className="editor-publish-url-label">Đường dẫn thiệp</span>
              <a
                className="editor-publish-url-value"
                href={invitationUrl || '#'}
                target="_blank"
                rel="noreferrer"
              >
                {invitationUrl || 'Chưa có slug'}
              </a>
            </div>
            <footer>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setPublishOpen(false)}
              >
                Hủy
              </button>
              <button
                className="button button-primary"
                type="button"
                disabled={publishing || !activeWedding?.slug}
                onClick={() => void publish()}
              >
                {publishing ? 'Đang công khai…' : 'Công khai thiệp'}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </section>
  )
}

function mediaIdsAtValue(value: unknown): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : []
  return values
    .map((item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).mediaAssetId === 'string'
        ? ((item as Record<string, unknown>).mediaAssetId as string)
        : '',
    )
    .filter(Boolean)
}
function getNestedValue(value: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (current, key) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[key]
          : undefined,
      value,
    )
}
function setNestedValue<T>(value: T, path: string, nextValue: unknown): T {
  const keys = path.split('.')
  const root = structuredClone(value) as Record<string, unknown>
  let cursor: Record<string, unknown> = root
  keys.forEach((key, index) => {
    if (index === keys.length - 1) cursor[key] = nextValue
    else {
      const current = cursor[key]
      cursor[key] = Array.isArray(current)
        ? [...current]
        : current && typeof current === 'object'
          ? { ...(current as Record<string, unknown>) }
          : {}
      cursor = cursor[key] as Record<string, unknown>
    }
  })
  return root as T
}
function mapServerFieldErrors(serverErrors?: Record<string, string[]>): FieldErrors {
  const result: FieldErrors = {}
  if (!serverErrors) return result
  for (const [path, messages] of Object.entries(serverErrors)) {
    const key = path.replace(/^content\./, '').split('.')[0]
    if (key && key !== 'themeConfig' && key !== 'sectionConfig')
      result[key] = messages[0] || 'Nội dung chưa hợp lệ.'
  }
  return result
}

function showFirstInvalidField(
  errors: FieldErrors,
  definitions: EditorSectionDefinition[],
  setErrors: (errors: FieldErrors) => void,
  openSection: (section: Section) => void,
  selectSection: (section: Section) => void,
) {
  setErrors(errors)
  const firstKey = Object.keys(errors)[0]
  const rootKey = firstKey?.split('.')[0]
  const section = definitions.find((item) => rootKey in item.fields)?.sectionKey
  if (!firstKey || !section) return
  openSection(section)
  selectSection(section)
  window.requestAnimationFrame(() => {
    const field = document.querySelector(
      `.editor-accordion-content [data-editor-field="${String(firstKey)}"]`,
    ) as HTMLElement | null
    field?.focus()
  })
}

function editorSignature(data: EditorData, palette: string, order: string[], enabled: string[]) {
  return JSON.stringify({ data, palette, order, enabled })
}
function friendlyEditorError(cause: unknown, fallback: string) {
  if (cause instanceof WeddingApiError) {
    if (cause.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    if (cause.status === 400)
      return 'Một số nội dung chưa hợp lệ. Vui lòng kiểm tra lại rồi thử lưu.'
    if (cause.status >= 500) return 'Hệ thống đang bận. Vui lòng thử lại sau ít phút.'
  }
  return fallback
}

function EditorPreviewFrame({
  device,
  templateKey,
  route,
  frameRef,
  onLoad,
  ready,
}: {
  device: EditorPreviewDevice
  templateKey: string | null
  route: string
  frameRef: RefObject<HTMLIFrameElement>
  onLoad: () => void
  ready: boolean
}) {
  return (
    <EditorPreviewModal
      frameRef={frameRef}
      route={`${route}?editor=1`}
      device={device}
      defaultDevice="mobile"
      ready={ready}
      templateKey={templateKey}
      title="Bản xem trước thiệp"
      open={false}
      onToggleOpen={() => undefined}
      onDeviceChange={(next) =>
        window.dispatchEvent(new CustomEvent('gmm-editor-preview-device-change', { detail: next }))
      }
      onLoad={onLoad}
      embedded
    />
  )
}

function EditorSectionCard({
  sectionKey,
  definition,
  index,
  order,
  expanded,
  shown,
  select,
  focus,
  move,
  toggle,
  children,
}: {
  sectionKey: Section
  definition?: EditorSectionDefinition
  index: number
  order: Section[]
  expanded: boolean
  shown: boolean
  select: () => void
  focus: () => void
  move: (step: -1 | 1) => void
  toggle: () => void
  children: React.ReactNode
}) {
  const label = definition?.label ?? sectionKey
  const reorderable = definition?.canReorder !== false
  const canMoveUp = reorderable && index > 0
  const canMoveDown = reorderable && index < order.length - 1
  return (
    <li
      className={`editor-accordion-card section-${sectionKey} ${expanded ? 'is-expanded' : ''} ${shown ? '' : 'is-disabled'}`}
    >
      <header>
        <button
          type="button"
          className="editor-accordion-trigger"
          onClick={select}
          aria-expanded={expanded}
        >
          <span>
            <strong>{label}</strong>
            <small>{definition?.required ? 'Bắt buộc' : shown ? 'Đang hiển thị' : 'Đang ẩn'}</small>
          </span>
          <CaretDown />
        </button>
        <div className="editor-section-tools">
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={() => move(-1)}
            aria-label={`Đưa ${label} lên`}
            title={reorderable ? 'Đưa lên' : 'Vị trí được khóa bởi giao diện'}
          >
            <ArrowUp />
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={() => move(1)}
            aria-label={`Đưa ${label} xuống`}
            title={reorderable ? 'Đưa xuống' : 'Vị trí được khóa bởi giao diện'}
          >
            <ArrowDown />
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={shown}
            aria-label={`${shown ? 'Ẩn' : 'Hiện'} ${label}`}
            disabled={definition?.canToggle === false || definition?.required}
            className={`editor-switch ${shown ? 'is-on' : ''}`}
            onClick={toggle}
          >
            <span />
          </button>
        </div>
      </header>
      <div
        className={`editor-accordion-content ${expanded ? 'is-open' : ''}`}
        aria-hidden={!expanded}
        onFocusCapture={focus}
      >
        <div className="editor-accordion-content-inner">{children}</div>
      </div>
    </li>
  )
}

function Input({
  fieldKey,
  label,
  ariaLabel,
  value,
  type = 'text',
  area,
  error,
  onChange,
}: {
  fieldKey?: string
  label: string
  ariaLabel?: string
  value?: string
  type?: string
  area?: boolean
  error?: string
  onChange: (value: string) => void
}) {
  const errorId = fieldKey ? `editor-error-${fieldKey}` : undefined
  const common = {
    'aria-label': ariaLabel,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    'data-editor-field': fieldKey,
  }
  return (
    <label className={`editor-field ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      {type === 'date' ? (
        <NativeDateField
          id={fieldKey}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          aria-label={ariaLabel || label}
        />
      ) : area ? (
        <textarea
          {...common}
          rows={4}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          {...common}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error ? (
        <small id={errorId} className="editor-field-error">
          {error}
        </small>
      ) : null}
    </label>
  )
}
function FamilyPersonFields({
  person,
  title,
  name,
  updateTitle,
  updateName,
}: {
  person: string
  title?: string
  name?: string
  updateTitle: (value: string) => void
  updateName: (value: string) => void
}) {
  return (
    <div className="editor-family-person-fields">
      <strong>{person}</strong>
      <div className="editor-family-person-grid">
        <Input
          label="Danh xưng"
          ariaLabel={`Danh xưng ${person.toLowerCase()}`}
          value={title}
          onChange={updateTitle}
        />
        <Input
          label="Họ tên"
          ariaLabel={`Họ tên ${person.toLowerCase()}`}
          value={name}
          onChange={updateName}
        />
      </div>
    </div>
  )
}
type FieldsProps = {
  section: Section
  definition?: EditorSectionDefinition
  data: EditorData
  palette: string
  fieldErrors: FieldErrors
  update: (key: string, value: EditorValue) => void
  setPalette: (p: string) => void
  uploadMusic: (files: FileList | null) => Promise<void>
  openMediaManager: (target: {
    kind: 'field'
    path: string
    multiple: boolean
    role: string
    mediaValue?: 'url' | 'object'
  }) => void
  useMediaManager: boolean
  musicError: string
  paletteOptions: Array<{ key: string; label: string }>
  showPalette: boolean
}
function Fields({
  definition,
  data,
  palette,
  fieldErrors,
  update,
  setPalette,
  uploadMusic,
  openMediaManager,
  useMediaManager,
  musicError,
  paletteOptions,
  showPalette,
}: FieldsProps) {
  return (
    <>
      {showPalette ? (
        <div className="editor-palette">
          {paletteOptions.map((option) => (
            <button
              type="button"
              key={option.key}
              className={palette === option.key ? 'is-active' : ''}
              onClick={() => setPalette(option.key)}
            >
              <i className={'palette-dot ' + option.key} />
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
      {definition && Object.keys(definition.fields).length ? (
        <SchemaFields
          definition={definition}
          data={data}
          errors={fieldErrors}
          update={update}
          openMediaManager={openMediaManager}
          useMediaManager={useMediaManager}
          uploadMusic={uploadMusic}
          musicError={musicError}
        />
      ) : (
        <div className="editor-fixed-section">
          <strong>{definition?.emptyMessage ? 'Thông tin section' : 'Section cố định'}</strong>
          <p>
            {definition?.emptyMessage ??
              'Section này không có nội dung cần nhập. Bạn có thể bật/tắt hoặc đổi vị trí theo cấu hình template.'}
          </p>
        </div>
      )}
    </>
  )
}
function SchemaFields({
  definition,
  data,
  errors,
  update,
  openMediaManager,
  useMediaManager,
  uploadMusic,
  musicError,
}: {
  definition: EditorSectionDefinition
  data: EditorData
  errors: FieldErrors
  update: FieldsProps['update']
  openMediaManager: FieldsProps['openMediaManager']
  useMediaManager: boolean
  uploadMusic: FieldsProps['uploadMusic']
  musicError: string
}) {
  return (
    <TemplateSchemaFields
      fields={definition.fields}
      data={data}
      update={update}
      errors={errors}
      mediaEnabled={useMediaManager}
      uploadAudio={uploadMusic}
      audioError={musicError}
      openMediaManager={(target) => openMediaManager({ kind: 'field', ...target })}
      layout={definition.editorLayout}
    />
  )
}
