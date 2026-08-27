# Red Spider Lily Recap - Phase 4

Template key: `red-spider-lily-recap`
Renderer: `frontend/src/templates/recaps/red-spider-lily/RedSpiderLilyRecap.tsx`

Phase status: Phase 4 complete for the current preview renderer. Phase 5 release review is tracked in `red-spider-lily-phase-5.md`.

## Art direction

The motion layer uses a restrained vermilion botanical thread over the paper and ink album composition. Renderer-owned artwork is independent from user photos and stays self-contained with transparent padding so it can float without relying on a viewport edge.

## Technique map

| Area | Technique | Purpose | Fallback |
|---|---|---|---|
| All sections | IntersectionObserver reveal | Gives each chapter a clear arrival without hiding content | Static fully visible sections |
| Background | Bounded falling petal drift | Keeps the paper background alive while the viewer pauses | Static paper background |
| Hero / ambient | Slow botanical drift plus masked full-section light-leak overlay | Reinforces the red spider lily identity without exposing image edges | Hidden/static when reduced motion is enabled |
| All 12 sections | Section-specific floating decor pair | Keeps a long preview connected while each section keeps a distinct visual role | Static self-contained artwork |
| Hero / story / chapters / moments / capsule / decor | Scroll-linked parallax depth | Makes the long album feel spatial instead of a stack of static sections | Bounded to +/-24px and removed on reduced motion |
| Moments | 3D coverflow carousel with active / previous / next states | Gives the memory collection a real depth-based slide interaction | Single active card with reduced-motion fallback |
| Chapters / timeline | Cover click and album action open the recap lightbox | Keeps timeline entries useful in the public preview | Single cover fallback |
| Wedding film | Pointer-only perspective tilt | Adds a controlled 3D depth cue to the film poster | Flat poster on touch/mobile |
| Soundtrack | Play-state vinyl rotation, ripple, waveform and floating notes | Gives the music section a meaningful active state without autoplay | Static record and controls when paused/reduced motion |
| People / behind scenes | Horizontal snap rail | Supports repeatable items without visible scrollbar | Native horizontal touch/trackpad scroll |
| Behind scenes preview | Four-card window with previous/next controls | Shows repeatable content without an inner scrollbar | One-card window on mobile |
| Gallery | Lightbox previous/next plus explicit zoom | Allows each repeatable card to own a variable album and inspect media without leaving the page | Single cover fallback |

## Motion rules

- Reveal uses `transform` and `opacity`, 700ms ease-out, once per section.
- Ambient petals use low density, bounded viewport animation and no React state per frame.
- Asymmetric decor assets must not use continuous circular spin. They use subtle sway, breathing, parallax or organic drift unless the asset is radially symmetric.
- `red-spider-lily-light-leak-v2.png` is treated as a masked full-section atmosphere overlay. It must not be pinned to a visible section corner because that exposes the generated frame edge.
- Film tilt is enabled only for mouse input and resets on pointer leave.
- Mobile keeps native vertical scroll and does not hijack wheel or touch gestures.
- Internal anchors use smooth scrolling and switch to instant scrolling when reduced motion is requested.
- Preview copy contains guest mock wishes and viewer-facing album language; editor/upload labels are not rendered in the public preview.
- `prefers-reduced-motion: reduce` makes sections static, hides ambient particles and removes tilt.

## Artwork manifest

| File | Role | Placement | Alpha / edge behavior | Provenance |
|---|---|---|---|---|
| `red-spider-lily-botanical-cluster.png` | Organic / Floating Decorative Element | Upper-right hero-to-story atmosphere | Transparent, full object, no edge dependency | Generated with Codex imagegen, 2026-08-26; prompt recorded in image-generation-agent handoff |
| `red-spider-lily-vow-prop.png` | Self-contained Supporting Element | Left side around story/chapter transition | Transparent, full object, no text or couple identity | Generated with Codex imagegen, 2026-08-26; prompt recorded in image-generation-agent handoff |
| `red-spider-lily-petal-sprite.png` | Ambient source sprite | Source/provenance only for future extracted particles; current renderer does not render the full sheet as a floating object | Not a self-contained cutout; never spin or place the full sheet as decor | Generated with Codex imagegen, 2026-08-26; prompt recorded in image-generation-agent handoff |
| `red-spider-lily-ring-prop.svg` | Self-contained ring prop | Chapters, photo delivery and soundtrack | Full vector object, no edge dependency | Project-authored vector artwork, 2026-08-27 |
| `red-spider-lily-film-ribbon.svg` | Floating film / divider prop | Moments, wedding film and behind-the-scenes | Full vector object, no edge dependency | Project-authored vector artwork, 2026-08-27 |
| `red-spider-lily-divider-thread.svg` | Section transition divider | Story, chapters, people and thank-you seams | Full vector object, no edge dependency | Project-authored vector artwork, 2026-08-27 |
| `red-spider-lily-light-leak.svg` | Ambient overlay / light movement | Hero, photo delivery, film and capsule | Full vector object, not used as content media | Project-authored vector artwork, 2026-08-27 |
| `red-spider-lily-ring-prop-v2.png` | Self-contained ring prop | Chapters, photo delivery and soundtrack | Transparent alpha, full object, no edge dependency | Generated with Codex imagegen, 2026-08-27; background-extracted for bundle use |
| `red-spider-lily-film-ribbon-v2.png` | Floating film ribbon / decor prop | Moments, wedding film and behind-the-scenes | Transparent alpha, full object, no edge dependency | Generated with Codex imagegen, 2026-08-27; background-extracted for bundle use |
| `red-spider-lily-divider-thread-v2.png` | Section transition divider | Story, chapters, people and thank-you seams | Transparent alpha, full object, not screen-edge dependent | Generated with Codex imagegen, 2026-08-27; background-extracted for bundle use |
| `red-spider-lily-light-leak-v2.png` | Ambient overlay / light movement | Hero, photo delivery, film and capsule | Masked full-section overlay; no visible generated border or corner cut | Generated with Codex imagegen, 2026-08-27; alpha preserved for bundle use |
| `red-spider-lily-topdown-bloom.png` | Top-down floating bloom | Hero, photo delivery and behind-the-scenes | Transparent alpha, no visible stems, full flower heads; organic sway only, no circular spin | Generated with Codex imagegen, 2026-08-27; background-extracted for bundle use |

Asset path: `frontend/public/assets/images/templates/red-spider-lily/`.

## Preview demo media

The fixture uses two local Asian wedding couple photos so every user-media slot can be reviewed with realistic content. They are preview-only fixture content and remain replaceable by owner media in the editor; they are not renderer-owned theme identity.

| File | Source page | License |
|---|---|---|
| `demo/asian-couple-arch.jpg` | [A bride and groom stand before a beautiful wedding arch](https://unsplash.com/photos/a-bride-and-groom-stand-before-a-beautiful-wedding-arch-8GCS7MKzub8) | Unsplash License |
| `demo/asian-couple-portrait.jpg` | [A smiling bride and groom pose at their wedding](https://unsplash.com/photos/a-smiling-bride-and-groom-pose-at-their-wedding-VA8VxEFnUGM) | Unsplash License |
| `demo/bridal-bouquet-detail.jpg` | [Bride holding flower bouquet](https://unsplash.com/photos/bride-holding-flower-bouquet-295NLwGdrKM) | Unsplash License |
| `demo/wedding-table-detail.jpg` | [A table set up for a wedding reception](https://unsplash.com/photos/a-table-set-up-for-a-wedding-reception-i3rFV6ULk-o) | Unsplash License |

The Unsplash license permits free commercial and non-commercial use; the local copies are recorded here to avoid hotlinking in the preview.

## Acceptance checklist

- [x] Every section receives a viewport arrival state through the shared observer.
- [x] Background has a restrained moving atmosphere and static fallback.
- [x] Twelve renderer-owned artworks are recorded; the active renderer uses regenerated v2 PNG decor plus the original vow/botanical/petal assets to cover the six-plus artwork requirement for the 12-section preview.
- [x] One section has a pointer-driven 3D treatment with mobile fallback.
- [x] Moments has a real 3D coverflow slide interaction and scroll-linked media parallax.
- [x] Soundtrack has an explicit play-state motion model without autoplay.
- [x] Motion does not depend on user-uploaded media.
- [x] Reduced motion keeps content, CTA and semantic order intact.
- [x] Rail and lightbox interactions remain keyboard-accessible.
- [ ] Desktop, tablet, mobile and reduced-motion screenshot review is assigned to the Phase 5 release report; browser capture remains an explicit release gate.
