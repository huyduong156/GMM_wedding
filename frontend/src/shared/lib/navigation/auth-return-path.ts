const authReturnPathKey = 'gmm-workspace-access-return'

function isSafeAuthReturnPath(value: string | null) {
  return Boolean(
    value &&
      (value === '/studio' ||
        value.startsWith('/studio/') ||
        value === '/gmm_admin' ||
        value.startsWith('/gmm_admin/') ||
        value.startsWith('/workspace-access/')),
  )
}

export function rememberAuthReturnPath() {
  const destination = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (isSafeAuthReturnPath(destination)) sessionStorage.setItem(authReturnPathKey, destination)
}

export function consumeAuthReturnPath(fallback: string) {
  const destination = sessionStorage.getItem(authReturnPathKey)
  sessionStorage.removeItem(authReturnPathKey)
  return isSafeAuthReturnPath(destination) ? destination! : fallback
}
