import { useEffect, useState } from 'react'
import {
  Bell,
  CalendarCheck,
  CaretDown,
  CaretRight,
  ChartLineUp,
  GearSix,
  GlobeHemisphereWest,
  Heart,
  House,
  FolderSimple,
  CurrencyCircleDollar,
  ImagesSquare,
  List,
  Palette,
  PaperPlaneTilt,
  SidebarSimple,
  SignOut,
  UserList,
  UsersThree,
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
import { FeatureSearch } from './FeatureSearch'
import { MobileQuickMenu } from './MobileQuickMenu'
import { notifications } from '../../../shared/ui/notifications/notifications'

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
  {
    label: 'Hiện diện online',
    items: [
      { label: 'Thiệp online', icon: PaperPlaneTilt, heading: true },
      { to: studioRoutes.inviteThemes, label: 'Kho thiệp', icon: Palette, child: true },
      { to: studioRoutes.invites, label: 'Thiệp của bạn', icon: PaperPlaneTilt, child: true },
      { label: 'Website cưới', icon: GlobeHemisphereWest, heading: true },
      { to: studioRoutes.siteThemes, label: 'Kho website', icon: Palette, child: true },
      { to: studioRoutes.site, label: 'Website của bạn', icon: GlobeHemisphereWest, child: true },
      { label: 'Wedding Recap', icon: ImagesSquare, heading: true },
      { to: studioRoutes.recapThemes, label: 'Kho giao diện', icon: Palette, child: true },
      { to: studioRoutes.recap, label: 'Recap của bạn', icon: ImagesSquare, child: true },
    ],
  },
  {
    label: 'Khách & phản hồi',
    items: [
      { to: studioRoutes.guests, label: 'Khách mời', icon: UserList },
      {
        to: studioRoutes.guestCategories,
        label: 'Danh mục khách mời',
        icon: FolderSimple,
        child: true,
      },
      { to: studioRoutes.rsvps, label: 'Xác nhận tham dự', icon: List, badge: '12' },
      { to: studioRoutes.wishes, label: 'Lời chúc', icon: Heart, badge: '5' },
    ],
  },
  {
    label: 'Chuẩn bị',
    items: [
      { to: studioRoutes.events, label: 'Lễ & tiệc', icon: CalendarCheck },
      { to: studioRoutes.todos, label: 'Todolist', icon: CalendarCheck },
      { to: studioRoutes.giftLedger, label: 'Sổ tiền mừng', icon: CurrencyCircleDollar },
    ],
  },
  {
    label: 'Vận hành',
    items: [
      { to: studioRoutes.analytics, label: 'Thống kê', icon: ChartLineUp },
      { to: studioRoutes.members, label: 'Thành viên', icon: UsersThree },
      { to: studioRoutes.settings, label: 'Cài đặt', icon: GearSix },
      { to: studioRoutes.media, label: 'Kho ảnh', icon: ImagesSquare },
    ],
  },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setCollapsed] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [pendingWeddingId, setPendingWeddingId] = useState<string | null>(null)
  const [collaboratorNoticeOpen, setCollaboratorNoticeOpen] = useState(false)
  const { pathname, navigate } = useNavigation()
  const auth = useOptionalAuth()
  const weddingWorkspace = useOptionalWeddingWorkspace()
  const isViewer = weddingWorkspace?.activeRole === 'VIEWER'
  const viewerHiddenRoutes = new Set<string>([
    studioRoutes.invites,
    studioRoutes.site,
    studioRoutes.siteEditor,
    studioRoutes.recap,
    studioRoutes.recapThemes,
    studioRoutes.events,
    studioRoutes.giftLedger,
    studioRoutes.members,
    studioRoutes.settings,
    studioRoutes.media,
  ])
  const currentWedding = weddingWorkspace?.activeWedding
  const visibleNavGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      (!weddingWorkspace || weddingWorkspace.activeRole === 'OWNER' || item.to !== studioRoutes.giftLedger) &&
      (!isViewer || ((!item.to || !viewerHiddenRoutes.has(item.to)) &&
        !(item.heading && item.icon === ImagesSquare))),
    ),
  }))
  const searchFeatures = [
    ...visibleNavGroups.flatMap((group) => group.items.flatMap((item) =>
      item.to ? [{ label: item.to === studioRoutes.recapThemes ? 'Kho giao diện Recap' : item.label, to: item.to, group: group.label }] : [],
    )),
    { label: 'Hồ sơ tài khoản', to: studioRoutes.profile, group: 'Tài khoản' },
  ]
  const activeWedding = currentWedding
    ? {
        id: currentWedding.id,
        coupleName: currentWedding.name,
        weddingDate: currentWedding.primaryDate ?? undefined,
      }
    : fallbackWedding
  const weddingCountdown = useWeddingCountdown(activeWedding.weddingDate ?? '')
  const weddingCountdownLabel = !activeWedding.weddingDate
    ? 'Vui lòng nhập ngày cưới của bạn'
    : weddingCountdown.complete
      ? 'Ngày cưới đã diễn ra'
      : `Còn ${weddingCountdown.days} ngày đến lễ cưới`

  useEffect(() => {
    const wedding = weddingWorkspace?.activeWedding
    const role = weddingWorkspace?.activeRole
    if (!wedding || !role || role === 'OWNER' || (weddingWorkspace?.weddings.length ?? 0) < 2) {
      setCollaboratorNoticeOpen(false)
      return
    }

    const acknowledged = sessionStorage.getItem(`gmm-collaborator-wedding-notice:${wedding.id}`)
    setCollaboratorNoticeOpen(!acknowledged)
  }, [weddingWorkspace?.activeRole, weddingWorkspace?.activeWedding, weddingWorkspace?.weddings.length])

  useEffect(() => setSidebarOpen(false), [pathname])

  function openSwitcher() {
    setSwitcherOpen(true)
  }

  const pendingWedding = weddingWorkspace?.weddings.find((wedding) => wedding.id === pendingWeddingId) ?? null

  return (
    <div className={`app-shell ${isCollapsed ? 'is-collapsed' : ''}`}>
      <WeddingAmbient />
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <button
        className={`sidebar-scrim ${isSidebarOpen ? 'is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Đóng thanh điều hướng"
        tabIndex={isSidebarOpen ? 0 : -1}
      />

      <aside
        id="primary-sidebar"
        className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}
        aria-label="Điều hướng chính"
      >
        <div className="brand-row">
          <div className="brand-mark">
            <img src="/assets/logo/wedding_logo.png" alt="" aria-hidden="true" />
          </div>
          <div className="brand-copy">
            <strong>GMM Wedding</strong>
            <span>Không gian quản lý</span>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={18} />
          </button>
        </div>

        <button
          type="button"
          className="wedding-switcher"
          aria-label="Mở danh sách Wedding để chuyển"
          aria-haspopup="dialog"
          onClick={() => void openSwitcher()}
        >
          <span className="couple-avatar">MĐ</span>
          <span className="wedding-switcher-copy">
            <strong>{activeWedding.coupleName}</strong>
            <span>Nhấn để chuyển Wedding</span>
          </span>
          <CaretDown size={16} aria-hidden="true" />
        </button>

        <nav className="primary-nav">
          {visibleNavGroups.map((group) => (
            <div className="nav-group" key={group.label || 'main'}>
              {group.label ? <p className="nav-group-label">{group.label}</p> : null}
              {group.items.map(({ to, label, icon: Icon, badge, child, heading }) =>
                heading ? (
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
                    {badge ? (
                      <b className="nav-badge" aria-label={`${badge} mục mới`}>
                        {badge}
                      </b>
                    ) : null}
                  </AppLink>
                ),
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* TODO: Hiển thị plan meter khi tính năng gói đăng ký được triển khai. */}
          <button
            className="collapse-button"
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-pressed={isCollapsed}
          >
            <SidebarSimple size={18} />
            <span>{isCollapsed ? 'Mở rộng' : 'Thu gọn'}</span>
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
            aria-expanded={isSidebarOpen}
            aria-controls="primary-sidebar"
          >
            <List size={21} />
          </button>
          <FeatureSearch features={searchFeatures} />
          <div
            className={`mobile-wedding-countdown ${activeWedding.weddingDate ? '' : 'is-empty'}`}
            role="status"
            aria-label={weddingCountdownLabel}
          >
            <CalendarCheck size={16} aria-hidden="true" />
            <span>
              {activeWedding.weddingDate && !weddingCountdown.complete
                ? `${weddingCountdown.days} ngày`
                : activeWedding.weddingDate
                  ? 'Đã diễn ra'
                  : 'Nhập ngày cưới'}
            </span>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button notification-button"
              type="button"
              aria-label="Thông báo"
              onClick={() => void notifications.info('Tính năng thông báo hiện chưa khả dụng.', 'Vui lòng quay lại sau.')}
            >
              <Bell size={19} />
            </button>
            <button
              className="account-button"
              type="button"
              aria-label="Chỉnh sửa thông tin tài khoản"
              onClick={() => navigate(studioRoutes.profile)}
            >
              <span className="user-avatar">
                {auth?.user?.displayName
                  ?.trim()
                  .split(/\s+/)
                  .slice(-2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'TK'}
              </span>
              <span className="account-copy">
                <strong>{auth?.user?.displayName ?? 'Tài khoản'}</strong>
                <small className={activeWedding.weddingDate ? '' : 'is-empty'}>
                  <CalendarCheck size={12} aria-hidden="true" />
                  {weddingCountdownLabel}
                </small>
              </span>
              <CaretRight size={14} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Đăng xuất"
              onClick={() => void auth?.logout().then(() => navigate(marketingRoutes.login, true))}
            >
              <SignOut size={19} />
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <MobileQuickMenu features={searchFeatures} />
      {switcherOpen ? (
        <div
          className="workspace-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSwitcherOpen(false)
          }}
        >
          <section
            className="workspace-dialog wedding-switcher-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wedding-switcher-title"
          >
            <header>
              <div>
                <h2 id="wedding-switcher-title">Chuyển Wedding</h2>
                <p>Chọn không gian Wedding bạn muốn tiếp tục làm việc.</p>
              </div>
              <button type="button" onClick={() => setSwitcherOpen(false)} aria-label="Đóng">
                <X size={18} />
              </button>
            </header>
            <div className="wedding-switcher-list">
              {(weddingWorkspace?.weddings ?? []).map((wedding) => (
                <button
                  type="button"
                  key={wedding.id}
                  className={wedding.id === activeWedding.id ? 'is-active' : ''}
                  onClick={() => setPendingWeddingId(wedding.id)}
                >
                  <span>
                    <strong>{wedding.name}</strong>
                    <small>
                      {wedding.primaryDate
                        ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(
                            new Date(wedding.primaryDate),
                          )
                        : 'Chưa chọn ngày cưới'}
                    </small>
                  </span>
                  <span className="wedding-switcher-meta">
                    <em>
                      {weddingWorkspace?.rolesByWedding[wedding.id] === 'OWNER'
                        ? 'Chủ sở hữu'
                        : weddingWorkspace?.rolesByWedding[wedding.id] === 'EDITOR'
                          ? 'Biên tập viên'
                          : weddingWorkspace?.rolesByWedding[wedding.id] === 'VIEWER'
                            ? 'Chỉ xem'
                            : 'Đang tải quyền…'}
                    </em>
                    <i>
                      {wedding.status === 'PUBLISHED'
                        ? 'Đã xuất bản'
                        : wedding.status === 'ARCHIVED'
                          ? 'Đã lưu trữ'
                          : 'Bản nháp'}
                    </i>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
      {pendingWedding ? (
        <div className="workspace-dialog-backdrop" role="presentation">
          <section
            className="workspace-dialog wedding-switch-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wedding-switch-confirm-title"
          >
            <header>
              <div>
                <h2 id="wedding-switch-confirm-title">Xác nhận chuyển Wedding</h2>
              </div>
              <button type="button" onClick={() => setPendingWeddingId(null)} aria-label="Đóng">
                <X size={18} />
              </button>
            </header>
            <p>
              Bạn sẽ chuyển không gian làm việc sang <strong>{pendingWedding.name}</strong>.
            </p>
            <footer>
              <button type="button" className="button button-secondary" onClick={() => setPendingWeddingId(null)}>
                Hủy
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  weddingWorkspace?.selectWedding(pendingWedding.id)
                  setPendingWeddingId(null)
                  setSwitcherOpen(false)
                }}
              >
                Chuyển Wedding
              </button>
            </footer>
          </section>
        </div>
      ) : null}
      {collaboratorNoticeOpen && currentWedding && weddingWorkspace?.activeRole !== 'OWNER' ? (
        <div className="workspace-dialog-backdrop" role="presentation">
          <section
            className="workspace-dialog collaborator-wedding-notice-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="collaborator-wedding-notice-title"
          >
            <header>
              <div>
                <h2 id="collaborator-wedding-notice-title">Bạn đang làm việc trong Wedding khác</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(`gmm-collaborator-wedding-notice:${currentWedding.id}`, '1')
                  setCollaboratorNoticeOpen(false)
                }}
                aria-label="Đóng thông báo"
              >
                <X size={18} />
              </button>
            </header>
            <p>
              Bạn đang thao tác trên Wedding của <strong>{currentWedding.name}</strong> với vai trò{' '}
              <strong>{weddingWorkspace.activeRole === 'EDITOR' ? 'Biên tập viên' : 'Chỉ xem'}</strong>.
            </p>
            <p>Hãy kiểm tra đúng Wedding trước khi tiếp tục để tránh chỉnh sửa nhầm dữ liệu.</p>
            <footer>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  sessionStorage.setItem(`gmm-collaborator-wedding-notice:${currentWedding.id}`, '1')
                  setCollaboratorNoticeOpen(false)
                }}
              >
                Đã biết
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  sessionStorage.setItem(`gmm-collaborator-wedding-notice:${currentWedding.id}`, '1')
                  setCollaboratorNoticeOpen(false)
                  setSwitcherOpen(true)
                }}
              >
                Đổi ngay
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  )
}
