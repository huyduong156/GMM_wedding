export type WeddingErrorCode =
  | 'WEDDING_NOT_FOUND'
  | 'WEDDING_REVISION_CONFLICT'
  | 'WEDDING_EVENT_NOT_FOUND'
  | 'WEDDING_EVENT_REVISION_CONFLICT'
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
