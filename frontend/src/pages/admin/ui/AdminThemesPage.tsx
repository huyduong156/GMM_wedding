import { useDeferredValue, useMemo, useState } from 'react'
import { Browser, Eye, GearSix, MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { publicTemplateRoutes } from '../../../shared/config/routes'

type ThemeStatus = 'published' | 'review' | 'draft'
type Theme = { key: string; name: string; kind: 'invitation' | 'website'; status: ThemeStatus; version: string; updated: string; uses: number; style: string; preview: string }

const themes: Theme[] = [
  { key: 'modern-luxe', name: 'Modern Luxe', kind: 'invitation', status: 'published', version: 'v1.0', updated: '30/07/2026', uses: 0, style: 'Hiện đại · Sang trọng', preview: 'amber' },
  { key: 'quiet-garden', name: 'Quiet Garden', kind: 'invitation', status: 'draft', version: 'v0.8', updated: '30/07/2026', uses: 0, style: 'Botanical · Dịu nhẹ', preview: 'garden' },
  { key: 'modern-noir', name: 'Modern Noir', kind: 'invitation', status: 'review', version: 'v1.0', updated: '29/07/2026', uses: 18, style: 'Hiện đại · Tương phản', preview: 'noir' },
  { key: 'editorial-bloom', name: 'Editorial Bloom', kind: 'website', status: 'review', version: 'v1.1', updated: '29/07/2026', uses: 42, style: 'Editorial · Lãng mạn', preview: 'bloom' },
  { key: 'timeless-story', name: 'Timeless Story', kind: 'website', status: 'published', version: 'v2.2', updated: '26/07/2026', uses: 214, style: 'Cổ điển · Kể chuyện', preview: 'timeless' },
  { key: 'soft-canvas', name: 'Soft Canvas', kind: 'website', status: 'draft', version: 'v0.6', updated: '30/07/2026', uses: 0, style: 'Tối giản · Ảnh lớn', preview: 'canvas' },
]

const labels: Record<ThemeStatus, string> = { published: 'Đã xuất bản', review: 'Đang duyệt', draft: 'Bản nháp' }

export function AdminThemesPage({ kind }: { kind: 'invitation' | 'website' }) {
  const isWebsite = kind === 'website'
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | ThemeStatus>('all')
  const deferredQuery = useDeferredValue(query)
  const library = themes.filter((theme) => theme.kind === kind)
  const visibleThemes = useMemo(() => library.filter((theme) => {
    const matchesText = `${theme.name} ${theme.key} ${theme.style}`.toLowerCase().includes(deferredQuery.toLowerCase())
    return matchesText && (filter === 'all' || theme.status === filter)
  }), [deferredQuery, filter, library])
  const count = (status: ThemeStatus) => library.filter((theme) => theme.status === status).length

  return <div className="admin-dashboard admin-library-page">
    <header className="admin-page-heading"><div><p>Nội dung & giao diện <span>/</span> Kho giao diện</p><h1>Kho {isWebsite ? 'website online' : 'thiệp online'}</h1><span>Kiểm duyệt, xuất bản và theo dõi vòng đời template {isWebsite ? 'website' : 'thiệp'}.</span></div><button className="button button-primary"><Plus size={17} weight="bold" /> Thêm template</button></header>
    <section className="admin-library-summary" aria-label="Tổng quan kho template">
      <div><span>Tất cả template</span><strong>{library.length}</strong></div>
      <div><span>Đang hoạt động</span><strong>{count('published')}</strong><small className="positive">Sẵn sàng sử dụng</small></div>
      <div><span>Chờ kiểm duyệt</span><strong>{count('review')}</strong><small>Cần xử lý</small></div>
      <div><span>Bản nháp</span><strong>{count('draft')}</strong><small>Chưa công khai</small></div>
    </section>
    <section className="admin-panel admin-theme-library">
      <div className="admin-library-toolbar"><label><MagnifyingGlass size={17} /><input aria-label="Tìm template" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, mã hoặc phong cách" /></label><div role="group" aria-label="Lọc trạng thái">{([['all', 'Tất cả'], ['published', 'Đã xuất bản'], ['review', 'Chờ duyệt'], ['draft', 'Bản nháp']] as const).map(([value, label]) => <button key={value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>{label} <b>{value === 'all' ? library.length : count(value)}</b></button>)}</div></div>
      {visibleThemes.length ? <div className="admin-theme-grid">{visibleThemes.map((theme) => <article className="admin-theme-card" key={theme.key}>
        <div className={`admin-theme-preview ${theme.preview}`}>
          <div className="admin-preview-chrome"><i /><i /><i /><span>{theme.key}.gmm.vn</span></div>
          <div className="admin-preview-canvas"><small>THE WEDDING OF</small><strong>{theme.name}</strong><i /><span>{isWebsite ? 'Our story · Gallery · RSVP' : 'Save the date · 12.12.2026'}</span></div>
          <span className={`admin-status ${theme.status}`}>{labels[theme.status]}</span>
        </div>
        <div className="admin-theme-card-body"><header><div><h2>{theme.name}</h2><code>{theme.key}</code></div><span>{theme.version}</span></header><p>{theme.style}</p><dl><div><dt>Lượt sử dụng</dt><dd>{theme.uses}</dd></div><div><dt>Cập nhật</dt><dd>{theme.updated}</dd></div></dl></div>
        <footer>{theme.key === 'modern-luxe' && kind === 'invitation' ? <AppLink to={publicTemplateRoutes.modernLuxePreview} ariaLabel={`Xem trước ${theme.name}`}><Eye size={16} /> Xem trước</AppLink> : <button><Eye size={16} /> Xem trước</button>}<button><GearSix size={16} /> Quản lý</button></footer>
      </article>)}</div> : <div className="admin-library-empty"><Browser size={34} weight="duotone" /><h2>Không tìm thấy template</h2><p>Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p><button onClick={() => { setQuery(''); setFilter('all') }}>Xóa bộ lọc</button></div>}
    </section>
  </div>
}
