import type { MusicTrack } from './admin-music'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api')).replace(/\/$/, '')

export const musicApi = {
  list: (q?: string) => fetch(`${apiBaseUrl}/music-tracks${q ? `?q=${encodeURIComponent(q)}` : ''}`, { credentials: 'include' }).then(async (response) => {
    if (!response.ok) throw new Error('Không thể tải kho nhạc.')
    return response.json() as Promise<{ items: MusicTrack[] }>
  }),
}
