# Wedding Recap product model

Wedding Recap is a post-wedding memory hub, not a second invitation. It is published after the wedding so the couple can share a thank-you message and guests can revisit the day, find themselves in photos, and open or download the complete album.

## Canonical flow

`opening → thank-you → event chapters → ceremony highlights → closing → album destination`

### Section responsibilities

- **Opening:** names, date, short lead, one representative image or collage.
- **Thank-you:** concise message to family, friends, and guests.
- **Event chapters:** data-driven chapters such as photobooth, fingerprint/signature station, reception, first look, cake cutting, games, or dance. Each chapter can use a different media mode: grid, masonry, carousel, featured image, or external album.
- **Ceremony highlights:** selected ceremony images with optional chronological context.
- **Closing:** short reflection and a clear invitation to view the complete collection.
- **Album destination:** in-page gallery, download collection, or external URL. Always expose a clear CTA and handle missing/private/failed links.

## Product constraints

- Photo discovery and access are more important than cinematic effects, decor, or 3D depth.
- Hide event chapters with no approved media; never fill the page with fake or unrelated placeholders.
- Captions, event labels, time/location metadata, download controls, and share actions must remain readable on mobile.
- Motion is supportive: use gentle reveal, gallery transitions, and restrained ambient motion. Heavy scroll hijacking, autoplay video, or 3D is optional and must not delay or obscure photos.
- The page must work when events are reordered or disabled. Resolve transitions from actual neighbors, not a hard-coded story sequence.
- The final album CTA must remain reachable even when the gallery is large, an external link is private, or media loading fails.

## Fixture requirements

Fixtures should contain synthetic but realistic wedding media: couple portraits, guest groups, ceremony moments, and event-specific examples such as photobooth strips. Do not use random landscape/decor images as substitutes for guest content, and do not include real guest PII.
