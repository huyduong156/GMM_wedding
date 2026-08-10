import { fireEvent, render, screen } from '@testing-library/react'
import { ModernLuxeInvitation, type ModernLuxeSectionKey } from './ModernLuxeInvitation'
import { ModernLuxePreviewPage } from '../../../pages/public-invitation/ui/ModernLuxePreviewPage'
import { liveEditorEvents } from '../../../shared/lib/live-template-editor'

describe('ModernLuxeInvitation editor renderer', () => {
  it('opens immediately and applies enabled/order config without remounting', () => {
    const order: ModernLuxeSectionKey[] = ['cover', 'gallery', 'invitation', 'eventDetails', 'countdown', 'timeline', 'venue', 'rsvp', 'guestbook', 'gift', 'loveJourney', 'families']
    render(<ModernLuxeInvitation editorMode data={{ brideName: 'An', groomName: 'Bình' }} sectionConfig={{ order, enabled: order.filter((key) => key !== 'gift') }} />)
    expect(screen.getByRole('heading', { name: /An.*Bình/i })).toBeInTheDocument()
    expect(document.querySelector('[data-editor-section="gallery"]')).toHaveStyle({ order: '1' })
    expect(document.querySelector('[data-editor-section="gift"]')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Mở thiệp/i })).not.toBeInTheDocument()
  })

  it('scrolls the iframe renderer to a requested section', () => {
    window.history.replaceState(null, '', '/templates/invitations/modern-luxe/preview?editor=1')
    render(<ModernLuxePreviewPage />)
    const gallery = document.querySelector('[data-editor-section="gallery"]') as HTMLElement
    gallery.getBoundingClientRect = () => ({ top: 420 } as DOMRect)
    fireEvent(window, new MessageEvent('message', { origin: window.location.origin, source: window, data: { type: liveEditorEvents.scrollToSection, version: 1, payload: { sectionKey: 'gallery' } } }))
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 420, behavior: 'smooth' })
  })

  it('keeps family content separate and supports explicit honorific fields', () => {
    render(<ModernLuxeInvitation editorMode data={{ groomFatherTitle: 'Bác', groomFather: 'Phạm Văn Minh' }} />)
    const families = document.querySelector('[data-editor-section="families"]')
    expect(families).toHaveTextContent('Bác')
    expect(families).toHaveTextContent('Phạm Văn Minh')
    expect(document.querySelector('[data-editor-section="invitation"]')).not.toHaveTextContent('Phạm Văn Minh')
  })

  it('keeps parsing only as a compatibility fallback for legacy family names', () => {
    render(<ModernLuxeInvitation editorMode data={{ groomFather: 'Ông Phạm Văn Cũ' }} />)
    expect(document.querySelector('[data-editor-section="families"]')).toHaveTextContent('Phạm Văn Cũ')
  })
})
