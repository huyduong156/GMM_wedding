import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import { WeddingError } from '../domain/wedding-error'
import type { CreateWeddingData, CreateWeddingEventData, UpdateWeddingData, UpdateWeddingEventData, WeddingRepository } from './ports'

export class WeddingService {
  constructor(private readonly repository: WeddingRepository) {}
  create(actor: AuthenticatedUserActor, data: CreateWeddingData) { return this.repository.create(actor.userId, data) }
  list(actor: AuthenticatedUserActor) { return this.repository.listOwned(actor.userId) }
  async get(actor: AuthenticatedUserActor, weddingId: string) { return this.requireWedding(await this.repository.findOwned(actor.userId, weddingId)) }
  async update(actor: AuthenticatedUserActor, weddingId: string, data: UpdateWeddingData) {
    const wedding = await this.repository.updateOwned(actor.userId, weddingId, data)
    if (wedding === 'conflict') throw new WeddingError('WEDDING_REVISION_CONFLICT', 409, 'Wedding was changed by another request')
    return this.requireWedding(wedding)
  }
  async remove(actor: AuthenticatedUserActor, weddingId: string) {
    if (!await this.repository.softDeleteOwned(actor.userId, weddingId)) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
  }
  async listEvents(actor: AuthenticatedUserActor, weddingId: string) { return this.requireWedding(await this.repository.listEventsOwned(actor.userId, weddingId)) }
  async createEvent(actor: AuthenticatedUserActor, weddingId: string, data: CreateWeddingEventData) {
    this.assertEventTime(data.startsAt, data.endsAt)
    return this.requireWedding(await this.repository.createEventOwned(actor.userId, weddingId, data))
  }
  async updateEvent(actor: AuthenticatedUserActor, weddingId: string, eventId: string, data: UpdateWeddingEventData) {
    const current = await this.repository.findEventOwned(actor.userId, weddingId, eventId)
    if (!current) throw new WeddingError('WEDDING_EVENT_NOT_FOUND', 404, 'Wedding event not found')
    this.assertEventTime(data.startsAt ?? current.startsAt, data.endsAt === undefined ? current.endsAt : data.endsAt)
    const event = await this.repository.updateEventOwned(actor.userId, weddingId, eventId, data)
    if (event === 'conflict') throw new WeddingError('WEDDING_EVENT_REVISION_CONFLICT', 409, 'Wedding event was changed by another request')
    if (!event) throw new WeddingError('WEDDING_EVENT_NOT_FOUND', 404, 'Wedding event not found')
    return event
  }
  async removeEvent(actor: AuthenticatedUserActor, weddingId: string, eventId: string) {
    const result = await this.repository.deleteEventOwned(actor.userId, weddingId, eventId)
    if (result === null) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (!result) throw new WeddingError('WEDDING_EVENT_NOT_FOUND', 404, 'Wedding event not found')
  }
  async dashboard(actor: AuthenticatedUserActor, weddingId: string, now = new Date()) { return this.requireWedding(await this.repository.dashboardOwned(actor.userId, weddingId, now)) }
  private requireWedding<T>(value: T | null): T {
    if (value === null) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    return value
  }
  private assertEventTime(startsAt: Date, endsAt?: Date | null) {
    if (endsAt && endsAt < startsAt) throw new WeddingError('WEDDING_EVENT_TIME_INVALID', 400, 'Event end time must not be before start time')
  }
}
