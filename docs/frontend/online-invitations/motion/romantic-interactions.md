# Romantic Interactions

```yaml
name: RSVP Bloom Confirmation
category: interaction
mood: joyful, botanical
trigger: RSVP selection succeeds
intensity: medium
duration: 0.7–1.1s
placement: around semantic feedback
mobile: maximum 4 leaves
avoid:
  - confetti storms
  - hiding status text
implementation_hint: short Motion leaf burst paired with role=status copy
fallback: check icon and message
```

```yaml
name: Wish Becomes a Seed
category: interaction
mood: tender, playful
trigger: guestbook submit
intensity: subtle
duration: 0.6–0.9s
placement: submit button to newest wish
mobile: opacity and translate only
avoid:
  - delaying the submission
implementation_hint: optimistic status; small seed arc before the card enters
fallback: instant insertion
```

```yaml
name: Pollen Touch Ripple
category: interaction
mood: magical, botanical
trigger: tap empty decorative space
intensity: subtle
duration: 0.5–0.8s
placement: hero or RSVP background
mobile: one active ripple
avoid:
  - cursor trails
  - firing over controls
implementation_hint: local transient particles with a strict one-burst limit
fallback: none
```

```yaml
name: Gift Ribbon Unfurl
category: interaction
mood: ceremonial, tactile
trigger: expand gift note
intensity: subtle
duration: 0.45–0.7s
placement: gift panel
mobile: mask and opacity only
avoid:
  - long height animation
implementation_hint: AnimatePresence with clip or scaleY reveal
fallback: immediate disclosure
```

```yaml
name: Pressed-Leaf Calendar Save
category: interaction
mood: crafted, elegant
trigger: hover, focus or tap
intensity: subtle
duration: 0.18–0.3s
placement: calendar CTA
mobile: tap feedback only
avoid:
  - hover-only meaning
implementation_hint: rotate icon 3deg and tighten shadow while retaining focus ring
fallback: native button state
```
