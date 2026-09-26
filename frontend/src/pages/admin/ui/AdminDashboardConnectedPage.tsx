import { useCallback, useEffect, useState } from 'react'
import { ArrowClockwise, CheckCircle, Clock, Pulse, WarningCircle } from '@phosphor-icons/react'
import { adminDashboardApi, type AdminDashboard } from '../../../shared/api/admin-dashboard'

const n = (value: number) => value.toLocaleString('vi-VN')
const bytes = (value: string) => {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(amount) / Math.log(1024)), units.length - 1)
  return `${(amount / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`
}
const date = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
const action = (value: string) => value.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())

export function AdminDashboardConnectedPage() {
  const [data, setData] = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData((await adminDashboardApi.overview()).dashboard)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải tổng quan hệ thống.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => void load(), [load])
  if (loading && !data) return <div className="admin-dashboard admin-dashboard-state" role="status">Đang tải tổng quan hệ thống…</div>
  if (error && !data) return <div className="admin-dashboard admin-dashboard-state"><WarningCircle size={30} /><h1>Chưa tải được tổng quan</h1><p>{error}</p><button className="button button-secondary" type="button" onClick={() => void load()}><ArrowClockwise /> Thử lại</button></div>
  if (!data) return null
  const queue = [
    [<WarningCircle size={19} />, 'warning', `${n(data.templates.pendingReviewVersions)} template chờ duyệt`, 'Version chưa được phát hành'],
    [<Clock size={19} />, 'neutral', `${n(data.media.processing)} media đang xử lý`, `${n(data.media.failed)} media lỗi cần kiểm tra`],
    [<Pulse size={19} />, 'success', `${n(data.users.pendingVerification)} tài khoản chờ xác minh`, `${n(data.users.suspended)} tài khoản đang tạm khóa`],
  ] as const
  return <div className="admin-dashboard">
    <header className="admin-page-heading"><div><p>Hệ thống <span>/</span> Tổng quan</p><h1>Chào buổi sáng, Admin</h1><span>Theo dõi hoạt động và chất lượng toàn nền tảng.</span></div><div className="system-healthy"><CheckCircle size={17} weight="fill" /><span>Dữ liệu đã đồng bộ</span></div></header>
    <section className="admin-metrics" aria-label="Chỉ số hệ thống">
      <article><span>Người dùng</span><strong>{n(data.users.total)}</strong><small>{n(data.users.active)} đang hoạt động</small></article>
      <article><span>Wedding</span><strong>{n(data.weddings.total)}</strong><small>{n(data.weddings.published)} đang công khai</small></article>
      <article><span>Template hoạt động</span><strong>{n(data.templates.active)}</strong><small>{n(data.templates.pendingReviewVersions)} version chờ duyệt</small></article>
      <article><span>Media đã lưu</span><strong>{n(data.media.total)}</strong><small>{bytes(data.media.totalSizeBytes)} dung lượng</small></article>
    </section>
    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-activity-chart"><header><div><h2>Tổng quan nền tảng</h2><p>Số liệu hiện tại từ hệ thống</p></div><button type="button" onClick={() => void load()} disabled={loading}>{loading ? 'Đang tải…' : 'Làm mới'}</button></header><div className="admin-chart-summary"><strong>{n(data.templates.releasedVersions)}</strong><span>version template đã phát hành</span></div><div className="admin-dashboard-breakdown" aria-label="Phân bổ dữ liệu nền tảng"><div><span>Wedding nháp</span><strong>{n(data.weddings.draft)}</strong></div><div><span>Wedding lưu trữ</span><strong>{n(data.weddings.archived)}</strong></div><div><span>Media sẵn sàng</span><strong>{n(data.media.ready)}</strong></div><div><span>Template ngừng phân phối</span><strong>{n(data.templates.deprecated)}</strong></div></div>{error ? <p className="admin-dashboard-inline-error">{error}</p> : null}</section>
      <aside className="admin-panel admin-queue"><header><div><h2>Cần xử lý</h2><p>Hàng đợi vận hành</p></div></header>{queue.map(([icon, tone, title, detail]) => <div className="admin-dashboard-queue-item" key={title}><span className={`queue-icon ${tone}`}>{icon}</span><span><strong>{title}</strong><small>{detail}</small></span></div>)}</aside>
    </div>
    <section className="admin-panel admin-recent"><header><div><h2>Hoạt động gần đây</h2><p>10 audit log mới nhất từ hệ thống</p></div><button className="button button-secondary" type="button" onClick={() => void load()}>Làm mới</button></header><div className="admin-table-wrap"><table><thead><tr><th>Thao tác</th><th>Đối tượng</th><th>Người thực hiện</th><th>Thời gian</th></tr></thead><tbody>{data.recentAuditLogs.length ? data.recentAuditLogs.map((entry) => <tr key={entry.id}><td><strong>{action(entry.action)}</strong></td><td>{entry.resourceType} · {entry.resourceId}</td><td>{entry.actorUser?.displayName ?? entry.actorUser?.email ?? 'Hệ thống'}</td><td>{date(entry.occurredAt)}</td></tr>) : <tr><td colSpan={4}>Chưa có hoạt động được ghi nhận.</td></tr>}</tbody></table></div></section>
  </div>
}
