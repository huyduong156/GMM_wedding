const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export type WeddingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WeddingVisibility = 'PUBLIC' | 'PASSWORD_PROTECTED' | 'INVITE_ONLY'
export type WeddingSurface = 'ONLINE_INVITATION' | 'WEDDING_WEBSITE'

export type TemplateSectionConfig = string | {
  sectionKey: string
  label?: string
  required?: boolean
  canToggle?: boolean
  canReorder?: boolean
  fields?: Record<string, TemplateFieldConfig>
}

export type TemplateFieldConfig = {
  type: 'string' | 'text' | 'date' | 'time' | 'url' | 'boolean' | 'select' | 'items' | 'image' | 'images' | 'audio'
  label?: string
  required?: boolean
  maxLength?: number
  maxItems?: number
  default?: unknown
  options?: Array<{ key: string; label: string }>
  itemFields?: Record<string, TemplateFieldConfig>
  contentKey?: string
}

export type TemplateVersion = {
  id: string
  version: string
  configHash: string
  templateConfigVersion: number
  contentSchemaVersion: number
  rendererApiVersion: number
  config: { sections?: TemplateSectionConfig[]; palettes?: Array<{ key: string; label: string; default?: boolean }>; style?: string; palette?: string; badge?: string } & Record<string, unknown>
  releasedAt: string | null
  deprecatedAt: string | null
}

export type WeddingTemplate = {
  key: string
  name: string
  productType: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
  status: string
  description: string | null
  versions: TemplateVersion[]
}

export type WeddingContent = {
  content: Record<string, unknown>
  schemaVersion: number
  revision: number
  surface: WeddingSurface
  themeConfig: Record<string, unknown>
  sectionConfig: { enabled: string[]; order: string[] }
  templateVersion: { id: string; key: string; version: string; config: Record<string, unknown> } | null
}

export type MediaAsset = {
  id: string
  status: string
  mimeType: string
  sizeBytes: number
  publicUrl: string
  originalName?: string | null
}

export type PublishedWeddingSnapshot = {
  id: string
  weddingId: string
  surface: WeddingSurface
  slug: string
  version: number
  payload: Record<string, unknown>
  publishedAt: string
  templateVersion: { key: string; version: string }
}

type MediaUploadIntent = {
  media: MediaAsset
  upload: { uploadUrl: string; method: 'PUT'; headers: Record<string, string>; expiresAt: string }
}

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

async function uploadMediaFile(weddingId: string, file: File): Promise<MediaAsset> {
  const intent = await request<MediaUploadIntent>(`/weddings/${weddingId}/media/upload-intents`, {
    method: 'POST', body: JSON.stringify({ mimeType: file.type, sizeBytes: file.size, originalName: file.name }),
  })
  const isBackendUpload = intent.upload.uploadUrl === 'backend-upload'
  const uploadUrl = isBackendUpload ? `${apiBaseUrl}/weddings/${weddingId}/media/${intent.media.id}/upload` : intent.upload.uploadUrl
  const uploaded = await fetch(uploadUrl, {
    method: intent.upload.method, body: file, credentials: isBackendUpload ? 'include' : 'omit',
    headers: { ...intent.upload.headers, ...(isBackendUpload ? { 'x-csrf-protection': '1' } : {}) },
  })
  if (!uploaded.ok) throw new WeddingApiError(uploaded.status, 'MEDIA_UPLOAD_FAILED', 'Không thể tải ảnh lên kho media.')
  const completed = await request<{ media: MediaAsset }>(`/weddings/${weddingId}/media/${intent.media.id}/complete`, { method: 'POST', body: '{}' })
  const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin
  return { ...completed.media, publicUrl: completed.media.publicUrl.startsWith('/') ? new URL(completed.media.publicUrl, apiOrigin).toString() : completed.media.publicUrl }
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
  templates: (productType: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE') => request<{ items: WeddingTemplate[] }>(`/templates?productType=${productType}`),
  content: (weddingId: string, surface: WeddingSurface) => request<{ content: WeddingContent }>(`/weddings/${weddingId}/content?surface=${surface}`),
  saveContent: (weddingId: string, input: {
    surface: WeddingSurface
    templateVersionId: string
    content: Record<string, unknown>
    themeConfig: Record<string, unknown>
    sectionConfig: { enabled: string[]; order: string[] }
    revision: number
  }) => request<{ content: WeddingContent }>(`/weddings/${weddingId}/content`, { method: 'PUT', body: JSON.stringify({ ...input, content: typeof input.content === 'object' && !Array.isArray(input.content) ? input.content : {}, themeConfig: typeof input.themeConfig === 'object' && !Array.isArray(input.themeConfig) ? input.themeConfig : {}, sectionConfig: typeof input.sectionConfig === 'object' && !Array.isArray(input.sectionConfig) ? input.sectionConfig : { enabled: [], order: [] } }) }),
  slugAvailable: (slug: string, weddingId?: string) => request<{ available: boolean }>(`/slugs/weddings/${encodeURIComponent(slug)}/availability${weddingId ? `?weddingId=${encodeURIComponent(weddingId)}` : ''}`),
  publish: (weddingId: string, input: { surface: WeddingSurface; slug: string; revision: number }) => request<{ snapshot: PublishedWeddingSnapshot }>(`/weddings/${weddingId}/publish`, { method: 'POST', body: JSON.stringify(input) }),
  unpublish: (weddingId: string, surface: WeddingSurface) => request<void>(`/weddings/${weddingId}/unpublish`, { method: 'POST', body: JSON.stringify({ surface }) }),
  uploadMedia: uploadMediaFile,
}
