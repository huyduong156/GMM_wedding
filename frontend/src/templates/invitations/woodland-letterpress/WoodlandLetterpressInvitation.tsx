import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import seal from './artwork/woodland-seal-medallion-v1.png'
import clusterRight from './artwork/woodland-ceremonial-cluster-right-v1.png'
import folioCover from './artwork/woodland-folio-cover-v2.png'
import folioOpen from './artwork/woodland-folio-open-v1.png'
import divider from './artwork/woodland-botanical-divider-v1.png'
import calendarMarker from './artwork/woodland-calendar-marker-v1.png'
import venueSignpost from './artwork/woodland-venue-signpost-v2.png'
import ornamentFlower from './artwork/woodland-ornament-flower-v1.png'
import wreath from './artwork/woodland-botanical-wreath-v1.png'
import ornamentBerry from './artwork/woodland-ornament-berry-v1.png'
import ornamentPinecone from './artwork/woodland-ornament-pinecone-v1.png'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import './woodland-letterpress.css'

export type WoodlandLetterpressData = Record<string, unknown> & {
  brideName?: string
  groomName?: string
  brideRole?: string
  groomRole?: string
  weddingDate?: string
  ceremonyDate?: string
  ceremonyTime?: string
  invitationTitle?: string
  invitationMessage?: string
  guestGreeting?: string
  brideFatherTitle?: string
  brideFather?: string
  brideMotherTitle?: string
  brideMother?: string
  brideFamilyAddress?: string
  groomFatherTitle?: string
  groomFather?: string
  groomMotherTitle?: string
  groomMother?: string
  groomFamilyAddress?: string
  venueName?: string
  venueAddress?: string
  mapUrl?: string
  timelineItems?: Array<{ time: string; title: string; detail?: string }>
  activities?: Array<{ title: string; detail?: string; image?: string; alt?: string }>
  galleryImages?: Array<{ url: string; alt?: string } | string>
  rsvpMessage?: string
  guestbookMessage?: string
  giftMessage?: string
  giftQrMedia?: { url: string; alt?: string }
  footerMessage?: string
}
type SectionConfig = { enabled: string[]; order: string[] }
type Props = {
  data?: WoodlandLetterpressData
  sectionConfig?: SectionConfig
  editorMode?: boolean
  interactions?: PublicInteractions
}

const allSections = [
  'cover',
  'banner',
  'invitation-letter',
  'event-countdown',
  'calendar',
  'venue',
  'timeline',
  'activities',
  'gallery',
  'rsvp',
  'guestbook',
  'gift',
  'footer',
]
const defaultData: WoodlandLetterpressData = {
  brideName: 'Mai',
  groomName: 'Đức',
  brideRole: 'Trưởng nữ',
  groomRole: 'Trưởng nam',
  weddingDate: '20 · 12 · 2026',
  ceremonyDate: '20 · 12 · 2026',
  ceremonyTime: '18:30',
  invitationTitle: 'Trân trọng báo tin lễ thành hôn',
  invitationMessage: 'Hai gia đình kính mời bạn đến chung vui trong ngày hạnh phúc của Mai và Đức.',
  guestGreeting: 'Kính mời Quý khách',
  brideFatherTitle: 'Ông',
  brideFather: 'Nguyễn Văn Lâm',
  brideMotherTitle: 'Bà',
  brideMother: 'Trần Thu Hương',
  brideFamilyAddress: '18 Phan Đình Phùng, Hà Nội',
  groomFatherTitle: 'Ông',
  groomFather: 'Phạm Văn Thành',
  groomMotherTitle: 'Bà',
  groomMother: 'Lê Ngọc Mai',
  groomFamilyAddress: '86 Trần Duy Hưng, Hà Nội',
  venueName: 'Sảnh hoa Woodland',
  venueAddress: '28 Bạch Đằng, Hải Châu, Đà Nẵng',
  mapUrl: 'https://maps.google.com',
  timelineItems: [
    { time: '17:30', title: 'Đón khách', detail: 'Gặp nhau và lưu lại những tấm ảnh đầu tiên.' },
    { time: '18:30', title: 'Lễ thành hôn', detail: 'Cùng chứng kiến lời hẹn trăm năm.' },
    { time: '19:00', title: 'Tiệc chung vui', detail: 'Nâng ly cùng hai gia đình.' },
  ],
  activities: [
    { title: 'Góc chụp ảnh', detail: 'Lưu lại một khung hình thật đẹp.' },
    { title: 'Bàn lời chúc', detail: 'Để lại vài dòng dịu dàng cho mùa mới.' },
  ],
  galleryImages: [],
  rsvpMessage: 'Vui lòng xác nhận để gia đình chuẩn bị đón tiếp bạn chu đáo.',
  guestbookMessage: 'Gửi một lời chúc nhỏ đến Mai và Đức.',
  giftMessage: 'Sự hiện diện của bạn là món quà ý nghĩa nhất.',
  footerMessage: 'Cảm ơn bạn đã dành thời gian chung vui cùng hai gia đình.',
}

export function WoodlandLetterpressInvitation({
  data,
  sectionConfig,
  editorMode = false,
  interactions,
}: Props) {
  const content = useMemo(
    () => ({
      ...defaultData,
      ...Object.fromEntries(
        Object.entries(data ?? {}).filter(([, value]) => value !== undefined && value !== null),
      ),
    }),
    [data],
  )
  const [opened, setOpened] = useState(editorMode)
  const [coverVisible, setCoverVisible] = useState(!editorMode)
  const [attendance, setAttendance] = useState<'ATTENDING' | 'DECLINED' | null>(null)
  const [wish, setWish] = useState('')
  const [wishSent, setWishSent] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const pageRef = useRef<HTMLElement>(null)
  const openingTimer = useRef<number>()
  const enabled = (key: string) => !sectionConfig || sectionConfig.enabled.includes(key)
  const ordered = [...new Set([...(sectionConfig?.order ?? allSections), ...allSections])].filter(
    enabled,
  )
  const name = (content.brideName || 'Cô dâu') + ' & ' + (content.groomName || 'Chú rể')
  const gallery = (content.galleryImages ?? [])
    .map((image) => (typeof image === 'string' ? { url: image, alt: '' } : image))
    .filter((image) => image.url)
  const targetDate = parseWeddingDate(content.ceremonyDate, content.ceremonyTime)
  const targetTimestamp = targetDate?.getTime()
  const [countdown, setCountdown] = useState(() => getCountdown(targetDate))

  useEffect(() => {
    const nextTarget = targetTimestamp === undefined ? undefined : new Date(targetTimestamp)
    setCountdown(getCountdown(nextTarget))
    if (!nextTarget) return
    const timer = window.setInterval(() => setCountdown(getCountdown(nextTarget)), 1000)
    return () => window.clearInterval(timer)
  }, [targetTimestamp])
  useEffect(() => {
    if (galleryIndex >= gallery.length) setGalleryIndex(0)
  }, [gallery.length, galleryIndex])
  useEffect(() => () => window.clearTimeout(openingTimer.current), [])
  useEffect(() => {
    const page = pageRef.current
    if (!page || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting)
          if (entry.isIntersecting) entry.target.classList.add('has-entered')
        })
      },
      { threshold: 0.08 },
    )
    page.querySelectorAll('.wl-section').forEach((element) => observer.observe(element))
    const visibility = () => page.classList.toggle('is-paused', document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [opened, coverVisible, sectionConfig])
  useEffect(() => {
    if (editorMode || typeof window.matchMedia !== 'function') return
    const eligible = window.matchMedia(
      '(min-width: 769px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )
    let stopped = false
    let destroy: (() => void) | undefined
    const setup = () => {
      destroy?.()
      destroy = undefined
      if (!eligible.matches) return
      void import('lenis')
        .then(({ default: Lenis }) => {
          if (stopped || !eligible.matches) return
          const lenis = new Lenis({ autoRaf: true, smoothWheel: true, lerp: 0.09 })
          destroy = () => lenis.destroy()
        })
        .catch(() => {
          /* Native scrolling remains available. */
        })
    }
    setup()
    eligible.addEventListener('change', setup)
    return () => {
      stopped = true
      destroy?.()
      eligible.removeEventListener('change', setup)
    }
  }, [editorMode])

  const openInvitation = () => {
    if (opened) return
    setOpened(true)
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    openingTimer.current = window.setTimeout(
      () => {
        setCoverVisible(false)
        pageRef.current
          ?.querySelector<HTMLElement>('#wl-couple-heading')
          ?.focus({ preventScroll: true })
        if (!editorMode) window.scrollTo({ top: 0, behavior: 'instant' })
      },
      reducedMotion ? 0 : 760,
    )
  }
  const submitRsvp = async (value: 'ATTENDING' | 'DECLINED') => {
    const ok = interactions
      ? await interactions.rsvp.submit({
          attendance: value,
          partySize: 1,
          guestName: interactions.isPersonalized
            ? (interactions.guestName ?? undefined)
            : undefined,
        })
      : true
    if (ok) setAttendance(value)
  }
  const submitWish = async () => {
    const message = wish.trim()
    if (!message) return
    const ok = interactions
      ? await interactions.wishes.submit({
          content: message,
          guestName: interactions.isPersonalized
            ? (interactions.guestName ?? undefined)
            : undefined,
        })
      : true
    if (ok) {
      setWish('')
      setWishSent(true)
    }
  }
  const section = (key: string, children: ReactNode) => (
    <section
      className={'wl-section wl-' + key}
      data-editor-section={key}
      id={'wl-' + key}
      key={key}
    >
      {children}
    </section>
  )

  return (
    <main className="wl-page" data-template="woodland-letterpress" ref={pageRef}>
      <div className="wl-canvas">
        <div className="wl-atmosphere" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        {ordered.map((key) => {
          if (key === 'cover' && !coverVisible) return null

          if (key === 'cover' && coverVisible)
            return section(
              key,
              <div className={'wl-cover ' + (opened ? 'is-opened' : '')}>
                <div className="wl-cover-grain" aria-hidden="true" />
                <div className="wl-cover-heading">
                  <span>Thiệp mời</span>
                  <small>Woodland Letterpress</small>
                </div>
                <div className="wl-cover-folio">
                  <img className="wl-folio-closed" src={folioCover} alt="" />
                  <img className="wl-folio-open" src={folioOpen} alt="" />
                </div>
                <div className="wl-cover-caption">
                  <strong>{name}</strong>
                  <small>{content.weddingDate}</small>
                  <span>
                    {interactions?.guestName
                      ? `Kính mời ${interactions.guestName}`
                      : content.guestGreeting}
                  </span>
                </div>
                <div className="wl-curtain" aria-hidden={opened}>
                  <div className="wl-curtain-panel wl-curtain-left" />
                  <div className="wl-curtain-panel wl-curtain-right" />
                  <button
                    className="wl-seal-trigger"
                    type="button"
                    onClick={openInvitation}
                    disabled={opened}
                    aria-label={opened ? 'Thiệp đã mở' : 'Mở thiệp'}
                  >
                    <img src={seal} alt="" />
                    <span>{opened ? 'Đã mở' : 'Mở thiệp'}</span>
                  </button>
                </div>
                <p className="wl-cover-hint">Chạm vào dấu ấn để mở thiệp</p>
              </div>,
            )
          if (!opened && !editorMode) return null
          if (key === 'banner')
            return section(
              key,
              <div className="wl-couple-box">
                <div className="wl-nameplate-frame" aria-hidden="true" />
                <img className="wl-banner-wreath" src={wreath} alt="" />
                <p className="wl-kicker">Một ngày thật dịu dàng</p>
                <p className="wl-banner-title">Lễ thành hôn</p>
                <h1 id="wl-couple-heading" tabIndex={-1}>
                  <span className="wl-person-name">{content.brideName}</span>
                  <span className="wl-ampersand">&</span>
                  <span className="wl-person-name">{content.groomName}</span>
                </h1>
                <p className="wl-date">{content.weddingDate}</p>
                <p className="wl-banner-note">Cùng viết tiếp những ngày thương</p>
                <a className="wl-read-letter" href="#wl-invitation-letter">
                  Thông tin hai gia đình <span aria-hidden="true">↓</span>
                </a>
              </div>,
            )
          if (key === 'invitation-letter')
            return section(
              key,
              <>
                <div className="wl-paper wl-family-box">
                  <img className="wl-letter-ornament" src={ornamentFlower} alt="" loading="lazy" />
                  <p className="wl-kicker">Thông tin hai gia đình</p>
                  <h2 className="wl-letter-title">Trân trọng báo hỷ</h2>
                  <div className="wl-family-grid">
                    <Family
                      title="Nhà gái"
                      role={content.brideRole}
                      name={content.brideName}
                      fatherTitle={content.brideFatherTitle}
                      motherTitle={content.brideMotherTitle}
                      father={content.brideFather}
                      mother={content.brideMother}
                      address={content.brideFamilyAddress}
                    />
                    <Family
                      title="Nhà trai"
                      role={content.groomRole}
                      name={content.groomName}
                      fatherTitle={content.groomFatherTitle}
                      motherTitle={content.groomMotherTitle}
                      father={content.groomFather}
                      mother={content.groomMother}
                      address={content.groomFamilyAddress}
                    />
                  </div>
                </div>
                <div className="wl-invite-note">
                  <img className="wl-letter-divider" src={divider} alt="" loading="lazy" />
                  <p className="wl-kicker">{content.invitationTitle}</p>
                  <p className="wl-greeting">
                    {interactions?.guestName
                      ? `Kính mời ${interactions.guestName}`
                      : content.guestGreeting || 'Kính mời Quý khách'}
                  </p>
                  <p>{content.invitationMessage}</p>
                </div>
              </>,
            )
          if (key === 'event-countdown')
            return section(
              key,
              <div className="wl-date-card">
                <p className="wl-kicker">Ngày làm lễ</p>
                <img className="wl-date-ornament" src={ornamentPinecone} alt="" loading="lazy" />
                <h2>
                  Hẹn nhau ngày
                  <br />
                  hạnh phúc
                </h2>
                <strong>{content.ceremonyDate}</strong>
                <span>Vào lúc {content.ceremonyTime}</span>
                <p className="wl-countdown-label">
                  {targetDate && targetDate.getTime() <= Date.now()
                    ? 'Ngày vui đã diễn ra'
                    : 'Cùng đếm ngược đến ngày chung đôi'}
                </p>
                <div
                  className="wl-countdown"
                  aria-live="off"
                  aria-label="Đếm ngược đến ngày làm lễ"
                >
                  {Object.entries(countdown).map(([label, value]) => (
                    <span key={label}>
                      <b>{value}</b>
                      <small>{label}</small>
                    </span>
                  ))}
                </div>
              </div>,
            )
          if (key === 'calendar') {
            const date = parseWeddingDate(content.weddingDate)
            return section(
              key,
              <div className="wl-paper wl-calendar">
                <p className="wl-kicker">Lưu lại ngày này</p>
                <h2>
                  {date
                    ? new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(date)
                    : 'Ngày cưới'}
                </h2>
                <p className="wl-calendar-year">
                  {date ? date.getFullYear() : content.weddingDate}
                </p>
                {date ? <CalendarMonth date={date} /> : <p>Ngày cưới sẽ được cập nhật.</p>}
                {date ? (
                  <a
                    className="wl-link-button"
                    href={calendarLink(date, content.ceremonyTime, name, content.venueAddress)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lưu ngày vào lịch <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                <img className="wl-calendar-marker" src={calendarMarker} alt="" loading="lazy" />
              </div>,
            )
          }
          if (key === 'venue')
            return section(
              key,
              <div className="wl-venue-card">
                <div className="wl-venue-emblem" aria-hidden="true">
                  <img src={venueSignpost} alt="" loading="lazy" />
                </div>
                <div className="wl-venue-copy">
                  <p className="wl-kicker">Nơi mình gặp nhau</p>
                  <h2>{content.venueName || 'Địa điểm tổ chức'}</h2>
                  <p className="wl-venue-address">
                    {content.venueAddress || 'Thông tin địa điểm sẽ được cập nhật.'}
                  </p>
                  {content.mapUrl ? (
                    <a
                      className="wl-link-button"
                      href={content.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mở Google Maps <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>,
            )
          if (key === 'timeline')
            return section(
              key,
              <div className="wl-paper">
                <p className="wl-kicker">Lịch trình trong ngày</p>
                <h2>
                  Từng khoảnh khắc
                  <br />
                  có bạn bên mình
                </h2>
                {content.timelineItems?.length ? (
                  <div className="wl-timeline">
                    {content.timelineItems.map((item) => (
                      <div className="wl-timeline-item" key={item.time + '-' + item.title}>
                        <time>{item.time}</time>
                        <div>
                          <h3>{item.title}</h3>
                          {item.detail ? <p>{item.detail}</p> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="wl-empty">Lịch trình sẽ được cập nhật tại đây.</p>
                )}
              </div>,
            )
          if (key === 'activities')
            return section(
              key,
              <div>
                <p className="wl-kicker">Những điều nho nhỏ</p>
                <h2>
                  Một chút vui,
                  <br />
                  một chút thương
                </h2>
                <div className="wl-note-grid">
                  {content.activities?.length ? (
                    content.activities.map((item, index) => (
                      <article className="wl-note" key={item.title}>
                        <img
                          className={item.image ? 'wl-activity-image' : 'wl-note-ornament'}
                          src={item.image || (index % 2 ? ornamentBerry : ornamentFlower)}
                          alt={item.alt ?? ''}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden'
                          }}
                        />
                        <h3>{item.title}</h3>
                        {item.detail ? <p>{item.detail}</p> : null}
                      </article>
                    ))
                  ) : (
                    <p className="wl-empty">Chưa có hoạt động nào được cập nhật.</p>
                  )}
                </div>
              </div>,
            )
          if (key === 'gallery')
            return section(
              key,
              <div className="wl-paper">
                <p className="wl-kicker">Những khung hình thương mến</p>
                <h2>
                  Chúng mình,
                  <br />
                  trước ngày chung đôi
                </h2>
                {gallery.length ? (
                  <>
                    <div
                      className={'wl-gallery ' + (gallery.length > 2 ? 'has-depth' : '')}
                      aria-live="polite"
                    >
                      {gallery.length > 2 ? (
                        <>
                          <span className="wl-print-back wl-print-back-one" aria-hidden="true" />
                          <span className="wl-print-back wl-print-back-two" aria-hidden="true" />
                        </>
                      ) : null}
                      <figure className="wl-photo-print" key={gallery[galleryIndex]?.url}>
                        <img
                          src={gallery[galleryIndex]?.url}
                          alt={gallery[galleryIndex]?.alt || 'Ảnh kỷ niệm ' + (galleryIndex + 1)}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden'
                          }}
                        />
                        <figcaption>
                          {name} <span>{String(galleryIndex + 1).padStart(2, '0')}</span>
                        </figcaption>
                      </figure>
                    </div>
                    <div className="wl-gallery-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)
                        }
                        aria-label="Ảnh trước"
                      >
                        ←
                      </button>
                      <span>
                        {galleryIndex + 1} / {gallery.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)}
                        aria-label="Ảnh tiếp theo"
                      >
                        →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="wl-empty wl-album-empty">
                    <img src={ornamentFlower} alt="" loading="lazy" />
                    <p>
                      Những tấm ảnh của chúng mình
                      <br />
                      sẽ sớm được đặt vào đây.
                    </p>
                  </div>
                )}
              </div>,
            )
          if (key === 'rsvp')
            return section(
              key,
              <div className="wl-paper wl-form-card">
                <p className="wl-kicker">Phiếu hồi đáp</p>
                <img className="wl-response-seal" src={seal} alt="" loading="lazy" />
                <h2>Xác nhận tham dự</h2>
                <p>{content.rsvpMessage}</p>
                {attendance || interactions?.rsvp.submitted ? (
                  <p className="wl-success" role="status">
                    {attendance === 'ATTENDING'
                      ? 'Cảm ơn bạn, chúng mình đã ghi nhận bạn sẽ tham dự.'
                      : 'Cảm ơn bạn đã phản hồi.'}
                  </p>
                ) : (
                  <>
                    <div className="wl-actions">
                      <button
                        type="button"
                        disabled={interactions?.rsvp.submitting}
                        onClick={() => void submitRsvp('ATTENDING')}
                      >
                        Mình sẽ tham dự
                      </button>
                      <button
                        type="button"
                        className="is-quiet"
                        disabled={interactions?.rsvp.submitting}
                        onClick={() => void submitRsvp('DECLINED')}
                      >
                        Mình không tham dự
                      </button>
                    </div>
                    {interactions?.rsvp.error ? (
                      <p className="wl-error" role="alert">
                        {interactions.rsvp.error}
                      </p>
                    ) : null}
                  </>
                )}
              </div>,
            )
          if (key === 'guestbook')
            return section(
              key,
              <div className="wl-paper wl-form-card">
                <p className="wl-kicker">Sổ lưu bút</p>
                <h2>Để lại một lời chúc</h2>
                {wishSent || interactions?.wishes.submitted ? (
                  <p className="wl-success" role="status">
                    Cảm ơn bạn đã gửi lời chúc đến chúng mình.
                  </p>
                ) : (
                  <>
                    <label className="wl-field-label" htmlFor="wl-wish">
                      Lời chúc của bạn
                    </label>
                    <textarea
                      id="wl-wish"
                      value={wish}
                      onChange={(event) => setWish(event.target.value)}
                      placeholder={content.guestbookMessage}
                      aria-label="Lời chúc"
                      disabled={interactions?.wishes.submitting}
                    />
                    <button
                      type="button"
                      onClick={() => void submitWish()}
                      disabled={!wish.trim() || interactions?.wishes.submitting}
                    >
                      Gửi lời chúc
                    </button>
                    {interactions?.wishes.error ? (
                      <p className="wl-error" role="alert">
                        {interactions.wishes.error}
                      </p>
                    ) : null}
                  </>
                )}
              </div>,
            )
          if (key === 'gift')
            return section(
              key,
              <div className="wl-gift">
                <img className="wl-gift-ornament" src={ornamentBerry} alt="" loading="lazy" />
                <p className="wl-kicker">Quà mừng</p>
                <p>{content.giftMessage}</p>
                {content.giftQrMedia?.url ? (
                  <img
                    className="wl-gift-qr"
                    src={content.giftQrMedia.url}
                    alt={content.giftQrMedia.alt || 'Mã QR quà mừng'}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
              </div>,
            )
          return section(
            key,
            <footer className="wl-footer">
              <img className="wl-footer-cluster" src={clusterRight} alt="" loading="lazy" />
              <img className="wl-letter-divider" src={divider} alt="" loading="lazy" />
              <p className="wl-kicker">Trân quý từng sự hiện diện</p>
              <p>{content.footerMessage}</p>
              <strong>{name}</strong>
              <small>{content.weddingDate}</small>
            </footer>,
          )
        })}
      </div>
    </main>
  )
}
function Family({
  title,
  role,
  name,
  fatherTitle,
  motherTitle,
  father,
  mother,
  address,
}: {
  title: string
  role?: string
  name?: string
  fatherTitle?: string
  motherTitle?: string
  father?: string
  mother?: string
  address?: string
}) {
  return (
    <div className="wl-family">
      <p className="wl-kicker">{title}</p>
      {father?.trim() ? (
        <div className="wl-parent">
          <small>{fatherTitle}</small>
          <strong>{father.trim()}</strong>
        </div>
      ) : null}
      {mother?.trim() ? (
        <div className="wl-parent">
          <small>{motherTitle}</small>
          <strong>{mother.trim()}</strong>
        </div>
      ) : null}
      {address ? <p>{address}</p> : null}
      <div className="wl-family-couple">
        {role ? <small>{role}</small> : null}
        <strong>{name}</strong>
      </div>
    </div>
  )
}
function parseWeddingDate(value?: string, time?: string) {
  const iso = value?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  const parts = iso
    ? [iso[0], iso[3], iso[2], iso[1]]
    : value?.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/)
  if (!parts) return undefined
  const [, day, month, year] = parts
  const [hour = '0', minute = '0'] = time?.match(/\d{1,2}/g) ?? []
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
  return Number.isNaN(date.getTime()) ? undefined : date
}
function CalendarMonth({ date }: { date: Date }) {
  const firstWeekday = (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  return (
    <div className="wl-month-grid" aria-label="Lịch tháng cưới">
      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
        <span className="wl-weekday" key={day}>
          {day}
        </span>
      ))}
      {Array.from({ length: firstWeekday }, (_, index) => (
        <span key={'blank-' + index} />
      ))}
      {Array.from({ length: days }, (_, index) => (
        <span
          key={index}
          className={index + 1 === date.getDate() ? 'is-wedding-day' : ''}
          aria-label={index + 1 === date.getDate() ? `Ngày cưới, ${index + 1}` : undefined}
        >
          {index + 1}
        </span>
      ))}
    </div>
  )
}
function calendarLink(date: Date, time: string | undefined, names: string, location?: string) {
  const [hours = '0', minutes = '0'] = time?.match(/\d{1,2}/g) ?? []
  const day = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const start = `${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`
  return (
    'https://calendar.google.com/calendar/render?' +
    new URLSearchParams({
      action: 'TEMPLATE',
      text: `Lễ thành hôn ${names}`,
      dates: `${start}/${day}T235900`,
      ctz: 'Asia/Ho_Chi_Minh',
      location: location ?? '',
    }).toString()
  )
}
function getCountdown(target?: Date) {
  if (!target) return { Ngày: '—', Giờ: '—', Phút: '—', Giây: '—' }
  const difference = target.getTime() - Date.now()
  if (difference <= 0) return { Ngày: '0', Giờ: '0', Phút: '0', Giây: '0' }
  const seconds = Math.floor(difference / 1000)
  return {
    Ngày: String(Math.floor(seconds / 86400)),
    Giờ: String(Math.floor((seconds % 86400) / 3600)).padStart(2, '0'),
    Phút: String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'),
    Giây: String(seconds % 60).padStart(2, '0'),
  }
}
