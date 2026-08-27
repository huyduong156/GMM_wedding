# Red Spider Lily Recap - Phase 5 Review and Release

Template key: `red-spider-lily-recap`
Renderer: `frontend/src/templates/recaps/red-spider-lily/RedSpiderLilyRecap.tsx`

Phase status: automated release gates complete; Chrome headless first-viewport smoke checked on desktop and mobile. Full multi-section browser screenshot review remains a release gate.

## Review scope

The review covers all six required sections and all six optional sections in the public preview. It checks section order, repeatable content, gallery ownership, lightbox behavior, responsive layout contracts, reduced-motion fallbacks, media independence, overflow rules and release commands.

## Interaction and UX audit

| Area | Review result | Evidence |
|---|---|---|
| Required and optional sections | Pass | Renderer test asserts 12 sections and semantic order |
| Moments 3D carousel | Pass | Active/previous/next states, keyboard buttons and multi-image gallery test |
| Timeline chapters | Pass | Semantic cover button and gallery action open chapter gallery |
| People behind the day | Pass | Each person cover and gallery button open the selected album |
| Behind the scenes | Pass | Four-card 3D slot carousel with previous/next controls, padded cards and per-item gallery |
| Memory capsule | Pass | Cover and gallery action open the capsule album |
| Lightbox | Pass | Portal rendering, body scroll lock, previous/next, zoom and Escape close |
| Soundtrack | Pass | Motion starts in the active preview state and can be paused by the viewer |
| Per-section artwork | Pass | Regenerated v2 PNG decor assets, the new top-down bloom and retained vow/botanical assets are mapped across all 12 sections through `theme.artworkManifest` and `RecapDecor`; the petal sprite is retained only as a source asset for future extracted particles |
| Decor motion semantics | Pass | Non-symmetric artwork uses breathing, sway, drift or parallax; only the vinyl record keeps circular rotation because it is a radial object |
| Reduced motion | Pass | Section reveal, parallax, 3D transitions and ambient motion have static fallbacks |
| Preview copy | Pass | Renderer/upload labels are hidden from viewer-facing copy; fixture contains mock guest wishes |
| Media independence | Pass | Demo media is replaceable and theme identity remains in typography, palette, layout and renderer-owned decor |

## Responsive and overflow audit

- Desktop: 3D Moments stage has a stable bounded height; card media and copy use explicit flex geometry.
- Tablet: Moments remains a single active card with adjacent depth cues; People uses two columns; Behind scenes uses two columns.
- Mobile: Moments keeps one active slide; People uses one column; Behind scenes keeps one visible card per window.
- Repeated media uses `object-fit: cover` inside fixed frames; source aspect ratio is never squeezed into the frame.
- Carousel parents remain overflow-visible where hover depth is required; only the image frame clips its own image zoom.
- CTA foreground colors are explicitly scoped against the base anchor inheritance rule.
- Section reveal is scoped behind `.is-motion-ready`, so content remains visible if JavaScript or IntersectionObserver fails.
- Generated overlay assets are either masked full-section atmospheres or self-contained floating objects. A generated frame/light asset must not be placed in a section corner where its crop edge is visible.

## Automated validation

- `npm run lint` - pass
- `npm run typecheck` - pass
- `npm run test -- --run src/templates/recaps/red-spider-lily/RedSpiderLilyRecap.test.tsx` - 6 tests pass
- `npm run build` - pass
- `git diff --check` - no whitespace errors; existing line-ending warnings remain informational
- Preview route responds `200 OK`: `/templates/recaps/red-spider-lily/preview`
- Chrome headless smoke screenshots checked for desktop `1440x900` and mobile `390x844`; hero content, CTA contrast and mobile couple-photo crop render correctly.
- Chrome CDP screenshot checked `#rsl-behind`; the behind-the-scenes 3D slot carousel keeps four padded visible cards, no inner scrollbar and no box-shadow collision with text.

## Remaining release gate

- [ ] Capture and inspect full-page desktop, tablet, mobile and reduced-motion screenshots in a browser runtime.
- [ ] Confirm actual font loading, computed CTA contrast and rendered carousel bounds across lower sections in the browser.
- [ ] Confirm external album behavior with a real `https:` album URL in an integration environment.

The template remains `draft` until the browser screenshot gate is completed.
