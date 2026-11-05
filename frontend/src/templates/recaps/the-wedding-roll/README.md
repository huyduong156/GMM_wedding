# The Wedding Roll — Preview shell

- Product type: `WEDDING_RECAP`
- Preview route: `/templates/recaps/the-wedding-roll/preview`
- Standalone concept HTML: `/templates/recaps/the-wedding-roll/preview.html` (retained as an independent reference)
- Phase 1 brief: [The Wedding Roll Phase 1](../../../../../docs/frontend/wedding-recaps/the-wedding-roll-phase-1.md)
- Phase 2 media contract: [The Wedding Roll Phase 2](../../../../../docs/frontend/wedding-recaps/the-wedding-roll-phase-2.md)
- Phase 2.5 frame preview: [The Wedding Roll Phase 2.5](../../../../../docs/frontend/wedding-recaps/the-wedding-roll-phase-2.5.md)
- Phase 3 section architecture: [The Wedding Roll Phase 3](../../../../../docs/frontend/wedding-recaps/the-wedding-roll-phase-3.md)
- Config mapping: `template-config.ts`
- React renderer: `TheWeddingRollRecap.tsx`
- Content fixture: `fixture.ts`
- Asset inventory: `ASSET_MANIFEST.md`

## Phase 0 spatial contract

The template preview route renders `TheWeddingRollRecap.tsx` using typed recap content. The original concept remains available directly at `/templates/recaps/the-wedding-roll/preview.html`; its source and public copy are kept separate from the React renderer.

- The page content is fluid with a `1200px` desktop maximum and a `32px` mobile gutter.
- The HTML document has a continuous paper canvas, clips page-level horizontal overflow, and keeps native vertical scrolling.
- The React renderer fills the preview route and keeps native document scrolling.
- The concept has responsive rules for desktop, tablet, and narrow mobile; reduced motion disables smooth scrolling and reveals content statically.
- The mobile album action is fixed inside the safe-area gutter and links directly to photo delivery.
- The React fixture uses the local couple-002 example set; the independent HTML concept retains its original remote reference photos. Couple photos remain replaceable by owner media before catalog release. Phase 5 uses local Be Vietnam Pro and Playfair Display font files.
- Each chapter accepts 1–5 selected photos. The first photo appears as its thumbnail; the chapter button opens a lightbox with previous/next controls and direct photo selection. The editor enforces the same minimum and maximum.

Phase 0 route and spatial shell are in place. Phase 1 product/content, Phase 2 media, Phase 3 composition and Phase 4 motion contracts are documented and mapped into `template-config.ts`. The React renderer preserves the standalone concept's copy, ordering, imagery, responsive composition, stamp, contact strip and persistent mobile album action. It integrates approved local SVG frames and low-contrast page-edge ornaments, with restrained ambient motion, per-item reveals, local Be Vietnam Pro/Playfair Display fonts, reduced-motion support and hidden-tab pausing. The standalone concept remains independently available at `/templates/recaps/the-wedding-roll/preview.html`. See [Phase 5 review and release record](../../../../../docs/frontend/wedding-recaps/the-wedding-roll-phase-5.md). The template remains in development because the demo photo sources and production recap/editor/API integration are not part of this preview-only task.
