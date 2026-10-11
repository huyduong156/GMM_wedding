import { render, screen } from '@testing-library/react'
import { DeepOceanWebsite } from './DeepOceanWebsite'
import { deepOceanSections } from './fixture'

describe('DeepOceanWebsite', () => {
  it('renders the full website directly without an opening gate', () => {
    const { container } = render(<DeepOceanWebsite />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mai Anh')
    expect(container.querySelector('[data-editor-section="hero"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="gallery"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="capsule"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="film"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="wishes"]')).toBeInTheDocument()
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })

  it('respects section visibility and order from the website contract', () => {
    const sectionConfig = { ...deepOceanSections, enabled: ['hero', 'footer'] as const, order: ['footer', 'hero'] as const }
    const { container } = render(<DeepOceanWebsite sectionConfig={sectionConfig} />)
    const sections = [...container.querySelectorAll('[data-editor-section]')].map((item) => item.getAttribute('data-editor-section'))
    expect(sections).toEqual(['footer', 'hero'])
  })
})
