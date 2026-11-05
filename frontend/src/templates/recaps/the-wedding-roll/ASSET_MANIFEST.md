# The Wedding Roll asset manifest

Public URL root: `/assets/images/templates/the-wedding-roll/`

## Selected preview artwork

| File | Role | Notes |
|---|---|---|
| `film-frame.svg` | Integrated 35mm photo frame | Pale ivory film border with transparent center and subtle perforations; used on the hero cover. Keep the full frame visible on mobile. |
| `camera-viewfinder-frame.svg` | Integrated alternate photo frame | Light camera-viewfinder outline with transparent center; used on the optional film poster. Never stacked with the film frame. |
| `film-sprocket-mark.svg` | Integrated ambient ornament | Project-authored rust line-art sprocket mark, used as three low-contrast fixed page-edge details. |

All three are renderer-owned decorations; owner photos remain the media content layer. The two photo-frame variants were approved in Phase 2.5. The sprocket mark is a code-authored supporting ornament created for Phase 5 after the approved frames left the ambient artwork role uncovered. It adds no new image dependency.

## Runtime placement and motion

- Hero cover: `film-frame.svg`, full image bounds, decorative CSS overlay.
- Story photo: user photo with rounded corners, without a renderer-owned frame.
- Optional wedding-film poster: `camera-viewfinder-frame.svg`, alternate frame treatment.
- Page-edge atmosphere: three `film-sprocket-mark.svg` marks at low opacity, fixed outside the text column and behind page content.
- Paper-light drift and sprocket float use only `transform`/opacity, pause when the document is hidden, and stop for reduced-motion preference. On narrow mobile, one ornament is hidden and the remaining marks are reduced in size/opacity.
- All decorations use non-semantic CSS or empty alt text, `pointer-events: none`, and have no media-upload/editor field.

## Draft archive

`frontend/public/assets/images/templates/the-wedding-roll/drafts/` contains the original generated PNGs and lighter raster experiments. They are retained for provenance only and must not be referenced by the preview or renderer.

Source and licensing notes are recorded in `assets/ASSET_SOURCES.md`.
