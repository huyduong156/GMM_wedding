/*
 * Intentionally network-only: this worker enables the installable app lifecycle
 * without caching private editor, invitation, or API responses.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
