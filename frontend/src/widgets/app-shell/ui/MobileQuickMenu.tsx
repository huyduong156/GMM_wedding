import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import {
  CalendarCheck,
  CurrencyCircleDollar,
  List,
  UserList,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import { studioRoutes } from '../../../shared/config/routes'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import type { SearchFeature } from '../model/feature-search'
import './mobile-quick-menu.css'

const shortcuts = [
  { to: studioRoutes.guests, label: 'Khách mời', icon: UserList },
  { to: studioRoutes.giftLedger, label: 'Sổ tiền mừng', icon: CurrencyCircleDollar },
  { to: studioRoutes.todos, label: 'Todolist', icon: CalendarCheck },
  { to: studioRoutes.members, label: 'Thành viên', icon: UsersThree },
]

export function MobileQuickMenu({ features }: { features: SearchFeature[] }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { pathname, navigate } = useNavigation()
  const id = useId()
  const items = shortcuts.filter((item) => features.some((feature) => feature.to === item.to))

  useEffect(() => setOpen(false), [pathname])

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div
      className={`mobile-quick-menu${open ? ' is-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          close()
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        className="mobile-quick-menu-scrim"
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
      />
      <button
        ref={triggerRef}
        className="mobile-quick-menu-toggle mobile-floating-action"
        type="button"
        aria-label={open ? 'Đóng menu nhanh' : 'Mở menu nhanh'}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={25} aria-hidden="true" /> : <List size={25} aria-hidden="true" />}
      </button>
      <nav
        id={id}
        className="mobile-quick-menu-links"
        aria-label="Tính năng thường dùng"
        aria-hidden={!open}
      >
        {items.map(({ to, label, icon: Icon }, index) => {
          const angle = Math.PI + (index * Math.PI) / (2 * Math.max(1, items.length - 1))
          const style = {
            '--quick-x': `${Math.round(172 * Math.cos(angle))}px`,
            '--quick-y': `${Math.round(172 * Math.sin(angle))}px`,
          } as CSSProperties
          return (
            <a
              key={to}
              href={to}
              style={style}
              tabIndex={open ? 0 : -1}
              aria-current={pathname === to ? 'page' : undefined}
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return
                event.preventDefault()
                close()
                navigate(to)
              }}
            >
              <span className="mobile-quick-menu-icon">
                <Icon size={23} aria-hidden="true" />
              </span>
              <span className="mobile-quick-menu-label">{label}</span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}
