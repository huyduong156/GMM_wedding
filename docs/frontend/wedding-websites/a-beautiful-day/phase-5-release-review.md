# A Beautiful Day — Phase 5 Release Review

Status: Phase 5 frontend implementation and artwork QA completed 2026-10-23. `template-config.ts` remains `draft` / `0.1.0` until the public media projection and release workflow can supply approved image URLs with accessible alt text and pin a released template version.

## Implemented

- Bounded ambient light, curtain, and botanical motion uses the approved renderer-owned props. Motion is controlled by the page pause button, stops for reduced motion, editor mode, missing observer support, touch/mobile layouts, hidden tabs, and an open gallery dialog. The existing desktop hero depth and sticky story progress remain available.
- RSVP and guestbook forms use the shared public interaction hooks. They pass the personal guest name when a guest link is used, distinguish pending/error/success, and stay disabled in draft/editor preview. Approved wishes from the snapshot remain visible while the live wish request loads.
- The optional music control resolves the selected ready track through the existing public catalog and starts only after a user presses play. Playback stops when the tab is hidden or the component unmounts. Missing, unready, or failed tracks leave no broken control.
- Public SEO metadata uses the configured `seo.title`, `seo.description`, and an actual URL from `seo.ogImageId`, with the shared website fallback when no image URL is present. Canonical URL remains the public wedding route.
- Each public event has a downloadable RFC 5545 `.ics` calendar action with UTC event time and escaped summary/location. Invalid or non-public events do not receive the action.
- The A Beautiful Day template is registered for editor catalog/config resolution. Its direct preview route uses the live-editor message bridge and canonical content adapter; the public website dispatcher passes the immutable snapshot through the same renderer and existing guest, RSVP, wish, and music APIs.
- Fourteen approved PNG sources were resized where appropriate and encoded as lossless WebP. The decoded visible RGB and every alpha value match the resized source. A 28-cell contact sheet reviewed each optimized transparent edge on ivory and dark backgrounds. The public bundle is 7,200,926 bytes versus 28,177,172 bytes for the original set (74.4% smaller). Originals remain under `assets/templates/a-beautiful-day/originals/`.

## Release gates

| Gate | Result | Evidence / remaining work |
| --- | --- | --- |
| Artwork approval, dimensions, alpha fidelity, light/dark edge review, budgets | Pass | [`asset-manifest.md`](./asset-manifest.md), local ignored `tmp/abd-p5-asset-report.json`, `tmp/abd-p5-alpha-contact.png` |
| Source-to-public image paths | Pass | Renderer and artwork docs reference the WebP bundle; source template directory contains no artwork folders |
| Preview, editor bridge, registry mapping | Implemented; saved editor round trip pending | Preview consumes live editor state and shared bridge events; verify after the template version is available through catalog/content APIs |
| RSVP and guestbook API adapters | Implemented; backend smoke pending | Existing shared public hooks are used; backend is outside this frontend-only phase |
| Music playback and event calendar | Implemented; runtime smoke pending | Public READY track lookup, click-to-play, visibility cleanup, and `.ics` generation are wired |
| SEO title, description, canonical and Open Graph image | Implemented; crawler snapshot smoke pending | Shared metadata helper reads nested template SEO and safely ignores media IDs without a URL |
| User-media READY projection with accessible alt text | **Blocked** | Current immutable publication payload has no normalized READY media projection. Do not infer image readiness or alt text from an ID. Complete the media contract in a separate cross-system change, then validate missing, PROCESSING, FAILED, and READY assets. |
| Template release/publish | **Blocked** | Draft `0.1.0` is not present as a released catalog version. Keep the status unchanged until the normal validation and version-release workflow has run. |

## Review boundaries

This phase changes frontend template source, frontend preview/public routing, frontend metadata handling, approved public artwork formats, and frontend theme documentation. It does not change backend contracts or database schemas. It does not claim a public release, successful API transaction, or social-crawler verification without the corresponding environment checks.

## Validation

- Visual alpha inspection: 28 optimized-artwork/background combinations reviewed from `tmp/abd-p5-alpha-contact.png`.
- Pixel check: all 14 outputs report `alphaDifferences: 0` and `visibleRgbDifferences: 0` against their resized source.
- Frontend typecheck, lint, and production build passed after integration. The build generated its release bundle with 14 existing released templates; A Beautiful Day remains excluded while draft. The production build reports the existing large-chunk warning (1,381.93 kB main JS and 1,016.73 kB image editor).
- Browser/API smoke for saved-editor publication, public interaction endpoints, and crawler metadata remains pending until the media projection and template release gates are resolved; see the template [`README.md`](../../../../frontend/src/templates/websites/a-beautiful-day/README.md) for the full validation commands.
