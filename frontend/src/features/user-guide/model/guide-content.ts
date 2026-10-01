import type { Step } from 'react-joyride'
import type { GuideKey } from './guide-storage'

export type GuideRoute = GuideKey | null
type GuideStep = Step & { id: string }

const step = (
  id: string,
  target: string,
  title: string,
  content: string,
  placement: Step['placement'] = 'bottom',
): GuideStep => ({ id, target, title, content, placement })

const dashboardDesktopSteps: GuideStep[] = [
  step('topbar', '[data-guide="topbar"]', 'Thanh điều khiển', 'Tìm kiếm, xem thông báo, mở hồ sơ và truy cập trợ giúp từ khu vực này.'),
  step('sidebar', '[data-guide="sidebar"]', 'Thanh điều hướng', 'Từ đây bạn có thể đi đến thiệp, website, khách mời và các công cụ chuẩn bị đám cưới.', 'right'),
  step('dashboard-main', '[data-guide="dashboard-main"]', 'Tổng quan Wedding', 'Đây là nơi theo dõi tiến độ, phản hồi và các chỉ số chính của Wedding.', 'top'),
  step('dashboard-rail', '[data-guide="dashboard-rail"]', 'Thông tin bên phải', 'Khu vực này hiển thị sự kiện sắp tới và các hoạt động mới nhất.', 'left'),
]

const dashboardMobileSteps: GuideStep[] = [
  step('mobile-topbar', '[data-guide="topbar"]', 'Thanh điều khiển', 'Tại đây bạn có thể tìm kiếm, xem hồ sơ và mở các thao tác nhanh.'),
  step('mobile-sidebar', '[data-guide="mobile-sidebar-trigger"]', 'Menu chính', 'Chạm vào nút này để mở toàn bộ menu điều hướng.'),
  step('mobile-quick-menu', '[data-guide="mobile-quick-menu"]', 'Menu nhanh', 'Menu góc dưới phải giúp truy cập nhanh các chức năng thường dùng.', 'top-start'),
  step('mobile-dashboard-main', '[data-guide="dashboard-main"]', 'Tổng quan Wedding', 'Theo dõi tiến độ và các thông tin quan trọng ngay trên màn hình này.', 'top'),
]

const screenSteps: Record<Exclude<GuideKey, 'started'>, GuideStep[]> = {
  invitation_template: [
    step('template-heading', '[data-guide="invitation-template-heading"]', 'Kho thiệp online', 'Chọn một giao diện phù hợp với phong cách đám cưới của bạn.'),
    step('template-controls', '[data-guide="template-controls"]', 'Tìm và lọc giao diện', 'Tìm theo tên hoặc lọc theo phong cách để chọn nhanh hơn.'),
    step('template-grid', '[data-guide="template-grid"]', 'Xem trước và sử dụng mẫu', 'Bạn có thể xem trước giao diện trước khi áp dụng cho thiệp.', 'top'),
    step('invitation-editor-toolbar', '[data-guide="editor-toolbar"]', 'Thanh công cụ chỉnh sửa', 'Lưu, xem trước, đổi thiết bị và xuất bản thiệp từ khu vực này.'),
    step('invitation-editor-sections', '[data-guide="editor-sections"]', 'Nội dung thiệp', 'Mở từng section để chỉnh sửa nội dung, hình ảnh và thứ tự hiển thị.', 'right'),
    step('invitation-editor-preview', '[data-guide="editor-preview"]', 'Preview trực tiếp', 'Preview cập nhật theo nội dung bạn đang chỉnh sửa. Trên mobile, khu vực này sẽ thu gọn thành cửa sổ nổi.', 'left'),
  ],
  wedding_template: [
    step('template-heading', '[data-guide="wedding-template-heading"]', 'Kho website cưới', 'Chọn giao diện cho website cưới của bạn.'),
    step('template-controls', '[data-guide="template-controls"]', 'Tìm và lọc giao diện', 'Tìm theo tên hoặc phong cách để khám phá các mẫu phù hợp.'),
    step('template-grid', '[data-guide="template-grid"]', 'Xem trước và sử dụng mẫu', 'Xem trước website rồi áp dụng giao diện bạn yêu thích.', 'top'),
    step('website-editor-toolbar', '[data-guide="editor-toolbar"]', 'Thanh công cụ chỉnh sửa', 'Lưu, xem trước và xuất bản website từ khu vực này.'),
    step('website-editor-sections', '[data-guide="editor-sections"]', 'Các section website', 'Chọn từng section để chỉnh sửa nội dung và cách hiển thị.', 'right'),
    step('website-editor-preview', '[data-guide="editor-preview"]', 'Preview trực tiếp', 'Kiểm tra website trên canvas preview trước khi chia sẻ.', 'left'),
  ],
  recap_template: [
    step('recap-heading', '[data-guide="recap-template-heading"]', 'Kho giao diện Recap', 'Chọn cách kể lại những khoảnh khắc đáng nhớ của đám cưới.'),
    step('recap-grid', '[data-guide="recap-template-grid"]', 'Khám phá các mẫu Recap', 'Mở preview để xem bố cục và không khí của từng giao diện.', 'top'),
  ],
  invite_member: [
    step('member-heading', '[data-guide="member-heading"]', 'Thành viên Wedding', 'Mời người thân hoặc cộng sự cùng vận hành Wedding.'),
    step('member-content', '[data-guide="member-content"]', 'Quản lý quyền truy cập', 'Theo dõi các lời mời và quyền truy cập của từng thành viên.', 'top'),
  ],
  guest: [
    step('guest-heading', '[data-guide="guest-heading"]', 'Khách mời', 'Quản lý danh sách khách và thông tin lời mời trong một nơi.'),
    step('guest-actions', '[data-guide="guest-actions"]', 'Thêm và thao tác với khách', 'Thêm khách mới, tìm kiếm, lọc và thực hiện các thao tác nhanh.'),
    step('guest-directory', '[data-guide="guest-directory"]', 'Danh sách khách', 'Theo dõi nhóm khách và trạng thái xác nhận tham dự.', 'top'),
  ],
}

export function guideFor(key: GuideKey, isMobile: boolean): GuideStep[] {
  return key === 'started' ? (isMobile ? dashboardMobileSteps : dashboardDesktopSteps) : screenSteps[key]
}

export function guideKeyForPath(pathname: string): GuideRoute {
  if (pathname === '/studio') return 'started'
  if (pathname === '/studio/invites/themes' || pathname === '/studio/invites') return 'invitation_template'
  if (pathname === '/studio/site/themes' || pathname === '/studio/site' || pathname === '/studio/site/edit') return 'wedding_template'
  if (pathname === '/studio/recap/themes' || pathname === '/studio/recap') return 'recap_template'
  if (pathname === '/studio/members') return 'invite_member'
  if (pathname === '/studio/guests') return 'guest'
  return null
}
