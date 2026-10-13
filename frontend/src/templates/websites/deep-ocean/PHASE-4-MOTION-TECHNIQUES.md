# Deep Ocean - Phase 4 Motion and Interaction

Phase status: `complete` for the motion system and interaction fallback. Final artwork placement, ambient atmosphere review and release validation remain Phase 5.

## Motion direction

Deep Ocean uses a single signature rhythm: a slow tide reveal. Sections enter with a restrained upward settle, repeated memories arrive in a short stagger, and the hero image gains a small amount of desktop-only depth while pearl markers drift gently in place. The motion supports the ocean metaphor without turning the website into a scroll-controlled scene.

## Technique map

| Technique | Sections | Purpose | Trigger / budget | Fallback |
| --- | --- | --- | --- | --- |
| Viewport reveal | All enabled sections | Establish reading order as each chapter arrives | `IntersectionObserver` through `motion/react`; 720ms, shared ease-out, once per section | Content stays in document flow and appears immediately if observer is unavailable |
| Staggered item reveal | `timeline`, `gallery`, `people`, `wishes` | Preserve sequence inside repeatable content | Transform/opacity only; 70ms item step, no layout animation | Items remain static and fully visible |
| Desktop hero parallax | `hero` background only | Add shallow horizon depth while scrolling | Fine pointer, >= 701px; max 72px travel; one image layer | Native mobile scroll and static background |
| Pearl drift | Hero pearl markers | Give the page a quiet living-water cue | CSS transform-adjacent motion, 5.6s loop, decorative only | Static pearls under reduced motion |
| Hover/focus transitions | Links, gallery captions and controls | Clarify affordance without moving touch targets | CSS color/opacity/transform transitions under 250ms | Native focus and press behavior |

## Responsive and accessibility map

- Mobile remains the primary composition: sections stay in native vertical flow, hero parallax is disabled below 701px, and no horizontal scrolling is introduced.
- Fine-pointer checks gate the parallax behavior; touch and coarse-pointer devices receive the static composition.
- `prefers-reduced-motion: reduce` disables reveal, stagger, parallax, pearl drift and transitions while preserving every section and content anchor.
- The reveal wrapper has an immediate-visible fallback when `IntersectionObserver` is unavailable; motion never owns content visibility permanently.
- Only `transform` and `opacity` are animated. Section backgrounds remain one continuous pearl canvas; visual differentiation uses borders, spacing, image planes and typography.
- No animation blocks keyboard focus, native scrolling, media alt text or the music control.

## Phase 4 acceptance checklist

- [x] Every enabled section has a purposeful entrance state.
- [x] At least one signature interaction is implemented: desktop-only hero depth/parallax.
- [x] Repeated content has a controlled stagger with transform/opacity only.
- [x] Mobile and coarse-pointer fallbacks use native vertical scrolling.
- [x] Reduced-motion removes all non-essential animation and keeps content visible.
- [x] Observer/platform fallback keeps content visible when motion APIs are unavailable.
- [x] The page uses one continuous background instead of independent section color bands.
- [x] Motion timing, trigger, easing, budget and fallback are documented.

Phase 5 will place the approved renderer-owned artwork, add any bounded atmosphere layer and complete screenshot/release review.
