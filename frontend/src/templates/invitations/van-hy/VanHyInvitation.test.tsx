import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { VanHyInvitation } from './VanHyInvitation'
import { vanHyFixture } from './fixture'
import { vanHyTemplateConfig } from './template-config'

describe('VanHyInvitation', () => {
  it('renders all configured sections after opening the invitation', async () => {
    const { container } = render(<VanHyInvitation data={vanHyFixture} sectionConfig={{ enabled: vanHyTemplateConfig.sections.map((section) => section.sectionKey), order: vanHyTemplateConfig.sections.map((section) => section.sectionKey) }} />)
    expect(screen.getByRole('button', { name: 'Mở thiệp Hỷ sự' })).toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="opening"]')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mở thiệp Hỷ sự' }))
    await waitFor(() => expect(container.querySelector('[data-editor-section="opening"]')).not.toBeInTheDocument(), { timeout: 1200 })
    const renderedKeys = Array.from(container.querySelectorAll<HTMLElement>('[data-editor-section]')).map((node) => node.dataset.editorSection)
    expect(renderedKeys).toEqual(vanHyTemplateConfig.sections.slice(1).map((section) => section.sectionKey))
    expect(screen.getByRole('heading', { name: 'Trân trọng báo tin vui' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hẹn bạn tại nơi chung vui' })).toBeInTheDocument()
  })

  it('supports optional section toggles without changing the content contract', () => {
    const enabled = vanHyTemplateConfig.sections.map((section) => section.sectionKey).filter((key) => key !== 'gallery')
    const { container } = render(<VanHyInvitation data={vanHyFixture} sectionConfig={{ enabled, order: enabled }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở thiệp Hỷ sự' }))
    expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-editor-section="rsvp"]')).toBeInTheDocument()
  })
})
