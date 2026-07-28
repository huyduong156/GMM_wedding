import { ArrowRight, ChartLineUp, GearSix, Heart, Palette, Sparkle, UserList } from '@phosphor-icons/react'

const content = {
  editor: { title: 'Thiết kế thiệp', description: 'Chỉnh nội dung, bố cục và xem trước thiệp trên nhiều kích thước màn hình.', icon: Palette, action: 'Bắt đầu chỉnh sửa' },
  templates: { title: 'Kho giao diện', description: 'Khám phá và xem thử các giao diện phù hợp với phong cách của bạn.', icon: Sparkle, action: 'Khám phá giao diện' },
  guests: { title: 'Khách mời', description: 'Quản lý danh sách khách, nhóm khách và các đường dẫn mời riêng.', icon: UserList, action: 'Thêm khách mời' },
  rsvps: { title: 'Xác nhận tham dự', description: 'Theo dõi phản hồi và số người tham dự cho từng sự kiện.', icon: UserList, action: 'Xem phản hồi' },
  wishes: { title: 'Lời chúc', description: 'Duyệt, ghim và quản lý những lời nhắn gửi tới cặp đôi.', icon: Heart, action: 'Duyệt lời chúc' },
  analytics: { title: 'Thống kê', description: 'Hiểu lượt xem, nguồn truy cập và xu hướng phản hồi của khách.', icon: ChartLineUp, action: 'Xem báo cáo' },
  settings: { title: 'Cài đặt', description: 'Quản lý đường dẫn, quyền riêng tư, thành viên và thông báo.', icon: GearSix, action: 'Mở cài đặt' },
} as const

export function PlaceholderPage({ section }: { section: keyof typeof content }) {
  const item = content[section]
  const Icon = item.icon
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon"><Icon size={26} /></div>
      <p className="breadcrumb">Mai & Đức <span>/</span> {item.title}</p>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <button className="button button-primary">{item.action} <ArrowRight size={17} /></button>
      <div className="placeholder-note"><strong>Đang chuẩn bị</strong><span>Module này đã có route và sẽ được triển khai ở milestone kế tiếp.</span></div>
    </div>
  )
}
