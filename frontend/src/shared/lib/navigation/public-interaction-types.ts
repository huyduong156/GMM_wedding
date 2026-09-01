import type { RsvpAttendance } from '../../api/weddings'

export type PublicRsvpInput = { guestName?: string; attendance: RsvpAttendance; partySize: number; mealPreference?: string; specialRequest?: string; message?: string }
export type PublicWish = { id: string; authorName: string; content: string; submittedAt: string; isPinned: boolean }
export type PublicRsvpController = {
  isPersonalized: boolean
  submit: (input: PublicRsvpInput) => Promise<boolean>
  submitting: boolean
  submitted: boolean
  error: string
}
export type PublicWishesController = {
  items: PublicWish[]
  submit: (input: { guestName?: string; content: string }) => Promise<boolean>
  submitting: boolean
  submitted: boolean
  error: string
}
export type PublicInteractions = {
  isPersonalized: boolean
  rsvp: PublicRsvpController
  wishes: PublicWishesController
}
