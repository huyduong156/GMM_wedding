import { Profiler, createRef } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MusicPlayer, type MusicPlayerHandle } from './MusicPlayer'

const LIMIT = 600_000
let hidden = false
let paused: WeakMap<HTMLMediaElement, boolean>

beforeEach(() => {
  vi.useFakeTimers()
  hidden = false
  paused = new WeakMap()
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(function (this: HTMLMediaElement) {
    return paused.get(this) ?? true
  })
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    paused.set(this, false)
    this.dispatchEvent(new Event('play'))
    this.dispatchEvent(new Event('playing'))
    return Promise.resolve()
  })
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    const wasPlaying = paused.get(this) === false
    paused.set(this, true)
    if (wasPlaying) this.dispatchEvent(new Event('pause'))
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

async function start() {
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Phát nhạc nền' })))
}

async function visibility(value: boolean) {
  await act(async () => {
    hidden = value
    document.dispatchEvent(new Event('visibilitychange'))
  })
}

describe('MusicPlayer playback lifecycle', () => {
  it('pauses in the background and resumes once after duplicate lifecycle events', async () => {
    const { container } = render(<MusicPlayer src="/music.mp3" />)
    await start()
    await visibility(true)
    expect(container.querySelector('audio')!.paused).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
    act(() => window.dispatchEvent(new Event('pagehide')))
    await visibility(false)
    act(() => window.dispatchEvent(new Event('pageshow')))
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('button', { name: 'Tạm dừng nhạc nền' })).toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(1)
  })

  it('respects a manual pause when returning to the page', async () => {
    render(<MusicPlayer src="/music.mp3" />)
    await start()
    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng nhạc nền' }))
    await visibility(true)
    await visibility(false)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Phát nhạc nền' })).toBeInTheDocument()
  })

  it('counts actual playback cumulatively and requires a click after ten minutes', async () => {
    const ref = createRef<MusicPlayerHandle>()
    const { container } = render(<MusicPlayer ref={ref} src="/music.mp3" />)
    await start()
    act(() => vi.advanceTimersByTime(180_000))
    await visibility(true)
    act(() => vi.advanceTimersByTime(900_000))
    await visibility(false)
    act(() => vi.advanceTimersByTime(419_999))
    expect(container.querySelector('audio')!.paused).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(container.querySelector('audio')!.paused).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
    await act(async () => {
      expect(await ref.current!.play()).toBe(false)
    })
    await visibility(true)
    await visibility(false)
    expect(container.querySelector('audio')!.paused).toBe(true)
    await start()
    expect(container.querySelector('audio')!.paused).toBe(false)
    act(() => vi.advanceTimersByTime(LIMIT))
    expect(container.querySelector('audio')!.paused).toBe(true)
  })

  it('does not count buffering toward the playback budget', async () => {
    const { container } = render(<MusicPlayer src="/music.mp3" />)
    const audio = container.querySelector('audio')!
    await start()
    act(() => vi.advanceTimersByTime(100_000))
    fireEvent.waiting(audio)
    expect(vi.getTimerCount()).toBe(0)
    act(() => vi.advanceTimersByTime(LIMIT))
    fireEvent.playing(audio)
    act(() => vi.advanceTimersByTime(499_999))
    expect(audio.paused).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(audio.paused).toBe(true)
  })

  it('uses one timeout and produces no renders while tracking elapsed time', async () => {
    const commits = vi.fn()
    const parentRender = vi.fn()
    function Parent() {
      parentRender()
      return (
        <Profiler id="music" onRender={commits}>
          <MusicPlayer src="/music.mp3" />
        </Profiler>
      )
    }
    render(<Parent />)
    await start()
    const before = commits.mock.calls.length
    expect(vi.getTimerCount()).toBe(1)
    act(() => vi.advanceTimersByTime(300_000))
    expect(commits).toHaveBeenCalledTimes(before)
    expect(parentRender).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(1)
  })

  it('keeps a play button when resuming is blocked by the browser', async () => {
    render(<MusicPlayer src="/music.mp3" />)
    await start()
    await visibility(true)
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('NotAllowedError'))
    await visibility(false)
    expect(screen.getByRole('button', { name: 'Phát nhạc nền' })).toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
    await start()
    expect(screen.getByRole('button', { name: 'Tạm dừng nhạc nền' })).toBeInTheDocument()
  })

  it('rejects a late play completion after the page was hidden', async () => {
    let resolvePlay!: () => void
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(function (this: HTMLMediaElement) {
      paused.set(this, false)
      return new Promise<void>((resolve) => {
        resolvePlay = resolve
      })
    })
    const ref = createRef<MusicPlayerHandle>()
    const { container } = render(<MusicPlayer ref={ref} src="/music.mp3" />)
    let attempt!: Promise<boolean>
    act(() => {
      attempt = ref.current!.play()
    })
    await visibility(true)
    await act(async () => {
      resolvePlay()
      expect(await attempt).toBe(false)
    })
    fireEvent.playing(container.querySelector('audio')!)
    expect(container.querySelector('audio')!.paused).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('resets for a new track and clears audio and timeout on unmount', async () => {
    const { container, rerender, unmount } = render(<MusicPlayer src="/one.mp3" />)
    await start()
    act(() => vi.advanceTimersByTime(500_000))
    rerender(<MusicPlayer src="/two.mp3" />)
    expect(vi.getTimerCount()).toBe(0)
    await start()
    act(() => vi.advanceTimersByTime(200_000))
    const audio = container.querySelector('audio')!
    expect(audio.paused).toBe(false)
    unmount()
    expect(audio.paused).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
    await visibility(true)
    await visibility(false)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2)
  })
})
