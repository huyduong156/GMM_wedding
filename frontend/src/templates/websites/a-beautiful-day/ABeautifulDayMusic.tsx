import { useEffect, useRef, useState } from 'react'

export function ABeautifulDayMusic({ url, title }: { url: string; title?: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    const audio = ref.current
    const hide = () => { if (document.hidden) audio?.pause() }
    document.addEventListener('visibilitychange', hide)
    return () => { audio?.pause(); document.removeEventListener('visibilitychange', hide) }
  }, [url])
  return <>
    <audio ref={ref} src={url} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setError(true); setPlaying(false) }} />
    <button className="abd-music" type="button" aria-pressed={playing} onClick={() => {
      const audio = ref.current
      if (!audio) return
      if (playing) audio.pause()
      else { setError(false); void audio.play().catch(() => { setError(true); setPlaying(false) }) }
    }}>{playing ? 'Tắt nhạc' : 'Bật nhạc'}{title ? ` · ${title}` : ''}</button>
    {error ? <p className="abd-music-error" role="status">Chưa phát được nhạc. Bạn có thể thử lại.</p> : null}
  </>
}
