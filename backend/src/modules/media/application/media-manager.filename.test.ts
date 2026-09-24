import { describe, expect, it } from 'vitest'
import { toWebpFileName } from './media-manager'

describe('toWebpFileName', () => {
  it.each([
    ['photo.jpg', 'photo.webp'],
    ['photo.PNG', 'photo.webp'],
    ['wedding.cover.final.jpeg', 'wedding.cover.final.webp'],
    ['photo', 'photo.webp'],
  ])('converts %s to %s', (input, expected) => {
    expect(toWebpFileName(input)).toBe(expected)
  })
})
