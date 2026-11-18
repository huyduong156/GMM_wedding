# The Wedding Roll asset manifest

Public URL root: `/assets/images/templates/the-wedding-roll/`

## Runtime artwork

| File | Role | Notes |
|---|---|---|
| `film-sprocket-mark.svg` | Integrated ambient ornament | Project-authored rust line-art sprocket mark, used as three low-contrast fixed page-edge details. |

Owner photos remain the media content layer. The sprocket mark is a renderer-owned, project-authored decoration.

## Runtime placement and motion

- Hero cover: owner or AI-generated example photo in the CSS paper frame.
- Story photo: owner or AI-generated example photo with rounded corners.
- Page-edge atmosphere: three `film-sprocket-mark.svg` marks at low opacity, fixed outside the text column and behind page content.
- Paper-light drift and sprocket float use only `transform`/opacity, pause when the document is hidden, and stop for reduced-motion preference. On narrow mobile, one ornament is hidden and the remaining marks are reduced in size/opacity.
- All decorations use non-semantic CSS or empty alt text, `pointer-events: none`, and have no media-upload/editor field.
