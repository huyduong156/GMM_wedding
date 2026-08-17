import { useEffect } from 'react'

export function useEditorPreviewScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [locked])
}
