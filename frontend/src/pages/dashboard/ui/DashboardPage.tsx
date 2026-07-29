import {
  ArrowRight,
  CalendarBlank,
  Clock,
  Copy,
  Eye,
  Heart,
  LinkSimple,
  PaperPlaneTilt,
  ShareNetwork,
  Users,
} from '@phosphor-icons/react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { activity, metrics, trend } from '../model/dashboard-data'

const basePath = '/app/weddings/wed_mai_duc'

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <section className="overview-header">
        <div className="overview-header-topline">
          <p className="breadcrumb">Mai & Đức <span>/</span> Tổng quan</p>
          <span className="overview-date"><CalendarBlank size={15} /> 30 tháng 09, 2026</span>
        </div>
        <div className="page-heading">
          <div>
            <h1>Chào buổi tối, Huy</h1>
            <p>Mọi thứ đang tiến triển tốt. Bạn có 12 phản hồi mới cần xem.</p>
          </div>
          <div className="page-actions">
            <button className="button button-secondary"><Eye size={17} /> Xem thiệp</button>
            <button className="button button-primary"><ShareNetwork size={17} /> Chia sẻ thiệp</button>
          </div>
        </div>

        <div className="publish-summary" aria-label="Trạng thái thiệp cưới">
          <div className="status-strip-main">
            <span className="status-icon"><PaperPlaneTilt size={19} /></span>
            <div><strong>Thiệp đã xuất bản</strong><p>gmmwedding.vn/mai-va-duc</p></div>
          </div>
          <div className="status-strip-actions">
            <span><Eye size={16} /> 1.248 lượt xem</span>
            <button className="text-button"><Copy size={16} /> Sao chép link</button>
          </div>
        </div>
      </section>

      <section className="metric-grid" aria-label="Tổng hợp khách mời">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <article className="metric-item" key={label}>
            <div className="metric-label"><Icon size={18} /><span>{label}</span></div>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <div className="dashboard-layout">
        <div className="dashboard-primary">
          <section className="panel trend-panel">
          <header className="panel-header">
            <div><h2>Phản hồi theo thời gian</h2><p>30 ngày gần nhất</p></div>
            <button className="select-button"><CalendarBlank size={16} /> 30 ngày <span>⌄</span></button>
          </header>
          <div className="chart-summary"><strong>86 phản hồi</strong><span>+18% so với tháng trước</span></div>
          <div className="trend-chart" role="img" aria-label="Biểu đồ phản hồi tăng từ 28 lên 86 trong 30 ngày">
            <div className="chart-grid-lines" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="chart-bars" aria-hidden="true">
              {trend.map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}
            </div>
          </div>
          <div className="chart-axis"><span>01/09</span><span>08/09</span><span>15/09</span><span>22/09</span><span>30/09</span></div>
          </section>

          <section className="panel guest-status-panel">
            <header className="panel-header">
              <div><h2>Tình trạng khách mời</h2><p>Tổng cộng 128 lời mời</p></div>
              <AppLink className="inline-link" to={`${basePath}/guests`}>Quản lý <ArrowRight size={15} /></AppLink>
            </header>
            <div className="attendance-layout">
              <div className="donut" aria-label="67 phần trăm khách đã phản hồi"><div><strong>67%</strong><span>đã phản hồi</span></div></div>
              <div className="attendance-legend">
                <div><i className="legend-dot attending" /><span>Sẽ tham dự</span><strong>74</strong></div>
                <div><i className="legend-dot declined" /><span>Không tham dự</span><strong>12</strong></div>
                <div><i className="legend-dot pending" /><span>Chưa phản hồi</span><strong>42</strong></div>
              </div>
            </div>
          </section>
        </div>

        <aside className="dashboard-rail" aria-label="Sự kiện và hoạt động">
          <section className="panel next-event-panel">
            <div className="event-date"><span>18</span><small>THÁNG 10</small></div>
            <div className="event-copy"><span>Sự kiện sắp tới</span><h2>Lễ thành hôn</h2><p><Clock size={15} /> 17:30, Thứ Bảy</p><p><LinkSimple size={15} /> White Palace, TP. Hồ Chí Minh</p></div>
            <AppLink className="button button-secondary compact" to={`${basePath}/settings`}>Chi tiết <ArrowRight size={16} /></AppLink>
          </section>

          <section className="panel activity-panel">
          <header className="panel-header">
            <div><h2>Hoạt động gần đây</h2><p>Cập nhật theo thời gian thực</p></div>
            <AppLink className="inline-link" to={`${basePath}/rsvps`}>Xem tất cả <ArrowRight size={15} /></AppLink>
          </header>
          <div className="activity-list">
            {activity.map((item) => (
              <div className="activity-row" key={`${item.name}-${item.time}`}>
                <span className={`activity-avatar ${item.tone}`}>{item.initials}</span>
                <div><p><strong>{item.name}</strong> {item.action}</p><span>{item.time}</span></div>
              </div>
            ))}
          </div>
          </section>
        </aside>
      </div>

      <section className="quick-links" aria-label="Thao tác nhanh">
        <AppLink to={`${basePath}/guests`}><span><Users size={19} /></span><div><strong>Thêm khách mời</strong><small>Tạo lời mời và link riêng</small></div><ArrowRight size={17} /></AppLink>
        <AppLink to={`${basePath}/editor`}><span><Heart size={19} /></span><div><strong>Chỉnh sửa nội dung</strong><small>Cập nhật câu chuyện và hình ảnh</small></div><ArrowRight size={17} /></AppLink>
        <AppLink to={`${basePath}/templates`}><span><PaperPlaneTilt size={19} /></span><div><strong>Đổi giao diện</strong><small>Khám phá các mẫu thiệp mới</small></div><ArrowRight size={17} /></AppLink>
      </section>
    </div>
  )
}
