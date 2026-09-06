import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, Check, MapPin, PaperPlaneTilt } from '@phosphor-icons/react'
import type { CherryBlossomData, CherrySectionConfig, CherrySectionKey } from './content'
import { cherryBlossomFixture, cherryBlossomSections } from './fixture'
import { PetalFieldSafe as PetalField } from './PetalFieldSafe'
import './cherry-blossom-garden.css'
type Props = { data?: CherryBlossomData; sectionConfig?: CherrySectionConfig }
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion(),
    seen = useInView(ref, { once: true, margin: '0px 0px -18% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={seen || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
function Petals() {
  return (
    <div className="cb-petals" aria-hidden="true">
      <PetalField count={28} />
    </div>
  )
}
function Heading({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <Reveal className="cb-heading">
      <span>{kicker}</span>
      <h2>{children}</h2>
      <i />
    </Reveal>
  )
}
export function CherryBlossomGardenWebsite({
  data = cherryBlossomFixture,
  sectionConfig = cherryBlossomSections,
}: Props) {
  const enabled = new Set(sectionConfig.enabled),
    reduced = useReducedMotion(),
    hero = useRef<HTMLElement>(null),
    [sent, setSent] = useState(false),
    { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] }),
    bgY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 95]),
    nearY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 180])
  const date = useMemo(() => new Date('2027-03-20T16:30:00+07:00'), []),
    [left, setLeft] = useState(() => Math.max(0, date.getTime() - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, date.getTime() - Date.now())), 1000)
    return () => clearInterval(id)
  }, [date])
  const values = [
      Math.floor(left / 864e5),
      Math.floor(left / 36e5) % 24,
      Math.floor(left / 6e4) % 60,
      Math.floor(left / 1e3) % 60,
    ],
    units = ['ngày', 'giờ', 'phút', 'giây']
  const sections: Partial<Record<CherrySectionKey, React.ReactNode>> = {
    hero: (
      <section ref={hero} id="top" className="cb-hero" data-editor-section="hero">
        <motion.div className="cb-hero-bg" style={{ y: bgY }} />
        <div className="cb-light" />
        <div className="cb-mist" />
        <motion.div className="cb-foreground" style={{ y: nearY }} />
        <Petals />
        <motion.div
          className="cb-hero-copy"
          initial={reduced ? false : { opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          <span>Cherry Blossom Garden · Chapter 01</span>
          <h1>
            {data.hero.brideName}
            <i>&</i>
            {data.hero.groomName}
          </h1>
          <p>
            {data.hero.date}
            <b /> {data.hero.venue}
          </p>
          <a href="#announcement">
            Bước qua cánh cổng mùa xuân <ArrowDown />
          </a>
        </motion.div>
      </section>
    ),
    announcement: (
      <section id="announcement" className="cb-announcement" data-editor-section="announcement">
        <div className="cb-announcement-scene" aria-hidden="true">
          <img src="/assets/images/templates/cherry-blossom-garden/rings-sakura.png" alt="" />
          <i className="cb-announcement-bloom" />
          <i className="cb-announcement-glow" />
        </div>
        <div className="cb-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Reveal className="cb-announcement-letter">
          <span>{data.announcement.title}</span>
          <p>{data.announcement.message}</p>
          <small>
            Một buổi chiều được dệt từ hương hoa, mặt nước phản chiếu và những người chúng mình
            thương quý nhất.
          </small>
          <i>桜</i>
        </Reveal>
      </section>
    ),
    couple: (
      <section id="couple" className="cb-section cb-couple" data-editor-section="couple">
        <Heading kicker="Two souls in bloom">Chúng mình</Heading>
        <div className="cb-couple-grid">
          {data.couple.map((p, i) => (
            <Reveal className="cb-person" key={p.name}>
              <figure>
                <img src={p.image} alt={p.name} />
                <i>{i ? '新郎' : '新婦'}</i>
              </figure>
              <span>{p.role}</span>
              <h3>{p.name}</h3>
              <p>{p.bio}</p>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    story: (
      <section id="story" className="cb-story" data-editor-section="story">
        <div className="cb-section">
          <Heading kicker="The path that led us here">
            Con đường
            <br />
            dẫn đến mùa hoa
          </Heading>
          {data.story.map((s, i) => (
            <Reveal className="cb-story-row" key={s.year}>
              <figure>
                <img src={s.image} alt="" />
              </figure>
              <div>
                <span>{s.year}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <b>{String(i + 1).padStart(2, '0')}</b>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    events: (
      <section id="events" className="cb-events cb-events-spatial" data-editor-section="events">
        <div className="cb-pavilion-scene">
          <img
            src="/assets/images/templates/cherry-blossom-garden/moon-pavilion.png"
            alt="Không gian tiệc cưới bên hồ dưới hoa anh đào"
          />
        </div>
        <div className="cb-section">
          <Heading kicker="Moon pavilion · Chapter 04">Ngày khu vườn lên đèn</Heading>
          <p className="cb-events-intro">
            Từ nghi lễ khi trời còn ánh hồng đến bữa tối bên mặt hồ — mỗi khoảnh khắc đều dành để
            chúng ta thật sự ở bên nhau.
          </p>
          <div>
            {data.events.map((e, i) => (
              <Reveal className="cb-event" key={e.title}>
                <span>0{i + 1}</span>
                <small>
                  {e.date} · {e.time}
                </small>
                <h3>{e.title}</h3>
                <p>
                  {e.venue}
                  <br />
                  {e.address}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    ),
    countdown: (
      <section className="cb-countdown" data-editor-section="countdown">
        <span>Counting petals, counting moments</span>
        <div>
          {values.map((v, i) => (
            <p key={units[i]}>
              <strong>{String(v).padStart(2, '0')}</strong>
              <small>{units[i]}</small>
            </p>
          ))}
        </div>
      </section>
    ),
    venues: (
      <section className="cb-venue" data-editor-section="venues">
        <div />
        <Reveal>
          <MapPin weight="thin" />
          <span>The garden</span>
          <h2>{data.events[0].venue}</h2>
          <p>{data.events[0].address}</p>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">
            Mở chỉ đường <ArrowRight />
          </a>
        </Reveal>
      </section>
    ),
    gallery: (
      <section id="gallery" className="cb-gallery" data-editor-section="gallery">
        <div className="cb-portal-stage">
          <img
            src="/assets/images/templates/cherry-blossom-garden/chrome-portal.png"
            alt="Cổng ký ức giữa những cánh hoa"
          />
          <Reveal className="cb-portal-copy">
            <span>Memory portal · Chapter 05</span>
            <h2>Chạm vào những ký ức đang nở</h2>
            <p>
              Mỗi khung hình là một lối nhỏ dẫn về ngày chúng mình đã cùng lớn lên, cùng đi xa và
              cùng chọn trở về.
            </p>
            <a href="#memory-grid">
              Mở album <ArrowDown />
            </a>
          </Reveal>
        </div>
        <div id="memory-grid" className="cb-section cb-gallery-grid">
          <Heading kicker="Petals of memory">Những khoảnh khắc chúng mình giữ lại</Heading>
          <div>
            {data.gallery.map((g, i) => (
              <Reveal key={g.src}>
                <figure>
                  <img loading="lazy" src={g.src} alt={g.alt} />
                  <figcaption>0{i + 1}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section className="cb-section cb-schedule" data-editor-section="schedule">
        <Heading kicker="A gentle afternoon">Lịch trình</Heading>
        <div>
          {data.schedule.map((s) => (
            <Reveal key={s.time}>
              <strong>{s.time}</strong>
              <i />
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    dressCode: (
      <section className="cb-dress" data-editor-section="dressCode">
        <Reveal>
          <span>Dress palette</span>
          <h2>Nhẹ như một cánh hoa</h2>
          <p>Ivory · Sakura pink · Pastel · Spring green</p>
          <div>
            <i />
            <i />
            <i />
            <i />
          </div>
        </Reveal>
      </section>
    ),
    faq: (
      <section className="cb-section cb-faq" data-editor-section="faq">
        <Heading kicker="A few garden notes">Điều bạn muốn biết</Heading>
        <div>
          {data.faq.map((x) => (
            <details key={x.question}>
              <summary>
                {x.question}
                <span>＋</span>
              </summary>
              <p>{x.answer}</p>
            </details>
          ))}
        </div>
      </section>
    ),
    rsvp: (
      <section id="rsvp" className="cb-rsvp" data-editor-section="rsvp">
        <img src="/assets/images/templates/cherry-blossom-garden/canopy-edge-right.png" alt="" />
        <Petals />
        <Reveal>
          <span>Répondez s’il vous plaît</span>
          <h2>{sent ? 'Hẹn gặp bạn giữa vườn hoa' : 'Bạn sẽ đến chung vui chứ?'}</h2>
          {sent ? (
            <p className="cb-success">
              <Check /> Cảm ơn bạn đã hồi âm.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
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
                Gửi hồi âm <PaperPlaneTilt />
              </button>
            </form>
          )}
        </Reveal>
      </section>
    ),
    guestbook: (
      <section className="cb-section cb-guestbook" data-editor-section="guestbook">
        <Heading kicker="Words that stay">Lời thương nở hoa</Heading>
        <div>
          {data.guestbook.map((n) => (
            <Reveal key={n.author}>
              <p>“{n.message}”</p>
              <span>{n.author}</span>
            </Reveal>
          ))}
        </div>
      </section>
    ),
    footer: (
      <footer className="cb-footer" data-editor-section="footer">
        <Petals />
        <Reveal>
          <span>20 · 03 · 2027</span>
          <p>{data.footer.message}</p>
          <strong>{data.footer.signature}</strong>
        </Reveal>
      </footer>
    ),
  }
  return (
    <main className="cherry-blossom-garden">
      {enabled.has('navigation') ? (
        <nav className="cb-nav" data-editor-section="navigation">
          <a href="#top">
            M <i>&</i> Đ
          </a>
          <div>
            <a href="#couple">Chúng mình</a>
            <a href="#story">Câu chuyện</a>
            <a href="#events">Ngày cưới</a>
            <a href="#gallery">Album</a>
          </div>
          <a href="#rsvp">RSVP</a>
        </nav>
      ) : null}
      {sectionConfig.order
        .filter((k) => k !== 'navigation' && enabled.has(k))
        .map((k) => (
          <div key={k}>{sections[k]}</div>
        ))}
    </main>
  )
}
