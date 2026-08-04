import { useDeferredValue, useMemo, useState } from 'react'
import { CalendarBlank, CalendarCheck, CaretDown, Check, CheckCircle, Clock, MagnifyingGlass, Plus, Sparkle, WarningCircle, X } from '@phosphor-icons/react'
import { initialTodos, priorityLabels, statusLabels, type TodoStatus, type WeddingTodo } from '../model/todo-data'

const filters: Array<{ value: 'all' | TodoStatus; label: string }> = [
  { value: 'all', label: 'Tất cả' }, { value: 'todo', label: 'Cần làm' }, { value: 'inProgress', label: 'Đang làm' }, { value: 'done', label: 'Hoàn thành' },
]

export function TodosPage() {
  const [tasks, setTasks] = useState(initialTodos)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | TodoStatus>('all')
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('vi'))
  const visibleTasks = useMemo(() => tasks.filter((task) => (filter === 'all' || task.status === filter) && (!deferredQuery || `${task.title} ${task.category} ${task.assignee}`.toLocaleLowerCase('vi').includes(deferredQuery))), [deferredQuery, filter, tasks])
  const completed = tasks.filter((task) => task.status === 'done').length
  const progress = Math.round((completed / tasks.length) * 100)

  const changeStatus = (id: string, status: TodoStatus) => setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
  const addTask = () => {
    if (!title.trim()) return
    setTasks((current) => [{ id: `task-${Date.now()}`, title: title.trim(), category: 'Chung', dueLabel: 'Chưa đặt hạn', dueDate: '', assignee: 'Cả hai', initials: 'MĐ', priority: 'medium', status: 'todo' }, ...current])
    setTitle(''); setDialogOpen(false)
  }

  return <div className="todos-page">
    <header className="todos-heading">
      <div><p className="eyebrow">Chuẩn bị <span>/</span> Todolist</p><h1>Todolist</h1><p>Cùng nhau theo dõi những việc quan trọng trước ngày trọng đại.</p></div>
      <button className="button button-primary" type="button" onClick={() => setDialogOpen(true)}><Plus size={18} weight="bold" />Thêm công việc</button>
    </header>

    <section className="todos-overview" aria-label="Tiến độ chuẩn bị"><div className="todos-progress-icon"><CalendarCheck size={22} /></div><div><span>Tiến độ chuẩn bị</span><strong>{progress}% hoàn thành</strong></div><div className="todos-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${progress}% công việc đã hoàn thành`}><span style={{ width: `${progress}%` }} /></div><small>{completed}/{tasks.length} công việc</small></section>

    <div className="todos-layout">
      <section className="panel todos-workspace">
        <div className="todos-toolbar"><label className="todos-search"><span className="sr-only">Tìm công việc</span><MagnifyingGlass size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công việc, danh mục hoặc người phụ trách" /></label><button className="todos-sort" type="button"><CalendarBlank size={17} />Hạn gần nhất<CaretDown size={13} /></button></div>
        <div className="todos-filters" role="tablist" aria-label="Lọc trạng thái công việc">{filters.map((item) => <button key={item.value} role="tab" aria-selected={filter === item.value} className={filter === item.value ? 'is-active' : ''} onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === 'all' ? tasks.length : tasks.filter((task) => task.status === item.value).length}</span></button>)}</div>
        <div className="todo-list">{visibleTasks.length ? visibleTasks.map((task) => <TodoRow key={task.id} task={task} onStatusChange={changeStatus} />) : <div className="todos-empty"><CheckCircle size={29} /><h2>Không có công việc phù hợp</h2><p>Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p><button type="button" onClick={() => { setQuery(''); setFilter('all') }}>Xóa bộ lọc</button></div>}</div>
        <footer className="todos-footer"><span>Hiển thị {visibleTasks.length} trên {tasks.length} công việc</span><span>Dữ liệu mẫu · Chưa đồng bộ API</span></footer>
      </section>

      <aside className="todos-rail">
        <section className="panel todo-status-panel"><header><div><span>Phân bổ công việc</span><strong>{tasks.length} việc</strong></div></header>{(['todo', 'inProgress', 'done'] as TodoStatus[]).map((status) => { const count = tasks.filter((task) => task.status === status).length; return <div className="todo-status-line" key={status}><span className={`todo-status-dot ${status}`} /><span>{statusLabels[status]}</span><strong>{count}</strong><i><b style={{ width: `${(count / tasks.length) * 100}%` }} /></i></div> })}</section>
        <section className="panel todo-template-panel"><header><span><Sparkle size={18} />Checklist gợi ý</span><p>Thêm nhanh các công việc mẫu rồi tùy chỉnh theo kế hoạch của bạn.</p></header><button type="button"><span><strong>30 ngày trước lễ cưới</strong><small>8 công việc · Thiệp, khách, nhà hàng</small></span><Plus size={17} /></button><button type="button"><span><strong>Tuần cuối cùng</strong><small>6 công việc · Xác nhận và kiểm tra</small></span><Plus size={17} /></button><button className="todo-template-more" type="button">Xem tất cả checklist</button></section>
        <div className="todo-tip"><Clock size={18} /><p><strong>Mẹo nhỏ</strong><span>Ưu tiên xử lý công việc quá hạn trước khi thêm checklist mới.</span></p></div>
      </aside>
    </div>

    {isDialogOpen && <div className="todo-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false) }}><div className="todo-dialog" role="dialog" aria-modal="true" aria-labelledby="todo-dialog-title"><header><div><h2 id="todo-dialog-title">Thêm công việc</h2><p>Tạo nhanh một việc mới; chi tiết có thể chỉnh sửa sau.</p></div><button type="button" onClick={() => setDialogOpen(false)} aria-label="Đóng"><X size={18} /></button></header><label htmlFor="todo-title">Tên công việc</label><input id="todo-title" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ví dụ: Gọi xác nhận với nhà hàng" onKeyDown={(event) => { if (event.key === 'Enter') addTask() }} /><div className="todo-dialog-grid"><label>Hạn hoàn thành<input type="date" /></label><label>Mức ưu tiên<select defaultValue="medium"><option value="low">Thấp</option><option value="medium">Trung bình</option><option value="high">Cao</option></select></label></div><footer><button className="button button-secondary" type="button" onClick={() => setDialogOpen(false)}>Hủy</button><button className="button button-primary" type="button" onClick={addTask} disabled={!title.trim()}><Plus size={17} />Thêm công việc</button></footer></div></div>}
  </div>
}

function TodoRow({ task, onStatusChange }: { task: WeddingTodo; onStatusChange: (id: string, status: TodoStatus) => void }) {
  const overdue = task.dueLabel.includes('Quá hạn')
  const nextStatus: TodoStatus = task.status === 'done' ? 'todo' : 'done'
  return <article className={`todo-row ${task.status === 'done' ? 'is-done' : ''}`}><button className="todo-check" type="button" aria-label={task.status === 'done' ? `Đánh dấu ${task.title} là chưa hoàn thành` : `Hoàn thành ${task.title}`} aria-pressed={task.status === 'done'} onClick={() => onStatusChange(task.id, nextStatus)}>{task.status === 'done' ? <Check size={16} weight="bold" /> : null}</button><div className="todo-copy"><strong>{task.title}</strong><span>{task.category}</span></div><span className={`todo-due ${overdue ? 'is-overdue' : ''}`}>{overdue ? <WarningCircle size={15} /> : <CalendarBlank size={15} />}{task.dueLabel}</span><span className={`todo-priority ${task.priority}`}>{priorityLabels[task.priority]}</span><span className="todo-assignee"><i>{task.initials}</i>{task.assignee}</span><label className="todo-status-select"><span className="sr-only">Trạng thái của {task.title}</span><select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value as TodoStatus)}><option value="todo">Cần làm</option><option value="inProgress">Đang làm</option><option value="done">Hoàn thành</option></select><CaretDown size={12} /></label></article>
}
