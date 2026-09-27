const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')
).replace(/\/$/, '')

let csrfTokenPromise: Promise<string> | undefined

async function loadCsrfToken() {
  const response = await fetch(`${apiBaseUrl}/auth/csrf`, { credentials: 'include' })
  if (!response.ok) throw new Error('Không thể khởi tạo bảo vệ CSRF.')
  const body = (await response.json()) as { csrfToken?: string }
  if (!body.csrfToken) throw new Error('Máy chủ không trả về CSRF token.')
  return body.csrfToken
}

export function getCsrfToken() {
  const request = (csrfTokenPromise ??= loadCsrfToken())
  return request.catch((error: unknown) => {
    // Do not keep a rejected request cached: the next user action must retry.
    if (csrfTokenPromise === request) csrfTokenPromise = undefined
    throw error
  })
}

export function resetCsrfTokenForTests() {
  csrfTokenPromise = undefined
}

export async function csrfHeaders(init?: RequestInit): Promise<Record<string, string>> {
  const method = (init?.method ?? 'GET').toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return {}
  return { 'x-csrf-token': await getCsrfToken() }
}
