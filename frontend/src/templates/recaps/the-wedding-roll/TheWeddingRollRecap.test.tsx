import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TheWeddingRollRecap } from './TheWeddingRollRecap'
import { isSafeExternalAlbumUrl } from './album-url'
import { theWeddingRollRecapFixture } from './fixture'
import { theWeddingRollRecapTemplateConfig } from './template-config'

describe('The Wedding Roll template conversion', () => {
  it('renders the configured concept section anchors in their configured order', () => {
    render(<TheWeddingRollRecap />)

    const sectionKeys = [...document.querySelectorAll('[data-editor-section]')].map((section) =>
      section.getAttribute('data-editor-section'),
    )

    expect(sectionKeys).toEqual([
      'hero',
      'ourStory',
      'chapters',
      'moments',
      'photoDelivery',
      ...theWeddingRollRecapTemplateConfig.authoring.optionalSections,
      'thankYou',
    ])
    expect(sectionKeys).toHaveLength(11)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Ngày mình\s*chọn nhau\s*trọn đời\./,
    )
    expect(screen.getByText('Những tấm còn lại')).toBeInTheDocument()
    expect(screen.getByText('People behind the day')).toBeInTheDocument()
    expect(screen.getByText('Đọc lại mà')).toBeInTheDocument()
    expect(document.querySelector('.closing h2')).toHaveTextContent(
      'Cảm ơn vì đã cùng chúng mình tạo nên ngày hôm ấy.',
    )
  })

  it('opens featured photos in a lightbox from the photo delivery button', () => {
    render(<TheWeddingRollRecap />)

    expect(screen.getByAltText('Cặp đôi trong ngày cưới dưới nắng chiều')).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=85',
    )
    expect(document.querySelectorAll('.chapter-thumb img')).toHaveLength(3)
    expect(document.querySelectorAll('.moment-card')).toHaveLength(3)
    expect(document.querySelector('.film-strip')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^Xem ảnh nổi bật/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ảnh nổi bật' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tải ảnh đang xem' })).toHaveAttribute('download')
    expect(document.querySelectorAll('#photo-gallery')).toHaveLength(0)
  })

  it('keeps page-edge artwork decorative and pauses its ambient motion when hidden', async () => {
    const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden')
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    const { container, unmount } = render(<TheWeddingRollRecap />)
    const root = container.querySelector('.the-wedding-roll')

    expect(root).toHaveAttribute('data-motion-paused', 'false')
    expect(container.querySelector('.ambient-artwork')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('.ambient-mark')).toHaveLength(3)

    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    fireEvent(document, new Event('visibilitychange'))
    await waitFor(() => expect(root).toHaveAttribute('data-motion-paused', 'true'))

    unmount()
    if (originalHidden) Object.defineProperty(document, 'hidden', originalHidden)
    else Reflect.deleteProperty(document, 'hidden')
  })

  it('removes disabled optional sections without leaving empty section wrappers', () => {
    const content = {
      ...theWeddingRollRecapFixture,
      optional: {
        ...theWeddingRollRecapFixture.optional,
        peopleBehindTheDay: {
          ...theWeddingRollRecapFixture.optional.peopleBehindTheDay,
          enabled: false,
        },
        soundtrack: { ...theWeddingRollRecapFixture.optional.soundtrack, enabled: false },
        behindTheScenes: { ...theWeddingRollRecapFixture.optional.behindTheScenes, enabled: false },
        guestbook: { ...theWeddingRollRecapFixture.optional.guestbook, enabled: false },
        memoryCapsule: { ...theWeddingRollRecapFixture.optional.memoryCapsule, enabled: false },
      },
    }
    render(<TheWeddingRollRecap content={content} />)

    expect(
      [...document.querySelectorAll('[data-editor-section]')].map((section) =>
        section.getAttribute('data-editor-section'),
      ),
    ).toEqual(['hero', 'ourStory', 'chapters', 'moments', 'photoDelivery', 'thankYou'])
    expect(document.querySelector('.people-behind-section')).not.toBeInTheDocument()
    expect(document.querySelector('.soundtrack-feature')).not.toBeInTheDocument()
  })

  it('validates external album links and keeps them as explicitly external actions', () => {
    expect(isSafeExternalAlbumUrl('https://photos.example/albums/123')).toBe(true)
    expect(isSafeExternalAlbumUrl('http://photos.example/albums/123')).toBe(false)
    expect(isSafeExternalAlbumUrl('https://user:pass@photos.example/albums/123')).toBe(false)

    const content = {
      ...theWeddingRollRecapFixture,
      photoDelivery: {
        ...theWeddingRollRecapFixture.photoDelivery,
        externalAlbumUrl: 'https://photos.example/albums/123',
      },
    }
    render(<TheWeddingRollRecap content={content} />)

    expect(screen.getByRole('link', { name: /^Xem toàn bộ ảnh ngày hôm ấy/ })).toHaveAttribute(
      'href',
      'https://photos.example/albums/123',
    )
    expect(screen.getByRole('link', { name: /^Xem toàn bộ ảnh ngày hôm ấy/ })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })

  it('uses selected internal album media in the featured photos lightbox', () => {
    const content = structuredClone(theWeddingRollRecapFixture)
    content.photoDelivery.featuredPhotos = []
    content.photoDelivery.albums = [
      { type: 'INTERNAL_ALBUM', albumId: 'published-album', label: 'Album' },
    ]
    render(
      <TheWeddingRollRecap
        content={content}
        albumItems={[{ src: '/published/photo-1.jpg', alt: 'Selected wedding photo' }]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^Xem ảnh nổi bật/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Selected wedding photo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tải ảnh đang xem' })).toHaveAttribute(
      'href',
      '/published/photo-1.jpg',
    )
  })
})
