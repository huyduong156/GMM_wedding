import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { ArrowClockwise, Browser, Check, Eye, Package, Prohibit, RocketLaunch, X } from '@phosphor-icons/react'
import { adminTemplateApi, type AdminTemplate, type AdminTemplateVersion, type TemplateProductType, type TemplateReviewStatus } from '../../../shared/api/admin-templates'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { publicTemplateRoutes } from '../../../shared/config/routes'
import { createInvitationTemplateReleaseBundle } from '../../../templates/invitations/template-release-bundle'

type ThemeStatus = 'published' | 'review' | 'deprecated'
type Theme = { id: string; key: string; name: string; status: ThemeStatus; version: string; updated: string; style: string; preview: string }

const labels: Record<ThemeStatus, string> = { published: 'Đã xuất bản', review: 'Chờ duyệt', deprecated: 'Ngừng phân phối' }
const statusMap: Record<TemplateReviewStatus, ThemeStatus> = { RELEASED: 'published', PENDING_REVIEW: 'review', DEPRECATED: 'deprecated' }
const previewMap: Record<string, string> = { 'modern-luxe': 'amber', 'verdant-promise': 'garden', 'chibi-daydream': 'rose' }
const styleMap: Record<string, string> = { 'modern-luxe': 'Couture · 2.5D', 'verdant-promise': 'Botanical · Vườn kính', 'chibi-daydream': 'Chibi · Storybook' }

function flattenTemplates(templates: AdminTemplate[]): Theme[] {
  return templates.flatMap((template) => template.versions.map((version: AdminTemplateVersion) => ({
    id: version.id,
    key: template.key,
    name: template.name,
    status: statusMap[version.reviewStatus],
    version: version.version,
    updated: new Date(version.deprecatedAt ?? version.releasedAt ?? version.createdAt).toLocaleDateString('vi-VN'),
    style: styleMap[template.key] ?? template.description ?? 'Template code · Config versioned',
    preview: previewMap[template.key] ?? 'canvas',
  })))
}

export function AdminThemesPage({ kind }: { kind: 'invitation' | 'website' }) {
  const isWebsite = kind === 'website'
  const productType: TemplateProductType = isWebsite ? 'WEDDING_WEBSITE' : 'ONLINE_INVITATION'
  const [themes, setThemes] = useState<Theme[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | ThemeStatus>('all')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const deferredQuery = useDeferredValue(query)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setThemes(flattenTemplates((await adminTemplateApi.list(productType)).items)) }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Không thể tải kho template.') }
    finally { setLoading(false) }
  }, [productType])

  useEffect(() => { void load() }, [load])

  const visibleThemes = useMemo(() => themes.filter((theme) => {
    const matchesText = `${theme.name} ${theme.key} ${theme.style}`.toLowerCase().includes(deferredQuery.trim().toLowerCase())
    return matchesText && (filter === 'all' || theme.status === filter)
  }), [deferredQuery, filter, themes])
  const count = (status: ThemeStatus) => themes.filter((theme) => theme.status === status).length

  const syncTemplates = async () => {
    if (isWebsite) return
    setActionId('sync'); setError(''); setFeedback('')
    try {
      const result = await adminTemplateApi.sync(createInvitationTemplateReleaseBundle())
      setFeedback(result.created ? `Đã thêm ${result.created} phiên bản vào hàng chờ duyệt.` : 'Gói phát hành đã được đồng bộ, không có phiên bản mới.')
      await load()
    } catch (syncError) { setError(syncError instanceof Error ? syncError.message : 'Không thể đồng bộ template.') }
    finally { setActionId('') }
  }

  const changeStatus = async (theme: Theme, action: 'release' | 'deprecate') => {
    if (action === 'deprecate' && !window.confirm(`Ngừng phân phối ${theme.name} ${theme.version}? Các thiệp đang dùng phiên bản này vẫn được giữ nguyên.`)) return
    setActionId(theme.id); setError(''); setFeedback('')
    try {
      if (action === 'release') await adminTemplateApi.release(theme.key, theme.version)
      else await adminTemplateApi.deprecate(theme.key, theme.version)
      setFeedback(action === 'release' ? `Đã phát hành ${theme.name} ${theme.version}.` : `Đã ngừng phân phối ${theme.name} ${theme.version}.`)
      await load()
    } catch (statusError) { setError(statusError instanceof Error ? statusError.message : 'Không thể cập nhật template.') }
    finally { setActionId('') }
  }

  return <div className="admin-dashboard admin-library-page">
    <header className="admin-page-heading"><div><p>Nội dung & giao diện <span>/</span> Kho giao diện</p><h1>Kho {isWebsite ? 'website online' : 'thiệp online'}</h1><span>Kiểm duyệt, xuất bản và theo dõi vòng đời template {isWebsite ? 'website' : 'thiệp'}.</span></div>{!isWebsite ? <button className="button button-primary" disabled={actionId === 'sync'} onClick={() => void syncTemplates()}><Package size={17} weight="bold" /> {actionId === 'sync' ? 'Đang đồng bộ…' : 'Đồng bộ template'}</button> : null}</header>
    {error ? <div className="admin-library-alert" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}><ArrowClockwise size={15} /> Thử lại</button></div> : null}
    <section className="admin-library-summary" aria-label="Tổng quan kho template">
      <div><span>Tất cả phiên bản</span><strong>{themes.length}</strong></div>
      <div><span>Đang hoạt động</span><strong>{count('published')}</strong><small className="positive">Sẵn sàng sử dụng</small></div>
      <div><span>Chờ kiểm duyệt</span><strong>{count('review')}</strong><small>Cần xử lý</small></div>
      <div><span>Ngừng phân phối</span><strong>{count('deprecated')}</strong><small>Không hiện cho lựa chọn mới</small></div>
    </section>
    <section className="admin-panel admin-theme-library">
      <div className="admin-library-toolbar"><label><Browser size={17} /><input aria-label="Tìm template" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, mã hoặc phong cách" /></label><div role="group" aria-label="Lọc trạng thái">{([['all', 'Tất cả'], ['published', 'Đã xuất bản'], ['review', 'Chờ duyệt'], ['deprecated', 'Ngừng phân phối']] as const).map(([value, label]) => <button key={value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>{label} <b>{value === 'all' ? themes.length : count(value)}</b></button>)}</div></div>
      {loading ? <div className="admin-library-loading" aria-label="Đang tải kho template"><i /><i /><i /></div> : visibleThemes.length ? <div className="admin-theme-grid">{visibleThemes.map((theme) => <article className="admin-theme-card" key={theme.id}>
        <div className={`admin-theme-preview ${theme.preview}`}><div className="admin-preview-chrome"><i /><i /><i /><span>{theme.key}.gmm.vn</span></div><div className="admin-preview-canvas"><small>THE WEDDING OF</small><strong>{theme.name}</strong><i /><span>{isWebsite ? 'Our story · Gallery · RSVP' : 'Save the date · 12.12.2026'}</span></div><span className={`admin-status ${theme.status}`}>{labels[theme.status]}</span></div>
        <div className="admin-theme-card-body"><header><div><h2>{theme.name}</h2><code>{theme.key}</code></div><span>v{theme.version}</span></header><p>{theme.style}</p><dl><div><dt>Trạng thái</dt><dd>{labels[theme.status]}</dd></div><div><dt>Cập nhật</dt><dd>{theme.updated}</dd></div></dl></div>
        <footer>{kind === 'invitation' && theme.key in previewMap ? <AppLink to={theme.key === 'verdant-promise' ? publicTemplateRoutes.verdantPromisePreview : theme.key === 'chibi-daydream' ? publicTemplateRoutes.chibiDaydreamPreview : publicTemplateRoutes.modernLuxePreview} ariaLabel={`Xem trước ${theme.name}`}><Eye size={16} /> Xem trước</AppLink> : <button disabled><Eye size={16} /> Chưa có preview</button>}{theme.status === 'review' ? <button disabled={actionId === theme.id} onClick={() => void changeStatus(theme, 'release')}><RocketLaunch size={16} /> Phát hành</button> : theme.status === 'published' ? <button disabled={actionId === theme.id} onClick={() => void changeStatus(theme, 'deprecate')}><Prohibit size={16} /> Ngừng dùng</button> : <button disabled><Check size={16} /> Đã xử lý</button>}</footer>
      </article>)}</div> : <div className="admin-library-empty"><Browser size={34} weight="duotone" /><h2>{themes.length ? 'Không tìm thấy template' : 'Chưa có template trong database'}</h2><p>{themes.length ? 'Thử thay đổi từ khóa hoặc bộ lọc trạng thái.' : isWebsite ? 'Chưa có gói phát hành website được đồng bộ.' : 'Đồng bộ các template code hiện có để đưa vào hàng chờ duyệt.'}</p>{themes.length ? <button onClick={() => { setQuery(''); setFilter('all') }}>Xóa bộ lọc</button> : !isWebsite ? <button onClick={() => void syncTemplates()}>Đồng bộ template</button> : null}</div>}
    </section>
    {feedback ? <div className="templates-feedback" role="status"><Check size={16} /><span>{feedback}</span><button type="button" onClick={() => setFeedback('')} aria-label="Đóng thông báo"><X size={15} /></button></div> : null}
  </div>
}
