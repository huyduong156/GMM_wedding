import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { authApi, type AuthUser, type PlatformAdminActor } from '../../../shared/api/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [adminActor, setAdminActor] = useState<PlatformAdminActor | null>(null)
  const userSessionCheck = useRef<Promise<boolean> | null>(null)
  const adminSessionCheck = useRef<Promise<boolean> | null>(null)
  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    setUser(result.user); setAdminActor(null)
  }, [])
  const loginAdmin = useCallback(async (email: string, password: string) => {
    const result = await authApi.loginAdmin(email, password)
    setUser(result.user)
  }, [])
  const checkUserSession = useCallback(() => {
    if (!userSessionCheck.current) {
      userSessionCheck.current = (async () => {
        try { const result = await authApi.me(); setUser(result.user); return true }
        catch { setUser(null); return false }
      })().finally(() => { userSessionCheck.current = null })
    }
    return userSessionCheck.current
  }, [])
  const checkAdminSession = useCallback(() => {
    if (!adminSessionCheck.current) {
      adminSessionCheck.current = (async () => {
        try { const result = await authApi.adminMe(); setUser(result.user); setAdminActor(result.actor); return true }
        catch { setAdminActor(null); return false }
      })().finally(() => { adminSessionCheck.current = null })
    }
    return adminSessionCheck.current
  }, [])
  const logout = useCallback(async () => {
    try { await authApi.logout() } finally { setUser(null); setAdminActor(null) }
  }, [])
  const value = useMemo<AuthContextValue>(() => ({ user, adminActor, login, loginAdmin, checkUserSession, checkAdminSession, logout }), [adminActor, checkAdminSession, checkUserSession, login, loginAdmin, logout, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
