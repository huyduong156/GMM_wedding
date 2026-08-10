const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export type TemplateProductType = 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
export type TemplateReviewStatus = 'PENDING_REVIEW' | 'RELEASED' | 'DEPRECATED'

export type AdminTemplateVersion = {
  id: string
  version: string
  configHash: string
  templateConfigVersion: number
  contentSchemaVersion: number
  rendererApiVersion: number
  codeRevision: string
  config: Record<string, unknown>
  releasedAt: string | null
  deprecatedAt: string | null
  createdAt: string
  reviewStatus: TemplateReviewStatus
}

export type AdminTemplate = {
  key: string
  name: string
  productType: TemplateProductType
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'RETIRED'
  description: string | null
  versions: AdminTemplateVersion[]
}

export type TemplateReleaseBundle = {
  bundleVersion: 1
  generatedAt: string
  sourceRevision: string
  templates: Array<{
    templateKey: string
    displayName: string
    productType: TemplateProductType
    templateVersion: string
    templateConfigVersion: number
    contentSchemaVersion: number
    rendererApiVersion: number
    description?: string | null
    config: Record<string, unknown>
  }>
}

type ApiErrorEnvelope = { error?: { code?: string; message?: string } }
export class AdminTemplateApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); this.name = 'AdminTemplateApiError' }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init?.body ? { 'content-type': 'application/json', 'x-csrf-protection': '1' } : {}), ...init?.headers },
  })
  if (!response.ok) {
    let body: ApiErrorEnvelope = {}
    try { body = await response.json() as ApiErrorEnvelope } catch { /* gateway response */ }
    throw new AdminTemplateApiError(response.status, body.error?.code ?? 'NETWORK_ERROR', body.error?.message ?? 'Không thể kết nối đến máy chủ.')
  }
  return response.json() as Promise<T>
}

export const adminTemplateApi = {
  list(productType: TemplateProductType) {
    return request<{ pendingReviewCount: number; items: AdminTemplate[] }>(`/admin/templates?productType=${productType}`)
  },
  detail(templateKey: string, version: string) {
    return request<{ template: AdminTemplate & { version: AdminTemplateVersion } }>(`/admin/templates/${encodeURIComponent(templateKey)}/versions/${encodeURIComponent(version)}`)
  },
  sync(bundle: TemplateReleaseBundle) {
    return request<{ created: number; unchanged: number }>('/admin/templates/sync', { method: 'POST', body: JSON.stringify(bundle) })
  },
  release(templateKey: string, version: string) {
    return request(`/admin/templates/${encodeURIComponent(templateKey)}/versions/${encodeURIComponent(version)}/release`, { method: 'POST', body: '{}' })
  },
  deprecate(templateKey: string, version: string) {
    return request(`/admin/templates/${encodeURIComponent(templateKey)}/versions/${encodeURIComponent(version)}/deprecate`, { method: 'POST', body: '{}' })
  },
}
