import { useEffect, useRef, useState } from 'react'
import './sunlit-silk.css'

type SectionSpec = {
  key: string
  label: string
  layout: string
  optional?: boolean
  title: string
  body: string
  decor?: { src: string; alt: string; className: string }
}

const sectionSpecs: SectionSpec[] = [
  { key: 'opening', label: 'Mở thiệp', layout: 'envelope-reveal', title: 'Nắng Trên Lụa', body: 'Chạm để mở tấm thiệp của Minh An và Thu Hà.', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-ribbon-clasp-v2-optimized.png', alt: '', className: 'ss-decor--opening-ribbon' } },
  { key: 'cover', label: 'Bìa thiệp', layout: 'layered-paper-theatre', title: 'Minh An & Thu Hà', body: 'Lễ Thành Hôn · 16.01.2027', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-modern-floral-cluster-v1-optimized.png', alt: '', className: 'ss-decor--floral-cluster' } },
  { key: 'invitation', label: 'Lời báo hỷ', layout: 'seal-and-ribbon', title: 'Trân trọng kính mời', body: 'Quý khách đến chung vui trong ngày thành hôn của chúng mình.', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-linen-ribbon-tail-v2-optimized.png', alt: '', className: 'ss-decor--ribbon-tail' } },
  { key: 'families', label: 'Hai bên gia đình', layout: 'dual-cards', title: 'Hai gia đình', body: 'Nhà gái · Ông Nguyễn Văn Hải · Bà Trần Thu Lan · Nhà trai · Ông Lê Minh Quang · Bà Phạm Ngọc Mai' },
  { key: 'eventDetails', label: 'Ngày và giờ', layout: 'date-diptych', title: 'Ngày chúng mình thành đôi', body: 'Thứ Bảy, 16 tháng 01 năm 2027 · Lễ Thành Hôn 09:00 · Tiệc Chung Vui 11:00' },
  { key: 'countdown', label: 'Đếm ngược', layout: 'floating-counters', optional: true, title: 'Hẹn gặp nhau trong', body: '120 ngày · 08 giờ · 24 phút · 16 giây' },
  { key: 'calendar', label: 'Lịch trực quan', layout: 'linen-month-grid', optional: true, title: 'Tháng Một · 2027', body: 'Ngày vui được đánh dấu bằng cả hình dáng và chữ.' },
  { key: 'timeline', label: 'Lịch trình', layout: 'vertical-timeline', optional: true, title: 'Lịch trình ngày vui', body: '08:30 Đón khách · 09:00 Lễ Thành Hôn · 11:00 Khai tiệc' },
  { key: 'venue', label: 'Địa điểm và bản đồ', layout: 'venue-card-over-map', optional: true, title: 'Nơi chúng mình đón bạn', body: 'The Coastal Garden · 12 Đường Biển Xanh, TP. Hồ Chí Minh', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-linen-envelope-v1-optimized.png', alt: '', className: 'ss-decor--envelope' } },
  { key: 'activities', label: 'Hoạt động trong tiệc', layout: 'stitched-list', optional: true, title: 'Một vài điều dành cho bạn', body: 'Góc ảnh nắng · Bàn viết lời chúc · Tiệc trà bên hiên' },
  { key: 'gallery', label: 'Album ảnh', layout: 'linen-stack', optional: true, title: 'Chúng mình, trong những ngày đầy nắng', body: 'Album ảnh sẽ được trình bày trong lớp giấy lụa điều khiển bằng tay.', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-modern-floral-sculpture-v1-optimized.png', alt: '', className: 'ss-decor--floral-sculpture' } },
  { key: 'rsvp', label: 'Xác nhận tham dự', layout: 'reply-card', optional: true, title: 'Bạn sẽ đến chung vui cùng chúng mình chứ?', body: 'Vui lòng phản hồi trước ngày 05 tháng 01 năm 2027.' },
  { key: 'guestbook', label: 'Gửi lời chúc', layout: 'stacked-notes', optional: true, title: 'Gửi chúng mình một lời chúc', body: 'Mỗi lời nhắn sẽ được chúng mình trân trọng giữ lại.', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-cotton-paper-stack-v1-optimized.png', alt: '', className: 'ss-decor--paper-stack' } },
  { key: 'gift', label: 'Thông tin mừng cưới', layout: 'single-qr-card', optional: true, title: 'Gửi lời chúc từ xa', body: 'Tình cảm và sự hiện diện của bạn đã là món quà quý giá.' },
  { key: 'music', label: 'Nhạc nền', layout: 'music-dock', optional: true, title: 'Nhạc của ngày vui', body: 'Điều khiển phát nhạc sẽ xuất hiện sau thao tác chủ động của khách.' },
  { key: 'footer', label: 'Lời cảm ơn', layout: 'closing-letter', title: 'Cảm ơn bạn đã đến', body: 'Minh An & Thu Hà · Hẹn gặp bạn trong ngày vui.', decor: { src: '/assets/images/templates/sunlit-silk/artwork/ss-linen-fold-v1-optimized.png', alt: '', className: 'ss-decor--linen-fold' } },
]

function DecorImage({ decor }: { decor: NonNullable<SectionSpec['decor']> }) {
  return <img className={`ss-decor ${decor.className}`} src={decor.src} alt={decor.alt} aria-hidden="true" onError={(event) => { event.currentTarget.hidden = true }} />
}

function SectionSkeleton({ spec }: { spec: SectionSpec }) {
  return (
    <section className={`ss-section ss-section--${spec.key}`} data-section-key={spec.key} data-layout={spec.layout} data-optional={spec.optional ? 'true' : 'false'} data-reveal aria-labelledby={`ss-${spec.key}-title`}>
      <div className="ss-section__eyebrow">{spec.label}</div>
      <div className="ss-section__surface">
        {spec.decor && <DecorImage decor={spec.decor} />}
        <h2 id={`ss-${spec.key}-title`}>{spec.title}</h2>
        <p>{spec.body}</p>
      </div>
    </section>
  )
}

export function SunlitSilkRenderer() {
  const [opened, setOpened] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = stageRef.current
    if (!root || !opened) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('ss-section--visible')
      })
    }, { threshold: 0.22 })
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [opened])

  return (
    <main className="ss-page" aria-label="Bản xem trước thiệp cưới Nắng Trên Lụa">
      <div ref={stageRef} className={`ss-stage ${opened ? 'ss-stage--opened' : ''}`} data-template-shell="sunlit-silk" data-phase="4">
        <div className="ss-stage__light" aria-hidden="true" />
        <div className="ss-stage__ribbon" aria-hidden="true" />
        <div className="ss-stage__petals" aria-hidden="true">
          <img src="/assets/images/templates/sunlit-silk/artwork/ss-modern-orchid-petals-v1-optimized.png" alt="" aria-hidden="true" />
        </div>
        {!opened && <div className="ss-opening-gate" role="dialog" aria-modal="true" aria-labelledby="ss-opening-title">
          <p>GMM Wedding · Phase 4</p>
          <h1 id="ss-opening-title">Nắng Trên Lụa</h1>
          <span>Tháo đai lụa bằng khóa đồng</span>
          <button type="button" onClick={() => setOpened(true)}>Mở thiệp</button>
        </div>}
        <div className="ss-shell-marker" aria-hidden={!opened}>
          <p>GMM Wedding · Phase 3 skeleton</p>
          <h1>Nắng Trên Lụa</h1>
          <span>Section architecture · {sectionSpecs.length} section anchors</span>
        </div>
        <div className="ss-sections" aria-label="Section architecture preview" aria-hidden={!opened}>
          {sectionSpecs.map((spec) => <SectionSkeleton key={spec.key} spec={spec} />)}
        </div>
      </div>
    </main>
  )
}
