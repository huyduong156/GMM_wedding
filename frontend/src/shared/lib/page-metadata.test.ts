import { describe, expect, it } from 'vitest'
import { publicSurfaceMetadata } from './page-metadata'

describe('publicSurfaceMetadata', () => {
  it('uses couple names and the first suitable uploaded image', () => {
    expect(
      publicSurfaceMetadata(
        {
          content: {
            hero: {
              brideName: 'Mai Anh',
              groomName: 'Hải Đăng',
              image: { src: 'https://cdn.example.com/couple.jpg' },
            },
          },
        },
        'website',
        '/mai-hai/website',
      ),
    ).toEqual({
      title: 'Mai Anh & Hải Đăng | Website cưới',
      description: 'Cùng khám phá câu chuyện và những thông tin về ngày cưới của Mai Anh & Hải Đăng.',
      image: 'https://cdn.example.com/couple.jpg',
      canonicalUrl: '/mai-hai/website',
      url: '/mai-hai/website',
    })
  })

  it('supports recap content where the couple is a single hero field', () => {
    const metadata = publicSurfaceMetadata(
      {
        content: {
          hero: {
            couple: 'Minh & Anh',
            media: { src: '/uploads/recap-cover.jpg' },
          },
        },
      },
      'recap',
      '/minh-anh/recaps',
    )

    expect(metadata.title).toBe('Minh & Anh | Wedding Recap')
    expect(metadata.image).toBe('/uploads/recap-cover.jpg')
  })

  it('honors explicit social title and image values from the publication payload', () => {
    expect(
      publicSurfaceMetadata(
        {
          ogTitle: 'Ngày vui của An và Bình',
          ogImageUrl: 'https://cdn.example.com/share.jpg',
          content: { brideName: 'An', groomName: 'Bình' },
        },
        'invitation',
        '/an-binh/invitation',
      ),
    ).toMatchObject({
      title: 'Ngày vui của An và Bình',
      image: 'https://cdn.example.com/share.jpg',
    })
  })
})
