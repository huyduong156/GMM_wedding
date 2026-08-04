# Mobile Performance

```yaml
name: Three-Tier Motion Budget
category: performance
mood: consistent
trigger: device context and user preference
intensity: adaptive
duration: global
placement: invitation root
mobile: use mobile-light tier
avoid:
  - relying on user-agent sniffing alone
implementation_hint: define normal, mobile-light and reduced motion tokens
fallback: static experience
```

```yaml
name: Viewport Runtime Suspension
category: performance
mood: invisible safeguard
trigger: offscreen or hidden tab
intensity: none
duration: runtime lifetime
placement: particles, Rive and gallery
mobile: mandatory
avoid:
  - RAF loops outside viewport
implementation_hint: IntersectionObserver, visibilitychange and runtime pause
fallback: unmount optional runtime
```

```yaml
name: Lazy Feature Runtime
category: performance
mood: invisible safeguard
trigger: feature is needed
intensity: none
duration: one load
placement: particles, Rive and lightbox
mobile: defer aggressively
avoid:
  - loading every animation library at bootstrap
implementation_hint: dynamic import with a static CSS fallback
fallback: artwork without interaction
```

```yaml
name: Composited Motion Only
category: performance
mood: fluid
trigger: every animation
intensity: adaptive
duration: global
placement: all sections
mobile: transform and opacity only
avoid:
  - animated width or height
  - animated top or left
  - persistent blur and box-shadow animation
implementation_hint: transform wrappers and selective will-change
fallback: no transition
```

```yaml
name: Single RAF Discipline
category: performance
mood: stable
trigger: continuous sequences
intensity: adaptive
duration: active viewport only
placement: application orchestration
mobile: ambient cap at 24–30fps
avoid:
  - independent uncontrolled loops
implementation_hint: timestamp-based RAF with cleanup and background pause
fallback: static ambient layer
```
