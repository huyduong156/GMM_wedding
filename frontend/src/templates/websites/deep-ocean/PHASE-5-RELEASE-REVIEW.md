# Deep Ocean — Phase 5 release review

Status: UI rebuild implemented; browser visual review pending.

## Current composition

- One continuous powder-blue background shared by all sections.
- Opening: editorial split, editable couple photo and a bounded 3D pearl. The pearl is static under reduced motion and has a CSS fallback when WebGL is unavailable.
- Story: arched photograph and long-form copy. Timeline: sea-current track. Wedding day: visible date, time, venue and address. Gallery: selectable featured image with a scrollable thumbnail rail on mobile.
- Memories, people, film, wishes, capsule and footer each use their own chapter composition. Only the approved oyster asset is rendered, in the capsule. The former scattered decor and ambient bubbles were retired.
- Mobile layouts use one column, native vertical scroll and no horizontal overflow. The editor section keys and toggle/order contract remain unchanged.

## Release gates

- [x] All 12 section keys render with their original `data-editor-section` markers.
- [x] Enabled/order settings remain respected.
- [x] Gallery selection is keyboard-accessible and updates the featured image.
- [x] Artwork is served from `public/assets/images/templates/deep-ocean/artwork/`.
- [x] Reduced-motion and WebGL fallback paths exist.
- [ ] Review screenshots at 390px, 768px and desktop.
- [ ] Review reduced-motion and WebGL fallback in a real browser.
- [ ] Complete production bundle/performance review.

Automated DOM tests establish behavior, not visual approval.
