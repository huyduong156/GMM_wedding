import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AstralVowInvitation } from './AstralVowInvitation'
import { astralVowFixture, astralVowSectionConfig } from './fixture'
import { astralVowTemplateConfig } from './template-config'
import type { TemplateFieldConfig } from '../../template-config'

describe('AstralVowInvitation', () => {
  it('keeps the atmosphere sparse and slow-moving', () => {
    const { container } = render(<AstralVowInvitation />)
    const stars = container.querySelectorAll('.av-stars i')
    expect(stars).toHaveLength(22)
    expect(stars[0]).toHaveAttribute('style', expect.stringContaining('--delay: 0s'))
  })

  it('opens the eclipse-card invitation and keeps its celestial identity', async () => {
    const { container } = render(<AstralVowInvitation />)
    expect(screen.getByRole('button', { name: 'Mở thiệp' })).toBeInTheDocument()
    expect(container.querySelector('.av-opening-card')).toBeInTheDocument()
    expect(container.querySelector('.astral-opening-card__decoration--left')).toHaveAttribute('src', '/assets/images/templates/astral-vow/artwork/av-opening-halo-rings-v1.png')
    expect(container.querySelector('.astral-opening-card__decoration--right')).toHaveAttribute('src', '/assets/images/templates/astral-vow/artwork/av-opening-spiral-ribbon-v2.png')
    fireEvent.click(screen.getByRole('button', { name: 'Mở thiệp' }))
    await waitFor(() => expect(screen.getByText('Trân trọng kính mời')).toBeInTheDocument(), { timeout: 3000 })
    expect(container.querySelector('.av-page')).toHaveClass('is-opened')
  })

  it('honors optional section configuration while restoring invitation anchors', () => {
    const { container } = render(<AstralVowInvitation editorMode sectionConfig={{ enabled: ['gallery'], order: ['gallery'] }} />)
    expect(container.querySelector('.astral-opening-card')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="footer"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="gallery"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="rsvp"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-music-player]')).not.toBeInTheDocument()
    expect(astralVowSectionConfig.order).toHaveLength(13)
  })

  it('keeps the timeline section mounted in the editor while items are empty or being added', () => {
    const { container, rerender } = render(
      <AstralVowInvitation
        editorMode
        data={{ ...astralVowFixture, timeline: { ...astralVowFixture.timeline, items: [] } }}
      />,
    )
    expect(container.querySelector('[data-editor-section="timeline"]')).toBeInTheDocument()
    expect(screen.getByText('Thêm ít nhất một mốc thời gian để hiển thị lịch trình.')).toBeInTheDocument()

    rerender(
      <AstralVowInvitation
        editorMode
        data={{ ...astralVowFixture, timeline: { ...astralVowFixture.timeline, items: [{ time: '19:00', title: 'Lời chúc', description: '' }] } }}
      />,
    )
    expect(screen.getByText('Lời chúc')).toBeInTheDocument()
  })

  it('starts configured music after the invitation is opened', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined)
    try {
      const { container } = render(<AstralVowInvitation data={{ music: { backgroundMusicUrl: '/music/wedding.mp3', backgroundMusicName: 'Wedding soundtrack', backgroundMusicAutoplay: true } }} />)
      expect(container.querySelector('[data-music-player]')).toBeInTheDocument()
      expect(container.querySelector('[data-music-player] audio')).not.toBeNull()
      expect(play).not.toHaveBeenCalled()

      fireEvent.click(container.querySelector('.astral-opening-card__open') as HTMLElement)
      await waitFor(() => expect(play).toHaveBeenCalled())
      expect(container.querySelector('[data-music-player] button')).not.toHaveClass('reveal')
    } finally {
      play.mockRestore()
      load.mockRestore()
    }
  })

  it('keeps essential invitation content usable when all user media is empty', () => {
    render(<AstralVowInvitation editorMode data={{ ...astralVowFixture, heroMedia: null, galleryImages: [], giftQrMedia: null, footerMedia: null, invitationMemoryImage1: '', invitationMemoryImage2: '', invitationMemoryImage3: '' }} />)
    expect(screen.getByText('Hai gia đình trân trọng báo tin')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stellarium Event Hall' })).toBeInTheDocument()
    expect(screen.getByText('Hẹn gặp bạn dưới cùng một bầu trời')).toBeInTheDocument()
  })

  it('does not expose editable media for the opening section', () => {
    const opening = astralVowTemplateConfig.sections.find((section) => typeof section !== 'string' && section.sectionKey === 'opening')
    if (!opening || typeof opening === 'string') throw new Error('Missing opening config')
    const fields = opening.fields as Record<string, TemplateFieldConfig>
    expect(fields['openingMediaBack']).toBeUndefined()
    expect(fields['openingMediaFront']).toBeUndefined()  })

  it('declares the shared autoplay setting for the music section', () => {
    const music = astralVowTemplateConfig.sections.find((section) => typeof section !== 'string' && section.sectionKey === 'music')
    if (!music || typeof music === 'string') throw new Error('Missing music config')
    const fields = music.fields as Record<string, TemplateFieldConfig>
    expect(fields.backgroundMusicAutoplay).toMatchObject({ type: 'boolean', contentKey: 'music.backgroundMusicAutoplay' })
  })

  it('keeps section content visible when viewport-observer motion is unavailable', () => {
    const { container } = render(<AstralVowInvitation editorMode />)
    expect(container.querySelector('[data-editor-section="cover"]')).toHaveClass('is-in-view')
  })

  it('asks anonymous guests for a name in RSVP and guestbook submissions', async () => {
    const submitRsvp = vi.fn().mockResolvedValue(true)
    const submitWish = vi.fn().mockResolvedValue(true)
    const interactions = {
      isPersonalized: false,
      guestName: null,
      rsvp: { submitting: false, submitted: false, error: null, submit: submitRsvp },
      wishes: { items: [], submitting: false, submitted: false, error: null, submit: submitWish },
    } as any

    render(<AstralVowInvitation editorMode interactions={interactions} />)

    fireEvent.change(screen.getByPlaceholderText('Nhập tên để xác nhận tham dự'), { target: { value: 'Ngọc Anh' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mình sẽ tham dự' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận phản hồi' }))
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledWith({ guestName: 'Ngọc Anh', attendance: 'ATTENDING', partySize: 1 }))

    fireEvent.change(screen.getByPlaceholderText('Nhập tên để gửi lời chúc'), { target: { value: 'Minh Hà' } })
    fireEvent.change(screen.getByPlaceholderText('Gửi đôi lời yêu thương…'), { target: { value: 'Chúc hai bạn trăm năm hạnh phúc!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
    await waitFor(() => expect(submitWish).toHaveBeenCalledWith({ guestName: 'Minh Hà', content: 'Chúc hai bạn trăm năm hạnh phúc!' }))
  })

  it('does not ask personalized guests for a name and keeps identity out of the payload', async () => {
    const submitRsvp = vi.fn().mockResolvedValue(true)
    const submitWish = vi.fn().mockResolvedValue(true)
    const interactions = {
      isPersonalized: true,
      guestName: 'Anh Ba Hùng',
      rsvp: { submitting: false, submitted: false, error: null, submit: submitRsvp },
      wishes: { items: [], submitting: false, submitted: false, error: null, submit: submitWish },
    } as any

    render(<AstralVowInvitation editorMode interactions={interactions} />)

    expect(screen.queryByPlaceholderText('Nhập tên để xác nhận tham dự')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Nhập tên để gửi lời chúc')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mình sẽ tham dự' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận phản hồi' }))
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledWith({ guestName: undefined, attendance: 'ATTENDING', partySize: 1 }))

    fireEvent.change(screen.getByPlaceholderText('Gửi đôi lời yêu thương…'), { target: { value: 'Hẹn gặp hai bạn trong ngày vui!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
    await waitFor(() => expect(submitWish).toHaveBeenCalledWith({ guestName: undefined, content: 'Hẹn gặp hai bạn trong ngày vui!' }))
  })
})
