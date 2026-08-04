# Gallery Motion

```yaml
name: Living Botanical Matte
category: gallery
mood: editorial, greenhouse
trigger: active slide changes
intensity: medium
duration: 1–1.4s
placement: gallery frame edges
mobile: two corner ornaments
avoid:
  - covering faces
  - competing with controls
implementation_hint: corner foliage drifts 4–8px opposite the active image
fallback: fixed botanical matte
```

```yaml
name: Shared-Element Lightbox
category: gallery
mood: immersive, premium
trigger: photo tap
intensity: medium
duration: 0.45–0.7s
placement: thumbnail to dialog
mobile: no background scale
avoid:
  - inaccessible dialogs
  - broken focus restoration
implementation_hint: Motion layoutId and AnimatePresence with semantic dialog behavior
fallback: instant accessible dialog
```

```yaml
name: Slow Editorial Cross-Dissolve
category: gallery
mood: nostalgic
trigger: autoplay or manual selection
intensity: subtle
duration: 0.8–1.2s with 5–7s hold
placement: main photograph
mobile: disable autoplay for reduced motion or save-data
avoid:
  - aggressive perpetual Ken Burns
implementation_hint: opacity plus scale from 1.025 to 1
fallback: hard switch
```

```yaml
name: Ribbon Filmstrip
category: gallery
mood: handcrafted, celebratory
trigger: drag or buttons
intensity: subtle
duration: 0.35–0.55s
placement: thumbnails
mobile: native horizontal scroll-snap
avoid:
  - hijacking vertical swipe
implementation_hint: CSS scroll-snap with animated selected indicator
fallback: previous and next buttons
```

```yaml
name: Memory Caption Bloom
category: gallery
mood: intimate
trigger: active image settles
intensity: subtle
duration: 0.4–0.7s
placement: lower safe area
mobile: one-line caption
avoid:
  - text over faces or busy areas
implementation_hint: caption crossfade after the image begins entering
fallback: caption below image
```
