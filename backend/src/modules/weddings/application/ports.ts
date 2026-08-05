export type WeddingStatusValue = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WeddingVisibilityValue = 'PUBLIC' | 'PASSWORD_PROTECTED' | 'INVITE_ONLY'

export interface WeddingView {
  id: string; name: string; status: WeddingStatusValue; visibility: WeddingVisibilityValue
  timezone: string; locale: string; primaryDate: Date | null; revision: number
  publishedAt: Date | null; archivedAt: Date | null; createdAt: Date; updatedAt: Date
}

export interface WeddingEventView {
  id: string; weddingId: string; name: string; eventType: string; startsAt: Date; endsAt: Date | null
  timezone: string; venueName: string | null; addressLine: string | null; mapUrl: string | null
  latitude: string | null; longitude: string | null; sortOrder: number; isPublic: boolean
  createdAt: Date; updatedAt: Date
}

export interface CreateWeddingData { name: string; primaryDate?: Date | undefined; timezone: string; locale: string; visibility: WeddingVisibilityValue }
export interface UpdateWeddingData {
  name?: string | undefined; primaryDate?: Date | null | undefined; timezone?: string | undefined; locale?: string | undefined
  visibility?: WeddingVisibilityValue | undefined; status?: WeddingStatusValue | undefined; revision: number
}
export interface CreateWeddingEventData {
  name: string; eventType: string; startsAt: Date; endsAt?: Date | undefined; timezone: string
  venueName?: string | undefined; addressLine?: string | undefined; mapUrl?: string | undefined; latitude?: number | undefined; longitude?: number | undefined
  sortOrder: number; isPublic: boolean
}
export interface UpdateWeddingEventData {
  name?: string | undefined; eventType?: string | undefined; startsAt?: Date | undefined; endsAt?: Date | null | undefined; timezone?: string | undefined
  venueName?: string | null | undefined; addressLine?: string | null | undefined; mapUrl?: string | null | undefined
  latitude?: number | null | undefined; longitude?: number | null | undefined; sortOrder?: number | undefined; isPublic?: boolean | undefined
}

export interface DashboardActivityView {
  id: string; type: 'RSVP_SUBMITTED' | 'WISH_SUBMITTED'; displayName: string
  attendance: 'ATTENDING' | 'DECLINED' | 'MAYBE' | null; partySize: number | null; occurredAt: Date
}

export interface WeddingDashboardView {
  wedding: WeddingView
  publication: {
    invitation: { configured: boolean; published: boolean; slug: string | null; templateName: string | null; templateVersion: string | null; views: null }
    website: { configured: boolean; published: boolean; slug: string | null; templateName: string | null; templateVersion: string | null; views: null }
    recap: { configured: boolean; published: boolean; slug: string | null; views: null }
  }
  metrics: {
    guests: number; invitations: number; activeInvitations: number; responses: number
    attending: number; declined: number; maybe: number; pendingResponses: number
    attendingPartySize: number; companions: number; pendingWishes: number; approvedWishes: number
  }
  nextEvent: WeddingEventView | null
  responseTrend: Array<{ date: string; count: number }>
  recentActivity: DashboardActivityView[]
}

export interface WeddingRepository {
  create(userId: string, data: CreateWeddingData): Promise<WeddingView>
  listOwned(userId: string): Promise<WeddingView[]>
  findOwned(userId: string, weddingId: string): Promise<WeddingView | null>
  updateOwned(userId: string, weddingId: string, data: UpdateWeddingData): Promise<WeddingView | 'conflict' | null>
  softDeleteOwned(userId: string, weddingId: string): Promise<boolean>
  listEventsOwned(userId: string, weddingId: string): Promise<WeddingEventView[] | null>
  createEventOwned(userId: string, weddingId: string, data: CreateWeddingEventData): Promise<WeddingEventView | null>
  findEventOwned(userId: string, weddingId: string, eventId: string): Promise<WeddingEventView | null>
  updateEventOwned(userId: string, weddingId: string, eventId: string, data: UpdateWeddingEventData): Promise<WeddingEventView | null>
  deleteEventOwned(userId: string, weddingId: string, eventId: string): Promise<boolean | null>
  dashboardOwned(userId: string, weddingId: string, now: Date): Promise<WeddingDashboardView | null>
}
