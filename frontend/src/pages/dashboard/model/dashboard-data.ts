import { Check, Clock, UserCheck, Users } from '@phosphor-icons/react'

export const metrics = [
  { label: 'Khách đã mời', value: '128', detail: '8 nhóm khách', icon: Users },
  { label: 'Đã phản hồi', value: '86', detail: '67,2% tổng lời mời', icon: UserCheck },
  { label: 'Sẽ tham dự', value: '74', detail: 'Thêm 6 người đi cùng', icon: Check },
  { label: 'Chưa phản hồi', value: '42', detail: 'Cần nhắc trước 12/10', icon: Clock },
]

export const activity = [
  { initials: 'HN', name: 'Hà Nguyễn', action: 'đã xác nhận tham dự', time: '8 phút trước', tone: 'pearl' },
  { initials: 'TL', name: 'Tuấn Lê', action: 'đã gửi một lời chúc', time: '24 phút trước', tone: 'sand' },
  { initials: 'MA', name: 'Minh Anh', action: 'tham dự cùng 2 người', time: '1 giờ trước', tone: 'stone' },
  { initials: 'PT', name: 'Phương Trần', action: 'đã cập nhật phản hồi', time: '3 giờ trước', tone: 'clay' },
]

export const trend = [28, 34, 31, 42, 48, 45, 58, 64, 61, 72, 76, 86]
