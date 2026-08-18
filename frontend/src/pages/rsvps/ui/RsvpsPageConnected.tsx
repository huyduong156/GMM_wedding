import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { CheckCircle, MagnifyingGlass, Question, UsersThree, XCircle } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { rsvpApi, type Rsvp, type RsvpAttendance } from '../../../shared/api/weddings'
import { RsvpsPage } from './RsvpsPage'

const statusCopy: Record<RsvpAttendance, string> = { ATTENDING: 'Sẽ tham dự', MAYBE: 'Chưa chắc chắn', DECLINED: 'Không tham dự' }
const statusFilters: Array<{ value: 'all' | RsvpAttendance; label: string }> = [
  { value: 'all', label: 'Tất cả' }, { value: 'ATTENDING', label: 'Sẽ tham dự' },
  { value: 'MAYBE', label: 'Chưa chắc chắn' }, { value: 'DECLINED', label: 'Không tham dự' },
]
const eventLabel = (response: Rsvp) => response.eventSelections.filter((event) => event.attending).map((event) => event.eventName).join(', ') || 'Tiệc cưới'
const dateTime = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export function RsvpsPageConnected() {
  const workspace = useOptionalWeddingWorkspace()
  if (!workspace) return <RsvpsPage />
  return <RsvpsContent activeWedding={workspace.activeWedding} />
}

function RsvpsContent({ activeWedding }: { activeWedding: { id: string; name: string } | null }) {
  const [responses, setResponses] = useState<Rsvp[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | RsvpAttendance>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const deferredQuery = useDeferredValue(query)

  const load = async () => {
    if (!activeWedding) return
    setLoading(true); setError('')
    try {
      const result = await rsvpApi.list(activeWedding.id, { q: deferredQuery.trim() || undefined, attendance: status === 'all' ? undefined : status })
      setResponses(result.items)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải phản hồi tham dự.') }
    finally { setLoading(false) }
  }
  // The selected wedding and server-side filters define the refresh boundary.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load() }, [activeWedding?.id, deferredQuery, status])

  const summary = useMemo(() => ({
    total: responses.length,
    attending: responses.filter((item) => item.attendance === 'ATTENDING'),
    maybe: responses.filter((item) => item.attendance === 'MAYBE'),
    declined: responses.filter((item) => item.attendance === 'DECLINED'),
  }), [responses])
  const filterCounts = { all: summary.total, ATTENDING: summary.attending.length, MAYBE: summary.maybe.length, DECLINED: summary.declined.length }

  return <section className="rsvp-page" aria-labelledby="rsvp-heading">
    <header className="rsvp-heading"><div><p className="breadcrumb">{activeWedding?.name ?? 'Đám cưới'} <span>/</span> Xác nhận tham dự</p><h1 id="rsvp-heading">Xác nhận tham dự</h1><p>Nắm nhanh số khách sẽ đến và những phản hồi cần bạn xử lý.</p></div></header>
    <div className="rsvp-summary" aria-label="Tổng quan xác nhận tham dự">
      <article><span><UsersThree size={17} /> Tổng phản hồi</span><strong>{summary.total}</strong><small>Đã gửi xác nhận</small></article>
      <article><span><CheckCircle size={17} /> Sẽ tham dự</span><strong>{summary.attending.length}</strong><small>{summary.attending.reduce((sum, item) => sum + item.partySize, 0)} người dự kiến</small></article>
      <article><span><Question size={17} /> Chưa chắc chắn</span><strong>{summary.maybe.length}</strong><small>Cần nhắc phản hồi</small></article>
      <article><span><XCircle size={17} /> Không tham dự</span><strong>{summary.declined.length}</strong><small>Đã gửi lời nhắn</small></article>
    </div>
    <div className="panel rsvp-directory">
      <div className="rsvp-toolbar"><label className="rsvp-search"><span className="sr-only">Tìm theo tên khách</span><MagnifyingGlass size={17} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên khách…" /></label></div>
      <div className="rsvp-filter-row" aria-label="Lọc trạng thái">{statusFilters.map((filter) => <button key={filter.value} className={`filter-chip ${status === filter.value ? 'is-active' : ''}`} type="button" onClick={() => setStatus(filter.value)} aria-pressed={status === filter.value}>{filter.label}<span>{filterCounts[filter.value]}</span></button>)}</div>
      {loading ? <div className="guest-empty"><UsersThree size={28} /><h2>Đang tải phản hồi…</h2></div> : error ? <div className="guest-empty"><XCircle size={28} /><h2>Không thể tải phản hồi</h2><p>{error}</p><button className="button button-secondary" type="button" onClick={() => void load()}>Thử lại</button></div> : responses.length ? <>
        <div className="rsvp-table-wrap"><table className="rsvp-table" aria-label="Danh sách xác nhận tham dự"><thead><tr><th>Khách mời</th><th>Trạng thái / Sự kiện</th><th>Số người</th><th>Ghi chú</th></tr></thead><tbody>{responses.map((response) => <tr key={response.id}><td><strong>{response.guestName}</strong><small>{response.invitationLabel ?? 'Thiệp cưới'}</small></td><td className="rsvp-status-cell"><span className={`guest-status ${response.attendance.toLowerCase()}`}>{statusCopy[response.attendance]}</span><small>{eventLabel(response)}</small></td><td className="rsvp-party-size">{response.partySize}</td><td className="rsvp-note">{response.message || response.specialRequest || <span className="muted-value">Không có ghi chú</span>}<small>{dateTime(response.submittedAt)}</small></td></tr>)}</tbody></table></div>
        <div className="rsvp-mobile-list">{responses.map((response) => <article className="rsvp-card" key={response.id}><div className="rsvp-card-head"><div><strong>{response.guestName}</strong><small>{response.invitationLabel ?? 'Thiệp cưới'}</small></div><span className={`guest-status ${response.attendance.toLowerCase()}`}>{statusCopy[response.attendance]}</span></div><dl><div><dt>Số người</dt><dd>{response.partySize}</dd></div></dl>{(response.message || response.specialRequest) && <p>{response.message || response.specialRequest}</p>}<footer><span>{response.invitationLabel ?? 'Thiệp cưới'}</span><time>{dateTime(response.submittedAt)}</time></footer></article>)}</div>
        <footer className="rsvp-footer"><span>Hiển thị {responses.length} phản hồi</span></footer>
      </> : <div className="guest-empty"><MagnifyingGlass size={28} /><h2>Chưa có phản hồi</h2><p>Các xác nhận tham dự sẽ xuất hiện tại đây.</p></div>}
    </div>
  </section>
}