import { type MouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import { NavigationContext, type NavigationContextValue, useNavigation } from './navigation-context'

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const value = useMemo<NavigationContextValue>(() => ({
    pathname,
    navigate(to, replace = false) {
      if (replace) window.history.replaceState(null, '', to)
      else window.history.pushState(null, '', to)
      setPathname(to)
      window.scrollTo({ top: 0, behavior: 'auto' })
    },
  }), [pathname])

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function AppLink({ to, children, className, ariaLabel }: {
  to: string
  children: ReactNode
  className?: string
  ariaLabel?: string
}) {
  const { navigate } = useNavigation()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }

  return <a href={to} onClick={handleClick} className={className} aria-label={ariaLabel}>{children}</a>
}
