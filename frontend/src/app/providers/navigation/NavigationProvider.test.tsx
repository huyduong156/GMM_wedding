import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthGate } from '../../../features/auth/ui/AuthGate'
import { AuthContext } from '../../../features/auth/model/auth-context'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { useNavigation } from '../../../shared/lib/navigation/navigation-context'
import { NavigationProvider } from './NavigationProvider'

describe('studio navigation response', () => {
  it('keeps navigation stable and does not recheck the session on each internal click', async () => {
    window.history.replaceState(null, '', '/studio')
    const checkUserSession = vi.fn().mockResolvedValue(true)
    const auth = {
      user: null,
      adminActor: null,
      checkUserSession,
      checkAdminSession: vi.fn().mockResolvedValue(true),
      login: vi.fn(),
      loginAdmin: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    }
    const callbacks: Array<ReturnType<typeof useNavigation>['navigate']> = []
    function Page() {
      const { pathname, navigate } = useNavigation()
      callbacks.push(navigate)
      return (
        <>
          <output>{pathname}</output>
          <AppLink to="/studio/guests">Khách mời</AppLink>
          <AppLink to="/studio/todos">Công việc</AppLink>
        </>
      )
    }
    render(
      <NavigationProvider>
        <AuthContext.Provider value={auth}>
          <AuthGate surface="studio">
            <Page />
          </AuthGate>
        </AuthContext.Provider>
      </NavigationProvider>,
    )
    await screen.findByRole('link', { name: 'Khách mời' })
    fireEvent.click(screen.getByRole('link', { name: 'Khách mời' }))
    expect(screen.getByText('/studio/guests')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Công việc' }))
    expect(screen.getByText('/studio/todos')).toBeInTheDocument()
    await waitFor(() => expect(checkUserSession).toHaveBeenCalledTimes(1))
    expect(new Set(callbacks).size).toBe(1)
  })
})
