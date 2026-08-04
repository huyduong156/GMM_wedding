# Typography Motion

```yaml
name: Masked Couple Names
category: typography
mood: editorial, romantic
trigger: hero entrance
intensity: signature
duration: 0.8–1.1s
placement: hero names only
mobile: split by line, never character
avoid:
  - splitting long Vietnamese copy
  - hiding the accessible text
implementation_hint: overflow mask with two line wrappers translating upward
fallback: full name fade
```

```yaml
name: Ink Ampersand Flourish
category: typography
mood: calligraphic
trigger: after names settle
intensity: subtle
duration: 0.8–1.3s
placement: ampersand
mobile: static glyph
avoid:
  - fake handwriting on body copy
implementation_hint: rotate and scale a decorative ampersand or reveal an original SVG stroke
fallback: filled glyph
```

```yaml
name: Date Letterpress Settle
category: typography
mood: formal, tactile
trigger: hero entrance
intensity: subtle
duration: 0.6–0.9s
placement: date row
mobile: opacity only
avoid:
  - extreme letter-spacing interpolation
implementation_hint: fade while tracking settles from 0.14em to final value
fallback: static date
```

```yaml
name: Vow Line-by-Line Reveal
category: typography
mood: intimate, poetic
trigger: viewport once
intensity: subtle
duration: 1–1.6s
placement: one short quotation
mobile: maximum 2 lines
avoid:
  - long paragraphs
  - character cascades
implementation_hint: Motion stagger or GSAP SplitText lines when licensed and justified
fallback: paragraph visible
```

```yaml
name: Botanical Underline Growth
category: typography
mood: refined, natural
trigger: heading enters viewport
intensity: subtle
duration: 0.5–0.8s
placement: venue and gallery headings
mobile: shorter rule
avoid:
  - underlining body text
implementation_hint: scaleX a decorative rule from its center
fallback: static rule
```
