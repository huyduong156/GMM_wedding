
## Phase 5 — Asset integration, atmosphere, review and release

Status: **Implementation complete — release audit pending final product approval.**

### Decor integration map

| Section | Renderer-owned artwork | Motion / fallback |
| --- | --- | --- |
| `opening` | `vh-opening-flower-left-v1.png`, `vh-opening-flower-right-v1.png` | Opening exit choreography; static under reduced motion |
| `cover` | `vh-paper-fan-v4.png` | Slow breathe drift; static under reduced motion |
| `timeline` | `vh-celebration-divider-v1.png` | Bounded drift behind timeline; static under reduced motion |
| `gift` | `vh-lucky-envelope-v1.png` | Gentle float; never blocks CTA; static under reduced motion |
| `footer` | `vh-double-happiness-v4.png` | Subtle scale breathe; static under reduced motion |
| All sections | Floating `囍` atmosphere | CSS transform/opacity only; pauses when page is hidden |

### Background-motion and system-effects map

- Burgundy gradient and section glow provide the base atmosphere without relying on uploaded media.
- Floating `囍` marks remain decorative, `aria-hidden` and pointer-free.
- All renderer-owned artwork is decorative, bounded by the 480px canvas and layered behind content.
- `visibilitychange` pauses ambient CSS animation when the tab is hidden; `prefers-reduced-motion` removes ambient movement and transitions.
- Missing/error user media keeps the semantic section and empty state intact.

### Release validation

- [x] 13 configured sections render and optional sections leave the DOM when disabled.
- [x] Browser smoke completed at 375px and 768px with `scrollWidth === clientWidth`.
- [x] Opening action is available through click and keyboard; controls retain native focus behavior.
- [x] Reduced-motion CSS fallback is present for opening, reveal and decor animation.
- [x] Renderer-owned assets are bundled locally and mapped by section; no external image URL is used.
- [x] `van-hy` is registered in the invitation template registry for catalog/editor resolution.
- [x] Targeted Vạn Hỷ tests pass: 4 tests.
- [x] Targeted Vạn Hỷ lint passes after removing unused ordering state and invalid regex escapes.
- [ ] Whole-frontend typecheck/lint remains blocked by pre-existing errors outside this template.
- [ ] Final owner screenshot approval and admin publish/sync audit remain before marking the template release-ready.