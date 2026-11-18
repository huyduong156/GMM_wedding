import { MusicNote, Pause, Play } from '@phosphor-icons/react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './music-player.css'

const MAX_PLAYBACK_MS = 10 * 60 * 1000

export type MusicPlayerVariant = 'rotating-fab' | 'inline-record'

export type MusicPlayerProps = {
  src?: string
  title?: string
  autoplay?: boolean
  autoplayDelayMs?: number
  active?: boolean
  editorMode?: boolean
  disabled?: boolean
  showFloatingControl?: boolean
  retryAutoplayOnInteraction?: boolean
  variant?: MusicPlayerVariant
  sectionKey?: string | null
}

export type MusicPlayerHandle = {
  play: () => Promise<boolean>
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(function MusicPlayer(
  {
    src,
    title = 'Nhạc nền',
    autoplay = false,
    autoplayDelayMs = 0,
    active = true,
    editorMode = false,
    disabled = false,
    showFloatingControl = false,
    retryAutoplayOnInteraction = false,
    variant = 'rotating-fab',
    sectionKey = 'music',
  }: MusicPlayerProps,
  ref,
) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const available = Boolean(src) && !disabled
  const elapsedRef = useRef(0)
  const startedRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeRef = useRef(false)
  const userPausedRef = useRef(false)
  const pageHiddenRef = useRef(false)
  const mountedRef = useRef(false)
  const requestRef = useRef(0)
  const playIntentRef = useRef(false)

  const stopClock = useCallback(() => {
    if (startedRef.current !== null) {
      elapsedRef.current += Math.max(0, performance.now() - startedRef.current)
      startedRef.current = null
    }
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }, [])

  const pauseAudio = useCallback(() => {
    requestRef.current += 1
    playIntentRef.current = false
    stopClock()
    audioRef.current?.pause()
    if (mountedRef.current) setPlaying(false)
  }, [stopClock])

  const playAudio = useCallback(async () => {
    const audio = audioRef.current
    if (
      !audio ||
      !available ||
      document.hidden ||
      pageHiddenRef.current ||
      userPausedRef.current ||
      elapsedRef.current >= MAX_PLAYBACK_MS
    )
      return false
    const request = ++requestRef.current
    playIntentRef.current = true
    try {
      await audio.play()
      if (!mountedRef.current || request !== requestRef.current) return false
      if (document.hidden || pageHiddenRef.current) {
        pauseAudio()
        return false
      }
      setPlaying(true)
      return true
    } catch {
      if (mountedRef.current && request === requestRef.current) {
        playIntentRef.current = false
        setPlaying(false)
      }
      return false
    }
  }, [available, pauseAudio])

  useImperativeHandle(ref, () => ({ play: playAudio }), [playAudio])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      resumeRef.current = false
      pauseAudio()
    }
  }, [pauseAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    pauseAudio()
    elapsedRef.current = 0
    resumeRef.current = false
    userPausedRef.current = false
    audio.load()

    // Native media events keep the budget tied to playback, excluding buffering.
    const startClock = () => {
      if (
        document.hidden ||
        pageHiddenRef.current ||
        userPausedRef.current ||
        elapsedRef.current >= MAX_PLAYBACK_MS
      ) {
        pauseAudio()
        return
      }
      if (startedRef.current !== null) return
      startedRef.current = performance.now()
      timeoutRef.current = setTimeout(
        () => {
          stopClock()
          elapsedRef.current = MAX_PLAYBACK_MS
          resumeRef.current = false
          pauseAudio()
        },
        Math.max(0, MAX_PLAYBACK_MS - elapsedRef.current),
      )
    }
    audio.addEventListener('playing', startClock)
    audio.addEventListener('waiting', stopClock)
    audio.addEventListener('pause', stopClock)
    audio.addEventListener('ended', stopClock)
    return () => {
      audio.removeEventListener('playing', startClock)
      audio.removeEventListener('waiting', stopClock)
      audio.removeEventListener('pause', stopClock)
      audio.removeEventListener('ended', stopClock)
      audio.pause()
      stopClock()
      requestRef.current += 1
    }
  }, [pauseAudio, src, stopClock])

  useEffect(() => {
    if (!active || editorMode || !autoplay || !src) return
    let autoplayAttempted = false
    let timer: number | undefined
    const removeGestureListeners = () => {
      document.removeEventListener('pointerdown', retryFromGesture, true)
      document.removeEventListener('keydown', retryFromGesture, true)
    }
    const retryFromGesture = (event: Event) => {
      if (!autoplayAttempted) return
      removeGestureListeners()
      const target = event.target
      if (target instanceof Element && target.closest('[data-music-player]')) return
      void playAudio()
    }
    const attemptAutoplay = () => {
      autoplayAttempted = true
      void playAudio().then((started) => {
        if (started) removeGestureListeners()
      })
    }

    if (retryAutoplayOnInteraction) {
      document.addEventListener('pointerdown', retryFromGesture, true)
      document.addEventListener('keydown', retryFromGesture, true)
    }
    if (autoplayDelayMs <= 0) {
      attemptAutoplay()
    } else {
      timer = window.setTimeout(attemptAutoplay, autoplayDelayMs)
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
      removeGestureListeners()
    }
  }, [active, autoplay, autoplayDelayMs, editorMode, playAudio, retryAutoplayOnInteraction, src])

  useEffect(() => {
    if (!active) {
      resumeRef.current = false
      pauseAudio()
    }
  }, [active, pauseAudio])

  useEffect(() => {
    if (disabled) {
      resumeRef.current = false
      pauseAudio()
    }
  }, [disabled, pauseAudio])

  useEffect(() => {
    const hide = () => {
      if (!pageHiddenRef.current) {
        resumeRef.current =
          playIntentRef.current ||
          Boolean(audioRef.current && !audioRef.current.paused) ||
          startedRef.current !== null
      }
      pageHiddenRef.current = true
      pauseAudio()
    }
    const show = () => {
      if (document.hidden) return
      pageHiddenRef.current = false
      const shouldResume = resumeRef.current
      resumeRef.current = false
      if (shouldResume && active && !userPausedRef.current) void playAudio()
    }
    const visibility = () => (document.hidden ? hide() : show())
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('pagehide', hide)
    window.addEventListener('pageshow', show)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('pagehide', hide)
      window.removeEventListener('pageshow', show)
    }
  }, [active, pauseAudio, playAudio])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !available) return
    if (audio.paused) {
      userPausedRef.current = false
      if (elapsedRef.current >= MAX_PLAYBACK_MS) elapsedRef.current = 0
      const started = await playAudio()
      if (started) window.dispatchEvent(new Event('ourday:invitation-user-play'))
    } else {
      userPausedRef.current = true
      resumeRef.current = false
      pauseAudio()
    }
  }

  const floatingControl =
    showFloatingControl && available && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={
              'music-player music-player--rotating-fab' +
              (playing ? ' is-playing' : '') +
              (!available ? ' is-unavailable' : '')
            }
            data-music-player
          >
            <button
              type="button"
              onClick={() => void toggle()}
              disabled={!available}
              aria-label={playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
              aria-pressed={playing}
              title={available ? title : 'Chưa có nhạc nền'}
            >
              <span className="music-player-disc" aria-hidden="true">
                <MusicNote size={20} weight="bold" />
              </span>
              <span className="music-player-state" aria-hidden="true">
                {available ? (
                  playing ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />
                ) : (
                  <MusicNote size={12} />
                )}
              </span>
            </button>
          </div>,
          document.body,
          'recap-soundtrack-floating-control',
        )
      : null

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
      {src && !disabled ? (
        <audio
          ref={audioRef}
          src={src}
          autoPlay={autoplay && active && !editorMode && !disabled}
          loop
          preload={autoplay && active && !editorMode && !disabled ? 'auto' : 'metadata'}
          onPlay={() => {
            if (document.hidden || pageHiddenRef.current || userPausedRef.current) pauseAudio()
            else setPlaying(true)
          }}
          onPause={() => {
            playIntentRef.current = false
            setPlaying(false)
          }}
          onEnded={() => {
            playIntentRef.current = false
            resumeRef.current = false
            setPlaying(false)
          }}
          onError={() => {
            resumeRef.current = false
            pauseAudio()
          }}
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
      {variant === 'inline-record' && playing ? (
        <span className="music-player-notes" aria-hidden="true">
          {['♪', '♫', '♬', '♩'].map((note, index) => (
            <span className="music-player-note" key={`${note}-${index}`}>
              {note}
            </span>
          ))}
        </span>
      ) : null}
      {floatingControl}
    </div>
  )
})
