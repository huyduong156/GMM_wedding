import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ForeverData, ForeverSectionConfig, ForeverSectionKey } from './content'
import { foreverFixture, foreverSections } from './fixture'
import '../../../pages/public-website/ui/forever.css'

type Props = { data?: ForeverData; sectionConfig?: ForeverSectionConfig; editorMode?: boolean }
export function ForeverWebsite({ data = foreverFixture, sectionConfig = foreverSections, editorMode = false }: Props) {
  const pageRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const visible = new Set(sectionConfig.enabled)
  const musicEnabled = visible.has('music')
  const section = (key: ForeverSectionKey, content: React.ReactNode) => visible.has(key) ? <div key={key} data-editor-section={key} data-motion="section" style={{ order: sectionConfig.order.indexOf(key) }}>{content}</div> : null
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    page.classList.add('ff-motion-ready')
    const targets = Array.from(page.querySelectorAll<HTMLElement>('[data-motion="section"]'))
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.setAttribute('data-motion-visible', 'true'))
      return () => page.classList.remove('ff-motion-ready')
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.setAttribute('data-motion-visible', 'true')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => {
      observer.disconnect()
      page.classList.remove('ff-motion-ready')
    }
  }, [])
  useEffect(() => {
    const audio = audioRef.current
    if (!musicEnabled || !data.music.autoplay || !data.music.projection?.src || !audio) return
    void audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
  }, [data.music.autoplay, data.music.projection?.src, musicEnabled])
  const musicControl = musicEnabled && data.music.projection?.src ? <div className="ff-music-control"><audio ref={audioRef} src={data.music.projection.src} loop onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} /><button type="button" aria-label={musicPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'} aria-pressed={musicPlaying} onClick={() => { const audio = audioRef.current; if (!audio) return; if (audio.paused) void audio.play().catch(() => setMusicPlaying(false)); else audio.pause() }}><span aria-hidden="true">{musicPlaying ? 'Ⅱ' : '▶'}</span><span>{musicPlaying ? 'Pause music' : 'Play music'}</span></button><span className="ff-music-title">{data.music.projection.title}</span></div> : null
  const hero = section('hero', <section className="ff-hero" id="top" data-motion-hero><img className="ff-hero-image" src={data.hero.image} alt={data.hero.imageAlt} /><div className="ff-hero-shade" /><div className="ff-hero-top" data-motion-part="top"><span>THE WEDDING OF</span><span>EST. 2026 · VIETNAM</span></div><div className="ff-hero-title" data-motion-part="title"><p>{data.hero.headline}</p><h1>{data.hero.brideName} <i>&</i> {data.hero.groomName}</h1></div><div className="ff-hero-bottom" data-motion-part="bottom"><span>{data.hero.date}<br />{data.hero.time}</span><a href="#announcement">SCROLL TO EXPLORE <span>↓</span></a><span>{data.hero.location}</span></div></section>)
  const events = section('events', <><section className="ff-date-band" aria-label="Ngày cưới"><div><span className="ff-kicker">SAVE THE DATE</span><p>{data.events.summary.weekday}</p></div><strong>{data.events.summary.date.slice(0, 2)}<span>.</span>{data.events.summary.date.slice(3, 5)}<span>.</span>{data.events.summary.date.slice(6)}</strong><div className="ff-date-right"><p>{data.events.summary.hours}</p><span>{data.events.summary.venue}</span></div></section><section className="ff-events" id="details"><div className="ff-section-heading"><span className="ff-kicker">COME AS YOU ARE</span><h2>Hẹn gặp bạn<br /><em>ở {data.hero.location}.</em></h2><p>Một ngày nhỏ, dành cho những người tụi mình thương.</p></div><div className="ff-event-grid">{data.events.items.map((event) => <article key={event.type}><span className="ff-event-index">{event.type}</span><h3>{event.title}</h3><p>{event.time} · {event.date}</p><p>{event.venue}<br />{event.address}</p><a href={event.mapUrl} target="_blank" rel="noreferrer">Mở bản đồ ↗</a></article>)}</div></section></>)
  const details = visible.has('dressCode') || visible.has('travel') ? <section className="ff-details-note" data-motion="section">
    {visible.has('dressCode') ? <div className="ff-dress-code" data-editor-section="dressCode"><div><span className="ff-kicker">WHAT TO WEAR</span><h2>{data.dressCode.heading.split('|')[0]}<br /><em>{data.dressCode.heading.split('|')[1]}</em></h2><p>{data.dressCode.message}</p></div><div className="ff-swatches" aria-label="Gợi ý màu trang phục">{data.dressCode.colors.map((color) => <i key={color} style={{ background: color }} />)}</div></div> : null}
    {visible.has('travel') ? <div className="ff-travel" data-editor-section="travel"><span className="ff-kicker">A FEW HELPFUL THINGS</span><p>{data.travel.message}</p><a href={data.travel.url} target="_blank" rel="noreferrer">{data.travel.linkLabel} ↗</a></div> : null}
  </section> : null
  const mapped: Partial<Record<ForeverSectionKey, React.ReactNode>> = {
    hero,
    announcement: <section className="ff-announcement" id="announcement"><span className="ff-kicker">A NOTE TO OUR FAVORITE PEOPLE</span><p>{data.announcement.message}</p><span className="ff-signature">{data.announcement.signature}</span></section>,
    couple: <section className="ff-intro" id="couple"><div className="ff-intro-photo"><img src={data.couple.image} alt={data.couple.imageAlt} /></div><div className="ff-intro-copy"><span className="ff-kicker">TWO PEOPLE, ONE HOME</span><h2>Chúng mình là<br /><em>{data.hero.brideName} & {data.hero.groomName}.</em></h2><p>{data.couple.bio}</p><a className="ff-text-link" href="#story">Câu chuyện của chúng mình <span>↗</span></a></div></section>,
    story: <section className="ff-story" id="story"><div className="ff-section-heading"><span className="ff-kicker">THE WAY WE GOT HERE</span><h2>Một chút về<br /><em>chúng mình.</em></h2></div><div className="ff-story-list">{data.story.map((item) => <article className="ff-story-item" key={item.year}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><span className="ff-story-mark">＋</span></article>)}</div></section>,
    events,
    countdown: <section className="ff-countdown"><span className="ff-kicker">THE DAY IS ALMOST HERE</span><p>{data.countdown.message}</p><div><strong>{data.hero.date.slice(0, 2)}</strong><span>{data.countdown.dateLabel}</span><strong>{data.countdown.time}</strong></div></section>,
    venues: <section className="ff-venue"><img src={data.venues.image} alt={data.venues.imageAlt} /><div><span className="ff-kicker">A LITTLE NOTE ON GETTING HERE</span><h2>{data.venues.heading.split('|')[0]}<br /><em>{data.venues.heading.split('|')[1]}</em></h2><p>{data.venues.note}</p><a href={data.venues.mapUrl} target="_blank" rel="noreferrer" className="ff-text-link">{data.venues.address} ↗</a></div></section>,
    gallery: <section className="ff-gallery" id="gallery"><div className="ff-gallery-heading"><div><span className="ff-kicker">LITTLE MOMENTS, KEPT</span><h2>{data.gallery.heading.split('|')[0]}<br /><em>{data.gallery.heading.split('|')[1]}</em></h2></div><span>01 — {String(data.gallery.images.length).padStart(2, '0')}</span></div><div className="ff-photo-grid">{data.gallery.images.map((image, index) => <figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>FRAME {String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div></section>,
    schedule: <section className="ff-schedule"><span className="ff-kicker">THE FLOW OF THE DAY</span><h2>{data.schedule.heading}</h2><div className="ff-schedule-list">{data.schedule.items.map((item) => <p key={`${item.time}-${item.title}`}><time>{item.time}</time><span>{item.title}</span></p>)}</div></section>,
    weddingParty: data.weddingParty.groups.length ? <section className="ff-wedding-party"><div className="ff-section-heading"><span className="ff-kicker">OUR PEOPLE</span><h2>{data.weddingParty.title ?? 'Những người đồng hành'}</h2></div><div className="ff-party-groups">{data.weddingParty.groups.map((group) => <div className="ff-party-group" key={group.id}><h3>{group.title}</h3><div>{group.members.map((member) => <article key={member.id}>{member.portraitUrl ? <img src={member.portraitUrl} alt={member.name} loading="lazy" /> : <div className="ff-party-initials" aria-hidden="true">{member.name.trim().charAt(0).toLocaleUpperCase()}</div>}<h4>{member.name}</h4>{member.role ? <span>{member.role}</span> : null}{member.biography ? <p>{member.biography}</p> : null}</article>)}</div></div>)}</div></section> : null,
    dressCode: details,
    faq: <section className="ff-faq"><div><span className="ff-kicker">GOOD TO KNOW</span><h2>Một vài điều<br /><em>bạn có thể hỏi.</em></h2></div><div className="ff-faq-list">{data.faq.items.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>,
    rsvp: <section className="ff-rsvp" id="rsvp"><span className="ff-kicker">YOUR COMPANY MEANS EVERYTHING</span><h2>{data.rsvp.heading}</h2><p>{data.rsvp.message}</p><a href="#rsvp">{data.rsvp.actionLabel} <span>↗</span></a><small>{data.rsvp.note}</small></section>,
    gift: <section className="ff-gift"><span className="ff-kicker">YOUR PRESENCE IS THE PRESENT</span><p>{data.gift.message}</p></section>,
    guestbook: <section className="ff-guestbook"><div><span className="ff-kicker">LEAVE A LITTLE LOVE</span><h2>{data.guestbook.heading}</h2></div><a href="#guestbook">{data.guestbook.actionLabel} <span>↗</span></a></section>,
    footer: <footer className="ff-footer"><span>THANK YOU FOR BEING HERE</span><p>{data.footer.message}<br /><em>{data.footer.signature}</em></p><div><span>{data.hero.brideName.toUpperCase()} & {data.hero.groomName.toUpperCase()}</span><span>{data.hero.date} · {data.hero.location.toUpperCase()}</span><a href="#top">VỀ ĐẦU TRANG ↑</a></div></footer>,
  }
  return <><main ref={pageRef} className="ff-page" data-template="forever" data-editor-mode={editorMode || undefined}>{sectionConfig.order.map((key) => key === 'travel' || !mapped[key] ? null : key === 'dressCode' ? details : section(key, mapped[key]!))}</main>{musicControl}</>
}
