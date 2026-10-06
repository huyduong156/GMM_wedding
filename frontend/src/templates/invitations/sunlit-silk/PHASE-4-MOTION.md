# Sunlit Silk - Phase 4 motion and interaction map

Status: **Rebuilt; code gate complete, browser gate pending**

## Motion tokens

| Token | Value | Use |
| --- | --- | --- |
| `easeOut` | `cubic-bezier(.22, 1, .36, 1)` | opening and section entrance |
| `micro` | `180ms` | button hover/press |
| `section` | `650ms` | scroll reveal |
| `opening` | `700ms` | opening gate exit |
| `ambient` | `18s` | bounded petal drift |
| `stagger` | `50-90ms` | alternating section rhythm |

## Technique map

| Surface | Technique | Trigger | Purpose | Mobile | Reduced motion | Budget |
| --- | --- | --- | --- | --- | --- | --- |
| Opening | gate-fold style fade/translate | click/tap/keyboard CTA | makes the invitation feel opened | same 700ms, no parallax | gate disappears instantly; content visible | one overlay |
| All sections | IntersectionObserver fade + rise | 22% visible | establishes reading order | 650ms, small 20px rise | no transform/transition | one observer |
| Stage background | restrained petal drift | page visible | adds quiet atmosphere without blocking copy | opacity 0.08, slower | static/hidden | one image layer |
| Gallery surface | CSS perspective tilt | hover/focus | gives paper stack depth | disabled on coarse pointer | flat paper surface | one card |
| CTA | press/lift feedback | hover/press | confirms action | press only | instant | transform only |

## Interaction and fallback contract

- Opening accepts pointer, Enter and Space through the native button. The overlay blocks repeated interaction after opening and does not trap the page permanently.
- Scroll reveal observes only `[data-reveal]`, disconnects on cleanup and never updates React state per frame.
- Decorative petal art is `aria-hidden`, `pointer-events: none`, bounded by `.ss-stage`, and remains behind all content.
- The gallery perspective effect is CSS-only and disabled for coarse pointers by the absence of hover interaction; reduced motion removes it.
- Only transform and opacity animate. No layout property is animated.
- `prefers-reduced-motion: reduce` removes gate/reveal/ambient motion and keeps all section content visible.

## Phase 4 gate

- [x] Signature opening interaction has a clear purpose and keyboard path.
- [x] Section reveal uses a single visibility observer with bounded stagger.
- [x] Ambient layer is restrained, decorative and bounded to the stage.
- [x] At least one CSS 3D/depth section exists with flat fallback.
- [x] Mobile and reduced-motion behavior are defined.
- [ ] Repeat full visual review across 375/390/480/tablet/desktop after the Phase 3 rebuild.

Phase 5 remains open for asset optimization and the final screen/release audit.
