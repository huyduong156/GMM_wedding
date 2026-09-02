import { notifications } from '../../../shared/ui/notifications/notifications'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Eye, ImagesSquare, MagnifyingGlass, PencilSimple, WarningCircle } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { RecapDraft, TemplateSectionConfig, WeddingApiError, WeddingTemplate, weddingApi } from '../../../shared/api/weddings'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { NativeSelectField } from '../../../shared/ui/form-controls/NativeSelectField'
import './recap.css'

type RecapTheme = {
  key: string
  versionId: string
  version: string
  name: string
  description: string
  style: string
  styles: Array<{ id: string; key: string; name: string }>
  palette: string
  sections: TemplateSectionConfig[]
  previewPath?: string
  config: Record<string, unknown>
}

const previewPaths: Record<string, string> = { 'red-spider-lily-recap': publicTemplateRoutes.redSpiderLilyRecapPreview }
const localMeta: Record<string, { name: string; style: string; palette: string }> = {
  'red-spider-lily-recap': { name: 'Dấu Son Bỉ Ngạn', style: 'Botanical editorial', palette: 'Vermilion paper · Ink ivory' },
}

function sectionKey(section: TemplateSectionConfig) {
  if (typeof section === 'string') return section
  return section.sectionKey
}

function toTheme(template: WeddingTemplate): RecapTheme | null {
  const version = template.versions.find((item) => !item.deprecatedAt) ?? template.versions[0]
  if (!version) return null
  const meta = localMeta[template.key]
  const sections = Array.isArray(version.config.sections) ? version.config.sections : []
  return {
    key: template.key,
    versionId: version.id,
    version: version.version,
    name: meta?.name ?? template.name,
    description: template.description ?? 'Một cách kể lại ngày vui bằng nhịp ảnh, lời kể và những khoảng lặng vừa đủ.',
    style: template.styles?.[0]?.name ?? meta?.style ?? 'Điện ảnh',
    styles: template.styles ?? [],
    palette: meta?.palette ?? 'Theo cấu hình mẫu',
    sections,
    previewPath: typeof version.config.previewPath === 'string' ? version.config.previewPath : previewPaths[template.key],
    config: version.config,
  }
}

function defaultSectionConfig(theme: RecapTheme) {
  const order = theme.sections.map(sectionKey).filter(Boolean)
  return { enabled: order, order }
}

function toast(message: string, icon: 'success' | 'error' | 'warning' = 'success') {
  return notifications.fire({ toast: true, position: 'top-end', icon, title: message, showConfirmButton: false, timer: 2200, timerProgressBar: true })
}

function Artwork({ theme, active }: { theme: RecapTheme; active: boolean }) {
  return <div className={`recap-library-art theme-${theme.key}`} role="img" aria-label={`Xem trước ${theme.name}`}>
    <div className="recap-library-art-copy"><span>WEDDING RECAP · {theme.style}</span><strong>Mai Anh <i>&</i> Đức</strong><small>Đà Lạt · 14.12.2026</small></div>
    {active ? <span className="recap-theme-selected" aria-label="Đang dùng" title="Đang dùng"><Check size={18} weight="bold" /></span> : null}
  </div>
}

export function RecapThemesPage() {
  const workspace = useOptionalWeddingWorkspace()
  const wedding = workspace?.activeWedding ?? null
  const [themes, setThemes] = useState<RecapTheme[]>([])
  const [recap, setRecap] = useState<RecapDraft | null>(null)
  const [query, setQuery] = useState('')
  const [styleFilter, setStyleFilter] = useState('')
  const [styles, setStyles] = useState<Array<{ id: string; key: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!wedding) { setLoading(false); return }
    setLoading(true); setError(null)
    try {
      const catalog = await weddingApi.templates('RECAP', styleFilter || undefined)
      setThemes(catalog.items.map(toTheme).filter((item): item is RecapTheme => item !== null))
      try { setRecap((await weddingApi.recap(wedding.id)).recap) }
      catch (cause) {
        if (cause instanceof WeddingApiError && cause.status === 404) setRecap(null)
        else throw cause
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải kho recap.')
    } finally { setLoading(false) }
  }, [styleFilter, wedding])

  useEffect(() => { void load() }, [load])
  useEffect(() => { void weddingApi.templateStyles().then((result) => setStyles(result.items)).catch(() => setStyles([])) }, [])

  const styleFilters = useMemo(() => [{ key: '', name: 'Tất cả' }, ...styles], [styles])

  const visible = useMemo(() => {
    const value = query.trim().toLocaleLowerCase('vi')
    return themes.filter((theme) => (!styleFilter || theme.styles.some((style) => style.key === styleFilter)) && (!value || [theme.name, theme.style, theme.palette].join(' ').toLocaleLowerCase('vi').includes(value)))
  }, [query, styleFilter, themes])

  const applyTheme = async (theme: RecapTheme) => {
    if (!wedding) return
    setSaving(theme.versionId)
    try {
      const saved = await weddingApi.saveRecap(wedding.id, {
        templateVersionId: theme.versionId,
        title: recap?.title ?? `Wedding Recap của ${wedding.name}`,
        thankYouMessage: recap?.thankYouMessage ?? null,
        ogTitle: recap?.ogTitle ?? null,
        ogDescription: recap?.ogDescription ?? null,
        ogImageUrl: recap?.ogImageUrl ?? null,
        content: recap?.content ?? {},
        themeConfig: recap?.themeConfig ?? {},
        sectionConfig: recap?.templateVersion.key === theme.key ? recap.sectionConfig : defaultSectionConfig(theme),
        mediaItems: recap?.mediaItems.map((item) => ({ mediaAssetId: item.mediaAssetId, caption: item.caption, sortOrder: item.sortOrder })) ?? [],
        wishSelections: recap?.wishSelections.map((item) => ({ wishId: item.wishId, sortOrder: item.sortOrder })) ?? [],
        revision: recap?.revision ?? 1,
      })
      setRecap(saved.recap)
      await toast(`Đã chọn giao diện ${theme.name}.`)
    } catch (cause) {
      await toast(cause instanceof Error ? cause.message : 'Không thể áp dụng giao diện recap.', 'error')
      if (cause instanceof WeddingApiError && cause.code === 'RECAP_REVISION_CONFLICT') await load()
    } finally { setSaving(null) }
  }

  const activeVersionId = recap?.templateVersion.id
  return <section className="recap-themes-page" aria-labelledby="recap-themes-heading">
    <header className="recap-page-heading"><div><p className="breadcrumb">{wedding?.name ?? 'Đám cưới của bạn'} <span>/</span> Wedding Recap <span>/</span> Kho giao diện</p><h1 id="recap-themes-heading">Chọn cách kể lại ngày vui</h1><p>Mỗi theme giữ nguyên album và lời chúc của bạn, chỉ thay đổi nhịp kể và không khí hình ảnh.</p></div>{recap ? <span className="recap-status-pill"><Check size={14} weight="bold" /> {recap.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}</span> : null}</header>
    <div className="recap-library-toolbar"><div className="recap-library-filters"><label className="recap-library-search"><MagnifyingGlass size={17} /><span className="sr-only">Tìm giao diện recap</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, phong cách hoặc màu sắc" /></label><label className="recap-style-filter"><span className="sr-only">Lọc phong cách</span><NativeSelectField value={styleFilter} onChange={(event) => setStyleFilter(event.target.value)}>{styleFilters.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</NativeSelectField></label></div><span className="recap-library-count">{themes.length} giao diện khả dụng</span></div>
    {loading ? <div className="recap-library-grid" aria-label="Đang tải kho recap">{[1, 2].map((item) => <div className="recap-library-skeleton" key={item}><span /><i /><i /></div>)}</div> : error ? <div className="recap-theme-coming recap-library-state"><WarningCircle size={30} /><strong>Chưa tải được kho recap</strong><span>{error}</span><button className="button button-secondary" type="button" onClick={() => void load()}>Thử lại</button></div> : visible.length ? <div className="recap-library-grid">{visible.map((theme) => { const active = activeVersionId === theme.versionId; return <article className={`recap-library-card ${active ? 'is-active' : ''}`} key={theme.versionId}><Artwork theme={theme} active={active} /><div className="recap-library-copy"><div><h2>{theme.name}</h2><p>{theme.style} · {theme.palette} · v{theme.version}</p></div><p>{theme.description}</p></div><footer>{theme.previewPath ? <AppLink className="button button-secondary" to={theme.previewPath}><Eye size={16} /> Xem trước</AppLink> : null}{active ? <AppLink className="button button-primary" to={studioRoutes.recap}><PencilSimple size={16} /> Chỉnh sửa recap</AppLink> : <button className="button button-primary" type="button" disabled={saving !== null} onClick={() => void applyTheme(theme)}>{saving === theme.versionId ? 'Đang áp dụng…' : recap ? 'Dùng giao diện này' : 'Bắt đầu với giao diện này'}</button>}</footer></article> })}</div> : <div className="recap-theme-coming recap-library-state"><ImagesSquare size={30} /><strong>Chưa có giao diện phù hợp</strong><span>Thử đổi từ khóa tìm kiếm hoặc chờ thêm theme được phát hành.</span><button className="button button-secondary" type="button" onClick={() => { setQuery(''); setStyleFilter('') }}>Xóa bộ lọc</button></div>}
  </section>
}
