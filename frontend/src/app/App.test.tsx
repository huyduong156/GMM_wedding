import { render, screen } from '@testing-library/react'
import { App } from './App'
import { NavigationProvider } from './navigation'

describe('Owner Workspace', () => {
  it('renders the dashboard and primary navigation', () => {
    window.history.replaceState(null, '', '/app/weddings/wed_mai_duc/overview')
    render(<NavigationProvider><App /></NavigationProvider>)
    expect(screen.getByRole('heading', { name: /Chào buổi tối, Linh/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Khách mời' })).toBeInTheDocument()
    expect(screen.getByText('Thiệp đang được xuất bản')).toBeInTheDocument()
  })
})
