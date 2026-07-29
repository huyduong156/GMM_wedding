import type { Guest } from '../../../entities/guest/model/guest'

export const guests: Guest[] = [
  { id: 'guest-01', name: 'Nguyễn Minh An', initials: 'NA', group: 'Gia đình', tags: ['Họ nội', 'Nhà trai'], partySize: 2, invitation: 'Đã gửi', attendance: 'attending', table: 'Bàn 03', updatedAt: '2 phút trước' },
  { id: 'guest-02', name: 'Trần Gia Hân', initials: 'TH', group: 'Bạn bè', tags: ['Bạn đại học'], partySize: 1, invitation: 'Đã gửi', attendance: 'pending', table: null, updatedAt: '18 phút trước' },
  { id: 'guest-03', name: 'Lê Quốc Bảo', initials: 'LB', group: 'Đồng nghiệp', tags: ['Công ty hiện tại'], partySize: 2, invitation: 'Đã gửi', attendance: 'attending', table: 'Bàn 12', updatedAt: '1 giờ trước' },
  { id: 'guest-04', name: 'Phạm Khánh Linh', initials: 'PL', group: 'Bạn bè', tags: ['Bạn cấp 3'], partySize: 1, invitation: 'Chưa gửi', attendance: 'pending', table: null, updatedAt: '3 giờ trước' },
  { id: 'guest-05', name: 'Võ Thanh Tú', initials: 'VT', group: 'Gia đình', tags: ['Họ ngoại', 'Nhà gái'], partySize: 3, invitation: 'Đã gửi', attendance: 'declined', table: null, updatedAt: 'Hôm qua' },
  { id: 'guest-06', name: 'Đỗ Nhật Nam', initials: 'ĐN', group: 'Đồng nghiệp', tags: ['Công ty cũ'], partySize: 1, invitation: 'Đã gửi', attendance: 'attending', table: 'Bàn 08', updatedAt: 'Hôm qua' },
  { id: 'guest-07', name: 'Bùi Mai Chi', initials: 'BC', group: 'Bạn bè', tags: ['Bạn đại học', 'Nhóm thân'], partySize: 2, invitation: 'Đã gửi', attendance: 'pending', table: null, updatedAt: '2 ngày trước' },
  { id: 'guest-08', name: 'Hoàng Đức Anh', initials: 'HA', group: 'Gia đình', tags: ['Họ nội', 'Nhà gái'], partySize: 4, invitation: 'Chưa gửi', attendance: 'pending', table: null, updatedAt: '3 ngày trước' },
]

export const guestTags = ['Công ty hiện tại', 'Công ty cũ', 'Công ty trước đây', 'Họ nội', 'Họ ngoại', 'Nhà trai', 'Nhà gái', 'Bạn đại học', 'Bạn cấp 3', 'Nhóm thân']

export const rsvpLabels = {
  attending: 'Có tham dự',
  pending: 'Chưa xác nhận',
  declined: 'Không tham dự',
} as const
