import { render, screen } from '@testing-library/react'
import { App } from './App'
import { NavigationProvider } from './providers/navigation/NavigationProvider'

describe('Owner Workspace', () => {
  it('renders the dashboard and primary navigation', () => {
    window.history.replaceState(null, '', '/app/weddings/wed_mai_duc/overview')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: /Chào buổi tối, Linh/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Khách mời' })).toBeInTheDocument()
    expect(screen.getByText('Thiệp đang được xuất bản')).toBeInTheDocument()
  })

  it('renders the guest management workspace', () => {
    window.history.replaceState(null, '', '/app/weddings/wed_mai_duc/guests')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: 'Quản lý khách mời' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /Danh sách khách mời/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thêm khách mời/i })).toBeInTheDocument()
  })
})
