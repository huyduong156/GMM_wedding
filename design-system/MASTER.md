# GMM Wedding Admin Design System

Status: Accepted foundation
Source: UI/UX Pro Max search, adjusted for a data-dense web administration product.

## Direction

Modern daylight operational UI: calm, compact, readable and fast. Wedding personality appears through a copper-amber accent, ivory canvas and subtle celestial/botanical ambient motion, not decorative script fonts inside administration screens. The palette intentionally combines Metal (white, ivory) with Earth (copper, warm stone neutrals).

- Light is the default admin theme: off-white canvas, white surfaces and graphite text. A dark theme may be added later with the same semantic contracts.
- Primary cards and panels use translucent white surfaces around 72-78% with restrained backdrop blur so the ambient layer remains perceptible. Inputs, status chips and navigation may stay more opaque for contrast and usability.
- Layered white surfaces, warm-gray borders and restrained tinted elevation. Glass blur is reserved for sticky chrome and modal/sheet overlays, never every card.
- Variance 4/10, motion 3/10, density 8/10.
- One clear primary action per screen. Progressive disclosure for advanced options.

## Foundation tokens

```css
:root[data-theme="light"] {
  --bg-canvas: #f7f6f2;
  --bg-sidebar: #fbfaf7;
  --bg-surface: #ffffff;
  --bg-surface-raised: #f3f0e9;
  --bg-subtle: #eeeae2;
  --fg-primary: #211f1b;
  --fg-secondary: #5f5a52;
  --fg-muted: #7d756b;
  --border-subtle: #e4ded4;
  --border-strong: #cbc2b6;
  --brand: #b76016;
  --brand-hover: #97490d;
  --brand-subtle: #fff0dc;
  --info: #60a5fa;
  --success: #16794b;
  --warning: #a45d08;
  --danger: #c73b45;
  --focus: #b76016;
}
```

Colors are semantic. Components must not contain arbitrary hex values. Every foreground/background pairing must be verified for WCAG 2.2 AA; state is never communicated by color alone.

## Typography

- UI/data: `Inter Variable`, fallback `ui-sans-serif, system-ui, sans-serif`.
- Optional display/brand on empty states or template thumbnails only: `Cormorant Garamond`; never for tables, forms or navigation.
- Scale: 10 auxiliary timestamps only, 11 metadata, 12 compact labels, 14 default admin body, 16 emphasized body, 20/24/28-34 headings.
- Default line-height 1.45-1.6. Numbers in metrics/tables use tabular figures.
- Default body is 14px; operational labels are at least 12px and only auxiliary timestamps may use 10px. Form inputs are at least 16px on mobile.

## Spacing and geometry

- 4px base; common spaces: 4, 8, 12, 16, 20, 24, 32, 40.
- Desktop page gutter 24px; large viewport 32px; mobile 16px.
- Control heights: compact 32px, default 36px, touch/mobile 44px.
- Radius: 8-9px control, 10-12px panel/card, 12px modal; avoid pill shapes except status/filter chips.
- Border is the main surface separator; a low-opacity tinted shadow may reinforce primary dashboard panels without creating floating-card clutter.
- Z-index: base 0, sticky 20, dropdown 40, overlay 80, modal 100, toast 120.

## Icons

- Use Phosphor React as the primary icon family, outline weight and consistent sizing.
- Sizes: 16px inline, 18px controls/navigation, 20px important actions, 24px empty state.
- No emoji or raster icons for structural UI. Icon-only controls require tooltip and accessible name.

## Motion

- Hover/focus 120-160ms; dropdown/sheet 160-220ms; modal 200-260ms.
- Light canvas may use low-opacity wedding ambient motion only in gutters: diffused sunlight, silk-like ribbons, sparse petals, floating envelopes, diagonal feathers, drifting dandelions and rising balloons with varied long cycles. Shooting stars are reserved for dark themes. Ambient objects stay behind opaque content, never capture pointer events and are removed under `prefers-reduced-motion`.
- Animate opacity/transform only; no decorative page entrances in the admin.
- Loading over 300ms uses skeleton/progress. Respect `prefers-reduced-motion`.
- Press/hover must not shift layout.

## Core components

- App shell, sidebar/nav item, command search, page header and breadcrumbs.
- Button, icon button, input, textarea, select/combobox, date/time picker, switch, checkbox/radio.
- Card/stat card, badge/status, alert, tooltip, dropdown, popover, dialog, sheet, toast.
- Data table with sort/filter/column visibility/pagination/selection/bulk action.
- Empty/loading/error/no-results/offline/permission-denied states.
- Line/bar/bullet charts with visible values, keyboard access, text summary and table/CSV fallback.

## Accessibility and responsive rules

- Contrast 4.5:1 for normal text, visible 2px focus ring and logical keyboard order.
- Desktop pointer targets may use 36px compact controls; touch layouts use at least 44x44px.
- Sidebar becomes a drawer below 1024px. Tables prioritize columns, then horizontal scroll or cards on narrow screens.
- Never disable browser zoom. Route changes focus the main heading; dialogs trap/restore focus.
- Destructive actions are separated, confirmed when irreversible, and support undo when possible.

## Anti-patterns

- Full-page glassmorphism, neon gradients, large decorative wedding scripts, excessive pink or high-contrast decorative motion.
- Card-inside-card nesting, every metric as a chart, donut/pie for many RSVP states.
- Placeholder-only labels, hidden actions only on hover, silent save/delete, icon-only navigation.
- Dense mobile desktop-table shrink, low-contrast gray-on-gray, raw backend status codes.
