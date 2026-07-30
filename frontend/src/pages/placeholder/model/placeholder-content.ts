import { ChartLineUp, GearSix, GlobeHemisphereWest, Heart, PaperPlaneTilt, Sparkle, UserList } from '@phosphor-icons/react'

export const content = {
  editor: { title: 'Thiệp của bạn', description: 'Tạo nhiều đường dẫn thiệp riêng cho từng khách hoặc nhóm khách, sau đó theo dõi trạng thái gửi.', icon: PaperPlaneTilt, action: 'Tạo thiệp mới' },
  'wedding-site': { title: 'Website của bạn', description: 'Xây dựng một website chung để kể câu chuyện tình yêu, giới thiệu lịch trình, album và thông tin ngày cưới.', icon: GlobeHemisphereWest, action: 'Thiết lập website' },
  templates: { title: 'Kho giao diện', description: 'Khám phá và xem thử các giao diện phù hợp với phong cách của bạn.', icon: Sparkle, action: 'Khám phá giao diện' },
  guests: { title: 'Khách mời', description: 'Quản lý danh sách khách, nhóm khách và các đường dẫn mời riêng.', icon: UserList, action: 'Thêm khách mời' },
  rsvps: { title: 'Xác nhận tham dự', description: 'Theo dõi phản hồi và số người tham dự cho từng sự kiện.', icon: UserList, action: 'Xem phản hồi' },
  wishes: { title: 'Lời chúc', description: 'Duyệt, ghim và quản lý những lời nhắn gửi tới cặp đôi.', icon: Heart, action: 'Duyệt lời chúc' },
  analytics: { title: 'Thống kê', description: 'Hiểu lượt xem, nguồn truy cập và xu hướng phản hồi của khách.', icon: ChartLineUp, action: 'Xem báo cáo' },
  settings: { title: 'Cài đặt', description: 'Quản lý đường dẫn, quyền riêng tư, thành viên và thông báo.', icon: GearSix, action: 'Mở cài đặt' },
} as const
