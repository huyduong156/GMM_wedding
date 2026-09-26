import { useEffect } from 'react'
import { mountFallingStars } from './falling-stars-runtime'
import './falling-stars.css'

type CountRange = { min: number; max: number }

export type FallingStarsProps = {
  target: string
  count?: number | CountRange
  className?: string
}

const DEFAULT_COUNT = { min: 4, max: 6 }

export function FallingStars({ target, count = DEFAULT_COUNT, className = '' }: FallingStarsProps) {
  useEffect(() => mountFallingStars(target, { count, className }), [className, count, target])
  return null
}
