# The Wedding Roll — Preview shell

- Product type: `WEDDING_RECAP`
- Preview route: `/templates/recaps/the-wedding-roll/preview`
- Standalone concept HTML: `/templates/recaps/the-wedding-roll/preview.html` (retained as an independent reference)
- Config mapping: `template-config.ts`
- React renderer: `TheWeddingRollRecap.tsx`
- Content fixture: `fixture.ts`
- Asset inventory: `ASSET_MANIFEST.md`

## Preview and spatial contract

The template preview route renders `TheWeddingRollRecap.tsx` using typed recap content. The original concept remains available directly at `/templates/recaps/the-wedding-roll/preview.html`; its source and public copy are kept separate from the React renderer.

- The page content is fluid with a `1200px` desktop maximum and a `32px` mobile gutter.
- The HTML document has a continuous paper canvas, clips page-level horizontal overflow, and keeps native vertical scrolling.
- The React renderer fills the preview route and keeps native document scrolling.
- The recap editor preview scales both desktop and mobile frames to the available `.editor-iframe-canvas` width and height, preserving each device aspect ratio without clipping.
- The story editor fields write directly to the renderer keys declared in `template-config.ts` (`ourStory.quote` and `ourStory.body`).
- The chapters editor fields write directly to the renderer keys declared in `template-config.ts` (`chaptersIntro.*` and `chapters`); the shared editor does not translate template-specific aliases.
- Every top-level editable field in `template-config.ts` declares its renderer `contentKey`; repeatable item fields remain relative to their parent collection.
- The template preview uses `https://drive.google.com` as a temporary destination for the full-album button when no URL is configured; this example URL is applied only in the preview page and is not part of the template fixture or a new recap's editor defaults.
- The opening renderer honors the editor's generic `hero.title` and `hero.content`/`hero.body` fields when present, with `titleLines` and `tagline` retained as backward-compatible defaults.
- The concept has responsive rules for desktop, tablet, and narrow mobile; reduced motion disables smooth scrolling and reveals content statically.
- The mobile album action is fixed inside the safe-area gutter and links directly to photo delivery.
- The React fixture uses the local AI-generated couple-002 example set; owner photos can replace these defaults. The independent HTML concept retains its original remote reference photos. Be Vietnam Pro and Playfair Display are served locally by the React renderer.
- Each chapter accepts 1–5 selected photos. The first photo appears as its thumbnail; the chapter button opens a lightbox with previous/next controls and direct photo selection. The editor enforces the same minimum and maximum.

The template implementation is complete and its config is ready for catalog synchronization. It uses a 3D moments carousel and a photo-delivery panel with independent actions for up to 50 featured uploads and an optional full-album URL; both actions may be enabled together. The film strip and wedding-video feature are excluded from the current template. Guestbook cards use recap-selected approved wishes, with demo messages in preview and an infinite horizontal marquee. The standalone concept remains independently available at `/templates/recaps/the-wedding-roll/preview.html`.
