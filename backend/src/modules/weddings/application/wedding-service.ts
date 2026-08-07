import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import { WeddingError } from '../domain/wedding-error'
import type { CreateWeddingData, CreateWeddingEventData, PublishWeddingData, SaveWeddingContentData, UpdateWeddingData, UpdateWeddingEventData, WeddingRepository, WeddingSurfaceValue } from './ports'

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
  listTemplates(productType?: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE') { return this.repository.listTemplates(productType) }
  async getTemplateVersion(templateKey: string, version: string) { return this.repository.getTemplateVersion(templateKey, version) }
  async getContent(actor: AuthenticatedUserActor, weddingId: string, surface: WeddingSurfaceValue) { return this.requireWedding(await this.repository.getContentOwned(actor.userId, weddingId, surface)) }
  async saveContent(actor: AuthenticatedUserActor, weddingId: string, data: SaveWeddingContentData) {
    const result = await this.repository.saveContentOwned(actor.userId, weddingId, data)
    if (result === null) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (result === 'conflict') throw new WeddingError('WEDDING_CONTENT_REVISION_CONFLICT', 409, 'Wedding content was changed by another request')
    if (result === 'template-not-found') throw new WeddingError('WEDDING_TEMPLATE_NOT_FOUND', 404, 'Template version not found')
    if (result === 'template-incompatible') throw new WeddingError('WEDDING_TEMPLATE_INCOMPATIBLE', 400, 'Template is not compatible with this publication surface')
    if (result === 'section-invalid') throw new WeddingError('WEDDING_SECTION_INVALID', 400, 'Section configuration is not supported by the selected template')
    return result
  }
  async publish(actor: AuthenticatedUserActor, weddingId: string, data: PublishWeddingData) {
    const result = await this.repository.publishOwned(actor.userId, weddingId, data)
    if (result === null) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (result === 'not-ready') throw new WeddingError('WEDDING_NOT_READY_TO_PUBLISH', 400, 'Wedding content and template are not ready to publish')
    if (result === 'slug-taken') throw new WeddingError('WEDDING_SLUG_TAKEN', 409, 'Wedding slug is already in use')
    if (result === 'conflict') throw new WeddingError('WEDDING_PUBLISH_REVISION_CONFLICT', 409, 'Wedding was changed by another request')
    return result
  }
  async unpublish(actor: AuthenticatedUserActor, weddingId: string, surface: WeddingSurfaceValue) {
    if (!await this.repository.unpublishOwned(actor.userId, weddingId, surface)) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
  }
  slugAvailable(actor: AuthenticatedUserActor, slug: string, weddingId?: string) { return this.repository.slugAvailable(actor.userId, slug, weddingId) }
  async publicSnapshot(slug: string, surface: WeddingSurfaceValue) {
    const snapshot = await this.repository.getPublicSnapshot(slug, surface)
    if (!snapshot) throw new WeddingError('WEDDING_PUBLIC_NOT_FOUND', 404, 'Published wedding not found')
    return snapshot
  }
  async listWishes(actor: AuthenticatedUserActor, weddingId: string, status?: string) { return this.requireWedding(await this.repository.listWishesOwned(actor.userId, weddingId, status)) }
  async moderateWish(actor: AuthenticatedUserActor, weddingId: string, wishId: string, status?: string, isPinned?: boolean) {
    const result = await this.repository.moderateWishOwned(actor.userId, weddingId, wishId, status, isPinned)
    if (result === null) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    if (result === 'not-found') throw new WeddingError('WEDDING_WISH_NOT_FOUND', 404, 'Wish not found')
    return result
  }
  private requireWedding<T>(value: T | null): T {
    if (value === null) throw new WeddingError('WEDDING_NOT_FOUND', 404, 'Wedding not found')
    return value
  }
  private assertEventTime(startsAt: Date, endsAt?: Date | null) {
    if (endsAt && endsAt < startsAt) throw new WeddingError('WEDDING_EVENT_TIME_INVALID', 400, 'Event end time must not be before start time')
  }
}
