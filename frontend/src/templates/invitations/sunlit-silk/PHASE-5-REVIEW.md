# Sunlit Silk - Phase 5 asset integration and release review

Status: **Reopened after visual audit; not release-ready**

The earlier implementation-complete status described decor placement on a shared section skeleton rather than a finished invitation. The October 2026 audit rolled the template back to Phase 3, rebuilt the renderer and editor contract, and reopened this release gate. Do not promote the template while any item below remains unchecked.

## Decor integration map

| Section | Asset | Layer | Density / crop | Fallback |
| --- | --- | --- | --- | --- |
| opening | ribbon-clasp + modern-floral-cluster | foreground invitation band + restrained corner floral | full-material ribbon with interactive brass clasp; floral cropped at lower-right | warm CSS band and brass button remain usable if artwork fails |
| cover | modern-floral-cluster | background corner | 18%, right/bottom bleed | typography-only cover |
| invitation | linen-ribbon-tail | background corner | 18%, partial bleed | plain paper |
| venue | linen-envelope | background corner | 16%, partial bleed | address card |
| gallery | modern-floral-sculpture | background corner | 20%, clipped | flat gallery surface |
| guestbook | cotton-paper-stack | background corner | 16%, clipped | flat note cards |
| footer | linen-fold | background corner | 14%, clipped | CSS gradient fold |
| stage atmosphere | modern-orchid-petals + CSS “lụa phấn” dust | bounded 480px viewport layer | petals 10%; dust 28 hạt thưa, opacity thấp, pause khi tab ẩn | static sparse dust / hidden drift under reduced motion |

All artwork is renderer-owned, `aria-hidden`, `pointer-events: none`, and removed from layout if it fails to load. No user media is used as theme identity.

## Review gates

- [x] Approved assets are integrated only into their mapped sections.
- [x] Decor is clipped inside the 480px stage and cannot cover copy/CTA.
- [x] Broken artwork falls back to the same paper/card geometry.
- [x] Focused tests, typecheck and lint pass after the renderer rebuild.
- [x] Reduced-motion removes drift, reveal and perspective while preserving content.
- [x] Opening-only screenshot review at 390×844 after the warm-palette redesign: champagne/beige canvas dominates, Allura renders Vietnamese accents, the CTA aligns with the physical brass clasp and retains readable contrast.
- [x] Added a theme-specific “lụa phấn” ambient layer: deterministic sparse dust particles with page-visibility pause and reduced-motion static fallback.
- [ ] Full browser screenshot review at 375px, 390px, 480px, tablet and desktop.
- [x] Renderer runtime contract audit: 15 editor anchors, decor accessibility, opening exit lifecycle, optional-section removal and interactive surfaces are covered by `SunlitSilkRenderer.test.tsx`.
- [ ] Optimize the 9 renderer-owned PNG files. The current bundle is about 9.86 MB and the largest file is about 2.29 MB.
- [ ] Run the final production build after asset optimization and browser fixes.

The composition and interaction foundation are now real. The former mint/grey-green cast has been removed in favor of the approved warm beige, honey-linen and antique-brass palette. Opening title, couple names, focal invitation heading and closing title use the Vietnamese-capable Allura package under SIL OFL; body copy remains Be Vietnam Pro. Phase 5 remains open until the asset budget and full browser matrix pass.
