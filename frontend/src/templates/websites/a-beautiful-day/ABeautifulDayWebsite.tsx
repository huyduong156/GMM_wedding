import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useSmoothTemplateScroll } from '../../../shared/lib/navigation/useSmoothInvitationScroll'
import type {
  ABeautifulDayEventReference,
  ABeautifulDayEventProjection,
  ABeautifulDayMediaReference,
  ABeautifulDayMediaProjection,
  ABeautifulDayPreviewData,
  ABeautifulDaySectionConfig,
  ABeautifulDaySectionKey,
} from './content'
import { aBeautifulDayFixture, aBeautifulDaySections } from './fixture'
import { ABeautifulDayGallery } from './ABeautifulDayGallery'
import { ABeautifulDayCountdown } from './ABeautifulDayCountdown'
import { useABDMotion, useABDMotionPreferences } from './motion'
import { ABeautifulDayForm } from './ABeautifulDayForm'
import { ABeautifulDayMusic } from './ABeautifulDayMusic'
import { eventCalendarUrl } from './calendar'
import type { PublicInteractions } from '../../../shared/lib/navigation/public-interaction-types'
import './a-beautiful-day.css'

type Props = {
  data?: ABeautifulDayPreviewData
  sectionConfig?: ABeautifulDaySectionConfig
  themeConfig?: Record<string, unknown>
  editorMode?: boolean
  interactions?: PublicInteractions
  music?: { trackId: string; url: string }
}

const requiredSections = new Set<ABeautifulDaySectionKey>([
  'navigation', 'hero', 'announcement', 'couple', 'events', 'venues', 'footer',
])

function formatDate(value: string, timezone = 'Asia/Ho_Chi_Minh') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: timezone,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatTime(value: string, timezone = 'Asia/Ho_Chi_Minh') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = 'left',
}: {
  id?: string
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
}) {
  return (
    <header className={`abd-heading abd-heading--${align}`}>
      <p className="abd-eyebrow" data-motion-variant="copy">{eyebrow}</p>
      <h2 id={id} tabIndex={-1} data-motion-variant="title" data-motion-step="1">{title}</h2>
      {intro ? <p className="abd-heading__intro" data-motion-variant="copy" data-motion-step="2">{intro}</p> : null}
    </header>
  )
}

function byId<T extends { id: string }>(items: T[], id: string | null | undefined) {
  return id ? items.find((item) => item.id === id) : undefined
}

function mediaReferenceId(reference: ABeautifulDayMediaReference) {
  if (typeof reference === 'string') return reference
  return reference?.mediaAssetId
}

function eventReferenceId(reference: ABeautifulDayEventReference) {
  return typeof reference === 'string' ? reference : reference.eventId
}

function httpsUrl(value: string | null | undefined) {
  try {
    const url = new URL(value ?? '')
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined
  } catch {
    return undefined
  }
}

function eventIsUsable(event: ABeautifulDayEventProjection | undefined): event is ABeautifulDayEventProjection {
  return Boolean(event?.isPublic)
}

function mediaIsUsable(media: ABeautifulDayMediaProjection | undefined): media is ABeautifulDayMediaProjection {
  return Boolean(media?.status === 'READY' && media.publicUrl)
}

function sectionHasContent(key: ABeautifulDaySectionKey, data: ABeautifulDayPreviewData, failedUrls: Set<string>) {
  const content = data.content
  switch (key) {
    case 'story': return content.story.milestones.length > 0
    case 'countdown': return eventIsUsable(byId(data.events, content.countdown.eventId))
    case 'gallery': return content.gallery.mediaIds.some((reference) => {
      const candidate = resolveMediaReference(data, reference, failedUrls)
      return Boolean(candidate?.altText?.trim())
    })
    case 'schedule': return content.schedule.items.some((item) => eventIsUsable(byId(data.events, item.eventId)))
    case 'weddingParty': return content.weddingParty.groups.some((group) => group.members.length > 0)
    case 'dressCode': return Boolean(content.dressCode.message?.trim() || content.dressCode.colors.length)
    case 'travel': return content.travel.items.length > 0
    case 'faq': return content.faq.items.length > 0
    case 'rsvp': return content.rsvp.eventIds.some((reference) => eventIsUsable(byId(data.events, eventReferenceId(reference))))
    case 'guestbook': return true
    case 'gift': return content.gift.accounts.some((account) => Boolean(account.ownerLabel.trim() && (account.accountNumber?.trim() || resolveMediaReference(data, account.qrMediaId, failedUrls))))
    case 'events': return content.events.eventIds.some((reference) => eventIsUsable(byId(data.events, eventReferenceId(reference))))
    case 'venues': return content.venues.eventIds.some((reference) => {
      const event = byId(data.events, eventReferenceId(reference))
      return Boolean(eventIsUsable(event) && (event.venueName || event.addressLine))
    })
    default: return true
  }
}

function resolveMediaReference(data: ABeautifulDayPreviewData, reference: ABeautifulDayMediaReference, failedUrls: Set<string>) {
  const candidate = byId(data.media, mediaReferenceId(reference))
  return mediaIsUsable(candidate) && !failedUrls.has(candidate.publicUrl) ? candidate : undefined
}

export function ABeautifulDayWebsite({
  data = aBeautifulDayFixture,
  sectionConfig = aBeautifulDaySections,
  themeConfig = {},
  editorMode = false,
  interactions,
  music,
}: Props) {
  const siteRef = useRef<HTMLElement>(null)
  const preferences = useABDMotionPreferences()
  const [galleryOpen, setGalleryOpen] = useState(false)
  const motionEnabled = !editorMode && !preferences.reduced && preferences.supported && themeConfig.motionLevel !== 'NONE'
  useSmoothTemplateScroll(motionEnabled && preferences.desktop && !galleryOpen)
  const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set())
  const imageFailed = (url: string) => setFailedUrls((previous) => new Set(previous).add(url))
  const content = data.content
  const enabled = new Set(sectionConfig.enabled)
  requiredSections.forEach((key) => enabled.add(key))
  const ordered = [...new Set([...sectionConfig.order, ...aBeautifulDaySections.order])]
    .filter((key) => !['navigation', 'hero', 'announcement', 'footer', 'music'].includes(key))
    .filter((key) => enabled.has(key) && (requiredSections.has(key) || sectionHasContent(key, data, failedUrls)))
  const visibleKeys: ABeautifulDaySectionKey[] = [
    ...(enabled.has('hero') ? ['hero' as const] : []),
    ...(enabled.has('announcement') ? ['announcement' as const] : []),
    ...ordered,
    ...(enabled.has('footer') ? ['footer' as const] : []),
  ]
  const primaryEventCandidate = byId(data.events, content.hero.primaryEventId)
  const primaryEvent = eventIsUsable(primaryEventCandidate) ? primaryEventCandidate : undefined
  const countdownCandidate = byId(data.events, content.countdown.eventId)
  const countdownEvent = eventIsUsable(countdownCandidate) ? countdownCandidate : undefined
  const venueEvents = content.venues.eventIds
    .map((reference) => byId(data.events, eventReferenceId(reference)))
    .filter(eventIsUsable)
  const selectedEvents = content.events.eventIds
    .map((reference) => byId(data.events, eventReferenceId(reference)))
    .filter(eventIsUsable)
  const getMedia = (reference: ABeautifulDayMediaReference) => resolveMediaReference(data, reference, failedUrls)
  const heroPhoto = getMedia(content.hero.heroMediaId)
  const galleryImages = content.gallery.mediaIds.map(getMedia).filter((image): image is ABeautifulDayMediaProjection => Boolean(image?.altText?.trim()))
  useABDMotion(siteRef, motionEnabled, `${visibleKeys.join(',')}:${data.media.map((image) => image.id).join(',')}:${[...failedUrls].join(',')}`)

  const sections: Record<Exclude<ABeautifulDaySectionKey, 'navigation' | 'music'>, ReactNode> = {
    hero: (
      <section className="abd-hero abd-chapter" id="hero" data-editor-section="hero" aria-labelledby="abd-hero-title">
        <figure className="abd-hero__photo-depth">
          {heroPhoto?.altText?.trim() ? <img className="abd-hero__photo" src={heroPhoto.publicUrl} alt={heroPhoto.altText} decoding="async" loading="eager" onError={() => imageFailed(heroPhoto.publicUrl)} /> : <div className="abd-hero__photo-fallback" aria-hidden="true"><span>{content.hero.brideName.slice(0, 1)}<i>&</i>{content.hero.groomName.slice(0, 1)}</span></div>}
          <figcaption className="abd-hero__copy">
            <h1 id="abd-hero-title">
              <span className="abd-hero__name" data-motion-variant="title" data-motion-step="1">{content.hero.brideName}</span>
              <i aria-hidden="true" data-motion-variant="copy" data-motion-step="2">&</i>
              <span className="abd-hero__name" data-motion-variant="title" data-motion-step="3">{content.hero.groomName}</span>
            </h1>
          </figcaption>
        </figure>
        <img className="abd-hero__floristry abd-hero__floristry--crescent" src="/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v04.webp" alt="" aria-hidden="true" decoding="async" />
        <img className="abd-hero__floristry abd-hero__floristry--cascade" src="/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v06.webp" alt="" aria-hidden="true" decoding="async" />
      </section>
    ),
    announcement: (
      <section className="abd-announcement abd-chapter" id="announcement" data-editor-section="announcement" aria-labelledby="abd-announcement-title">
        <p className="abd-eyebrow" data-motion-variant="copy">{content.announcement.title ?? 'GỬI NHỮNG NGƯỜI THƯƠNG'}</p>
        <h2 data-motion-variant="title" data-motion-step="1" id="abd-announcement-title">{content.announcement.message}</h2>
        <span data-motion-variant="copy" data-motion-step="2" className="abd-ornament-rule" aria-hidden="true" />
      </section>
    ),
    couple: (
      <section className="abd-couple abd-chapter" id="couple" data-editor-section="couple" aria-labelledby="abd-couple-title">
        <SectionHeading id="abd-couple-title" eyebrow="VỀ CHÚNG MÌNH" title="Hai người, một hành trình" />
        <div className="abd-couple__grid">
          {[content.couple.bride, content.couple.groom].map((person, index) => {
            const portrait = getMedia(person.portraitMediaId)
            return (
              <article className="abd-person" key={person.displayName}>
                <figure data-motion-variant="image" data-motion-order={index} className="abd-person__portrait">
                  {portrait ? <img src={portrait.publicUrl} alt={portrait.altText?.trim() || `Chân dung ${person.displayName}`} loading="lazy" decoding="async" onError={() => imageFailed(portrait.publicUrl)} /> : <span aria-hidden="true">{person.displayName.slice(0, 1)}</span>}
                  <figcaption>0{index + 1} / {index === 0 ? 'CÔ DÂU' : 'CHÚ RỂ'}</figcaption>
                </figure>
                <div className="abd-person__copy">
                  <h3 data-motion-variant="title" data-motion-step="1">{person.displayName}</h3>
                  {person.biography ? <p data-motion-variant="copy" data-motion-step="2">{person.biography}</p> : null}
                  {person.socialLinks?.some((link) => httpsUrl(link.url)) ? <ul data-motion-variant="copy" data-motion-step="3" className="abd-person__links">{person.socialLinks.map((link, linkIndex) => httpsUrl(link.url) ? <li key={linkIndex}><a href={httpsUrl(link.url)} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a></li> : null)}</ul> : null}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    ),
    story: (
      <section className="abd-story abd-chapter" id="story" data-editor-section="story" aria-labelledby="abd-story-title">
        <div className="abd-story__intro"><SectionHeading id="abd-story-title" eyebrow="NHỮNG CHƯƠNG ĐẦU TIÊN" title={content.story.title ?? 'Chuyện chúng mình'} intro={content.story.introduction} /><span className="abd-story__progress" aria-hidden="true"><span className="abd-story__progress-fill" /></span></div>
        <ol className="abd-story__timeline">
          {content.story.milestones.map((item, index) => {
            const candidate = getMedia(item.mediaId)
            const image = candidate?.altText?.trim() ? candidate : undefined
            return <li className={`abd-story__item ${index % 2 ? 'is-reversed' : ''}${image ? '' : ' is-text-only'}`} key={item.id}>
              <span className="abd-story__marker"><span data-motion-variant="copy">{item.date ?? `0${index + 1}`}</span></span>
              {image ? <img data-motion-variant="image" className="abd-story__image" src={image.publicUrl} alt={image.altText ?? ''} loading="lazy" decoding="async" onError={() => imageFailed(image.publicUrl)} /> : null}
              <div className="abd-story__copy"><p className="abd-eyebrow" data-motion-variant="copy">CHƯƠNG {String(index + 1).padStart(2, '0')}</p><h3 data-motion-variant="title" data-motion-step="1">{item.title}</h3><p data-motion-variant="copy" data-motion-step="2">{item.body}</p></div>
            </li>
          })}
        </ol>
      </section>
    ),
    events: (
      <section className="abd-events abd-chapter" id="events" data-editor-section="events" aria-labelledby="abd-events-title">
        <SectionHeading id="abd-events-title" eyebrow="NGÀY VUI" title={content.events.title ?? 'Lịch trình ngày cưới'} intro={content.events.introduction} />
        <div className="abd-events__list">
          {selectedEvents.map((event, index) => <article className="abd-event" key={event.id}>
            <div data-motion-variant="copy" data-motion-order={index} className="abd-event__date"><strong>{formatTime(event.startsAt, event.timezone)}</strong><span>{formatDate(event.startsAt, event.timezone)}</span></div>
            <div className="abd-event__details"><p className="abd-eyebrow" data-motion-variant="copy">SỰ KIỆN 0{index + 1}</p><h3 data-motion-variant="title" data-motion-step="1">{event.name}</h3><p data-motion-variant="copy" data-motion-step="2">{event.venueName ?? 'Địa điểm sẽ được cập nhật'}</p><address data-motion-variant="copy" data-motion-step="2">{event.addressLine}</address></div>
            <a data-motion-variant="copy" className="abd-event__calendar" href={eventCalendarUrl(event)} download="ngay-cuoi.ics">Lưu lịch <span aria-hidden="true">↗</span></a>
          </article>)}
          {selectedEvents.length === 0 ? <p className="abd-empty">Thông tin sự kiện đang được cập nhật.</p> : null}
        </div>
      </section>
    ),
    countdown: (
      <section className="abd-countdown abd-chapter" id="countdown" data-editor-section="countdown" aria-label="Ngày cưới">
        <p className="abd-eyebrow" data-motion-variant="copy">NGÀY HẸN ĐANG ĐẾN GẦN</p>
        <p data-motion-variant="title" data-motion-step="1" className="abd-countdown__date">{countdownEvent ? formatDate(countdownEvent.startsAt, countdownEvent.timezone) : 'Ngày cưới sẽ được cập nhật'}</p>
        {countdownEvent ? <ABeautifulDayCountdown startsAt={countdownEvent.startsAt} /> : null}
        <span aria-hidden="true">✳</span>
      </section>
    ),
    venues: (
      <section className="abd-venues abd-chapter" id="venues" data-editor-section="venues" aria-labelledby="abd-venues-title">
        <SectionHeading id="abd-venues-title" eyebrow="HẸN GẶP BẠN TẠI ĐÂY" title={content.venues.title ?? 'Địa điểm'} />
        <div className="abd-venues__grid">
          <div className="abd-venues__list">
            {venueEvents.map((event) => <article className="abd-venue" key={event.id}>
              <p className="abd-eyebrow" data-motion-variant="copy">{event.name}</p><h3 data-motion-variant="title" data-motion-step="1">{event.venueName ?? 'Địa điểm cưới'}</h3>
              <address data-motion-variant="copy" data-motion-step="2">{event.addressLine ?? 'Địa chỉ sẽ được cập nhật'}</address>
              {httpsUrl(event.mapUrl) ? <a href={httpsUrl(event.mapUrl)} target="_blank" rel="noreferrer">Mở bản đồ <span aria-hidden="true">↗</span></a> : null}
            </article>)}
            {venueEvents.length === 0 ? <p className="abd-empty">Địa điểm và hướng dẫn đường đi đang được cập nhật.</p> : null}
            {content.venues.travelNote ? <p data-motion-variant="copy" data-motion-step="3" className="abd-venues__note">{content.venues.travelNote}</p> : null}
          </div>
        </div>
      </section>
    ),
    gallery: (
      <section className="abd-gallery abd-chapter" id="gallery" data-editor-section="gallery" aria-labelledby="abd-gallery-title">
        <SectionHeading id="abd-gallery-title" eyebrow="ALBUM KỶ NIỆM" title={content.gallery.title ?? 'Những khoảnh khắc thân quen'} intro={content.gallery.introduction} align="center" />
        <ABeautifulDayGallery images={galleryImages} onError={imageFailed} editorMode={editorMode} onOpenChange={setGalleryOpen} />
      </section>
    ),
    schedule: (
      <section className="abd-schedule abd-chapter" id="schedule" data-editor-section="schedule" aria-labelledby="abd-schedule-title">
        <SectionHeading id="abd-schedule-title" eyebrow="TỪNG KHOẢNH KHẮC TRONG NGÀY" title={content.schedule.title ?? 'Chương trình'} />
        <ol className="abd-schedule__list">
          {content.schedule.items.filter((item) => eventIsUsable(byId(data.events, item.eventId))).sort((a, b) => {
            const eventA = byId(data.events, a.eventId)!
            const eventB = byId(data.events, b.eventId)!
            const dayA = new Intl.DateTimeFormat('en-CA', { timeZone: eventA.timezone }).format(new Date(eventA.startsAt))
            const dayB = new Intl.DateTimeFormat('en-CA', { timeZone: eventB.timezone }).format(new Date(eventB.startsAt))
            return dayA.localeCompare(dayB) || a.time.localeCompare(b.time)
          }).map((item, index) => <li key={item.id}><time data-motion-variant="copy" data-motion-order={index % 6}>{item.time}</time><span className="abd-schedule__dot" aria-hidden="true" /><div><h3 data-motion-variant="title" data-motion-step="1">{item.title}</h3>{item.detail ? <p data-motion-variant="copy" data-motion-step="2">{item.detail}</p> : null}</div></li>)}
        </ol>
      </section>
    ),
    weddingParty: (
      <section className="abd-party abd-chapter" id="wedding-party" data-editor-section="weddingParty" aria-labelledby="abd-party-title">
        <SectionHeading id="abd-party-title" eyebrow="NHỮNG NGƯỜI ĐỒNG HÀNH" title={content.weddingParty.title ?? 'Bên cạnh chúng mình'} />
        {content.weddingParty.groups.filter((group) => group.members.length > 0).map((group) => <div className="abd-party__group" key={group.id}><h3 data-motion-variant="title" data-motion-step="1">{group.title}</h3><div>{group.members.map((member, index) => {
          const portrait = getMedia(member.mediaId)
          const describedPortrait = portrait?.altText?.trim() ? portrait : undefined
          return <article className="abd-party__person" key={member.id}>{describedPortrait ? <img data-motion-variant="image" data-motion-order={index % 6} src={describedPortrait.publicUrl} alt={describedPortrait.altText ?? ''} loading="lazy" decoding="async" onError={() => imageFailed(describedPortrait.publicUrl)} /> : <span data-motion-variant="image" data-motion-order={index % 6} aria-hidden="true">{member.name.slice(0, 1)}</span>}<strong data-motion-variant="copy" data-motion-step="1">{member.name}</strong>{member.role ? <small data-motion-variant="copy" data-motion-step="2">{member.role}</small> : null}{member.biography ? <p data-motion-variant="copy" data-motion-step="2">{member.biography}</p> : null}</article>
        })}</div></div>)}
      </section>
    ),
    dressCode: (
      <section className="abd-dress abd-chapter" id="dressCode" data-editor-section="dressCode" aria-labelledby="abd-dress-title">
        <div><p className="abd-eyebrow" data-motion-variant="copy">MỘT GỢI Ý NHẸ NHÀNG</p><h2 data-motion-variant="title" data-motion-step="1" id="abd-dress-title">{content.dressCode.title ?? 'Trang phục'}</h2>{content.dressCode.message ? <p data-motion-variant="copy" data-motion-step="2">{content.dressCode.message}</p> : null}</div>
        {content.dressCode.colors.length ? <ul className="abd-dress__colors">{content.dressCode.colors.map((color, index) => <li data-motion-variant="image" data-motion-order={index % 6} key={color.id}><span style={{ '--swatch': /^#[\da-f]{6}$/i.test(color.hex) ? color.hex : 'transparent' } as CSSProperties} /><small>{color.label}</small></li>)}</ul> : null}
      </section>
    ),
    travel: (
      <section className="abd-travel abd-chapter" id="travel" data-editor-section="travel" aria-labelledby="abd-travel-title">
        <SectionHeading id="abd-travel-title" eyebrow="GỢI Ý CHO CHUYẾN ĐI" title={content.travel.title ?? 'Đến ngày vui thật thong thả'} />
        <div className="abd-travel__directory">{content.travel.items.map((item, index) => <article key={item.id}><span data-motion-variant="copy" data-motion-order={index % 6}>0{index + 1}</span><div><p className="abd-eyebrow" data-motion-variant="copy">{{ HOTEL: 'LƯU TRÚ', TRANSPORT: 'DI CHUYỂN', PARKING: 'ĐẬU XE', OTHER: 'THÔNG TIN' }[item.type]}</p><h3 data-motion-variant="title" data-motion-step="1">{item.title}</h3><p data-motion-variant="copy" data-motion-step="2">{item.detail}</p>{httpsUrl(item.url) ? <a href={httpsUrl(item.url)} target="_blank" rel="noreferrer">Xem thêm ↗</a> : null}</div></article>)}</div>
      </section>
    ),
    faq: (
      <section className="abd-faq abd-chapter" id="faq" data-editor-section="faq" aria-labelledby="abd-faq-title">
        <SectionHeading id="abd-faq-title" eyebrow="THÔNG TIN HỮU ÍCH" title={content.faq.title ?? 'Bạn có thể đang thắc mắc'} />
        <div className="abd-faq__list">{content.faq.items.map((item, index) => <details key={item.id}><summary data-motion-variant="copy" data-motion-order={index % 6}><span>{String(index + 1).padStart(2, '0')}</span>{item.question}<b aria-hidden="true">+</b></summary><p data-motion-variant="copy" data-motion-step="2">{item.answer}</p></details>)}</div>
      </section>
    ),
    rsvp: (
      <section className="abd-rsvp abd-chapter" id="rsvp" data-editor-section="rsvp" aria-labelledby="abd-rsvp-title">
        <div className="abd-rsvp__copy"><p className="abd-eyebrow" data-motion-variant="copy">HỒI ÂM TRƯỚC NGÀY VUI</p><h2 data-motion-variant="title" data-motion-step="1" id="abd-rsvp-title">{content.rsvp.title ?? 'Bạn sẽ đến chứ?'}</h2><p data-motion-variant="copy" data-motion-step="2">{content.rsvp.message}</p>{content.rsvp.deadline ? <small>Vui lòng phản hồi trước {formatDate(content.rsvp.deadline)}</small> : null}</div>
        <ABeautifulDayForm kind="rsvp" guestName={data.guestName ?? interactions?.guestName} interactions={interactions} editorMode={editorMode} />
      </section>
    ),
    guestbook: (
      <section className="abd-guestbook abd-chapter" id="guestbook" data-editor-section="guestbook" aria-labelledby="abd-guestbook-title">
        <div className="abd-guestbook__intro"><SectionHeading id="abd-guestbook-title" eyebrow="NHỮNG LỜI THƯƠNG" title={content.guestbook.title ?? 'Gửi chúng mình một lời chúc'} intro={content.guestbook.message} /></div>
        <div className="abd-guestbook__content">
          {(interactions?.wishes.items.length ? interactions.wishes.items : data.approvedWishes).length ? <ul>{(interactions?.wishes.items.length ? interactions.wishes.items : data.approvedWishes).map((wish, index) => <li key={wish.id}><blockquote data-motion-variant="copy" data-motion-order={index % 6}>“{wish.content}”</blockquote><cite data-motion-variant="copy" data-motion-step="1">{wish.authorName}</cite></li>)}</ul> : <p className="abd-guestbook__empty">Lời chúc của bạn sẽ là một phần thật đẹp trong ngày vui.</p>}
          <ABeautifulDayForm kind="wish" guestName={data.guestName ?? interactions?.guestName} interactions={interactions} editorMode={editorMode} />
        </div>
      </section>
    ),
    gift: (
      <section className="abd-gift abd-chapter" id="gift" data-editor-section="gift" aria-labelledby="abd-gift-title">
        <p className="abd-eyebrow" data-motion-variant="copy">MỪNG VUI NGÀY CƯỚI</p><h2 data-motion-variant="title" data-motion-step="1" id="abd-gift-title">{content.gift.title ?? 'Một lời chúc là đủ đầy'}</h2>{content.gift.message ? <p data-motion-variant="copy" data-motion-step="2">{content.gift.message}</p> : null}
        <div className="abd-gift__accounts">{content.gift.accounts.filter((account) => account.ownerLabel.trim() && (account.accountNumber?.trim() || getMedia(account.qrMediaId))).map((account) => {
          const qr = getMedia(account.qrMediaId)
          return <article key={account.id}><h3 data-motion-variant="title" data-motion-step="1">{account.ownerLabel}</h3>{account.bankName ? <p data-motion-variant="copy" data-motion-step="2">{account.bankName}</p> : null}{account.accountNumber ? <p data-motion-variant="copy" data-motion-step="2">Tài khoản: {account.accountNumber}</p> : null}{qr ? <img src={qr.publicUrl} alt={`Mã QR mừng cưới của ${account.ownerLabel}`} loading="lazy" decoding="async" onError={() => imageFailed(qr.publicUrl)} /> : null}</article>
        })}</div>
      </section>
    ),
    footer: (
      <footer className="abd-footer abd-chapter" id="footer" data-editor-section="footer" aria-labelledby="abd-footer-title">
        <img className="abd-footer__approved-floristry" src="/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v05.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <p className="abd-eyebrow" data-motion-variant="copy">MỘT KHỞI ĐẦU THẬT ĐẸP</p><h2 data-motion-variant="title" data-motion-step="1" id="abd-footer-title">{content.footer.message}</h2>{content.footer.signature ? <p data-motion-variant="copy" data-motion-step="2" className="abd-footer__signature">{content.footer.signature}</p> : null}
        {primaryEvent ? <p data-motion-variant="copy" data-motion-step="3" className="abd-footer__date">{formatDate(primaryEvent.startsAt, primaryEvent.timezone)}</p> : null}
      </footer>
    ),
  }

  const visibleVisualKeys = visibleKeys.filter((key) => key !== 'navigation' && key !== 'music')

  return (
    <main ref={siteRef} className={`abd-site${editorMode ? ' is-editor' : ''}${galleryOpen ? ' is-gallery-open' : ''}${motionEnabled ? ' has-motion' : ''}`}>
      <div className="abd-lantern-canopy" aria-hidden="true">
        <div className="abd-lantern-unit abd-lantern-unit--round"><img className="abd-lantern" src="/assets/images/templates/a-beautiful-day/decor/abd-lantern-round-v02.webp" alt="" decoding="async" /></div>
        <div className="abd-lantern-unit abd-lantern-unit--round-rear"><img className="abd-lantern" src="/assets/images/templates/a-beautiful-day/decor/abd-lantern-round-v02.webp" alt="" decoding="async" /></div>
        <div className="abd-lantern-unit abd-lantern-unit--column"><img className="abd-lantern" src="/assets/images/templates/a-beautiful-day/decor/abd-lantern-column-v02.webp" alt="" decoding="async" /></div>
        <div className="abd-lantern-unit abd-lantern-unit--oval-rear"><img className="abd-lantern" src="/assets/images/templates/a-beautiful-day/decor/abd-lantern-oval-v02.webp" alt="" decoding="async" /></div>
        <div className="abd-lantern-unit abd-lantern-unit--oval"><img className="abd-lantern" src="/assets/images/templates/a-beautiful-day/decor/abd-lantern-oval-v02.webp" alt="" decoding="async" /></div>
      </div>
      <div className="abd-site__content">
        {visibleVisualKeys.map((key) => <div className={`abd-section-wrap abd-section-wrap--${key}`} key={key}>{sections[key as Exclude<ABeautifulDaySectionKey, 'navigation' | 'music'>]}</div>)}
      </div>
      {!editorMode && enabled.has('music') && music?.trackId === content.music.musicTrackId && httpsUrl(music?.url) ? <ABeautifulDayMusic key={music.url} url={httpsUrl(music.url)!} title={content.music.musicTrackName} /> : null}
    </main>
  )
}
