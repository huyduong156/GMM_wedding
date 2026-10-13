import { fireEvent, render, screen } from '@testing-library/react'
import { DeepOceanWebsite } from './DeepOceanWebsite'
import { deepOceanSections } from './fixture'

describe('DeepOceanWebsite', () => {
  it('renders the full website directly without an opening gate', () => {
    const { container } = render(<DeepOceanWebsite />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mai Anh')
    expect(container.querySelector('.ocean-hero')).toBeInTheDocument()
    expect(container.querySelector('.ocean-hero-photo img')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="hero"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="gallery"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="capsule"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="film"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="wishes"]')).toBeInTheDocument()
    expect(container.querySelector('.ocean-gallery-rail button')).toBeInTheDocument()
  })

  it('respects section visibility and order from the website contract', () => {
    const sectionConfig = { ...deepOceanSections, enabled: ['hero', 'footer'] as const, order: ['footer', 'hero'] as const }
    const { container } = render(<DeepOceanWebsite sectionConfig={sectionConfig} />)
    const sections = [...container.querySelectorAll('[data-editor-section]')].map((item) => item.getAttribute('data-editor-section'))
    expect(sections).toEqual(['footer', 'hero'])
  })

  it('only exposes navigation anchors for enabled sections', () => {
    const sectionConfig = { ...deepOceanSections, enabled: ['navigation', 'hero', 'gallery', 'footer'] as const, order: ['navigation', 'hero', 'gallery', 'footer'] as const }
    render(<DeepOceanWebsite sectionConfig={sectionConfig} />)

    expect(screen.getByRole('navigation')).toHaveAccessibleName('Deep Ocean navigation')
    expect(screen.getByRole('navigation').querySelectorAll('a')).toHaveLength(3)
    expect(screen.getByRole('navigation').querySelector('a[href="#gallery"]')).toBeInTheDocument()
    expect(screen.getByRole('navigation').querySelector('a[href="#story"]')).not.toBeInTheDocument()
  })

  it('renders the new ocean composition with 3D pearl and editable gallery', () => {
    const { container } = render(<DeepOceanWebsite />)

    expect(container.querySelector('.ocean-pearl-scene')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.ocean-pearl-scene canvas')).toBeInTheDocument()
    expect(container.querySelectorAll('.ocean-gallery-rail button')).toHaveLength(6)
    expect(container.querySelector('.ocean-capsule img')).toHaveAttribute('alt', '')
  })

  it('switches the featured gallery image when a thumbnail is selected', () => {
    const { container } = render(<DeepOceanWebsite />)
    const thumbnails = container.querySelectorAll<HTMLButtonElement>('.ocean-gallery-rail button')

    fireEvent.click(thumbnails[1])

    expect(thumbnails[1]).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('.ocean-gallery-feature figcaption')).toHaveTextContent('02 / 06')
  })
})
