# Shared motion styles

## Scroll reveal

`reveal-animations.css` là legacy compatibility layer cho các template cũ. Template mới phải dùng `motion/react` và không trộn `.reveal` với element đã có Motion animation.

Các template cũ có thể import file này, thêm `reveal` vào element và dùng một effect class:

- `reveal--fade-up`
- `reveal--slide-left`
- `reveal--slide-right`
- `reveal--slide-down`
- `reveal--slide-up`
- `reveal--zoom-in`
- `reveal--fade-only`

The parent adds `is-visible` when it reaches the reveal trigger. Override `--reveal-delay` per element to create a stagger. The shared duration is `1.5s`. Do not add this class system to new templates.

## Interaction effects

Import `interaction-effects.css` and add `interaction-ripple` to a positioned button or link. The ripple respects `prefers-reduced-motion`.

`reveal-animations.css` also owns the legacy shared `html { scroll-behavior: smooth; }` rule. When the shared Lenis hook is active, do not rely on this native smooth-scroll rule as a second scroll runtime.
