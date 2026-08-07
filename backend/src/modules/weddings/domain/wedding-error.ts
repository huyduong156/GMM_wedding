export type WeddingErrorCode =
  | 'WEDDING_NOT_FOUND'
  | 'WEDDING_REVISION_CONFLICT'
  | 'WEDDING_EVENT_NOT_FOUND'
  | 'WEDDING_EVENT_REVISION_CONFLICT'
  | 'WEDDING_CONTENT_REVISION_CONFLICT'
  | 'WEDDING_TEMPLATE_NOT_FOUND'
  | 'WEDDING_TEMPLATE_INCOMPATIBLE'
  | 'WEDDING_SECTION_INVALID'
  | 'WEDDING_NOT_READY_TO_PUBLISH'
  | 'WEDDING_SLUG_TAKEN'
  | 'WEDDING_PUBLISH_REVISION_CONFLICT'
  | 'WEDDING_PUBLIC_NOT_FOUND'
  | 'WEDDING_WISH_NOT_FOUND'
  | 'WEDDING_EVENT_TIME_INVALID'

export class WeddingError extends Error {
  constructor(
    public readonly code: WeddingErrorCode,
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'WeddingError'
  }
}
