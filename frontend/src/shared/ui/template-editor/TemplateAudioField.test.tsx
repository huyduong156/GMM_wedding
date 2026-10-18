import { Profiler } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { musicApi } from '../../api/music'
import type { MusicTrack } from '../../api/admin-music'
import { TemplateSchemaFields } from './TemplateSchemaFields'

const tracks: MusicTrack[] = ['Một', 'Hai'].map((name, index) => ({
  id: String(index + 1),
  displayName: name,
  playbackUrl: `/track-${index + 1}.mp3`,
  scope: 'SYSTEM',
  status: 'READY',
  artistName: null,
  durationSeconds: 120,
  mimeType: 'audio/mpeg',
  sizeBytes: 100,
  licenseType: null,
  licenseReference: null,
  creditText: null,
  revision: 1,
  createdAt: '',
  updatedAt: '',
}))
let audios: HTMLAudioElement[]
let paused: WeakMap<HTMLMediaElement, boolean>
let hidden = false

function deferred() {
  let resolve!: () => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<void>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
function mediaStarted(audio: HTMLMediaElement) {
  paused.set(audio, false)
  audio.dispatchEvent(new Event('play'))
  audio.dispatchEvent(new Event('playing'))
}
function field(update = vi.fn()) {
  return (
    <TemplateSchemaFields
      fields={{ music: { type: 'audio', label: 'Nhạc nền', contentKey: 'music' } }}
      data={{ music: '' }}
      update={update}
    />
  )
}
async function mountField() {
  const view = render(field())
  await screen.findByRole('button', { name: 'Nghe thử Một' })
  return view
}

beforeEach(() => {
  audios = []
  paused = new WeakMap()
  hidden = false
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
  vi.spyOn(musicApi, 'list').mockResolvedValue({ items: tracks })
  vi.stubGlobal('Audio', function Audio() {
    const audio = document.createElement('audio')
    audios.push(audio)
    return audio
  })
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    return paused.get(this) ?? true
  })
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    mediaStarted(this)
    return Promise.resolve()
  })
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    const wasPlaying = paused.get(this) === false
    paused.set(this, true)
    if (wasPlaying) this.dispatchEvent(new Event('pause'))
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('owner music preview', () => {
  it('shows Stop immediately even while play() is unresolved and allows cancelling it', async () => {
    const pending = deferred()
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(function (
      this: HTMLMediaElement,
    ) {
      mediaStarted(this)
      return pending.promise
    })
    await mountField()
    fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' }))
    expect(audios[0].paused).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Dừng Một' }))
    expect(audios[0].paused).toBe(true)
    expect(audios[0].hasAttribute('src')).toBe(false)
    await act(async () => pending.resolve())
    expect(screen.queryByRole('button', { name: 'Dừng Một' })).not.toBeInTheDocument()
    expect(audios[0].paused).toBe(true)
  })

  it('keeps the newest track selected when requests reject or resolve out of order', async () => {
    const first = deferred(),
      second = deferred()
    vi.mocked(HTMLMediaElement.prototype.play)
      .mockImplementationOnce(function (this: HTMLMediaElement) {
        mediaStarted(this)
        return first.promise
      })
      .mockImplementationOnce(function (this: HTMLMediaElement) {
        mediaStarted(this)
        return second.promise
      })
    await mountField()
    fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' }))
    fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Hai' }))
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    await act(async () => {
      first.reject(new Error('AbortError'))
      second.resolve()
    })
    expect(audios.map((audio) => audio.paused)).toEqual([true, true, false])
    expect(screen.getByRole('button', { name: 'Dừng Một' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nghe thử Hai' })).toBeInTheDocument()
  })

  it('ignores late pause, ended and error events belonging to the previous audio', async () => {
    await mountField()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Hai' })))
    act(() =>
      ['ended', 'pause', 'error'].forEach((event) => audios[0].dispatchEvent(new Event(event))),
    )
    expect(screen.getByRole('button', { name: 'Dừng Hai' })).toBeInTheDocument()
    expect(audios[1].paused).toBe(false)
  })

  it.each(['pause', 'ended', 'error'])(
    'resets the label and releases the current audio on %s',
    async (event) => {
      await mountField()
      await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
      act(() => audios[0].dispatchEvent(new Event(event)))
      expect(screen.getByRole('button', { name: 'Nghe thử Một' })).toBeInTheDocument()
      expect(audios[0].paused).toBe(true)
      expect(audios[0].hasAttribute('src')).toBe(false)
    },
  )

  it('restores the play button if playback is rejected', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('NotAllowedError'))
    await mountField()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    expect(screen.getByRole('button', { name: 'Nghe thử Một' })).toBeInTheDocument()
    expect(audios[0].paused).toBe(true)
  })

  it('stops when hidden or unmounted and does not automatically restart', async () => {
    const { unmount } = await mountField()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    act(() => {
      hidden = true
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(audios[0].paused).toBe(true)
    expect(screen.getByRole('button', { name: 'Nghe thử Một' })).toBeInTheDocument()
    act(() => {
      hidden = false
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Hai' })))
    unmount()
    expect(audios[1].paused).toBe(true)
    expect(audios[1].hasAttribute('src')).toBe(false)
  })

  it('refreshes its label after an external tool wraps the dynamic text', async () => {
    await mountField()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    const button = screen.getByRole('button', { name: 'Dừng Một' })
    const label = button.querySelector('span')!
    const font = document.createElement('font')
    font.textContent = label.textContent
    label.replaceChildren(font)
    fireEvent.click(button)
    expect(button).toHaveTextContent('Nghe thử')
    expect(audios[0].paused).toBe(true)
  })

  it('preserves the active preview across editor rerenders', async () => {
    const view = await mountField()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    view.rerender(field())
    expect(audios).toHaveLength(1)
    expect(audios[0].paused).toBe(false)
    expect(screen.getByRole('button', { name: 'Dừng Một' })).toBeInTheDocument()
    expect(musicApi.list).toHaveBeenCalledTimes(1)
  })

  it('keeps parent updates independent and uses no periodic playback renders', async () => {
    const parent = vi.fn(),
      commits = vi.fn(),
      update = vi.fn()
    function Parent() {
      parent()
      return (
        <Profiler id="preview" onRender={commits}>
          {field(update)}
        </Profiler>
      )
    }
    render(<Parent />)
    await screen.findByRole('button', { name: 'Nghe thử Một' })
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Nghe thử Một' })))
    const before = commits.mock.calls.length
    vi.useFakeTimers()
    act(() => vi.advanceTimersByTime(120_000))
    expect(commits).toHaveBeenCalledTimes(before)
    expect(parent).toHaveBeenCalledTimes(1)
    expect(update).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
