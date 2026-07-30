import { useEffect } from 'react'
import { LoginPage } from '../pages/auth/ui/LoginPage'
import { AdminDashboardPage } from '../pages/admin/ui/AdminDashboardPage'
import { AdminThemesPage } from '../pages/admin/ui/AdminThemesPage'
import { AdminPlaceholderPage } from '../pages/admin/ui/AdminPlaceholderPage'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'
import { GuestsPage } from '../pages/guests/ui/GuestsPage'
import { GuestCategoriesPage } from '../pages/guest-categories/ui/GuestCategoriesPage'
import { TemplatesPage } from '../pages/templates/ui/TemplatesPage'
import { RsvpsPage } from '../pages/rsvps/ui/RsvpsPage'
import { WishesPage } from '../pages/wishes/ui/WishesPage'
import { PlaceholderPage } from '../pages/placeholder/ui/PlaceholderPage'
import { useNavigation } from '../shared/lib/navigation/navigation-context'
import { adminRoutes, legacyStudioRoutes, studioRoutes } from '../shared/config/routes'
import { AppShell } from '../widgets/app-shell/ui/AppShell'
import { AdminShell } from '../widgets/admin-shell/ui/AdminShell'

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
  [studioRoutes.analytics]: <PlaceholderPage section="analytics" />,
  [studioRoutes.settings]: <PlaceholderPage section="settings" />,
}

const adminPageNames: Record<string, string> = {
  [adminRoutes.users]: 'Quản lý người dùng',
  [adminRoutes.weddings]: 'Quản lý đám cưới',
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
    if (pathname === '/') navigate('/login', true)
  }, [navigate, pathname])

  if (pathname === '/login') return <LoginPage />

  if (pathname.startsWith('/admin')) {
    const content = pathname === adminRoutes.home
      ? <AdminDashboardPage />
      : pathname === adminRoutes.themes
        ? <AdminThemesPage />
        : <AdminPlaceholderPage title={adminPageNames[pathname] ?? 'Không tìm thấy trang'} />
    return <AdminShell>{content}</AdminShell>
  }

  const content = studioPages[pathname]
  if (content) return <AppShell>{content}</AppShell>

  return null
}
