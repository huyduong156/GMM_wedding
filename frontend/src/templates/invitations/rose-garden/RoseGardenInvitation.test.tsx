import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { roseGardenFixture, roseGardenSectionConfig } from './fixture'
import { RoseGardenInvitation } from './RoseGardenInvitation'
import { roseGardenTemplateConfig } from './template-config'

describe('RoseGardenInvitation', () => {
  const optionalKeys = [
    'countdown',
    'timeline',
    'venue',
    'gallery',
    'rsvp',
    'guestbook',
    'gift',
    'music',
  ] as const

  it('renders the complete Phase 3 section map and opening layers', () => {
    const { container } = render(<RoseGardenInvitation editorMode data={roseGardenFixture} />)
    const configuredKeys = roseGardenTemplateConfig.sections.map((section) =>
      typeof section === 'string' ? section : section.sectionKey,
    )
    const renderedKeys = Array.from(
      container.querySelectorAll<HTMLElement>('[data-editor-section]'),
    ).map((section) => section.dataset.editorSection)

    expect(configuredKeys).toEqual(roseGardenSectionConfig.order)
    expect(new Set(configuredKeys).size).toBe(configuredKeys.length)
    expect(renderedKeys).toEqual(expect.arrayContaining(configuredKeys))
    expect(container.querySelector('[data-editor-section="opening"]')).toHaveClass('classic-card-cover')
    expect(container.querySelectorAll('.classic-card-cover__flower')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Ngày mình chung đôi' })).toBeInTheDocument()
    expect(screen.getByText('Hai gia đình trân trọng báo tin')).toBeInTheDocument()
  })

  it('honors optional section toggles and opens the static gate', () => {
    const sectionConfig = {
      enabled: roseGardenSectionConfig.enabled.filter((key) => key !== 'gallery'),
      order: roseGardenSectionConfig.order,
    }
    const { container } = render(<RoseGardenInvitation sectionConfig={sectionConfig} />)

    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(container.querySelector('.rg-invitation')).not.toHaveClass('is-opened')
    fireEvent.click(screen.getByRole('button', { name: 'Chạm để mở thiệp' }))
    expect(container.querySelector('.rg-invitation')).toHaveClass('is-opened')
    expect(screen.getByRole('button', { name: 'Thiệp đã mở' })).toBeInTheDocument()
  })

  it('locks the opening trigger and transfers focus to the cover', async () => {
    const { container } = render(<RoseGardenInvitation />)
    const trigger = screen.getByRole('button', { name: 'Chạm để mở thiệp' })

    fireEvent.click(trigger)

    expect(trigger).toBeDisabled()
    await waitFor(() => expect(container.querySelector('[data-editor-section="cover"]')).toHaveFocus())
  })

  it.each(optionalKeys)('removes optional section %s without removing required content', (key) => {
    const sectionConfig = {
      enabled: roseGardenSectionConfig.enabled.filter((sectionKey) => sectionKey !== key),
      order: roseGardenSectionConfig.order,
    }
    const { container } = render(
      <RoseGardenInvitation editorMode sectionConfig={sectionConfig} />,
    )

    expect(container.querySelector(`[data-editor-section="${key}"]`)).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="opening"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="footer"]')).toBeInTheDocument()
  })

  it('reveals an optional section when an editor re-enables it after mount', async () => {
    const hiddenConfig = {
      enabled: roseGardenSectionConfig.enabled.filter((key) => key !== 'gallery'),
      order: roseGardenSectionConfig.order,
    }
    const view = render(<RoseGardenInvitation editorMode sectionConfig={hiddenConfig} />)
    expect(view.container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()

    view.rerender(<RoseGardenInvitation editorMode sectionConfig={roseGardenSectionConfig} />)
    await waitFor(() => expect(view.container.querySelector('[data-editor-section="gallery"]')).toHaveClass('is-visible'))
  })

  it('restores required anchors and normalizes malformed stored order', () => {
    const { container } = render(
      <RoseGardenInvitation
        editorMode
        sectionConfig={{
          enabled: ['gallery', 'rsvp'],
          order: ['footer', 'gallery', 'gallery', 'rsvp', 'opening'],
        }}
      />,
    )

    for (const key of ['opening', 'cover', 'invitation', 'families', 'eventDetails', 'footer']) {
      expect(container.querySelector(`[data-editor-section="${key}"]`)).toBeInTheDocument()
    }
    expect(container.querySelector('[data-editor-section="opening"]')).toHaveStyle({ order: 0 })
    expect(container.querySelector('[data-editor-section="gallery"]')).toHaveStyle({ order: 5 })
    expect(container.querySelector('[data-editor-section="rsvp"]')).toHaveStyle({ order: 6 })
    expect(container.querySelector('[data-editor-section="footer"]')).toHaveStyle({ order: 7 })
  })

  it('keeps long family content intact for the stacked mobile composition', () => {
    const { container } = render(
      <RoseGardenInvitation
        editorMode
        data={{
          ...roseGardenFixture,
          families: {
            ...roseGardenFixture.families,
            brideSide: {
              ...roseGardenFixture.families?.brideSide,
              father: 'Nguyễn Hoàng Minh Khôi',
              mother: 'Trần Thị Thuỳ Dương',
              address: 'Phường Trúc Bạch, quận Ba Đình, thành phố Hà Nội',
            },
            groomSide: {
              ...roseGardenFixture.families?.groomSide,
              father: 'Phạm Nguyễn Đức Anh',
              mother: 'Lê Thị Ngọc Phương',
              address: 'Phường Quảng An, quận Tây Hồ, thành phố Hà Nội',
            },
          },
        }}
      />,
    )

    expect(container.querySelectorAll('.rg-family-side')).toHaveLength(2)
    expect(screen.getByText('Nguyễn Hoàng Minh Khôi')).toBeInTheDocument()
    expect(screen.getByText('Phường Quảng An, quận Tây Hồ, thành phố Hà Nội')).toBeInTheDocument()
  })

  it('keeps empty user media slots separate from renderer-owned decor', () => {
    const { container } = render(
      <RoseGardenInvitation
        editorMode
        data={{
          ...roseGardenFixture,
          heroMedia: null,
          openingMediaBack: null,
          openingMediaFront: null,
          eventDetailsMedia: null,
          footerMedia: null,
          galleryImages: [],
          invitationMemoryImage1: '',
          invitationMemoryImage2: '',
          invitationMemoryImage3: '',
        }}
      />,
    )

    expect(container.querySelector('.rg-cover-art .rg-empty-artwork')).toBeInTheDocument()
    expect(container.querySelector('.rg-cover-art .rg-user-media')).not.toBeInTheDocument()
    expect(container.querySelector('.rg-cover-decor')).toBeInTheDocument()
    expect(container.querySelectorAll('.rg-memory-card .rg-user-media')).toHaveLength(0)
    expect(container.querySelectorAll('.rg-memory-card .rg-empty-artwork')).toHaveLength(3)
    expect(container.querySelector('.rg-letter-decor')).toBeInTheDocument()
    expect(container.querySelector('.rg-event-divider.rg-user-media')).not.toBeInTheDocument()
    expect(container.querySelector('.rg-event-divider.rg-section-decor')).toBeInTheDocument()
    expect(container.querySelector('.rg-gallery-empty')).toBeInTheDocument()
    expect(container.querySelector('.rg-gallery-rail')).not.toBeInTheDocument()
    expect(
      Array.from(container.querySelectorAll('.rg-opening-layer')).every((image) => image.getAttribute('src')),
    ).toBe(true)
  })

  it('uses the repository demo couple media in the default fixture', () => {
    const { container } = render(<RoseGardenInvitation editorMode data={roseGardenFixture} />)

    expect(container.querySelector('.rg-cover-art .rg-user-media')).toHaveAttribute(
      'src',
      '/assets/images/templates/red-spider-lily/demo/asian-couple-arch.jpg',
    )
    expect(container.querySelectorAll('.rg-memory-card .rg-user-media')).toHaveLength(3)
    expect(container.querySelectorAll('.rg-gallery-rail .rg-user-media')).toHaveLength(3)
    expect(container.querySelectorAll('.rg-timeline-media')).toHaveLength(3)
    expect(container.querySelector('.rg-footer-media')).toHaveAttribute(
      'src',
      '/assets/images/templates/red-spider-lily/demo/asian-couple-portrait.jpg',
    )
  })

  it('includes the Phase 4 timeline bloom and motion-ready surface', () => {
    const { container } = render(<RoseGardenInvitation editorMode data={roseGardenFixture} />)

    expect(container.querySelectorAll('.rg-timeline-bloom')).toHaveLength(3)
    expect(container.querySelector('.rg-page')).toHaveClass('rg-motion-ready')
    expect(container.querySelectorAll('.rg-body-section.is-visible').length).toBeGreaterThan(0)
  })

  it('keeps Phase 5 atmosphere bounded and decorative', () => {
    const { container } = render(<RoseGardenInvitation editorMode data={roseGardenFixture} />)

    expect(container.querySelector('.rg-cover-atmosphere')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('.rg-cover-petal')).toHaveLength(9)
    expect(container.querySelector('.rg-cover-petal-cluster')).toHaveAttribute('alt', '')
    expect(container.querySelector('.rg-gallery')).toBeInTheDocument()
  })
})
