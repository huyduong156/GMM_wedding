const apiBaseUrl = (
  import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api')
).replace(/\/$/, '')

export type WeddingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WeddingVisibility = 'PUBLIC' | 'PASSWORD_PROTECTED' | 'INVITE_ONLY'
export type WeddingSurface = 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
export type RecapSectionConfig = { enabled: string[]; order: string[] }

export type TemplateSectionConfig =
  | string
  | {
      sectionKey: string
      label?: string
      required?: boolean
      canToggle?: boolean
      canReorder?: boolean
      fields?: Record<string, TemplateFieldConfig>
      repeatable?: boolean
      minItems?: number
      maxItems?: number
      emptyMessage?: string
      recommendedMinItems?: number
      itemMediaField?: string
      galleryField?: string
      maxMediaPerItem?: number
      interaction?: string
      mediaRoles?: string[]
      itemFields?: Record<string, TemplateFieldConfig>
    }

export type TemplateFieldConfig = {
  type:
    | 'string'
    | 'text'
    | 'date'
    | 'time'
    | 'url'
    | 'boolean'
    | 'select'
    | 'items'
    | 'image'
    | 'images'
    | 'audio'
  label?: string
  required?: boolean
  maxLength?: number
  maxItems?: number
  emptyMessage?: string
  recommendedMinItems?: number
  default?: unknown
  options?: readonly { key: string; label: string }[]
  itemFields?: Record<string, TemplateFieldConfig>
  contentKey?: string
  mediaRole?: string
  mediaValue?: 'url' | 'object'
  audioNameKey?: string
  maxSizeMb?: number
}

export type TemplateVersion = {
  id: string
  version: string
  configHash: string
  templateConfigVersion: number
  contentSchemaVersion: number
  rendererApiVersion: number
  config: {
    sections?: TemplateSectionConfig[]
    palettes?: Array<{ key: string; label: string; default?: boolean }>
    style?: string
    palette?: string
    badge?: string
  } & Record<string, unknown>
  releasedAt: string | null
  deprecatedAt: string | null
}

export type WeddingTemplate = {
  key: string
  name: string
  productType: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
  status: string
  description: string | null
  styles?: Array<{ id: string; key: string; name: string }>
  versions: TemplateVersion[]
}
export type RecapMediaItem = {
  id: string
  mediaAssetId: string
  caption: string | null
  sortOrder: number
  publicUrl: string
}
export type RecapWishSelection = {
  id: string
  wishId: string
  sortOrder: number
  authorName: string
  content: string
  isPinned: boolean
}
export type RecapDraft = {
  id: string
  weddingId: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  slug: string | null
  title: string
  thankYouMessage: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImageUrl: string | null
  content: Record<string, unknown>
  themeConfig: Record<string, unknown>
  sectionConfig: RecapSectionConfig
  revision: number
  publishedAt: string | null
  updatedAt: string
  templateVersion: { id: string; key: string; version: string; config: Record<string, unknown> }
  mediaItems: RecapMediaItem[]
  wishSelections: RecapWishSelection[]
}

export type WeddingContent = {
  content: Record<string, unknown>
  schemaVersion: number
  revision: number
  surface: WeddingSurface
  themeConfig: Record<string, unknown>
  sectionConfig: { enabled: string[]; order: string[] }
  templateVersion: {
    id: string
    key: string
    version: string
    config: Record<string, unknown>
  } | null
}

export type MediaAsset = {
  id: string
  status: string
  mimeType: string
  sizeBytes: number
  publicUrl: string
  originalName?: string | null
  createdAt?: string
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
  slug: string | null
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

export type Guest = {
  id: string
  weddingId: string
  categoryId: string | null
  groupId: string | null
  name: string
  displayName: string | null
  slug?: string | null
  phone: string | null
  email: string | null
  note: string | null
  tableName: string | null
  maxPartySize: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type GuestCategory = {
  id: string
  weddingId: string
  parentId: string | null
  name: string
  depth: 1 | 2 | 3
  sortOrder: number
  guestCount?: number
  createdAt: string
  updatedAt: string
}

export type GuestInput = {
  name: string
  displayName?: string | null
  categoryId?: string | null
  groupId?: string | null
  phone?: string | null
  email?: string | null
  note?: string | null
  tableName?: string | null
  maxPartySize?: number
  tags?: string[]
}

export type GuestCategoryInput = { name: string; parentId?: string | null; sortOrder?: number }

export type Dashboard = {
  wedding: Wedding
  publication: {
    invitation: PublicationStatus
    website: PublicationStatus
    recap: { configured: boolean; published: boolean; slug: string | null; views: null }
  }
  metrics: {
    guests: number
    invitations: number
    activeInvitations: number
    responses: number
    attending: number
    declined: number
    maybe: number
    pendingResponses: number
    attendingPartySize: number
    companions: number
    pendingWishes: number
    approvedWishes: number
  }
  nextEvent: WeddingEvent | null
  responseTrend: Array<{ date: string; count: number }>
  recentActivity: Array<{
    id: string
    type: 'RSVP_SUBMITTED' | 'WISH_SUBMITTED'
    displayName: string
    attendance: 'ATTENDING' | 'DECLINED' | 'MAYBE' | null
    partySize: number | null
    occurredAt: string
  }>
}

export type Analytics = {
  guests: { total: number; attending: number; attendanceRate: number }
  tasks: {
    total: number
    completed: number
    completedRate: number
    byStatus: { todo: number; inProgress: number; done: number; cancelled: number }
    byPriority: { low: number; medium: number; high: number; urgent: number }
    recentCompleted: Array<{ id: string; title: string; completedAt: string }>
  }
  gifts: { entryCount: number; linkedGuestCount: number; anonymousEntryCount: number }
  wishes: {
    total: number
    pending: number
    approved: number
    rejected: number
    spam: number
    hidden: number
  }
}

type PublicationStatus = {
  configured: boolean
  published: boolean
  slug: string | null
  templateName: string | null
  templateVersion: string | null
  views: null
}

type ApiErrorEnvelope = {
  error?: { code?: string; message?: string; fieldErrors?: Record<string, string[]> }
}
export class WeddingApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'WeddingApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'content-type': 'application/json', 'x-csrf-protection': '1' } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    let body: ApiErrorEnvelope = {}
    try {
      body = (await response.json()) as ApiErrorEnvelope
    } catch {
      /* gateway response */
    }
    throw new WeddingApiError(
      response.status,
      body.error?.code ?? 'NETWORK_ERROR',
      body.error?.message ?? 'Không thể kết nối đến máy chủ.',
      body.error?.fieldErrors,
    )
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

async function uploadMediaFile(weddingId: string, file: File): Promise<MediaAsset> {
  const intent = await request<MediaUploadIntent>(`/weddings/${weddingId}/media/upload-intents`, {
    method: 'POST',
    body: JSON.stringify({ mimeType: file.type, sizeBytes: file.size, originalName: file.name }),
  })
  const isBackendUpload = intent.upload.uploadUrl === 'backend-upload'
  const uploadUrl = isBackendUpload
    ? `${apiBaseUrl}/weddings/${weddingId}/media/${intent.media.id}/upload`
    : intent.upload.uploadUrl
  const uploaded = await fetch(uploadUrl, {
    method: intent.upload.method,
    body: file,
    credentials: isBackendUpload ? 'include' : 'omit',
    headers: { ...intent.upload.headers, ...(isBackendUpload ? { 'x-csrf-protection': '1' } : {}) },
  })
  if (!uploaded.ok)
    throw new WeddingApiError(
      uploaded.status,
      'MEDIA_UPLOAD_FAILED',
      'Không thể tải ảnh lên kho media.',
    )
  const completed = await request<{ media: MediaAsset }>(
    `/weddings/${weddingId}/media/${intent.media.id}/complete`,
    { method: 'POST', body: '{}' },
  )
  const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin
  return {
    ...completed.media,
    publicUrl: completed.media.publicUrl.startsWith('/')
      ? new URL(completed.media.publicUrl, apiOrigin).toString()
      : completed.media.publicUrl,
  }
}

export type WeddingInput = {
  name: string
  primaryDate?: string | null
  timezone?: string
  locale?: string
  visibility?: WeddingVisibility
}
export type EventInput = {
  name: string
  eventType: string
  startsAt: string
  endsAt?: string | null
  timezone: string
  venueName?: string | null
  addressLine?: string | null
  mapUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  sortOrder?: number
  isPublic?: boolean
}

export type RsvpAttendance = 'ATTENDING' | 'DECLINED' | 'MAYBE'
export type Rsvp = {
  id: string
  weddingId: string
  invitationId: string
  guestId: string | null
  guestName: string
  guestPhone: string | null
  guestEmail: string | null
  categoryId: string | null
  groupId: string | null
  invitationLabel: string | null
  invitationStatus: string
  attendance: RsvpAttendance
  partySize: number
  mealPreference: string | null
  specialRequest: string | null
  message: string | null
  submittedAt: string
  updatedAt: string
  revision: number
  eventSelections: Array<{ eventId: string; eventName: string; attending: boolean }>
  companions: Array<{
    id: string
    displayName: string
    mealPreference: string | null
    sortOrder: number
  }>
}
export type WishStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM' | 'HIDDEN'
export type Wish = {
  id: string
  authorName: string
  guestName: string
  guestId: string | null
  invitationId: string | null
  content: string
  status: WishStatus
  isPinned: boolean
  submittedAt: string
  moderatedAt: string | null
}
export type PublicRsvpInput = {
  guestName?: string
  attendance: RsvpAttendance
  partySize: number
  mealPreference?: string
  specialRequest?: string
  message?: string
}
export type PublicWish = {
  id: string
  authorName: string
  content: string
  submittedAt: string
  isPinned: boolean
}
export type TemplateStyle = { id: string; key: string; name: string; description?: string | null }
export const weddingApi = {
  list: () => request<{ items: Wedding[] }>('/weddings'),
  get: (id: string) => request<{ wedding: Wedding }>(`/weddings/${id}`),
  status: (id: string) =>
    request<{ wedding: Pick<Wedding, 'id' | 'slug' | 'status' | 'revision' | 'publishedAt'> }>(
      `/weddings/${id}`,
    ),
  create: (input: WeddingInput) =>
    request<{ wedding: Wedding }>('/weddings', { method: 'POST', body: JSON.stringify(input) }),
  update: (
    id: string,
    input: Partial<WeddingInput> & { status?: 'DRAFT' | 'ARCHIVED'; revision: number },
  ) =>
    request<{ wedding: Wedding }>(`/weddings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (id: string) => request<void>(`/weddings/${id}`, { method: 'DELETE', body: '{}' }),
  dashboard: (id: string) => request<{ dashboard: Dashboard }>(`/weddings/${id}/dashboard`),
  analytics: (id: string) => request<{ analytics: Analytics }>(`/weddings/${id}/analytics`),
  events: (id: string) => request<{ items: WeddingEvent[] }>(`/weddings/${id}/events`),
  createEvent: (id: string, input: EventInput) =>
    request<{ event: WeddingEvent }>(`/weddings/${id}/events`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateEvent: (
    weddingId: string,
    eventId: string,
    input: Partial<EventInput> & { revision: number },
  ) =>
    request<{ event: WeddingEvent }>(`/weddings/${weddingId}/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  removeEvent: (weddingId: string, eventId: string) =>
    request<void>(`/weddings/${weddingId}/events/${eventId}`, { method: 'DELETE', body: '{}' }),
  templateStyles: () => request<{ items: TemplateStyle[] }>('/template-styles'),
  templates: (productType: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP', styleKey?: string) =>
    request<{ items: WeddingTemplate[] }>(
      `/templates?productType=` +
        productType +
        `${styleKey ? `&styleKey=` + encodeURIComponent(styleKey) : ''}`,
    ),
  content: (weddingId: string, surface: WeddingSurface) =>
    request<{ content: WeddingContent }>(`/weddings/${weddingId}/content?surface=${surface}`),
  saveContent: (
    weddingId: string,
    input: {
      surface: WeddingSurface
      templateVersionId: string
      content: Record<string, unknown>
      themeConfig: Record<string, unknown>
      sectionConfig: { enabled: string[]; order: string[] }
      revision: number
    },
  ) =>
    request<{ content: WeddingContent }>(`/weddings/${weddingId}/content`, {
      method: 'PUT',
      body: JSON.stringify({
        ...input,
        content:
          typeof input.content === 'object' && !Array.isArray(input.content) ? input.content : {},
        themeConfig:
          typeof input.themeConfig === 'object' && !Array.isArray(input.themeConfig)
            ? input.themeConfig
            : {},
        sectionConfig:
          typeof input.sectionConfig === 'object' && !Array.isArray(input.sectionConfig)
            ? input.sectionConfig
            : { enabled: [], order: [] },
      }),
    }),
  slugAvailable: (slug: string, weddingId?: string) =>
    request<{ available: boolean }>(
      `/slugs/weddings/${encodeURIComponent(slug)}/availability${weddingId ? `?weddingId=${encodeURIComponent(weddingId)}` : ''}`,
    ),
  publish: (weddingId: string, input: { surface: WeddingSurface; revision: number }) =>
    request<{ snapshot: PublishedWeddingSnapshot }>(`/weddings/${weddingId}/publish`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  unpublish: (weddingId: string, input: { surface: WeddingSurface; revision?: number }) =>
    request<void>(`/weddings/${weddingId}/unpublish`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  uploadMedia: uploadMediaFile,
  media: (weddingId: string) => request<{ items: MediaAsset[] }>(`/weddings/${weddingId}/media`),
  removeMedia: (weddingId: string, mediaId: string) =>
    request<void>(`/weddings/${weddingId}/media/${mediaId}`, { method: 'DELETE', body: '{}' }),
  recap: (weddingId: string) =>
    request<{ recap: RecapDraft | null }>(`/weddings/${weddingId}/recap`),
  publishRecap: (weddingId: string, input: { revision: number }) =>
    request<{ snapshot: { slug: string; payload: Record<string, unknown> } }>(
      `/weddings/${weddingId}/publish`,
      { method: 'POST', body: JSON.stringify({ surface: 'RECAP', ...input }) },
    ),
  publicRecap: (slug: string) =>
    request<{ snapshot: { slug: string; payload: Record<string, unknown> } }>(
      `/public/recaps/${encodeURIComponent(slug)}`,
    ),
  publicInvitation: (weddingSlug: string) =>
    request<{ snapshot: PublishedWeddingSnapshot }>(
      `/public/invitations/${encodeURIComponent(weddingSlug)}`,
    ),
  publicInvitationGuest: (weddingSlug: string, guestSlug: string) =>
    request<{
      invitation: {
        weddingSlug: string
        invitationSlug: string
        guestName: string | null
        maxPartySize: number
        expiresAt: string | null
      }
    }>(`/public/invitations/${encodeURIComponent(weddingSlug)}/${encodeURIComponent(guestSlug)}`),
  publicRsvp: (weddingSlug: string, input: PublicRsvpInput) =>
    request<{ rsvp: Rsvp }>(`/public/weddings/${encodeURIComponent(weddingSlug)}/rsvps`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  publicPersonalRsvp: (weddingSlug: string, guestSlug: string, input: PublicRsvpInput) =>
    request<{ rsvp: Rsvp }>(
      `/public/invitations/${encodeURIComponent(weddingSlug)}/${encodeURIComponent(guestSlug)}/rsvp`,
      { method: 'PUT', body: JSON.stringify(input) },
    ),
  publicWish: (weddingSlug: string, input: { guestName?: string; content: string }) =>
    request<{ wish: Wish }>(`/public/weddings/${encodeURIComponent(weddingSlug)}/wishes`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  publicPersonalWish: (
    weddingSlug: string,
    guestSlug: string,
    input: { guestName?: string; content: string },
  ) =>
    request<{ wish: Wish }>(
      `/public/invitations/${encodeURIComponent(weddingSlug)}/${encodeURIComponent(guestSlug)}/wishes`,
      { method: 'POST', body: JSON.stringify(input) },
    ),
  publicWishes: (weddingSlug: string) =>
    request<{ wishes: PublicWish[] }>(`/public/weddings/${encodeURIComponent(weddingSlug)}/wishes`),
  publicWebsite: (weddingSlug: string) =>
    request<{ snapshot: PublishedWeddingSnapshot }>(
      `/public/websites/${encodeURIComponent(weddingSlug)}`,
    ),
  saveRecap: (
    weddingId: string,
    input: {
      templateVersionId: string
      title: string
      thankYouMessage?: string | null
      ogTitle?: string | null
      ogDescription?: string | null
      ogImageUrl?: string | null
      content: Record<string, unknown>
      themeConfig: Record<string, unknown>
      sectionConfig: RecapSectionConfig
      mediaItems: Array<{ mediaAssetId: string; caption?: string | null; sortOrder: number }>
      wishSelections: Array<{ wishId: string; sortOrder: number }>
      revision: number
    },
  ) =>
    request<{ recap: RecapDraft }>(`/weddings/${weddingId}/recap`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  recapSlugAvailable: (slug: string, weddingId?: string) =>
    request<{ available: boolean }>(
      `/slugs/recaps/${encodeURIComponent(slug)}/availability${weddingId ? `?weddingId=${encodeURIComponent(weddingId)}` : ''}`,
    ),
}

export const guestApi = {
  list: (
    weddingId: string,
    params: { q?: string; categoryId?: string; limit?: number; cursor?: string } = {},
  ) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.categoryId) query.set('categoryId', params.categoryId)
    query.set('limit', String(params.limit ?? 100))
    if (params.cursor) query.set('cursor', params.cursor)
    return request<{ items: Guest[]; nextCursor: string | null }>(
      `/weddings/${weddingId}/guests?${query}`,
    )
  },
  create: (weddingId: string, input: GuestInput) =>
    request<{ guest: Guest }>(`/weddings/${weddingId}/guests`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (weddingId: string, guestId: string, input: Partial<GuestInput>) =>
    request<{ guest: Guest }>(`/weddings/${weddingId}/guests/${guestId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  removeMany: (weddingId: string, ids: string[]) =>
    request<{ deletedCount: number }>(`/weddings/${weddingId}/guests/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
  assignCategory: (weddingId: string, guestIds: string[], categoryId: string | null) =>
    request<{ updatedCount: number }>(`/weddings/${weddingId}/guests/bulk-assign-category`, {
      method: 'POST',
      body: JSON.stringify({ guestIds, categoryId }),
    }),
}

export const guestCategoryApi = {
  list: (weddingId: string) =>
    request<{ items: GuestCategory[] }>(`/weddings/${weddingId}/guest-categories`),
  create: (weddingId: string, input: GuestCategoryInput) => {
    const payload = input.parentId === null ? { ...input, parentId: undefined } : input
    return request<{ category: GuestCategory }>(`/weddings/${weddingId}/guest-categories`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  update: (weddingId: string, categoryId: string, input: Partial<GuestCategoryInput>) =>
    request<{ category: GuestCategory }>(`/weddings/${weddingId}/guest-categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  removeMany: (weddingId: string, ids: string[]) =>
    request<{ deletedCount: number }>(`/weddings/${weddingId}/guest-categories/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
}

export const rsvpApi = {
  list: (
    weddingId: string,
    params: {
      q?: string
      attendance?: RsvpAttendance
      eventId?: string
      limit?: number
      cursor?: string
    } = {},
  ) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.attendance) query.set('attendance', params.attendance)
    if (params.eventId) query.set('eventId', params.eventId)
    query.set('limit', String(params.limit ?? 100))
    if (params.cursor) query.set('cursor', params.cursor)
    return request<{ items: Rsvp[]; nextCursor: string | null }>(
      `/weddings/${weddingId}/rsvps?${query}`,
    )
  },
}
export const wishApi = {
  list: (
    weddingId: string,
    params: { q?: string; status?: WishStatus; limit?: number; cursor?: string } = {},
  ) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.status) query.set('status', params.status)
    query.set('limit', String(params.limit ?? 100))
    if (params.cursor) query.set('cursor', params.cursor)
    return request<{ items: Wish[]; nextCursor: string | null }>(
      `/weddings/${weddingId}/wishes?${query}`,
    )
  },
  moderate: (
    weddingId: string,
    wishId: string,
    input: { status?: WishStatus; isPinned?: boolean },
  ) =>
    request<{ wish: Wish }>(`/weddings/${weddingId}/wishes/${wishId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
}
export type GiftType = 'money' | 'gold' | 'physicalGift'
export type GiftReceiveMethod = 'cash' | 'bankTransfer' | 'physicalGift' | 'other'
export type GiftReciprocityStatus = 'pending' | 'returned' | 'notApplicable'
export type GiftLedgerEntry = {
  id: string
  weddingId: string
  guestId: string | null
  guestDisplayNameSnapshot: string
  giftType: GiftType
  amountMinor: string | null
  currency: string | null
  goldWeight: string | null
  goldUnit: string | null
  goldType: string | null
  giftDescription: string | null
  receiveMethod: GiftReceiveMethod
  receivedAt: string
  note: string | null
  reciprocityStatus: GiftReciprocityStatus
  returnedAt: string | null
  revision: number
  createdAt: string
  updatedAt: string
  linkedGuest: { id: string; displayName: string } | null
}
export type GiftSummary = {
  entryCount: number
  pendingCount: number
  returnedCount: number
  notApplicableCount: number
  money: { count: number; totals: Array<{ currency: string; amountMinor: string }> }
  gold: { count: number; totals: Array<{ unit: string; type: string | null; weight: string }> }
  physicalGiftCount: number
}
export type GiftListParams = {
  q?: string
  giftType?: GiftType
  receiveMethod?: GiftReceiveMethod
  reciprocityStatus?: GiftReciprocityStatus
  limit?: number
  cursor?: string
}
export type GiftCreateInput = {
  guestName: string
  guestId?: string | null
  giftType: GiftType
  amountMinor?: string
  currency?: string
  goldWeight?: string
  goldUnit?: string
  goldType?: string
  giftDescription?: string
  receiveMethod: GiftReceiveMethod
  receivedAt?: string
  note?: string
  reciprocityStatus?: GiftReciprocityStatus
  returnedAt?: string
}
export type GiftUpdateInput = Partial<Omit<GiftCreateInput, 'guestId'>> & {
  guestId?: string | null
  revision: number
}
export const giftApi = {
  list: (weddingId: string, params: GiftListParams = {}) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.giftType) query.set('giftType', params.giftType)
    if (params.receiveMethod) query.set('receiveMethod', params.receiveMethod)
    if (params.reciprocityStatus) query.set('reciprocityStatus', params.reciprocityStatus)
    query.set('limit', String(params.limit ?? 100))
    if (params.cursor) query.set('cursor', params.cursor)
    return request<{ items: GiftLedgerEntry[]; nextCursor: string | null }>(
      `/weddings/${weddingId}/gift-ledger?${query}`,
    )
  },
  summary: (weddingId: string) =>
    request<{ summary: GiftSummary }>(`/weddings/${weddingId}/gift-ledger/summary`),
  create: (weddingId: string, input: GiftCreateInput) =>
    request<{ entry: GiftLedgerEntry }>(`/weddings/${weddingId}/gift-ledger`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (weddingId: string, entryId: string, input: GiftUpdateInput) =>
    request<{ entry: GiftLedgerEntry }>('/weddings/' + weddingId + '/gift-ledger/' + entryId, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (weddingId: string, entryId: string) =>
    request<void>('/weddings/' + weddingId + '/gift-ledger/' + entryId, {
      method: 'DELETE',
      body: '{}',
    }),
  linkGuest: (weddingId: string, entryId: string, guestId: string) =>
    request<{ entry: GiftLedgerEntry }>(
      '/weddings/' + weddingId + '/gift-ledger/' + entryId + '/link-guest',
      { method: 'POST', body: JSON.stringify({ guestId }) },
    ),
  unlinkGuest: (weddingId: string, entryId: string) =>
    request<{ entry: GiftLedgerEntry }>(
      '/weddings/' + weddingId + '/gift-ledger/' + entryId + '/unlink-guest',
      { method: 'POST', body: '{}' },
    ),
}
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type WeddingTask = {
  id: string
  weddingId: string
  eventId: string | null
  event: {
    id: string
    name: string
    eventType: string
    startsAt: string
    endsAt: string | null
  } | null
  parentTaskId: string | null
  title: string
  description: string | null
  dueAt: string | null
  priority: TaskPriority
  status: TaskStatus
  sortOrder: number
  completedAt: string | null
  completedById: string | null
  sourceTemplateKey: string | null
  sourceTemplateVersion: number | null
  revision: number
  createdAt: string
  updatedAt: string
}
export type TaskChecklistItem = {
  id: string
  title: string
  description: string | null
  priority: TaskPriority
  relativeDueDayOffset: number | null
  sortOrder: number
}
export type TaskChecklistTemplate = {
  id: string
  key: string
  version: number
  name: string
  status: string
  locale: string
  items: TaskChecklistItem[]
}
export const taskApi = {
  list: (
    weddingId: string,
    params: {
      q?: string
      status?: TaskStatus
      priority?: TaskPriority
      limit?: number
      cursor?: string
    } = {},
  ) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.status) query.set('status', params.status)
    if (params.priority) query.set('priority', params.priority)
    query.set('limit', String(params.limit ?? 100))
    if (params.cursor) query.set('cursor', params.cursor)
    return request<{ items: WeddingTask[]; nextCursor: string | null }>(
      `/weddings/${weddingId}/tasks?${query}`,
    )
  },
  create: (
    weddingId: string,
    input: {
      title: string
      description?: string
      eventId?: string | null
      parentTaskId?: string | null
      dueAt?: string
      priority: TaskPriority
    },
  ) =>
    request<{ task: WeddingTask }>(`/weddings/${weddingId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (
    weddingId: string,
    taskId: string,
    input: {
      title?: string
      description?: string | null
      eventId?: string | null
      parentTaskId?: string | null
      dueAt?: string | null
      priority?: TaskPriority
      status?: TaskStatus
      revision: number
    },
  ) =>
    request<{ task: WeddingTask }>(`/weddings/${weddingId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (weddingId: string, taskId: string) =>
    request<void>(`/weddings/${weddingId}/tasks/${taskId}`, { method: 'DELETE', body: '{}' }),
  reorder: (weddingId: string, taskIds: string[]) =>
    request<{ updatedCount: number }>(`/weddings/${weddingId}/tasks/reorder`, {
      method: 'POST',
      body: JSON.stringify({ taskIds }),
    }),
  bulkStatus: (weddingId: string, taskIds: string[], status: TaskStatus) =>
    request<{ updatedCount: number }>(`/weddings/${weddingId}/tasks/bulk-status`, {
      method: 'POST',
      body: JSON.stringify({ taskIds, status }),
    }),
  bulkCreate: (
    weddingId: string,
    input: {
      tasks: Array<{
        title: string
        description?: string
        eventId?: string | null
        dueAt?: string
        priority: TaskPriority
      }>
    },
  ) =>
    request<{ items: WeddingTask[] }>(`/weddings/${weddingId}/tasks/bulk`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  templates: () => request<{ items: TaskChecklistTemplate[] }>('/task-checklist-templates'),
  applyTemplate: (
    weddingId: string,
    input: {
      templateKey: string
      templateVersion: number
      eventId?: string | null
      baseDate?: string
    },
  ) =>
    request<{ items: WeddingTask[] }>(`/weddings/${weddingId}/tasks/apply-template`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}
