import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import { RsvpError } from '../domain/rsvp-error'
import type { RsvpRepository } from './ports'

export class RsvpService {
  constructor(private readonly repository: RsvpRepository) {}

  async list(actor: AuthenticatedUserActor, weddingId: string, filter: Parameters<RsvpRepository['listOwned']>[2]) {
    const result = await this.repository.listOwned(actor.userId, weddingId, filter)
    if (result === null) throw new RsvpError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    return result
  }

  async promoteToGuest(actor: AuthenticatedUserActor, weddingId: string, rsvpId: string, data: Parameters<RsvpRepository['promoteToGuest']>[3]) {
    const result = await this.repository.promoteToGuest(actor.userId, weddingId, rsvpId, data)
    if (result === null) throw new RsvpError('RSVP_NOT_FOUND', 404, 'RSVP not found')
    if (result === 'conflict') throw new RsvpError('RSVP_ALREADY_LINKED', 409, 'RSVP is already linked to another guest')
    return result
  }

  async linkGuest(actor: AuthenticatedUserActor, weddingId: string, rsvpId: string, guestId: string) {
    const result = await this.repository.linkGuest(actor.userId, weddingId, rsvpId, guestId)
    if (result === null) throw new RsvpError('RSVP_NOT_FOUND', 404, 'RSVP or guest not found')
    if (result === 'conflict') throw new RsvpError('RSVP_ALREADY_LINKED', 409, 'RSVP is already linked to another guest')
    return result
  }
}
