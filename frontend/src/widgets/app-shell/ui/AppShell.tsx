import { useEffect, useState } from 'react'
import {
  Bell,
  CaretDown,
  ChartLineUp,
  GearSix,
  Heart,
  House,
  List,
  MagnifyingGlass,
  Palette,
  SidebarSimple,
  Sparkle,
  UserList,
  X,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { WeddingAmbient } from '../../../shared/ui/wedding-ambient/WeddingAmbient'

const navItems = [
  { to: 'overview', label: 'Tổng quan', icon: House },
  { to: 'editor', label: 'Thiết kế thiệp', icon: Palette },
  { to: 'templates', label: 'Kho giao diện', icon: Sparkle },
  { to: 'guests', label: 'Khách mời', icon: UserList },
  { to: 'rsvps', label: 'Xác nhận tham dự', icon: List, badge: '12' },
  { to: 'wishes', label: 'Lời chúc', icon: Heart, badge: '5' },
  { to: 'analytics', label: 'Thống kê', icon: ChartLineUp },
  { to: 'settings', label: 'Cài đặt', icon: GearSix },
]

const basePath = '/app/weddings/wed_mai_duc'

export function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setCollapsed] = useState(false)
  const { pathname } = useNavigation()

  useEffect(() => setSidebarOpen(false), [pathname])

  return (
    <div className={`app-shell ${isCollapsed ? 'is-collapsed' : ''}`}>
      <WeddingAmbient />
      <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <button
        className={`sidebar-scrim ${isSidebarOpen ? 'is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Đóng thanh điều hướng"
        tabIndex={isSidebarOpen ? 0 : -1}
      />

      <aside id="primary-sidebar" className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`} aria-label="Điều hướng chính">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">G</div>
          <div className="brand-copy">
            <strong>GMM Wedding</strong>
            <span>Không gian quản lý</span>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
            <X size={18} />
          </button>
        </div>

        <button className="wedding-switcher" type="button" aria-label="Chọn đám cưới">
          <span className="couple-avatar">MĐ</span>
          <span className="wedding-switcher-copy">
            <strong>Mai & Đức</strong>
            <span><i className="status-dot" /> Đã xuất bản</span>
          </span>
          <CaretDown size={16} />
        </button>

        <nav className="primary-nav">
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <AppLink
              key={to}
              to={`${basePath}/${to}`}
              className={`nav-item ${pathname.endsWith(`/${to}`) ? 'is-active' : ''}`}
              ariaCurrent={pathname.endsWith(`/${to}`) ? 'page' : undefined}
            >
              <Icon size={19} weight="regular" aria-hidden="true" />
              <span>{label}</span>
              {badge ? <b className="nav-badge" aria-label={`${badge} mục mới`}>{badge}</b> : null}
            </AppLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="plan-meter">
            <div className="plan-meter-title"><span>Gói miễn phí</span><strong>42%</strong></div>
            <div className="meter-track"><span style={{ width: '42%' }} /></div>
            <small>8 trong 20 khách mời</small>
          </div>
          <button className="collapse-button" type="button" onClick={() => setCollapsed((value) => !value)} aria-pressed={isCollapsed}>
            <SidebarSimple size={18} />
            <span>{isCollapsed ? 'Mở rộng' : 'Thu gọn'}</span>
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Mở menu" aria-expanded={isSidebarOpen} aria-controls="primary-sidebar">
            <List size={21} />
          </button>
          <button className="command-search" type="button">
            <MagnifyingGlass size={17} />
            <span>Tìm khách mời, trang hoặc thao tác</span>
            <kbd>⌘ K</kbd>
          </button>
          <div className="topbar-actions">
            <button className="icon-button notification-button" aria-label="Thông báo, có 3 thông báo mới">
              <Bell size={19} />
              <span />
            </button>
            <button className="account-button" type="button" aria-label="Mở menu tài khoản">
              <span className="user-avatar">LM</span>
              <span className="account-copy"><strong>Linh Mai</strong><small>Chủ thiệp</small></span>
              <CaretDown size={14} />
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
