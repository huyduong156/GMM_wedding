import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  Eye,
  MagnifyingGlass,
  PaintBrush,
  SlidersHorizontal,
  Sparkle,
  X,
} from '@phosphor-icons/react'
import { publicTemplateRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'

type ThemeStyle = 'Lãng mạn' | 'Tối giản' | 'Hiện đại' | 'Truyền thống'

type Theme = {
  id: string
  name: string
  style: ThemeStyle
  palette: string
  description: string
  badge?: string
  previewPath?: string
}

const themes: Theme[] = [
  { id: 'amber-vow', name: 'Élan d’Amour', style: 'Hiện đại', palette: 'Champagne & nâu', description: 'Thiệp mời editorial hiện đại với nghi thức chạm mở thiệp, thông tin hôn lễ cô đọng và RSVP rõ ràng.', badge: 'Mới', previewPath: publicTemplateRoutes.modernLuxePreview },
  { id: 'paper-promise', name: 'Paper Promise', style: 'Tối giản', palette: 'Giấy trắng & mực', description: 'Tinh giản như một tấm thiệp in, tập trung vào tên cặp đôi và thông tin ngày cưới.' },
  { id: 'garden-letter', name: 'Verdant Promise', style: 'Lãng mạn', palette: 'Vườn xanh & ivory', description: 'Thiệp vườn kính có nghi thức chạm mở, lá rơi, lịch trình, bản đồ, slideshow, RSVP và sổ lưu bút.', badge: 'Mới', previewPath: publicTemplateRoutes.verdantPromisePreview },
  { id: 'chibi-daydream', name: 'Mây Hồng Có Đôi', style: 'Lãng mạn', palette: 'Coral & powder blue', description: 'Thiệp chibi storybook với popup phong bì, ảnh cặp đôi nguyên bản, lịch trực quan, album, RSVP, bản đồ và sổ lưu bút.', badge: 'Mới', previewPath: publicTemplateRoutes.chibiDaydreamPreview },
  { id: 'modern-union', name: 'Modern Union', style: 'Hiện đại', palette: 'Than chì & cobalt', description: 'Bố cục editorial mạnh, chữ lớn và nhịp chuyển động gọn cho cặp đôi cá tính.' },
  { id: 'song-hy', name: 'Song Hỷ', style: 'Truyền thống', palette: 'Đỏ son & vàng', description: 'Tinh thần lễ cưới Việt với sắc son tiết chế và họa tiết song hỷ hiện đại.' },
  { id: 'moonlit', name: 'Moonlit', style: 'Hiện đại', palette: 'Đêm xanh & bạc', description: 'Không gian tiệc tối sang trọng, tương phản cao và điểm sáng như ánh trăng.' },
]

const filters: Array<'Tất cả' | ThemeStyle> = ['Tất cả', 'Lãng mạn', 'Tối giản', 'Hiện đại', 'Truyền thống']

function ThemeArtwork({ theme, large = false }: { theme: Theme; large?: boolean }) {
  return <div className={`theme-artwork theme-${theme.id} ${large ? 'is-large' : ''}`} aria-label={`Xem trước giao diện ${theme.name}`} role="img">
    <div className="theme-artwork-frame">
      <span className="theme-ornament" aria-hidden="true" />
      <p>Save the date</p>
      <strong>Mai <i>&</i> Đức</strong>
      <span className="theme-date">18 · 10 · 2026</span>
      <span className="theme-place">Lễ thành hôn · Hà Nội</span>
      <span className="theme-line" aria-hidden="true" />
    </div>
  </div>
}

export function TemplatesPage({ kind }: { kind: 'invitation' | 'website' }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Tất cả')
  const [query, setQuery] = useState('')
  const [activeTheme, setActiveTheme] = useState('amber-vow')
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null)
  const [feedback, setFeedback] = useState('')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const deferredQuery = useDeferredValue(query)
  const isWebsite = kind === 'website'

  useEffect(() => {
    if (!previewTheme) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setPreviewTheme(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [previewTheme])

  const visibleThemes = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase('vi')
    return themes.filter((theme) => (filter === 'Tất cả' || theme.style === filter) && (!normalized || `${theme.name} ${theme.style} ${theme.palette}`.toLocaleLowerCase('vi').includes(normalized)))
  }, [deferredQuery, filter])

  const chooseTheme = (theme: Theme) => {
    setActiveTheme(theme.id)
    setPreviewTheme(null)
    setFeedback(`Đã chọn giao diện ${theme.name}. Phần chỉnh sửa chi tiết sẽ được bổ sung sau.`)
  }

  return (
    <section className="templates-page" aria-labelledby="templates-heading">
      <header className="templates-heading">
        <div><p className="breadcrumb">Mai & Đức <span>/</span> {isWebsite ? 'Website cưới' : 'Thiệp online'} <span>/</span> Kho giao diện</p><h1 id="templates-heading">Chọn giao diện {isWebsite ? 'website' : 'thiệp'}</h1><p>Xem trước và chọn phong cách phù hợp. Nội dung hiện tại sẽ được giữ nguyên.</p></div>
        <div className="current-theme"><PaintBrush size={18} /><span>Đang dùng<strong>{themes.find((theme) => theme.id === activeTheme)?.name}</strong></span></div>
      </header>

      <div className="templates-controls">
        <label className="template-search"><span className="sr-only">Tìm giao diện</span><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc phong cách" /></label>
        <div className="template-filters" aria-label="Lọc phong cách"><SlidersHorizontal size={16} aria-hidden="true" />{filters.map((item) => <button key={item} type="button" className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div>
      </div>

      {visibleThemes.length ? <div className="theme-grid">{visibleThemes.map((theme) => {
        const isActive = activeTheme === theme.id
        return <article className={`theme-card ${isActive ? 'is-active' : ''}`} key={theme.id}>
          <div className="theme-preview-wrap"><ThemeArtwork theme={theme} />{theme.badge ? <span className="theme-badge"><Sparkle size={12} />{theme.badge}</span> : null}{isActive ? <span className="theme-selected"><Check size={13} weight="bold" /> Đang dùng</span> : null}</div>
          <div className="theme-card-copy"><div><h2>{theme.name}</h2><p>{theme.style} · {theme.palette}</p></div><p>{theme.description}</p></div>
          <footer><button className="button button-secondary" type="button" onClick={() => setPreviewTheme(theme)}><Eye size={16} /> Xem trước</button><button className={`button ${isActive ? 'button-secondary' : 'button-primary'}`} type="button" onClick={() => isActive ? setFeedback('Phần chỉnh sửa chi tiết sẽ được triển khai ở bước tiếp theo.') : chooseTheme(theme)}>{isActive ? <><PaintBrush size={16} /> Chỉnh sửa</> : 'Dùng giao diện'}</button></footer>
        </article>
      })}</div> : <div className="templates-empty"><MagnifyingGlass size={28} /><h2>Không tìm thấy giao diện</h2><p>Thử đổi từ khóa hoặc chọn phong cách khác.</p><button className="button button-secondary" type="button" onClick={() => { setQuery(''); setFilter('Tất cả') }}>Xóa bộ lọc</button></div>}

      {previewTheme ? <div className="theme-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewTheme(null) }}>
        <section className="theme-modal" role="dialog" aria-modal="true" aria-labelledby="theme-preview-title" aria-describedby="theme-preview-description">
          <header><div><p>Xem trước giao diện</p><h2 id="theme-preview-title">{previewTheme.name}</h2></div><button ref={closeButtonRef} type="button" onClick={() => setPreviewTheme(null)} aria-label="Đóng xem trước"><X size={19} /></button></header>
          <div className="theme-modal-body"><div className="theme-modal-preview">{!isWebsite && previewTheme.previewPath ? <AppLink to={previewTheme.previewPath} ariaLabel={`Mở bản xem trước đầy đủ ${previewTheme.name}`}><ThemeArtwork theme={previewTheme} large /><span><Eye size={15} /> Chạm vào thiệp để mở bản xem trước</span></AppLink> : <ThemeArtwork theme={previewTheme} large />}</div><aside><span>{previewTheme.style}</span><h3>{previewTheme.palette}</h3><p id="theme-preview-description">{previewTheme.description}</p><dl><div><dt>Áp dụng cho</dt><dd>{isWebsite ? 'Website cưới của bạn' : 'Thiệp online của bạn'}</dd></div><div><dt>Nội dung</dt><dd>Giữ nguyên khi đổi giao diện</dd></div></dl>{!isWebsite && previewTheme.previewPath ? <AppLink to={previewTheme.previewPath} className="button button-secondary">Mở preview đầy đủ</AppLink> : null}<button className="button button-primary" type="button" onClick={() => chooseTheme(previewTheme)}>Dùng giao diện này</button></aside></div>
        </section>
      </div> : null}

      {feedback ? <div className="templates-feedback" role="status"><Check size={16} /><span>{feedback}</span><button type="button" onClick={() => setFeedback('')} aria-label="Đóng thông báo"><X size={15} /></button></div> : null}
    </section>
  )
}
