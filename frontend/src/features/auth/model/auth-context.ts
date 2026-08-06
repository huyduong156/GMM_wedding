import { createContext, useContext } from 'react'
import type { AuthUser, PlatformAdminActor } from '../../../shared/api/auth'

export type AuthContextValue = {
  user: AuthUser | null
  adminActor: PlatformAdminActor | null
  login: (email: string, password: string) => Promise<void>
  loginAdmin: (email: string, password: string) => Promise<void>
  checkUserSession: () => Promise<boolean>
  checkAdminSession: () => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (input: { displayName?: string | null; phone?: string | null; avatarUrl?: string | null; locale?: string; timezone?: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
export function useOptionalAuth() { return useContext(AuthContext) }
