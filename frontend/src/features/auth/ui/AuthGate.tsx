import { type ReactNode, useEffect, useState } from 'react'
import { adminRoutes, marketingRoutes } from '../../../shared/config/routes'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { useOptionalAuth } from '../model/auth-context'

export function AuthGate({ surface, children }: { surface: 'studio' | 'admin'; children: ReactNode }) {
  const auth = useOptionalAuth()
  const { navigate } = useNavigation()
  const [checking, setChecking] = useState(Boolean(auth))
  const checkUserSession = auth?.checkUserSession
  const checkAdminSession = auth?.checkAdminSession
  useEffect(() => {
    if (!checkUserSession || !checkAdminSession) return
    let active = true
    const check = surface === 'admin' ? checkAdminSession : checkUserSession
    void check().then((allowed) => {
      if (!active) return
      if (!allowed) navigate(surface === 'admin' ? adminRoutes.login : marketingRoutes.login, true)
      else setChecking(false)
    })
    return () => { active = false }
  }, [checkAdminSession, checkUserSession, navigate, surface])
  if (!auth) return children
  if (checking) return <main className="auth-route-loading" role="status" aria-label="Đang kiểm tra phiên đăng nhập"><span /><p>Đang xác thực phiên đăng nhập…</p></main>
  return children
}
