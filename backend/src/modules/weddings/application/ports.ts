export type WeddingStatusValue = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WeddingVisibilityValue = 'PUBLIC' | 'PASSWORD_PROTECTED' | 'INVITE_ONLY'

export interface WeddingView {
  id: string
  slug: string | null
  name: string
  status: WeddingStatusValue
  visibility: WeddingVisibilityValue
  timezone: string
  locale: string
  primaryDate: Date | null
  revision: number
  publishedAt: Date | null
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface WeddingEventView {
  id: string
  weddingId: string
  name: string
  eventType: string
  startsAt: Date
  endsAt: Date | null
  timezone: string
  venueName: string | null
  addressLine: string | null
  mapUrl: string | null
  latitude: string | null
  longitude: string | null
  sortOrder: number
  isPublic: boolean
  revision: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateWeddingData {
  name: string
  primaryDate?: Date | undefined
  timezone: string
  locale: string
  visibility: WeddingVisibilityValue
}
export interface UpdateWeddingData {
  name?: string | undefined
  primaryDate?: Date | null | undefined
  timezone?: string | undefined
  locale?: string | undefined
  visibility?: WeddingVisibilityValue | undefined
  status?: WeddingStatusValue | undefined
  revision: number
}
export interface CreateWeddingEventData {
  name: string
  eventType: string
  startsAt: Date
  endsAt?: Date | undefined
  timezone: string
  venueName?: string | undefined
  addressLine?: string | undefined
  mapUrl?: string | undefined
  latitude?: number | undefined
  longitude?: number | undefined
  sortOrder: number
  isPublic: boolean
}
export interface UpdateWeddingEventData {
  name?: string | undefined
  eventType?: string | undefined
  startsAt?: Date | undefined
  endsAt?: Date | null | undefined
  timezone?: string | undefined
  venueName?: string | null | undefined
  addressLine?: string | null | undefined
  mapUrl?: string | null | undefined
  latitude?: number | null | undefined
  longitude?: number | null | undefined
  sortOrder?: number | undefined
  isPublic?: boolean | undefined
  revision: number
}

export interface DashboardActivityView {
  id: string
  type: 'RSVP_SUBMITTED' | 'WISH_SUBMITTED'
  displayName: string
  attendance: 'ATTENDING' | 'DECLINED' | 'MAYBE' | null
  partySize: number | null
  occurredAt: Date
}

export interface WeddingDashboardView {
  wedding: WeddingView
  publication: {
    invitation: {
      configured: boolean
      published: boolean
      slug: string | null
      templateName: string | null
      templateVersion: string | null
      views: null
    }
    website: {
      configured: boolean
      published: boolean
      slug: string | null
      templateName: string | null
      templateVersion: string | null
      views: null
    }
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
  nextEvent: WeddingEventView | null
  responseTrend: Array<{ date: string; count: number }>
  recentActivity: DashboardActivityView[]
}

export interface WeddingAnalyticsView {
  guests: { total: number; attending: number; attendanceRate: number }
  tasks: {
    total: number
    completed: number
    completedRate: number
    byStatus: { todo: number; inProgress: number; done: number; cancelled: number }
    byPriority: { low: number; medium: number; high: number; urgent: number }
    recentCompleted: Array<{ id: string; title: string; completedAt: Date }>
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

import type { GuestView } from '@/modules/guests/application/ports'

export interface WishListFilter {
  status?: string | undefined
  query?: string | undefined
  from?: Date | undefined
  to?: Date | undefined
  limit: number
  cursor?: string | undefined
}

export interface WeddingRepository {
  create(userId: string, data: CreateWeddingData): Promise<WeddingView>
  listOwned(userId: string): Promise<WeddingView[]>
  findOwned(userId: string, weddingId: string): Promise<WeddingView | null>
  updateOwned(
    userId: string,
    weddingId: string,
    data: UpdateWeddingData,
  ): Promise<WeddingView | 'conflict' | null>
  softDeleteOwned(userId: string, weddingId: string): Promise<boolean>
  listEventsOwned(userId: string, weddingId: string): Promise<WeddingEventView[] | null>
  createEventOwned(
    userId: string,
    weddingId: string,
    data: CreateWeddingEventData,
  ): Promise<WeddingEventView | null>
  findEventOwned(
    userId: string,
    weddingId: string,
    eventId: string,
  ): Promise<WeddingEventView | null>
  updateEventOwned(
    userId: string,
    weddingId: string,
    eventId: string,
    data: UpdateWeddingEventData,
  ): Promise<WeddingEventView | 'conflict' | null>
  deleteEventOwned(userId: string, weddingId: string, eventId: string): Promise<boolean | null>
  dashboardOwned(userId: string, weddingId: string, now: Date): Promise<WeddingDashboardView | null>
  analyticsOwned(userId: string, weddingId: string): Promise<WeddingAnalyticsView | null>
  listTemplates(
    productType?: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP',
    styleKey?: string,
  ): Promise<TemplateView[]>
  getTemplateVersion(templateKey: string, version: string): Promise<TemplateView | null>
  getContentOwned(
    userId: string,
    weddingId: string,
    surface: WeddingSurfaceValue,
  ): Promise<WeddingContentView | null>
  saveContentOwned(
    userId: string,
    weddingId: string,
    data: SaveWeddingContentData,
  ): Promise<
    | WeddingContentView
    | 'conflict'
    | 'template-not-found'
    | 'template-incompatible'
    | 'section-invalid'
    | null
  >
  publishOwned(
    userId: string,
    weddingId: string,
    data: PublishWeddingData,
  ): Promise<PublishedSnapshotView | 'not-ready' | 'slug-taken' | 'conflict' | null>
  unpublishOwned(
    userId: string,
    weddingId: string,
    surface: WeddingSurfaceValue,
  ): Promise<boolean | null>
  slugAvailable(userId: string, slug: string, weddingId?: string): Promise<boolean>
  getPublicSnapshot(
    slug: string,
    surface: WeddingSurfaceValue,
  ): Promise<PublishedSnapshotView | null>
  listWishesOwned(
    userId: string,
    weddingId: string,
    filter: WishListFilter,
  ): Promise<{ items: WishView[]; nextCursor: string | null } | null>
  moderateWishOwned(
    userId: string,
    weddingId: string,
    wishId: string,
    status?: string,
    isPinned?: boolean,
  ): Promise<WishView | 'not-found' | null>
  promoteWishToGuest(
    userId: string,
    weddingId: string,
    wishId: string,
    data: {
      displayName?: string | undefined
      categoryId?: string | undefined
      groupId?: string | undefined
    },
  ): Promise<{ guest: GuestView; wishId: string; invitationId: string | null } | 'conflict' | null>
  linkWishGuest(
    userId: string,
    weddingId: string,
    wishId: string,
    guestId: string,
  ): Promise<{ guest: GuestView; wishId: string; invitationId: string | null } | 'conflict' | null>
}

export type WeddingSurfaceValue = 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
export interface TemplateView {
  key: string
  name: string
  productType: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
  status: string
  description: string | null
  styles: Array<{ id: string; key: string; name: string }>
  versions: Array<{
    id: string
    version: string
    configHash: string
    templateConfigVersion: number
    contentSchemaVersion: number
    rendererApiVersion: number
    config: unknown
    releasedAt: Date | null
    deprecatedAt: Date | null
  }>
}
export interface WeddingContentView {
  content: unknown
  schemaVersion: number
  revision: number
  surface: WeddingSurfaceValue
  themeConfig: unknown
  sectionConfig: unknown
  templateVersion: { id: string; key: string; version: string; config: unknown } | null
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED'
  publishedAt: Date | null
}
export interface SaveWeddingContentData {
  surface: WeddingSurfaceValue
  templateVersionId: string
  content: unknown
  themeConfig: unknown
  sectionConfig: { enabled: string[]; order: string[] }
  revision: number
}
export interface PublishWeddingData {
  surface: WeddingSurfaceValue
  revision: number
}
export interface PublishedSnapshotView {
  id: string
  weddingId: string
  surface: WeddingSurfaceValue
  slug: string
  version: number
  payload: unknown
  publishedAt: Date
  templateVersion: { key: string; version: string }
}
export interface WishView {
  id: string
  authorName: string
  guestName: string
  guestId: string | null
  invitationId: string | null
  content: string
  status: string
  isPinned: boolean
  submittedAt: Date
  moderatedAt: Date | null
}
