import { describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/observability/logger', () => ({ log: vi.fn() }))

import { AuthService } from './auth-service'
import type {
  IdentityEmailSender,
  IdentityRepository,
  IdentityUser,
  PasswordHasher,
  RateLimiter,
} from './ports'
import type { TokenProtector } from '@/platform/auth/token-protector'

const pendingUser: IdentityUser = {
  id: 'user-pending',
  email: 'owner@example.com',
  passwordHash: 'existing-password-hash',
  displayName: null,
  phone: null,
  avatarUrl: null,
  emailVerifiedAt: null,
  locale: 'vi-VN',
  timezone: 'Asia/Ho_Chi_Minh',
  status: 'PENDING_VERIFICATION',
  roles: [],
}

function setup(existingUser: IdentityUser, sendError?: unknown) {
  const repository = {
    findUserByEmail: vi.fn().mockResolvedValue(existingUser),
    createVerificationResend: vi.fn().mockResolvedValue({
      created: true,
      outboxId: 'outbox-resend',
    }),
    markOutboxCompleted: vi.fn().mockResolvedValue(undefined),
    markOutboxAttemptFailed: vi.fn().mockResolvedValue(undefined),
  }
  const passwordHasher = {
    hash: vi.fn(),
  }
  const emailSender = {
    sendVerificationEmail: sendError
      ? vi.fn().mockRejectedValue(sendError)
      : vi.fn().mockResolvedValue(undefined),
  }
  const rateLimiter = {
    consume: vi.fn().mockResolvedValue({ allowed: true, retryAfter: 0 }),
  }
  const tokenProtector = {
    encrypt: vi.fn().mockReturnValue('encrypted-token'),
  }

  const service = new AuthService(
    repository as unknown as IdentityRepository,
    passwordHasher as unknown as PasswordHasher,
    rateLimiter as unknown as RateLimiter,
    emailSender as unknown as IdentityEmailSender,
    tokenProtector as unknown as TokenProtector,
    'rate-limit-secret',
  )
  return { service, repository, passwordHasher, emailSender }
}

describe('AuthService duplicate registration', () => {
  it('reissues verification for an existing pending password account', async () => {
    const { service, repository, passwordHasher, emailSender } = setup(pendingUser)

    await service.register(
      { email: ' OWNER@EXAMPLE.COM ', password: 'a-different-password' },
      '127.0.0.1',
    )

    expect(repository.createVerificationResend).toHaveBeenCalledWith({
      userId: pendingUser.id,
      email: pendingUser.email,
      tokenHash: expect.any(String),
      tokenExpiresAt: expect.any(Date),
      encryptedToken: 'encrypted-token',
    })
    expect(emailSender.sendVerificationEmail).toHaveBeenCalledWith({
      email: pendingUser.email,
      token: expect.any(String),
      expiresAt: expect.any(Date),
    })
    expect(repository.markOutboxCompleted).toHaveBeenCalledWith(
      'outbox-resend',
      expect.any(Date),
    )
    expect(passwordHasher.hash).not.toHaveBeenCalled()
  })

  it('does not send registration mail for an existing active account', async () => {
    const { service, repository, emailSender } = setup({
      ...pendingUser,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    })

    await service.register(
      { email: pendingUser.email, password: 'a-different-password' },
      '127.0.0.1',
    )

    expect(repository.createVerificationResend).not.toHaveBeenCalled()
    expect(emailSender.sendVerificationEmail).not.toHaveBeenCalled()
  })

  it('records a safe failed attempt when duplicate-registration delivery fails', async () => {
    const smtpError = Object.assign(new Error('provider response may contain sensitive data'), {
      code: 'EAUTH',
      command: 'AUTH PLAIN',
      responseCode: 535,
    })
    const { service, repository } = setup(pendingUser, smtpError)

    await service.register(
      { email: pendingUser.email, password: 'a-different-password' },
      '127.0.0.1',
    )

    expect(repository.markOutboxAttemptFailed).toHaveBeenCalledWith(
      'outbox-resend',
      'errorName=Error errorCode=EAUTH smtpCommand=AUTH PLAIN smtpResponseCode=535',
    )
  })
})

describe('AuthService login dependencies', () => {
  it('maps rate limiter failures to a retryable service-unavailable error', async () => {
    const activeUser: IdentityUser = {
      ...pendingUser,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    }
    const repository = {
      findUserByEmail: vi.fn().mockResolvedValue(activeUser),
      createSession: vi.fn(),
    }
    const passwordHasher = {
      verify: vi.fn().mockResolvedValue(true),
      needsRehash: vi.fn().mockReturnValue(false),
    }
    const rateLimiter = {
      consume: vi.fn().mockRejectedValue(new Error('Redis socket closed')),
    }
    const service = new AuthService(
      repository as unknown as IdentityRepository,
      passwordHasher as unknown as PasswordHasher,
      rateLimiter as unknown as RateLimiter,
      {} as IdentityEmailSender,
      {} as TokenProtector,
      'rate-limit-secret',
    )

    await expect(
      service.login(
        { email: activeUser.email, password: 'correct-password' },
        { ip: '127.0.0.1' },
      ),
    ).rejects.toEqual(
      expect.objectContaining({
        code: 'SERVICE_UNAVAILABLE',
        status: 503,
        retryAfter: 5,
      }),
    )
    expect(repository.findUserByEmail).not.toHaveBeenCalled()
    expect(repository.createSession).not.toHaveBeenCalled()
  })
})
