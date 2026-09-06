import { render, screen } from '@testing-library/react'
import { EditorialVowsWebsite } from './EditorialVowsWebsite'
import { editorialVowsSections } from './fixture'

describe('EditorialVowsWebsite', () => {
  it('renders the website contract and accessible actions', () => {
    const { container } = render(<EditorialVowsWebsite />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Minh Anh')
    expect(screen.getByRole('button', { name: 'Phát nhạc nền' })).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="story"]')).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="footer"]')).toBeInTheDocument()
  })

  it('removes disabled optional sections from the DOM', () => {
    const sectionConfig = {
      ...editorialVowsSections,
      enabled: editorialVowsSections.enabled.filter((key) => key !== 'gift'),
    }
    const { container } = render(<EditorialVowsWebsite sectionConfig={sectionConfig} />)
    expect(container.querySelector('[data-editor-section="gift"]')).not.toBeInTheDocument()
  })
})
