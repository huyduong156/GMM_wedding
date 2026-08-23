import { useEffect, useState, type CSSProperties } from 'react'
import { ChartBar, CheckCircle, Gift, Heart, UsersThree } from '@phosphor-icons/react'
import { weddingApi, type Analytics } from '../../../shared/api/weddings'
import { useWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'

const priorityLabels = [['low', 'Thấp'], ['medium', 'Trung bình'], ['high', 'Cao'], ['urgent', 'Khẩn cấp']] as const
const formatPercent = (value: number) => `${value.toLocaleString('vi-VN')}%`

export function AnalyticsPage() {
  const { activeWedding } = useWeddingWorkspace()
  const weddingId = activeWedding?.id
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!weddingId) return
    let cancelled = false
    setData(null)
    setError(null)
    void weddingApi.analytics(weddingId)
      .then((response) => { if (!cancelled) setData(response.analytics) })
      .catch(() => { if (!cancelled) setError('Không thể tải số liệu phân tích.') })
    return () => { cancelled = true }
  }, [weddingId])

  if (error) return (
    <div className='workspace-empty analytics-error'>
      <ChartBar size={28} />
      <h1>Không thể tải phân tích</h1>
      <p>{error}</p>
      <button className='button button-primary' onClick={() => {
        setError(null)
        if (weddingId) void weddingApi.analytics(weddingId)
          .then((response) => setData(response.analytics))
          .catch(() => setError('Không thể tải số liệu phân tích.'))
      }}>Thử lại</button>
    </div>
  )
  if (!data) return <div className='workspace-boot' role='status'><span /><p>Đang tải số liệu…</p></div>

  const maxPriority = Math.max(...priorityLabels.map(([key]) => data.tasks.byPriority[key]), 1)
  return (
    <main className='page analytics-page'>
      <div className='page-header'>
        <div>
          <p className='breadcrumb'>Mai & Đức <span>/</span> Phân tích</p>
          <h1>Phân tích</h1>
          <p className='page-description'>Theo dõi tiến độ chuẩn bị và mức độ phản hồi của khách mời.</p>
        </div>
      </div>
      <section className='analytics-grid'>
        <article className='panel analytics-card'><UsersThree size={22} /><span>Khách mời</span><strong>{data.guests.total}</strong><small>{data.guests.attending} đã xác nhận · {formatPercent(data.guests.attendanceRate)}</small></article>
        <article className='panel analytics-card'><CheckCircle size={22} /><span>Task đã hoàn thành</span><strong>{data.tasks.completed}/{data.tasks.total}</strong><small>{formatPercent(data.tasks.completedRate)} trên tổng task</small></article>
        <article className='panel analytics-card'><ChartBar size={22} /><span>Task đang thực hiện</span><strong>{data.tasks.byStatus.inProgress}</strong><small>{data.tasks.byStatus.todo} chưa bắt đầu · {data.tasks.byStatus.cancelled} đã hủy</small></article>
        <article className='panel analytics-card'><Gift size={22} /><span>Khách đã gửi tiền mừng</span><strong>{data.gifts.linkedGuestCount}</strong><small>{data.gifts.entryCount} khoản ghi nhận</small></article>
        <article className='panel analytics-card'><Heart size={22} /><span>Lời chúc</span><strong>{data.wishes.total}</strong><small>{data.wishes.approved} lời chúc đã duyệt</small></article>
      </section>
      <section className='panel analytics-status'>
        <div className='section-heading'><div><h2>Tiến độ task</h2><p>Trạng thái của toàn bộ công việc trong kế hoạch.</p></div><strong>{formatPercent(data.tasks.completedRate)}</strong></div>
        <div className='analytics-donut-wrap'>
          <div className='analytics-donut' style={{ '--progress': `${data.tasks.completedRate * 3.6}deg` } as CSSProperties} role='img' aria-label={`Đã hoàn thành ${formatPercent(data.tasks.completedRate)}`}>
            <div><strong>{formatPercent(data.tasks.completedRate)}</strong><span>hoàn thành</span></div>
          </div>
          <div className='status-legend'>
            <span><b className='status-dot status-done' />Đã làm <strong>{data.tasks.byStatus.done}</strong></span>
            <span><b className='status-dot status-progress-dot' />Đang làm <strong>{data.tasks.byStatus.inProgress}</strong></span>
            <span><b className='status-dot status-todo' />Chưa làm <strong>{data.tasks.byStatus.todo}</strong></span>
            <span><b className='status-dot status-cancelled' />Đã hủy <strong>{data.tasks.byStatus.cancelled}</strong></span>
          </div>
        </div>

      </section>
      <section className='analytics-columns'>
        <article className='panel analytics-panel'>
          <div className='section-heading'><div><h2>Task theo độ ưu tiên</h2><p>Phân bổ khối lượng công việc hiện tại.</p></div><ChartBar size={22} /></div>
          <div className='priority-chart' role='img' aria-label='Biểu đồ số task theo độ ưu tiên'>{priorityLabels.map(([key, label]) => <div className='priority-column' key={key}><strong>{data.tasks.byPriority[key]}</strong><div className='priority-bar-track'><i style={{ height: `${(data.tasks.byPriority[key] / maxPriority) * 100}%` }} /></div><span>{label}</span></div>)}</div>
        </article>
        <article className='panel analytics-panel'>
          <div className='section-heading'><div><h2>5 task gần nhất đã làm</h2><p>{data.tasks.completed} task đã hoàn thành tất cả.</p></div></div>
          {data.tasks.recentCompleted.length ? <ul className='analytics-list'>{data.tasks.recentCompleted.map((task) => <li key={task.id}><CheckCircle size={18} /><span>{task.title}</span><time>{new Date(task.completedAt).toLocaleDateString('vi-VN')}</time></li>)}</ul> : <p className='empty-state'>Chưa có task hoàn thành.</p>}
        </article>
      </section>
    </main>
  )
}
