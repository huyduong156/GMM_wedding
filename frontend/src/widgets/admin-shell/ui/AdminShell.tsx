import { Bell, CaretDown, CirclesFour, Flag, Gear, Heart, MagnifyingGlass, Palette, UsersThree } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { adminRoutes, studioRoutes } from '../../../shared/config/routes'

const adminNav = [
  { to: adminRoutes.home, label: 'Tổng quan', icon: CirclesFour },
  { to: adminRoutes.users, label: 'Người dùng', icon: UsersThree },
  { to: adminRoutes.weddings, label: 'Đám cưới', icon: Heart },
  { to: adminRoutes.themes, label: 'Kho giao diện', icon: Palette },
  { to: adminRoutes.moderation, label: 'Kiểm duyệt', icon: Flag, badge: '8' },
  { to: adminRoutes.operations, label: 'Vận hành', icon: Gear },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const { pathname } = useNavigation()
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Điều hướng quản trị hệ thống">
        <div className="admin-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><div><strong>GMM Wedding</strong><span>Platform Admin</span></div></div>
        <nav>
          <p>Hệ thống</p>
          {adminNav.map(({ to, label, icon: Icon, badge }) => <AppLink key={to} to={to} className={`admin-nav-item ${pathname === to ? 'is-active' : ''}`} ariaCurrent={pathname === to ? 'page' : undefined}><Icon size={19} /><span>{label}</span>{badge ? <b>{badge}</b> : null}</AppLink>)}
        </nav>
        <div className="admin-sidebar-footer"><AppLink to={studioRoutes.home}>Về giao diện người dùng</AppLink><span>v0.1 prototype</span></div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar"><button className="admin-search"><MagnifyingGlass size={18} /><span>Tìm user, wedding hoặc template</span><kbd>⌘ K</kbd></button><div><button className="icon-button" aria-label="Thông báo quản trị"><Bell size={19} /></button><button className="account-button"><span className="user-avatar admin-avatar">AD</span><span className="account-copy"><strong>Admin</strong><small>Super admin</small></span><CaretDown size={14} /></button></div></header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
