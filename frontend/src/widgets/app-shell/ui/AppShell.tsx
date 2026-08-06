import { useEffect, useState } from 'react'
import {
  Bell,
  CalendarCheck,
  CaretDown,
  ChartLineUp,
  GearSix,
  GlobeHemisphereWest,
  Heart,
  House,
  FolderSimple,
  CurrencyCircleDollar,
  ImagesSquare,
  List,
  MagnifyingGlass,
  Palette,
  PaperPlaneTilt,
  SidebarSimple,
  SignOut,
  UserList,
  X,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { activeWedding as fallbackWedding } from '../../../entities/wedding/model/active-wedding'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import { WeddingAmbient } from '../../../shared/ui/wedding-ambient/WeddingAmbient'
import { studioRoutes } from '../../../shared/config/routes'
import { marketingRoutes } from '../../../shared/config/routes'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'

type NavItem = {
  label: string
  icon: typeof House
  to?: string
  badge?: string
  child?: boolean
  heading?: boolean
}

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  { label: '', items: [{ to: studioRoutes.home, label: 'Tổng quan', icon: House }] },
  { label: 'Hiện diện online', items: [
    { label: 'Thiệp online', icon: PaperPlaneTilt, heading: true },
    { to: studioRoutes.inviteThemes, label: 'Kho thiệp', icon: Palette, child: true },
    { to: studioRoutes.invites, label: 'Thiệp của bạn', icon: PaperPlaneTilt, child: true },
    { label: 'Website cưới', icon: GlobeHemisphereWest, heading: true },
    { to: studioRoutes.siteThemes, label: 'Kho website', icon: Palette, child: true },
    { to: studioRoutes.site, label: 'Website của bạn', icon: GlobeHemisphereWest, child: true },
    { label: 'Wedding Recap', icon: ImagesSquare, heading: true },
    { to: studioRoutes.recapThemes, label: 'Kho giao diện', icon: Palette, child: true },
    { to: studioRoutes.recap, label: 'Recap của bạn', icon: ImagesSquare, child: true },
  ] },
  { label: 'Khách & phản hồi', items: [
    { to: studioRoutes.guests, label: 'Khách mời', icon: UserList },
    { to: studioRoutes.guestCategories, label: 'Danh mục khách mời', icon: FolderSimple, child: true },
    { to: studioRoutes.rsvps, label: 'Xác nhận tham dự', icon: List, badge: '12' },
    { to: studioRoutes.wishes, label: 'Lời chúc', icon: Heart, badge: '5' },
  ] },
  { label: 'Chuẩn bị', items: [
    { to: studioRoutes.events, label: 'Lễ & tiệc', icon: CalendarCheck },
    { to: studioRoutes.todos, label: 'Todolist', icon: CalendarCheck },
    { to: studioRoutes.giftLedger, label: 'Sổ tiền mừng', icon: CurrencyCircleDollar },
  ] },
  { label: 'Vận hành', items: [
    { to: studioRoutes.analytics, label: 'Thống kê', icon: ChartLineUp },
    { to: studioRoutes.settings, label: 'Cài đặt', icon: GearSix },
  ] },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setCollapsed] = useState(false)
  const { pathname, navigate } = useNavigation()
  const auth = useOptionalAuth()
  const weddingWorkspace = useOptionalWeddingWorkspace()
  const currentWedding = weddingWorkspace?.activeWedding
  const activeWedding = currentWedding ? { id: currentWedding.id, coupleName: currentWedding.name, weddingDate: currentWedding.primaryDate ?? undefined } : fallbackWedding
  const weddingCountdown = useWeddingCountdown(activeWedding.weddingDate ?? '')
  const weddingCountdownLabel = !activeWedding.weddingDate
    ? 'Vui lòng nhập ngày cưới của bạn'
    : weddingCountdown.complete
      ? 'Ngày cưới đã diễn ra'
      : `Còn ${weddingCountdown.days} ngày đến lễ cưới`

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
          <div className="brand-mark">
            <img src="/assets/logo/wedding_logo.png" alt="" aria-hidden="true" />
          </div>
          <div className="brand-copy">
            <strong>GMM Wedding</strong>
            <span>Không gian quản lý</span>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
            <X size={18} />
          </button>
        </div>

        <div className="wedding-switcher">
          <span className="couple-avatar">MĐ</span>
          <span className="wedding-switcher-copy">
            <strong>{activeWedding.coupleName}</strong>
            <span><i className={`status-dot ${currentWedding?.status === 'ARCHIVED' ? 'is-archived' : currentWedding?.status === 'PUBLISHED' ? '' : 'is-draft'}`} /> {currentWedding?.status === 'ARCHIVED' ? 'Đã lưu trữ' : currentWedding?.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}</span>
          </span>
          {weddingWorkspace && weddingWorkspace.weddings.length > 1 ? <select aria-label="Chọn đám cưới" value={activeWedding.id} onChange={(event) => weddingWorkspace.selectWedding(event.target.value)}>{weddingWorkspace.weddings.map((wedding) => <option key={wedding.id} value={wedding.id}>{wedding.name}</option>)}</select> : <CaretDown size={16} aria-hidden="true" />}
        </div>

        <nav className="primary-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label || 'main'}>
              {group.label ? <p className="nav-group-label">{group.label}</p> : null}
              {group.items.map(({ to, label, icon: Icon, badge, child, heading }) => heading ? (
                <div className="nav-section-heading" key={label}>
                  <Icon size={19} weight="regular" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ) : (
                <AppLink
                  key={to!}
                  to={to!}
                  className={`nav-item ${child ? 'is-child' : ''} ${pathname === to ? 'is-active' : ''}`}
                  ariaCurrent={pathname === to ? 'page' : undefined}
                >
                  <Icon size={19} weight="regular" aria-hidden="true" />
                  <span>{label}</span>
                  {badge ? <b className="nav-badge" aria-label={`${badge} mục mới`}>{badge}</b> : null}
                </AppLink>
              ))}
            </div>
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
          <div className={`mobile-wedding-countdown ${activeWedding.weddingDate ? '' : 'is-empty'}`} role="status" aria-label={weddingCountdownLabel}>
            <CalendarCheck size={16} aria-hidden="true" />
            <span>{activeWedding.weddingDate && !weddingCountdown.complete ? `${weddingCountdown.days} ngày` : activeWedding.weddingDate ? 'Đã diễn ra' : 'Nhập ngày cưới'}</span>
          </div>
          <div className="topbar-actions">
            <button className="icon-button notification-button" aria-label="Thông báo, có 3 thông báo mới">
              <Bell size={19} />
              <span />
            </button>
            <button className="account-button" type="button" aria-label="Chỉnh sửa thông tin tài khoản" onClick={() => navigate(studioRoutes.profile)}>
              <span className="user-avatar">{auth?.user?.displayName?.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase().slice(0, 2) || 'TK'}</span>
              <span className="account-copy"><strong>{auth?.user?.displayName ?? 'Tài khoản'}</strong><small className={activeWedding.weddingDate ? '' : 'is-empty'}><CalendarCheck size={12} aria-hidden="true" />{weddingCountdownLabel}</small></span>
              <CaretDown size={14} />
            </button>
            <button className="icon-button" type="button" aria-label="Đăng xuất" onClick={() => void auth?.logout().then(() => navigate(marketingRoutes.login, true))}><SignOut size={19} /></button>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
