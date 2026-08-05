import { useEffect } from 'react'
import { LoginPage } from '../pages/auth/ui/LoginPage'
import { ForgotPasswordPage } from '../pages/auth/ui/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ui/ResetPasswordPage'
import { AdminDashboardPage } from '../pages/admin/ui/AdminDashboardPage'
import { AdminLoginPage } from '../pages/admin/ui/AdminLoginPage'
import { AdminThemesPage } from '../pages/admin/ui/AdminThemesPage'
import { AdminUsersPage } from '../pages/admin/ui/AdminUsersPage'
import { AdminPlaceholderPage } from '../pages/admin/ui/AdminPlaceholderPage'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'
import { GuestsPage } from '../pages/guests/ui/GuestsPage'
import { GuestCategoriesPage } from '../pages/guest-categories/ui/GuestCategoriesPage'
import { TemplatesPage } from '../pages/templates/ui/TemplatesPage'
import { TodosPage } from '../pages/todos/ui/TodosPage'
import { GiftLedgerPage } from '../pages/gift-ledger/ui/GiftLedgerPage'
import { RsvpsPage } from '../pages/rsvps/ui/RsvpsPage'
import { WishesPage } from '../pages/wishes/ui/WishesPage'
import { PlaceholderPage } from '../pages/placeholder/ui/PlaceholderPage'
import { useNavigation } from '../shared/lib/navigation/navigation-context'
import { adminRoutes, legacyStudioRoutes, marketingRoutes, studioRoutes } from '../shared/config/routes'
import { AppShell } from '../widgets/app-shell/ui/AppShell'
import { AdminShell } from '../widgets/admin-shell/ui/AdminShell'
import { ModernLuxePreviewPage } from '../pages/public-invitation/ui/ModernLuxePreviewPage'
import { VerdantPromisePreviewPage } from '../pages/public-invitation/ui/VerdantPromisePreviewPage'
import { ChibiDaydreamPreviewPage } from '../pages/public-invitation/ui/ChibiDaydreamPreviewPage'
import { publicTemplateRoutes } from '../shared/config/routes'
import { HomePage } from '../pages/home/ui/HomePage'
import { AuthGate } from '../features/auth/ui/AuthGate'

const studioPages: Record<string, React.ReactNode> = {
  [studioRoutes.home]: <DashboardPage />,
  [studioRoutes.inviteThemes]: <TemplatesPage kind="invitation" />,
  [studioRoutes.invites]: <PlaceholderPage section="editor" />,
  [studioRoutes.siteThemes]: <TemplatesPage kind="website" />,
  [studioRoutes.site]: <PlaceholderPage section="wedding-site" />,
  [studioRoutes.guests]: <GuestsPage />,
  [studioRoutes.guestCategories]: <GuestCategoriesPage />,
  [studioRoutes.rsvps]: <RsvpsPage />,
  [studioRoutes.wishes]: <WishesPage />,
  [studioRoutes.todos]: <TodosPage />,
  [studioRoutes.giftLedger]: <GiftLedgerPage />,
  [studioRoutes.recap]: <PlaceholderPage section="recap" />,
  [studioRoutes.recapThemes]: <PlaceholderPage section="recap-themes" />,
  [studioRoutes.analytics]: <PlaceholderPage section="analytics" />,
  [studioRoutes.settings]: <PlaceholderPage section="settings" />,
}

const adminPageNames: Record<string, string> = {
  [adminRoutes.users]: 'Quản lý người dùng',
  [adminRoutes.weddings]: 'Quản lý đám cưới',
  [adminRoutes.subscriptions]: 'Quản lý gói đăng ký',
  [adminRoutes.inviteStyles]: 'Danh mục phong cách thiệp',
  [adminRoutes.websiteStyles]: 'Danh mục phong cách website',
  [adminRoutes.moderation]: 'Kiểm duyệt nội dung',
  [adminRoutes.operations]: 'Vận hành hệ thống',
}

export function App() {
  const { pathname, navigate } = useNavigation()

  useEffect(() => {
    const legacyMatch = pathname.match(/^\/app\/weddings\/[^/]+\/([^/]+)\/?$/)
    if (legacyMatch && legacyStudioRoutes[legacyMatch[1]]) {
      navigate(legacyStudioRoutes[legacyMatch[1]], true)
      return
    }
  }, [navigate, pathname])

  if (pathname === '/') return <HomePage />
  if (pathname === marketingRoutes.login) return <LoginPage />
  if (pathname === marketingRoutes.forgotPassword) return <ForgotPasswordPage />
  if (pathname === marketingRoutes.resetPassword) return <ResetPasswordPage />
  if (pathname === publicTemplateRoutes.modernLuxePreview) return <ModernLuxePreviewPage />
  if (pathname === publicTemplateRoutes.verdantPromisePreview) return <VerdantPromisePreviewPage />
  if (pathname === publicTemplateRoutes.chibiDaydreamPreview) return <ChibiDaydreamPreviewPage />
  if (pathname === adminRoutes.login) return <AdminLoginPage />

  if (pathname === adminRoutes.home || pathname.startsWith(`${adminRoutes.home}/`)) {
    const content = pathname === adminRoutes.home
      ? <AdminDashboardPage />
      : pathname === adminRoutes.users
        ? <AdminUsersPage />
      : pathname === adminRoutes.inviteLibrary
        ? <AdminThemesPage kind="invitation" />
        : pathname === adminRoutes.websiteLibrary
          ? <AdminThemesPage kind="website" />
        : <AdminPlaceholderPage title={adminPageNames[pathname] ?? 'Không tìm thấy trang'} />
    return <AuthGate surface="admin"><AdminShell>{content}</AdminShell></AuthGate>
  }

  const content = studioPages[pathname]
  if (content) return <AuthGate surface="studio"><AppShell>{content}</AppShell></AuthGate>

  return null
}
