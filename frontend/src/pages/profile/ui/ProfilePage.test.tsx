import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../../features/auth/model/auth-context'
import type { AuthUser } from '../../../shared/api/auth'
import { ProfilePage } from './ProfilePage'

const user: AuthUser = {
  id: 'user-1', email: 'owner@example.test', displayName: 'Nguyễn An', phone: null, avatarUrl: null,
  emailVerifiedAt: '2026-01-01T00:00:00.000Z', locale: 'vi-VN', timezone: 'Asia/Ho_Chi_Minh', status: 'ACTIVE', roles: [],
}

function renderPage(updateProfile = vi.fn().mockResolvedValue(undefined)) {
  const value: AuthContextValue = {
    user, adminActor: null, updateProfile, login: vi.fn(), loginAdmin: vi.fn(), checkUserSession: vi.fn(), checkAdminSession: vi.fn(), logout: vi.fn(),
  }
  return { updateProfile, ...render(<AuthContext.Provider value={value}><ProfilePage /></AuthContext.Provider>) }
}

describe('ProfilePage', () => {
  it('loads current user data and submits a profile update', async () => {
    const { updateProfile } = renderPage()
    expect(screen.getByDisplayValue('owner@example.test')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Tên hiển thị'), { target: { value: 'Mai Anh' } })
    fireEvent.change(screen.getByLabelText('Số điện thoại'), { target: { value: '+84 912 345 678' } })
    fireEvent.click(screen.getByRole('button', { name: /Lưu thông tin/ }))
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'Mai Anh', phone: '+84 912 345 678' })))
    expect(await screen.findByRole('status')).toHaveTextContent('Đã cập nhật thông tin tài khoản.')
  })
})
