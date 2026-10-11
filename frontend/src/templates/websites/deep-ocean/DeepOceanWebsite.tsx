import { useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { MusicPlayer } from '../../../shared/ui/music-player'
import type { DeepOceanData, DeepOceanSectionConfig, DeepOceanSectionKey } from './content'
import { deepOceanFixture, deepOceanSections } from './fixture'
import './deep-ocean.css'

type Props = { data?: DeepOceanData; sectionConfig?: DeepOceanSectionConfig; editorMode?: boolean }

function BackgroundImage({ media, className = '' }: { media: { src: string; alt: string; position?: string }; className?: string }) {
  return (
    <div
      className={`do-background-image ${className}`}
      aria-hidden="true"
      style={{ '--do-background': `url("${media.src}")`, '--do-position': media.position ?? 'center' } as CSSProperties}
    />
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <header className="do-section-title"><span>{eyebrow}</span><h2>{title}</h2></header>
}

export function DeepOceanWebsite({ data = deepOceanFixture, sectionConfig = deepOceanSections, editorMode = false }: Props) {
  const enabled = useMemo(() => new Set(sectionConfig.enabled), [sectionConfig.enabled])
  const sections: Partial<Record<DeepOceanSectionKey, ReactNode>> = {
    navigation: <nav className="do-nav" data-editor-section="navigation"><a href="#top" className="do-nav-mark">DO</a><div><a href="#story">Our story</a><a href="#day">The day</a><a href="#gallery">Gallery</a><a href="#wishes">Wishes</a></div></nav>,
    hero: <section id="top" className="do-hero" data-editor-section="hero"><BackgroundImage media={data.hero.background} className="do-hero-background" /><div className="do-hero-wash" /><div className="do-hero-copy"><span>{data.hero.eyebrow}</span><h1>{data.hero.brideName}<i>&amp;</i>{data.hero.groomName}</h1><p>{data.hero.date}</p><strong>{data.hero.tagline}</strong><a href="#story" className="do-hero-link">Begin our story <span>↓</span></a></div><span className="do-pearl do-pearl-one" aria-hidden="true" /><span className="do-pearl do-pearl-two" aria-hidden="true" /></section>,
    story: <section id="story" className="do-section do-story" data-editor-section="story"><div className="do-story-copy"><SectionTitle eyebrow={data.story.eyebrow} title={data.story.title} /><p>{data.story.body}</p></div><div className="do-story-media"><img src={data.story.image.src} alt={data.story.image.alt} /></div></section>,
    timeline: <section className="do-section do-timeline" data-editor-section="timeline"><SectionTitle eyebrow="TIDE TIMELINE" title="Every chapter led us here." /><div className="do-timeline-list">{data.timeline.map((item) => <article key={`${item.date}-${item.title}`}><span className="do-timeline-pearl" aria-hidden="true" /><time>{item.date}</time><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></section>,
    weddingDay: <section id="day" className="do-day" data-editor-section="weddingDay"><BackgroundImage media={data.weddingDay.background} /><div className="do-day-card"><SectionTitle eyebrow={data.weddingDay.eyebrow} title={data.weddingDay.title} /><dl><div><dt>Date</dt><dd>{data.weddingDay.date}</dd></div><div><dt>Time</dt><dd>{data.weddingDay.time}</dd></div><div><dt>Venue</dt><dd>{data.weddingDay.venue}<small>{data.weddingDay.address}</small></dd></div></dl></div></section>,
    gallery: <section id="gallery" className="do-section do-gallery" data-editor-section="gallery"><SectionTitle eyebrow="PEARL GALLERY" title="A few moments we keep close." /><div className="do-gallery-grid">{data.gallery.map((media, index) => <figure key={`${media.src}-${index}`}><img src={media.src} alt={media.alt} loading={index > 1 ? 'lazy' : 'eager'} /><figcaption>{String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div></section>,
    memories: <section className="do-section do-memories" data-editor-section="memories"><div><SectionTitle eyebrow={data.memories.eyebrow} title={data.memories.title} /><p>{data.memories.body}</p></div><div className="do-memory-images">{data.memories.images.map((media, index) => <img key={`${media.src}-${index}`} src={media.src} alt={media.alt} loading="lazy" />)}</div></section>,
    people: <section className="do-section do-people" data-editor-section="people"><SectionTitle eyebrow="THE PEOPLE WE LOVE" title="The ones who held us through every tide." /><div className="do-people-grid">{data.people.map((person) => <article key={person.name}><img src={person.image.src} alt={person.image.alt} loading="lazy" /><span>{person.role}</span><h3>{person.name}</h3></article>)}</div></section>,
    film: <section className="do-film" data-editor-section="film"><div className="do-film-card"><img src={data.film.poster.src} alt={data.film.poster.alt} loading="lazy" /><div><span>WEDDING FILM</span><h2>{data.film.title}</h2><p>{data.film.message}</p>{data.film.videoUrl ? <a href={data.film.videoUrl}>Watch the film ↗</a> : <small>Video coming soon</small>}</div></div></section>,
    wishes: <section id="wishes" className="do-section do-wishes" data-editor-section="wishes"><SectionTitle eyebrow="WISHES FROM THE SHORE" title="Words we will carry with us." /><div className="do-wishes-grid">{data.wishes.map((wish) => <blockquote key={`${wish.author}-${wish.message}`}><p>“{wish.message}”</p><cite>{wish.author}</cite></blockquote>)}</div></section>,
    capsule: <section className="do-capsule" data-editor-section="capsule"><div className="do-capsule-shell"><span>{data.capsule.eyebrow}</span><h2>{data.capsule.title}</h2><p>{data.capsule.message}</p></div></section>,
    footer: <footer className="do-footer" data-editor-section="footer"><BackgroundImage media={data.footer.background} /><div><p>{data.footer.message}</p><strong>{data.footer.signature}</strong></div></footer>,
  }
  return (
    <main className="deep-ocean-website">
      {data.music.backgroundMusicUrl ? (
        <MusicPlayer
          src={data.music.backgroundMusicUrl}
          title={data.music.backgroundMusicName || 'Nháº¡c ná»n'}
          autoplay={data.music.backgroundMusicAutoplay}
          active
          editorMode={editorMode}
          sectionKey={null}
        />
      ) : null}
      {sectionConfig.order.filter((key) => enabled.has(key)).map((key) => <div key={key}>{sections[key]}</div>)}
    </main>
  )
}
