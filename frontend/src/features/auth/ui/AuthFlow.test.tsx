import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { App } from '../../../app/App'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { AuthProvider } from '../model/AuthProvider'

function renderApp(pathname: string) {
  window.history.replaceState(null, '', pathname)
  return render(<NavigationProvider><AuthProvider><App /></AuthProvider></NavigationProvider>)
}

const user = {
  id: '10000000-0000-4000-8000-000000000001', email: 'owner@example.test', displayName: 'Owner',
  emailVerifiedAt: '2026-08-05T00:00:00.000Z', locale: 'vi-VN', timezone: 'Asia/Ho_Chi_Minh', status: 'ACTIVE', roles: [],
}

describe('frontend authentication', () => {
  afterEach(() => vi.restoreAllMocks())

  it('submits owner credentials and enters studio', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ user }), { status: 200, headers: { 'content-type': 'application/json' } }))
    renderApp('/login')
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: user.email } })
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'Correct-Horse-Battery-42' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))
    await waitFor(() => expect(window.location.pathname).toBe('/studio'))
  })

  it('redirects a missing admin session to admin login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ error: { code: 'AUTHENTICATION_REQUIRED', message: 'Authentication required' } }), { status: 401, headers: { 'content-type': 'application/json' } }))
    renderApp('/gmm_admin')
    expect(screen.getByRole('status', { name: 'Đang kiểm tra phiên đăng nhập' })).toBeInTheDocument()
    await waitFor(() => expect(window.location.pathname).toBe('/gmm_admin/login'))
  })

  it('checks an owner session only once when auth state is populated', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ user }), { status: 200, headers: { 'content-type': 'application/json' } }))
    renderApp('/studio')
    await screen.findByRole('heading', { name: /Chào buổi tối/ })
    await new Promise((resolve) => setTimeout(resolve, 30))
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/me'), expect.anything())
  })

  it('requests a password reset without revealing account existence', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Accepted' }), { status: 202, headers: { 'content-type': 'application/json' } }))
    renderApp('/forgot-password')
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: user.email } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi hướng dẫn' }))
    await screen.findByText('Kiểm tra hộp thư của bạn')
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/auth/forgot-password'), expect.objectContaining({ method: 'POST', credentials: 'include' }))
  })

  it('resets the password from the email token', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    window.history.replaceState(null, '', '/reset-password?token=reset-token')
    render(<NavigationProvider><AuthProvider><App /></AuthProvider></NavigationProvider>)
    fireEvent.change(screen.getByLabelText('Mật khẩu mới'), { target: { value: 'New-Correct-Horse-42' } })
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu mới'), { target: { value: 'New-Correct-Horse-42' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }))
    await screen.findByText('Đổi mật khẩu thành công')
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/auth/reset-password'), expect.objectContaining({ method: 'POST', credentials: 'include' }))
  })
})
