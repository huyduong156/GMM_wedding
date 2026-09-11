import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  CalendarBlank,
  Clock,
  EnvelopeSimple,
  Gift,
  Heart,
  MapPin,
  MusicNote,
  Sparkle,
} from '@phosphor-icons/react'

import { roseGardenFixture, roseGardenSectionConfig } from './fixture'
import {
  type RoseGardenData,
  type RoseGardenFamilySide,
  type RoseGardenMedia,
  type RoseGardenSectionConfig,
  type RoseGardenSectionKey,
} from './RoseGardenTypes'
import './rose-garden.css'

type ResolvedData = {
  couple: { brideName: string; groomName: string }
  event: { weddingDate: string; time: string; venueName: string; venueAddress: string; mapUrl: string }
  opening: { title: string; message: string }
  openingMediaBack: RoseGardenMedia | null
  openingMediaFront: RoseGardenMedia | null
  cover: { eyebrow: string; title: string; message: string }
  heroMedia: RoseGardenMedia | null
  invitation: { title: string; message: string }
  invitationMemoryImage1: string | RoseGardenMedia
  invitationMemoryImage2: string | RoseGardenMedia
  invitationMemoryImage3: string | RoseGardenMedia
  families: {
    title: string
    subtitle: string
    message: string
    brideSide: Required<RoseGardenFamilySide>
    groomSide: Required<RoseGardenFamilySide>
  }
  eventDetails: { title: string; date: string; time: string; calendarUrl: string; message: string }
  eventDetailsMedia: RoseGardenMedia | null
  countdown: { enabled: boolean }
  timeline: { items: NonNullable<NonNullable<RoseGardenData['timeline']>['items']> }
  venue: { title: string; name: string; address: string; mapUrl: string; message: string }
  gallery: { title: string; message: string }
  galleryImages: Array<string | RoseGardenMedia>
  rsvp: {
    title: string
    message: string
    deadline: string
    successMessage: string
    attendingLabel: string
    notAttendingLabel: string
  }
  guestbook: { title: string; message: string; successMessage: string }
  gift: { title: string; message: string; thankYouMessage: string }
  giftQrMedia: RoseGardenMedia | null
  music: { backgroundMusicUrl: string; backgroundMusicName: string; backgroundMusicAutoplay: boolean }
  footer: { title: string; message: string }
  footerMedia: RoseGardenMedia | null
}

const artworkRoot = '/assets/images/templates/rose-garden/artwork-drafts'
const rendererDecor = {
  openingClosed: `${artworkRoot}/rg-opening-closed-card.png`,
  openingInner: `${artworkRoot}/rg-opening-inner-card.png`,
  openingTriangle: `${artworkRoot}/rg-opening-triangle-flap.png`,
  openingFront: `${artworkRoot}/rg-opening-front-frame.png`,
  botanical: `${artworkRoot}/rg-botanical-cluster-v1.png`,
  envelope: `${artworkRoot}/rg-garden-envelope-vignette-v1.png`,
  divider: `${artworkRoot}/rg-pressed-flower-divider.png`,
  giftCharm: `${artworkRoot}/rg-gift-botanical-charm.png`,
}
const sectionKeys: RoseGardenSectionKey[] = roseGardenSectionConfig.order

function mediaSource(value: string | RoseGardenMedia | null | undefined): string {
  return typeof value === 'string' ? value : value?.src ?? ''
}

function personalize(value: string, guestName?: string | null): string {
  return value.split('{guestName}').join(guestName?.trim() || 'Quý khách')
}

function resolveSide(
  side: RoseGardenFamilySide | undefined,
  fallback: RoseGardenFamilySide,
): Required<RoseGardenFamilySide> {
  return {
    label: side?.label ?? fallback.label ?? '',
    father: side?.father ?? fallback.father ?? '',
    mother: side?.mother ?? fallback.mother ?? '',
    address: side?.address ?? fallback.address ?? '',
  }
}

function resolveData(data?: RoseGardenData): ResolvedData {
  const fallback = roseGardenFixture
  return {
    couple: {
      brideName: data?.couple?.brideName ?? fallback.couple?.brideName ?? '',
      groomName: data?.couple?.groomName ?? fallback.couple?.groomName ?? '',
    },
    event: {
      weddingDate: data?.event?.weddingDate ?? fallback.event?.weddingDate ?? '',
      time: data?.event?.time ?? fallback.event?.time ?? '',
      venueName: data?.event?.venueName ?? fallback.event?.venueName ?? '',
      venueAddress: data?.event?.venueAddress ?? fallback.event?.venueAddress ?? '',
      mapUrl: data?.event?.mapUrl ?? fallback.event?.mapUrl ?? '',
    },
    opening: {
      title: data?.opening?.title ?? fallback.opening?.title ?? '',
      message: data?.opening?.message ?? fallback.opening?.message ?? '',
    },
    openingMediaBack: data?.openingMediaBack === undefined ? fallback.openingMediaBack ?? null : data.openingMediaBack,
    openingMediaFront: data?.openingMediaFront === undefined ? fallback.openingMediaFront ?? null : data.openingMediaFront,
    cover: {
      eyebrow: data?.cover?.eyebrow ?? fallback.cover?.eyebrow ?? '',
      title: data?.cover?.title ?? fallback.cover?.title ?? '',
      message: data?.cover?.message ?? fallback.cover?.message ?? '',
    },
    heroMedia: data?.heroMedia === undefined ? fallback.heroMedia ?? null : data.heroMedia,
    invitation: {
      title: data?.invitation?.title ?? fallback.invitation?.title ?? '',
      message: data?.invitation?.message ?? fallback.invitation?.message ?? '',
    },
    invitationMemoryImage1: data?.invitationMemoryImage1 ?? fallback.invitationMemoryImage1 ?? '',
    invitationMemoryImage2: data?.invitationMemoryImage2 ?? fallback.invitationMemoryImage2 ?? '',
    invitationMemoryImage3: data?.invitationMemoryImage3 ?? fallback.invitationMemoryImage3 ?? '',
    families: {
      title: data?.families?.title ?? fallback.families?.title ?? '',
      subtitle: data?.families?.subtitle ?? fallback.families?.subtitle ?? '',
      message: data?.families?.message ?? fallback.families?.message ?? '',
      brideSide: resolveSide(data?.families?.brideSide, fallback.families?.brideSide ?? {}),
      groomSide: resolveSide(data?.families?.groomSide, fallback.families?.groomSide ?? {}),
    },
    eventDetails: {
      title: data?.eventDetails?.title ?? fallback.eventDetails?.title ?? '',
      date: data?.eventDetails?.date ?? fallback.eventDetails?.date ?? '',
      time: data?.eventDetails?.time ?? fallback.eventDetails?.time ?? '',
      calendarUrl: data?.eventDetails?.calendarUrl ?? fallback.eventDetails?.calendarUrl ?? '',
      message: data?.eventDetails?.message ?? fallback.eventDetails?.message ?? '',
    },
    eventDetailsMedia: data?.eventDetailsMedia === undefined ? fallback.eventDetailsMedia ?? null : data.eventDetailsMedia,
    countdown: { enabled: data?.countdown?.enabled ?? fallback.countdown?.enabled ?? true },
    timeline: { items: data?.timeline?.items ?? fallback.timeline?.items ?? [] },
    venue: {
      title: data?.venue?.title ?? fallback.venue?.title ?? '',
      name: data?.venue?.name ?? fallback.venue?.name ?? '',
      address: data?.venue?.address ?? fallback.venue?.address ?? '',
      mapUrl: data?.venue?.mapUrl ?? fallback.venue?.mapUrl ?? '',
      message: data?.venue?.message ?? fallback.venue?.message ?? '',
    },
    gallery: {
      title: data?.gallery?.title ?? fallback.gallery?.title ?? '',
      message: data?.gallery?.message ?? fallback.gallery?.message ?? '',
    },
    galleryImages: data?.galleryImages ?? data?.gallery?.images ?? fallback.galleryImages ?? [],
    rsvp: {
      title: data?.rsvp?.title ?? fallback.rsvp?.title ?? '',
      message: data?.rsvp?.message ?? fallback.rsvp?.message ?? '',
      deadline: data?.rsvp?.deadline ?? fallback.rsvp?.deadline ?? '',
      successMessage: data?.rsvp?.successMessage ?? fallback.rsvp?.successMessage ?? '',
      attendingLabel: data?.rsvp?.attendingLabel ?? fallback.rsvp?.attendingLabel ?? '',
      notAttendingLabel: data?.rsvp?.notAttendingLabel ?? fallback.rsvp?.notAttendingLabel ?? '',
    },
    guestbook: {
      title: data?.guestbook?.title ?? fallback.guestbook?.title ?? '',
      message: data?.guestbook?.message ?? fallback.guestbook?.message ?? '',
      successMessage: data?.guestbook?.successMessage ?? fallback.guestbook?.successMessage ?? '',
    },
    gift: {
      title: data?.gift?.title ?? fallback.gift?.title ?? '',
      message: data?.gift?.message ?? fallback.gift?.message ?? '',
      thankYouMessage: data?.gift?.thankYouMessage ?? fallback.gift?.thankYouMessage ?? '',
    },
    giftQrMedia: data?.giftQrMedia === undefined ? fallback.giftQrMedia ?? null : data.giftQrMedia,
    music: {
      backgroundMusicUrl: data?.music?.backgroundMusicUrl ?? fallback.music?.backgroundMusicUrl ?? '',
      backgroundMusicName: data?.music?.backgroundMusicName ?? fallback.music?.backgroundMusicName ?? '',
      backgroundMusicAutoplay: data?.music?.backgroundMusicAutoplay ?? fallback.music?.backgroundMusicAutoplay ?? false,
    },
    footer: {
      title: data?.footer?.title ?? fallback.footer?.title ?? '',
      message: data?.footer?.message ?? fallback.footer?.message ?? '',
    },
    footerMedia: data?.footerMedia === undefined ? fallback.footerMedia ?? null : data.footerMedia,
  }
}

function SectionFrame({
  sectionKey,
  order,
  className,
  children,
}: {
  sectionKey: RoseGardenSectionKey
  order: number
  className: string
  children: ReactNode
}) {
  return (
    <section
      className={`rg-body-section ${className}`}
      data-editor-section={sectionKey}
      data-section-layout={className.replace('rg-', '')}
      style={{ order } as CSSProperties}
    >
      {children}
    </section>
  )
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <span className="rg-eyebrow">{children}</span>
}

function Artwork({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img className={className} src={src} alt={alt} loading="lazy" />
}

function EmptyArtwork({ label }: { label: string }) {
  return <div className="rg-empty-artwork" aria-label={label}>{label}</div>
}

function FamilySide({ side }: { side: Required<RoseGardenFamilySide> }) {
  return (
    <div className="rg-family-side">
      {side.label ? <span>{side.label}</span> : null}
      {side.father ? <strong>{side.father}</strong> : null}
      {side.mother ? <strong>{side.mother}</strong> : null}
      {side.address ? <small>{side.address}</small> : null}
    </div>
  )
}

export function RoseGardenRenderer({
  data,
  sectionConfig,
  editorMode = false,
  guestName,
}: {
  data?: RoseGardenData
  sectionConfig?: RoseGardenSectionConfig
  editorMode?: boolean
  guestName?: string | null
}) {
  const content = resolveData(data)
  const [opened, setOpened] = useState(editorMode)
  const enabled = new Set(sectionConfig?.enabled ?? sectionKeys)
  const requestedOrder = sectionConfig?.order?.length ? sectionConfig.order : sectionKeys
  const order = [...new Set([...requestedOrder, ...sectionKeys])].filter((key) => enabled.has(key))
  const sectionOrder = (key: RoseGardenSectionKey) => order.indexOf(key)
  const memoryImages = [
    mediaSource(content.invitationMemoryImage1),
    mediaSource(content.invitationMemoryImage2),
    mediaSource(content.invitationMemoryImage3),
  ]
  const galleryImages = content.galleryImages.map(mediaSource).filter(Boolean)
  const openingInnerAsset = mediaSource(content.openingMediaBack) || rendererDecor.openingInner
  const openingFrontAsset = mediaSource(content.openingMediaFront) || rendererDecor.openingFront
  const glints = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const random = Math.random
        const isRight = index % 2 === 1
        return {
          id: index,
          left: `${isRight ? 66 + random() * 29 : 5 + random() * 29}%`,
          top: `${8 + random() * 84}%`,
          size: `${3 + Math.round(random() * 2)}px`,
          delay: `${-(random() * 6).toFixed(2)}s`,
          duration: `${(4.2 + random() * 2.8).toFixed(2)}s`,
        }
      }),
    [],
  )

  const renderSection = (key: RoseGardenSectionKey) => {
    const sectionIndex = sectionOrder(key)
    switch (key) {
      case 'cover':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-cover">
            <div className="rg-cover-art">
              {content.heroMedia?.src ? (
                <Artwork src={content.heroMedia.src} alt={content.heroMedia.alt || 'Ảnh bìa thiệp'} className="rg-user-media" />
              ) : (
                <EmptyArtwork label="Ảnh bìa thiệp · Chưa tải ảnh" />
              )}
              <Artwork src={rendererDecor.envelope} alt="" className="rg-cover-decor" />
              <span className="rg-cover-art-index">01 / 14</span>
            </div>
            <div className="rg-cover-copy">
              <SectionEyebrow>{content.cover.eyebrow}</SectionEyebrow>
              <h2>{content.cover.title}</h2>
              <p>{content.cover.message}</p>
              <div className="rg-name-lockup"><strong>{content.couple.brideName}</strong><i>&amp;</i><strong>{content.couple.groomName}</strong></div>
              <span className="rg-date-line">{content.event.weddingDate}</span>
            </div>
          </SectionFrame>
        )
      case 'invitation':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-invitation-letter">
            <div className="rg-section-number">02 <span>/ 14</span></div>
            <SectionEyebrow>Lời mời từ khu vườn</SectionEyebrow>
            <h2>{personalize(content.invitation.title, guestName)}</h2>
            <p className="rg-lead">{personalize(content.invitation.message, guestName)}</p>
            <div className="rg-memory-triptych">
              {memoryImages.map((src, index) => (
                <figure key={`${src}-${index}`} className={`rg-memory-card rg-memory-card-${index + 1}`}>
                  {src ? <Artwork src={src} alt={`Khoảnh khắc của cô dâu chú rể ${index + 1}`} className="rg-user-media" /> : <EmptyArtwork label={`Ảnh ký ức ${index + 1} · Chưa tải ảnh`} />}
                  <figcaption>mảnh vườn {String(index + 1).padStart(2, '0')}</figcaption>
                </figure>
              ))}
            </div>
            <Artwork src={rendererDecor.botanical} alt="" className="rg-letter-decor" />
          </SectionFrame>
        )
      case 'families':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-families">
            <div className="rg-section-number">03 <span>/ 14</span></div>
            <SectionEyebrow>Hai bên gia đình</SectionEyebrow>
            <h2>{content.families.title}</h2>
            <p className="rg-family-subtitle">{content.families.subtitle}</p>
            <p className="rg-family-message">{personalize(content.families.message, guestName)}</p>
            <div className="rg-family-columns"><FamilySide side={content.families.brideSide} /><span className="rg-family-ampersand">&amp;</span><FamilySide side={content.families.groomSide} /></div>
          </SectionFrame>
        )
      case 'eventDetails':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-event-details">
            <div className="rg-section-number">04 <span>/ 14</span></div>
            <div className="rg-event-stamp" aria-hidden="true"><CalendarBlank weight="thin" /><span>save the date</span></div>
            <SectionEyebrow>Ngày vui của chúng mình</SectionEyebrow>
            <h2>{content.eventDetails.title}</h2>
            <div className="rg-event-date">{content.eventDetails.date}</div>
            <div className="rg-event-time"><Clock /> {content.eventDetails.time}</div>
            <p>{content.eventDetails.message}</p>
            {content.eventDetailsMedia?.src ? (
              <Artwork src={content.eventDetailsMedia.src} alt={content.eventDetailsMedia.alt || 'Ảnh thời gian hôn lễ'} className="rg-event-divider rg-user-media" />
            ) : (
              <Artwork src={rendererDecor.divider} alt="" className="rg-event-divider rg-section-decor" />
            )}
            {content.eventDetails.calendarUrl ? <a className="rg-text-link" href={content.eventDetails.calendarUrl} target="_blank" rel="noreferrer"><CalendarBlank /> Thêm vào lịch <ArrowUpRight /></a> : null}
          </SectionFrame>
        )
      case 'countdown':
        return content.countdown.enabled ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-countdown">
            <SectionEyebrow>Đếm ngược ngày vui</SectionEyebrow>
            <div className="rg-countdown-rule"><span /><Heart weight="fill" /><span /></div>
            <h2>Hẹn gặp nhau sau</h2>
            <div className="rg-countdown-placeholder" aria-label="Đếm ngược đến ngày cưới"><strong>{content.event.weddingDate}</strong><span>Đếm ngược sẽ tự lấy từ ngày cưới khi kết nối dữ liệu sự kiện.</span></div>
          </SectionFrame>
        ) : null
      case 'timeline':
        return content.timeline.items.length ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-timeline">
            <div className="rg-section-number">05 <span>/ 14</span></div>
            <SectionEyebrow>Nhịp ngày chung đôi</SectionEyebrow>
            <h2>Một ngày, những khoảnh khắc đáng nhớ</h2>
            <ol>{content.timeline.items.map((item, index) => {
              const imageSrc = mediaSource(item.image)
              return (
                <li key={`${item.time}-${item.title}-${index}`}>
                  <time>{item.time}</time>
                  <span className="rg-timeline-node">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    {imageSrc ? <Artwork src={imageSrc} alt={`Ảnh mốc thời gian ${item.title || index + 1}`} className="rg-timeline-media rg-user-media" /> : null}
                  </div>
                </li>
              )
            })}</ol>
          </SectionFrame>
        ) : null
      case 'venue':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-venue">
            <div className="rg-section-number">06 <span>/ 14</span></div>
            <div className="rg-venue-pin"><MapPin weight="fill" /></div>
            <SectionEyebrow>Địa điểm hôn lễ</SectionEyebrow>
            <h2>{content.venue.title}</h2><strong>{content.venue.name}</strong><p>{content.venue.address}</p><p className="rg-muted-copy">{content.venue.message}</p>
            {content.venue.mapUrl ? <a className="rg-text-link" href={content.venue.mapUrl} target="_blank" rel="noreferrer">Mở Google Maps <ArrowUpRight /></a> : null}
          </SectionFrame>
        )
      case 'gallery':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-gallery">
            <SectionEyebrow>Album của chúng mình</SectionEyebrow><h2>{content.gallery.title}</h2><p>{content.gallery.message}</p>
            {galleryImages.length ? (
              <div className="rg-gallery-rail">{galleryImages.map((src, index) => <figure key={`${src}-${index}`}><Artwork src={src} alt={`Khoảnh khắc trong album ${index + 1}`} className="rg-user-media" /><figcaption>0{index + 1}</figcaption></figure>)}</div>
            ) : (
              <div className="rg-gallery-empty">
                <Artwork src={rendererDecor.giftCharm} alt="" className="rg-gallery-decor" />
                <span>Ảnh album sẽ xuất hiện tại đây sau khi tải lên.</span>
              </div>
            )}
          </SectionFrame>
        )
      case 'rsvp':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-rsvp">
            <div className="rg-section-number">07 <span>/ 14</span></div><SectionEyebrow>Phản hồi trước {content.rsvp.deadline}</SectionEyebrow><h2>{content.rsvp.title}</h2><p>{content.rsvp.message}</p>
            <div className="rg-rsvp-choices" role="group" aria-label="Lựa chọn tham dự"><span>{content.rsvp.attendingLabel}</span><span>{content.rsvp.notAttendingLabel}</span></div>
            <div className="rg-form-placeholder">Form xác nhận tham dự sẽ kết nối với lời mời của khách.</div>
          </SectionFrame>
        )
      case 'guestbook':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-guestbook">
            <div className="rg-section-number">08 <span>/ 14</span></div><EnvelopeSimple className="rg-guestbook-icon" weight="thin" /><SectionEyebrow>Sổ lưu bút</SectionEyebrow><h2>{content.guestbook.title}</h2><p>{content.guestbook.message}</p>
            <div className="rg-wish-placeholder"><Heart weight="fill" /><span>Những lời chúc đã duyệt sẽ xuất hiện tại đây.</span></div>
          </SectionFrame>
        )
      case 'gift':
        return (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-gift">
            <div className="rg-section-number">09 <span>/ 14</span></div><Gift className="rg-gift-icon" weight="thin" /><SectionEyebrow>{content.gift.title}</SectionEyebrow><p>{content.gift.message}</p>
            <div className="rg-qr-placeholder">{content.giftQrMedia?.src ? <Artwork src={content.giftQrMedia.src} alt="Mã QR mừng cưới" className="rg-user-media" /> : <span>QR</span>}</div>{content.gift.thankYouMessage ? <p className="rg-muted-copy">{content.gift.thankYouMessage}</p> : null}
          </SectionFrame>
        )
      case 'music':
        return content.music.backgroundMusicUrl || editorMode ? (
          <SectionFrame key={key} sectionKey={key} order={sectionIndex} className="rg-music">
           <div className="rg-music-disc"><MusicNote weight="duotone" /></div><div><SectionEyebrow>Nhạc nền</SectionEyebrow><strong>{content.music.backgroundMusicName || 'Chọn một bài hát cho khu vườn'}</strong></div><span className="rg-music-state">{content.music.backgroundMusicUrl ? 'Sẵn sàng' : 'Chưa chọn'}</span>
          </SectionFrame>
        ) : null
      case 'footer':
        return <footer key={key} className="rg-body-section rg-footer" data-editor-section={key} style={{ order: sectionIndex } as CSSProperties}><Sparkle weight="duotone" /><SectionEyebrow>{content.footer.title}</SectionEyebrow><h2>{content.couple.brideName} <i>&amp;</i> {content.couple.groomName}</h2><p>{content.footer.message}</p>{content.footerMedia?.src ? <Artwork src={content.footerMedia.src} alt={content.footerMedia.alt || 'Ảnh cuối thiệp'} className="rg-footer-media rg-user-media" /> : null}<span className="rg-footer-date">{content.event.weddingDate}</span></footer>
      default:
        return null
    }
  }

  return (
    <div className="rg-page">
      <div className="rg-backdrop" aria-hidden="true">{glints.map((glint) => <i key={glint.id} className="rg-glint" style={{ left: glint.left, top: glint.top, width: glint.size, height: glint.size, animationDelay: glint.delay, animationDuration: glint.duration }} />)}</div>
      <main className={`rg-invitation ${opened ? 'is-opened' : 'is-closed'}`} aria-label="Thiệp cưới Rose Garden">
        <div className="rg-invitation-decor rg-invitation-decor-top" aria-hidden="true" /><div className="rg-invitation-decor rg-invitation-decor-bottom" aria-hidden="true" />
        <SectionFrame sectionKey="opening" order={sectionOrder('opening')} className="rg-opening">
          <div className={`rg-opening-stage ${opened ? 'is-opened' : ''}`}>
            <img className="rg-opening-layer rg-opening-layer-inner" src={openingInnerAsset} alt="" /><img className="rg-opening-layer rg-opening-layer-triangle" src={rendererDecor.openingTriangle} alt="" /><img className="rg-opening-layer rg-opening-layer-front" src={openingFrontAsset} alt="" /><img className="rg-opening-layer rg-opening-layer-closed" src={rendererDecor.openingClosed} alt="" />
            <div className="rg-opening-card-copy"><span>Rose Garden · 2026</span><strong>{content.couple.brideName} <i>&amp;</i> {content.couple.groomName}</strong></div>
          </div>
          <div className="rg-opening-copy"><SectionEyebrow>Rose Garden</SectionEyebrow><h1>{content.opening.title}</h1><p>{personalize(content.opening.message, guestName)}</p><button type="button" className="rg-opening-trigger" onClick={() => setOpened(true)} aria-expanded={opened}><ArrowDown /> {opened ? 'Thiệp đã mở' : 'Chạm để mở thiệp'}</button></div>
        </SectionFrame>
        {sectionKeys.filter((key) => key !== 'opening' && order.includes(key)).map(renderSection)}
      </main>
    </div>
  )
}
