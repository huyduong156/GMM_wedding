import { render, screen } from '@testing-library/react'
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
    window.history.replaceState(null, '', '/admin')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: /Chào buổi sáng, Admin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kho giao diện' })).toHaveAttribute('href', '/admin/themes')
  })

  it('renders the admin template management page', () => {
    window.history.replaceState(null, '', '/admin/themes')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Quản lý giao diện' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thêm template/i })).toBeInTheDocument()
  })
})
