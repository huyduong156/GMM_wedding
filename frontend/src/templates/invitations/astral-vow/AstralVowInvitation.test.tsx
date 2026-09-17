import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AstralVowInvitation } from './AstralVowInvitation'
import { astralVowFixture, astralVowSectionConfig } from './fixture'
import { astralVowTemplateConfig } from './template-config'

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
    expect(container.querySelector('[data-editor-section="opening"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="footer"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="gallery"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="rsvp"]')).not.toBeInTheDocument()
    expect(astralVowSectionConfig.order).toHaveLength(14)
  })

  it('keeps essential invitation content usable when all user media is empty', () => {
    render(<AstralVowInvitation editorMode data={{ ...astralVowFixture, heroMedia: null, openingMediaBack: null, openingMediaFront: null, eventDetailsMedia: null, galleryImages: [], giftQrMedia: null, footerMedia: null, invitationMemoryImage1: '', invitationMemoryImage2: '', invitationMemoryImage3: '' }} />)
    expect(screen.getByText('Hai gia đình trân trọng báo tin')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stellarium Event Hall' })).toBeInTheDocument()
    expect(screen.getByText('Hẹn gặp bạn dưới cùng một bầu trời')).toBeInTheDocument()
  })

  it('maps opening media to Astral Vow roles', () => {
    const opening = astralVowTemplateConfig.sections.find((section) => typeof section !== 'string' && section.sectionKey === 'opening')
    if (!opening || typeof opening === 'string') throw new Error('Missing opening config')
    expect(opening.fields?.openingMediaBack).toMatchObject({ type: 'image', contentKey: 'openingMediaBack', mediaRole: 'opening-back' })
    expect(opening.fields?.openingMediaFront).toMatchObject({ type: 'image', contentKey: 'openingMediaFront', mediaRole: 'opening-front' })
  })

  it('keeps section content visible when viewport-observer motion is unavailable', () => {
    const { container } = render(<AstralVowInvitation editorMode />)
    expect(container.querySelector('[data-editor-section="cover"]')).toHaveClass('is-in-view')
  })
})
