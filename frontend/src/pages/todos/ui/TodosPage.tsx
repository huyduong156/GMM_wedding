import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { CalendarBlank, CalendarCheck, CaretDown, Check, CheckCircle, ListChecks, MagnifyingGlass, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { taskApi, WeddingApiError, type TaskPriority, type TaskStatus, type WeddingTask } from '../../../shared/api/weddings'
import { TODO_CHECKLIST_PRESETS, type TodoChecklistPreset } from '../checklist-presets'

const statusLabels: Record<TaskStatus, string> = { TODO: 'Cần làm', IN_PROGRESS: 'Đang làm', DONE: 'Hoàn thành', CANCELLED: 'Đã hủy' }
const priorityLabels: Record<TaskPriority, string> = { LOW: 'Thấp', MEDIUM: 'Trung bình', HIGH: 'Cao', URGENT: 'Khẩn cấp' }
const toLabel = (date: string | null) => date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa đặt hạn'
const priorityRank = (value: TaskPriority) => ({ LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 })[value]

const showError = (text: string) => Swal.fire({ icon: 'error', title: 'Không thể thực hiện', text, confirmButtonText: 'Đã hiểu' })
const showSuccess = (title: string) => Swal.fire({ icon: 'success', title, timer: 1400, timerProgressBar: true, showConfirmButton: false })

export function TodosPage() {
  const workspace = useOptionalWeddingWorkspace()
  const weddingId = workspace?.activeWedding?.id
  const [tasks, setTasks] = useState<WeddingTask[]>([])
  const templates = TODO_CHECKLIST_PRESETS
  const [previewPreset, setPreviewPreset] = useState<TodoChecklistPreset | null>(null)
  const [loading, setLoading] = useState(Boolean(weddingId))

  const [query, setQuery] = useState(''), [filter, setFilter] = useState<'all' | TaskStatus>('all')
  const [sort, setSort] = useState<'due' | 'priority'>('due')
  const [open, setOpen] = useState(false), [editing, setEditing] = useState<WeddingTask | null>(null), [templatesOpen, setTemplatesOpen] = useState(false), [saving, setSaving] = useState(false), [applyingTemplateKey, setApplyingTemplateKey] = useState<string | null>(null)
    const [title, setTitle] = useState(''), [dueAt, setDueAt] = useState(''), [priority, setPriority] = useState<TaskPriority>('MEDIUM'), [parentTaskId, setParentTaskId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('vi'))

  const load = useCallback(async () => {
    if (!weddingId) { setLoading(false); setTasks([]); return }
    setLoading(true)
    try {
      const taskResult = await taskApi.list(weddingId)
      setTasks(taskResult.items)
    } catch (cause) {
      await showError(cause instanceof Error ? cause.message : 'Không thể tải danh sách công việc.')
    } finally {
      setLoading(false)
    }
  }, [weddingId])
  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!templatesOpen) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setTemplatesOpen(false) }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [templatesOpen])

  const visibleTasks = useMemo(() => [...tasks.filter((task: WeddingTask) => (filter === 'all' || task.status === filter) && (!deferredQuery || `${task.title} ${task.description ?? ''} ${task.event?.name ?? ''}`.toLocaleLowerCase('vi').includes(deferredQuery))).sort((a: WeddingTask, b: WeddingTask) => sort === 'priority' ? priorityRank(b.priority) - priorityRank(a.priority) : (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'))], [tasks, filter, deferredQuery, sort])
  const orderedTasks = useMemo(() => { const roots = visibleTasks.filter((task) => !task.parentTaskId); return roots.flatMap((root) => [root, ...visibleTasks.filter((task) => task.parentTaskId === root.id)]) }, [visibleTasks])
  const completed = tasks.filter((task) => task.status === 'DONE').length
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0

  async function updateStatus(task: WeddingTask, status: TaskStatus) {
    if (!weddingId) return
    try {
      const result = await taskApi.update(weddingId, task.id, { status, revision: task.revision })
      setTasks((items) => items.map((item) => item.id === result.task.id ? result.task : item))
    } catch (cause) {
      await showError(cause instanceof WeddingApiError && cause.status === 409 ? 'Công việc vừa thay đổi ở nơi khác. Danh sách đã được tải lại.' : cause instanceof Error ? cause.message : 'Không thể cập nhật trạng thái.')
      if (cause instanceof WeddingApiError && cause.status === 409) void load()
    }
  }
  function show(task?: WeddingTask) { setTemplatesOpen(false); setEditing(task ?? null); setTitle(task?.title ?? ''); setDueAt(task?.dueAt ? task.dueAt.slice(0, 10) : ''); setPriority(task?.priority ?? 'MEDIUM'); setParentTaskId(task?.parentTaskId ?? null); setOpen(true) }
  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!weddingId || !title.trim() || saving) return
    setSaving(true)
    try {
      const input = { title: title.trim(), priority, parentTaskId, ...(dueAt ? { dueAt: new Date(dueAt + 'T23:59:00').toISOString() } : {}) }
      const result = editing
        ? await taskApi.update(weddingId, editing.id, { ...input, revision: editing.revision })
        : await taskApi.create(weddingId, input)
      setTasks((items) => editing ? items.map((item) => item.id === result.task.id ? result.task : item) : [result.task, ...items])
      setOpen(false)
      await showSuccess(editing ? 'Đã cập nhật công việc' : 'Đã thêm công việc')
    } catch (cause) {
      await showError(cause instanceof Error ? cause.message : 'Không thể lưu công việc.')
    } finally {
      setSaving(false)
    }
  }
  async function remove(task: WeddingTask) {
    if (!weddingId) return
    const confirmation = await Swal.fire({ icon: 'warning', title: 'Xóa công việc?', text: 'Công việc ' + task.title + ' sẽ bị xóa.', showCancelButton: true, confirmButtonText: 'Xóa công việc', cancelButtonText: 'Hủy', confirmButtonColor: '#a43d34' })
    if (!confirmation.isConfirmed) return
    try {
      await taskApi.remove(weddingId, task.id)
      setTasks((items) => items.filter((item) => item.id !== task.id))
      await showSuccess('Đã xóa công việc')
    } catch (cause) {
      await showError(cause instanceof Error ? cause.message : 'Không thể xóa công việc.')
    }
  }

  async function applyTemplate(template: TodoChecklistPreset) {
    if (!weddingId || applyingTemplateKey) return
    const confirmation = await Swal.fire({ icon: 'warning', title: 'Thêm checklist?', text: template.tasks.length + ' công việc từ “' + template.name + '” sẽ được thêm vào Todolist.', showCancelButton: true, confirmButtonText: 'Thêm checklist', cancelButtonText: 'Hủy' })
    if (!confirmation.isConfirmed) return
    setApplyingTemplateKey(template.key)
    try {
      const result = await taskApi.bulkCreate(weddingId, { tasks: template.tasks })
      setTasks((items) => [...items, ...result.items])
      setTemplatesOpen(false)
      await showSuccess('Đã thêm checklist')
    } catch (cause) {
      await showError(cause instanceof Error ? cause.message : 'Không thể thêm checklist.')
    } finally {
      setApplyingTemplateKey(null)
    }
  }

  return <div className="todos-page">
    <header className="todos-heading">
      <div><p className="eyebrow">Chuẩn bị <span>/</span> Todolist</p><h1>Todolist</h1><p>Cùng nhau theo dõi những việc quan trọng trước ngày trọng đại.</p></div>
      <div className="todos-heading-actions">
        <div className="todo-template-trigger">
          <button className="button button-secondary" type="button" aria-expanded={templatesOpen} aria-controls="todo-template-popover" onClick={() => setTemplatesOpen((value) => !value)}><ListChecks size={18} />Checklist gợi ý</button>
          {templatesOpen ? <div className="todo-template-popover" id="todo-template-popover" role="region" aria-label="Checklist gợi ý">
            <header><div><strong>Checklist gợi ý</strong><span>Chọn một mẫu để thêm nhanh</span></div><button type="button" aria-label="Đóng checklist gợi ý" onClick={() => setTemplatesOpen(false)}><X size={17} /></button></header>
            {templates.length ? templates.slice(0, 3).map((template) => <button className="todo-template-option" type="button" key={template.key} disabled={applyingTemplateKey !== null} aria-busy={applyingTemplateKey === template.key} onClick={() => setPreviewPreset(template)}><span><strong>{template.name}</strong><small>{template.description}</small></span><b>{template.tasks.length}</b><Plus size={17} /></button>) : <p className="todo-template-empty">Chưa có checklist gợi ý.</p>}
          </div> : null}
        </div>
        <button className="button button-primary" type="button" onClick={() => show()}><Plus size={18} />Thêm công việc</button>
      </div>
    </header>
    <section className="todos-overview" aria-label="Tiến độ chuẩn bị"><div className="todos-progress-icon"><CalendarCheck size={22} /></div><div><span>Tiến độ chuẩn bị</span><strong>{progress}% hoàn thành</strong></div><div className="todos-progress-track" role="progressbar" aria-label={`${progress}% công việc đã hoàn thành`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div><small>{completed}/{tasks.length} công việc</small></section>
    <div className="todos-layout"><section className="panel todos-workspace"><div className="todos-toolbar"><label className="todos-search"><span className="sr-only">Tìm công việc</span><MagnifyingGlass size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công việc hoặc sự kiện" /></label><button className="todos-sort" type="button" onClick={() => setSort(sort === 'due' ? 'priority' : 'due')}><CalendarBlank size={17} />{sort === 'due' ? 'Hạn gần nhất' : 'Ưu tiên cao'}<CaretDown size={13} /></button></div><div className="todos-filters" role="tablist" aria-label="Lọc trạng thái công việc">{(['all', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((value) => <button key={value} role="tab" aria-selected={filter === value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>{value === 'all' ? 'Tất cả' : statusLabels[value]}<span>{value === 'all' ? tasks.length : tasks.filter((task) => task.status === value).length}</span></button>)}</div><div className="todo-list">{loading ? <div className="workspace-skeleton" role="status" aria-label="Đang tải công việc"><i /><i /><i /></div> : visibleTasks.length ? orderedTasks.map((task) => <article className={`todo-row ${task.status === 'DONE' ? 'is-done' : ''}`} data-parent-task={task.parentTaskId ?? undefined} key={task.id}><button className="todo-check" type="button" aria-label={task.status === 'DONE' ? `Đánh dấu ${task.title} là chưa hoàn thành` : `Hoàn thành ${task.title}`} aria-pressed={task.status === 'DONE'} onClick={() => void updateStatus(task, task.status === 'DONE' ? 'TODO' : 'DONE')}>{task.status === 'DONE' ? <Check size={16} /> : null}</button><div className="todo-copy" style={{ paddingLeft: task.parentTaskId ? 18 : 0 }}><strong>{task.parentTaskId ? "↳ " : ""}{task.title}</strong></div><span className={`todo-priority ${task.priority.toLowerCase()}`}>{priorityLabels[task.priority]}</span><div className="todo-meta-row"><span className="todo-due"><CalendarBlank size={15} />{toLabel(task.dueAt)}</span><label className="todo-status-select"><span className="sr-only">Trạng thái của {task.title}</span><select value={task.status} onChange={(event) => void updateStatus(task, event.target.value as TaskStatus)}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><CaretDown size={12} /></label><button type="button" aria-label={`Sửa ${task.title}`} onClick={() => show(task)}><PencilSimple size={15} /><span className="todo-action-label">Sửa</span></button><button type="button" aria-label={`Xóa ${task.title}`} onClick={() => void remove(task)}><Trash size={15} /><span className="todo-action-label">Xóa</span></button></div></article>) : <div className="todos-empty"><CheckCircle size={29} /><h2>{weddingId ? 'Không có công việc phù hợp' : 'Chưa có wedding đang chọn'}</h2><p>Thử đổi bộ lọc hoặc thêm công việc mới.</p></div>}</div><footer className="todos-footer"><span>Hiển thị {visibleTasks.length} trên {tasks.length} công việc</span><span>Đã đồng bộ API</span></footer></section></div>
    {previewPreset ? <div className="todo-dialog-backdrop" role="presentation" onMouseDown={() => setPreviewPreset(null)}><section className="todo-dialog todo-checklist-preview" role="dialog" aria-modal="true" aria-labelledby="todo-checklist-preview-title" onMouseDown={(event) => event.stopPropagation()}><header><div><h2 id="todo-checklist-preview-title">{previewPreset.name}</h2><p>{previewPreset.description}</p></div><button type="button" aria-label="Đóng xem trước checklist" onClick={() => setPreviewPreset(null)}><X size={18} /></button></header><div className="todo-checklist-preview-list">{previewPreset.tasks.map((item) => <div className="todo-checklist-preview-item" key={item.title}><CheckCircle size={18} /><span>{item.title}</span><small>{priorityLabels[item.priority]}</small></div>)}</div><footer><button type="button" className="button button-secondary" onClick={() => setPreviewPreset(null)}>Đóng</button><button type="button" className="button button-primary" disabled={applyingTemplateKey !== null} onClick={() => { setPreviewPreset(null); void applyTemplate(previewPreset) }}>{applyingTemplateKey ? 'Đang thêm…' : 'Áp dụng checklist'}</button></footer></section></div> : null}    {open ? <div className="todo-dialog-backdrop" role="presentation"><form className="todo-dialog" role="dialog" aria-modal="true" aria-labelledby="todo-dialog-title" onSubmit={save}><header><h2 id="todo-dialog-title">{editing ? 'Chỉnh sửa công việc' : 'Thêm công việc'}</h2><button type="button" aria-label="Đóng" onClick={() => setOpen(false)}><X size={18} /></button></header><label>Tên công việc<input required name="title" autoComplete="off" value={title} onChange={(event) => setTitle(event.target.value)} /></label><div className="todo-dialog-grid todo-dialog-meta"><label>Hạn hoàn thành<input type="date" name="dueAt" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label><label>Mức ưu tiên<select name="priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{Object.entries(priorityLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Công việc cha<select name="parentTaskId" value={parentTaskId ?? ""} onChange={(event) => setParentTaskId(event.target.value || null)}><option value="">Không có — công việc chính</option>{tasks.filter((task) => !task.parentTaskId && task.id !== editing?.id).map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select><small>Chỉ hỗ trợ task con tối đa 1 cấp.</small></label></div><footer><button type="button" className="button button-secondary" onClick={() => setOpen(false)}>Hủy</button><button type="submit" className="button button-primary" disabled={!weddingId || saving}>{saving ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Thêm công việc'}</button></footer></form></div> : null}
  </div>
}
