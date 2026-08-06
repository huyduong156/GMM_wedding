const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export type WeddingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WeddingVisibility = 'PUBLIC' | 'PASSWORD_PROTECTED' | 'INVITE_ONLY'

export type Wedding = {
  id: string
  name: string
  status: WeddingStatus
  visibility: WeddingVisibility
  timezone: string
  locale: string
  primaryDate: string | null
  revision: number
  publishedAt: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export type WeddingEvent = {
  id: string
  weddingId: string
  name: string
  eventType: string
  startsAt: string
  endsAt: string | null
  timezone: string
  venueName: string | null
  addressLine: string | null
  mapUrl: string | null
  latitude: string | null
  longitude: string | null
  sortOrder: number
  isPublic: boolean
  revision: number
  createdAt: string
  updatedAt: string
}

export type Dashboard = {
  wedding: Wedding
  publication: {
    invitation: PublicationStatus
    website: PublicationStatus
    recap: { configured: boolean; published: boolean; slug: string | null; views: null }
  }
  metrics: {
    guests: number; invitations: number; activeInvitations: number; responses: number
    attending: number; declined: number; maybe: number; pendingResponses: number
    attendingPartySize: number; companions: number; pendingWishes: number; approvedWishes: number
  }
  nextEvent: WeddingEvent | null
  responseTrend: Array<{ date: string; count: number }>
  recentActivity: Array<{
    id: string; type: 'RSVP_SUBMITTED' | 'WISH_SUBMITTED'; displayName: string
    attendance: 'ATTENDING' | 'DECLINED' | 'MAYBE' | null; partySize: number | null; occurredAt: string
  }>
}

type PublicationStatus = {
  configured: boolean; published: boolean; slug: string | null
  templateName: string | null; templateVersion: string | null; views: null
}

type ApiErrorEnvelope = { error?: { code?: string; message?: string; fieldErrors?: Record<string, string[]> } }
export class WeddingApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly fieldErrors?: Record<string, string[]>) {
    super(message); this.name = 'WeddingApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init?.body ? { 'content-type': 'application/json', 'x-csrf-protection': '1' } : {}), ...init?.headers },
  })
  if (!response.ok) {
    let body: ApiErrorEnvelope = {}
    try { body = await response.json() as ApiErrorEnvelope } catch { /* gateway response */ }
    throw new WeddingApiError(response.status, body.error?.code ?? 'NETWORK_ERROR', body.error?.message ?? 'Không thể kết nối đến máy chủ.', body.error?.fieldErrors)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export type WeddingInput = { name: string; primaryDate?: string | null; timezone?: string; locale?: string; visibility?: WeddingVisibility }
export type EventInput = {
  name: string; eventType: string; startsAt: string; endsAt?: string | null; timezone: string
  venueName?: string | null; addressLine?: string | null; mapUrl?: string | null
  latitude?: number | null; longitude?: number | null; sortOrder?: number; isPublic?: boolean
}

export const weddingApi = {
  list: () => request<{ items: Wedding[] }>('/weddings'),
  create: (input: WeddingInput) => request<{ wedding: Wedding }>('/weddings', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<WeddingInput> & { status?: 'DRAFT' | 'ARCHIVED'; revision: number }) => request<{ wedding: Wedding }>(`/weddings/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => request<void>(`/weddings/${id}`, { method: 'DELETE', body: '{}' }),
  dashboard: (id: string) => request<{ dashboard: Dashboard }>(`/weddings/${id}/dashboard`),
  events: (id: string) => request<{ items: WeddingEvent[] }>(`/weddings/${id}/events`),
  createEvent: (id: string, input: EventInput) => request<{ event: WeddingEvent }>(`/weddings/${id}/events`, { method: 'POST', body: JSON.stringify(input) }),
  updateEvent: (weddingId: string, eventId: string, input: Partial<EventInput> & { revision: number }) => request<{ event: WeddingEvent }>(`/weddings/${weddingId}/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(input) }),
  removeEvent: (weddingId: string, eventId: string) => request<void>(`/weddings/${weddingId}/events/${eventId}`, { method: 'DELETE', body: '{}' }),
}
