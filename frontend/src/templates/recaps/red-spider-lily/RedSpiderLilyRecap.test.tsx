import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RedSpiderLilyRecap } from './RedSpiderLilyRecap'
import { redSpiderLilyRecapContent } from './content'
import { redSpiderLilyRecapTemplateConfig } from './template-config'

describe('Red Spider Lily recap contract', () => {
  it('renders every required section from the empty-media fixture', () => {
    render(<RedSpiderLilyRecap />)

    const sections = [...document.querySelectorAll('[data-editor-section]')].map((section) => section.getAttribute('data-editor-section'))

    expect(sections).toEqual(expect.arrayContaining([...redSpiderLilyRecapTemplateConfig.authoring.requiredSections, ...redSpiderLilyRecapTemplateConfig.authoring.optionalSections]))
    expect(sections).toHaveLength(12)
    expect(screen.getByRole('heading', { level: 1, name: 'Minh & Anh' })).toBeInTheDocument()
    expect(screen.getByText('Xem & tải ảnh')).toBeInTheDocument()
  })

  it('keeps neutral media placeholders and supports disabling optional sections', () => {
    const { rerender } = render(<RedSpiderLilyRecap />)

    expect(screen.getAllByRole('img', { name: /Anh|ảnh|khu vực/i }).length).toBeGreaterThan(0)

    const disabled = {
      ...redSpiderLilyRecapContent,
      optional: Object.fromEntries(Object.entries(redSpiderLilyRecapContent.optional).map(([key, value]) => [key, { ...value, enabled: false }])) as typeof redSpiderLilyRecapContent.optional,
    }
    rerender(<RedSpiderLilyRecap data={disabled} />)
    expect(document.querySelector('[data-editor-section="guestbook"]')).toBeNull()
    expect(document.querySelector('[data-editor-section="memoryCapsule"]')).toBeNull()
  })

  it('keeps the semantic composition order declared by the template', () => {
    render(<RedSpiderLilyRecap />)

    const sections = [...document.querySelectorAll('[data-editor-section]')].map((section) => section.getAttribute('data-editor-section'))
    expect(sections).toEqual([
      'hero',
      'ourStory',
      'chapters',
      'moments',
      'photoDelivery',
      ...redSpiderLilyRecapTemplateConfig.authoring.optionalSections,
      'thankYou',
    ])
    expect(redSpiderLilyRecapTemplateConfig.composition.order).toEqual(['hero', 'ourStory', 'chapters', 'moments', 'photoDelivery', 'optional', 'thankYou'])
  })

  it('renders repeatable people and behind-the-scenes rails with item galleries', () => {
    render(<RedSpiderLilyRecap />)

    expect(document.querySelectorAll('.rsl-people-rail > .rsl-person')).toHaveLength(3)
    expect(document.querySelectorAll('.rsl-behind-rail > .rsl-behind-item')).toHaveLength(5)
    expect(document.querySelectorAll('.rsl-behind-rail > .rsl-behind-item[class*="is-slot-"]')).toHaveLength(4)
    const galleryButtons = screen.getAllByRole('button', { name: /Xem khoanh khac|Mo album ky niem/i })
    expect(galleryButtons).toHaveLength(11)

    fireEvent.click(galleryButtons[4])
    const dialog = screen.getByRole('dialog', { name: 'Album khoanh khac' })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('1 / 3')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByRole('button', { name: 'Dong album' }))
    expect(screen.queryByRole('dialog', { name: 'Album khoanh khac' })).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('provides an interactive 3D moments carousel and lightbox zoom', () => {
    render(<RedSpiderLilyRecap />)

    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    expect(document.querySelector('.rsl-3d-slide.is-active')).toHaveTextContent('Photobooth')
    fireEvent.click(screen.getByRole('button', { name: 'Khoanh khac tiep' }))
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(document.querySelector('.rsl-3d-slide.is-active')).toHaveTextContent('Bubble Memories')

    fireEvent.click(screen.getAllByRole('button', { name: /Xem khoanh khac|Mo album ky niem/i })[3])
    fireEvent.click(screen.getByRole('button', { name: 'Phong to anh' }))
    expect(document.querySelector('.rsl-lightbox-stage')).toHaveClass('is-zoomed')
  })

  it('opens multi-image albums from moments and timeline covers', () => {
    render(<RedSpiderLilyRecap />)

    fireEvent.click(document.querySelector('.rsl-3d-slide.is-active .rsl-moment-open') as HTMLElement)
    let dialog = screen.getByRole('dialog', { name: 'Album khoanh khac' })
    expect(within(dialog).getByText('1 / 3')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Dong album' }))

    fireEvent.click(document.querySelector('.rsl-chapter-image') as HTMLElement)
    dialog = screen.getByRole('dialog', { name: 'Album khoanh khac' })
    expect(within(dialog).getByText('1 / 2')).toBeInTheDocument()
  })
})
