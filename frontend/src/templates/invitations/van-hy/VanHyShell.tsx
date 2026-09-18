import { useEffect, useState, type KeyboardEvent } from 'react'
import './van-hy.css'

const HYS = ['囍', 'Hỷ', '囍', 'Hỷ', '囍', 'Hỷ', '囍', 'Hỷ']

export function VanHyShell() {
  const [opened, setOpened] = useState(false)
  const [openingComplete, setOpeningComplete] = useState(false)

  const openCard = () => {
    if (opened) return
    setOpened(true)
  }

  useEffect(() => {
    if (!opened) return
    const timeout = window.setTimeout(() => setOpeningComplete(true), 760)
    return () => window.clearTimeout(timeout)
  }, [opened])
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openCard()
    }
  }

  return (
    <main className={`hh-page${opened ? ' is-opened' : ''}${openingComplete ? ' is-opening-complete' : ''}`}>
      <div className="hh-invitation-preview" aria-hidden={!openingComplete}>
        <span className="hh-eyebrow">Vạn Hỷ · Phase 0</span>
        <h1>Nội dung thiệp<br /><em>sẽ bắt đầu ở đây</em></h1>
        <p>Opening overlay đã đóng. Các section invitation sẽ được thêm ở những phase tiếp theo.</p>
      </div>
      {!openingComplete && <section className={`hh-opening${opened ? ' is-opening' : ''}`} aria-label="Mở thiệp Hỷ Sự">
        <div className="hh-atmosphere" aria-hidden="true">
        {HYS.map((value, index) => <span key={`${value}-${index}`} style={{ '--hh-index': index } as React.CSSProperties}>{value}</span>)}
        </div>
        <div className="hh-opening-stage">
          <div
            className={`hh-opening-card${opened ? ' is-opened' : ''}`}
            role={opened ? undefined : 'button'}
            tabIndex={opened ? -1 : 0}
            aria-label={opened ? undefined : 'Mở thiệp Hỷ Sự'}
            onClick={openCard}
            onKeyDown={handleKeyDown}
          >
            <div className="hh-flower hh-flower--left" aria-hidden="true"><i /><i /><i /><b>囍</b></div>
            <div className="hh-card-front">
              <span className="hh-seal" aria-hidden="true">囍</span>
              <span className="hh-eyebrow">Thiệp mời Hỷ Sự</span>
              <h1>Ngày vui<br /><em>của chúng mình</em></h1>
              <p className="hh-card-note">Chạm để mở thiệp</p>
              <button type="button" className="hh-open-button" onClick={(event) => { event.stopPropagation(); openCard() }} disabled={opened}>
                {opened ? 'Đang mở thiệp' : 'Mở thiệp'}
              </button>
            </div>
            <div className="hh-flower hh-flower--right" aria-hidden="true"><i /><i /><i /><b>囍</b></div>
            <div className="hh-card-inner" aria-hidden={!opened}>
              <span className="hh-eyebrow">Trân trọng kính mời</span>
              <strong>Cô dâu &amp; Chú rể</strong>
              <span>đến chung vui trong ngày trọng đại</span>
            </div>
          </div>
        </div>
        <p className="hh-shell-note">Phase 0 · Mobile invitation shell · 480px</p>
      </section>
      }
    </main>
  )
}
