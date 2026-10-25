import { createContext, useContext } from 'react'

export type NavigationContextValue = {
  /** Current route pathname without its query string. */
  pathname: string
  navigate: (to: string, replace?: boolean) => void
}

export const NavigationContext = createContext<NavigationContextValue | null>(null)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used inside NavigationProvider')
  return context
}
