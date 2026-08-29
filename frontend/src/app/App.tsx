import { useEffect } from 'react'
import { LoginPage } from '../pages/auth/ui/LoginPage'
import { ForgotPasswordPage } from '../pages/auth/ui/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ui/ResetPasswordPage'
import { RegisterPage } from '../pages/auth/ui/RegisterPage'
import { VerifyEmailPage } from '../pages/auth/ui/VerifyEmailPage'
import { AdminDashboardPage } from '../pages/admin/ui/AdminDashboardPage'
import { AdminLoginPage } from '../pages/admin/ui/AdminLoginPage'
import { AdminTemplatesApiPage } from '../pages/admin/ui/AdminTemplatesApiPage'
import { AdminUsersPage } from '../pages/admin/ui/AdminUsersPage'
import { AdminPlaceholderPage } from '../pages/admin/ui/AdminPlaceholderPage'
import { AdminMusicPage } from '../pages/admin/ui/AdminMusicPage'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'
import { WeddingDashboardPage } from '../pages/dashboard/ui/WeddingDashboardPage'
import { WeddingEventsPage } from '../pages/events/ui/WeddingEventsPage'
import { WeddingSettingsPage } from '../pages/wedding-settings/ui/WeddingSettingsPage'
import { ProfilePage } from '../pages/profile/ui/ProfilePage'
import { GuestsPageConnected } from '../pages/guests/ui/GuestsPageConnected'
import { GuestCategoriesConnectedV2 } from '../pages/guest-categories/ui/GuestCategoriesConnectedV2'
import { TemplatesApiPage } from '../pages/templates/ui/TemplatesApiPage'
import { WebsiteTemplatesApiPage } from '../pages/templates/ui/WebsiteTemplatesApiPage'
import { InvitationEditorLivePage } from '../pages/invitation-editor/ui/InvitationEditorLivePage'
import { WebsiteEditorLivePage } from '../pages/invitation-editor/ui/WebsiteEditorLivePage'
import { TodosPage } from '../pages/todos/ui/TodosPage'
import { GiftLedgerPage } from '../pages/gift-ledger/ui/GiftLedgerPage'
import { RsvpsPageConnected } from '../pages/rsvps/ui/RsvpsPageConnected'
import { WishesPageConnected } from '../pages/wishes/ui/WishesPageConnected'
import { AnalyticsPage } from '../pages/analytics/ui/AnalyticsPage'
import { useNavigation } from '../shared/lib/navigation/navigation-context'
import { adminRoutes, legacyStudioRoutes, marketingRoutes, studioRoutes } from '../shared/config/routes'
import { WeddingWorkspace } from '../widgets/app-shell/ui/WeddingWorkspace'
import { AdminShell } from '../widgets/admin-shell/ui/AdminShell'
import { ModernLuxePreviewPage } from '../pages/public-invitation/ui/ModernLuxePreviewPage'
import { VerdantPromisePreviewPage } from '../pages/public-invitation/ui/VerdantPromisePreviewPage'
import { ChibiDaydreamPreviewPage } from '../pages/public-invitation/ui/ChibiDaydreamPreviewPage'
import { EditorialVowsPreviewPage } from '../pages/public-website/ui/EditorialVowsPreviewPage'
import { GreenHydrangeaPreviewPage } from '../pages/public-website/ui/GreenHydrangeaPreviewPage'
import { EnchantedForestPreviewPage } from '../pages/public-website/ui/EnchantedForestPreviewPage'
import { CherryBlossomGardenPreviewPage } from '../pages/public-website/ui/CherryBlossomGardenPreviewPage'
import { RedSpiderLilyRecapPreviewPage } from '../pages/public-recap/ui/RedSpiderLilyRecapPreviewPage'
import { PublicRecapPage } from '../pages/public-recap/ui/PublicRecapPage'
import { publicTemplateRoutes } from '../shared/config/routes'
import { HomePage } from '../pages/home/ui/HomePage'
import { RecapEditorPage } from '../pages/recap/ui/RecapEditorPage'
import { RecapThemesPage } from '../pages/recap/ui/RecapThemesPage'
import { AuthGate } from '../features/auth/ui/AuthGate'
import { useOptionalAuth } from '../features/auth/model/auth-context'
import { StatusPage, statusPathToKind } from '../pages/status/ui/StatusPage'
import { Component, type ErrorInfo, type ReactNode } from 'react'

const studioPages: Record<string, React.ReactNode> = {
  [studioRoutes.home]: <DashboardPage />,
  [studioRoutes.inviteThemes]: <TemplatesApiPage kind="invitation" />,
  [studioRoutes.invites]: <InvitationEditorLivePage />,
  [studioRoutes.siteThemes]: <WebsiteTemplatesApiPage />,
  [studioRoutes.siteEditor]: <WebsiteEditorLivePage />,
  [studioRoutes.site]: <WebsiteEditorLivePage />,
  [studioRoutes.guests]: <GuestsPageConnected />,
  [studioRoutes.guestCategories]: <GuestCategoriesConnectedV2 />,
  [studioRoutes.rsvps]: <RsvpsPageConnected />,
  [studioRoutes.wishes]: <WishesPageConnected />,
  [studioRoutes.todos]: <TodosPage />,
  [studioRoutes.giftLedger]: <GiftLedgerPage />,
  [studioRoutes.recap]: <RecapEditorPage />,
  [studioRoutes.recapThemes]: <RecapThemesPage />,
  [studioRoutes.analytics]: <AnalyticsPage />,
  [studioRoutes.events]: <WeddingEventsPage />,
  [studioRoutes.settings]: <WeddingSettingsPage />,
  [studioRoutes.profile]: <ProfilePage />,
}

const adminPageNames: Record<string, string> = {
  [adminRoutes.users]: 'Quản lý người dùng',
  [adminRoutes.subscriptions]: 'Quản lý gói đăng ký',
  [adminRoutes.inviteStyles]: 'Danh mục phong cách thiệp',
  [adminRoutes.websiteStyles]: 'Danh mục phong cách website',
  [adminRoutes.moderation]: 'Kiểm duyệt nội dung',
  [adminRoutes.operations]: 'Vận hành hệ thống',
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { void error; void info }
  render() { return this.state.hasError ? <StatusPage kind="server-error" onRetry={() => window.location.reload()} /> : this.props.children }
}

function AppContent() {
  const { pathname, navigate } = useNavigation()
  const auth = useOptionalAuth()

  useEffect(() => {
    const legacyMatch = pathname.match(/^\/app\/weddings\/[^/]+\/([^/]+)\/?$/)
    if (legacyMatch && legacyStudioRoutes[legacyMatch[1]]) {
      navigate(legacyStudioRoutes[legacyMatch[1]], true)
      return
    }
  }, [navigate, pathname])

  if (pathname === '/') return <HomePage />
  if (pathname === marketingRoutes.login) return <LoginPage />
  if (pathname === marketingRoutes.register) return <RegisterPage />
  if (pathname === marketingRoutes.verifyEmail) return <VerifyEmailPage />
  if (pathname === marketingRoutes.forgotPassword) return <ForgotPasswordPage />
  if (pathname === marketingRoutes.resetPassword) return <ResetPasswordPage />
  if (pathname === publicTemplateRoutes.modernLuxePreview) return <ModernLuxePreviewPage />
  if (pathname === publicTemplateRoutes.verdantPromisePreview) return <VerdantPromisePreviewPage />
  if (pathname === publicTemplateRoutes.chibiDaydreamPreview) return <ChibiDaydreamPreviewPage />
  if (pathname === publicTemplateRoutes.editorialVowsPreview) return <EditorialVowsPreviewPage />
  if (pathname === publicTemplateRoutes.greenHydrangeaPreview) return <GreenHydrangeaPreviewPage />
  if (pathname === publicTemplateRoutes.enchantedForestPreview) return <EnchantedForestPreviewPage />
  if (pathname === publicTemplateRoutes.cherryBlossomGardenPreview) return <CherryBlossomGardenPreviewPage />
  if (pathname === publicTemplateRoutes.redSpiderLilyRecapPreview) return <RedSpiderLilyRecapPreviewPage />
  const publicRecapMatch = pathname.match(/^\/public\/recaps\/([^/]+)\/?$/)
  if (publicRecapMatch) return <PublicRecapPage slug={decodeURIComponent(publicRecapMatch[1])} />
  if (pathname === adminRoutes.login) return <AdminLoginPage />
  const statusKind = statusPathToKind[pathname]
  if (statusKind) return <StatusPage kind={statusKind} />

  if (pathname === adminRoutes.home || pathname.startsWith(`${adminRoutes.home}/`)) {
    const content = pathname === adminRoutes.home
      ? <AdminDashboardPage />
      : pathname === adminRoutes.users
        ? <AdminUsersPage />
      : pathname === adminRoutes.inviteLibrary
        ? <AdminTemplatesApiPage kind="invitation" />
        : pathname === adminRoutes.websiteLibrary
          ? <AdminTemplatesApiPage kind="website" />
        : pathname === adminRoutes.recapLibrary
          ? <AdminTemplatesApiPage kind="recap" />
        : pathname === adminRoutes.music
          ? <AdminMusicPage />
        : <AdminPlaceholderPage title={adminPageNames[pathname] ?? 'Không tìm thấy trang'} />
    return <AuthGate surface="admin"><AdminShell>{content}</AdminShell></AuthGate>
  }

  const content = studioPages[pathname]
  if (content) {
    const connectedContent = pathname === studioRoutes.home && auth ? <WeddingDashboardPage /> : content
    return <AuthGate surface="studio"><WeddingWorkspace>{connectedContent}</WeddingWorkspace></AuthGate>
  }

  return <StatusPage kind="not-found" />
}

export function App() {
  return <AppErrorBoundary><AppContent /></AppErrorBoundary>
}

