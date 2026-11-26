import { describe, expect, it } from 'vitest'
import { createShareVersionToken, publicSurfaceMetadata } from './page-metadata'

describe('publicSurfaceMetadata', () => {
  it('uses couple names, the owner avatar, and the online invitation label', () => {
    expect(
      publicSurfaceMetadata(
        {
          ownerAvatarUrl: 'https://cdn.example.com/avatar.jpg',
          content: { brideName: 'Minh', groomName: 'An' },
        },
        'invitation',
        '/minh-an/invitation',
      ),
    ).toMatchObject({
      title: 'Minh & An | Thiệp cưới online',
      image: '/api/public/invitations/minh-an/og-image',
    })
  })

  it('versions generated invitation images when the avatar changes', () => {
    const firstAvatar = 'https://cdn.example.com/avatar-one.jpg'
    const nextAvatar = 'https://cdn.example.com/avatar-two.jpg'
    const first = publicSurfaceMetadata(
      { ownerAvatarUrl: firstAvatar, snapshotVersion: 4, content: { brideName: 'Minh', groomName: 'An' } },
      'invitation',
      '/minh-an/invitation',
    )
    const next = publicSurfaceMetadata(
      { ownerAvatarUrl: nextAvatar, snapshotVersion: 4, content: { brideName: 'Minh', groomName: 'An' } },
      'invitation',
      '/minh-an/invitation',
    )

    expect(first.image).toBe(`/api/public/invitations/minh-an/og-image?v=${createShareVersionToken(4, firstAvatar)}`)
    expect(next.image).toBe(`/api/public/invitations/minh-an/og-image?v=${createShareVersionToken(4, nextAvatar)}`)
    expect(next.image).not.toBe(first.image)
    expect(next.url).not.toBe(first.url)
  })

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

  it('reads the website SEO contract and its selected share image', () => {
    expect(
      publicSurfaceMetadata(
        {
          snapshotVersion: 7,
          ownerAvatarUrl: 'https://cdn.example.com/avatar.jpg',
          content: {
            seo: {
              title: 'Ngày cưới của Mai Anh và Hải Đăng',
              description: 'Cùng chung vui với chúng mình.',
              ogImage: { src: 'https://cdn.example.com/wedding-cover.jpg' },
            },
            hero: { brideName: 'Mai Anh', groomName: 'Hải Đăng' },
          },
        },
        'website',
        '/mai-hai/website',
      ),
    ).toMatchObject({
      title: 'Ngày cưới của Mai Anh và Hải Đăng',
      description: 'Cùng chung vui với chúng mình.',
      image: 'https://cdn.example.com/wedding-cover.jpg',
      url: expect.stringMatching(/^\/mai-hai\/website\?v=7-/),
      canonicalUrl: '/mai-hai/website',
    })
  })
})
