import { createElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeddingApiError, weddingApi } from '../../../shared/api/weddings'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'

const rsvpController = {
  isPersonalized: false,
  submit: vi.fn(),
  submitting: false,
  submitted: false,
  error: '',
}
const wishesController = {
  items: [],
  submit: vi.fn(),
  submitting: false,
  submitted: false,
  error: '',
}

vi.mock('../../../features/auth/model/auth-context', () => ({ useOptionalAuth: () => undefined }))
vi.mock('../../../shared/lib/navigation/usePublicRsvp', () => ({
  usePublicRsvp: () => rsvpController,
}))
vi.mock('../../../shared/lib/navigation/usePublicWishes', () => ({
  usePublicWishes: () => wishesController,
}))
vi.mock('../../../templates/invitations/modern-luxe/ModernLuxeInvitation', () => ({
  ModernLuxeInvitation: ({ interactions }: { interactions?: { guestName: string | null } }) =>
    createElement('div', { 'data-testid': 'renderer' }, interactions?.guestName ?? 'no-guest-name'),
}))
vi.mock('../../../templates/invitations/verdant-promise/VerdantPromiseInvitation', () => ({
  VerdantPromiseInvitation: () => createElement('div', { 'data-testid': 'renderer' }, 'verdant'),
}))
vi.mock('../../../templates/invitations/chibi-daydream/ChibiDaydreamInvitation', () => ({
  ChibiDaydreamInvitation: () => createElement('div', { 'data-testid': 'renderer' }, 'chibi'),
}))
vi.mock('../../../templates/invitations/peony-veranda/PeonyVerandaInvitation', () => ({
  PeonyVerandaInvitation: () => createElement('div', { 'data-testid': 'renderer' }, 'peony'),
}))

import { PublicInvitationPage } from './PublicInvitationPage'

const snapshot = {
  id: 'snapshot-1',
  weddingId: 'wedding-1',
  surface: 'ONLINE_INVITATION' as const,
  slug: 'mai-duc',
  version: 1,
  publishedAt: '2026-01-01T00:00:00.000Z',
  payload: { template: { key: 'modern-luxe' }, content: {}, theme: {} },
  templateVersion: { key: 'modern-luxe', version: '1.0.0' },
}

function renderPage(props: { weddingSlug: string; guestSlug?: string }) {
  return render(createElement(NavigationProvider, null, createElement(PublicInvitationPage, props)))
}

describe('PublicInvitationPage guest identity flow', () => {
  it('renders the Peony Veranda invitation renderer', async () => {
    const invitation = vi.spyOn(weddingApi, 'publicInvitation').mockResolvedValue({
      snapshot: {
        ...snapshot,
        payload: { ...snapshot.payload, template: { key: 'peony-veranda' } },
        templateVersion: { key: 'peony-veranda', version: '1.0.0' },
      },
    })
    renderPage({ weddingSlug: 'mai-duc' })
    expect(await screen.findByTestId('renderer')).toHaveTextContent('peony')
    invitation.mockRestore()
  })

  it('loads the common invitation without calling the guest endpoint', async () => {
    const invitation = vi.spyOn(weddingApi, 'publicInvitation').mockResolvedValue({ snapshot })
    const guest = vi.spyOn(weddingApi, 'publicInvitationGuest')

    renderPage({ weddingSlug: 'mai-duc' })

    expect(await screen.findByTestId('renderer')).toHaveTextContent('no-guest-name')
    expect(invitation).toHaveBeenCalledWith('mai-duc')
    expect(guest).not.toHaveBeenCalled()
    invitation.mockRestore()
    guest.mockRestore()
  })

  it('loads the guest identity once and passes guestName through interactions', async () => {
    const invitation = vi.spyOn(weddingApi, 'publicInvitation').mockResolvedValue({ snapshot })
    const guest = vi.spyOn(weddingApi, 'publicInvitationGuest').mockResolvedValue({
      invitation: {
        weddingSlug: 'mai-duc',
        invitationSlug: 'anh-ba-hung',
        guestName: 'Anh Ba Hưng',
        maxPartySize: 2,
        expiresAt: null,
      },
    })

    renderPage({ weddingSlug: 'mai-duc', guestSlug: 'anh-ba-hung' })

    expect(await screen.findByTestId('renderer')).toHaveTextContent('Anh Ba Hưng')
    await waitFor(() => expect(guest).toHaveBeenCalledTimes(1))
    expect(invitation).toHaveBeenCalledTimes(1)
    invitation.mockRestore()
    guest.mockRestore()
  })

  it('keeps the common snapshot renderable while a guest lookup fails temporarily', async () => {
    const invitation = vi.spyOn(weddingApi, 'publicInvitation').mockResolvedValue({ snapshot })
    const guest = vi
      .spyOn(weddingApi, 'publicInvitationGuest')
      .mockRejectedValue(new Error('Network error'))

    renderPage({ weddingSlug: 'mai-duc', guestSlug: 'anh-ba-hung' })

    expect(await screen.findByTestId('renderer')).toHaveTextContent('no-guest-name')
    invitation.mockRestore()
    guest.mockRestore()
  })

  it('shows not found when the guest slug is invalid', async () => {
    const invitation = vi.spyOn(weddingApi, 'publicInvitation').mockResolvedValue({ snapshot })
    const guest = vi
      .spyOn(weddingApi, 'publicInvitationGuest')
      .mockRejectedValue(new WeddingApiError(404, 'RESOURCE_NOT_FOUND', 'Guest link not found'))

    renderPage({ weddingSlug: 'mai-duc', guestSlug: 'missing' })

    await waitFor(() => expect(screen.queryByTestId('renderer')).not.toBeInTheDocument())
    expect(screen.getByText(/không tìm thấy/i)).toBeInTheDocument()
    invitation.mockRestore()
    guest.mockRestore()
  })
})
