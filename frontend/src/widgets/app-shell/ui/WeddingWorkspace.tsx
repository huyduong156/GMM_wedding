import type { ReactNode } from 'react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { WeddingProvider } from '../../../entities/wedding/model/WeddingProvider'
import { useWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { WeddingOnboardingPage } from '../../../pages/wedding-onboarding/ui/WeddingOnboardingPage'
import { AppShell } from './AppShell'

function ConnectedWorkspace({ children }: { children: ReactNode }) {
  const { activeWedding, loading, error, refresh } = useWeddingWorkspace()
  if (loading) return <main className="workspace-boot" role="status"><span /><p>Đang chuẩn bị không gian cưới…</p></main>
  if (error) return <main className="workspace-boot"><h1>Chưa thể mở không gian cưới</h1><p>{error}</p><button className="button button-primary" onClick={() => void refresh()}>Thử lại</button></main>
  if (!activeWedding) return <WeddingOnboardingPage />
  return <AppShell>{children}</AppShell>
}

export function WeddingWorkspace({ children }: { children: ReactNode }) {
  const auth = useOptionalAuth()
  if (!auth) return <AppShell>{children}</AppShell>
  return <WeddingProvider><ConnectedWorkspace>{children}</ConnectedWorkspace></WeddingProvider>
}
