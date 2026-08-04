import { Bell, Browser, CaretDown, CirclesFour, CreditCard, EnvelopeSimple, Flag, Gear, Heart, MagnifyingGlass, Palette, Tag, UsersThree } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { adminRoutes, studioRoutes } from '../../../shared/config/routes'

const adminNav = [
  { label: 'Tổng quan', items: [
    { to: adminRoutes.home, label: 'Bảng điều khiển', icon: CirclesFour },
  ] },
  { label: 'Quản lý nền tảng', items: [
    { to: adminRoutes.users, label: 'Người dùng', icon: UsersThree },
    { to: adminRoutes.weddings, label: 'Đám cưới', icon: Heart },
    { to: adminRoutes.subscriptions, label: 'Gói đăng ký', icon: CreditCard },
  ] },
  { label: 'Nội dung & giao diện', items: [
    { label: 'Kho giao diện', icon: Palette, children: [
      { to: adminRoutes.inviteLibrary, label: 'Kho thiệp online', icon: EnvelopeSimple },
      { to: adminRoutes.websiteLibrary, label: 'Kho website online', icon: Browser },
    ] },
    { label: 'Danh mục phong cách', icon: Tag, children: [
      { to: adminRoutes.inviteStyles, label: 'Phong cách thiệp', icon: EnvelopeSimple },
      { to: adminRoutes.websiteStyles, label: 'Phong cách website', icon: Browser },
    ] },
  ] },
  { label: 'Kiểm soát hệ thống', items: [
    { to: adminRoutes.moderation, label: 'Kiểm duyệt', icon: Flag, badge: '8' },
    { to: adminRoutes.operations, label: 'Vận hành', icon: Gear },
  ] },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const { pathname } = useNavigation()
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Điều hướng quản trị hệ thống">
        <div className="admin-brand"><img src="/assets/logo/wedding_logo.png" alt="" /><div><strong>GMM Wedding</strong><span>Platform Admin</span></div></div>
        <nav>
          {adminNav.map((group) => <section className="admin-nav-group" key={group.label} aria-label={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => {
              if ('children' in item) {
                const ParentIcon = item.icon
                return <div className="admin-nav-branch" key={item.label}>
                  <div className="admin-nav-heading"><ParentIcon size={19} /><span>{item.label}</span></div>
                  {item.children.map(({ to, label, icon: ChildIcon }) => <AppLink key={to} to={to} className={`admin-nav-item is-child ${pathname === to ? 'is-active' : ''}`} ariaCurrent={pathname === to ? 'page' : undefined}><ChildIcon size={16} /><span>{label}</span></AppLink>)}
                </div>
              }
              const Icon = item.icon
              return <AppLink key={item.to} to={item.to} className={`admin-nav-item ${pathname === item.to ? 'is-active' : ''}`} ariaCurrent={pathname === item.to ? 'page' : undefined}><Icon size={19} /><span>{item.label}</span>{'badge' in item && item.badge ? <b>{item.badge}</b> : null}</AppLink>
            })}
          </section>)}
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
