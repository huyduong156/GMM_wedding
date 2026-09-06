import { render, screen } from '@testing-library/react'
import { GreenHydrangeaWebsite } from './GreenHydrangeaWebsite'
import { greenHydrangeaSections } from './fixture'

describe('GreenHydrangeaWebsite', () => {
  it('renders distinct couple portraits and the website contract', () => {
    const { container } = render(<GreenHydrangeaWebsite />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('An Nhiên')
    const portraits = Array.from(container.querySelectorAll('.gh-person img')).map((image) =>
      image.getAttribute('src'),
    )
    expect(new Set(portraits).size).toBe(2)
    expect(container.querySelector('[data-editor-section="rsvp"]')).toBeInTheDocument()
  })
  it('removes disabled optional sections', () => {
    const sectionConfig = {
      ...greenHydrangeaSections,
      enabled: greenHydrangeaSections.enabled.filter((key) => key !== 'gallery'),
    }
    const { container } = render(<GreenHydrangeaWebsite sectionConfig={sectionConfig} />)
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
  })
})
