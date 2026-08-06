import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../../app/App'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { AuthProvider } from '../../../features/auth/model/AuthProvider'

const user = { id: 'user-1', email: 'owner@example.test', displayName: 'Minh Anh', emailVerifiedAt: '2026-01-01T00:00:00Z', locale: 'vi-VN', timezone: 'Asia/Ho_Chi_Minh', status: 'ACTIVE', roles: [] }
const wedding = { id: '00000000-0000-4000-8000-000000000001', name: 'Mai & Đức', status: 'DRAFT', visibility: 'PUBLIC', timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN', primaryDate: '2099-12-12T05:00:00Z', revision: 1, publishedAt: null, archivedAt: null, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }
const json = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))

afterEach(() => { vi.restoreAllMocks(); localStorage.clear() })

describe('connected Wedding workspace', () => {
  it('shows onboarding and creates the first wedding through the API', async () => {
    window.history.replaceState(null, '', '/studio')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const url = String(input)
      if (url.endsWith('/me')) return json({ user })
      if (url.endsWith('/weddings') && init?.method === 'POST') return json({ wedding }, 201)
      if (url.endsWith('/weddings')) return json({ items: [] })
      if (url.endsWith(`/weddings/${wedding.id}/dashboard`)) return json({ dashboard: { wedding, publication: { invitation: { configured: false, published: false, slug: null, templateName: null, templateVersion: null, views: null }, website: { configured: false, published: false, slug: null, templateName: null, templateVersion: null, views: null }, recap: { configured: false, published: false, slug: null, views: null } }, metrics: { guests: 0, invitations: 0, activeInvitations: 0, responses: 0, attending: 0, declined: 0, maybe: 0, pendingResponses: 0, attendingPartySize: 0, companions: 0, pendingWishes: 0, approvedWishes: 0 }, nextEvent: null, responseTrend: [], recentActivity: [] } })
      return json({}, 404)
    })
    render(<NavigationProvider><AuthProvider><App /></AuthProvider></NavigationProvider>)
    expect(await screen.findByRole('heading', { name: 'Tạo đám cưới của bạn' })).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Tên hai bạn hoặc tên đám cưới'), 'Mai & Đức')
    await userEvent.click(screen.getByRole('button', { name: 'Bắt đầu chuẩn bị' }))
    expect(await screen.findByRole('heading', { name: 'Chào Minh Anh' })).toBeInTheDocument()
    const createCall = fetchMock.mock.calls.find(([, init]) => init?.method === 'POST')
    expect(createCall?.[1]?.headers).toMatchObject({ 'content-type': 'application/json', 'x-csrf-protection': '1' })
  })

  it('renders API dashboard data for an existing wedding', async () => {
    window.history.replaceState(null, '', '/studio')
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = String(input)
      if (url.endsWith('/me')) return json({ user })
      if (url.endsWith('/weddings')) return json({ items: [wedding] })
      if (url.endsWith('/dashboard')) return json({ dashboard: { wedding, publication: { invitation: { configured: false, published: false, slug: null, templateName: null, templateVersion: null, views: null }, website: { configured: false, published: false, slug: null, templateName: null, templateVersion: null, views: null }, recap: { configured: false, published: false, slug: null, views: null } }, metrics: { guests: 12, invitations: 10, activeInvitations: 10, responses: 7, attending: 6, declined: 1, maybe: 0, pendingResponses: 3, attendingPartySize: 8, companions: 2, pendingWishes: 0, approvedWishes: 0 }, nextEvent: null, responseTrend: Array.from({ length: 30 }, (_, index) => ({ date: `2026-08-${String(index + 1).padStart(2, '0')}`, count: 0 })), recentActivity: [] } })
      return json({}, 404)
    })
    render(<NavigationProvider><AuthProvider><App /></AuthProvider></NavigationProvider>)
    expect(await screen.findByText('12')).toBeInTheDocument()
    expect(screen.getByText('Còn 3 lời mời đang chờ phản hồi.')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Mai & Đức')).toBeInTheDocument())
  })
})
