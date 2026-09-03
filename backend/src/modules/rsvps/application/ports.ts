export type RsvpAttendance = 'ATTENDING' | 'DECLINED' | 'MAYBE'
import type { GuestView } from '@/modules/guests/application/ports'

export interface RsvpView {
  id: string
  weddingId: string

  guestId: string | null
  guestName: string
  guestPhone: string | null
  guestEmail: string | null
  categoryId: string | null
  groupId: string | null


  attendance: RsvpAttendance
  partySize: number
  mealPreference: string | null
  specialRequest: string | null
  message: string | null
  submittedAt: Date
  updatedAt: Date
  revision: number
  eventSelections: Array<{ eventId: string; eventName: string; attending: boolean }>
  companions: Array<{
    id: string
    displayName: string
    mealPreference: string | null
    sortOrder: number
  }>
}

export interface RsvpRepository {
  listOwned(
    userId: string,
    weddingId: string,
    filter: {
      query?: string
      attendance?: RsvpAttendance
      eventId?: string
      categoryId?: string
      groupId?: string
      from?: Date
      to?: Date
      limit: number
      cursor?: string
    },
  ): Promise<{ items: RsvpView[]; nextCursor: string | null } | null>
  promoteToGuest(
    userId: string,
    weddingId: string,
    rsvpId: string,
    data: {
      displayName?: string | undefined
      categoryId?: string | undefined
      groupId?: string | undefined
    },
  ): Promise<{ guest: GuestView } | 'conflict' | null>
  linkGuest(
    userId: string,
    weddingId: string,
    rsvpId: string,
    guestId: string,
  ): Promise<{ guest: GuestView } | 'conflict' | null>
}
