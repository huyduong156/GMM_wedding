import { useCallback, useEffect, useState } from 'react'
import { X } from '@phosphor-icons/react'

const DEFERRED_UNTIL_KEY = 'ourday:pwa-install-deferred-until'
const INSTALLED_KEY = 'ourday:pwa-install-confirmed'
const REMIND_AFTER_MS = 7 * 24 * 60 * 60 * 1000

type InstallChoice = { outcome: 'accepted' | 'dismissed' }
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<InstallChoice>
}

function isStandaloneApp() {
  return (
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches) ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isPhoneBrowser() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const touchViewport =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 767px) and (pointer: coarse)').matches
  return touchViewport || /Android|iPhone|iPod|iPad/i.test(navigator.userAgent)
}

function isIosBrowser() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function getDeferredUntil() {
  try {
    return Number(localStorage.getItem(DEFERRED_UNTIL_KEY)) || 0
  } catch {
    return 0
  }
}

function hasAnotherDialogOpen() {
  return Boolean(
    document.querySelector(
      '[role="dialog"]:not(.pwa-install-dialog), [role="alertdialog"], dialog:not(.pwa-install-dialog), [aria-modal="true"]:not(.pwa-install-dialog)',
    ),
  )
}

function snoozeInstallPrompt() {
  try {
    localStorage.setItem(DEFERRED_UNTIL_KEY, String(Date.now() + REMIND_AFTER_MS))
  } catch {
    // Keep the prompt usable when browser storage is unavailable.
  }
}

export function PwaInstallPrompt({ enabled = true }: { enabled?: boolean }) {
  const [isOpen, setOpen] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null)
  const [isPhone, setIsPhone] = useState(isPhoneBrowser)
  const [hasOtherDialog, setHasOtherDialog] = useState(false)
  const isIos = isPhone && isIosBrowser()

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as InstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setInstallEvent(null)
      setOpen(false)
      try {
        localStorage.setItem(INSTALLED_KEY, '1')
      } catch {
        // Standalone display-mode detection remains the primary installed check.
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    const update = () => setHasOtherDialog(hasAnotherDialogOpen())
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role', 'aria-modal'],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(max-width: 767px) and (pointer: coarse)')
    const update = () => setIsPhone(media.matches || /Android|iPhone|iPod|iPad/i.test(navigator.userAgent))
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || !isPhone || isStandaloneApp()) return
    try {
      if (localStorage.getItem(INSTALLED_KEY) === '1') return
    } catch {
      // Continue without a persistent installed marker.
    }

    const deferredUntil = getDeferredUntil()
    if (deferredUntil > Date.now()) return
    if (deferredUntil) {
      try {
        localStorage.removeItem(DEFERRED_UNTIL_KEY)
      } catch {
        // The prompt can still be shown if storage is unavailable.
      }
    }

    let timer = 0
    const openWhenClear = () => {
      if (hasOtherDialog || hasAnotherDialogOpen()) {
        timer = window.setTimeout(openWhenClear, 400)
        return
      }
      setOpen(true)
    }
    timer = window.setTimeout(openWhenClear, 900)
    return () => window.clearTimeout(timer)
  }, [enabled, hasOtherDialog, isPhone])

  const closeForLater = useCallback(() => {
    snoozeInstallPrompt()
    setOpen(false)
    setShowInstructions(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeForLater()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeForLater, isOpen])

  async function installOrShowInstructions() {
    if (!installEvent) {
      setShowInstructions(true)
      return
    }

    const promptEvent = installEvent
    setInstallEvent(null)
    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      if (choice.outcome === 'accepted') {
        setOpen(false)
        return
      }
    } catch {
      // If the browser no longer accepts the saved prompt, show manual steps.
      setShowInstructions(true)
      return
    }
    closeForLater()
  }

  if (!enabled || !isPhone || !isOpen || hasOtherDialog || isStandaloneApp()) return null

  return (
    <div
      className="workspace-dialog-backdrop pwa-install-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeForLater()
      }}
    >
      <section
        className="workspace-dialog pwa-install-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        aria-describedby="pwa-install-description"
      >
        <header>
          <div>
            <h2 id="pwa-install-title">
              {showInstructions ? 'Cách thêm Ourday vào màn hình chính' : 'Mở Ourday nhanh hơn'}
            </h2>
          </div>
          <button type="button" onClick={closeForLater} aria-label="Để sau">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {showInstructions ? (
          <div id="pwa-install-description" className="pwa-install-instructions">
            {isIos ? (
              <>
                <p>Trên iPhone hoặc iPad, Safari cần bạn xác nhận thêm một lần:</p>
                <ol>
                  <li>Nhấn nút Chia sẻ ở thanh công cụ Safari.</li>
                  <li>Chọn “Thêm vào màn hình chính”.</li>
                  <li>Nhấn “Thêm” để hoàn tất.</li>
                </ol>
              </>
            ) : (
              <>
                <p>Trình duyệt này chưa mở được hộp thoại cài đặt tự động:</p>
                <ol>
                  <li>Mở menu trình duyệt (dấu ba chấm).</li>
                  <li>Chọn “Cài đặt ứng dụng” hoặc “Thêm vào màn hình chính”.</li>
                  <li>Xác nhận để thêm Ourday vào màn hình chính.</li>
                </ol>
              </>
            )}
          </div>
        ) : (
          <p id="pwa-install-description" className="pwa-install-copy">
            Cài Ourday lên màn hình chính để truy cập Studio nhanh hơn, không cần tìm lại đường dẫn.
          </p>
        )}

        <footer>
          {showInstructions ? (
            <button type="button" className="button button-secondary" onClick={closeForLater}>
              Để sau
            </button>
          ) : (
            <>
              <button type="button" className="button button-secondary" onClick={closeForLater}>
                Để sau
              </button>
              <button
                type="button"
                className="button button-primary"
                autoFocus
                onClick={() => void installOrShowInstructions()}
              >
                Cài ngay
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  )
}
