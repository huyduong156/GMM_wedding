import { apiBaseUrl, request, WeddingApiError } from './weddings'

export type GuestRecord = {
  id: string; weddingId: string; categoryId: string | null; groupId: string | null
  displayName: string; phone: string | null; email: string | null; note: string | null
  tableName: string | null; maxPartySize: number; tags: string[]; createdAt: string; updatedAt: string
}
export type GuestInput = {
  displayName: string; categoryId?: string; groupId?: string; phone?: string; email?: string
  note?: string; tableName?: string; maxPartySize?: number; tags?: string[]
}
export type GuestGroup = { id: string; weddingId: string; name: string; createdAt: string; updatedAt: string }
export type GuestCategory = { id: string; weddingId: string; name: string; parentId: string | null; sortOrder: number; createdAt: string; updatedAt: string }
export type ImportRow = GuestInput & { categoryPath?: string; groupName?: string }

async function requestBlob(path: string): Promise<Blob> {
  const response = await fetch(`${apiBaseUrl}${path}`, { credentials: 'include' })
  if (!response.ok) throw new WeddingApiError(response.status, 'EXPORT_FAILED', 'Không thể xuất danh sách khách mời.')
  return response.blob()
}

export const guestApi = {
  list: (weddingId: string, params: { q?: string; groupId?: string; categoryId?: string; limit?: number; cursor?: string } = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => value !== undefined && value !== '' && query.set(key, String(value)))
    return request<{ items: GuestRecord[]; nextCursor: string | null }>(`/weddings/${weddingId}/guests${query.size ? `?${query}` : ''}`)
  },
  get: (weddingId: string, guestId: string) => request<{ guest: GuestRecord }>(`/weddings/${weddingId}/guests/${guestId}`),
  create: (weddingId: string, input: GuestInput) => request<{ guest: GuestRecord }>(`/weddings/${weddingId}/guests`, { method: 'POST', body: JSON.stringify(input) }),
  update: (weddingId: string, guestId: string, input: Partial<GuestInput>) => request<{ guest: GuestRecord }>(`/weddings/${weddingId}/guests/${guestId}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (weddingId: string, guestId: string) => request<void>(`/weddings/${weddingId}/guests/${guestId}`, { method: 'DELETE', body: '{}' }),
  groups: (weddingId: string) => request<{ items: GuestGroup[] }>(`/weddings/${weddingId}/guest-groups`),
  categories: (weddingId: string) => request<{ items: GuestCategory[] }>(`/weddings/${weddingId}/guest-categories`),
  importPreview: (weddingId: string, rows: ImportRow[]) => request<{ rows: unknown[]; summary?: unknown }>(`/weddings/${weddingId}/guests/import/preview`, { method: 'POST', body: JSON.stringify({ rows }) }),
  importCommit: (weddingId: string, rows: ImportRow[]) => request<{ imported: number }>(`/weddings/${weddingId}/guests/import/commit`, { method: 'POST', body: JSON.stringify({ rows }) }),
  export: (weddingId: string) => requestBlob(`/weddings/${weddingId}/guests/export`),
  createInvitation: (weddingId: string, guestId: string, maxPartySize: number) => request<{ invitation: unknown; token?: string }>(`/weddings/${weddingId}/invitations`, { method: 'POST', body: JSON.stringify({ guestId, maxPartySize }) }),
}
