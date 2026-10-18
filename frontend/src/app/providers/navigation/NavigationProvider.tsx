import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  NavigationContext,
  type NavigationContextValue,
} from '../../../shared/lib/navigation/navigation-context'

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback<NavigationContextValue['navigate']>((to, replace = false) => {
    if (replace) window.history.replaceState(null, '', to)
    else window.history.pushState(null, '', to)
    setPathname(to)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])
  const value = useMemo<NavigationContextValue>(
    () => ({ pathname, navigate }),
    [pathname, navigate],
  )

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}
