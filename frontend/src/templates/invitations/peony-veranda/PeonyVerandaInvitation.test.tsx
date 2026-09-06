import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PeonyVerandaInvitation } from './PeonyVerandaInvitation'
import { peonyVerandaFixture } from './fixture'
import { peonyVerandaTemplateConfig } from './template-config'

describe('PeonyVerandaInvitation', () => {
  it('renders every configured section and primary interactive surfaces', () => {
    const { container } = render(<PeonyVerandaInvitation editorMode data={peonyVerandaFixture} />)
    const renderedKeys = Array.from(
      container.querySelectorAll<HTMLElement>('[data-editor-section]'),
    ).map((node) => node.dataset.editorSection)
    const configuredKeys = peonyVerandaTemplateConfig.sections.map((section) =>
      typeof section === 'string' ? section : section.sectionKey,
    )
    expect(configuredKeys).toEqual([
      'cover',
      'banner',
      'announcement',
      'families',
      'couple',
      'countdown',
      'venue',
      'calendar',
      'timeline',
      'activities',
      'rsvp',
      'gallery',
      'guestbook',
      'gift',
      'music',
      'footer',
    ])
    expect(new Set(configuredKeys).size).toBe(configuredKeys.length)
    expect(configuredKeys).not.toEqual(
      expect.arrayContaining(['dateTime', 'ceremony', 'reception', 'addToCalendar']),
    )
    expect(renderedKeys).toEqual(expect.arrayContaining(configuredKeys))
    expect(
      screen.getByRole('heading', { level: 2, name: /Lễ thành hôn của chúng mình/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ảnh tiếp theo' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Thêm ngày cưới vào Google Calendar' }),
    ).toBeInTheDocument()
  })

  it('supports optional section toggles and guest-specific greeting', () => {
    const configuredKeys = peonyVerandaTemplateConfig.sections.map((section) =>
      typeof section === 'string' ? section : section.sectionKey,
    )
    const sectionConfig = { enabled: configuredKeys.filter((key) => key !== 'gallery'), order: [] }
    const interactions = {
      isPersonalized: true,
      guestName: 'Anh Ba Hưng',
      rsvp: {
        isPersonalized: true,
        submitting: false,
        submitted: false,
        error: '',
        submit: vi.fn(),
      },
      wishes: { items: [], submitting: false, submitted: false, error: '', submit: vi.fn() },
    }
    const { container } = render(
      <PeonyVerandaInvitation
        editorMode
        sectionConfig={sectionConfig}
        interactions={interactions}
      />,
    )
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(screen.getByText('Anh Ba Hưng')).toBeInTheDocument()
  })

  it('hides RSVP choices after the guest responds', async () => {
    const submit = vi.fn().mockResolvedValue(true)
    const interactions = {
      isPersonalized: true,
      guestName: 'Anh Ba Hưng',
      rsvp: { isPersonalized: true, submitting: false, submitted: false, error: '', submit },
      wishes: { items: [], submitting: false, submitted: false, error: '', submit: vi.fn() },
    }
    render(<PeonyVerandaInvitation data={peonyVerandaFixture} interactions={interactions} />)
    fireEvent.click(screen.getByRole('button', { name: 'Mình sẽ tham dự' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Cảm ơn bạn đã phản hồi.')
    expect(screen.queryByRole('button', { name: 'Mình sẽ tham dự' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mình chưa thể đến' })).not.toBeInTheDocument()
  })
  it('uses the personalized guest identity when submitting a wish', async () => {
    const submit = vi.fn().mockResolvedValue(true)
    const interactions = {
      isPersonalized: true,
      guestName: 'Anh Ba Hưng',
      rsvp: {
        isPersonalized: true,
        submitting: false,
        submitted: false,
        error: '',
        submit: vi.fn(),
      },
      wishes: { items: [], submitting: false, submitted: false, error: '', submit },
    }
    render(<PeonyVerandaInvitation data={peonyVerandaFixture} interactions={interactions} />)
    expect(screen.queryByRole('textbox', { name: 'Tên của bạn' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: 'Lời chúc' }), {
      target: { value: 'Chúc hai bạn trăm năm hạnh phúc.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
    expect(submit).toHaveBeenCalledWith({
      guestName: undefined,
      content: 'Chúc hai bạn trăm năm hạnh phúc.',
    })
    await waitFor(() =>
      expect(screen.getByText('Cảm ơn bạn đã gửi lời chúc đến chúng mình.')).toBeInTheDocument(),
    )
    expect(document.querySelector<HTMLButtonElement>('.pv-wish-fields button')).toBeDisabled()
  })

  it('uses the entered name for a non-personalized wish', async () => {
    const submit = vi.fn().mockResolvedValue(true)
    const interactions = {
      isPersonalized: false,
      guestName: null,
      rsvp: {
        isPersonalized: false,
        submitting: false,
        submitted: false,
        error: '',
        submit: vi.fn(),
      },
      wishes: { items: [], submitting: false, submitted: false, error: '', submit },
    }
    render(<PeonyVerandaInvitation data={peonyVerandaFixture} interactions={interactions} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Tên của bạn' }), {
      target: { value: 'Ngọc Anh' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Lời chúc' }), {
      target: { value: 'Chúc hai bạn luôn vui vẻ.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
    expect(submit).toHaveBeenCalledWith({
      guestName: 'Ngọc Anh',
      content: 'Chúc hai bạn luôn vui vẻ.',
    })
  })
  it('keeps gallery keyboard controls and gift QR usable', () => {
    render(
      <PeonyVerandaInvitation
        editorMode
        data={{ ...peonyVerandaFixture, giftQrMedia: '/uploads/gift-qr.png' }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ảnh tiếp theo' }))
    expect(screen.getByRole('img', { name: 'Ảnh trong album 2' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem thông tin mừng cưới' }))
    expect(screen.getByRole('region', { name: 'Thông tin mừng cưới' })).toBeInTheDocument()
  })
})
