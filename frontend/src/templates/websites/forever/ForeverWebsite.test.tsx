import { render, screen } from '@testing-library/react'
import { beforeAll } from 'vitest'
import { ForeverWebsite } from './ForeverWebsite'
import { foreverSections } from './fixture'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

describe('ForeverWebsite', () => {
  it('renders the couple names and public interaction sections', () => {
    const { container } = render(<ForeverWebsite />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Linh')
    expect(container.querySelector('[data-editor-section="rsvp"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="guestbook"]')).toBeInTheDocument()
  })

  it('omits disabled optional sections', () => {
    const sectionConfig = {
      ...foreverSections,
      enabled: foreverSections.enabled.filter((key) => key !== 'gallery'),
    }

    const { container } = render(<ForeverWebsite sectionConfig={sectionConfig} />)

    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
  })
})
