import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Check, Eye, MagnifyingGlass, PaintBrush, PencilSimple, SlidersHorizontal, WarningCircle } from '@phosphor-icons/react'

import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { weddingApi, type TemplateSectionConfig, type WeddingContent, type WeddingTemplate } from '../../../shared/api/weddings'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { TemplatesPage } from './TemplatesPage'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

type Theme = {
  key: string; versionId: string; version: string; name: string; description: string
  style: string; palette: string; sections: TemplateSectionConfig[]; previewPath?: string; unavailable?: boolean
}

const previewPaths: Record<string, string> = {
  'modern-luxe': publicTemplateRoutes.modernLuxePreview,
  'verdant-promise': publicTemplateRoutes.verdantPromisePreview,
  'chibi-daydream': publicTemplateRoutes.chibiDaydreamPreview,
}
const localMeta: Record<string, { style: string; palette: string }> = {
  'modern-luxe': { style: 'Hiện đại', palette: 'Champagne & nâu' },
  'verdant-promise': { style: 'Lãng mạn', palette: 'Vườn xanh & ivory' },
  'chibi-daydream': { style: 'Lãng mạn', palette: 'Coral & powder blue' },
}
const localNames: Record<string, string> = { 'modern-luxe': 'Élan d’Amour', 'verdant-promise': 'Verdant Promise', 'chibi-daydream': 'Mây Hồng Có Đôi' }
const filters = ['Tất cả', 'Lãng mạn', 'Tối giản', 'Hiện đại', 'Truyền thống'] as const

function toTheme(template: WeddingTemplate): Theme | null {
  const version = template.versions.find((item) => !item.deprecatedAt) ?? template.versions[0]
  if (!version) return null
  const meta = localMeta[template.key]
  return {
    key: template.key, versionId: version.id, version: version.version, name: template.name,
    description: template.description ?? `Template ${template.name} phiên bản ${version.version}.`,
    style: typeof version.config.style === 'string' ? version.config.style : meta?.style ?? 'Hiện đại',
    palette: typeof version.config.palette === 'string' ? version.config.palette : meta?.palette ?? 'Theo cấu hình mẫu',
    sections: version.config.sections ?? [], previewPath: previewPaths[template.key],
  }
}

function sectionKeyOf(section: TemplateSectionConfig): string {
  if (typeof section === 'string') return section
  const legacySection = section as { sectionKey?: unknown; key?: unknown }
  return typeof legacySection.sectionKey === 'string' ? legacySection.sectionKey : typeof legacySection.key === 'string' ? legacySection.key : ''
}

function sectionDefaults(sections: TemplateSectionConfig[], previous?: WeddingContent['sectionConfig']) {
  const order = sections.map(sectionKeyOf).filter(Boolean)
  if (!previous) return { enabled: order, order }
  const keptOrder = previous.order.filter((key) => order.includes(key))
  const added = order.filter((key) => !keptOrder.includes(key))
  const required = sections.filter((item) => typeof item !== 'string' && item.required).map(sectionKeyOf).filter(Boolean)
  const enabled = [...new Set([...previous.enabled.filter((key) => order.includes(key)), ...added, ...required])]
  return { enabled, order: [...keptOrder, ...added] }
}

function Artwork({ theme }: { theme: Theme }) {
  return <div className={`theme-artwork theme-${theme.key}`} role="img" aria-label={`Xem trước giao diện ${theme.name}`}><div className="theme-artwork-frame"><span className="theme-ornament" aria-hidden="true" /><p>Save the date</p><strong>Mai <i>&</i> Đức</strong><span className="theme-date">18 · 10 · 2026</span><span className="theme-place">Lễ thành hôn · Hà Nội</span><span className="theme-line" aria-hidden="true" /></div></div>
}

export function TemplatesApiPage({ kind }: { kind: 'invitation' | 'website' }) {
  const workspace = useOptionalWeddingWorkspace()
  const activeWedding = workspace?.activeWedding ?? null
  const surface = kind === 'website' ? 'WEDDING_WEBSITE' : 'ONLINE_INVITATION'
  const [themes, setThemes] = useState<Theme[]>([])
  const [content, setContent] = useState<WeddingContent | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof filters)[number]>('Tất cả')
  const [loading, setLoading] = useState(Boolean(workspace))
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const deferredQuery = useDeferredValue(query)

  const load = useCallback(async () => {
    if (!workspace) return
    setLoading(true); setError(null)
    try {
      const catalog = await weddingApi.templates(surface)
      setThemes(catalog.items.map(toTheme).filter((item): item is Theme => item !== null))
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải kho giao diện.') }
    if (activeWedding) {
      try { setContent((await weddingApi.content(activeWedding.id, surface)).content) }
      catch (cause) { await Swal.fire({ icon: 'error', title: 'Không thể tải trạng thái giao diện', text: cause instanceof Error ? cause.message : 'Vui lòng thử lại sau.', confirmButtonText: 'Đã hiểu' }) }
    } else setContent(null)
    setLoading(false)
  }, [activeWedding, surface, workspace])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 1800)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const activeKey = content?.templateVersion?.key
  const activeVersionId = content?.templateVersion?.id
  const unavailableActiveTheme = useMemo<Theme | null>(() => {
    const selected = content?.templateVersion
    if (!selected || themes.some((theme) => theme.versionId === selected.id)) return null
    const meta = localMeta[selected.key]
    const sections = Array.isArray(selected.config.sections) ? selected.config.sections as TemplateSectionConfig[] : []
    return { key: selected.key, versionId: selected.id, version: selected.version, name: localNames[selected.key] ?? selected.key, description: 'Version này đã ngừng phân phối. Bạn vẫn có thể tiếp tục chỉnh sửa thiệp hiện tại.', style: meta?.style ?? 'Theo cấu hình mẫu', palette: meta?.palette ?? 'Theo cấu hình mẫu', sections, previewPath: previewPaths[selected.key], unavailable: true }
  }, [content, themes])
  const visible = useMemo(() => {
    const value = deferredQuery.trim().toLocaleLowerCase('vi')
    const matches = themes.filter((theme) => (filter === 'Tất cả' || theme.style === filter) && (!value || `${theme.name} ${theme.style} ${theme.palette}`.toLocaleLowerCase('vi').includes(value)))
    const active = themes.find((theme) => theme.versionId === activeVersionId) ?? unavailableActiveTheme
    return active ? [active, ...matches.filter((theme) => theme.versionId !== active.versionId)] : matches
  }, [activeVersionId, deferredQuery, filter, themes, unavailableActiveTheme])

  const selectTheme = async (theme: Theme) => {
    if (!activeWedding || !content) { setNotice('Hãy chọn một đám cưới trước khi áp dụng giao diện.'); return }
    setSaving(theme.key); setError(null)
    try {
      const saved = await weddingApi.saveContent(activeWedding.id, {
        surface, templateVersionId: theme.versionId, content: content.content, themeConfig: content.themeConfig,
        sectionConfig: sectionDefaults(theme.sections, content.sectionConfig), revision: content.revision,
      })
      setContent(saved.content); setNotice(`Đã chọn giao diện ${theme.name}.`)
    } catch (cause) {
      if (cause instanceof Error && 'code' in cause && cause.code === 'WEDDING_CONTENT_REVISION_CONFLICT') {
        await Swal.fire({ icon: 'warning', title: 'Dữ liệu vừa thay đổi', text: 'Giao diện chưa được áp dụng. Danh sách sẽ được tải lại.', confirmButtonText: 'Đã hiểu' })
        await load()
      } else {
        await Swal.fire({ icon: 'error', title: 'Không thể dùng giao diện', text: cause instanceof Error ? cause.message : 'Vui lòng thử lại sau.', confirmButtonText: 'Đã hiểu' })
      }
    } finally { setSaving(null) }
  }

  const isWebsite = kind === 'website'
  if (!workspace) return <TemplatesPage kind={kind} />
  return <section className="templates-page" aria-labelledby="templates-heading">
    <header className="templates-heading"><div><p className="breadcrumb">{activeWedding?.name ?? 'Đám cưới của bạn'} <span>/</span> {isWebsite ? 'Website cưới' : 'Thiệp online'} <span>/</span> Kho giao diện</p><h1 id="templates-heading">Chọn giao diện {isWebsite ? 'website' : 'thiệp'}</h1><p>Kho giao diện được đồng bộ từ hệ thống. Nội dung hiện tại được giữ nguyên khi đổi mẫu.</p></div>{activeKey ? <div className="current-theme"><PaintBrush size={18} /><span>Đang dùng<strong>{themes.find((item) => item.versionId === activeVersionId)?.name ?? unavailableActiveTheme?.name ?? activeKey}</strong></span></div> : null}</header>
    {unavailableActiveTheme ? <div className="templates-retired-warning" role="status"><WarningCircle size={20} weight="fill" /><div><strong>Giao diện bạn đang dùng đã ngừng phân phối</strong><p>Bạn vẫn có thể tiếp tục chỉnh sửa thiệp hiện tại. Nếu đổi sang giao diện khác, bạn sẽ không thể chọn lại version này.</p></div></div> : null}
    <div className="templates-controls"><label className="template-search"><span className="sr-only">Tìm giao diện</span><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc phong cách" /></label><div className="template-filters" aria-label="Lọc phong cách"><SlidersHorizontal size={16} />{filters.map((item) => <button key={item} type="button" className={filter === item ? 'is-active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    {loading ? <div className="theme-grid" aria-label="Đang tải kho giao diện">{[1, 2, 3].map((item) => <div className="theme-card theme-card-skeleton" key={item}><span /><div><i /><i /></div></div>)}</div> : error ? <div className="templates-empty templates-error"><WarningCircle size={30} /><h2>Chưa tải được kho giao diện</h2><p>{error}</p><button className="button button-secondary" type="button" onClick={() => void load()}>Thử lại</button></div> : visible.length ? <div className="theme-grid">{visible.map((theme) => {
      const active = activeVersionId === theme.versionId
      return <article className={`theme-card ${active ? 'is-active' : ''} ${theme.unavailable ? 'is-unavailable' : ''}`} key={theme.versionId}><div className="theme-preview-wrap"><Artwork theme={theme} />{active ? <span className="theme-selected"><Check size={13} weight="bold" /> Đang dùng</span> : null}{theme.unavailable ? <span className="theme-retired-badge">Ngừng phân phối</span> : null}</div><div className="theme-card-copy"><div><h2>{theme.name}</h2><p>{theme.style} · {theme.palette} · v{theme.version}</p></div><p>{theme.description}</p></div><footer>{theme.previewPath ? <AppLink className="button button-secondary" to={theme.previewPath}><Eye size={16} /> Xem trước</AppLink> : <button className="button button-secondary" type="button" disabled><Eye size={16} /> Chưa có preview</button>}{active && !isWebsite ? <AppLink className="button button-primary" to={studioRoutes.invites}><PencilSimple size={16} /> Chỉnh sửa</AppLink> : <button className={`button ${active ? 'button-secondary' : 'button-primary'}`} type="button" disabled={theme.unavailable || active || saving !== null || !activeWedding} onClick={() => void selectTheme(theme)}>{theme.unavailable ? 'Không thể chọn lại' : saving === theme.key ? 'Đang áp dụng…' : active ? 'Đang dùng' : 'Dùng giao diện'}</button>}</footer></article>
    })}</div> : <div className="templates-empty"><MagnifyingGlass size={28} /><h2>{themes.length ? 'Không tìm thấy giao diện' : 'Chưa có giao diện khả dụng'}</h2><p>{themes.length ? 'Thử đổi từ khóa hoặc bộ lọc.' : 'Template sẽ xuất hiện sau khi được phát hành từ hệ thống.'}</p>{themes.length ? <button className="button button-secondary" type="button" onClick={() => { setQuery(''); setFilter('Tất cả') }}>Xóa bộ lọc</button> : null}</div>}
    {notice ? <div className="templates-feedback" role="status"><Check className="templates-success-check" size={34} weight="bold" /><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Đóng thông báo">×</button></div> : null}
  </section>
}
