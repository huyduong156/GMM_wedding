import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight, CalendarBlank, MapPin, Sparkle } from '@phosphor-icons/react'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothInvitationScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { FallingStars } from '../../../shared/ui/falling-stars/FallingStars'
import { AstralOpeningCard } from './AstralOpeningCard'
import type { AstralVowData, AstralVowSectionConfig, AstralVowSectionKey } from './AstralVowTypes'
import { astralVowFixture, astralVowSectionConfig } from './fixture'
import './astral-vow.css'

export type { AstralVowData, AstralVowSectionConfig, AstralVowSectionKey }
const art = '/assets/images/templates/astral-vow/artwork/av-celestial-soft-frame-v2.png'
const artwork = {
  corona: '/assets/images/templates/astral-vow/artwork/av-corona-borealis-v1.png',
  crescent: '/assets/images/templates/astral-vow/artwork/av-crescent-moon-v1.png',
  openingHalos: '/assets/images/templates/astral-vow/artwork/av-opening-halo-rings-v1.png',
  openingRibbon: '/assets/images/templates/astral-vow/artwork/av-opening-spiral-ribbon-v2.png',
}
const keys = astralVowSectionConfig.order
const required = new Set<AstralVowSectionKey>(['opening', 'cover', 'invitation', 'families', 'eventDetails', 'footer'])
const anchored = new Set<AstralVowSectionKey>(['opening', 'cover', 'invitation', 'families', 'eventDetails', 'music', 'footer'])
const src = (value: string | { src: string } | null | undefined) => typeof value === 'string' ? value : value?.src ?? ''
const withGuest = (value: string, guest?: string | null) => value.replaceAll('{guestName}', guest?.trim() || 'Quý khách')

function AstralSection({ sectionKey, className = '', children, active, order }: { sectionKey: AstralVowSectionKey; className?: string; children: ReactNode; active: Set<AstralVowSectionKey>; order: AstralVowSectionKey[] }) {
  if (!active.has(sectionKey)) return null
  return <section className={`av-section av-reveal ${className}`} data-editor-section={sectionKey} tabIndex={-1} style={{ order: order.indexOf(sectionKey) } as CSSProperties}>{children}</section>
}

function getClock(date: string, time: string) {
  const parts = date.match(/(\d{1,2})\s*[·/.-]\s*(\d{1,2})\s*[·/.-]\s*(\d{4})/)
  if (!parts) return [0, 0, 0, 0]
  const target = new Date(+parts[3], +parts[2] - 1, +parts[1], +(time.split(':')[0] || 0), +(time.split(':')[1] || 0)).getTime()
  const remaining = Math.max(0, target - Date.now())
  return [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
}

export function AstralVowInvitation({ data, sectionConfig, editorMode = false, guestName, interactions }: { data?: AstralVowData; sectionConfig?: AstralVowSectionConfig; editorMode?: boolean; guestName?: string | null; interactions?: PublicInteractions }) {
  const content = { ...astralVowFixture, ...data, couple: { ...astralVowFixture.couple, ...data?.couple }, event: { ...astralVowFixture.event, ...data?.event }, opening: { ...astralVowFixture.opening, ...data?.opening }, cover: { ...astralVowFixture.cover, ...data?.cover }, invitation: { ...astralVowFixture.invitation, ...data?.invitation }, families: { ...astralVowFixture.families, ...data?.families }, eventDetails: { ...astralVowFixture.eventDetails, ...data?.eventDetails }, venue: { ...astralVowFixture.venue, ...data?.venue }, gallery: { ...astralVowFixture.gallery, ...data?.gallery }, rsvp: { ...astralVowFixture.rsvp, ...data?.rsvp }, guestbook: { ...astralVowFixture.guestbook, ...data?.guestbook }, gift: { ...astralVowFixture.gift, ...data?.gift }, footer: { ...astralVowFixture.footer, ...data?.footer } }
  const rootRef = useRef<HTMLElement>(null)
  const [opened, setOpened] = useState(editorMode); const [openingComplete, setOpeningComplete] = useState(editorMode); const [pageHidden, setPageHidden] = useState(false); const [tick, setTick] = useState(0); const [choice, setChoice] = useState<'ATTENDING' | 'DECLINED' | null>(null); const [rsvpDone, setRsvpDone] = useState(false); const [wish, setWish] = useState(''); const [wishDone, setWishDone] = useState(false)
  useSmoothInvitationScroll(opened && openingComplete)
  useEffect(() => { const id = window.setInterval(() => setTick((value) => value + 1), 1000); return () => window.clearInterval(id) }, [])
  useEffect(() => { if (opened) window.setTimeout(() => document.querySelector<HTMLElement>('[data-editor-section="cover"]')?.focus(), 650) }, [opened])
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const update = () => {
      frame = 0
      root.style.setProperty('--av-scroll', `${Math.min(window.scrollY, 520) * 0.055}px`)
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame) }
  }, [])
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-editor-section]'))
    if (!('IntersectionObserver' in window)) { sections.forEach((section) => section.classList.add('is-in-view')); return }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-in-view')
      observer.unobserve(entry.target)
    }), { threshold: 0.24 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [opened])
  useEffect(() => {
    const sync = () => setPageHidden(document.visibilityState === 'hidden')
    sync(); document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])
  useEffect(() => {
    if (!opened || openingComplete) return
    const timeout = window.setTimeout(() => setOpeningComplete(true), 2450)
    return () => window.clearTimeout(timeout)
  }, [opened, openingComplete])
  const active = new Set(sectionConfig?.enabled ?? keys); required.forEach((key) => active.add(key))
  const requested = sectionConfig?.order?.length ? sectionConfig.order : keys
  const order = [...keys.filter((key) => anchored.has(key) && !['music', 'footer'].includes(key)), ...requested.filter((key) => active.has(key) && !anchored.has(key)), ...(active.has('music') ? ['music' as const] : []), 'footer' as const]
  const time = useMemo(() => getClock(content.event?.weddingDate ?? '', content.event?.time ?? ''), [content.event?.time, content.event?.weddingDate, tick])
  const guest = interactions?.guestName || guestName
  const invitationImages = [content.invitationMemoryImage1, content.invitationMemoryImage2, content.invitationMemoryImage3].map(src).filter(Boolean)
  if (!invitationImages.length) { const heroImage = src(content.heroMedia); if (heroImage) invitationImages.push(heroImage) }
  const family = (side: NonNullable<AstralVowData['families']>['brideSide']) => <article className="av-family"><span>{side?.label}</span><p><em>{side?.fatherTitle}</em>{side?.father}</p><p><em>{side?.motherTitle}</em>{side?.mother}</p><small>{side?.address}</small></article>
  const submitRsvp = async () => { if (!choice) return; const accepted = await interactions?.rsvp.submit({ guestName: guest ? undefined : 'Quý khách', attendance: choice, partySize: 1 }); if (accepted !== false) setRsvpDone(true) }
  const submitWish = async () => { if (!wish.trim()) return; const accepted = await interactions?.wishes.submit({ guestName: guest ? undefined : 'Quý khách', content: wish }); if (accepted !== false) setWishDone(true) }
  return <main ref={rootRef} className={`av-page ${opened ? 'is-opened' : ''} ${pageHidden ? 'is-page-hidden' : ''}`}><div className="av-stars" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ '--x': `${index * 53 % 100}%`, '--y': `${index * 71 % 100}%`, '--delay': `${(index * 1.7) % 12}s` } as CSSProperties}/>)}</div>{openingComplete && <FallingStars target=".av-page" className="av-page-stars" />}
    {(!openingComplete || editorMode) && <AstralOpeningCard className="av-opening-card" brideName={content.couple?.brideName ?? ''} groomName={content.couple?.groomName ?? ''} date={content.event?.weddingDate} venue={content.event?.venueName} eyebrow={content.opening?.title} note={withGuest(content.opening?.message ?? '', guest)} leftDecorationSrc={artwork.openingHalos} rightDecorationSrc={artwork.openingRibbon} openLabel="Mở thiệp" openedLabel="Thiệp đã mở" isOpen={editorMode} isOpening={opened && !openingComplete} onOpen={() => setOpened(true)} sectionKey="opening" />}
    {openingComplete && <div className="av-canvas"><div className="av-content">
      <AstralSection active={active} order={order} sectionKey="cover" className="av-cover"><img className="av-cover-frame" src={art} alt=""/><div className="av-cover-astral-rings" aria-hidden="true"><div/><div/><div/><div className="av-cover-rays"><i/><i/><i/><i/></div><i className="av-cover-sun"/></div><span className="av-label">{content.cover?.eyebrow}</span><h2>{content.couple?.brideName}<b>&</b>{content.couple?.groomName}</h2><p className="av-cover-slogan">{content.cover?.title}</p><p>{content.event?.weddingDate}</p></AstralSection>
      <AstralSection active={active} order={order} sectionKey="invitation" className="av-invitation"><span className="av-label">Lời mời</span><h2>{withGuest(content.invitation?.title ?? '', guest)}</h2><p>{withGuest(content.invitation?.message ?? '', guest)}</p>{invitationImages.length > 0 && <div className="av-invitation-memories">{invitationImages.map((image, index) => <figure key={`${image}-${index}`}><img src={image} alt={`Khoảnh khắc cô dâu chú rể ${index + 1}`}/></figure>)}</div>}<div className="av-orbit" aria-hidden="true"/></AstralSection>
      <AstralSection active={active} order={order} sectionKey="families" className="av-families"><img className="av-families-moon" src={artwork.crescent} alt=""/><span className="av-label">Hai gia đình</span><h2>{content.families?.title}</h2><p>{content.families?.subtitle}</p><div className="av-family-grid">{family(content.families?.brideSide)}<div className="av-eclipse" aria-hidden="true"/>{family(content.families?.groomSide)}</div><p>{withGuest(content.families?.message ?? '', guest)}</p></AstralSection>
      <AstralSection active={active} order={order} sectionKey="eventDetails" className="av-events"><span className="av-label">Điểm hẹn</span><h2>{content.eventDetails?.title}</h2><p>{content.eventDetails?.date}</p><div className="av-event-list">{content.eventDetails?.items?.map((item) => <div key={`${item.time}-${item.title}`}><time>{item.time}</time><span>{item.title}</span></div>)}</div>{content.eventDetails?.calendarUrl && <a href={content.eventDetails.calendarUrl}><CalendarBlank size={18}/>Thêm vào lịch</a>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="countdown" className="av-countdown"><span className="av-label">Đếm ngược đến ngày vui</span><div>{time.map((value, index) => <strong key={index}><b>{String(value).padStart(2, '0')}</b><small>{['Ngày', 'Giờ', 'Phút', 'Giây'][index]}</small></strong>)}</div></AstralSection>
      <AstralSection active={active} order={order} sectionKey="timeline"><span className="av-label">Quỹ đạo ngày vui</span><h2>Lịch trình</h2><div className="av-timeline">{content.timeline?.items?.map((item) => <article key={`${item.time}-${item.title}`}><i/><time>{item.time}</time><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></AstralSection>
      <AstralSection active={active} order={order} sectionKey="venue" className="av-venue"><MapPin size={28}/><span className="av-label">Đài quan sát</span><h2>{content.venue?.name}</h2><p>{content.venue?.address}</p><p>{content.venue?.message}</p>{content.venue?.mapUrl && <a href={content.venue.mapUrl} target="_blank" rel="noreferrer">Mở bản đồ <ArrowUpRight size={17}/></a>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="gallery" className="av-gallery"><span className="av-label">Chòm sao ký ức</span><h2>{content.gallery?.title}</h2><p>{content.gallery?.message}</p><div>{(data?.galleryImages ?? content.galleryImages ?? []).slice(0, 6).map((image, index) => <figure key={index}><img src={src(image)} alt={`Khoảnh khắc ${index + 1}`}/></figure>)}</div></AstralSection>
      <AstralSection active={active} order={order} sectionKey="rsvp" className="av-rsvp"><Sparkle size={22}/><h2>{content.rsvp?.title}</h2><p>{content.rsvp?.message}</p>{rsvpDone || interactions?.rsvp.submitted ? <strong>{content.rsvp?.successMessage}</strong> : <><div><button type="button" className={choice === 'ATTENDING' ? 'is-picked' : ''} onClick={() => setChoice('ATTENDING')}>{content.rsvp?.attendingLabel}</button><button type="button" className={choice === 'DECLINED' ? 'is-picked' : ''} onClick={() => setChoice('DECLINED')}>{content.rsvp?.notAttendingLabel}</button></div><button type="button" onClick={submitRsvp} disabled={!choice}>Xác nhận phản hồi</button></>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="guestbook" className="av-guestbook"><span className="av-label">Gửi một vì sao</span><h2>{content.guestbook?.title}</h2><p>{content.guestbook?.message}</p>{wishDone || interactions?.wishes.submitted ? <strong>{content.guestbook?.successMessage}</strong> : <><textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Gửi đôi lời yêu thương…"/><button type="button" onClick={submitWish}>Gửi lời chúc</button></>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="gift" className="av-gift"><div className="av-eclipse"/><h2>{content.gift?.title}</h2><p>{content.gift?.message}</p>{src(data?.giftQrMedia ?? content.giftQrMedia) && <img src={src(data?.giftQrMedia ?? content.giftQrMedia)} alt="Mã QR mừng cưới"/>}<small>{content.gift?.thankYouMessage}</small></AstralSection>
      <AstralSection active={active} order={order} sectionKey="footer" className="av-footer"><img src={artwork.corona} alt=""/><span className="av-label">Dưới cùng một bầu trời</span><h2>{content.footer?.title}</h2><p>{content.footer?.message}</p></AstralSection>
    </div></div>}</main>
}
