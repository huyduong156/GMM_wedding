# Shared motion styles

## Scroll reveal

Import `reveal-animations.css`, add `reveal` to an element, and add one effect class:

- `reveal--fade-up`
- `reveal--slide-left`
- `reveal--slide-right`
- `reveal--slide-down`
- `reveal--slide-up`
- `reveal--zoom-in`
- `reveal--fade-only`

The parent adds `is-visible` when it reaches the reveal trigger. Override `--reveal-delay` per element to create a stagger. The shared duration is `1.5s`.

## Interaction effects

Import `interaction-effects.css` and add `interaction-ripple` to a positioned button or link. The ripple respects `prefers-reduced-motion`.

`reveal-animations.css` also owns the shared `html { scroll-behavior: smooth; }` rule. JavaScript smooth-scroll or Lenis hooks remain optional and should stay in their respective hooks.
