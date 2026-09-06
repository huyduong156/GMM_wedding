import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  CalendarBlank,
  Check,
  Heart,
  MapPin,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import type {
  GreenHydrangeaData,
  GreenHydrangeaSectionConfig,
  GreenHydrangeaSectionKey,
} from './content'
import { greenHydrangeaFixture, greenHydrangeaSections } from './fixture'
import './green-hydrangea.css'

type Props = {
  data?: GreenHydrangeaData
  sectionConfig?: GreenHydrangeaSectionConfig
  editorMode?: boolean
}
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion(),
    visible = useInView(ref, { once: true, margin: '0px 0px -18% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={visible || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
function Title({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal className="gh-title">
      <b className="gh-hydrangea-mark" aria-hidden="true" />
      <span>{label}</span>
      <h2>{children}</h2>
      <i />
    </Reveal>
  )
}

export function GreenHydrangeaWebsite({
  data = greenHydrangeaFixture,
  sectionConfig = greenHydrangeaSections,
}: Props) {
  const enabled = new Set(sectionConfig.enabled),
    reduced = useReducedMotion(),
    [sent, setSent] = useState(false)
  const eventDate = useMemo(() => new Date('2027-04-18T16:30:00+07:00'), []),
    [remaining, setRemaining] = useState(() => Math.max(0, eventDate.getTime() - Date.now()))
  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, eventDate.getTime() - Date.now())),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [eventDate])
  const time = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ]
  const labels = ['ngày', 'giờ', 'phút', 'giây']
  const venue = data.venues ?? {
    title: data.events[0]?.venue ?? '',
    address: data.events[0]?.address ?? '',
    mapUrl: 'https://maps.google.com',
  }
  const sections: Partial<Record<GreenHydrangeaSectionKey, React.ReactNode>> = {
    hero: (
      <section id="top" className="gh-hero" data-editor-section="hero">
        <motion.img
          className="gh-hero-photo"
          src={data.hero.image}
          alt={`Ảnh cưới của ${data.hero.brideName} và ${data.hero.groomName}`}
          initial={reduced ? false : { scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4 }}
        />
        <div className="gh-hero-wash" />
        <motion.div
          className="gh-hero-copy"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span>{data.hero.eyebrow}</span>
          <h1>
            {data.hero.brideName}
            <i>&</i>
            {data.hero.groomName}
          </h1>
          <p>
            {data.hero.date}
            <br />
            {data.hero.venue}
          </p>
          <a href="#events">
            Xem ngày chung đôi <ArrowRight />
          </a>
        </motion.div>
        <img
          className="gh-botanical gh-hero-botanical"
          src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
          alt=""
        />
        <img
          className="gh-botanical gh-hero-botanical-left"
          src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
          alt=""
        />
        <div className="gh-flower-name" aria-hidden="true">
          HYDRANGEA
        </div>
      </section>
    ),
    announcement: (
      <section className="gh-note" data-editor-section="announcement">
        <img
          className="gh-botanical gh-note-flower gh-note-flower-left"
          src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
          alt=""
        />
        <Reveal>
          <span>{data.announcement.title}</span>
          <p>{data.announcement.message}</p>
        </Reveal>
        <img
          className="gh-botanical gh-note-flower gh-note-flower-right"
          src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
          alt=""
        />
      </section>
    ),
    couple: (
      <section id="couple" className="gh-section gh-couple" data-editor-section="couple">
        <Title label="Chúng mình">
          Hai tâm hồn,
          <br />
          một khu vườn
        </Title>
        <div className="gh-couple-grid">
          {[data.couple.bride, data.couple.groom].map((person, index) => (
            <Reveal className="gh-person" key={person.name} delay={index * 0.12}>
              <figure>
                <img src={person.image} alt={person.name} />
              </figure>
              <span>{person.role}</span>
              <h3>{person.name}</h3>
              <p>{person.bio}</p>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    story: (
      <section id="story" className="gh-section gh-story" data-editor-section="story">
        <Title label="Chuyện của chúng mình">
          Từng mùa xanh
          <br />
          đi qua
        </Title>
        <div className="gh-story-list">
          {data.story.map((item, index) => (
            <Reveal className="gh-story-item" key={item.year}>
              <figure>
                <img src={item.image} alt="" />
              </figure>
              <div>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              {index === 1 ? (
                <img
                  className="gh-botanical gh-story-leaf"
                  src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
                  alt=""
                />
              ) : null}
            </Reveal>
          ))}
        </div>
      </section>
    ),
    events: (
      <section id="events" className="gh-section gh-events" data-editor-section="events">
        <Title label="Save our date">Ngày mình thành đôi</Title>
        <div>
          {data.events.map((event, index) => (
            <Reveal className="gh-event" key={event.title} delay={index * 0.1}>
              <span>0{index + 1}</span>
              <div>
                <small>
                  {event.date} · {event.time}
                </small>
                <h3>{event.title}</h3>
                <p>
                  {event.venue}
                  <br />
                  {event.address}
                </p>
              </div>
              <button aria-label={`Thêm ${event.title} vào lịch`}>
                <CalendarBlank />
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    countdown: (
      <section className="gh-countdown" data-editor-section="countdown">
        <Reveal>
          <span>Cùng đếm đến ngày hoa nở</span>
          <div>
            {time.map((value, index) => (
              <p key={labels[index]}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <small>{labels[index]}</small>
              </p>
            ))}
          </div>
        </Reveal>
      </section>
    ),
    venues: (
      <section className="gh-section gh-venue" data-editor-section="venues">
        <Title label="Nơi mình gặp nhau">
          Một khu vườn
          <br />
          đang chờ
        </Title>
        <Reveal className="gh-venue-card">
          <MapPin weight="thin" />
          <div>
            <span>
              {data.events[0]?.date} · {data.events[0]?.time}
            </span>
            <h3>{venue.title}</h3>
            <p>{venue.address}</p>
            <a href={venue.mapUrl} target="_blank" rel="noreferrer">
              Mở chỉ đường <ArrowRight />
            </a>
          </div>
        </Reveal>
      </section>
    ),
    gallery: (
      <section id="gallery" className="gh-section gh-gallery" data-editor-section="gallery">
        <Title label="Một vài khung hình">Kỷ niệm dịu dàng</Title>
        <div>
          {data.gallery.map((image, index) => (
            <Reveal key={image.src} delay={index * 0.08}>
              <motion.img
                src={image.src}
                alt={image.alt}
                loading={index ? 'lazy' : undefined}
                whileHover={reduced ? undefined : { scale: 1.025 }}
              />
            </Reveal>
          ))}
        </div>
      </section>
    ),
    schedule: (
      <section className="gh-section gh-schedule" data-editor-section="schedule">
        <Title label="Trong ngày vui">Lịch trình</Title>
        <div>
          {data.schedule.map((item) => (
            <Reveal key={item.time}>
              <strong>{item.time}</strong>
              <i />
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    dressCode: (
      <section className="gh-dress" data-editor-section="dressCode">
        <Reveal>
          <span>Dress note</span>
          <h2>{data.dressCode.title}</h2>
          <p>{data.dressCode.message}</p>
          <div>
            {data.dressCode.colors.map((color) => (
              <i key={color} style={{ background: color }} />
            ))}
          </div>
        </Reveal>
      </section>
    ),
    faq: (
      <section className="gh-section gh-faq" data-editor-section="faq">
        <Title label="Trước khi đến">Một vài điều nhỏ</Title>
        <div>
          {data.faq.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <span>+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    ),
    rsvp: (
      <section id="rsvp" className="gh-rsvp" data-editor-section="rsvp">
        <img
          className="gh-botanical"
          src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
          alt=""
        />
        <Reveal>
          <span>RSVP</span>
          <h2>{sent ? 'Hẹn gặp bạn trong khu vườn' : (data.rsvp?.title ?? 'Bạn sẽ đến chứ?')}</h2>
          <p>{data.rsvp?.message}</p>
          {data.rsvp?.deadline ? <small>Hạn phản hồi: {data.rsvp.deadline}</small> : null}
          {sent ? (
            <div className="gh-success">
              <Check /> Cảm ơn bạn đã phản hồi.
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <label>
                Họ và tên
                <input required placeholder="Tên của bạn" />
              </label>
              <label>
                Lời nhắn
                <textarea rows={3} placeholder="Gửi đôi lời đến chúng mình" />
              </label>
              <button>
                Gửi phản hồi <PaperPlaneTilt />
              </button>
            </form>
          )}
        </Reveal>
      </section>
    ),
    guestbook: (
      <section className="gh-section gh-guestbook" data-editor-section="guestbook">
        <Title label="Lời thương">Từ những người thân yêu</Title>
        <div>
          {data.guestbook.map((note) => (
            <Reveal key={note.author}>
              <Heart weight="thin" />
              <p>“{note.message}”</p>
              <span>{note.author}</span>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    footer: (
      <footer className="gh-footer" data-editor-section="footer">
        <img
          className="gh-botanical"
          src="/assets/images/templates/green-hydrangea/hydrangea-corner.png"
          alt=""
        />
        <Reveal>
          <span>18 · 04 · 2027</span>
          <p>{data.footer.message}</p>
          <strong>{data.footer.signature}</strong>
        </Reveal>
      </footer>
    ),
  }
  return (
    <main className="green-hydrangea">
      <div className="gh-paper" aria-hidden="true" />
      <div className="gh-petals" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      {enabled.has('navigation') ? (
        <nav className="gh-nav" data-editor-section="navigation">
          <a href="#top" className="gh-mark">
            A <i>&</i> K
          </a>
          <div>
            <a href="#couple">Chúng mình</a>
            <a href="#story">Câu chuyện</a>
            <a href="#events">Ngày cưới</a>
            <a href="#gallery">Album</a>
          </div>
          <a className="gh-nav-cta" href="#rsvp">
            Xác nhận
          </a>
        </nav>
      ) : null}
      {sectionConfig.order
        .filter((key) => enabled.has(key) && key !== 'navigation')
        .map((key) => (
          <div key={key}>{sections[key]}</div>
        ))}
    </main>
  )
}
