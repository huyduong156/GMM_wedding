import type { TaskPriority } from '../../shared/api/weddings'

export type TodoChecklistPresetTask = {
  title: string
  priority: TaskPriority
}

export type TodoChecklistPreset = {
  key: string
  name: string
  description: string
  tasks: TodoChecklistPresetTask[]
}

export const TODO_CHECKLIST_PRESETS: TodoChecklistPreset[] = [
  {
    key: 'simple',
    name: 'Checklist đơn giản',
    description: 'Những việc nền tảng để bắt đầu chuẩn bị.',
    tasks: [
      { title: 'Chốt ngày cưới và địa điểm', priority: 'HIGH' },
      { title: 'Đặt chụp ảnh và quay phim', priority: 'HIGH' },
      { title: 'Đặt hoa cưới', priority: 'MEDIUM' },
      { title: 'Chuẩn bị lễ gia tiên nhà trai', priority: 'MEDIUM' },
      { title: 'Chuẩn bị lễ gia tiên nhà gái', priority: 'MEDIUM' },
    ],
  },
  {
    key: 'detailed',
    name: 'Checklist chi tiết',
    description: 'Các mốc chuẩn bị phổ biến trước ngày trọng đại.',
    tasks: [
      { title: 'Chốt ngày cưới và địa điểm', priority: 'HIGH' },
      { title: 'Lập ngân sách dự kiến', priority: 'HIGH' },
      { title: 'Lên danh sách khách mời', priority: 'HIGH' },
      { title: 'Đặt chụp ảnh và quay phim', priority: 'HIGH' },
      { title: 'Đặt trang phục cưới', priority: 'MEDIUM' },
      { title: 'Đặt hoa cưới và trang trí', priority: 'MEDIUM' },
      { title: 'Chuẩn bị lễ gia tiên nhà trai', priority: 'MEDIUM' },
      { title: 'Chuẩn bị lễ gia tiên nhà gái', priority: 'MEDIUM' },
      { title: 'Chọn thực đơn tiệc cưới', priority: 'MEDIUM' },
      { title: 'Gửi thiệp và xác nhận khách mời', priority: 'MEDIUM' },
    ],
  },
]
