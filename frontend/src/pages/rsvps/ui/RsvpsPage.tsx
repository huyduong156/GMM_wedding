import { useDeferredValue, useMemo, useState } from 'react'
import {
  CalendarDots,
  CheckCircle,
  DownloadSimple,
  MagnifyingGlass,
  Question,
  UsersThree,
  XCircle,
} from '@phosphor-icons/react'

type RsvpStatus = 'attending' | 'pending' | 'declined'

type Rsvp = {
  id: number
  name: string
  group: string
  status: RsvpStatus
  partySize: number
  events: string[]
  note: string
  respondedAt: string
  source: string
}

const responses: Rsvp[] = [
  { id: 1, name: 'Nguyễn Hoàng Nam', group: 'Bạn chú rể', status: 'attending', partySize: 2, events: ['Lễ cưới', 'Tiệc cưới'], note: 'Mình sẽ đến đúng giờ nhé!', respondedAt: '29/07, 20:14', source: 'Thiệp cá nhân' },
  { id: 2, name: 'Trần Thu Hà', group: 'Đồng nghiệp cô dâu', status: 'pending', partySize: 1, events: ['Tiệc cưới'], note: 'Mình sẽ xác nhận lại trước cuối tuần.', respondedAt: '29/07, 18:02', source: 'Website cưới' },
  { id: 3, name: 'Lê Minh Anh', group: 'Họ nhà gái', status: 'attending', partySize: 3, events: ['Lễ gia tiên', 'Tiệc cưới'], note: 'Có một bé 5 tuổi đi cùng.', respondedAt: '28/07, 21:40', source: 'Thiệp cá nhân' },
  { id: 4, name: 'Phạm Quốc Bảo', group: 'Bạn đại học', status: 'declined', partySize: 0, events: [], note: 'Tiếc quá, mình đang công tác xa.', respondedAt: '28/07, 16:18', source: 'Thiệp cá nhân' },
  { id: 5, name: 'Vũ Ngọc Lan', group: 'Họ nhà trai', status: 'attending', partySize: 2, events: ['Lễ cưới', 'Tiệc cưới'], note: '', respondedAt: '27/07, 09:32', source: 'Chủ tiệc cập nhật' },
  { id: 6, name: 'Đỗ Thanh Tùng', group: 'Đồng nghiệp chú rể', status: 'pending', partySize: 2, events: ['Tiệc cưới'], note: 'Có thể mình sẽ đi cùng vợ.', respondedAt: '26/07, 22:05', source: 'Website cưới' },
]

const statusCopy = {
  attending: 'Sẽ tham dự',
  pending: 'Chưa chắc chắn',
  declined: 'Không tham dự',
}

export function RsvpsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | RsvpStatus>('all')
  const deferredQuery = useDeferredValue(query)

  const filteredResponses = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('vi')
    return responses.filter((response) => {
      const matchesSearch = !normalizedQuery || `${response.name} ${response.group}`.toLocaleLowerCase('vi').includes(normalizedQuery)
      return matchesSearch && (status === 'all' || response.status === status)
    })
  }, [deferredQuery, status])

  return (
    <section className="rsvp-page" aria-labelledby="rsvp-heading">
      <header className="rsvp-heading">
        <div>
          <p className="breadcrumb">Mai & Đức <span>/</span> Xác nhận tham dự</p>
          <h1 id="rsvp-heading">Xác nhận tham dự</h1>
          <p>Nắm nhanh số khách sẽ đến và những phản hồi cần bạn xử lý.</p>
        </div>
        <button className="button button-primary" type="button"><DownloadSimple size={17} /> Xuất danh sách</button>
      </header>

      <div className="rsvp-summary" aria-label="Tổng quan xác nhận tham dự">
        <article><span><UsersThree size={17} /> Tổng phản hồi</span><strong>86</strong><small>trên 120 khách mời</small></article>
        <article><span><CheckCircle size={17} /> Sẽ tham dự</span><strong>64</strong><small>ước tính 92 người</small></article>
        <article><span><Question size={17} /> Chưa chắc chắn</span><strong>12</strong><small>cần nhắc phản hồi</small></article>
        <article><span><XCircle size={17} /> Không tham dự</span><strong>10</strong><small>đã gửi lời nhắn</small></article>
      </div>

      <div className="panel rsvp-directory">
        <div className="rsvp-toolbar">
          <label className="rsvp-search">
            <span className="sr-only">Tìm theo tên hoặc nhóm khách</span>
            <MagnifyingGlass size={17} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc nhóm khách" />
          </label>
          <div className="rsvp-event-filter"><CalendarDots size={17} /><label htmlFor="rsvp-event">Sự kiện</label><select id="rsvp-event" defaultValue="all"><option value="all">Tất cả</option><option>Tiệc cưới</option><option>Lễ cưới</option><option>Lễ gia tiên</option></select></div>
        </div>
        <div className="rsvp-filter-row" aria-label="Lọc trạng thái">
          {([['all', 'Tất cả', 86], ['attending', 'Sẽ tham dự', 64], ['pending', 'Chưa chắc chắn', 12], ['declined', 'Không tham dự', 10]] as const).map(([value, label, count]) => (
            <button key={value} className={`filter-chip ${status === value ? 'is-active' : ''}`} type="button" onClick={() => setStatus(value)} aria-pressed={status === value}>{label}<span>{count}</span></button>
          ))}
        </div>

        {filteredResponses.length ? <>
          <div className="rsvp-table-wrap">
            <table className="rsvp-table" aria-label="Danh sách xác nhận tham dự">
              <thead><tr><th>Khách mời</th><th>Trạng thái</th><th>Số người</th><th>Sự kiện</th><th>Ghi chú</th><th>Phản hồi lúc</th><th>Nguồn</th></tr></thead>
              <tbody>{filteredResponses.map((response) => <tr key={response.id}>
                <td><strong>{response.name}</strong><small>{response.group}</small></td>
                <td><span className={`guest-status ${response.status}`}>{statusCopy[response.status]}</span></td>
                <td className="rsvp-party-size">{response.partySize || '0'}</td>
                <td><div className="rsvp-events">{response.events.length ? response.events.map((event) => <span key={event}>{event}</span>) : <span className="muted-value">Không chọn</span>}</div></td>
                <td className="rsvp-note">{response.note || <span className="muted-value">Không có ghi chú</span>}</td>
                <td className="updated-at">{response.respondedAt}</td>
                <td><span className="rsvp-source">{response.source}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="rsvp-mobile-list">{filteredResponses.map((response) => <article className="rsvp-card" key={response.id}>
            <div className="rsvp-card-head"><div><strong>{response.name}</strong><small>{response.group}</small></div><span className={`guest-status ${response.status}`}>{statusCopy[response.status]}</span></div>
            <dl><div><dt>Số người</dt><dd>{response.partySize}</dd></div><div><dt>Sự kiện</dt><dd>{response.events.join(', ') || 'Không chọn'}</dd></div></dl>
            {response.note ? <p>{response.note}</p> : null}<footer><span>{response.source}</span><time>{response.respondedAt}</time></footer>
          </article>)}</div>
          <footer className="rsvp-footer"><span>Hiển thị {filteredResponses.length} phản hồi mẫu</span><span>Dữ liệu cập nhật gần nhất lúc 20:14</span></footer>
        </> : <div className="guest-empty"><MagnifyingGlass size={28} /><h2>Không tìm thấy phản hồi</h2><p>Thử đổi từ khóa hoặc chọn trạng thái khác.</p><button className="button button-secondary" type="button" onClick={() => { setQuery(''); setStatus('all') }}>Xóa bộ lọc</button></div>}
      </div>
    </section>
  )
}
