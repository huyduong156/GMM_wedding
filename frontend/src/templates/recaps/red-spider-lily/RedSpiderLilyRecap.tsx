import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, CaretRight, Flower, ImagesSquare, MagnifyingGlassMinus, MagnifyingGlassPlus, MusicNotes, Pause, Play, Quotes, X } from '@phosphor-icons/react'
import type { RedSpiderLilyMedia, RedSpiderLilyMoment, RedSpiderLilyOptionalContent, RedSpiderLilyRecapContent } from './content'
import { redSpiderLilyRecapFixture } from './fixture'
import { isLiveEditorScroll, isLiveEditorUpdate, liveEditorEvents } from '../../../shared/lib/live-template-editor'
import './red-spider-lily.css'
import './red-spider-lily-rails.css'
import './red-spider-lily-phase4.css'

const decorAssets = {
  botanical: '/assets/images/templates/red-spider-lily/red-spider-lily-botanical-cluster.png',
  vow: '/assets/images/templates/red-spider-lily/red-spider-lily-vow-prop.png',
  ring: '/assets/images/templates/red-spider-lily/red-spider-lily-ring-prop-v2.png',
  film: '/assets/images/templates/red-spider-lily/red-spider-lily-film-ribbon-v2.png',
  divider: '/assets/images/templates/red-spider-lily/red-spider-lily-divider-thread-v2.png',
  light: '/assets/images/templates/red-spider-lily/red-spider-lily-light-leak-v2.png',
  topdownBloom: '/assets/images/templates/red-spider-lily/red-spider-lily-topdown-bloom.png',
} as const

type DecorVariant = 'hero' | 'story' | 'chapters' | 'moments' | 'delivery' | 'guestbook' | 'people' | 'film' | 'soundtrack' | 'behind' | 'capsule' | 'thankYou'

const sectionDecor: Record<DecorVariant, Array<{ src: string; className: string }>> = {
  hero: [{ src: decorAssets.botanical, className: 'rsl-decor-botanical' }, { src: decorAssets.light, className: 'rsl-decor-light' }, { src: decorAssets.topdownBloom, className: 'rsl-decor-bloom' }],
  story: [{ src: decorAssets.vow, className: 'rsl-decor-vow' }, { src: decorAssets.divider, className: 'rsl-decor-divider' }],
  chapters: [{ src: decorAssets.ring, className: 'rsl-decor-ring' }, { src: decorAssets.divider, className: 'rsl-decor-divider' }],
  moments: [{ src: decorAssets.film, className: 'rsl-decor-film' }],
  delivery: [{ src: decorAssets.ring, className: 'rsl-decor-ring' }, { src: decorAssets.light, className: 'rsl-decor-light' }, { src: decorAssets.topdownBloom, className: 'rsl-decor-bloom' }],
  guestbook: [{ src: decorAssets.vow, className: 'rsl-decor-vow' }],
  people: [{ src: decorAssets.botanical, className: 'rsl-decor-botanical' }, { src: decorAssets.divider, className: 'rsl-decor-divider' }],
  film: [{ src: decorAssets.film, className: 'rsl-decor-film' }, { src: decorAssets.light, className: 'rsl-decor-light' }],
  soundtrack: [{ src: decorAssets.ring, className: 'rsl-decor-ring' }],
  behind: [{ src: decorAssets.botanical, className: 'rsl-decor-botanical' }, { src: decorAssets.film, className: 'rsl-decor-film' }, { src: decorAssets.topdownBloom, className: 'rsl-decor-bloom' }],
  capsule: [{ src: decorAssets.vow, className: 'rsl-decor-vow' }, { src: decorAssets.light, className: 'rsl-decor-light' }],
  thankYou: [{ src: decorAssets.botanical, className: 'rsl-decor-botanical' }, { src: decorAssets.divider, className: 'rsl-decor-divider' }],
}

function RecapDecor({ variant }: { variant: DecorVariant }) {
  return <div className={`rsl-section-decor rsl-section-decor-${variant}`} aria-hidden="true">{sectionDecor[variant].map((asset, index) => <img key={`${variant}-${asset.className}-${index}`} src={asset.src} alt="" className={`rsl-decor-art ${asset.className}`} loading="lazy" decoding="async" width="420" height="320" />)}</div>
}

function MediaFrame({ media, className = '', label = 'Anh ky niem' }: { media?: RedSpiderLilyMedia; className?: string; label?: string }) {
  if (media?.src) return <img className={className} src={media.src} alt={media.alt} loading="lazy" decoding="async" width="1200" height="1600" />
  return <div className={`rsl-media-placeholder ${className}`} role="img" aria-label={media?.alt ?? 'Anh ky niem dang duoc cap nhat'}><Flower weight="thin" aria-hidden="true" /><span>{label}</span><small>Khoanh khac se xuat hien o day</small></div>
}

function MediaLightbox({ items, onClose }: { items: RedSpiderLilyMedia[]; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown) }
  }, [onClose])
  useEffect(() => setIsZoomed(false), [index])
  const current = items[index]
  return createPortal(<div className="rsl-lightbox" role="dialog" aria-modal="true" aria-label="Album khoanh khac"><button type="button" className="rsl-lightbox-close" onClick={onClose} aria-label="Dong album"><X size={20} /></button><div className={`rsl-lightbox-stage ${isZoomed ? 'is-zoomed' : ''}`}><MediaFrame media={current} className="rsl-lightbox-media" label="Anh trong album" /><button type="button" className="rsl-lightbox-zoom" onClick={() => setIsZoomed((value) => !value)} aria-label={isZoomed ? 'Thu nho anh' : 'Phong to anh'}>{isZoomed ? <MagnifyingGlassMinus size={20} /> : <MagnifyingGlassPlus size={20} />}</button><p>{index + 1} / {items.length}</p></div><div className="rsl-lightbox-controls"><button type="button" onClick={() => setIndex((value) => (value - 1 + items.length) % items.length)} aria-label="Anh truoc"><ArrowLeft size={18} /></button><button type="button" onClick={() => setIndex((value) => (value + 1) % items.length)} aria-label="Anh tiep"><ArrowRight size={18} /></button></div></div>, document.body)
}

function GalleryButton({ label, items, onOpen }: { label: string; items: RedSpiderLilyMedia[]; onOpen: (items: RedSpiderLilyMedia[]) => void }) {
  return <button type="button" className="rsl-gallery-button" onClick={() => onOpen(items)}><ImagesSquare size={16} />{label}<span>{items.length} anh</span></button>
}

function MomentCarousel({ moments, onOpen }: { moments: RedSpiderLilyMoment[]; onOpen: (items: RedSpiderLilyMedia[]) => void }) {
  const [active, setActive] = useState(0)
  const move = (direction: number) => setActive((value) => (value + direction + moments.length) % moments.length)
  return <div className="rsl-3d-carousel" aria-roledescription="carousel" aria-label="Bo suu tap khoanh khac"><div className="rsl-3d-stage">{moments.map((moment, index) => { const offset = (index - active + moments.length) % moments.length; const position = offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : offset === moments.length - 1 ? 'is-prev' : 'is-hidden'; const gallery = moment.gallery?.length ? moment.gallery : [moment.cover]; return <article className={`rsl-3d-slide ${position}`} key={moment.id} aria-hidden={position !== 'is-active'}><button type="button" className="rsl-moment-open" onClick={() => onOpen(gallery)} aria-label={`Mo album ${moment.title}`}><MediaFrame media={moment.cover} className="rsl-moment-image" label="Anh khoanh khac" /></button><div className="rsl-moment-copy"><span>0{index + 1}</span><h3>{moment.title}</h3><p>{moment.description}</p><button type="button" className="rsl-icon-link" onClick={() => onOpen(gallery)} aria-label={`Mo album ${moment.title}`}><CaretRight size={18} /></button></div></article>})}</div><div className="rsl-3d-controls"><button type="button" onClick={() => move(-1)} aria-label="Khoanh khac truoc"><ArrowLeft size={18} /></button><span aria-live="polite">{active + 1} / {moments.length}</span><button type="button" onClick={() => move(1)} aria-label="Khoanh khac tiep"><ArrowRight size={18} /></button></div></div>
}

function BehindSceneRail({ items, onOpen }: { items: NonNullable<RedSpiderLilyOptionalContent['items']>; onOpen: (items: RedSpiderLilyMedia[]) => void }) {
  const [start, setStart] = useState(0)
  const visibleCount = Math.min(4, items.length)
  const canMove = items.length > visibleCount
  return <div className="rsl-behind-carousel"><div className="rsl-behind-rail">{items.map((item, index) => { const offset = (index - start + items.length) % items.length; const slotClass = offset < visibleCount ? `is-slot-${offset + 1}` : 'is-hidden'; const gallery = item.gallery?.length ? item.gallery : [item.media]; return <article className={`rsl-behind-item ${slotClass}`} key={item.id} aria-hidden={offset >= visibleCount}><button type="button" className="rsl-behind-open" onClick={() => onOpen(gallery)} aria-label={`Mo album ${item.title}`}><MediaFrame media={item.media} className="rsl-behind-media" label="Anh hau truong" /></button><div><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.caption}</p><GalleryButton label="Xem khoanh khac" items={gallery} onOpen={onOpen} /></div></article> })}</div>{canMove ? <div className="rsl-rail-controls"><button type="button" onClick={() => setStart((value) => (value - 1 + items.length) % items.length)} aria-label="Khoanh khac hau truong truoc"><ArrowLeft size={18} /></button><span>{start + 1} / {items.length}</span><button type="button" onClick={() => setStart((value) => (value + 1) % items.length)} aria-label="Khoanh khac hau truong tiep"><ArrowRight size={18} /></button></div> : null}</div>
}

function PeopleRail({ people, onOpen }: { people: NonNullable<RedSpiderLilyOptionalContent['people']>; onOpen: (items: RedSpiderLilyMedia[]) => void }) {
  return <div className="rsl-people-rail">{people.map((person) => { const gallery = person.gallery?.length ? person.gallery : [person.media]; return <article className="rsl-person" key={person.id}><button type="button" className="rsl-person-open" onClick={() => onOpen(gallery)} aria-label={`Mo album ${person.name}`}><MediaFrame media={person.media} className="rsl-person-media" label="Chan dung ky niem" /></button><div><h3>{person.name}</h3><p>{person.role}</p><GalleryButton label="Xem khoanh khac" items={gallery} onOpen={onOpen} /></div></article>})}</div>
}

function OptionalSection({ sectionKey, content }: { sectionKey: string; content: RedSpiderLilyOptionalContent }) {
  const [lightboxItems, setLightboxItems] = useState<RedSpiderLilyMedia[] | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  if (!content.enabled) return null
  const eyebrow = content.eyebrow ?? 'Ky uc them'
  const wishes = content.wishes ?? [{ id: 'wish-a', author: 'Mot nguoi ban', message: content.body }, { id: 'wish-b', author: 'Gia dinh', message: 'Nhung loi chuc duoc giu lai cung album.' }, { id: 'wish-c', author: 'Nhom ban than', message: 'Hen gap lai trong mot chuong khac.' }]
  const people = content.people ?? [
    { id: 'person-a', name: 'Gia dinh', role: 'Nhung nguoi luon o hang dau', media: { src: '', alt: 'Anh gia dinh', role: 'person' as const } },
    { id: 'person-b', name: 'Ban than', role: 'Nhung nguoi giu tieng cuoi', media: { src: '', alt: 'Anh ban than', role: 'person' as const } },
    { id: 'person-c', name: 'Doi ngu ngay cuoi', role: 'Cham chut tung chi tiet', media: { src: '', alt: 'Anh doi ngu', role: 'person' as const } },
  ]
  const items = content.items ?? [
    { id: 'behind-a', title: 'Buoi sang', caption: 'Nhung bo hoa dat canh cua so.', media: { src: '', alt: 'Anh buoi sang', role: 'behind-the-scenes' as const } },
    { id: 'behind-b', title: 'Chiec vay', caption: 'Mot khoang lang truoc khi canh cua mo ra.', media: { src: '', alt: 'Anh chiec vay', role: 'behind-the-scenes' as const } },
    { id: 'behind-c', title: 'Ban tiec', caption: 'Nhung chi tiet nho cho duoc nhin thay.', media: { src: '', alt: 'Anh ban tiec', role: 'behind-the-scenes' as const } },
    { id: 'behind-d', title: 'Sau canh ga', caption: 'Mot cai nam tay truoc khi buoc ra.', media: { src: '', alt: 'Anh sau canh ga', role: 'behind-the-scenes' as const } },
  ]
  const capsuleGallery = content.gallery?.length ? content.gallery : content.media ? [content.media] : []

  if (sectionKey === 'guestbook') return <section className="rsl-guestbook" data-editor-section={sectionKey}><RecapDecor variant="guestbook" /><div className="rsl-optional-intro"><p className="rsl-eyebrow">{eyebrow}</p><h2>{content.title}</h2><p>{content.intro ?? content.body}</p></div><div className="rsl-wish-list">{wishes.map((wish, index) => <article className="rsl-wish" key={wish.id}><Quotes size={22} aria-hidden="true" /><p>{wish.message}</p><strong>{wish.author}</strong><span>0{index + 1}</span></article>)}</div><MediaFrame media={content.media} className="rsl-guestbook-media" label="Anh ky niem tu ngay cuoi" /></section>

  if (sectionKey === 'peopleBehindTheDay') return <section className="rsl-people" data-editor-section={sectionKey}><RecapDecor variant="people" /><div className="rsl-optional-intro"><p className="rsl-eyebrow">{eyebrow}</p><h2>{content.title}</h2><p>{content.body}</p></div><PeopleRail people={people} onOpen={setLightboxItems} />{lightboxItems ? <MediaLightbox items={lightboxItems} onClose={() => setLightboxItems(null)} /> : null}</section>

  if (sectionKey === 'weddingFilm') return <section className="rsl-film" data-editor-section={sectionKey}><RecapDecor variant="film" /><div className="rsl-film-poster" data-tilt><MediaFrame media={content.poster} className="rsl-film-media" label="Poster video ngay cuoi" /><button type="button" className="rsl-play-button" aria-label={content.ctaLabel ?? 'Xem video'}><Play weight="fill" /></button><span className="rsl-film-duration">{content.duration ?? '00:00'}</span></div><div className="rsl-film-copy"><p className="rsl-eyebrow">{eyebrow}</p><h2>{content.title}</h2><p>{content.body}</p><span className="rsl-media-action"><Play size={14} aria-hidden="true" /> {content.ctaLabel ?? 'Xem thuoc phim'}</span></div></section>

  if (sectionKey === 'soundtrack') return <section className={`rsl-soundtrack ${isPlaying ? 'is-playing' : ''}`} data-editor-section={sectionKey}><RecapDecor variant="soundtrack" /><div className="rsl-record"><MediaFrame media={content.cover} className="rsl-record-cover" label="Anh bia nhac" /><span className="rsl-record-hole" /><span className="rsl-record-ripple" aria-hidden="true" /></div><div className="rsl-track-copy"><p className="rsl-eyebrow">{eyebrow}</p><h2>{content.title}</h2><p>{content.body}</p><div className="rsl-track-meta"><MusicNotes size={18} aria-hidden="true" /><div><strong>{content.track ?? 'Mot ngay rat diu'}</strong><small>{content.artist ?? 'Ban ghi cua chung minh'}</small></div><span>{content.duration ?? '03:42'}</span></div><div className="rsl-player-line"><span /><i /><i /><i /><i /><button type="button" aria-label={isPlaying ? 'Tam dung nhac' : 'Phat nhac'} aria-pressed={isPlaying} onClick={() => setIsPlaying((value) => !value)}>{isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}</button></div><div className="rsl-music-notes" aria-hidden="true"><MusicNotes /><MusicNotes /><MusicNotes /></div></div></section>

  if (sectionKey === 'behindTheScenes') return <section id="rsl-behind" className="rsl-behind" data-editor-section={sectionKey}><RecapDecor variant="behind" /><div className="rsl-optional-intro"><p className="rsl-eyebrow">{eyebrow}</p><h2>{content.title}</h2><p>{content.body}</p></div><BehindSceneRail items={items} onOpen={setLightboxItems} />{lightboxItems ? <MediaLightbox items={lightboxItems} onClose={() => setLightboxItems(null)} /> : null}</section>

  return <section className="rsl-capsule" data-editor-section={sectionKey}><RecapDecor variant="capsule" /><button type="button" className="rsl-capsule-open" onClick={() => capsuleGallery.length && setLightboxItems(capsuleGallery)} aria-label={`Mo album ${content.title}`}><MediaFrame media={content.media} className="rsl-capsule-media" label="Anh chuong tiep theo" /></button><div className="rsl-capsule-letter"><p className="rsl-eyebrow">{eyebrow}</p><h2>{content.title}</h2><p>{content.body}</p><strong>{content.date ?? 'Mot ngay sau nay'}</strong>{capsuleGallery.length ? <GalleryButton label="Xem khoanh khac" items={capsuleGallery} onOpen={setLightboxItems} /> : <span>Viet tiep cau chuyen</span>}</div>{lightboxItems ? <MediaLightbox items={lightboxItems} onClose={() => setLightboxItems(null)} /> : null}</section>
}

type RecapEditorState = { data?: RedSpiderLilyRecapContent; sectionConfig: { enabled: string[]; order: string[] } }

export function RedSpiderLilyRecap({ data: initialData = redSpiderLilyRecapFixture.content }: { data?: RedSpiderLilyRecapContent }) {
  const [lightboxItems, setLightboxItems] = useState<RedSpiderLilyMedia[] | null>(null)
  const [data, setData] = useState(initialData)
  useEffect(() => setData(initialData), [initialData])
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.red-spider-lily-recap')
    const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!root) return
    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const href = link?.getAttribute('href')
      if (!link || !href) return
      const chapter = link.closest<HTMLElement>('.rsl-chapter')
      if (chapter && link.classList.contains('rsl-text-link')) {
        const chapterIndex = Array.from(root.querySelectorAll('.rsl-chapter')).indexOf(chapter)
        if (chapterIndex >= 0) {
          event.preventDefault()
          setLightboxItems(data.chapters[chapterIndex].gallery?.length ? data.chapters[chapterIndex].gallery : [data.chapters[chapterIndex].cover])
          return
        }
      }
      if (href === '#top') {
        event.preventDefault()
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
        return
      }
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
    root.addEventListener('click', onAnchorClick)
    if (!('IntersectionObserver' in window) || reducedMotion) return () => { root.classList.remove('is-motion-ready'); root.removeEventListener('click', onAnchorClick) }
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-editor-section]'))
    sections.filter((section) => section.getBoundingClientRect().top < window.innerHeight * 0.92).forEach((section) => section.classList.add('is-visible'))
    root.classList.add('is-motion-ready')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    sections.forEach((section) => observer.observe(section))
    const parallaxItems = Array.from(root.querySelectorAll<HTMLElement>('.rsl-hero-media,.rsl-story-media,.rsl-chapter-image,.rsl-moment-image,.rsl-capsule-media,.rsl-decor-art'))
    let frame = 0
    const updateParallax = () => {
      frame = 0
      parallaxItems.forEach((element) => {
        const bounds = element.getBoundingClientRect()
        const distance = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * 0.055
        element.style.setProperty('--parallax-y', `${Math.max(-24, Math.min(24, distance)).toFixed(2)}px`)
      })
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateParallax) }
    updateParallax()
    window.addEventListener('scroll', onScroll, { passive: true })
    const tilts = Array.from(root.querySelectorAll<HTMLElement>('[data-tilt]'))
    const cleanups = tilts.map((element) => {
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const bounds = element.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5
        element.style.setProperty('--tilt-x', `${(x * 8).toFixed(2)}deg`)
        element.style.setProperty('--tilt-y', `${(y * -8).toFixed(2)}deg`)
      }
      const leave = () => { element.style.setProperty('--tilt-x', '0deg'); element.style.setProperty('--tilt-y', '0deg') }
      element.addEventListener('pointermove', move)
      element.addEventListener('pointerleave', leave)
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave) }
    })
    return () => { observer.disconnect(); cleanups.forEach((cleanup) => cleanup()); window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame); root.classList.remove('is-motion-ready'); root.removeEventListener('click', onAnchorClick) }
  }, [data])
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('editor') !== '1') return
    const applyEditorConfig = ({ enabled, order }: RecapEditorState['sectionConfig']) => {
      const root = document.querySelector<HTMLElement>('.red-spider-lily-recap')
      if (!root) return
      const sections = new Map(Array.from(root.querySelectorAll<HTMLElement>('[data-editor-section]')).map((section) => [section.dataset.editorSection ?? '', section]))
      const footer = root.querySelector<HTMLElement>('.rsl-footer')
      order.forEach((key) => { const section = sections.get(key); if (!section) return; if (footer) root.insertBefore(section, footer); else root.appendChild(section) })
      sections.forEach((section, key) => { section.hidden = !enabled.includes(key) })
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (isLiveEditorUpdate<RecapEditorState>(event.data)) {
        const { enabled, order } = event.data.payload.sectionConfig
        if (event.data.payload.data) setData(event.data.payload.data)
        applyEditorConfig(event.data.payload.sectionConfig)
        document.documentElement.dataset.recapEnabled = enabled.join(',')
        document.documentElement.dataset.recapOrder = order.join(',')
      }
      if (isLiveEditorScroll<string>(event.data)) {
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        document.querySelector<HTMLElement>(`[data-editor-section="${event.data.payload.sectionKey}"]`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
      }
    }
    window.addEventListener('message', onMessage)
    window.parent.postMessage({ type: liveEditorEvents.ready, version: 1 }, window.location.origin)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return <main className="red-spider-lily-recap">
    <div className="rsl-ambient" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
    <section className="rsl-hero" data-editor-section="hero"><RecapDecor variant="hero" /><div className="rsl-hero-wash" aria-hidden="true" /><div className="rsl-hero-media"><MediaFrame media={data.hero.media} label="Anh bia album" /></div><div className="rsl-hero-content"><p className="rsl-eyebrow">Wedding memories</p><p className="rsl-date">{data.hero.date}{data.hero.place ? `  ·  ${data.hero.place}` : ''}</p><h1>{data.hero.couple}</h1><p className="rsl-hero-tagline">{data.hero.tagline}</p><a className="rsl-text-link" href="#rsl-story">{data.hero.ctaLabel}<ArrowDown size={16} aria-hidden="true" /></a></div><span className="rsl-hero-mark" aria-hidden="true">01</span></section>
    <section id="rsl-story" className="rsl-story" data-editor-section="ourStory"><RecapDecor variant="story" /><div className="rsl-section-intro"><p className="rsl-eyebrow">{data.ourStory.eyebrow}</p><h2>{data.ourStory.title}</h2></div><div className="rsl-story-copy"><p>{data.ourStory.body}</p>{data.ourStory.quote ? <blockquote>“{data.ourStory.quote}”</blockquote> : null}<span className="rsl-media-action">Mot khung hinh giu lai buoi chieu hom ay.</span></div><div className="rsl-story-media">{data.ourStory.media.length ? data.ourStory.media.map((media) => <MediaFrame key={media.alt} media={media} label="Anh loi dan" />) : <MediaFrame media={{ src: '', alt: 'Anh loi dan', role: 'story' }} label="Anh loi dan" />}</div></section>
    <section className="rsl-chapters" data-editor-section="chapters"><RecapDecor variant="chapters" /><div className="rsl-chapters-head"><div><p className="rsl-eyebrow">Nhung chuong da qua</p><h2>Di qua tung ngay<br /><em>da lam nen chung minh.</em></h2></div><span className="rsl-section-index">03 / 06</span></div><div className="rsl-chapter-list">{data.chapters.map((chapter, index) => { const gallery = chapter.gallery?.length ? chapter.gallery : [chapter.cover]; return <article className="rsl-chapter" key={chapter.id}><div className="rsl-chapter-number">0{index + 1}</div><button type="button" className="rsl-chapter-open" onClick={() => setLightboxItems(gallery)} aria-label={`Mo album ${chapter.title}`}><MediaFrame media={chapter.cover} className="rsl-chapter-image" label="Anh chapter" /></button><div className="rsl-chapter-copy"><p className="rsl-eyebrow">{chapter.dateLabel}</p><h3>{chapter.title}</h3><p>{chapter.description}</p><GalleryButton label="Mo album ky niem" items={gallery} onOpen={setLightboxItems} /></div></article> })}</div></section>
    <section className="rsl-moments" data-editor-section="moments"><RecapDecor variant="moments" /><div className="rsl-moments-heading"><p className="rsl-eyebrow">Nhung khoanh khac</p><h2>Dieu chung minh<br /><em>se luon nho.</em></h2><p>Nhung nhom ky uc nho lam ngay hom ay tro nen that rieng.</p></div><MomentCarousel moments={data.moments} onOpen={setLightboxItems} /></section>
    <section id="rsl-photo-delivery" className="rsl-delivery" data-editor-section="photoDelivery"><RecapDecor variant="delivery" /><div className="rsl-delivery-seal" aria-hidden="true"><ImagesSquare weight="thin" /></div><div><p className="rsl-eyebrow">{data.photoDelivery.eyebrow}</p><h2>{data.photoDelivery.title}</h2><p>{data.photoDelivery.body}</p></div><a className="rsl-solid-link" href={data.photoDelivery.albumUrl || '#rsl-photo-delivery'} target={data.photoDelivery.albumUrl ? '_blank' : undefined} rel={data.photoDelivery.albumUrl ? 'noreferrer' : undefined}>{data.photoDelivery.ctaLabel}<ArrowUpRight size={17} aria-hidden="true" /></a></section>
    <OptionalSection sectionKey="guestbook" content={data.optional.guestbook} /><OptionalSection sectionKey="peopleBehindTheDay" content={data.optional.peopleBehindTheDay} /><OptionalSection sectionKey="weddingFilm" content={data.optional.weddingFilm} /><OptionalSection sectionKey="soundtrack" content={data.optional.soundtrack} /><OptionalSection sectionKey="behindTheScenes" content={data.optional.behindTheScenes} /><OptionalSection sectionKey="memoryCapsule" content={data.optional.memoryCapsule} />
    <section className="rsl-thank-you" data-editor-section="thankYou"><RecapDecor variant="thankYou" /><div className="rsl-thank-you-image"><MediaFrame media={data.thankYou.media} label="Anh loi cam on" /></div><div className="rsl-thank-you-copy"><p className="rsl-eyebrow">Loi cam on</p><h2>{data.thankYou.title}</h2><p>{data.thankYou.body}</p><strong>{data.thankYou.signature}</strong><small>{data.thankYou.date}</small></div></section><footer className="rsl-footer"><span>{data.thankYou.signature}</span><span>{data.thankYou.date}</span><a href="#top" aria-label="Ve dau trang"><ArrowUp size={17} /></a></footer>{lightboxItems ? <MediaLightbox items={lightboxItems} onClose={() => setLightboxItems(null)} /> : null}
  </main>
}
