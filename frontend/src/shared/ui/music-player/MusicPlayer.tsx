import { MusicNote, Pause, Play } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import './music-player.css'

export type MusicPlayerVariant = 'rotating-fab'

export type MusicPlayerProps = {
  src?: string
  title?: string
  autoplay?: boolean
  active?: boolean
  editorMode?: boolean
  variant?: MusicPlayerVariant
}

export function MusicPlayer({
  src,
  title = 'Nhạc nền',
  autoplay = false,
  active = true,
  editorMode = false,
  variant = 'rotating-fab',
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const available = Boolean(src)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    setPlaying(false)
    if (!active || editorMode || !autoplay || !src) return
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [active, autoplay, editorMode, src])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !available) return
    if (audio.paused) {
      await audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <div
      className={
        'music-player music-player--' +
        variant +
        (playing ? ' is-playing' : '') +
        (!available ? ' is-unavailable' : '')
      }
      data-music-player
      data-editor-section="music"
    >
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          loop
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={!available}
        aria-label={
          available ? (playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền') : 'Chưa có nhạc nền'
        }
        aria-pressed={playing}
        title={available ? title : 'Chưa có nhạc nền'}
      >
        <span className="music-player-disc" aria-hidden="true">
          <MusicNote size={20} weight="bold" />
        </span>
        <span className="music-player-state" aria-hidden="true">
          {available ? (
            playing ? (
              <Pause size={12} weight="fill" />
            ) : (
              <Play size={12} weight="fill" />
            )
          ) : (
            <MusicNote size={12} />
          )}
        </span>
      </button>
    </div>
  )
}
