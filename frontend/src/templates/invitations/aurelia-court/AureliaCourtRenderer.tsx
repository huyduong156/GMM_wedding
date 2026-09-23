import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { aureliaCourtArtwork, aureliaCourtFixture, aureliaCourtSectionConfig } from './fixture'
import type { AureliaCourtData, AureliaCourtSectionConfig } from './AureliaCourtTypes'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothTemplateScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { formatCountdownUnit, useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import { MusicPlayer } from '../../../shared/ui/music-player'
import { PageLoading } from '../../../shared/ui/PageLoading'
import '../../../shared/styles/reveal-animations.css'
import './aurelia-court.css'

type Props = { data?: AureliaCourtData; sectionConfig?: AureliaCourtSectionConfig; editorMode?: boolean; interactions?: PublicInteractions }

const replaceGuest = (value: string, guestName = 'quý khách') => value.replaceAll('{guestName}', guestName)
const AureliaEditorModeContext = createContext(false)

export function AureliaCourtRenderer({ data = aureliaCourtFixture, sectionConfig = aureliaCourtSectionConfig, editorMode = false, interactions }: Props) {
  const [opened, setOpened] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [openingComplete, setOpeningComplete] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)
  useSmoothTemplateScroll(opened && openingComplete)

  const [ambientActive, setAmbientActive] = useState(true)
  const active = new Set(sectionConfig.enabled)
  const show = (sectionKey: string) => active.has(sectionKey)
  const guestName = interactions?.guestName?.trim() || 'quý khách'

  useEffect(() => {
    let cancelled = false
    const mediaSources = [
      ...Object.values(aureliaCourtArtwork),
      data.cover?.heroMedia?.src,
      typeof data.gift?.qrMedia === 'string' ? data.gift.qrMedia : data.gift?.qrMedia?.src,
      data.footer?.backgroundMedia?.src,
      ...(data.activities?.items ?? []).map((item) => item.image?.src),
      ...(data.gallery?.images ?? []).map((image) => image.src),
    ].filter((source): source is string => Boolean(source))
    const loadImage = (src: string) => new Promise<void>((resolve) => {
      const image = new Image()
      image.onload = () => resolve()
      image.onerror = () => resolve()
      image.src = src
    })
    void Promise.race([
      Promise.all([...new Set(mediaSources)].map(loadImage)),
      new Promise<void>((resolve) => window.setTimeout(resolve, 1800)),
    ]).then(() => {
      if (cancelled) return
      revealTimeout = window.setTimeout(() => { if (!cancelled) setAssetsReady(true) }, 500)
    })
    let revealTimeout: number | undefined
    return () => { cancelled = true; if (revealTimeout) window.clearTimeout(revealTimeout) }
  }, [data])

  useEffect(() => {
    if (!opened || openingComplete) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(() => setOpeningComplete(true), reducedMotion ? 0 : 3000)
    return () => window.clearTimeout(timeout)
  }, [opened, openingComplete])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const visibility = () => setAmbientActive(document.visibilityState === 'visible')
    const observer = new IntersectionObserver(([entry]) => setAmbientActive(entry.isIntersecting && document.visibilityState === 'visible'), { threshold: 0.01 })
    observer.observe(stage)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  if (!assetsReady) {
    return <PageLoading label="Đang chuẩn bị thiệp Aurelia Court" detail="Một chút nữa thôi, những chi tiết trong tấm thiệp đang được mở ra." />
  }

  return (
    <>
      <AureliaEditorModeContext.Provider value={editorMode}>
      <main className={`ac-page ${opened ? 'is-opened' : ''} ${editorMode ? 'is-editor-preview' : ''}`} aria-label="Thiệp cưới Aurelia Court">
      <Opening data={data} opened={opened} openingComplete={openingComplete} ambientActive={ambientActive} onOpen={() => setOpened(true)} />
      <div ref={stageRef} className={`ac-stage ${opened ? 'is-opened' : ''} ${ambientActive ? 'is-ambient-active' : ''}`} data-template-shell="aurelia-court">
        <div className="ac-shared-background" aria-hidden="true" />
        <div className="ac-ambient" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="ac-invitation" aria-hidden={!opened}>
          {sectionConfig.order.filter((sectionKey) => sectionKey !== 'opening' && show(sectionKey)).map((sectionKey) => {
            switch (sectionKey) {
              case 'cover': return <Cover key={sectionKey} data={data} />
              case 'invitation': return <Invitation key={sectionKey} data={data} guestName={guestName} />
              case 'families': return <Families key={sectionKey} data={data} />
              case 'eventDetails': return <EventDetails key={sectionKey} data={data} />
              case 'countdown': return <Countdown key={sectionKey} data={data} />
              case 'timeline': return <Timeline key={sectionKey} data={data} />
              case 'venue': return <Venue key={sectionKey} data={data} />
              case 'activities': return <Activities key={sectionKey} data={data} />
              case 'gallery': return <Gallery key={sectionKey} data={data} />
              case 'rsvp': return <ActionCard key={sectionKey} sectionKey="rsvp" title={data.rsvp.title} message={data.rsvp.message} meta={`Phản hồi trước ${data.rsvp.deadline}`} action="Xác nhận tham dự" interactions={interactions} />
              case 'guestbook': return <ActionCard key={sectionKey} sectionKey="guestbook" title={data.guestbook.title} message={data.guestbook.message} action="Gửi lời chúc" interactions={interactions} />
              case 'gift': return <Gift key={sectionKey} data={data} />
              case 'footer': return <Footer key={sectionKey} data={data} />
              default: return null
            }
          })}
        </div>
      </div>
      {show('music') ? <MusicPlayer src={data.music.backgroundMusicUrl} title={data.music.backgroundMusicName || data.music.trackName || data.music.title} autoplay={data.music.backgroundMusicAutoplay} active={opened} editorMode={editorMode} sectionKey="music" /> : null}
      </main>
      </AureliaEditorModeContext.Provider>
    </>
  )
}

function Section({ sectionKey, className = '', style, children }: { sectionKey: string; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const editorMode = useContext(AureliaEditorModeContext)
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(editorMode)
  useEffect(() => {
    if (editorMode) {
      setVisible(true)
      return
    }
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } }, { threshold: 0.08, rootMargin: '0px 0px -33% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [editorMode])
  return <section ref={ref} className={`ac-section ${visible ? 'is-visible' : ''} ${className}`.trim()} data-editor-section={sectionKey} style={style}>{children}</section>
}

function Opening({ data, opened, openingComplete, ambientActive, onOpen }: { data: AureliaCourtData; opened: boolean; openingComplete: boolean; ambientActive: boolean; onOpen: () => void }) {
  if (openingComplete) return null
  return <section className={`ac-opening-shell ${opened ? 'is-opening' : ''}`} data-editor-section="opening" aria-label="Mở thiệp Aurelia Court" aria-hidden={opened}>
    <div className="ac-opening-petals" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <span key={index} />)}</div>
    <div className="ac-opening-transition" aria-hidden="true" />
    <div className="ac-opening-stage">
      <svg className="ac-opening-border-glow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="ac-opening-glow-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.5" /></filter></defs><rect className="ac-opening-border-glow__blur ac-opening-border-glow__blur--one" x="1.5" y="1.5" width="97" height="97" rx="8" pathLength="1000" /><rect className="ac-opening-border-glow__blur ac-opening-border-glow__blur--two" x="1.5" y="1.5" width="97" height="97" rx="8" pathLength="1000" /><rect className="ac-opening-border-glow__line ac-opening-border-glow__line--one" x="1.5" y="1.5" width="97" height="97" rx="8" pathLength="1000" /><rect className="ac-opening-border-glow__line ac-opening-border-glow__line--two" x="1.5" y="1.5" width="97" height="97" rx="8" pathLength="1000" /></svg>

      <button className={`ac-opening-card ${opened ? 'is-opening' : ''}`} type="button" onClick={onOpen} disabled={opened} aria-label="Chạm để mở thiệp Aurelia Court">
        <div className="ac-opening-card__art" aria-hidden="true"><img src={aureliaCourtArtwork.front} alt="" /><img className="ac-opening-card__arch" src={aureliaCourtArtwork.arch} alt="" /><img className="ac-opening-card__corner" src={aureliaCourtArtwork.corner} alt="" /></div>
        <span className="ac-opening-card__inner-border" aria-hidden="true" />
        <div className="ac-opening-card__content"><span className="ac-opening-card__eyebrow">{data.opening.eyebrow}</span><p className="ac-opening-card__title">{data.opening.title}</p><h1><span>{data.couple.brideName}</span><img className="ac-opening-card__crest" src={aureliaCourtArtwork.crest} alt="" /><span>{data.couple.groomName}</span></h1><p className="ac-opening-card__date">{data.event.weddingDate}</p><span className="ac-opening-card__open">Mở thiệp</span></div>
      </button>
    </div>
  </section>
}
function Cover({ data }: { data: AureliaCourtData }) {
  return <Section sectionKey="cover" className="ac-cover"><img className="ac-royal-decor ac-royal-decor--pediment reveal reveal--fade-only" src={aureliaCourtArtwork.royalPediment} alt="" /><div className="ac-content ac-cover__plane"><p className="ac-kicker reveal reveal--fade-up">{data.cover.eyebrow}</p><h2 className="reveal reveal--zoom-in">{data.couple.brideName}<span>&amp;</span>{data.couple.groomName}</h2>{data.cover.title !== data.couple.brideName + ' & ' + data.couple.groomName ? <p className="ac-lead reveal reveal--fade-up">{data.cover.title}</p> : null}<p className="ac-cover__message reveal reveal--fade-up">{data.cover.message}</p><p className="reveal reveal--fade-up">{data.event.weddingDate} · {data.event.time}</p>{data.cover.heroMedia ? <img className="ac-user-media reveal reveal--fade-up" src={data.cover.heroMedia.src} alt={data.cover.heroMedia.alt} /> : null}</div></Section>
}

function Invitation({ data, guestName }: { data: AureliaCourtData; guestName: string }) {
  return <Section sectionKey="invitation" className="ac-letter"><img className="ac-floral ac-floral--letter reveal reveal--fade-only" src={aureliaCourtArtwork.sprig} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Lời báo hỷ</p><h2 className="reveal reveal--slide-up">{replaceGuest('Kính mời {guestName} đến chung vui', guestName)}</h2><p className="reveal reveal--fade-up">{replaceGuest(data.invitation.message, guestName)}</p><img className="ac-divider reveal reveal--zoom-in" src={aureliaCourtArtwork.divider} alt="" /></div></Section>
}

function Families({ data }: { data: AureliaCourtData }) {
  const family = (side: typeof data.families.brideSide, kind: 'bride' | 'groom') => <div className={`ac-family ac-family--${kind} reveal reveal--fade-up`}><img className="ac-family-decor reveal reveal--fade-only" src={kind === 'bride' ? aureliaCourtArtwork.royalBust : aureliaCourtArtwork.royalBustMale} alt="" /><p className="ac-kicker reveal reveal--fade-up">{side.label}</p><div className="reveal reveal--fade-up"><small>Ông bà</small><strong>{side.father}</strong><strong>{side.mother}</strong></div><p className="reveal reveal--fade-up">{side.address}</p></div>
  return <Section sectionKey="families" className="ac-families"><img className="ac-floral ac-floral--family reveal reveal--fade-only" src={aureliaCourtArtwork.cascade} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Hai bên gia đình</p><h2 className="reveal reveal--slide-up">{data.families.title}</h2><p className="reveal reveal--fade-up">{data.families.subtitle}</p><p className="ac-families__message reveal reveal--fade-up">{data.families.message}</p><div className="ac-families__grid reveal reveal--fade-up">{family(data.families.brideSide, 'bride')}<div className="ac-family-orbit reveal reveal--zoom-in" aria-hidden="true"><span className="ac-family-orbit__ring" /><img src={aureliaCourtArtwork.crest} alt="" /></div>{family(data.families.groomSide, 'groom')}</div><img className="ac-divider reveal reveal--zoom-in" src={aureliaCourtArtwork.divider} alt="" /></div></Section>
}

function EventDetails({ data }: { data: AureliaCourtData }) {
  const date = parseWeddingDate(data.event.weddingDate)
  const lunar = date ? solarToLunar(date.day, date.month, date.year) : null
  return <Section sectionKey="eventDetails" className="ac-event"><img className="ac-royal-decor ac-royal-decor--column ac-royal-decor--column-left reveal reveal--fade-only" src={aureliaCourtArtwork.royalColumn} alt="" /><img className="ac-royal-decor ac-royal-decor--column ac-royal-decor--column-right reveal reveal--fade-only" src={aureliaCourtArtwork.royalColumn} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Thông tin ngày cưới</p><div className="ac-event__couple reveal reveal--fade-up"><div className="reveal reveal--slide-left"><small>{data.eventDetails.brideTitle}</small><strong>{data.couple.brideName}</strong></div><div className="reveal reveal--slide-right"><small>{data.eventDetails.groomTitle}</small><strong>{data.couple.groomName}</strong></div></div><p className="ac-event__ceremony reveal reveal--fade-up">{data.eventDetails.title}</p><p className="ac-event__time reveal reveal--fade-up">{data.eventDetails.message}</p>{date ? <div className="ac-date reveal reveal--zoom-in"><div className="ac-date__top"><span className="reveal reveal--slide-left">{date.weekday}</span><strong className="reveal reveal--zoom-in">{date.day}</strong><span className="reveal reveal--slide-right">Tháng {date.month}</span></div><div className="ac-date__year">{date.year}</div>{lunar ? <small>(Nhằm ngày {lunar.day} tháng {lunar.month} năm {lunar.yearName} âm lịch)</small> : null}</div> : null}</div></Section>
}

function parseWeddingDate(value: string) {
  const parts = value.replace(/·/g, '-').split('-').map((part) => Number(part.trim()))
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) return null
  const [day, month, year] = parts
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return { day, month, year, weekday: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][date.getUTCDay()] }
}

function solarToLunar(day: number, month: number, year: number) {
  const timeZone = 7
  const dayNumber = jdFromDate(day, month, year)
  const month11 = getLunarMonth11(year, timeZone)
  const nextMonth11 = getLunarMonth11(year + 1, timeZone)
  let lunarYear = year
  let start = month11
  if (dayNumber >= month11) {
    start = month11
  } else {
    lunarYear = year - 1
    start = getLunarMonth11(year - 1, timeZone)
  }
  const k = Math.floor((start - 2415021.076998695) / 29.530588853 + 0.5)
  const diff = Math.floor((dayNumber - start) / 29.530588853)
  const lunarDay = dayNumber - getNewMoonDay(k + diff, timeZone) + 1
  let lunarMonth = diff + 11
  let lunarLeap = false
  const end = lunarYear === year ? nextMonth11 : month11
  if (end - start > 365) {
    const leapMonthDiff = getLeapMonthOffset(start, timeZone)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      lunarLeap = diff === leapMonthDiff
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ']
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi']
  return { day: lunarDay, month: lunarMonth, yearName: `${can[(lunarYear + 6) % 10]} ${chi[(lunarYear + 8) % 12]}${lunarLeap ? ' nhuận' : ''}` }
}

function jdFromDate(day: number, month: number, year: number) {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function getNewMoonDay(k: number, timeZone: number) {
  const t = k / 1236.85
  const t2 = t * t
  const t3 = t2 * t
  const dr = Math.PI / 180
  let jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3 + 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr)
  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3
  const mPrime = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3
  let correction = (0.000325 * Math.sin(m * dr)) + (0.000165 * Math.sin(mPrime * dr)) + (0.000164 * Math.sin(2 * f * dr))
  correction -= 0.000126 * Math.sin((m - mPrime) * dr) + 0.00011 * Math.sin((m + mPrime) * dr)
  correction += 0.000062 * Math.sin((2 * m - mPrime) * dr) + 0.00006 * Math.sin((2 * m) * dr) + 0.000056 * Math.sin((2 * mPrime) * dr)
  correction += 0.000047 * Math.sin((2 * f - mPrime) * dr) + 0.000042 * Math.sin((3 * m) * dr) + 0.00004 * Math.sin((2 * f + m) * dr)
  correction -= 0.000037 * Math.sin((mPrime - 2 * f) * dr) + 0.000035 * Math.sin((m - mPrime) * dr) + 0.000023 * Math.sin((2 * f - 2 * mPrime) * dr)
  correction += 0.000023 * Math.sin((mPrime - 2 * m) * dr) - 0.000021 * Math.sin((mPrime - m) * dr)
  return Math.floor(jd + correction + 0.5 + timeZone / 24)
}

function getSunLongitude(jdn: number, timeZone: number) {
  const t = (jdn - 2451545.5 - timeZone / 24) / 36525
  const t2 = t * t
  const dr = Math.PI / 180
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2
  const l = 280.46645 + 36000.76983 * t + 0.0003032 * t2
  const dl = (1.9146 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m) + (0.019993 - 0.000101 * t) * Math.sin(2 * dr * m) + 0.00029 * Math.sin(3 * dr * m)
  return Math.floor(((l + dl) * dr) / Math.PI * 6)
}

function getLunarMonth11(year: number, timeZone: number) {
  const off = jdFromDate(31, 12, year) - 2415021
  const k = Math.floor(off / 29.530588853)
  let monthStart = getNewMoonDay(k, timeZone)
  if (getSunLongitude(monthStart, timeZone) >= 9) monthStart = getNewMoonDay(k - 1, timeZone)
  return monthStart
}

function getLeapMonthOffset(month11: number, timeZone: number) {
  const k = Math.floor((month11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last = 0
  let i = 1
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  while (arc !== last && i < 14) {
    last = arc
    i += 1
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  }
  return i - 1
}

function toCountdownTarget(date: string, time: string) { const parts = date.replaceAll('·', '-').trim().split('-').map((part) => part.trim()); if (parts.length === 3 && parts[2].length === 4) return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0') + 'T' + time + ':00+07:00'; return date + 'T' + time + ':00+07:00' }

function Countdown({ data }: { data: AureliaCourtData }) { const countdown = useWeddingCountdown(toCountdownTarget(data.event.weddingDate, data.event.time)); const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]; return <Section sectionKey="countdown" className="ac-countdown"><img className="ac-floral ac-floral--venue reveal reveal--fade-only" src={aureliaCourtArtwork.corner} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Đếm ngược ngày vui</p><h2 className="reveal reveal--slide-up">{data.event.weddingDate}</h2><div className="ac-countdown__calendar reveal reveal--zoom-in" aria-label={`Ngày cưới ${data.event.weddingDate}`}><span>Ngày vui</span><strong>{data.event.weddingDate}</strong><small>{data.event.time} · Hẹn gặp bạn trong ngày vui</small></div><div className="ac-countdown__grid">{['Ngày', 'Giờ', 'Phút', 'Giây'].map((label, index) => <strong className="reveal reveal--fade-up" key={label}><b>{formatCountdownUnit(values[index])}</b><small>{label}</small></strong>)}</div></div></Section> }

function Timeline({ data }: { data: AureliaCourtData }) { const items = data.timeline.items ?? []; if (!items.length) return null; return <Section sectionKey="timeline" className="ac-timeline"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Lịch trình trong ngày</p><h2 className="reveal reveal--slide-up">{data.timeline.title}</h2><p className="reveal reveal--fade-up">{data.timeline.message}</p><div className="ac-timeline__list">{items.map((item) => <div className="ac-timeline__item reveal reveal--slide-left" key={`${item.time}-${item.title}`}><time className="reveal reveal--fade-only">{item.time}</time><div><strong className="reveal reveal--fade-up">{item.title}</strong><p className="reveal reveal--fade-up">{item.detail}</p></div></div>)}</div></div></Section> }

function Venue({ data }: { data: AureliaCourtData }) { return <Section sectionKey="venue" className="ac-venue"><img className="ac-floral ac-floral--countdown reveal reveal--fade-only" src={aureliaCourtArtwork.cascade} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">{data.venue.title}</p><h2 className="reveal reveal--slide-up">{data.venue.name}</h2><p className="reveal reveal--fade-up">{data.venue.address}</p><p className="reveal reveal--fade-up">{data.venue.message}</p><div className="ac-actions reveal reveal--fade-up"><a href={data.venue.mapUrl}>Mở bản đồ</a><a href={data.venue.calendarUrl}>Thêm vào lịch</a></div></div></Section> }

function Activities({ data }: { data: AureliaCourtData }) { const items = data.activities.items ?? []; if (!items.length) return null; const renderCard = (item: AureliaCourtData['activities']['items'][number], key: string) => <article className="reveal reveal--fade-up" key={key}>{item.image ? <img className="reveal reveal--zoom-in" src={item.image.src} alt={item.image.alt} /> : <img className="reveal reveal--zoom-in" src={aureliaCourtArtwork.corner} alt="" />}<strong className="reveal reveal--fade-up">{item.title}</strong></article>; const cards = items.length > 2 ? <div className="ac-activities__marquee reveal reveal--fade-up" aria-label="Các hoạt động trong ngày vui"><div className="ac-activities__track">{[...items, ...items].map((item, index) => renderCard(item, `${item.title}-${index}`))}</div></div> : <div className="ac-activities__grid reveal reveal--fade-up">{items.map((item) => renderCard(item, item.title))}</div>; return <Section sectionKey="activities" className="ac-activities"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Trong ngày vui</p><h2 className="reveal reveal--slide-up">{data.activities.title}</h2><p className="reveal reveal--fade-up">{data.activities.message}</p>{cards}</div></Section> }

function Gallery({ data }: { data: AureliaCourtData }) { const images = data.gallery.images ?? []; const [active, setActive] = useState(0); useEffect(() => { if (images.length < 2) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 4200); return () => window.clearInterval(timer); }, [images.length]); if (!images.length) return <Section sectionKey="gallery" className="ac-gallery"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Album ảnh</p><h2 className="reveal reveal--slide-up">{data.gallery.title}</h2><p className="reveal reveal--fade-up">{data.gallery.message}</p><div className="ac-empty reveal reveal--fade-up">Album sẽ được hiển thị tại đây.</div></div></Section>; return <Section sectionKey="gallery" className="ac-gallery"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Album ảnh</p><h2 className="reveal reveal--slide-up">{data.gallery.title}</h2><p className="reveal reveal--fade-up">{data.gallery.message}</p><div className="ac-gallery__carousel reveal reveal--fade-up" role="region" aria-label="Album ảnh cưới"><div className="ac-gallery__stage">{images.map((image, index) => { const rawOffset = (index - active + images.length) % images.length; const offset = rawOffset > images.length / 2 ? rawOffset - images.length : rawOffset; const visible = Math.abs(offset) <= 1; return <figure className="ac-gallery__card" key={image.src} aria-hidden={!visible} style={{ opacity: visible ? 1 : 0, transform: `translateX(calc(-50% + ${offset * 72}%)) translateZ(${offset === 0 ? 70 : 0}px) rotateY(${offset * -24}deg) scale(${offset === 0 ? 1 : .78})`, zIndex: offset === 0 ? 3 : 2 - Math.abs(offset) }}><img src={image.src} alt={image.alt} /></figure> })}</div><div className="ac-gallery__controls"><button className="reveal reveal--slide-left" type="button" onClick={() => setActive((active - 1 + images.length) % images.length)} aria-label="Ảnh album trước">‹</button><span className="reveal reveal--fade-up">{active + 1} / {images.length}</span><button className="reveal reveal--slide-right" type="button" onClick={() => setActive((active + 1) % images.length)} aria-label="Ảnh album tiếp theo">›</button></div></div></div></Section> }

function ActionCard({ sectionKey, title, message, meta, action, interactions }: { sectionKey: string; title: string; message: string; meta?: string; action: string; interactions?: PublicInteractions }) {
  const isRsvp = sectionKey === 'rsvp'
  const controller = isRsvp ? interactions?.rsvp : interactions?.wishes
  const isPersonalized = Boolean(interactions?.isPersonalized)
  const personalizedName = interactions?.guestName?.trim()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [attendance, setAttendance] = useState<'ATTENDING' | 'DECLINED' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [validationError, setValidationError] = useState('')
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!controller || controller.submitting || submitted) return
    const guestName = isPersonalized ? undefined : name.trim()
    if (!isPersonalized && !guestName) {
      setValidationError('Vui lòng nhập tên trước khi gửi.')
      return
    }
    if (isRsvp && !attendance) return
    if (!isRsvp && !content.trim()) return
    setValidationError('')
    const ok = isRsvp
      ? await interactions!.rsvp.submit({ guestName, attendance: attendance!, partySize: 1 })
      : await interactions!.wishes.submit({ guestName, content: content.trim() })
    if (ok) setSubmitted(true)
  }
  const clearValidationError = () => { if (validationError) setValidationError('') }
  const disabled = !controller || Boolean(controller.submitting) || submitted || (isRsvp ? !attendance : !content.trim())
  return <Section sectionKey={sectionKey} className={`ac-action ac-action--${sectionKey}`}><img className="ac-seal reveal reveal--zoom-in" src={aureliaCourtArtwork.seal} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">{isRsvp ? 'Xác nhận tham dự' : 'Lời chúc'}</p><h2 className="reveal reveal--slide-up">{title}</h2><p className="reveal reveal--fade-up">{message}</p>{meta ? <small className="reveal reveal--fade-up">{meta}</small> : null}<form className="ac-action__form reveal reveal--fade-up" onSubmit={submit}>{isPersonalized ? <p className="ac-personalized reveal reveal--fade-up">Xác nhận cho {personalizedName || 'khách mời'}</p> : <label className="reveal reveal--fade-up">Tên của bạn<input value={name} onChange={(event) => { setName(event.target.value); clearValidationError() }} autoComplete="name" /></label>}{isRsvp ? <div className="ac-choice reveal reveal--fade-up" aria-label="Lựa chọn tham dự"><button type="button" className={attendance === 'ATTENDING' ? 'is-selected' : ''} onClick={() => { setAttendance('ATTENDING'); clearValidationError() }}>Có thể tham dự</button><button type="button" className={attendance === 'DECLINED' ? 'is-selected' : ''} onClick={() => { setAttendance('DECLINED'); clearValidationError() }}>Xin phép vắng mặt</button></div> : <label className="reveal reveal--fade-up">Lời chúc<textarea value={content} onChange={(event) => { setContent(event.target.value); clearValidationError() }} rows={3} placeholder="Viết lời chúc của bạn..." /></label>}<button className="ac-button reveal reveal--zoom-in" type="submit" disabled={disabled}>{submitted ? 'Đã gửi' : controller?.submitting ? 'Đang gửi...' : action}</button>{validationError || controller?.error ? <p className="reveal reveal--fade-up" role="alert">{validationError || controller?.error}</p> : null}</form></div></Section>
}

function Gift({ data }: { data: AureliaCourtData }) { const [qrOpen, setQrOpen] = useState(false); const qrMedia = data.gift.qrMedia; const qrSrc = typeof qrMedia === 'string' ? qrMedia : qrMedia?.src; const hasQr = Boolean(qrSrc); const qrAlt = typeof qrMedia === 'object' && qrMedia?.alt ? qrMedia.alt : 'Mã QR mừng cưới'; return <Section sectionKey="gift" className="ac-gift"><div className="ac-gift__card"><img className="ac-gift__crest reveal reveal--zoom-in" src={aureliaCourtArtwork.crest} alt="" aria-hidden="true" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Một lời chúc phúc</p><h2 className="reveal reveal--slide-up">{data.gift.title}</h2><p className="ac-gift__message reveal reveal--fade-up">{data.gift.message}</p><div className="ac-gift__rule" aria-hidden="true"><span>✦</span></div><div className={`ac-gift__qr ${hasQr ? '' : 'ac-gift__qr--empty'} reveal reveal--zoom-in ${qrOpen ? 'is-open' : ''}`}><button className="ac-gift__qr-trigger" type="button" onClick={() => setQrOpen(true)} aria-expanded={qrOpen} tabIndex={qrOpen ? -1 : 0} aria-label="Mở mã QR mừng cưới">{hasQr ? <><img className="ac-qr ac-qr--preview" src={qrSrc} alt={qrAlt} /><span>Chạm để xem lớn hơn</span></> : <><img src={aureliaCourtArtwork.seal} alt="" aria-hidden="true" /><span>Chạm để xem mã QR</span></>}</button><div className="ac-gift__qr-panel" role="dialog" aria-label="Mã QR mừng cưới" aria-hidden={!qrOpen}>{hasQr ? <img className="ac-qr" src={qrSrc} alt={qrAlt} /> : <div className="ac-gift__qr-placeholder"><span aria-hidden="true" /><small>Mã QR sẽ hiển thị sau khi được thêm.</small></div>}<button className="ac-gift__qr-close" type="button" onClick={() => setQrOpen(false)} tabIndex={qrOpen ? 0 : -1} aria-label="Đóng mã QR">×</button></div></div><p className="ac-gift__thanks reveal reveal--fade-up">{data.gift.thankYouMessage}</p></div></div></Section> }

function Footer({ data }: { data: AureliaCourtData }) { const footerStyle = { '--ac-footer-image': data.footer.backgroundMedia ? `url("${data.footer.backgroundMedia.src}")` : 'none' } as React.CSSProperties; return <Section sectionKey="footer" className="ac-footer" style={footerStyle}><img className="ac-seal reveal reveal--zoom-in" src={aureliaCourtArtwork.seal} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">With love</p><h2 className="reveal reveal--slide-up">{data.footer.title}</h2><p className="reveal reveal--fade-up">{data.footer.message}</p><p className="ac-footer__names reveal reveal--fade-up">{data.couple.brideName} &amp; {data.couple.groomName}</p></div></Section> }
