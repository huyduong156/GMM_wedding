import { useEffect, useRef, useState } from 'react'
import { aureliaCourtArtwork, aureliaCourtFixture, aureliaCourtSectionConfig } from './fixture'
import type { AureliaCourtData, AureliaCourtSectionConfig } from './AureliaCourtTypes'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { formatCountdownUnit, useWeddingCountdown } from '../../../shared/lib/date/useWeddingCountdown'
import { MusicPlayer } from '../../../shared/ui/music-player'
import '../../../shared/styles/reveal-animations.css'
import './aurelia-court.css'

type Props = { data?: AureliaCourtData; sectionConfig?: AureliaCourtSectionConfig; editorMode?: boolean; interactions?: PublicInteractions }

const replaceGuest = (value: string, guestName = 'quý khách') => value.replaceAll('{guestName}', guestName)

export function AureliaCourtRenderer({ data = aureliaCourtFixture, sectionConfig = aureliaCourtSectionConfig, editorMode = false, interactions }: Props) {
  const [opened, setOpened] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [openingComplete, setOpeningComplete] = useState(false)

  const [ambientActive, setAmbientActive] = useState(true)
  const active = new Set(sectionConfig.enabled)
  const show = (sectionKey: string) => active.has(sectionKey)
  const guestName = interactions?.guestName?.trim() || 'quý khách'

  useEffect(() => {
    if (!opened || openingComplete) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(() => setOpeningComplete(true), reducedMotion ? 0 : 1500)
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

  return (
    <>
      <main className={`ac-page ${opened ? 'is-opened' : ''}`} aria-label="Thiệp cưới Aurelia Court">
      <Opening data={data} opened={opened} openingComplete={openingComplete} ambientActive={ambientActive} onOpen={() => setOpened(true)} />
      {active.has('music') && (data.music.backgroundMusicUrl || editorMode) ? <MusicPlayer src={data.music.backgroundMusicUrl} title={data.music.backgroundMusicName || data.music.trackName || data.music.title} autoplay={data.music.backgroundMusicAutoplay} active={opened} editorMode={editorMode} /> : null}
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
              case 'music': return <Section key={sectionKey} sectionKey="music" className="ac-music"><p className="ac-kicker reveal reveal--fade-up">Nhạc nền</p><h2 className="reveal reveal--slide-up">{data.music.title}</h2><p className="reveal reveal--fade-up">{data.music.trackName || 'Một giai điệu nhẹ nhàng sẽ đồng hành cùng tấm thiệp.'}</p></Section>
              case 'footer': return <Footer key={sectionKey} data={data} />
              default: return null
            }
          })}
        </div>
      </div>
      </main>
    </>
  )
}

function Section({ sectionKey, className = '', children }: { sectionKey: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } }, { threshold: 0.08, rootMargin: '0px 0px -33% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <section ref={ref} className={`ac-section ${visible ? 'is-visible' : ''} ${className}`.trim()} data-editor-section={sectionKey}>{children}</section>
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
        <div className="ac-opening-card__content"><img className="ac-opening-card__crest" src={aureliaCourtArtwork.crest} alt="" /><span className="ac-opening-card__eyebrow">{data.opening.eyebrow}</span><p className="ac-opening-card__title">{data.opening.title}</p><h1><span>{data.couple.brideName}</span><em className="ac-opening-card__ampersand" aria-label="và">&amp;</em><span>{data.couple.groomName}</span></h1><p className="ac-opening-card__date">{data.event.weddingDate}</p><p className="ac-opening-card__note">{data.opening.message}</p><span className="ac-opening-card__open">Mở thiệp</span></div>
      </button>
    </div>
  </section>
}
function Cover({ data }: { data: AureliaCourtData }) {
  return <Section sectionKey="cover" className="ac-cover"><img className="ac-royal-decor ac-royal-decor--pediment" src={aureliaCourtArtwork.royalPediment} alt="" /><div className="ac-content ac-cover__plane"><p className="ac-kicker reveal reveal--fade-up">{data.cover.eyebrow}</p><h2 className="reveal reveal--zoom-in">{data.couple.brideName}<span>&amp;</span>{data.couple.groomName}</h2>{data.cover.title !== data.couple.brideName + ' & ' + data.couple.groomName ? <p className="ac-lead reveal reveal--fade-up">{data.cover.title}</p> : null}<p className="ac-cover__message reveal reveal--fade-up">{data.cover.message}</p><p className="reveal reveal--fade-up">{data.event.weddingDate} · {data.event.time}</p>{data.cover.heroMedia ? <img className="ac-user-media reveal reveal--fade-up" src={data.cover.heroMedia.src} alt={data.cover.heroMedia.alt} /> : null}</div></Section>
}

function Invitation({ data, guestName }: { data: AureliaCourtData; guestName: string }) {
  return <Section sectionKey="invitation" className="ac-letter"><img className="ac-floral ac-floral--letter" src={aureliaCourtArtwork.sprig} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Lời báo hỷ</p><h2 className="reveal reveal--slide-up">{replaceGuest(data.invitation.title, guestName)}</h2><p className="reveal reveal--fade-up">{replaceGuest(data.invitation.message, guestName)}</p><img className="ac-divider reveal reveal--zoom-in" src={aureliaCourtArtwork.divider} alt="" /></div></Section>
}

function Families({ data }: { data: AureliaCourtData }) {
  const family = (side: typeof data.families.brideSide) => <div className="ac-family reveal reveal--fade-up"><p className="ac-kicker">{side.label}</p><div><small>{side.fatherTitle}</small><strong>{side.father}</strong><small>{side.motherTitle}</small><strong>{side.mother}</strong></div><p>{side.address}</p></div>
  return <Section sectionKey="families" className="ac-families"><img className="ac-royal-decor ac-royal-decor--bust" src={aureliaCourtArtwork.royalBust} alt="" /><img className="ac-floral ac-floral--family" src={aureliaCourtArtwork.cascade} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Hai bên gia đình</p><h2 className="reveal reveal--slide-up">{data.families.title}</h2><p className="reveal reveal--fade-up">{data.families.subtitle}</p><p className="ac-families__message reveal reveal--fade-up">{data.families.message}</p><div className="ac-families__grid">{family(data.families.brideSide)}{family(data.families.groomSide)}</div><img className="ac-divider reveal reveal--zoom-in" src={aureliaCourtArtwork.divider} alt="" /></div></Section>
}

function EventDetails({ data }: { data: AureliaCourtData }) { return <Section sectionKey="eventDetails" className="ac-event"><img className="ac-royal-decor ac-royal-decor--column ac-royal-decor--column-right" src={aureliaCourtArtwork.royalColumn} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Thông tin ngày cưới</p><h2 className="reveal reveal--slide-up">{data.eventDetails.title}</h2><strong className="ac-date reveal reveal--zoom-in">{data.event.weddingDate}</strong><p className="reveal reveal--fade-up">{data.eventDetails.message}</p><p className="reveal reveal--fade-up">{data.event.time} · {data.event.venueName}</p><p className="reveal reveal--fade-up">{data.event.venueAddress}</p></div></Section> }

function toCountdownTarget(date: string, time: string) { const parts = date.replaceAll('·', '-').trim().split('-').map((part) => part.trim()); if (parts.length === 3 && parts[2].length === 4) return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0') + 'T' + time + ':00+07:00'; return date + 'T' + time + ':00+07:00' }

function Countdown({ data }: { data: AureliaCourtData }) { const countdown = useWeddingCountdown(toCountdownTarget(data.event.weddingDate, data.event.time)); const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]; return <Section sectionKey="countdown" className="ac-countdown"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Đếm ngược ngày vui</p><h2 className="reveal reveal--slide-up">{data.event.weddingDate}</h2><div className="ac-countdown__grid">{['Ngày', 'Giờ', 'Phút', 'Giây'].map((label, index) => <strong className="reveal reveal--fade-up" key={label}><b>{formatCountdownUnit(values[index])}</b><small>{label}</small></strong>)}</div></div></Section> }

function Timeline({ data }: { data: AureliaCourtData }) { return <Section sectionKey="timeline" className="ac-timeline"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Lịch trình trong ngày</p><h2 className="reveal reveal--slide-up">{data.timeline.title}</h2><p className="reveal reveal--fade-up">{data.timeline.message}</p><div className="ac-timeline__list">{data.timeline.items.map((item) => <div className="ac-timeline__item reveal reveal--slide-left" key={`${item.time}-${item.title}`}><time>{item.time}</time><div><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}</div></div></Section> }

function Venue({ data }: { data: AureliaCourtData }) { return <Section sectionKey="venue" className="ac-venue"><img className="ac-royal-decor ac-royal-decor--mirror ac-royal-decor--mirror-left" src={aureliaCourtArtwork.royalMirror} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">{data.venue.title}</p><h2 className="reveal reveal--slide-up">{data.venue.name}</h2><p className="reveal reveal--fade-up">{data.venue.address}</p><p className="reveal reveal--fade-up">{data.venue.message}</p><div className="ac-actions reveal reveal--fade-up"><a href={data.venue.mapUrl}>Mở bản đồ</a><a href={data.venue.calendarUrl}>Thêm vào lịch</a></div></div></Section> }

function Activities({ data }: { data: AureliaCourtData }) { return <Section sectionKey="activities" className="ac-activities"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Trong ngày vui</p><h2 className="reveal reveal--slide-up">{data.activities.title}</h2><p className="reveal reveal--fade-up">{data.activities.message}</p><div className="ac-activities__grid">{data.activities.items.map((item) => <article className="reveal reveal--fade-up" key={item.title}>{item.image ? <img src={item.image.src} alt={item.image.alt} /> : <img src={aureliaCourtArtwork.corner} alt="" />}<strong>{item.title}</strong></article>)}</div></div></Section> }

function Gallery({ data }: { data: AureliaCourtData }) { return <Section sectionKey="gallery" className="ac-gallery"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Album ảnh</p><h2 className="reveal reveal--slide-up">{data.gallery.title}</h2><p className="reveal reveal--fade-up">{data.gallery.message}</p>{data.gallery.images.length ? <div className="ac-gallery__grid">{data.gallery.images.map((image) => <img className="reveal reveal--zoom-in" key={image.src} src={image.src} alt={image.alt} />)}</div> : <div className="ac-empty reveal reveal--fade-up">Album sẽ được hiển thị tại đây.</div>}</div></Section> }

function ActionCard({ sectionKey, title, message, meta, action, interactions }: { sectionKey: string; title: string; message: string; meta?: string; action: string; interactions?: PublicInteractions }) { const isRsvp = sectionKey === 'rsvp'; const controller = (isRsvp ? interactions?.rsvp : interactions?.wishes)!; const [name, setName] = useState(''); const [content, setContent] = useState(''); const [attendance, setAttendance] = useState<'ATTENDING' | 'DECLINED' | null>(null); const [submitted, setSubmitted] = useState(false); const personalizedName = interactions?.guestName?.trim(); const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!controller || controller.submitting || submitted) return; const ok = isRsvp ? attendance ? await interactions!.rsvp.submit({ guestName: personalizedName ? undefined : name.trim() || undefined, attendance, partySize: 1 }) : false : content.trim() ? await interactions!.wishes.submit({ guestName: personalizedName ? undefined : name.trim() || undefined, content: content.trim() }) : false; if (ok) setSubmitted(true); }; return <Section sectionKey={sectionKey} className={`ac-action ac-action--${sectionKey}`}><img className="ac-seal reveal reveal--zoom-in" src={aureliaCourtArtwork.seal} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">{isRsvp ? 'Xác nhận tham dự' : 'Lời chúc'}</p><h2 className="reveal reveal--slide-up">{title}</h2><p className="reveal reveal--fade-up">{message}</p>{meta ? <small className="reveal reveal--fade-up">{meta}</small> : null}{interactions ? <form className="ac-action__form reveal reveal--fade-up" onSubmit={submit}>{personalizedName ? <p className="ac-personalized">Xác nhận cho {personalizedName}</p> : <label>Tên của bạn<input value={name} onChange={(event) => setName(event.target.value)} /></label>}{isRsvp ? <div className="ac-choice" aria-label="Lựa chọn tham dự"><button type="button" className={attendance === 'ATTENDING' ? 'is-selected' : ''} onClick={() => setAttendance('ATTENDING')}>Có thể tham dự</button><button type="button" className={attendance === 'DECLINED' ? 'is-selected' : ''} onClick={() => setAttendance('DECLINED')}>Xin phép vắng mặt</button></div> : <label>Lời chúc<textarea value={content} onChange={(event) => setContent(event.target.value)} rows={3} /></label>}<button className="ac-button" type="submit" disabled={Boolean(controller.submitting) || submitted || (isRsvp ? !attendance : !content.trim())}>{submitted ? 'Đã gửi' : controller.submitting ? 'Đang gửi...' : action}</button>{controller.error ? <p role="alert">{controller.error}</p> : null}</form> : <button className="ac-button reveal reveal--fade-up" type="button" disabled>{action}</button>}</div></Section> }

function Gift({ data }: { data: AureliaCourtData }) { return <Section sectionKey="gift" className="ac-gift"><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">Mừng cưới</p><h2 className="reveal reveal--slide-up">{data.gift.title}</h2><p className="reveal reveal--fade-up">{data.gift.message}</p>{data.gift.qrMedia ? <img className="ac-qr reveal reveal--zoom-in" src={data.gift.qrMedia.src} alt={data.gift.qrMedia.alt} /> : <div className="ac-empty reveal reveal--fade-up">Mã QR sẽ hiển thị tại đây khi được thêm.</div>}<p className="reveal reveal--fade-up">{data.gift.thankYouMessage}</p></div></Section> }

function Footer({ data }: { data: AureliaCourtData }) { return <Section sectionKey="footer" className="ac-footer"><img className="ac-seal reveal reveal--zoom-in" src={aureliaCourtArtwork.seal} alt="" /><div className="ac-content"><p className="ac-kicker reveal reveal--fade-up">With love</p><h2 className="reveal reveal--slide-up">{data.footer.title}</h2><p className="reveal reveal--fade-up">{data.footer.message}</p><p className="ac-footer__names reveal reveal--fade-up">{data.couple.brideName} &amp; {data.couple.groomName}</p></div></Section> }
