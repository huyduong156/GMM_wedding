export type TodoStatus = 'todo' | 'inProgress' | 'done'
export type TodoPriority = 'low' | 'medium' | 'high'

export type WeddingTodo = {
  id: string
  title: string
  category: string
  dueLabel: string
  dueDate: string
  assignee: string
  initials: string
  priority: TodoPriority
  status: TodoStatus
}

export const initialTodos: WeddingTodo[] = [
  { id: 'task-01', title: 'Chốt thực đơn tiệc cưới', category: 'Nhà hàng', dueLabel: 'Hôm nay', dueDate: '2026-07-30', assignee: 'Mai', initials: 'M', priority: 'high', status: 'inProgress' },
  { id: 'task-02', title: 'Xác nhận số lượng khách với hai bên gia đình', category: 'Khách mời', dueLabel: 'Ngày mai', dueDate: '2026-07-31', assignee: 'Đức', initials: 'Đ', priority: 'high', status: 'todo' },
  { id: 'task-03', title: 'Gửi thiệp online cho nhóm bạn đại học', category: 'Thiệp cưới', dueLabel: '02/08/2026', dueDate: '2026-08-02', assignee: 'Mai', initials: 'M', priority: 'medium', status: 'todo' },
  { id: 'task-04', title: 'Chọn 30 ảnh cho slideshow', category: 'Hình ảnh', dueLabel: '05/08/2026', dueDate: '2026-08-05', assignee: 'Cả hai', initials: 'MĐ', priority: 'medium', status: 'inProgress' },
  { id: 'task-05', title: 'Đặt lịch thử váy lần cuối', category: 'Trang phục', dueLabel: '28/07/2026 · Quá hạn', dueDate: '2026-07-28', assignee: 'Mai', initials: 'M', priority: 'high', status: 'todo' },
  { id: 'task-06', title: 'Đặt cọc photographer', category: 'Hình ảnh', dueLabel: 'Đã hoàn thành 26/07', dueDate: '2026-07-26', assignee: 'Đức', initials: 'Đ', priority: 'medium', status: 'done' },
]

export const statusLabels: Record<TodoStatus, string> = { todo: 'Cần làm', inProgress: 'Đang làm', done: 'Hoàn thành' }
export const priorityLabels: Record<TodoPriority, string> = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' }
