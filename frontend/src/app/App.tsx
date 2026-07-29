import { useEffect } from 'react'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'
import { GuestsPage } from '../pages/guests/ui/GuestsPage'
import { PlaceholderPage } from '../pages/placeholder/ui/PlaceholderPage'
import { useNavigation } from '../shared/lib/navigation/navigation-context'
import { AppShell } from '../widgets/app-shell/ui/AppShell'

const sections = ['editor', 'templates', 'guests', 'rsvps', 'wishes', 'analytics', 'settings'] as const

export function App() {
  const { pathname, navigate } = useNavigation()
  const section = pathname.split('/').filter(Boolean).at(-1)

  useEffect(() => {
    if (pathname === '/' || (section !== 'overview' && !sections.includes(section as typeof sections[number]))) {
      navigate('/app/weddings/wed_mai_duc/overview', true)
    }
  }, [navigate, pathname, section])

  const content = section === 'overview'
    ? <DashboardPage />
    : section === 'guests'
      ? <GuestsPage />
    : sections.includes(section as typeof sections[number])
      ? <PlaceholderPage section={section as typeof sections[number]} />
      : null

  return <AppShell>{content}</AppShell>
}
