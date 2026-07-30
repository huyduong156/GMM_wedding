import { MagnifyingGlass, Plus, SquaresFour } from '@phosphor-icons/react'

const themes = [
  ['Amber Vow', 'Thiệp online', 'Đã xuất bản', 'v1.4', '24/07/2026'],
  ['Editorial Bloom', 'Website cưới', 'Đang duyệt', 'v1.1', '29/07/2026'],
  ['Quiet Garden', 'Dùng chung', 'Bản nháp', 'v0.8', '30/07/2026'],
]

export function AdminThemesPage() {
  return <div className="admin-dashboard">
    <header className="admin-page-heading"><div><p>Hệ thống <span>/</span> Kho giao diện</p><h1>Quản lý giao diện</h1><span>Thêm, kiểm duyệt, xuất bản và theo dõi phiên bản template.</span></div><button className="button button-primary"><Plus size={17} /> Thêm template</button></header>
    <section className="admin-panel admin-theme-library"><div className="admin-library-toolbar"><label><MagnifyingGlass size={17} /><input aria-label="Tìm template" placeholder="Tìm theo tên template" /></label><div><button className="is-active">Tất cả <b>24</b></button><button>Chờ duyệt <b>3</b></button><button>Bản nháp <b>5</b></button></div></div><div className="admin-table-wrap"><table><thead><tr><th>Tên giao diện</th><th>Loại</th><th>Trạng thái</th><th>Phiên bản</th><th>Cập nhật</th></tr></thead><tbody>{themes.map(([name, type, status, version, date]) => <tr key={name}><td><span className="theme-table-name"><i><SquaresFour size={18} /></i><strong>{name}</strong></span></td><td>{type}</td><td><span className={`admin-status ${status === 'Đã xuất bản' ? 'published' : status === 'Đang duyệt' ? 'review' : 'draft'}`}>{status}</span></td><td>{version}</td><td>{date}</td></tr>)}</tbody></table></div></section>
  </div>
}
