import { type MouseEvent, type MouseEventHandler, type ReactNode } from 'react'
import { useNavigation } from './navigation-context'

type AppLinkProps = {
  to: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  ariaCurrent?: 'page'
  dataGuide?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function AppLink({ to, children, className, ariaLabel, ariaCurrent, dataGuide, onClick }: AppLinkProps) {
  const { navigate } = useNavigation()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    onClick?.(event)
    navigate(to)
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      data-guide={dataGuide}
    >
      {children}
    </a>
  )
}
