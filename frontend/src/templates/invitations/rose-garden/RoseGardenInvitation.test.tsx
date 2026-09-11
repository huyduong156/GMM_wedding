import { fireEvent, render, screen } from '@testing-library/react'

import { roseGardenFixture, roseGardenSectionConfig } from './fixture'
import { RoseGardenInvitation } from './RoseGardenInvitation'
import { roseGardenTemplateConfig } from './template-config'

describe('RoseGardenInvitation', () => {
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
    expect(container.querySelectorAll('.rg-opening-layer')).toHaveLength(4)
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
})
