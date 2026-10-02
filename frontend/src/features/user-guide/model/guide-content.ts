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
  step('topbar', '[data-guide="topbar"]', 'Thanh điều khiển', 'Khi cần tìm nhanh một chức năng, kiểm tra tài khoản hoặc xem lại hướng dẫn, bạn có thể bắt đầu từ đây.'),
  step('sidebar', '[data-guide="sidebar"]', 'Thanh điều hướng', 'Đây là bản đồ chính của Wedding: mỗi nhóm dẫn bạn đến một phần việc khác nhau trong quá trình chuẩn bị.' , 'right'),
  step('sidebar-online', '[data-guide="sidebar-online"]', 'Tạo nơi để chia sẻ câu chuyện', 'Bạn dùng khu vực này để chọn giao diện, viết nội dung và đưa thiệp, website hoặc Recap đến với khách mời.', 'right'),
  step('sidebar-guests', '[data-guide="sidebar-guests"]', 'Biết ai sẽ có mặt trong ngày vui', 'Từ danh sách khách đến RSVP và lời chúc, đây là nơi bạn gom các phản hồi để dễ theo dõi hơn.', 'right'),
  step('sidebar-preparation', '[data-guide="sidebar-preparation"]', 'Biến kế hoạch thành việc có thể làm ngay', 'Lễ & tiệc giữ thông tin ngày cưới, Todolist giúp bạn chia nhỏ việc cần làm, còn Sổ tiền mừng dùng để ghi nhận quà tặng sau này.', 'right'),
  step('sidebar-todos', '[data-guide="sidebar-todos"]', 'Todolist', 'Lập danh sách những việc cần làm cho đám cưới của bạn, theo dõi hạn hoàn thành và đánh dấu từng việc khi đã xong.', 'right'),
  step('sidebar-gift-ledger', '[data-guide="sidebar-gift-ledger"]', 'Sổ tiền mừng để đối chiếu sau ngày cưới', 'Ghi lại tiền, vàng hoặc quà theo từng người; bạn có thể liên kết với khách mời để sau này tra cứu rõ ràng hơn.', 'right'),
  step('sidebar-operations', '[data-guide="sidebar-operations"]', 'Giữ Wedding vận hành gọn gàng', 'Thành viên dành cho người cùng bạn chuẩn bị, Kho ảnh giữ media chung, còn Thống kê và Cài đặt giúp kiểm tra tình trạng tổng thể.', 'right'),
  step('sidebar-members', '[data-guide="sidebar-members"]', 'Thành viên', 'Thêm thành viên cùng quản lý đám cưới của bạn, phân quyền phù hợp và phối hợp chuẩn bị mà không cần dùng chung tài khoản.', 'right'),
  step('dashboard-main', '[data-guide="dashboard-main"]', 'Nơi nhìn nhanh mọi thứ đang tiến triển', 'Khi quay lại mỗi ngày, bạn có thể xem phản hồi mới, số khách đã xác nhận và những thay đổi quan trọng mà không cần mở từng trang.', 'top'),
  step('dashboard-rail', '[data-guide="dashboard-rail"]', 'Nhắc bạn về việc sắp tới', 'Sự kiện kế tiếp và hoạt động mới được đặt ở đây để bạn biết hôm nay cần kiểm tra điều gì trước.', 'left'),
  step('dashboard-quick-links', '[data-guide="dashboard-quick-links"]', 'Lối tắt cho những việc thường làm', 'Nếu chưa biết bắt đầu từ đâu, chọn một trong ba lối tắt này để thêm khách, chỉnh sửa thiệp hoặc đổi giao diện.', 'top'),
]

const dashboardMobileSteps: GuideStep[] = [
  step('mobile-sidebar', '[data-guide="topbar"]', 'Sidebar', 'Thanh điều hướng chính của Wedding. Khi cần chuyển sang thiệp, khách mời hoặc các công cụ chuẩn bị, hãy mở menu này.', 'bottom'),
  step('mobile-menu-icon', '[data-guide="mobile-sidebar-trigger"]', 'Icon menu', 'Chạm vào icon này để mở sidebar và xem đầy đủ các khu vực trong Wedding.', 'bottom'),
  step('mobile-quick-menu', '[data-guide="mobile-quick-menu"]', 'Menu nhanh', 'Nút ở góc dưới phải gom các mục hay dùng như Khách mời, Sổ tiền mừng, Todolist và Thành viên.', 'top-start'),
]

const screenSteps: Record<Exclude<GuideKey, 'started'>, GuideStep[]> = {
  invitation_template: [
    step('template-heading', '[data-guide="invitation-template-heading"]', 'Kho thiệp online', 'Chọn một giao diện phù hợp với phong cách đám cưới của bạn.'),
    step('template-controls', '[data-guide="template-controls"]', 'Tìm và lọc giao diện', 'Tìm theo tên hoặc lọc theo phong cách để chọn nhanh hơn.'),
    step('template-grid', '[data-guide="template-grid"]', 'Xem trước và sử dụng mẫu', 'Bạn có thể xem trước giao diện trước khi áp dụng cho thiệp.', 'top'),
    step('invitation-editor-toolbar', '[data-guide="editor-toolbar"]', 'Thanh công cụ chỉnh sửa', 'Bạn có thể quay lại kho mẫu, đổi thiết bị xem trước, mở bản xem thử, chia sẻ và lưu thiệp tại đây.'),
    step('invitation-editor-quick-edit', '[data-guide="editor-quick-edit"]', 'Sửa nhanh thông tin chính', 'Tên đôi, ngày cưới hoặc thông tin nổi bật có thể được cập nhật nhanh mà không cần mở từng section.'),
    step('invitation-editor-sections', '[data-guide="editor-sections"]', 'Chỉnh từng phần của thiệp', 'Mở một section để thay nội dung, thêm ảnh, bật/tắt phần không cần và sắp xếp lại nhịp đọc của thiệp.', 'right'),
    step('invitation-editor-preview', '[data-guide="editor-preview"]', 'Preview trực tiếp', 'Khu vực này phản ánh thay đổi bạn vừa nhập. Hãy kiểm tra cả bản desktop và mobile trước khi chia sẻ.', 'left'),
    step('invitation-editor-mobile-preview', '[data-guide="editor-mobile-preview"]', 'Preview nổi trên mobile', 'Trên màn hình nhỏ, nút này mở preview thành cửa sổ nổi để bạn vừa chỉnh sửa vừa kiểm tra thiệp.', 'left'),
    step('invitation-editor-actions', '[data-guide="editor-actions"]', 'Lưu và đưa thiệp đến khách mời', 'Lưu khi đã ưng ý; sau đó dùng xem trước, công khai hoặc chia sẻ để gửi đúng phiên bản cho mọi người.', 'bottom'),
  ],
  wedding_template: [
    step('template-heading', '[data-guide="wedding-template-heading"]', 'Kho website cưới', 'Chọn giao diện cho website cưới của bạn.'),
    step('template-controls', '[data-guide="template-controls"]', 'Tìm và lọc giao diện', 'Tìm theo tên hoặc phong cách để khám phá các mẫu phù hợp.'),
    step('template-grid', '[data-guide="template-grid"]', 'Xem trước và sử dụng mẫu', 'Xem trước website rồi áp dụng giao diện bạn yêu thích.', 'top'),
    step('website-editor-toolbar', '[data-guide="editor-toolbar"]', 'Thanh công cụ chỉnh sửa', 'Đổi thiết bị xem trước, mở bản xem thử, chia sẻ và lưu website từ đây.'),
    step('website-editor-sections', '[data-guide="editor-sections"]', 'Xây từng phần của website', 'Mỗi section là một mảnh của câu chuyện: bạn có thể chỉnh nội dung, bật/tắt và sắp xếp thứ tự hiển thị.', 'right'),
    step('website-editor-preview', '[data-guide="editor-preview"]', 'Preview trực tiếp', 'Kiểm tra website ở kích thước desktop và mobile trước khi gửi đường dẫn cho khách.', 'left'),
    step('website-editor-mobile-preview', '[data-guide="editor-mobile-preview"]', 'Preview nổi trên mobile', 'Khi chỉnh sửa trên điện thoại, nút này giúp mở rộng hoặc thu nhỏ cửa sổ xem trước.', 'left'),
    step('website-editor-actions', '[data-guide="editor-actions"]', 'Lưu và chia sẻ website', 'Lưu bản chỉnh sửa trước, sau đó xem thử hoặc công khai khi nội dung đã sẵn sàng.', 'bottom'),
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

export function guideFor(key: GuideKey, isMobile: boolean, pathname = ''): GuideStep[] {
  if (key === 'started') return isMobile ? dashboardMobileSteps : dashboardDesktopSteps

  if (key === 'invitation_template' && pathname === '/studio/invites') {
    return screenSteps[key].filter((item) => item.id.startsWith('invitation-editor-'))
  }
  if (key === 'wedding_template' && (pathname === '/studio/site' || pathname === '/studio/site/edit')) {
    return screenSteps[key].filter((item) => item.id.startsWith('website-editor-'))
  }
  return screenSteps[key].filter((item) => !item.id.includes('editor-'))
}

export function guideKeyForPath(pathname: string): GuideRoute {
  if (pathname === '/studio') return 'started'
  if (pathname === '/studio/invites/themes' || pathname === '/studio/invites') return 'invitation_template'
  if (pathname === '/studio/site/themes' || pathname === '/studio/site' || pathname === '/studio/site/edit') return 'wedding_template'
  if (pathname === '/studio/recap/themes') return 'recap_template'
  if (pathname === '/studio/members') return 'invite_member'
  if (pathname === '/studio/guests') return 'guest'
  return null
}
