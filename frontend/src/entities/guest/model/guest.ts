export type RsvpStatus = 'attending' | 'pending' | 'declined'

export interface Guest {
  id: string
  name: string
  initials: string
  group: 'Gia đình' | 'Bạn bè' | 'Đồng nghiệp'
  tags: string[]
  partySize: number
  invitation: 'Đã gửi' | 'Chưa gửi'
  attendance: RsvpStatus
  table: string | null
  updatedAt: string
}
