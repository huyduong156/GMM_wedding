const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export type AuthUser = {
  id: string
  email: string
  displayName: string | null
  phone: string | null
  avatarUrl: string | null
  emailVerifiedAt: string | null
  locale: string
  timezone: string
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  roles: Array<'ADMIN' | 'SUPPORT' | 'MODERATOR'>
}

export type PlatformAdminActor = {
  kind: 'platformAdmin'
  userId: string
  sessionId: string
  assurance: 'base' | 'stepUp'
}

type ApiErrorEnvelope = {
  error?: { code?: string; message?: string; fieldErrors?: Record<string, string[]> }
}

export class AuthApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'AuthApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'content-type': 'application/json', 'x-csrf-protection': '1' } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    let body: ApiErrorEnvelope = {}
    try { body = await response.json() as ApiErrorEnvelope } catch { /* non-JSON gateway error */ }
    throw new AuthApiError(
      response.status,
      body.error?.code ?? 'NETWORK_ERROR',
      body.error?.message ?? 'Không thể kết nối đến máy chủ. Vui lòng thử lại.',
      body.error?.fieldErrors,
    )
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const authApi = {
  register(email: string, password: string, displayName?: string) {
    return request<{ message: string }>('/auth/register', {
      method: 'POST', body: JSON.stringify({ email, password, ...(displayName ? { displayName } : {}) }),
    })
  },
  verifyEmail(token: string) {
    return request<void>('/auth/verify-email', {
      method: 'POST', body: JSON.stringify({ token }),
    })
  },
  resendVerification(email: string) {
    return request<{ message: string }>('/auth/resend-verification', {
      method: 'POST', body: JSON.stringify({ email }),
    })
  },
  login(email: string, password: string) {
    return request<{ user: AuthUser }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    })
  },
  loginAdmin(email: string, password: string) {
    return request<{ user: AuthUser }>('/auth/admin/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    })
  },
  forgotPassword(email: string) {
    return request<{ message: string }>('/auth/forgot-password', {
      method: 'POST', body: JSON.stringify({ email }),
    })
  },
  resetPassword(token: string, password: string) {
    return request<void>('/auth/reset-password', {
      method: 'POST', body: JSON.stringify({ token, password }),
    })
  },
  me() { return request<{ user: AuthUser }>('/me') },
  updateProfile(input: { displayName?: string | null; phone?: string | null; avatarUrl?: string | null; locale?: string; timezone?: string }) {
    return request<{ user: AuthUser }>('/me', { method: 'PATCH', body: JSON.stringify(input) })
  },
  adminMe() { return request<{ user: AuthUser; actor: PlatformAdminActor }>('/admin/me') },
  logout() { return request<void>('/auth/logout', { method: 'POST', body: '{}' }) },
}
