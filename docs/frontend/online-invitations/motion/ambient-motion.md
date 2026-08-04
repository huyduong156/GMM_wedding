# Ambient Motion

```yaml
name: Floating Petals
category: ambient
mood: romantic, botanical
trigger: automatic
intensity: subtle
duration: 14–20s loop
placement: page edges
mobile: 3 petals, lower travel distance
avoid:
  - covering text or controls
  - fast movement
  - more than 8 visible petals
implementation_hint: CSS or DOM sprites using transform and opacity; pointer-events none
fallback: 2 static petals at opposite edges
```

```yaml
name: Botanical Edge Breathing
category: ambient
mood: greenhouse, organic
trigger: automatic while invitation is visible
intensity: subtle
duration: 9–13s alternate
placement: viewport side rails
mobile: one ornament layer per side
avoid:
  - scaling large foliage across content
  - moving the focal point more than 8px
implementation_hint: rotate 1–2deg around the stem with CSS transform
fallback: static botanical silhouette
```

```yaml
name: Dappled Sunlight
category: ambient
mood: luminous, poetic
trigger: automatic
intensity: subtle
duration: 18–24s alternate
placement: hero and family-section background
mobile: static radial gradient
avoid:
  - animated heavy blur
  - reducing text contrast
implementation_hint: composited gradient layer translated slowly outside the text center
fallback: baked radial gradient
```

```yaml
name: Dewlight Glints
category: ambient
mood: refined, magical
trigger: sparse automatic
intensity: subtle
duration: 1.2–1.8s with 5–9s delay
placement: foliage and gallery-frame edges
mobile: maximum 2 glints
avoid:
  - strobing
  - repeated sparkle fields
implementation_hint: scale and fade small CSS diamonds at fixed safe points
fallback: static highlight dots
```

```yaml
name: Pollen Fireflies
category: ambient
mood: dusk garden, intimate
trigger: automatic in dark sections only
intensity: subtle
duration: 10–18s loop
placement: countdown and RSVP outer zones
mobile: 4–6 particles at 24fps
avoid:
  - pointer attraction
  - particles over form fields
implementation_hint: tsParticles with viewport pause and 24–30fps cap
fallback: sparse static dots
```
