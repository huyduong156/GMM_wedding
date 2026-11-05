import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TheWeddingRollRecap } from './TheWeddingRollRecap'
import { isSafeExternalAlbumUrl } from './album-url'
import { theWeddingRollRecapFixture } from './fixture'
import { theWeddingRollRecapTemplateConfig } from './template-config'

describe('The Wedding Roll template conversion', () => {
  it('preserves all twelve concept section anchors and their order', () => {
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
    expect(sectionKeys).toHaveLength(12)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Ngày mình\s*chọn nhau\s*trọn đời\./,
    )
    expect(screen.getByText('Những tấm còn lại')).toBeInTheDocument()
    expect(screen.getByText('People behind the day')).toBeInTheDocument()
    expect(screen.queryByText('PLAY THE MEMORY')).not.toBeInTheDocument()
    expect(screen.getByText('Đọc lại mà')).toBeInTheDocument()
    expect(document.querySelector('.closing h2')).toHaveTextContent(
      'Cảm ơn vì đã cùng chúng mình tạo nên ngày hôm ấy.',
    )
  })

  it('plays the wedding film only after an explicit click when a source exists', () => {
    const content = structuredClone(theWeddingRollRecapFixture)
    content.optional.weddingFilm.videoSrc = '/demo/wedding-film.mp4'
    const { container } = render(<TheWeddingRollRecap content={content} />)

    fireEvent.click(screen.getByRole('button', { name: 'PLAY THE MEMORY' }))

    expect(container.querySelector('video')).toHaveAttribute('src', '/demo/wedding-film.mp4')
    expect(container.querySelector('video')).toHaveAttribute('controls')
  })

  it('keeps the original cover, chapter, moment and film-strip imagery', () => {
    render(<TheWeddingRollRecap />)

    expect(screen.getByAltText('Cặp đôi trong ngày cưới dưới nắng chiều')).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=85',
    )
    expect(document.querySelectorAll('.chapter-thumb img')).toHaveLength(3)
    expect(document.querySelectorAll('.moment-card')).toHaveLength(3)
    expect(document.querySelectorAll('.film-strip img')).toHaveLength(7)
    expect(screen.getByRole('link', { name: /^Mở & tải album ảnh/ })).toHaveAttribute(
      'href',
      '#album',
    )
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

  it('removes disabled optional sections without leaving cards or section gaps', () => {
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
        weddingFilm: { ...theWeddingRollRecapFixture.optional.weddingFilm, enabled: false },
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
    expect(document.querySelector('.optional')).toBeInTheDocument()
    expect(document.querySelector('.optional-grid')?.children).toHaveLength(0)
  })

  it('validates external album links and keeps them as explicitly external actions', () => {
    expect(isSafeExternalAlbumUrl('https://photos.example/albums/123')).toBe(true)
    expect(isSafeExternalAlbumUrl('http://photos.example/albums/123')).toBe(false)
    expect(isSafeExternalAlbumUrl('https://user:pass@photos.example/albums/123')).toBe(false)

    const content = {
      ...theWeddingRollRecapFixture,
      photoDelivery: {
        ...theWeddingRollRecapFixture.photoDelivery,
        albums: [
          {
            type: 'EXTERNAL_ALBUM_LINK' as const,
            href: 'https://photos.example/albums/123',
            label: 'Album đã chia sẻ',
          },
        ],
      },
    }
    render(<TheWeddingRollRecap content={content} />)

    expect(screen.getByRole('link', { name: /^Mở album ảnh/ })).toHaveAttribute(
      'href',
      'https://photos.example/albums/123',
    )
    expect(screen.getByRole('link', { name: /^Mở album ảnh/ })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })

  it('shows only recap-selected media for an internal album and exposes downloads', () => {
    const content = structuredClone(theWeddingRollRecapFixture)
    content.photoDelivery.albums = [
      { type: 'INTERNAL_ALBUM', albumId: 'published-album', label: 'Album' },
    ]
    render(
      <TheWeddingRollRecap
        content={content}
        albumItems={[{ src: '/published/photo-1.jpg', alt: 'Selected wedding photo' }]}
      />,
    )

    expect(screen.getByRole('link', { name: /^Mở album ảnh/ })).toHaveAttribute(
      'href',
      '#photo-gallery',
    )
    expect(screen.getByRole('link', { name: 'Selected wedding photo' })).toHaveAttribute('download')
    expect(document.querySelectorAll('#photo-gallery img')).toHaveLength(1)
  })
})
