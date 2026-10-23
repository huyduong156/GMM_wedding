import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { ABeautifulDayWebsite } from './ABeautifulDayWebsite'
import { aBeautifulDayFixture, aBeautifulDaySections } from './fixture'
import { aBeautifulDayTemplateConfig } from './template-config'
import { ABeautifulDayCountdown } from './ABeautifulDayCountdown'

describe('ABeautifulDayWebsite', () => {
  it('renders the default chapter sequence and every enabled optional section', () => {
    const { container } = render(<ABeautifulDayWebsite />)
    const sectionIds = Array.from(container.querySelectorAll('.abd-site__content .abd-chapter')).map(
      (section) => section.id,
    )

    expect(sectionIds).toEqual([
      'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery',
      'schedule', 'rsvp', 'guestbook', 'footer',
    ])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mai Anh')
  })

  it('keeps the opening anchors fixed while respecting middle-section reordering', () => {
    const sectionConfig = {
      ...aBeautifulDaySections,
      order: [...aBeautifulDaySections.order].reverse(),
    }
    const { container } = render(<ABeautifulDayWebsite sectionConfig={sectionConfig} />)
    const sectionIds = Array.from(container.querySelectorAll('.abd-site__content .abd-chapter')).map(
      (section) => section.id,
    )

    expect(sectionIds.slice(0, 2)).toEqual(['hero', 'announcement'])
    expect(sectionIds.at(-1)).toBe('footer')
    expect(sectionIds.indexOf('gift')).toBe(-1)
  })

  it('resolves editor media objects against the wedding media projection', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.hero.heroMediaId = {
      mediaAssetId: 'media-hero',
      src: '/editor-preview.jpg',
      alt: 'Editor selected photo',
    }
    data.content.gallery.mediaIds = [{ mediaAssetId: 'media-bride', src: '/editor-gallery.jpg', alt: 'Portrait' }]

    const { container } = render(<ABeautifulDayWebsite data={data} />)
    expect(container.querySelector('.abd-hero__photo')).toHaveAttribute('src', data.media[0].publicUrl)
    expect(container.querySelector('.abd-gallery__item img')).toHaveAttribute('src', data.media[1].publicUrl)
  })

  it('omits empty optional media and hides private event data', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.gallery.mediaIds = []
    data.events = data.events.map((event) => ({ ...event, isPublic: false, name: 'PRIVATE EVENT SECRET' }))

    const { container } = render(<ABeautifulDayWebsite data={data} />)
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="countdown"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="rsvp"]')).not.toBeInTheDocument()
    expect(screen.queryByText('PRIVATE EVENT SECRET')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="events"] .abd-empty')).toBeInTheDocument()
  })

  it('falls back for broken photographs and removes an exhausted gallery and its link', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.gallery.mediaIds = ['media-hero']
    const { container } = render(<ABeautifulDayWebsite data={data} />)
    fireEvent.error(container.querySelector('.abd-gallery__item img')!)
    expect(container.querySelector('.abd-hero__photo')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(container.querySelector('a[href="#gallery"]')).not.toBeInTheDocument()
    fireEvent.error(container.querySelector('.abd-person__portrait img')!)
    expect(container.querySelector('.abd-person__portrait > span')).toHaveTextContent('M')
    expect(screen.getByRole('heading', { name: 'Mai Anh', level: 3 })).toBeInTheDocument()
  })

  it('rejects unresolved and non-READY media even when an editor object has a stale src', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.hero.heroMediaId = { mediaAssetId: 'media-hero', src: '/stale-private.jpg', alt: 'Ảnh cũ' }
    data.media[0].status = 'PROCESSING'
    data.content.couple.bride.portraitMediaId = { mediaAssetId: 'missing', src: '/unresolved.jpg' }
    const { container } = render(<ABeautifulDayWebsite data={data} />)
    expect(container.querySelector('.abd-hero__photo')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/stale-private.jpg"]')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/unresolved.jpg"]')).not.toBeInTheDocument()
  })

  it('renders opted-in sections with their configured copy while excluding empty party groups', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.weddingParty.groups.unshift({ id: 'empty', title: 'Nhóm trống', members: [] })
    data.content.weddingParty.groups[1].members[0].biography = 'Bạn thân từ thời đi học.'
    data.content.gift.accounts = [{ id: 'demo-gift', ownerLabel: 'Thông tin minh họa', accountNumber: 'DEMO', qrMediaId: null }]
    const sectionConfig = { ...aBeautifulDaySections, enabled: [...aBeautifulDaySections.order] }
    const { container } = render(<ABeautifulDayWebsite data={data} sectionConfig={sectionConfig} />)
    for (const key of ['weddingParty', 'dressCode', 'travel', 'faq', 'gift']) {
      expect(container.querySelector(`[data-editor-section="${key}"]`)).toBeInTheDocument()
    }
    expect(screen.queryByRole('heading', { name: 'Nhóm trống' })).not.toBeInTheDocument()
    expect(screen.getByText('Bạn thân từ thời đi học.')).toBeInTheDocument()
    expect(screen.getByText('Tài khoản: DEMO')).toBeInTheDocument()
    const faq = container.querySelector('.abd-faq details')!
    fireEvent.click(faq.querySelector('summary')!)
    expect(faq).toHaveAttribute('open')
  })

  it('hides empty and disabled optional destinations without reseeding them', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.story.milestones = []
    data.content.weddingParty.groups = []
    data.content.dressCode.message = '   '
    data.content.dressCode.colors = []
    data.content.travel.items = []
    data.content.faq.items = []
    data.content.schedule.items = []
    const sectionConfig = { ...aBeautifulDaySections, enabled: aBeautifulDaySections.order.filter((key) => key !== 'rsvp') }
    const { container } = render(<ABeautifulDayWebsite data={data} sectionConfig={sectionConfig} />)
    for (const key of ['story', 'weddingParty', 'dressCode', 'travel', 'faq', 'schedule', 'gift', 'rsvp']) {
      expect(container.querySelector(`[data-editor-section="${key}"]`)).not.toBeInTheDocument()
    }
    expect(container.querySelector('a[href="#rsvp"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="guestbook"]')).toBeInTheDocument()
  })

  it('keeps fallback story content text-only and omits invalid links', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.media = []
    data.content.couple.bride.socialLinks = [
      { label: 'Trang cá nhân', url: 'https://example.com/mai' },
      { label: 'Liên kết không hợp lệ', url: 'javascript:alert(1)' },
    ]
    data.events[0].mapUrl = 'https://'
    const { container } = render(<ABeautifulDayWebsite data={data} />)
    expect(container.querySelectorAll('.abd-story__item.is-text-only')).toHaveLength(3)
    expect(container.querySelector('.abd-story__image-fallback')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Trang cá nhân' })).toHaveAttribute('href', 'https://example.com/mai')
    expect(screen.queryByRole('link', { name: 'Liên kết không hợp lệ' })).not.toBeInTheDocument()
    expect(container.querySelector('a[href="https://"]')).not.toBeInTheDocument()
  })

  it('sorts schedule entries by local event day and time without changing authored content', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.schedule.items.reverse()
    const authored = structuredClone(data.content.schedule.items)
    const { container } = render(<ABeautifulDayWebsite data={data} />)
    expect(Array.from(container.querySelectorAll('.abd-schedule__list time')).map((item) => item.textContent)).toEqual(['16:00', '16:30', '18:30'])
    expect(data.content.schedule.items).toEqual(authored)
  })

  it('accepts canonical string event references and personalizes both draft forms', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.events.eventIds = ['event-reception']
    data.content.venues.eventIds = ['event-reception']
    data.content.rsvp.eventIds = ['event-reception']
    data.guestName = 'Khách minh họa'
    const { container } = render(<ABeautifulDayWebsite data={data} />)
    expect(container.querySelectorAll('.abd-event')).toHaveLength(1)
    expect(container.querySelectorAll('.abd-venue')).toHaveLength(1)
    for (const form of screen.getAllByRole('form')) {
      expect(within(form).queryByRole('textbox', { name: 'Tên của bạn' })).not.toBeInTheDocument()
      expect(within(form).getByText('Khách minh họa')).toBeInTheDocument()
    }
  })

  it('keeps draft config fields aligned to content and restricts decoration to the renderer', () => {
    expect(aBeautifulDayTemplateConfig.status).toBe('draft')
    expect(aBeautifulDayTemplateConfig.previewPath).toBe('/templates/websites/a-beautiful-day/preview')
    expect(aBeautifulDayTemplateConfig.sections.map((section) => section.sectionKey)).toEqual([...aBeautifulDaySections.order, 'music'])
    const content = aBeautifulDayFixture.content as unknown as Record<string, unknown>
    for (const section of aBeautifulDayTemplateConfig.sections) {
      if (!('fields' in section)) continue
      for (const field of Object.values(section.fields ?? {})) {
        expect(field.label).toBeTruthy()
        expect(field.contentKey?.split('.').reduce<unknown>((value, key) => value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined, content)).not.toBeUndefined()
        expect(field.mediaRole ?? '').not.toContain('decor')
      }
    }
  })

  it('opens the full gallery with keyboard navigation, focus containment and restored focus', () => {
    const { container } = render(<ABeautifulDayWebsite />)
    const opener = container.querySelector<HTMLButtonElement>('.abd-gallery__open')!
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Album ảnh cưới' })
    const close = within(dialog).getByRole('button', { name: 'Đóng album' })
    const next = within(dialog).getByRole('button', { name: 'Ảnh tiếp theo' })
    expect(close).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(within(dialog).getByText(`1 / ${aBeautifulDayFixture.content.gallery.mediaIds.length}`)).toBeInTheDocument()
    const firstSrc = dialog.querySelector('figure img')!.getAttribute('src')
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(dialog.querySelector('figure img')).not.toHaveAttribute('src', firstSrc)
    fireEvent.keyDown(dialog, { key: 'End' })
    const count = aBeautifulDayFixture.content.gallery.mediaIds.length
    expect(within(dialog).getByText(`${count} / ${count}`)).toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'Home' })
    expect(dialog.querySelector('figure img')).toHaveAttribute('src', firstSrc)
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true })
    expect(next).toHaveFocus()
    fireEvent.keyDown(next, { key: 'Tab' })
    expect(close).toHaveFocus()
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('closes an exhausted open gallery and restores document scrolling after image failure', () => {
    const data = structuredClone(aBeautifulDayFixture)
    data.content.gallery.mediaIds = ['media-hero']
    const { container } = render(<ABeautifulDayWebsite data={data} />)
    fireEvent.click(container.querySelector('.abd-gallery__open')!)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Ảnh tiếp theo' })).toBeDisabled()
    fireEvent.error(dialog.querySelector('figure img')!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(container.querySelector('#gallery')).not.toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('keeps static editor content visible without opening gallery interactions', () => {
    const { container } = render(<ABeautifulDayWebsite editorMode />)
    expect(container.querySelector('.abd-site')).not.toHaveClass('has-motion')
    expect(container.querySelectorAll('[data-motion-variant]')).not.toHaveLength(0)
    expect(container.querySelectorAll('[style*="opacity: 0"]')).toHaveLength(0)
    expect(container.querySelector('.abd-gallery__open')).toBeDisabled()
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  })

  it('updates isolated countdown units and settles to a nonnegative completed state', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2026-12-01T00:00:00Z'))
      const { container, unmount } = render(<ABeautifulDayCountdown startsAt="2026-12-01T00:00:02Z" />)
      expect(container.querySelector('.abd-countdown__units > span:last-child strong')).toHaveTextContent('02')
      act(() => { vi.advanceTimersByTime(1000) })
      expect(container.querySelector('.abd-countdown__units > span:last-child strong')).toHaveTextContent('01')
      act(() => { vi.advanceTimersByTime(2000) })
      expect(container.querySelector('.abd-countdown__units')).not.toBeInTheDocument()
      expect(screen.getByText(/Ngày vui đã đến/)).toBeInTheDocument()
      expect(vi.getTimerCount()).toBe(0)
      unmount()
    } finally { vi.useRealTimers() }
  })
})
