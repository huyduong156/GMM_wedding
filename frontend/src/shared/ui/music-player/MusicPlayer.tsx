import { MusicNote, Pause, Play } from '@phosphor-icons/react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './music-player.css'

export type MusicPlayerVariant = 'rotating-fab'

export type MusicPlayerProps = {
  src?: string
  title?: string
  autoplay?: boolean
  active?: boolean
  editorMode?: boolean
  variant?: MusicPlayerVariant
  sectionKey?: string | null
}

export type MusicPlayerHandle = {
  play: () => Promise<boolean>
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(function MusicPlayer({
  src,
  title = 'Nhạc nền',
  autoplay = false,
  active = true,
  editorMode = false,
  variant = 'rotating-fab',
  sectionKey = 'music',
}: MusicPlayerProps, ref) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const available = Boolean(src)

  const playAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !available) return false
    try {
      await audio.play()
      setPlaying(true)
      return true
    } catch {
      setPlaying(false)
      return false
    }
  }, [available])

  useImperativeHandle(ref, () => ({ play: playAudio }), [playAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    setPlaying(false)
    if (!active || editorMode || !autoplay || !src) return
    void playAudio()
  }, [active, autoplay, editorMode, playAudio, src])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !available) return
    if (audio.paused) {
      await playAudio()
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
      {...(sectionKey ? { 'data-editor-section': sectionKey } : {})}
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
})
