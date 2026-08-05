export type AuthErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'AUTHENTICATION_REQUIRED'
  | 'SESSION_EXPIRED'
  | 'EMAIL_VERIFICATION_REQUIRED'
  | 'ACCOUNT_SUSPENDED'
  | 'ADMIN_ACCESS_REQUIRED'
  | 'INVALID_VERIFICATION_TOKEN'
  | 'REQUEST_ORIGIN_REJECTED'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    public readonly status: number,
    message: string,
    public readonly retryAfter?: number,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

