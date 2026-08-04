import { fireEvent, render, screen } from '@testing-library/react'
import { App } from './App'
import { NavigationProvider } from './providers/navigation/NavigationProvider'

describe('Owner Workspace', () => {
  it('renders the public home page with working product links', () => {
    window.history.replaceState(null, '', '/')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('status', { name: 'Đang mở không gian GMM Wedding' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ngày trọng đại bắt đầu từ một lời mời đẹp.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Bắt đầu khám phá/i })).toHaveAttribute('href', '#home-overview')
    expect(screen.getByRole('heading', { name: 'Chuẩn bị ngày cưới, nhẹ nhàng hơn.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Bắt đầu tạo/i })).toHaveAttribute('href', '/studio/invites/themes')
    expect(screen.getByRole('link', { name: 'Xem thiệp mẫu' })).toHaveAttribute('href', '/templates/invitations/modern-luxe/preview')
    expect(screen.getByRole('heading', { name: 'Chọn một lời mở đầu thật đẹp' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dễ dàng cho cả hai bạn và khách mời' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mẫu thiệp tiếp theo' })).toBeInTheDocument()
  })

  it('renders the dashboard and primary navigation', () => {
    window.history.replaceState(null, '', '/studio')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: /Chào buổi tối, Huy/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Khách mời' })).toBeInTheDocument()
    expect(screen.getByText('Thiệp đã xuất bản')).toBeInTheDocument()
    expect(screen.getAllByText(/Còn \d+ ngày đến lễ cưới/i)).not.toHaveLength(0)
  })

  it('renders the guest management workspace', () => {
    window.history.replaceState(null, '', '/studio/guests')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Quản lý khách mời' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /Danh sách khách mời/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Thêm khách mời/i })).not.toHaveLength(0)
  })

  it('renders the RSVP workspace and the expanded product navigation', () => {
    window.history.replaceState(null, '', '/studio/rsvps')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Xác nhận tham dự' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /Danh sách xác nhận tham dự/i })).toBeInTheDocument()
    expect(screen.getByText('Thiệp online')).toBeInTheDocument()
    expect(screen.getAllByText('Website cưới')).not.toHaveLength(0)
    expect(screen.getByRole('link', { name: 'Kho thiệp' })).toHaveAttribute('href', '/studio/invites/themes')
    expect(screen.getByRole('link', { name: 'Kho website' })).toHaveAttribute('href', '/studio/site/themes')
  })

  it('renders the wishes moderation workspace', () => {
    window.history.replaceState(null, '', '/studio/wishes')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Lời chúc' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Chờ duyệt/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('button', { name: /Duyệt/i })).not.toHaveLength(0)
  })

  it('renders the three-level guest category workspace', () => {
    window.history.replaceState(null, '', '/studio/guests/categories')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Danh mục khách mời' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Danh mục khách mời' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByText('Cấp cuối')).not.toHaveLength(0)
  })

  it('renders the theme gallery without the detailed editor', () => {
    window.history.replaceState(null, '', '/studio/invites/themes')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Chọn giao diện thiệp' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Xem trước' })).toHaveLength(7)
    expect(screen.getAllByText('Élan d’Amour')).not.toHaveLength(0)
    fireEvent.click(screen.getAllByRole('button', { name: 'Xem trước' })[0])
    expect(screen.getByRole('link', { name: 'Mở bản xem trước đầy đủ Élan d’Amour' })).toHaveAttribute('href', '/templates/invitations/modern-luxe/preview')
  })

  it('renders a separate website theme gallery', () => {
    window.history.replaceState(null, '', '/studio/site/themes')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Chọn giao diện website' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kho thiệp' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kho website' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Website của bạn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Thiệp của bạn' })).toBeInTheDocument()
  })

  it('renders the login page as a separate surface', () => {
    window.history.replaceState(null, '', '/login')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Đăng nhập/i })).toHaveAttribute('href', '/studio')
  })

  it('renders the platform admin dashboard with its own navigation', () => {
    window.history.replaceState(null, '', '/gmm_admin')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: /Chào buổi sáng, Admin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gói đăng ký' })).toHaveAttribute('href', '/gmm_admin/subscriptions')
    expect(screen.getByRole('link', { name: 'Kho thiệp online' })).toHaveAttribute('href', '/gmm_admin/library/invites')
    expect(screen.getByRole('link', { name: 'Kho website online' })).toHaveAttribute('href', '/gmm_admin/library/websites')
    expect(screen.getByRole('link', { name: 'Phong cách thiệp' })).toHaveAttribute('href', '/gmm_admin/styles/invites')
  })

  it('renders admin login outside the admin shell', () => {
    window.history.replaceState(null, '', '/gmm_admin/login')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Đăng nhập quản trị' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng nhập quản trị' })).toHaveAttribute('href', '/gmm_admin')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders the planning and post-wedding navigation placeholders', () => {
    window.history.replaceState(null, '', '/studio/todos')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Todolist' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /công việc đã hoàn thành/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Thêm công việc' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sổ tiền mừng' })).toHaveAttribute('href', '/studio/gift-ledger')
    expect(screen.getByText('Wedding Recap')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Kho giao diện' }).some((link) => link.getAttribute('href') === '/studio/recap/themes')).toBe(true)
    expect(screen.getByRole('link', { name: 'Recap của bạn' })).toHaveAttribute('href', '/studio/recap')
  })

  it('renders the private gift ledger prototype', () => {
    window.history.replaceState(null, '', '/studio/gift-ledger')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Sổ tiền mừng' })).toBeInTheDocument()
    expect(screen.getByText('Dữ liệu riêng tư')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Danh sách tiền và quà mừng' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hiện tổng tiền mừng' })).toBeInTheDocument()
  })

  it('renders the separate admin invitation library', () => {
    window.history.replaceState(null, '', '/gmm_admin/library/invites')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Kho thiệp online' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thêm template/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Xem trước Élan d’Amour' })).toHaveAttribute('href', '/templates/invitations/modern-luxe/preview')
  })

  it('renders the public modern luxe invitation with default content', () => {
    window.history.replaceState(null, '', '/templates/invitations/modern-luxe/preview')
    render(<NavigationProvider><App /></NavigationProvider>)
    fireEvent.click(screen.getByRole('button', { name: /Mở thiệp/i }))
    expect(screen.getByRole('heading', { name: /Minh Anh.*Hoàng Nam/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Chọn bảng màu' })).toBeInTheDocument()
    expect(screen.getByText('The Grand Ballroom')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Thông tin hai bên gia đình' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Một ngày, những khoảnh khắc đáng nhớ' })).toBeInTheDocument()
    expect(screen.getByTitle('Bản đồ The Grand Ballroom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ảnh tiếp theo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gửi một lời chúc đến chúng mình' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Thông tin hai bên gia đình' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Một ngày, những khoảnh khắc đáng nhớ' })).toBeInTheDocument()
    expect(screen.getByTitle('Bản đồ The Grand Ballroom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ảnh tiếp theo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gửi một lời chúc đến chúng mình' })).toBeInTheDocument()
  })

  it('renders the Verdant Promise invitation with botanical interactions', () => {
    window.history.replaceState(null, '', '/templates/invitations/verdant-promise/preview')
    render(<NavigationProvider><App /></NavigationProvider>)
    fireEvent.click(screen.getByRole('button', { name: /Mở thiệp cưới của An Nhiên và Minh Khang/i }))
    expect(screen.getByRole('heading', { name: /An Nhiên.*Minh Khang/i })).toBeInTheDocument()
    expect(screen.getByTitle('Bản đồ Glass Garden Ballroom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ảnh tiếp theo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gửi một lời chúc thật xanh' })).toBeInTheDocument()
  })

  it('renders the Mây Hồng Có Đôi invitation opening experience', () => {
    window.history.replaceState(null, '', '/templates/invitations/chibi-daydream/preview')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByText('Mây Hồng Có Đôi')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Khánh An.*Đức Minh/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Mở thiệp Mây Hồng Có Đôi' })).toBeInTheDocument()
  })

  it('renders the admin user management prototype', () => {
    window.history.replaceState(null, '', '/gmm_admin/users')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Quản lý người dùng' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Danh sách người dùng' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Tìm người dùng' })).toBeInTheDocument()
    expect(screen.getAllByText('Nguyễn Minh Anh')).not.toHaveLength(0)
  })

  it('renders the separate admin website library', () => {
    window.history.replaceState(null, '', '/gmm_admin/library/websites')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Kho website online' })).toBeInTheDocument()
  })
})
