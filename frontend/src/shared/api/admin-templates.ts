const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export type AdminTemplateReviewStatus = 'PENDING_REVIEW' | 'RELEASED' | 'DEPRECATED'
export type AdminTemplateVersion = {
  id: string; version: string; configHash: string; templateConfigVersion: number; contentSchemaVersion: number
  rendererApiVersion: number; codeRevision: string | null; config: Record<string, unknown>; createdAt: string
  releasedAt: string | null; deprecatedAt: string | null; reviewStatus: AdminTemplateReviewStatus
  usageCount: number
  compatibility: { compatible: boolean; issues: string[]; supported: { templateConfigVersion: number; contentSchemaVersion: number; rendererApiVersion: number } }
  recentAudit: Array<{ id: string; action: string; occurredAt: string; actorUser: { displayName: string | null; email: string } | null }>
}
export type AdminTemplate = {
  key: string; name: string; productType: 'ONLINE_INVITATION' | 'WEDDING_WEBSITE' | 'RECAP'
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'RETIRED'; description: string | null; versions: AdminTemplateVersion[]
}
export type TemplateReleaseBundle = {
  bundleVersion: 1; generatedAt: string; sourceRevision: string
  templates: Array<{ templateKey: string; displayName: string; productType: AdminTemplate['productType']; templateVersion: string; templateConfigVersion: number; contentSchemaVersion: number; rendererApiVersion: number; description?: string | null; config: Record<string, unknown> }>
}
type LegacyAdminTemplate = Omit<AdminTemplate, 'versions'> & { versions: Array<Omit<AdminTemplateVersion, 'usageCount' | 'compatibility' | 'recentAudit'> & Partial<Pick<AdminTemplateVersion, 'usageCount' | 'compatibility' | 'recentAudit'>>> }

export class AdminTemplateApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); this.name = 'AdminTemplateApiError' }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, credentials: 'include', headers: { ...(init?.body ? { 'content-type': 'application/json', 'x-csrf-protection': '1' } : {}), ...init?.headers } })
  if (!response.ok) {
    let body: { error?: { code?: string; message?: string } } = {}
    try { body = await response.json() as typeof body } catch { /* gateway response */ }
    throw new AdminTemplateApiError(response.status, body.error?.code ?? 'ADMIN_TEMPLATE_REQUEST_FAILED', body.error?.message ?? 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n mÃ¡y chá»§.')
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}

const segment = encodeURIComponent
export const adminTemplateApi = {
  async list(productType: AdminTemplate['productType']) {
    const result = await request<{ pendingReviewCount: number; items: LegacyAdminTemplate[] }>(`/admin/templates?productType=${productType}`)
    return { ...result, items: result.items.map((item): AdminTemplate => ({ ...item, versions: item.versions.map((version): AdminTemplateVersion => ({ ...version, usageCount: version.usageCount ?? 0, compatibility: version.compatibility ?? { compatible: version.templateConfigVersion === 1 && version.contentSchemaVersion === 1 && version.rendererApiVersion === 1, issues: [], supported: { templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1 } }, recentAudit: version.recentAudit ?? [] })) })) }
  },
  detail(key: string, version: string) { return request<{ template: AdminTemplate & { version: AdminTemplateVersion } }>(`/admin/templates/${segment(key)}/versions/${segment(version)}`) },
  sync(bundle?: TemplateReleaseBundle) { return request<{ created: number; unchanged: number; results: Array<{ templateKey: string; version: string; result: 'CREATED' | 'UNCHANGED' }> }>('/admin/templates/sync', { method: 'POST', body: JSON.stringify(bundle ?? {}) }) },
  release(key: string, version: string) { return request<{ version: AdminTemplateVersion }>(`/admin/templates/${segment(key)}/versions/${segment(version)}/release`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-csrf-protection': '1' } }) },
  deprecate(key: string, version: string) { return request<{ version: AdminTemplateVersion }>(`/admin/templates/${segment(key)}/versions/${segment(version)}/deprecate`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-csrf-protection': '1' } }) },
}

