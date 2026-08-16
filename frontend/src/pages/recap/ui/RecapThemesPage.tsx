import { Check, Eye, ImagesSquare, PencilSimple } from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { publicTemplateRoutes, studioRoutes } from '../../../shared/config/routes'
import './recap.css'

export function RecapThemesPage() {
  return <section className="recap-themes-page" aria-labelledby="recap-themes-heading">
    <header className="recap-page-heading"><div><p className="breadcrumb">Mai & Đức <span>/</span> Wedding Recap <span>/</span> Kho giao diện</p><h1 id="recap-themes-heading">Chọn cách kể lại ngày vui</h1><p>Mỗi theme giữ nguyên album và lời chúc của bạn, chỉ thay đổi nhịp kể và không khí hình ảnh.</p></div><span className="recap-status-pill"><Check size={14} weight="bold" /> Bản nháp</span></header>
    <div className="recap-theme-grid">
      <article className="recap-theme-card is-active"><div className="recap-theme-art"><div className="recap-theme-art-copy"><span>WINTER WEDDING RECAP</span><strong>Minh Anh <i>&</i> Hoàng Nam</strong><small>14 · 12 · 2026 / Đà Lạt</small></div><span className="recap-theme-badge">Đang dùng</span></div><div className="recap-theme-copy"><div><h2>Winter Wedding Recap</h2><p>Cinematic · Film strip · Winter navy</p></div><p>Nhịp kể điện ảnh dành cho những khoảnh khắc sau lời thề, từ khoảng lặng trước lễ cưới đến đêm champagne.</p></div><footer><AppLink className="button button-secondary" to={publicTemplateRoutes.winterWeddingRecapPreview}><Eye size={16} /> Xem trước</AppLink><AppLink className="button button-primary" to={studioRoutes.recap}><PencilSimple size={16} /> Chỉnh sửa recap</AppLink></footer></article>
      <div className="recap-theme-coming"><ImagesSquare size={28} /><strong>Thêm câu chuyện của bạn</strong><span>Các theme recap khác sẽ xuất hiện sau khi được phát hành.</span></div>
    </div>
  </section>
}
