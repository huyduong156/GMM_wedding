import { useEffect, useMemo, useState } from 'react'
import { EVENTS, Joyride, STATUS, type EventData, type Step } from 'react-joyride'
import { guideFor, guideKeyForPath } from '../model/guide-content'
import { useGuide } from './GuideProvider'
import './product-guide.css'

export function ProductGuide({ pathname }: { pathname: string }) {
  const { guideList, activeGuide, startGuide, finishGuide, closeGuide } = useGuide()
  const [isMobile, setIsMobile] = useState(false)
  const routeGuide = guideKeyForPath(pathname)

  useEffect(() => {
    if (activeGuide && activeGuide !== routeGuide) closeGuide()
  }, [activeGuide, closeGuide, routeGuide])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!routeGuide || activeGuide || guideList[routeGuide]) return
    const timer = window.setInterval(() => {
      const targetReady = guideFor(routeGuide, isMobile).some((item) => {
        if (typeof item.target !== 'string') return true
        return Boolean(document.querySelector(item.target))
      })

      if (targetReady) {
        window.clearInterval(timer)
        startGuide(routeGuide)
      }
    }, 200)

    return () => window.clearInterval(timer)
  }, [activeGuide, guideList, isMobile, routeGuide, startGuide])

  const steps = useMemo<Step[]>(() => {
    if (!activeGuide) return []
    return guideFor(activeGuide, isMobile).filter((item) => {
      if (typeof item.target !== 'string') return true
      return typeof document !== 'undefined' && Boolean(document.querySelector(item.target))
    })
  }, [activeGuide, isMobile])

  if (!activeGuide || !steps.length) return null

  return (
    <Joyride
      steps={steps}
      run
      continuous
      scrollToFirstStep
      options={{
        buttons: ['back', 'primary', 'skip'],
        showProgress: true,
        scrollDuration: 250,
        skipBeacon: true,
        overlayColor: 'rgba(29, 24, 20, 0.58)',
        primaryColor: '#a66a3f',
        textColor: '#2e2823',
        spotlightRadius: 12,
        zIndex: 10000,
      }}
      locale={{
        back: 'Quay lại',
        close: 'Đóng',
        last: 'Bắt đầu sử dụng',
        next: 'Tiếp theo',
        nextWithProgress: 'Tiếp theo ({current}/{total})',
        skip: 'Bỏ qua',
      }}
      styles={{
        tooltip: { borderRadius: 18, padding: 20, width: 360 },
        tooltipTitle: { fontSize: 17, fontWeight: 700, marginBottom: 8 },
        tooltipContent: { fontSize: 14, lineHeight: 1.6, padding: '4px 0 12px' },
        buttonPrimary: { borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '10px 16px' },
        buttonBack: { color: '#76685d', fontSize: 13, fontWeight: 600, marginRight: 8 },
        buttonSkip: { color: '#76685d', fontSize: 13 },
      }}
      onEvent={(data: EventData) => {
        if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED || data.type === EVENTS.TOUR_END) {
          finishGuide(activeGuide)
        }
        if (data.type === EVENTS.ERROR || data.type === EVENTS.TOUR_END) closeGuide()
      }}
    />
  )
}
