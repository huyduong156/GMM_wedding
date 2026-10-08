import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Eye, Heart, MagnifyingGlass, Sparkle } from '@phosphor-icons/react'
import { weddingApi, type WeddingSurface, type WeddingTemplate } from '../../../shared/api/weddings'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { marketingRoutes, publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import { BrandLogo } from '../../../shared/ui/BrandLogo'
import './public-template-library.css'

const copy: Record<WeddingSurface, { eyebrow: string; title: string; description: string }> = {
  ONLINE_INVITATION: { eyebrow: 'Thiệp online', title: 'Một lời mời mang dấu ấn của hai bạn.', description: 'Chọn một giao diện, thêm câu chuyện riêng và gửi lời mời đến những người quan trọng nhất.' },
  WEDDING_WEBSITE: { eyebrow: 'Website cưới', title: 'Kể trọn hành trình trước ngày trọng đại.', description: 'Một nơi để chia sẻ lịch trình, địa điểm, album ảnh và những điều khách mời cần biết.' },
  RECAP: { eyebrow: 'Wedding Recap', title: 'Giữ lại những khoảnh khắc muốn xem lại.', description: 'Biến ảnh, lời chúc và kỷ niệm thành một trang recap có nhịp kể riêng cho ngày vui.' },
}
const previewPaths: Record<string, string> = {
  'modern-luxe': publicTemplateRoutes.modernLuxePreview, 'verdant-promise': publicTemplateRoutes.verdantPromisePreview, 'chibi-daydream': publicTemplateRoutes.chibiDaydreamPreview, 'peony-veranda': publicTemplateRoutes.peonyVerandaPreview, 'astral-vow': publicTemplateRoutes.astralVowPreview, 'rose-garden': publicTemplateRoutes.roseGardenPreview, 'van-hy': publicTemplateRoutes.vanHyPreview, 'aurelia-court': publicTemplateRoutes.aureliaCourtPreview, 'editorial-vows': publicTemplateRoutes.editorialVowsPreview, 'green-hydrangea': publicTemplateRoutes.greenHydrangeaPreview, 'enchanted-forest': publicTemplateRoutes.enchantedForestPreview, 'cherry-blossom-garden': publicTemplateRoutes.cherryBlossomGardenPreview, 'red-spider-lily-recap': publicTemplateRoutes.redSpiderLilyRecapPreview,
}
const artworkImages: Record<string, string> = {
  'modern-luxe': '/assets/images/templates/modern-luxe/couple-portrait.jpg', 'verdant-promise': '/assets/images/templates/modern-luxe/wedding-detail.jpg', 'chibi-daydream': '/assets/images/login-wedding-luxury.jpg', 'peony-veranda': '/assets/images/templates/modern-luxe/wedding-detail.jpg', 'astral-vow': '/assets/images/login-wedding-luxury.jpg', 'editorial-vows': '/assets/images/templates/modern-luxe/couple-portrait.jpg', 'green-hydrangea': '/assets/images/templates/modern-luxe/wedding-detail.jpg', 'enchanted-forest': '/assets/images/login-wedding-luxury.jpg', 'red-spider-lily-recap': '/assets/images/templates/modern-luxe/wedding-detail.jpg',
}
const previewFor = (template: WeddingTemplate) => {
  const version = template.versions.find((item) => !item.deprecatedAt) ?? template.versions[0]
  const configured = version?.config.previewPath
  return typeof configured === 'string' && configured.startsWith('/') ? configured : previewPaths[template.key]
}

export function PublicTemplateLibraryPage({ productType }: { productType: WeddingSurface }) {
  const [templates, setTemplates] = useState<WeddingTemplate[]>([]), [query, setQuery] = useState(''), [loading, setLoading] = useState(true), [error, setError] = useState('')
  const pageCopy = copy[productType]
  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    void weddingApi.templates(productType).then((result) => { if (active) setTemplates(result.items) }).catch(() => { if (active) setError('Chưa thể tải bộ sưu tập lúc này. Bạn có thể thử lại sau.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [productType])
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi')
    return templates.filter((template) => !normalized || `${template.name} ${template.key} ${template.description ?? ''}`.toLocaleLowerCase('vi').includes(normalized))
  }, [query, templates])
  const kindLabel = productType === 'ONLINE_INVITATION' ? 'Thiệp online' : productType === 'WEDDING_WEBSITE' ? 'Website cưới' : 'Recap'
  return <div className="public-library-page">
    <header className="public-library-nav"><AppLink to={marketingRoutes.home} className="public-library-brand" ariaLabel="Ourday - Trang chủ"><BrandLogo /></AppLink><nav aria-label="Điều hướng thư viện"><AppLink className={productType === 'ONLINE_INVITATION' ? 'is-active' : ''} to={marketingRoutes.invitationTemplates}>Thiệp</AppLink><AppLink className={productType === 'WEDDING_WEBSITE' ? 'is-active' : ''} to={marketingRoutes.websiteTemplates}>Website</AppLink><AppLink className={productType === 'RECAP' ? 'is-active' : ''} to={marketingRoutes.recapTemplates}>Recap</AppLink><AppLink to={marketingRoutes.howItWorks}>Cách hoạt động</AppLink><AppLink to={marketingRoutes.faq}>Hỏi đáp</AppLink></nav><AppLink to={studioRoutes.inviteThemes} className="public-library-cta">Bắt đầu tạo <ArrowRight size={16} /></AppLink></header>
    <main><section className="public-library-hero"><div><span className="public-library-eyebrow"><Sparkle weight="fill" /> {pageCopy.eyebrow}</span><h1>{pageCopy.title}</h1><p>{pageCopy.description}</p></div><div className="public-library-hero-note"><Heart weight="fill" /><span>Thiết kế để đẹp trên cả màn hình lớn và điện thoại.</span></div></section>
      <section className="public-library-content" aria-labelledby="public-library-heading"><div className="public-library-toolbar"><div><span className="public-library-eyebrow">Bộ sưu tập hiện tại</span><h2 id="public-library-heading">Tìm phong cách của hai bạn</h2></div><label className="public-library-search"><MagnifyingGlass size={17} /><span className="sr-only">Tìm giao diện</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc phong cách" /></label></div>
        {loading ? <div className="public-library-state">Đang mở bộ sưu tập…</div> : error ? <div className="public-library-state is-error">{error}</div> : visible.length ? <div className="public-template-grid">{visible.map((template) => { const preview = previewFor(template); const version = template.versions.find((item) => !item.deprecatedAt) ?? template.versions[0]; return <article className="public-template-card" key={template.key}><div className="public-template-artwork"><img src={version?.thumbnailUrl ?? artworkImages[template.key] ?? '/assets/images/templates/modern-luxe/couple-portrait.jpg'} alt={`Xem trước ${template.name}`} loading="lazy" /><span>{kindLabel}</span></div><div className="public-template-card-copy"><div><h3>{template.name}</h3><p>{template.description ?? 'Một giao diện được tạo để câu chuyện của bạn được kể thật tự nhiên.'}</p></div><div className="public-template-card-actions">{preview ? <AppLink to={preview} className="public-template-link"><Eye size={16} /> Xem mẫu</AppLink> : null}<AppLink to={studioRoutes.inviteThemes} className="public-template-link is-primary">Dùng giao diện <ArrowRight size={15} /></AppLink></div></div></article> })}</div> : <div className="public-library-state">Không tìm thấy giao diện phù hợp.</div>}
      </section></main><footer className="public-library-footer"><AppLink to={marketingRoutes.home}>ourday</AppLink><span>Không gian cưới được tạo cho câu chuyện của hai bạn.</span><AppLink to={marketingRoutes.howItWorks}>Cách hoạt động <ArrowRight size={15} /></AppLink></footer>
  </div>
}
