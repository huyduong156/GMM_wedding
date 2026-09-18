# Reusable falling-stars effect

`FallingStars` adds a lightweight, renderer-owned star-fall layer to an existing section selected by a CSS selector.

```tsx
<FallingStars target="#start-screen" />
<FallingStars target=".hero-section" count={{ min: 4, max: 6 }} />
```

The component creates a small random pool, measures the target with `getBoundingClientRect()`, and lets CSS animate each star. At the end of each star's flight, its own position, size, tail length, direction, and duration are randomized again through `animationiteration`, so repeated cycles do not look synchronized. `ResizeObserver` rebuilds the pool only when the target size changes; JavaScript does not run per animation frame. The component returns no wrapper DOM and removes its injected layer on unmount. For imperative integrations, use `mountFallingStars(selector, options)` and call the returned cleanup function when the host is removed.

Use the effect for sparse ambient background atmosphere. Keep larger one-shot particle sequences local to their owning interaction so they can be removed immediately after the transition.
