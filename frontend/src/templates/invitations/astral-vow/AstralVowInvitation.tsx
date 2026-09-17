import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight, CaretLeft, CaretRight, HandTap, MapPin, Sparkle } from '@phosphor-icons/react'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import { useSmoothInvitationScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import { FallingStars } from '../../../shared/ui/falling-stars/FallingStars'
import { AstralOpeningCard } from './AstralOpeningCard'
import type { AstralVowData, AstralVowSectionConfig, AstralVowSectionKey } from './AstralVowTypes'
import { astralVowFixture, astralVowSectionConfig } from './fixture'
import '../../../shared/styles/reveal-animations.css'
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
const required = new Set<AstralVowSectionKey>(['opening', 'cover', 'invitation', 'families', 'footer'])
const anchored = new Set<AstralVowSectionKey>(['opening', 'cover', 'invitation', 'families', 'music', 'footer'])
const src = (value: string | { src: string } | null | undefined) => typeof value === 'string' ? value : value?.src ?? ''
const withGuest = (value: string | null | undefined, guest?: string | null) => (value ?? '').replaceAll('{guestName}', guest?.trim() || 'Quý khách')

function AstralSection({ sectionKey, className = '', children, active, order, style }: { sectionKey: AstralVowSectionKey; className?: string; children: ReactNode; active: Set<AstralVowSectionKey>; order: AstralVowSectionKey[]; style?: CSSProperties }) {
  if (!active.has(sectionKey)) return null
  return <section className={`av-section av-reveal ${className}`} data-editor-section={sectionKey} tabIndex={-1} style={{ order: order.indexOf(sectionKey), ...style } as CSSProperties}>{children}</section>
}

function getClock(date: string, time: string) {
  const parts = date.match(/(\d{1,2})\s*[·/.-]\s*(\d{1,2})\s*[·/.-]\s*(\d{4})/)
  if (!parts) return [0, 0, 0, 0]
  const target = new Date(+parts[3], +parts[2] - 1, +parts[1], +(time.split(':')[0] || 0), +(time.split(':')[1] || 0)).getTime()
  const remaining = Math.max(0, target - Date.now())
  return [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
}

export function AstralVowInvitation({ data, sectionConfig, editorMode = false, guestName, interactions }: { data?: AstralVowData; sectionConfig?: AstralVowSectionConfig; editorMode?: boolean; guestName?: string | null; interactions?: PublicInteractions }) {
  const content = { ...astralVowFixture, ...data, couple: { ...astralVowFixture.couple, ...data?.couple }, event: { ...astralVowFixture.event, ...data?.event }, opening: { ...astralVowFixture.opening, ...data?.opening }, cover: { ...astralVowFixture.cover, ...data?.cover }, invitation: { ...astralVowFixture.invitation, ...data?.invitation }, families: { ...astralVowFixture.families, ...data?.families }, timeline: { ...astralVowFixture.timeline, ...data?.timeline }, venue: { ...astralVowFixture.venue, ...data?.venue }, gallery: { ...astralVowFixture.gallery, ...data?.gallery }, rsvp: { ...astralVowFixture.rsvp, ...data?.rsvp }, guestbook: { ...astralVowFixture.guestbook, ...data?.guestbook }, gift: { ...astralVowFixture.gift, ...data?.gift }, footer: { ...astralVowFixture.footer, ...data?.footer } }
  const rootRef = useRef<HTMLElement>(null)
  const [opened, setOpened] = useState(false); const [openingComplete, setOpeningComplete] = useState(false); const [pageHidden, setPageHidden] = useState(false); const [, setTick] = useState(0); const [choice, setChoice] = useState<'ATTENDING' | 'DECLINED' | null>(null); const [rsvpDone, setRsvpDone] = useState(false); const [wish, setWish] = useState(''); const [wishDone, setWishDone] = useState(false); const [galleryIndex, setGalleryIndex] = useState(0); const [giftOpen, setGiftOpen] = useState(false)
  useSmoothInvitationScroll(opened && openingComplete)
  useEffect(() => { const id = window.setInterval(() => setTick((value) => value + 1), 1000); return () => window.clearInterval(id) }, [])
  useEffect(() => { if (opened) window.setTimeout(() => document.querySelector<HTMLElement>('[data-editor-section="cover"]')?.focus(), 650) }, [opened])
  useEffect(() => {
    const root = rootRef.current
    if (!root || (!opened && !editorMode)) return
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-editor-section]'))
    const revealSelector = 'h1,h2,h3,p,span,strong,small,time,em,b,button,a,input,textarea,select,img,iframe,article'
    sections.forEach((section) => {
      section.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
        if (element.matches('.av-gift > .av-eclipse')) return
        if (element.closest('.av-opening-card')) return
        element.classList.add('reveal')
        if (element.matches('.av-gallery-deck figure, .av-gallery-deck img, .av-gift-panel, .av-gift-panel img, .av-gift > .av-eclipse')) {
          element.classList.add('reveal--fade-only')
        } else {
          element.classList.add(index % 3 === 0 ? 'reveal--fade-up' : index % 3 === 1 ? 'reveal--slide-left' : 'reveal--zoom-in')
        }
        element.style.setProperty('--reveal-delay', Math.min(index * 0.12, 1.1).toFixed(2) + 's')
      })
    })
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible', 'is-in-view'))
      return
    }
    const markVisible = (section: Element) => section.classList.add('is-visible', 'is-in-view')
    sections.filter((section) => section.getBoundingClientRect().top < window.innerHeight * 0.67).forEach(markVisible)
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        markVisible(entry.target)
        observer.unobserve(entry.target)
      }),
      { rootMargin: '0px 0px -33% 0px', threshold: 0.01 },
    )
    sections.filter((section) => !section.classList.contains('is-visible')).forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [opened, openingComplete])
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
  const order = [...requested, ...keys.filter((key) => !requested.includes(key))].filter((key) => active.has(key))
  const time = getClock(content.event?.weddingDate ?? '', content.event?.time ?? '')
  const guest = interactions?.guestName || guestName
  const venueAddress = content.venue?.address || content.event?.venueAddress || ''
  const venueMapSrc = content.venue?.mapUrl?.includes('output=embed') ? content.venue.mapUrl : venueAddress ? 'https://www.google.com/maps?q=' + encodeURIComponent(venueAddress) + '&output=embed' : content.venue?.mapUrl || ''
  const timelineItems = (content.timeline?.items ?? []).filter((item) => item.time?.trim() && item.title?.trim())
  const invitationImages = [content.invitationMemoryImage1, content.invitationMemoryImage2, content.invitationMemoryImage3].map(src).filter(Boolean)
  if (!invitationImages.length) { const heroImage = src(content.heroMedia); if (heroImage) invitationImages.push(heroImage) }
  const galleryImages = (data?.galleryImages?.length ? data.galleryImages : content.galleryImages ?? []).map(src).filter(Boolean).slice(0, 12)
  const footerImage = src(data?.footerMedia ?? content.footerMedia)
  const family = (side: NonNullable<AstralVowData['families']>['brideSide']) => <article className="av-family"><span>{side?.label}</span><p><em>{side?.fatherTitle}</em>{withGuest(side?.father ?? '', guest)}</p><p><em>{side?.motherTitle}</em>{withGuest(side?.mother ?? '', guest)}</p><small>{withGuest(side?.address ?? '', guest)}</small></article>
  const submitRsvp = async () => { if (!choice || interactions?.rsvp.submitting) return; const accepted = await interactions?.rsvp.submit({ guestName: undefined, attendance: choice, partySize: 1 }); if (accepted !== false) setRsvpDone(true) }
  const submitWish = async () => { if (!wish.trim()) return; const accepted = await interactions?.wishes.submit({ guestName: undefined, content: wish }); if (accepted !== false) setWishDone(true) }
  return <main ref={rootRef} className={`av-page ${opened ? 'is-opened' : ''} ${pageHidden ? 'is-page-hidden' : ''}`}><div className="av-stars" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ '--x': `${index * 53 % 100}%`, '--y': `${index * 71 % 100}%`, '--delay': `${(index * 1.7) % 12}s` } as CSSProperties}/>)}</div>{openingComplete && <FallingStars target=".av-page" className="av-page-stars" />}
    {!openingComplete && <AstralOpeningCard className="av-opening-card" brideName={content.couple?.brideName ?? ''} groomName={content.couple?.groomName ?? ''} date={content.event?.weddingDate} venue={content.event?.venueName} eyebrow={withGuest(content.opening?.title ?? '', guest)} note={withGuest(content.opening?.message ?? '', guest)} leftDecorationSrc={artwork.openingHalos} rightDecorationSrc={artwork.openingRibbon} openLabel="Mở thiệp" openedLabel="Thiệp đã mở" isOpen={false} isOpening={opened && !openingComplete} onOpen={() => setOpened(true)} sectionKey="opening" />}
    {(openingComplete || editorMode) && <div className="av-canvas"><div className="av-content">
      <AstralSection active={active} order={order} sectionKey="cover" className="av-cover"><img className="av-cover-frame" src={art} alt=""/><div className="av-cover-astral-rings" aria-hidden="true"><div/><div/><div/><div className="av-cover-rays"><i/><i/><i/><i/></div><i className="av-cover-sun"/></div><span className="av-label">{withGuest(content.cover?.eyebrow ?? '', guest)}</span><h2>{content.couple?.brideName}<b>&</b>{content.couple?.groomName}</h2><p className="av-cover-slogan">{withGuest(content.cover?.title ?? '', guest)}</p><p>{content.event?.weddingDate}</p></AstralSection>
      <AstralSection active={active} order={order} sectionKey="invitation" className="av-invitation"><span className="av-label">Lời mời</span><h2>Kính mời {guest || 'Quý khách'} đến chung vui</h2><p>{withGuest(content.invitation?.message ?? '', guest)}</p>{invitationImages.length > 0 && <div className="av-invitation-memories">{invitationImages.map((image, index) => <figure key={`${image}-${index}`}><img src={image} alt={`Khoảnh khắc cô dâu chú rể ${index + 1}`}/></figure>)}</div>}<div className="av-orbit" aria-hidden="true"/></AstralSection>
      <AstralSection active={active} order={order} sectionKey="families" className="av-families"><img className="av-families-moon" src={artwork.crescent} alt=""/><span className="av-label">Hai gia đình</span><h2>{withGuest(content.families?.title ?? '', guest)}</h2><p>{withGuest(content.families?.subtitle ?? '', guest)}</p><div className="av-family-grid">{family(content.families?.brideSide)}<div className="av-eclipse" aria-hidden="true"/>{family(content.families?.groomSide)}</div><p>{withGuest(content.families?.message ?? '', guest)}</p></AstralSection>

      <AstralSection active={active} order={order} sectionKey="countdown" className="av-countdown"><div className="av-countdown-decor" aria-hidden="true"><span className="av-countdown-decor__orbit av-countdown-decor__orbit--one"/><span className="av-countdown-decor__orbit av-countdown-decor__orbit--two"/><i className="av-countdown-decor__spark av-countdown-decor__spark--one"/><i className="av-countdown-decor__spark av-countdown-decor__spark--two"/></div><h2>Đếm ngược ngày cưới</h2><div>{time.map((value, index) => <strong key={index}><b>{String(value).padStart(2, '0')}</b><small>{['Ngày', 'Giờ', 'Phút', 'Giây'][index]}</small><img src={["/assets/images/templates/astral-vow/artwork/av-planet-terra-v1.png", "/assets/images/templates/astral-vow/artwork/av-planet-mars-v1.png", "/assets/images/templates/astral-vow/artwork/av-planet-veil-v1.png", "/assets/images/templates/astral-vow/artwork/av-planet-ringed-v2.png"][index]} alt=""/></strong>)}</div></AstralSection>
      {timelineItems.length > 0 && <AstralSection active={active} order={order} sectionKey="timeline"><h2>{withGuest(content.timeline?.title ?? '', guest)}</h2><p>{withGuest(content.timeline?.message ?? '', guest)}</p><div className="av-timeline">{timelineItems.map((item) => <article key={`${item.time}-${item.title}`}><i/><time>{withGuest(item.time, guest)}</time><h3>{withGuest(item.title, guest)}</h3><p>{withGuest(item.description, guest)}</p></article>)}</div></AstralSection>}

      <AstralSection active={active} order={order} sectionKey="venue" className="av-venue"><MapPin className="av-venue-icon" size={28}/><span className="av-label">{withGuest(content.venue?.title ?? 'Đài quan sát', guest)}</span><h2>{withGuest(content.venue?.name ?? '', guest)}</h2><p>{withGuest(content.venue?.address ?? '', guest)}</p><p>{withGuest(content.venue?.message ?? '', guest)}</p>{venueMapSrc && <div className="av-venue-map"><iframe src={venueMapSrc} title="Bản đồ địa điểm" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div>}{content.venue?.mapUrl && <a href={content.venue.mapUrl} target="_blank" rel="noreferrer">Mở bản đồ <ArrowUpRight size={17}/></a>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="gallery" className="av-gallery"><h2>{withGuest(content.gallery?.title ?? '', guest)}</h2><p>{withGuest(content.gallery?.message ?? '', guest)}</p>{galleryImages.length > 0 ? <><div className="av-gallery-deck" aria-live="polite"><button type="button" className="av-gallery-control is-prev" onClick={() => setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length)} aria-label="Ảnh trước"><CaretLeft size={20}/></button><div className="av-gallery-stage">{galleryImages.map((image, index) => { const previous = (galleryIndex - 1 + galleryImages.length) % galleryImages.length; const next = (galleryIndex + 1) % galleryImages.length; const position = index === galleryIndex ? 'is-active' : index === previous ? 'is-previous' : index === next ? 'is-next' : 'is-hidden'; return <figure key={image + '-' + index} className={position} aria-hidden={position === 'is-hidden'}><img src={image} alt={'Khoảnh khắc ' + (index + 1)}/><figcaption>0{index + 1}</figcaption></figure> })}</div><button type="button" className="av-gallery-control is-next" onClick={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)} aria-label="Ảnh tiếp theo"><CaretRight size={20}/></button></div><div className="av-gallery-dots" role="group" aria-label="Chọn ảnh">{galleryImages.map((_, index) => <button key={index} type="button" className={index === galleryIndex ? 'is-active' : ''} onClick={() => setGalleryIndex(index)} aria-label={'Xem ảnh ' + (index + 1)} aria-pressed={index === galleryIndex}/>)}</div></> : <div className="av-gallery-empty">Chưa có ảnh kỷ niệm</div>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="rsvp" className="av-rsvp"><Sparkle size={22}/><h2>{withGuest(content.rsvp?.title ?? '', guest)}</h2><p>{withGuest(content.rsvp?.message ?? '', guest)}</p>{rsvpDone || interactions?.rsvp.submitted ? <strong>{withGuest(content.rsvp?.successMessage ?? '', guest)}</strong> : <><div><button type="button" className={choice === 'ATTENDING' ? 'is-picked' : ''} onClick={() => setChoice('ATTENDING')} disabled={interactions?.rsvp.submitting}>{content.rsvp?.attendingLabel}</button><button type="button" className={choice === 'DECLINED' ? 'is-picked' : ''} onClick={() => setChoice('DECLINED')} disabled={interactions?.rsvp.submitting}>{content.rsvp?.notAttendingLabel}</button></div><button type="button" onClick={submitRsvp} disabled={!choice || interactions?.rsvp.submitting}>{interactions?.rsvp.submitting ? 'Đang gửi…' : 'Xác nhận phản hồi'}</button>{interactions?.rsvp.error && <small role="alert">{interactions.rsvp.error}</small>}</>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="guestbook" className="av-guestbook"><h2>{withGuest(content.guestbook?.title ?? '', guest)}</h2><p>{withGuest(content.guestbook?.message ?? '', guest)}</p>{wishDone || interactions?.wishes.submitted ? <strong>{withGuest(content.guestbook?.successMessage ?? '', guest)}</strong> : <><textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Gửi đôi lời yêu thương…"/><button type="button" onClick={submitWish}>Gửi lời chúc</button></>}</AstralSection>
      <AstralSection active={active} order={order} sectionKey="gift" className="av-gift"><h2>Gửi quà chúc phúc</h2><button type="button" className="av-eclipse" aria-expanded={giftOpen} aria-controls="astral-gift-panel" onClick={() => setGiftOpen((open) => !open)}><span className="av-gift-click-label">Click</span><HandTap className="av-gift-click-icon" size={18} weight="duotone"/></button><div id="astral-gift-panel" className={'av-gift-panel' + (giftOpen ? ' is-open' : '')} aria-hidden={!giftOpen}><div className="av-gift-panel__inner">{src(data?.giftQrMedia ?? content.giftQrMedia) && <img src={src(data?.giftQrMedia ?? content.giftQrMedia)} alt="Mã QR mừng cưới"/>}<small>{withGuest(content.gift?.thankYouMessage ?? '', guest)}</small></div></div></AstralSection>
      <AstralSection active={active} order={order} sectionKey="footer" className="av-footer" style={{ '--av-footer-image': footerImage ? 'url("' + footerImage + '")' : 'none' } as CSSProperties}><h2>{withGuest(content.footer?.title ?? '', guest)}</h2><p>{withGuest(content.footer?.message ?? '', guest)}</p></AstralSection>
    </div></div>}</main>
}
