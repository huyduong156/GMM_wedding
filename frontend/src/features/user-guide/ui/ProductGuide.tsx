import { useCallback, useEffect, useMemo, useState } from 'react'
import { EVENTS, Joyride, STATUS, type EventData, type Step } from 'react-joyride'
import { guideFor, guideKeyForPath } from '../model/guide-content'
import { useGuide } from './GuideProvider'
import './product-guide.css'

export function ProductGuide({ pathname }: { pathname: string }) {
  const { guideList, activeGuide, startGuide, finishGuide, closeGuide } = useGuide()
  const [isMobile, setIsMobile] = useState(() =>
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 767px)').matches
      : false,
  )
  const routeGuide = guideKeyForPath(pathname)
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [gateVersion, setGateVersion] = useState(0)
  const editorGuideBlocked = useCallback(
    () =>
    typeof document !== 'undefined' &&
    ((pathname === '/studio/invites' &&
      Boolean(document.querySelector('[data-editor-template-missing]'))) ||
      Boolean(document.querySelector('[data-mobile-editor-advice]'))),
    [pathname],
  )

  useEffect(() => {
    const update = () => setGateVersion((value) => value + 1)
    window.addEventListener('gmm-editor-advice-closed', update)
    return () => window.removeEventListener('gmm-editor-advice-closed', update)
  }, [])

  useEffect(() => {
    setWelcomeOpen(routeGuide === 'started' && !guideList.started && !activeGuide)
  }, [activeGuide, guideList.started, routeGuide])

  useEffect(() => {
    if ((activeGuide && activeGuide !== routeGuide) || (activeGuide && editorGuideBlocked()))
      closeGuide()
  }, [activeGuide, closeGuide, editorGuideBlocked, gateVersion, routeGuide])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!routeGuide || activeGuide || welcomeOpen || guideList[routeGuide]) return
    const timer = window.setInterval(() => {
      if (editorGuideBlocked()) return
      const targetReady = guideFor(routeGuide, isMobile, pathname).every((item) => {
        if (typeof item.target !== 'string') return true
        return Boolean(document.querySelector(item.target))
      })

      if (targetReady) {
        window.clearInterval(timer)
        startGuide(routeGuide)
      }
    }, 200)

    return () => window.clearInterval(timer)
  }, [
    activeGuide,
    editorGuideBlocked,
    gateVersion,
    guideList,
    isMobile,
    pathname,
    routeGuide,
    startGuide,
    welcomeOpen,
  ])

  const steps = useMemo<Step[]>(() => {
    if (!activeGuide || editorGuideBlocked()) return []
    return guideFor(activeGuide, isMobile, pathname).filter((item) => {
      if (typeof item.target !== 'string') return true
      return typeof document !== 'undefined' && Boolean(document.querySelector(item.target))
    })
  }, [activeGuide, editorGuideBlocked, isMobile, pathname])

  if (welcomeOpen) {
    return (
      <div className="guide-welcome-backdrop" role="presentation">
        <section
          className="guide-welcome-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-welcome-title"
        >
          <span className="guide-welcome-kicker">GMM Wedding</span>
          <h2 id="guide-welcome-title">Chào mừng bạn đến với không gian Wedding</h2>
          <p>
            Mình sẽ giới thiệu nhanh những khu vực quan trọng để bạn bắt đầu tạo thiệp, quản lý khách mời và chuẩn bị cho ngày cưới.
          </p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              setWelcomeOpen(false)
              startGuide('started', true)
            }}
          >
            Xem hướng dẫn sử dụng web
          </button>
        </section>
      </div>
    )
  }

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
