import { useCallback, useEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes } from 'react'

type TemplateThumbnailProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'className'> & {
  className?: string
  imageClassName?: string
}

export function TemplateThumbnail({ className, imageClassName, onLoad, ...props }: TemplateThumbnailProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [overflow, setOverflow] = useState(0)
  const [hovered, setHovered] = useState(false)

  const measure = useCallback(() => {
    const frame = frameRef.current
    const image = imageRef.current
    if (!frame || !image) return
    setOverflow(Math.max(0, image.getBoundingClientRect().height - frame.clientHeight))
  }, [])

  useEffect(() => {
    measure()
    const frame = frameRef.current
    const image = imageRef.current
    if (!frame || !image) return
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(image)
    return () => observer.disconnect()
  }, [measure])

  const style = {
    '--template-thumbnail-overflow': `${overflow}px`,
    '--template-thumbnail-duration': `${Math.max(4, overflow / 24)}s`,
  } as CSSProperties

  return (
    <div
      ref={frameRef}
      className={`template-thumbnail-scroll${className ? ` ${className}` : ''}`}
      style={style}
      onMouseEnter={() => overflow > 0 && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        ref={imageRef}
        {...props}
        className={`${imageClassName ?? ''}${hovered ? ' is-scrolling' : ''}`.trim()}
        onLoad={(event) => {
          measure()
          onLoad?.(event)
        }}
      />
    </div>
  )
}
