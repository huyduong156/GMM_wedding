const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')
).replace(/\/$/, '')

export type AdminUserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'
export type AdminUserRole = 'ADMIN' | 'SUPPORT' | 'MODERATOR'
export type AdminUser = {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  phone: string | null
  status: AdminUserStatus
  emailVerifiedAt: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  roles: AdminUserRole[]
  weddingCount: number
}
export type AdminUserList = {
  items: AdminUser[]
  nextCursor: string | null
  summary: { total: number; active: number; pendingVerification: number; suspended: number }
}
export type AdminAuditLog = {
  id: string
  action: string
  reason: string | null
  metadata: unknown
  occurredAt: string
  actorUser: { id: string; email: string; displayName: string | null } | null
}

export class AdminUserApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AdminUserApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...(init?.method && init.method !== 'GET' ? { 'x-csrf-protection': '1' } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    let body: { error?: { code?: string; message?: string } } = {}
    try {
      body = (await response.json()) as typeof body
    } catch {
      /* gateway response */
    }
    throw new AdminUserApiError(
      response.status,
      body.error?.code ?? 'ADMIN_USER_REQUEST_FAILED',
      body.error?.message ?? 'Không thể thực hiện thao tác với người dùng.',
    )
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>)
}

const segment = encodeURIComponent
export const adminUserApi = {
  list(
    params: {
      q?: string
      status?: AdminUserStatus
      role?: AdminUserRole
      limit?: number
      cursor?: string
    } = {},
  ) {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.status) query.set('status', params.status)
    if (params.role) query.set('role', params.role)
    query.set('limit', String(params.limit ?? 25))
    if (params.cursor) query.set('cursor', params.cursor)
    return request<AdminUserList>(`/admin/users?${query.toString()}`)
  },
  detail(userId: string) {
    return request<{ user: AdminUser }>(`/admin/users/${segment(userId)}`)
  },
  update(userId: string, input: { status?: AdminUserStatus; roles?: AdminUserRole[] }) {
    return request<{ user: AdminUser }>(`/admin/users/${segment(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },
  invite(input: { email: string; displayName?: string }) {
    return request<{ message: string }>(`/admin/users/invite`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  bulkStatus(userIds: string[], status: AdminUserStatus) {
    return request<{ updatedCount: number }>('/admin/users/bulk-status', {
      method: 'POST',
      body: JSON.stringify({ userIds, status }),
    })
  },
  resendVerification(userId: string) {
    return request<{ message: string }>(`/admin/users/${segment(userId)}/resend-verification`, {
      method: 'POST',
      body: '{}',
    })
  },
  audit(userId: string) {
    return request<{ items: AdminAuditLog[]; nextCursor: string | null }>(
      `/admin/users/${segment(userId)}/audit-logs?limit=50`,
    )
  },
  revokeSessions(userId: string) {
    return request<{ revokedCount: number }>(
      `/admin/users/${segment(userId)}/sessions/revoke-all`,
      { method: 'POST', body: '{}' },
    )
  },
}
