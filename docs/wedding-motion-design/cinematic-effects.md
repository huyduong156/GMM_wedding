# Cinematic Effects

```yaml
name: Seal-to-Greenhouse Match Cut
category: cinematic
mood: ceremonial, cinematic
trigger: invitation opens
intensity: signature
duration: 1–1.4s
placement: full viewport opening
mobile: crossfade with slight scale
avoid:
  - adding Rive or GSAP only for a simple fade
implementation_hint: visually match the round seal to the greenhouse light aperture
fallback: dissolve
```

```yaml
name: Layered Conservatory Depth
category: cinematic
mood: immersive, verdant
trigger: short hero scroll or fine pointer
intensity: subtle
duration: while hero is active
placement: hero edge layers
mobile: static layers
avoid:
  - large panning
  - moving hero text
  - default gyroscope input
implementation_hint: three composited layers with 2px, 4px and 7px travel
fallback: still image
```

```yaml
name: Golden-Hour Light Sweep
category: cinematic
mood: warm, luxurious
trigger: once after hero settles
intensity: subtle
duration: 2.5–4s
placement: image edge, outside text center
mobile: static flare
avoid:
  - animated heavy blur
  - endless repeated sweeps
implementation_hint: transform a narrow gradient overlay through the frame
fallback: baked gradient
```

```yaml
name: Glass Reflection Pass
category: cinematic
mood: greenhouse, modern
trigger: cover or key-card hover and focus
intensity: subtle
duration: 0.5–0.8s
placement: one signature surface
mobile: tap once or omit
avoid:
  - glossy sweeps on every card
implementation_hint: translateX a pseudo-element reflection
fallback: border highlight
```

```yaml
name: Botanical Finale Constellation
category: cinematic
mood: dreamy, conclusive
trigger: footer viewport once
intensity: medium
duration: 1.5–2.2s
placement: footer edges
mobile: three lights
avoid:
  - endless animation after reveal
implementation_hint: sparse lights converge around the monogram and stop
fallback: static monogram
```
