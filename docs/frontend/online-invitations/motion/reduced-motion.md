# Reduced Motion

```yaml
name: Global User Preference Gate
category: accessibility
mood: calm
trigger: prefers-reduced-motion
intensity: none
duration: global
placement: invitation root
mobile: same behavior
avoid:
  - inconsistent checks in individual components
implementation_hint: MotionConfig plus CSS media query
fallback: all content visible
```

```yaml
name: Opacity Replacement
category: accessibility
mood: gentle
trigger: reduced-mode entrance
intensity: minimal
duration: 0–0.15s
placement: sections and disclosures
mobile: same behavior
avoid:
  - translate, scale, rotate and parallax
implementation_hint: replace spatial motion with opacity or color
fallback: instant state change
```

```yaml
name: Static Botanical Atmosphere
category: accessibility
mood: romantic, still
trigger: reduced motion
intensity: none
duration: static
placement: page edges
mobile: one ornament per side
avoid:
  - removing all visual identity
implementation_hint: freeze petals and foliage as a static illustration
fallback: plain background
```

```yaml
name: Native Scroll Mode
category: accessibility
mood: predictable
trigger: reduced motion or touch-first device
intensity: none
duration: global
placement: document scroll
mobile: recommended default
avoid:
  - smooth-scroll interception
  - pinned narratives
implementation_hint: do not initialize Lenis, parallax or scrub sequences
fallback: browser scrolling
```

```yaml
name: Semantic State First
category: accessibility
mood: reassuring
trigger: RSVP, gallery or disclosure state changes
intensity: minimal
duration: immediate
placement: interactive controls
mobile: same behavior
avoid:
  - conveying success only through animation
implementation_hint: visible text, aria-live and focus management precede decoration
fallback: native control behavior
```
