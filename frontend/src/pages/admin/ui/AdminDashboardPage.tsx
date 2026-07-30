import { ArrowRight, CheckCircle, Clock, Pulse, WarningCircle } from '@phosphor-icons/react'

const adminMetrics = [
  ['Người dùng hoạt động', '1.284', '+8,4% tháng này'],
  ['Website đã xuất bản', '642', '38 mới trong 30 ngày'],
  ['Template công khai', '24', '3 bản chờ duyệt'],
  ['Phản hồi hôm nay', '3.892', 'RSVP và lời chúc'],
]

export function AdminDashboardPage() {
  return <div className="admin-dashboard">
    <header className="admin-page-heading"><div><p>Hệ thống <span>/</span> Tổng quan</p><h1>Chào buổi sáng, Admin</h1><span>Theo dõi hoạt động và chất lượng toàn nền tảng.</span></div><div className="system-healthy"><CheckCircle size={17} weight="fill" /><span>Tất cả dịch vụ ổn định</span></div></header>
    <section className="admin-metrics" aria-label="Chỉ số hệ thống">{adminMetrics.map(([label, value, detail]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</section>
    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-activity-chart"><header><div><h2>Hoạt động nền tảng</h2><p>30 ngày gần nhất</p></div><button>30 ngày⌄</button></header><div className="admin-chart-summary"><strong>18.460</strong><span>lượt truy cập hợp lệ</span></div><div className="admin-line-chart" role="img" aria-label="Lượt truy cập tăng đều trong 30 ngày"><i /><i /><i /><i /><svg viewBox="0 0 800 180" preserveAspectRatio="none" aria-hidden="true"><path d="M0 155 C80 148 95 100 170 116 S280 142 350 83 S470 106 545 55 S660 79 800 20" fill="none" stroke="currentColor" strokeWidth="4" /></svg></div><footer><span>01/07</span><span>08/07</span><span>15/07</span><span>22/07</span><span>30/07</span></footer></section>
      <aside className="admin-panel admin-queue"><header><div><h2>Cần xử lý</h2><p>Hàng đợi vận hành</p></div></header><button><span className="queue-icon warning"><WarningCircle size={19} /></span><span><strong>3 template chờ duyệt</strong><small>Cập nhật gần nhất 12 phút trước</small></span><ArrowRight size={17} /></button><button><span className="queue-icon neutral"><Clock size={19} /></span><span><strong>5 báo cáo nội dung</strong><small>2 mục có mức ưu tiên cao</small></span><ArrowRight size={17} /></button><button><span className="queue-icon success"><Pulse size={19} /></span><span><strong>1 webhook cần thử lại</strong><small>Thanh toán · lần thử thứ 2</small></span><ArrowRight size={17} /></button></aside>
    </div>
    <section className="admin-panel admin-recent"><header><div><h2>Wedding mới gần đây</h2><p>Chỉ hiển thị dữ liệu vận hành tối thiểu</p></div><button className="button button-secondary">Xem tất cả</button></header><div className="admin-table-wrap"><table><thead><tr><th>Wedding</th><th>Chủ sở hữu</th><th>Trạng thái</th><th>Giao diện</th><th>Cập nhật</th></tr></thead><tbody><tr><td><strong>Mai & Đức</strong><small>mai-va-duc</small></td><td>Linh Mai</td><td><span className="admin-status published">Đã xuất bản</span></td><td>Amber Vow</td><td>2 phút trước</td></tr><tr><td><strong>An & Minh</strong><small>an-minh-2026</small></td><td>Nguyễn An</td><td><span className="admin-status draft">Bản nháp</span></td><td>Editorial Bloom</td><td>18 phút trước</td></tr><tr><td><strong>Vy & Khang</strong><small>vy-khang</small></td><td>Hoàng Vy</td><td><span className="admin-status review">Đang xem xét</span></td><td>Quiet Garden</td><td>1 giờ trước</td></tr></tbody></table></div></section>
  </div>
}
