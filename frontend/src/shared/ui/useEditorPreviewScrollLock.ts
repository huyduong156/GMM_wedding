import { useEffect } from 'react'

export function useEditorPreviewScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previous = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      body.style.overflow = previous.bodyOverflow
      body.style.position = previous.bodyPosition
      body.style.top = previous.bodyTop
      body.style.width = previous.bodyWidth
      html.style.overflow = previous.htmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
