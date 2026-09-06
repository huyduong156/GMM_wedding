import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowDown,
  ArrowRight,
  CalendarBlank,
  Check,
  Gift,
  Heart,
  MapPin,
  MusicNote,
  PaperPlaneTilt,
  Pause,
  Play,
  Quotes,
} from '@phosphor-icons/react'
import type {
  EditorialVowsData,
  EditorialVowsSectionConfig,
  EditorialVowsSectionKey,
} from './content'
import { editorialVowsFixture, editorialVowsSections } from './fixture'
import './editorial-vows.css'

type Props = {
  data?: EditorialVowsData
  sectionConfig?: EditorialVowsSectionConfig
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
    reduced = useReducedMotion()
  const visible = useInView(ref, { once: true, amount: 0.24, margin: '0px 0px -24% 0px' })
  return (
    <motion.div
      ref={ref}
      className={`ev-reveal ${className}`}
      initial={reduced ? false : { opacity: 0, y: 34, filter: 'blur(7px)' }}
      animate={visible || reduced ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.85, delay, ease: [0.2, 0.75, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({
  index,
  eyebrow,
  children,
}: {
  index: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <Reveal className="ev-section-title">
      <span>{index}</span>
      <div>
        <small>{eyebrow}</small>
        <h2>{children}</h2>
      </div>
    </Reveal>
  )
}

export function EditorialVowsWebsite({
  data = editorialVowsFixture,
  sectionConfig = editorialVowsSections,
  editorMode = false,
}: Props) {
  const enabled = new Set(sectionConfig.enabled),
    reduced = useReducedMotion()
  const [navOpen, setNavOpen] = useState(false),
    [playing, setPlaying] = useState(false),
    [sent, setSent] = useState(false)
  const eventDate = useMemo(() => new Date('2026-12-20T18:00:00+07:00'), [])
  const [remaining, setRemaining] = useState(() => Math.max(0, eventDate.getTime() - Date.now()))
  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, eventDate.getTime() - Date.now())),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [eventDate])
  const time = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60,
    seconds: Math.floor(remaining / 1000) % 60,
  }

  const labels: Partial<Record<EditorialVowsSectionKey, string>> = {
    couple: 'Chúng mình',
    story: 'Câu chuyện',
    events: 'Ngày cưới',
    gallery: 'Album',
    rsvp: 'RSVP',
  }
  const visualOrder = sectionConfig.order.filter((key) => enabled.has(key) && key !== 'navigation')
  const sections: Partial<Record<EditorialVowsSectionKey, React.ReactNode>> = {
    hero: (
      <section className="ev-hero" data-editor-section="hero">
        <div className="ev-hero-copy">
          <motion.p
            initial={reduced ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {data.hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
          >
            <span>{data.hero.brideName}</span>
            <i>&</i>
            <span>{data.hero.groomName}</span>
          </motion.h1>
          <motion.div
            className="ev-hero-meta"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <strong>{data.hero.date}</strong>
            <span>{data.hero.venue}</span>
          </motion.div>
          <a href="#announcement" className="ev-scroll-cue">
            Khám phá câu chuyện <ArrowDown />
          </a>
        </div>
        <motion.figure
          initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0)' }}
          transition={{ duration: 1.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <img
            src={data.hero.image}
            alt={`Ảnh cưới của ${data.hero.brideName} và ${data.hero.groomName}`}
          />
          <div className="ev-orbit" aria-hidden="true">
            <span>20</span>
            <span>12</span>
            <span>26</span>
          </div>
        </motion.figure>
        <div className="ev-hero-line" aria-hidden="true" />
      </section>
    ),
    announcement: (
      <section id="announcement" className="ev-announcement" data-editor-section="announcement">
        <Reveal>
          <Quotes weight="thin" />
          <p>{data.announcement.message}</p>
          <span>{data.announcement.title}</span>
        </Reveal>
      </section>
    ),
    couple: (
      <section id="couple" className="ev-section ev-couple" data-editor-section="couple">
        <SectionTitle index="01" eyebrow="Hai cá tính, một nhịp sống">
          Chúng mình
        </SectionTitle>
        <div className="ev-couple-grid">
          {[data.couple.bride, data.couple.groom].map((person, index) => (
            <Reveal key={person.name} delay={index * 0.13} className="ev-person">
              <figure>
                <img src={person.image} alt={person.name} />
                <span>0{index + 1}</span>
              </figure>
              <div>
                <small>{person.role}</small>
                <h3>{person.name}</h3>
                <p>{person.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    story: (
      <section id="story" className="ev-section ev-story" data-editor-section="story">
        <SectionTitle index="02" eyebrow="Love story chapters">
          Một hành trình
          <br />
          không vội vàng
        </SectionTitle>
        <div className="ev-story-list">
          {data.story.map((item, index) => (
            <Reveal key={item.year} className="ev-story-chapter">
              <figure>
                <img src={item.image} alt="" />
                <span>{item.year}</span>
              </figure>
              <div>
                <small>CHAPTER {String(index + 1).padStart(2, '0')}</small>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    events: (
      <section id="events" className="ev-section ev-events" data-editor-section="events">
        <SectionTitle index="03" eyebrow="Save our date">
          Ngày chúng mình
          <br />
          thành đôi
        </SectionTitle>
        <div className="ev-event-list">
          {data.events.map((event, index) => (
            <Reveal key={event.title} delay={index * 0.12} className="ev-event">
              <span>{event.date}</span>
              <strong>{event.time}</strong>
              <div>
                <small>0{index + 1}</small>
                <h3>{event.title}</h3>
                <p>{event.venue}</p>
                <em>{event.address}</em>
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
      <section className="ev-countdown" data-editor-section="countdown">
        <Reveal>
          <span className="ev-countdown-label">Cùng đếm những nhịp chờ</span>
          <div>
            {Object.entries(time).map(([key, value]) => (
              <p key={key}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>
                  {
                    { days: 'ngày', hours: 'giờ', minutes: 'phút', seconds: 'giây' }[
                      key as keyof typeof time
                    ]
                  }
                </span>
              </p>
            ))}
          </div>
        </Reveal>
      </section>
    ),
    venues: (
      <section className="ev-section ev-venues" data-editor-section="venues">
        <SectionTitle index="04" eyebrow="Meet us there">
          Nơi mình gặp nhau
        </SectionTitle>
        <div className="ev-venue-stage">
          <Reveal className="ev-map-art">
            <span>SAIGON</span>
            <i />
            <i />
            <i />
            <MapPin weight="fill" />
          </Reveal>
          <div className="ev-venue-cards">
            {data.events.map((event) => (
              <Reveal key={event.title}>
                <small>
                  {event.date} · {event.time}
                </small>
                <h3>{event.venue}</h3>
                <p>{event.address}</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                  Mở chỉ đường <ArrowRight />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="ev-section ev-gallery" data-editor-section="gallery">
        <SectionTitle index="05" eyebrow="A few frames">
          Những khoảnh khắc
          <br />ở lại
        </SectionTitle>
        <div className="ev-gallery-grid">
          {data.gallery.map((image, index) => (
            <Reveal key={index} delay={(index % 3) * 0.08}>
              <motion.img
                whileHover={reduced ? undefined : { scale: 1.035 }}
                transition={{ duration: 0.45 }}
                src={image.src}
                alt={image.alt}
                loading={index > 1 ? 'lazy' : undefined}
              />
            </Reveal>
          ))}
        </div>
      </section>
    ),
    schedule: (
      <section className="ev-section ev-schedule" data-editor-section="schedule">
        <SectionTitle index="06" eyebrow="The evening">
          Một tối cùng nhau
        </SectionTitle>
        <div>
          {data.schedule.map((item, index) => (
            <Reveal key={item.time} delay={index * 0.07}>
              <strong>{item.time}</strong>
              <i />
              <span>
                <b>{item.title}</b>
                <small>{item.detail}</small>
              </span>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    weddingParty: (
      <section className="ev-section ev-party" data-editor-section="weddingParty">
        <SectionTitle index="07" eyebrow="Our people">
          Những người bên cạnh
        </SectionTitle>
        <div>
          {data.weddingParty.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.06}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{person.name}</strong>
              <small>{person.role}</small>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    dressCode: (
      <section className="ev-dress" data-editor-section="dressCode">
        <Reveal>
          <small>THE DRESS NOTE</small>
          <h2>{data.dressCode.title}</h2>
          <p>{data.dressCode.message}</p>
          <div>
            {data.dressCode.colors.map((color) => (
              <i key={color} style={{ background: color }}>
                <span>{color}</span>
              </i>
            ))}
          </div>
        </Reveal>
      </section>
    ),
    travel: (
      <section className="ev-section ev-travel" data-editor-section="travel">
        <SectionTitle index="08" eyebrow="Good to know">
          Để hành trình nhẹ nhàng
        </SectionTitle>
        <div>
          {data.travel.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    faq: (
      <section className="ev-section ev-faq" data-editor-section="faq">
        <SectionTitle index="09" eyebrow="Before you arrive">
          Một vài điều nhỏ
        </SectionTitle>
        <div>
          {data.faq.map((item) => (
            <Reveal key={item.question}>
              <details>
                <summary>
                  {item.question}
                  <span>+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    rsvp: (
      <section id="rsvp" className="ev-rsvp" data-editor-section="rsvp">
        <Reveal>
          <small>RÉPONDEZ S’IL VOUS PLAÎT</small>
          <h2>{sent ? 'Hẹn gặp bạn trong ngày vui' : 'Bạn sẽ đến chứ?'}</h2>
          {sent ? (
            <motion.div
              className="ev-rsvp-success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Check weight="bold" />
              <p>Cảm ơn bạn đã phản hồi.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <label>
                <span>Tên của bạn</span>
                <input required placeholder="Nhập tên" />
              </label>
              <div className="ev-attendance">
                <label>
                  <input type="radio" name="attend" defaultChecked /> Mình sẽ đến
                </label>
                <label>
                  <input type="radio" name="attend" /> Tiếc là không thể
                </label>
              </div>
              <label>
                <span>Lời nhắn</span>
                <textarea rows={2} placeholder="Gửi đôi lời đến chúng mình" />
              </label>
              <button type="submit">
                Gửi phản hồi <PaperPlaneTilt />
              </button>
            </form>
          )}
        </Reveal>
      </section>
    ),
    guestbook: (
      <section className="ev-section ev-guestbook" data-editor-section="guestbook">
        <SectionTitle index="10" eyebrow="Notes from our people">
          Những lời thương
        </SectionTitle>
        <div>
          {data.guestbook.map((note, index) => (
            <Reveal key={note.author} delay={index * 0.1}>
              <Heart weight="thin" />
              <p>“{note.message}”</p>
              <span>— {note.author}</span>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    gift: (
      <section className="ev-gift" data-editor-section="gift">
        <Reveal>
          <Gift weight="thin" />
          <div>
            <small>Một lựa chọn nhỏ</small>
            <h2>Gửi quà mừng</h2>
            <p>
              Sự hiện diện của bạn đã là món quà quý nhất. Nếu muốn gửi thêm lời chúc, bạn có thể mở
              thông tin tại đây.
            </p>
          </div>
          <button type="button">Xem thông tin</button>
        </Reveal>
      </section>
    ),
    footer: (
      <footer className="ev-footer" data-editor-section="footer">
        <Reveal>
          <small>THE BEGINNING, NOT THE END</small>
          <p>{data.footer.message}</p>
          <strong>{data.footer.signature}</strong>
          <span>20 · 12 · 2026</span>
        </Reveal>
      </footer>
    ),
  }

  return (
    <main className={`editorial-vows ${editorMode ? 'is-editor' : ''}`}>
      <div className="ev-ambient" aria-hidden="true">
        <img
          className="ev-decor ev-decor-a"
          src="/assets/images/templates/editorial-vows/botanical-ribbon.png"
          alt=""
        />
        <img
          className="ev-decor ev-decor-b"
          src="/assets/images/templates/editorial-vows/botanical-ribbon.png"
          alt=""
        />
        <img
          className="ev-decor ev-decor-c"
          src="/assets/images/templates/editorial-vows/botanical-ribbon.png"
          alt=""
        />
        <img
          className="ev-decor ev-decor-d"
          src="/assets/images/templates/editorial-vows/botanical-ribbon.png"
          alt=""
        />
        <span className="ev-chrome ev-chrome-a" />
        <span className="ev-chrome ev-chrome-b" />
        <span className="ev-chrome ev-chrome-c" />
      </div>
      {enabled.has('navigation') ? (
        <nav className="ev-nav" data-editor-section="navigation">
          <a href="#top" className="ev-monogram">
            M<span>&</span>N
          </a>
          <button
            type="button"
            onClick={() => setNavOpen(!navOpen)}
            aria-expanded={navOpen}
            aria-label="Mở điều hướng"
          >
            <i />
            <i />
          </button>
          <div className={navOpen ? 'is-open' : ''}>
            {Object.entries(labels)
              .filter(([key]) => enabled.has(key as EditorialVowsSectionKey))
              .map(([key, label]) => (
                <a key={key} href={`#${key}`} onClick={() => setNavOpen(false)}>
                  {label}
                </a>
              ))}
          </div>
          <a href="#rsvp" className="ev-nav-rsvp">
            Xác nhận
          </a>
        </nav>
      ) : null}
      <div id="top">
        {visualOrder.map((key) => (
          <div key={key}>{sections[key]}</div>
        ))}
      </div>
      <button
        className={`ev-music ${playing ? 'is-playing' : ''}`}
        type="button"
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
      >
        {playing ? <Pause weight="fill" /> : <Play weight="fill" />}
        <MusicNote />
      </button>
    </main>
  )
}
