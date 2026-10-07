import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SunlitSilkRenderer } from './SunlitSilkRenderer'
import { sunlitSilkSectionConfig } from './fixture'

describe('SunlitSilkRenderer rebuild contract', () => {
  afterEach(() => vi.useRealTimers())

  it('keeps the new opening in the DOM until its exit choreography completes', () => {
    vi.useFakeTimers()
    render(<SunlitSilkRenderer />)
    expect(document.documentElement).toHaveClass('ss-opening-lock')
    const button = screen.getByRole('button', { name: 'Mở thiệp' })
    fireEvent.click(button)
    expect(screen.getByRole('dialog')).toHaveClass('is-celebrating')
    expect(screen.getByRole('dialog')).not.toHaveClass('is-opening')
    expect(document.body).toHaveClass('ss-opening-lock')

    act(() => vi.advanceTimersByTime(300))
    expect(screen.getByRole('dialog')).toHaveClass('is-opening')

    act(() => vi.advanceTimersByTime(1_500))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('ss-opening-lock')
  })

  it('keeps the opening gate available in editor mode', () => {
    render(<SunlitSilkRenderer editorMode />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mở thiệp' })).toBeEnabled()
  })

  it('renders the editable opening title on the invitation card', () => {
    render(
      <SunlitSilkRenderer
        editorMode
        data={{ opening: { title: 'Lời mời riêng của chúng mình' } }}
      />,
    )

    expect(screen.getByText('Lời mời riêng của chúng mình')).toBeInTheDocument()
    expect(screen.queryByText('Thiệp mời lễ thành hôn')).not.toBeInTheDocument()
  })

  it('exposes all 15 editor anchors and distinct interactive surfaces', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        sectionConfig={{ ...sunlitSilkSectionConfig, enabled: sunlitSilkSectionConfig.order }}
      />,
    )
    expect(container.querySelectorAll('[data-editor-section]')).toHaveLength(14)
    expect(container.querySelector('[data-editor-section="calendar"]')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /mở bản đồ/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ảnh tiếp theo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /gửi phản hồi/i })).toBeDisabled()
  })

  it('keeps decorative artwork hidden from assistive technology', () => {
    const { container } = render(<SunlitSilkRenderer editorMode />)
    expect(
      Array.from(container.querySelectorAll('.ss-decor')).every(
        (image) => image.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true)
  })

  it('renders the default bride and groom demo portraits in the cover', () => {
    const { container } = render(<SunlitSilkRenderer editorMode />)
    const portraits = container.querySelectorAll('.ss-portrait-cover__photo img')

    expect(portraits).toHaveLength(2)
    expect(portraits[0]).toHaveAttribute(
      'src',
      '/assets/images/templates/green-hydrangea/bride-portrait.png',
    )
    expect(portraits[1]).toHaveAttribute(
      'src',
      '/assets/images/templates/green-hydrangea/groom-portrait.png',
    )
  })

  it('uses editable cover phrases for the animated header', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        data={{ cover: { phraseFrom: 'Lời hẹn riêng', phraseTo: 'Ngày vui của mình' } }}
      />,
    )
    const phrase = container.querySelector('.ss-portrait-cover__phrase')

    expect(phrase).toHaveAttribute('aria-label', 'Ngày vui của mình')
    expect(
      Array.from(container.querySelectorAll('.ss-portrait-cover__glyph-face--from'))
        .map((node) => node.textContent?.replace(/\u00a0/g, ' ') ?? '')
        .join('')
        .trim(),
    ).toBe('Lời hẹn riêng')
    expect(
      Array.from(container.querySelectorAll('.ss-portrait-cover__glyph-face--to'))
        .map((node) => node.textContent?.replace(/\u00a0/g, ' ') ?? '')
        .join('')
        .trim(),
    ).toBe('Ngày vui của mình')
  })

  it('places the editable family note before the date and adds the date ripple source', () => {
    const { container } = render(<SunlitSilkRenderer editorMode />)
    const familySection = container.querySelector('[data-editor-section="families"]')
    const note = familySection?.querySelector('.ss-family-note')
    const date = familySection?.querySelector('.ss-family-date')
    const day = familySection?.querySelector('.ss-family-date__day time')

    expect(note).toHaveTextContent('Hôn lễ cử hành tại tư gia vào lúc')
    expect(
      note && date && note.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(day).toHaveAttribute('data-ripple-text', '16')
  })

  it('keeps family side labels fixed instead of exposing structural inputs', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        data={{
          families: {
            brideSide: { label: 'Nhãn tùy biến' },
            groomSide: { label: 'Nhãn khác' },
          },
        }}
      />,
    )
    const labels = Array.from(container.querySelectorAll('.ss-family-card > span')).map(
      (node) => node.textContent,
    )

    expect(labels).toEqual(['Nhà gái', 'Nhà trai'])
  })

  it('uses uploaded activity images and hides the event section when all activities are removed', () => {
    const { container, rerender } = render(
      <SunlitSilkRenderer
        editorMode
        data={{
          eventDetails: {
            items: [
              {
                title: 'Góc ảnh',
                image: { src: '/uploads/photo-book.jpg', alt: 'Góc ảnh' },
              },
            ],
          },
        }}
      />,
    )
    const card = container.querySelector('.ss-event-carousel article')
    expect(card).toHaveStyle({ '--ss-event-card-image': 'url("/uploads/photo-book.jpg")' })

    rerender(<SunlitSilkRenderer editorMode data={{ eventDetails: { items: [] } }} />)
    expect(container.querySelector('[data-editor-section="eventDetails"]')).not.toBeInTheDocument()
  })

  it('hides the timeline section when no complete timeline item remains', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        data={{ timeline: { items: [{ time: '', title: '' }] } }}
      />,
    )

    expect(container.querySelector('[data-editor-section="timeline"]')).not.toBeInTheDocument()
  })

  it('keeps three system gallery previews by default and hides gallery after all images are removed', () => {
    const { container, rerender } = render(<SunlitSilkRenderer editorMode />)
    expect(container.querySelectorAll('.ss-gallery-thumbs button')).toHaveLength(3)
    expect(container.querySelector('.ss-section--gallery')).toHaveTextContent('Những ngày đầy nắng')

    rerender(<SunlitSilkRenderer editorMode data={{ galleryImages: [] }} />)
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
  })

  it('renders the editable RSVP kicker', () => {
    const { container } = render(
      <SunlitSilkRenderer editorMode data={{ rsvp: { kicker: 'Xác nhận trước ngày vui' } }} />,
    )

    expect(container.querySelector('.ss-rsvp .ss-section-heading')).toHaveTextContent(
      'Xác nhận trước ngày vui',
    )
  })

  it('renders the gift section in the default preview', () => {
    const { container } = render(<SunlitSilkRenderer editorMode />)

    expect(container.querySelector('[data-editor-section="gift"]')).toBeInTheDocument()
  })

  it('uses the shared floating music player when music is enabled', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        sectionConfig={{
          ...sunlitSilkSectionConfig,
          enabled: [...sunlitSilkSectionConfig.enabled, 'music'],
        }}
      />,
    )

    expect(container.querySelector('[data-music-player]')).toBeInTheDocument()
    expect(container.querySelector('.ss-section--music')).not.toBeInTheDocument()
  })

  it('removes disabled optional sections without leaving placeholders', () => {
    const { container } = render(
      <SunlitSilkRenderer
        editorMode
        sectionConfig={{
          enabled: ['opening', 'cover', 'invitation', 'families', 'eventDetails', 'footer'],
          order: ['opening', 'cover', 'invitation', 'families', 'eventDetails', 'footer'],
        }}
      />,
    )
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="footer"]')).toBeInTheDocument()
  })

  it('hides guest-name inputs and submits the connected guest identity', async () => {
    const submitRsvp = vi.fn().mockResolvedValue(true)
    const submitWish = vi.fn().mockResolvedValue(true)
    render(
      <SunlitSilkRenderer
        editorMode
        guestName="Ngọc Anh"
        interactions={{
          isPersonalized: true,
          guestName: 'Ngọc Anh',
          rsvp: {
            isPersonalized: true,
            submitting: false,
            submitted: false,
            error: '',
            submit: submitRsvp,
          },
          wishes: {
            items: [],
            submitting: false,
            submitted: false,
            error: '',
            submit: submitWish,
          },
        }}
      />,
    )

    expect(screen.queryAllByPlaceholderText('Tên của bạn')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Mình sẽ tham dự' }))
    fireEvent.submit(screen.getByRole('button', { name: 'Gửi phản hồi' }).closest('form')!)
    await vi.waitFor(() =>
      expect(submitRsvp).toHaveBeenCalledWith({
        guestName: undefined,
        attendance: 'ATTENDING',
        partySize: 1,
      }),
    )
  })

  it('asks anonymous guests for a name in both public actions', async () => {
    const submitRsvp = vi.fn().mockResolvedValue(true)
    const submitWish = vi.fn().mockResolvedValue(true)
    render(
      <SunlitSilkRenderer
        editorMode
        interactions={{
          isPersonalized: false,
          guestName: null,
          rsvp: {
            isPersonalized: false,
            submitting: false,
            submitted: false,
            error: '',
            submit: submitRsvp,
          },
          wishes: {
            items: [],
            submitting: false,
            submitted: false,
            error: '',
            submit: submitWish,
          },
        }}
      />,
    )

    const names = screen.getAllByPlaceholderText('Tên của bạn')
    expect(names).toHaveLength(2)
    fireEvent.change(names[0], { target: { value: 'Minh Hà' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mình sẽ tham dự' }))
    fireEvent.submit(screen.getByRole('button', { name: 'Gửi phản hồi' }).closest('form')!)
    fireEvent.change(names[1], { target: { value: 'Minh Hà' } })
    fireEvent.change(screen.getByPlaceholderText('Lời chúc của bạn'), {
      target: { value: 'Chúc hai bạn trăm năm hạnh phúc!' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Gửi lời chúc' }).closest('form')!)

    await vi.waitFor(() => {
      expect(submitRsvp).toHaveBeenCalledWith({
        guestName: 'Minh Hà',
        attendance: 'ATTENDING',
        partySize: 1,
      })
      expect(submitWish).toHaveBeenCalledWith({
        guestName: 'Minh Hà',
        content: 'Chúc hai bạn trăm năm hạnh phúc!',
      })
    })
  })
})
