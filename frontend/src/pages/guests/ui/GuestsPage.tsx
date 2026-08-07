import { useDeferredValue, useMemo, useState } from 'react'
import {
  Archive,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Clock,
  Copy,
  DotsThree,
  DownloadSimple,
  MagnifyingGlass,
  Plus,
  UploadSimple,
  UserPlus,
  Users,
  XCircle,
} from '@phosphor-icons/react'
import type { Guest, RsvpStatus } from '../../../entities/guest/model/guest'
import { guestTags, guests, rsvpLabels } from '../model/guest-data'
export { GuestsPageLive as GuestsPage } from './GuestsPageLive'

type Filter = 'all' | RsvpStatus

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'attending', label: 'Có tham dự' },
  { id: 'pending', label: 'Chưa xác nhận' },
  { id: 'declined', label: 'Không tham dự' },
]

const statusIcon = {
  attending: CheckCircle,
  pending: Clock,
  declined: XCircle,
}

function StatusBadge({ status }: { status: RsvpStatus }) {
  const Icon = statusIcon[status]
  return <span className={`guest-status ${status}`}><Icon size={14} weight="fill" />{rsvpLabels[status]}</span>
}

function GuestCheckbox({ guest, selected, onChange }: { guest: Guest; selected: boolean; onChange: () => void }) {
  return <input className="guest-checkbox" type="checkbox" checked={selected} onChange={onChange} aria-label={`Chọn ${guest.name}`} />
}

export function GuestsPageMock() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [filter, setFilter] = useState<Filter>('all')
  const [group, setGroup] = useState('all')
  const [tag, setTag] = useState('all')
  const [selected, setSelected] = useState<string[]>([])

  const filteredGuests = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase('vi')
    return guests.filter((guest) => {
      const matchesSearch = !normalized || guest.name.toLocaleLowerCase('vi').includes(normalized)
      const matchesStatus = filter === 'all' || guest.attendance === filter
      const matchesGroup = group === 'all' || guest.group === group
      const matchesTag = tag === 'all' || guest.tags.includes(tag)
      return matchesSearch && matchesStatus && matchesGroup && matchesTag
    })
  }, [deferredQuery, filter, group, tag])

  const visibleIds = filteredGuests.map((guest) => guest.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id))
  const toggleGuest = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const toggleAll = () => setSelected((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])

  return (
    <section className="guests-page">
      <header className="guests-heading">
        <div>
          <p className="breadcrumb">Đám cưới <span>/</span> Khách mời</p>
          <h1>Quản lý khách mời</h1>
          <p>Theo dõi danh sách, thiệp mời và xác nhận tham dự trong một nơi.</p>
        </div>
        <div className="page-actions">
          <button className="button button-secondary" type="button"><UploadSimple size={17} /> Nhập danh sách</button>
          <button className="button button-primary" type="button"><UserPlus size={17} weight="bold" /> Thêm khách mời</button>
        </div>
      </header>

      <div className="guest-summary" aria-label="Tổng quan khách mời">
        <div><span><Users size={17} /> Tổng khách mời</span><strong>128</strong><small>186 người dự kiến</small></div>
        <div><span><CheckCircle size={17} /> Có tham dự</span><strong>74</strong><small>58% danh sách</small></div>
        <div><span><Clock size={17} /> Chưa xác nhận</span><strong>46</strong><small>Cần xác nhận lại</small></div>
        <div><span><XCircle size={17} /> Không tham dự</span><strong>8</strong><small>Đã xác nhận</small></div>
      </div>

      <div className="guest-directory panel">
        <div className="guest-toolbar">
          <label className="guest-search">
            <MagnifyingGlass size={17} aria-hidden="true" />
            <span className="sr-only">Tìm khách mời</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm nhanh theo tên khách…" />
          </label>
          <label className="guest-group-filter">
            <span>Nhóm</span>
            <select value={group} onChange={(event) => setGroup(event.target.value)}>
              <option value="all">Tất cả nhóm</option>
              <option value="Gia đình">Gia đình</option>
              <option value="Bạn bè">Bạn bè</option>
              <option value="Đồng nghiệp">Đồng nghiệp</option>
            </select>
          </label>
          <label className="guest-group-filter guest-tag-filter">
            <span>Tag</span>
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="all">Tất cả tag</option>
              <optgroup label="Công ty">{guestTags.filter((item) => item.startsWith('Công ty')).map((item) => <option key={item}>{item}</option>)}</optgroup>
              <optgroup label="Họ hàng">{guestTags.filter((item) => ['Họ nội', 'Họ ngoại', 'Nhà trai', 'Nhà gái'].includes(item)).map((item) => <option key={item}>{item}</option>)}</optgroup>
              <optgroup label="Bạn bè">{guestTags.filter((item) => !item.startsWith('Công ty') && !['Họ nội', 'Họ ngoại', 'Nhà trai', 'Nhà gái'].includes(item)).map((item) => <option key={item}>{item}</option>)}</optgroup>
            </select>
          </label>
          <button className="button button-secondary guest-export" type="button"><DownloadSimple size={16} /> Xuất file</button>
        </div>

        <div className="guest-filter-row" aria-label="Lọc trạng thái xác nhận tham dự">
          {filters.map((item) => (
            <button key={item.id} type="button" className={filter === item.id ? 'filter-chip is-active' : 'filter-chip'} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>
              {item.label}<span>{item.id === 'all' ? 128 : item.id === 'attending' ? 74 : item.id === 'pending' ? 46 : 8}</span>
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="guest-bulk-bar" role="region" aria-label="Thao tác hàng loạt">
            <strong>{selected.length} khách đã chọn</strong>
            <div>
              <button type="button"><Copy size={15} /> Tạo link mời</button>
              <button type="button"><Users size={15} /> Chuyển nhóm</button>
              <button type="button" className="danger"><Archive size={15} /> Lưu trữ</button>
              <button type="button" className="bulk-close" onClick={() => setSelected([])}>Bỏ chọn</button>
            </div>
          </div>
        )}

        {filteredGuests.length ? (
          <>
            <div className="guest-table-wrap">
              <table className="guest-table">
                <caption className="sr-only">Danh sách khách mời của đám cưới Mai và Đức</caption>
                <thead><tr>
                  <th><input className="guest-checkbox" type="checkbox" checked={allVisibleSelected} onChange={toggleAll} aria-label="Chọn tất cả khách đang hiển thị" /></th>
                  <th>Khách mời và tag</th><th>Nhóm</th><th>Số người</th><th>Thiệp mời</th><th>Xác nhận tham dự</th><th><span className="sr-only">Thao tác</span></th>
                </tr></thead>
                <tbody>{filteredGuests.map((guest) => <tr key={guest.id} className={selected.includes(guest.id) ? 'is-selected' : ''}>
                  <td><GuestCheckbox guest={guest} selected={selected.includes(guest.id)} onChange={() => toggleGuest(guest.id)} /></td>
                  <td><div className="guest-identity"><span>{guest.initials}</span><div><button type="button">{guest.name}</button><small>{guest.tags.join(' · ')}</small></div></div></td>
                  <td><span className="guest-group-tag">{guest.group}</span></td>
                  <td>{guest.partySize}</td>
                  <td><span className={guest.invitation === 'Đã gửi' ? 'invite-state sent' : 'invite-state'}>{guest.invitation}</span></td>
                  <td><StatusBadge status={guest.attendance} /></td>
                  <td><button className="row-menu" type="button" aria-label={`Mở thao tác cho ${guest.name}`}><DotsThree size={20} weight="bold" /></button></td>
                </tr>)}</tbody>
              </table>
            </div>

            <div className="guest-mobile-list">
              {filteredGuests.map((guest) => <article className={selected.includes(guest.id) ? 'guest-card is-selected' : 'guest-card'} key={guest.id}>
                <div className="guest-card-top"><GuestCheckbox guest={guest} selected={selected.includes(guest.id)} onChange={() => toggleGuest(guest.id)} /><div className="guest-identity"><span>{guest.initials}</span><div><button type="button">{guest.name}</button></div></div><button className="row-menu" type="button" aria-label={`Mở thao tác cho ${guest.name}`}><DotsThree size={20} weight="bold" /></button></div>
                <div className="guest-card-status"><StatusBadge status={guest.attendance} /><span className="guest-group-tag">{guest.group}</span>{guest.tags.slice(0, 1).map((item) => <span className="guest-tag" key={item}>{item}</span>)}</div>
                <dl><div><dt>Số người</dt><dd>{guest.partySize}</dd></div><div><dt>Thiệp mời</dt><dd>{guest.invitation}</dd></div></dl>
              </article>)}
            </div>
          </>
        ) : <div className="guest-empty"><Users size={28} /><h2>Không tìm thấy khách mời</h2><p>Thử đổi từ khóa hoặc bỏ bớt bộ lọc đang áp dụng.</p><button className="button button-secondary" type="button" onClick={() => { setQuery(''); setFilter('all'); setGroup('all'); setTag('all') }}>Xóa bộ lọc</button></div>}

        <footer className="guest-pagination"><span>Đang hiển thị <strong>1–50</strong> trong 128 khách</span><label className="guest-page-size">Số dòng <select defaultValue="50"><option>50</option><option>100</option><option>200</option></select></label><div><button type="button" disabled aria-label="Trang trước"><CaretLeft size={16} /></button><span>Trang <strong>1</strong> / 3</span><button type="button" aria-label="Trang sau"><CaretRight size={16} /></button></div></footer>
      </div>

      <button className="guest-mobile-add" type="button" aria-label="Thêm khách mời"><Plus size={22} weight="bold" /></button>
    </section>
  )
}
