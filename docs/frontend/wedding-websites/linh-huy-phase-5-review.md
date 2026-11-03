# Linh & Huy / Forever — Phase 5 integration review

**Status:** implementation integrated; Phase 5 remains open pending visual browser review across desktop, tablet, mobile, and reduced motion.

## Decor and atmosphere map

Decor is selected by `sectionKey` in `ForeverWebsite.tsx`, so it follows the section when the owner reorders or disables it. The complete runtime source/provenance list is in [`ASSET_MANIFEST.md`](../../../frontend/src/templates/websites/forever/ASSET_MANIFEST.md); approved source art and prompts remain in [`Phase 2.5`](./linh-huy-phase-2-5/PHASE-2.5.md).

| Section | Renderer-owned treatment |
|---|---|
| Announcement | Ribbon and pen cutout |
| Couple | Silver wedding bands cutout |
| Story | Vows booklet cutout and section-bounded paper-dust drift |
| Events | Joined-line accent and paper-dust drift |
| Countdown | Low-opacity curved-line background plate |
| Gallery | Open-corner photo frame and restrained CSS 3D photo plane |
| RSVP | Desktop curve SVG, mobile curve SVG, and slow background drift |
| Other sections | Low-density paper-dust drift bounded to the section |

## Implemented safeguards

- Decorative assets are `aria-hidden`, pointer inert, mapped to stable section keys, and kept separate from user media.
- Props float slowly only while their section is in view. Section atmosphere pauses offscreen and when the document tab is hidden.
- Mobile lowers decor opacity and density. Gallery depth becomes a static 2D layout on touch/mobile; fine-pointer hover is optional enhancement.
- Reduced motion keeps the approved artwork visible but disables dust, drift, float, gallery depth, hover, and reveal animation.
- The page has no canvas or WebGL runtime; the ambient layer uses lightweight CSS gradients and bounded CSS transforms.
- Hero copy and the lower banner details reveal immediately on page load; scroll-triggered reveal timing starts with the following sections. Story milestone photos remain optional and open in a focused lightbox only when present.

## Verification

- Targeted ESLint for `ForeverWebsite.tsx`: passed.
- `git diff --check`: passed.
- Frontend production build: passed after installing the already-declared `react-filerobot-image-editor@4.9.1` locally without saving package or lockfile changes. Vite reports the existing large `MediaEditPanel`/app chunks above 500 kB.
- Browser screenshot/visual contrast review at 375, 390, 768, and 1280px: still required. The local workspace has no Playwright/Puppeteer package or browser executable available for screenshot review.

Do not mark the theme release-ready until the screenshot review and the normal frontend build gate pass.
