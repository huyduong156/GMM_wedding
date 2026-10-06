type BrandLogoProps = {
  variant?: 'default' | 'compact' | 'hero'
  tone?: 'brown' | 'light'
  className?: string
}

const sizes = {
  compact: 94,
  default: 148,
  hero: 310,
} as const

export function BrandLogo({
  variant = 'default',
  className,
}: BrandLogoProps) {
  return (
    <img
      className={className}
      src="/assets/logo/ourday-logo.png"
      alt="Ourday"
      style={{ width: sizes[variant], height: 'auto', objectFit: 'contain' }}
    />
  )
}
