import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../pages/DashboardPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { useNavigation } from './navigation-context'

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
    : sections.includes(section as typeof sections[number])
      ? <PlaceholderPage section={section as typeof sections[number]} />
      : null

  return <AppShell>{content}</AppShell>
}
import { useEffect } from 'react'
