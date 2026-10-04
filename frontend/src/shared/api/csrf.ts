const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')
).replace(/\/$/, '')

let csrfTokenPromise: Promise<string> | undefined

type CsrfRequest = (headers: Record<string, string>) => Promise<Response>

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

export function invalidateCsrfToken() {
  csrfTokenPromise = undefined
}

export function resetCsrfTokenForTests() {
  invalidateCsrfToken()
}

export async function csrfHeaders(init?: RequestInit): Promise<Record<string, string>> {
  const method = (init?.method ?? 'GET').toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return {}
  return { 'x-csrf-token': await getCsrfToken() }
}

async function wasRejectedForCsrf(response: Response) {
  if (response.status !== 403) return false
  try {
    const body = (await response.clone().json()) as { error?: { code?: string } }
    return body.error?.code === 'REQUEST_ORIGIN_REJECTED'
  } catch {
    return false
  }
}

export async function requestWithCsrfRetry(init: RequestInit | undefined, send: CsrfRequest) {
  const method = (init?.method ?? 'GET').toUpperCase()
  const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(method)
  let response = await send(await csrfHeaders(init))

  if (!mutation || !(await wasRejectedForCsrf(response))) return response

  // The readable CSRF cookie can expire or be replaced while this SPA still holds
  // the previous token. Refresh it and retry the mutation once; persistent origin,
  // fetch-metadata, or content-type failures still return the second 403 unchanged.
  invalidateCsrfToken()
  response = await send(await csrfHeaders(init))
  return response
}
