import { fireEvent, render, screen } from '@testing-library/react'
import { App } from './App'
import { NavigationProvider } from './providers/navigation/NavigationProvider'

describe('Owner Workspace', () => {
  it('renders the dashboard and primary navigation', () => {
    window.history.replaceState(null, '', '/studio')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: /Chào buổi tối, Huy/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Khách mời' })).toBeInTheDocument()
    expect(screen.getByText('Thiệp đã xuất bản')).toBeInTheDocument()
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
    expect(screen.getAllByRole('button', { name: 'Xem trước' })).toHaveLength(6)
    expect(screen.getAllByText('Amber Vow')).not.toHaveLength(0)
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
    expect(screen.getByRole('link', { name: 'Xem trước Modern Luxe' })).toHaveAttribute('href', '/templates/invitations/modern-luxe/preview')
  })

  it('renders the public modern luxe invitation with default content', () => {
    window.history.replaceState(null, '', '/templates/invitations/modern-luxe/preview')
    render(<NavigationProvider><App /></NavigationProvider>)
    fireEvent.click(screen.getByRole('button', { name: /Mở thiệp/i }))
    expect(screen.getByRole('heading', { name: /Trần Minh Anh.*Nguyễn Hoàng Nam/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Chọn bảng màu' })).toBeInTheDocument()
    expect(screen.getByText('The Grand Ballroom')).toBeInTheDocument()
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
