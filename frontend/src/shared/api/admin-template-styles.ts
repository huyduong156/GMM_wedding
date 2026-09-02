const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export type TemplateStyle = { id: string; key: string; name: string; description: string | null; sortOrder: number; status: 'ACTIVE' | 'ARCHIVED'; templateCount: number; createdAt: string; updatedAt: string }
export type TemplateStyleInput = { key: string; name: string; description?: string | null; sortOrder?: number }
class TemplateStyleApiError extends Error { constructor(public readonly status: number, public readonly code: string, message: string) { super(message); this.name = 'TemplateStyleApiError' } }
async function request<T>(path: string, init?: RequestInit) { const response = await fetch(`${apiBaseUrl}${path}`, { ...init, credentials: 'include', headers: { ...(init?.body ? { 'content-type': 'application/json', 'x-csrf-protection': '1' } : {}), ...init?.headers } }); if (!response.ok) { const body = await response.json().catch(() => ({})) as { error?: { code?: string; message?: string } }; throw new TemplateStyleApiError(response.status, body.error?.code ?? 'TEMPLATE_STYLE_REQUEST_FAILED', body.error?.message ?? 'Không thể kết nối đến máy chủ.') }; return response.status === 204 ? undefined as T : await response.json() as T }
const segment = encodeURIComponent
export const adminTemplateStylesApi = {
  list: (includeArchived = true) => request<{ items: TemplateStyle[] }>(`/admin/template-styles?includeArchived=${includeArchived}`),
  create: (input: TemplateStyleInput) => request<{ style: TemplateStyle }>('/admin/template-styles', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<TemplateStyleInput> & { status?: TemplateStyle['status'] }) => request<{ style: TemplateStyle }>(`/admin/template-styles/${segment(id)}`, { method: 'PATCH', body: JSON.stringify(input) }),
  archive: (id: string) => request<{ style: TemplateStyle }>(`/admin/template-styles/${segment(id)}`, { method: 'DELETE', body: JSON.stringify({}) }),
  templateStyles: (key: string) => request<{ items: TemplateStyle[] }>(`/admin/templates/${segment(key)}/styles`),
  replaceTemplateStyles: (key: string, styleIds: string[]) => request<{ items: TemplateStyle[] }>(`/admin/templates/${segment(key)}/styles`, { method: 'PUT', body: JSON.stringify({ styleIds }) }),
}
export { TemplateStyleApiError }


