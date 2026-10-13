import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { MusicPlayer } from '../../../shared/ui/music-player'
import type { DeepOceanData, DeepOceanMedia, DeepOceanSectionConfig, DeepOceanSectionKey } from './content'
import { deepOceanFixture, deepOceanSections } from './fixture'
import { OceanPearlScene } from './OceanPearlScene'
import './deep-ocean.css'

type Props = { data?: DeepOceanData; sectionConfig?: DeepOceanSectionConfig; editorMode?: boolean }
const artwork = '/assets/images/templates/deep-ocean/artwork'
const anchors: Partial<Record<DeepOceanSectionKey, { id: string; label: string }>> = {
  hero: { id: 'top', label: 'Đầu trang' },
  story: { id: 'story', label: 'Câu chuyện' },
  weddingDay: { id: 'day', label: 'Ngày cưới' },
  gallery: { id: 'gallery', label: 'Ảnh' },
  wishes: { id: 'wishes', label: 'Lời chúc' },
}

function Chapter({ sectionKey, children }: { sectionKey: DeepOceanSectionKey; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })
  const reducedMotion = useReducedMotion()
  const visible = reducedMotion || inView || typeof IntersectionObserver === 'undefined'
  return <motion.div ref={ref} className="ocean-chapter" data-motion-section={sectionKey} initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }} transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function Label({ children }: { children: ReactNode }) {
  return <span className="ocean-label"><i aria-hidden="true" />{children}</span>
}

function Picture({ media, className = '', loading = 'lazy' }: { media: DeepOceanMedia; className?: string; loading?: 'eager' | 'lazy' }) {
  return <img className={className} src={media.src} alt={media.alt} loading={loading} style={{ objectPosition: media.position ?? 'center' }} />
}

function Gallery({ media }: { media: DeepOceanMedia[] }) {
  const [selected, setSelected] = useState(0)
  useEffect(() => setSelected(0), [media])
  if (media.length === 0) return null
  const active = Math.min(selected, media.length - 1)
  return <div className="ocean-gallery-layout">
    <figure className="ocean-gallery-feature"><Picture media={media[active]} /><figcaption>{String(active + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}</figcaption></figure>
    <div className="ocean-gallery-rail" aria-label="Chọn ảnh">{media.map((item, index) => <button type="button" key={`${item.src}-${index}`} className={index === active ? 'is-active' : ''} aria-label={`Xem ảnh ${index + 1}`} aria-pressed={index === active} onClick={() => setSelected(index)}><Picture media={item} /><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div>
  </div>
}

export function DeepOceanWebsite({ data = deepOceanFixture, sectionConfig = deepOceanSections, editorMode = false }: Props) {
  const enabled = useMemo(() => new Set(sectionConfig.enabled), [sectionConfig.enabled])
  const navLinks = sectionConfig.order.filter((key) => enabled.has(key) && key !== 'navigation' && key !== 'footer')
    .map((key) => ({ key, anchor: anchors[key] }))
    .filter((item): item is { key: DeepOceanSectionKey; anchor: { id: string; label: string } } => Boolean(item.anchor))

  const sections: Partial<Record<DeepOceanSectionKey, ReactNode>> = {
    navigation: <nav className="ocean-nav" aria-label="Deep Ocean navigation" data-editor-section="navigation"><a className="ocean-nav-mark" href="#top" aria-label="Về đầu trang">O<span>•</span></a><div className="ocean-nav-links">{navLinks.map(({ key, anchor }) => <a key={key} href={`#${anchor.id}`}>{anchor.label}</a>)}</div>{enabled.has('weddingDay') ? <a className="ocean-nav-date" href="#day">{data.hero.date}<span aria-hidden="true"> ↗</span></a> : <span className="ocean-nav-date">{data.hero.date}</span>}</nav>,
    hero: <section id="top" className="ocean-hero" data-editor-section="hero"><div className="ocean-hero-copy"><Label>{data.hero.eyebrow}</Label><h1><span>{data.hero.brideName}</span><em>&amp;</em><span>{data.hero.groomName}</span></h1><p>{data.hero.tagline}</p><div className="ocean-hero-actions">{enabled.has('story') ? <a href="#story">Khám phá câu chuyện <span aria-hidden="true">↘</span></a> : enabled.has('weddingDay') ? <a href="#day">Xem ngày cưới <span aria-hidden="true">↘</span></a> : null}<span>{data.hero.date}</span></div></div><div className="ocean-hero-art"><div className="ocean-hero-halo" aria-hidden="true" /><div className="ocean-hero-photo"><Picture media={data.hero.background} loading="eager" /></div><OceanPearlScene /><span className="ocean-hero-caption">A love as deep as the sea</span></div><span className="ocean-hero-watermark" aria-hidden="true">ocean</span></section>,
    story: <section id="story" className="ocean-section ocean-story" data-editor-section="story"><div className="ocean-story-image"><Picture media={data.story.image} /><span>01 / beneath the surface</span></div><div className="ocean-story-copy"><Label>{data.story.eyebrow}</Label><h2>{data.story.title}</h2><p>{data.story.body}</p><span className="ocean-story-sign">M &amp; H</span></div></section>,
    timeline: <section className="ocean-section ocean-timeline" data-editor-section="timeline"><div className="ocean-section-heading"><Label>HÀNH TRÌNH CỦA CHÚNG MÌNH</Label><h2>Mỗi con sóng đưa ta gần nhau hơn.</h2></div><div className="ocean-timeline-track">{data.timeline.map((item, index) => <article key={`${item.date}-${item.title}`}><span className="ocean-timeline-number">{String(index + 1).padStart(2, '0')}</span><time>{item.date}</time><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>,
    weddingDay: <section id="day" className="ocean-section ocean-day" data-editor-section="weddingDay"><div className="ocean-day-heading"><Label>{data.weddingDay.eyebrow}</Label><h2>{data.weddingDay.title}</h2><p>Cùng chúng mình viết tiếp chương đẹp nhất bên biển.</p></div><div className="ocean-day-layout"><div className="ocean-day-photo"><Picture media={data.weddingDay.background} /><span>THE PEARL HOUSE · DA NANG</span></div><dl className="ocean-day-details"><div><dt>Ngày</dt><dd>{data.weddingDay.date}</dd></div><div><dt>Giờ</dt><dd>{data.weddingDay.time}</dd></div><div><dt>Địa điểm</dt><dd>{data.weddingDay.venue}<small>{data.weddingDay.address}</small></dd></div></dl></div></section>,
    gallery: <section id="gallery" className="ocean-section ocean-gallery" data-editor-section="gallery"><div className="ocean-section-heading"><Label>KHOẢNH KHẮC</Label><h2>Những điều chúng mình muốn giữ mãi.</h2></div><Gallery media={data.gallery} /></section>,
    memories: <section className="ocean-section ocean-memories" data-editor-section="memories"><div className="ocean-memories-copy"><Label>{data.memories.eyebrow}</Label><h2>{data.memories.title}</h2><p>{data.memories.body}</p></div><div className="ocean-memories-photos">{data.memories.images.map((media, index) => <figure key={`${media.src}-${index}`}><Picture media={media} /><figcaption>{String(index + 1).padStart(2, '0')} · kỷ niệm</figcaption></figure>)}</div></section>,
    people: <section className="ocean-section ocean-people" data-editor-section="people"><div className="ocean-section-heading"><Label>NHỮNG NGƯỜI THƯƠNG</Label><h2>Luôn có mọi người ở bên.</h2></div><div className="ocean-people-list">{data.people.map((person) => <article key={person.name}><Picture media={person.image} /><div><h3>{person.name}</h3><p>{person.role}</p></div></article>)}</div></section>,
    film: <section className="ocean-section ocean-film" data-editor-section="film"><div className="ocean-film-frame"><Picture media={data.film.poster} /><div><Label>WEDDING FILM</Label><h2>{data.film.title}</h2><p>{data.film.message}</p>{data.film.videoUrl ? <a href={data.film.videoUrl}>Xem phim <span aria-hidden="true">↗</span></a> : <span className="ocean-film-pending">Phim sẽ sớm được chia sẻ</span>}</div></div></section>,
    wishes: <section id="wishes" className="ocean-section ocean-wishes" data-editor-section="wishes"><div className="ocean-section-heading"><Label>LỜI CHÚC</Label><h2>Những lời thương mang theo.</h2></div><div className="ocean-wishes-list">{data.wishes.map((wish) => <blockquote key={`${wish.author}-${wish.message}`}><span aria-hidden="true">“</span><p>{wish.message}</p><cite>{wish.author}</cite></blockquote>)}</div></section>,
    capsule: <section className="ocean-section ocean-capsule" data-editor-section="capsule"><img src={`${artwork}/do-oyster-pearl-v1.png`} alt="" aria-hidden="true" loading="lazy" /><div><Label>{data.capsule.eyebrow}</Label><h2>{data.capsule.title}</h2><p>{data.capsule.message}</p></div></section>,
    footer: <footer className="ocean-footer" data-editor-section="footer"><Label>FROM OUR HEARTS</Label><p>{data.footer.message}</p><strong>{data.footer.signature}</strong><a href="#top">Trở về đầu trang ↑</a></footer>,
  }

  return <main className="deep-ocean-website">{data.music.backgroundMusicUrl ? <MusicPlayer src={data.music.backgroundMusicUrl} title={data.music.backgroundMusicName || 'Nhạc nền'} autoplay={data.music.backgroundMusicAutoplay} active editorMode={editorMode} sectionKey={null} /> : null}{sectionConfig.order.filter((key) => enabled.has(key)).map((key) => <Chapter key={key} sectionKey={key}>{sections[key]}</Chapter>)}</main>
}
