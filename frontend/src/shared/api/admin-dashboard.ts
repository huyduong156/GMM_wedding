const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')
).replace(/\/$/, '')

export type AdminDashboard = {
  users: { total: number; active: number; pendingVerification: number; suspended: number }
  weddings: { total: number; draft: number; published: number; archived: number }
  templates: {
    total: number
    active: number
    draft: number
    deprecated: number
    releasedVersions: number
    pendingReviewVersions: number
  }
  media: {
    total: number
    ready: number
    processing: number
    failed: number
    totalSizeBytes: string
  }
  recentAuditLogs: Array<{
    id: string
    action: string
    resourceType: string
    resourceId: string
    occurredAt: string
    actorUser: { id: string; email: string; displayName: string | null } | null
  }>
}

export class AdminDashboardApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message)
    this.name = 'AdminDashboardApiError'
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { credentials: 'include' })
  if (!response.ok) {
    let body: { error?: { code?: string; message?: string } } = {}
    try {
      body = (await response.json()) as typeof body
    } catch {
      /* gateway response */
    }
    throw new AdminDashboardApiError(
      response.status,
      body.error?.code ?? 'ADMIN_DASHBOARD_REQUEST_FAILED',
      body.error?.message ?? 'Không thể tải tổng quan hệ thống.',
    )
  }
  return response.json() as Promise<T>
}

export const adminDashboardApi = {
  overview: () => request<{ dashboard: AdminDashboard }>('/admin/dashboard'),
}
