# Entrance Reveal

```yaml
name: Seal-to-Garden Opening
category: entrance
mood: ceremonial, surprising
trigger: tap open invitation
intensity: signature
duration: 0.9–1.4s
placement: cover to hero
mobile: remove 3D perspective
avoid:
  - blocking content longer than 1.5s
  - relying on animation for navigation
implementation_hint: AnimatePresence; seal fades while botanical frame expands
fallback: direct crossfade
```

```yaml
name: Greenhouse Curtain Reveal
category: entrance
mood: cinematic, airy
trigger: after opening
intensity: medium
duration: 0.8–1.1s
placement: hero
mobile: single mask
avoid:
  - complex clip paths on low-end devices
implementation_hint: opposing transform masks moving away from center
fallback: opacity reveal
```

```yaml
name: Bouquet Section Reveal
category: entrance
mood: editorial, botanical
trigger: viewport once
intensity: subtle
duration: 0.65–0.9s
placement: section headings
mobile: translate no more than 16px
avoid:
  - animating every child independently
implementation_hint: stagger eyebrow, title, decorative rule and copy
fallback: all heading content visible
```

```yaml
name: Family Diptych Arrival
category: entrance
mood: formal, balanced
trigger: family section enters viewport
intensity: medium
duration: 0.7–0.9s
placement: two family cards
mobile: vertical stagger
avoid:
  - delaying readable family information
implementation_hint: cards enter from opposite sides; center seal appears last
fallback: both cards visible
```

```yaml
name: Growing Timeline
category: entrance
mood: narrative, elegant
trigger: timeline enters viewport
intensity: subtle
duration: 1.2–1.8s
placement: schedule rail
mobile: reveal per item
avoid:
  - animating actual height
implementation_hint: scaleY the rail with transform-origin top
fallback: static rail
```
