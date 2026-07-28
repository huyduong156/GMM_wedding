# GMM Wedding Admin Design System

Status: Accepted foundation
Source: UI/UX Pro Max search, adjusted for a data-dense web administration product.

## Direction

Modern dark operational UI: calm, compact, readable and fast. Wedding personality appears through a restrained rose accent and editorial imagery, not decorative script fonts inside administration screens.

- Dark is the default admin theme; light theme may be added later with the same semantic tokens.
- Minimal surfaces, thin borders and limited elevation. Glass blur is reserved for modal/sheet overlays, never every card.
- Variance 4/10, motion 3/10, density 8/10.
- One clear primary action per screen. Progressive disclosure for advanced options.

## Foundation tokens

```css
:root[data-theme="dark"] {
  --bg-canvas: #09090b;
  --bg-sidebar: #0c0c0f;
  --bg-surface: #111116;
  --bg-surface-raised: #17171d;
  --bg-subtle: #1d1d24;
  --fg-primary: #f4f4f5;
  --fg-secondary: #a1a1aa;
  --fg-muted: #71717a;
  --border-subtle: #27272f;
  --border-strong: #3f3f49;
  --brand: #e85d8e;
  --brand-hover: #f174a1;
  --brand-subtle: #3b1725;
  --info: #60a5fa;
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #fb7185;
  --focus: #f9a8c4;
}
```

Colors are semantic. Components must not contain arbitrary hex values. Every foreground/background pairing must be verified for WCAG 2.2 AA; state is never communicated by color alone.

## Typography

- UI/data: `Inter Variable`, fallback `ui-sans-serif, system-ui, sans-serif`.
- Optional display/brand on empty states or template thumbnails only: `Cormorant Garamond`; never for tables, forms or navigation.
- Scale: 12 metadata, 13 compact label/table, 14 default admin body, 16 emphasized body, 20/24/30 headings.
- Default line-height 1.45-1.6. Numbers in metrics/tables use tabular figures.
- Minimum 14px for desktop operational content; form inputs are at least 16px on mobile.

## Spacing and geometry

- 4px base; common spaces: 4, 8, 12, 16, 20, 24, 32, 40.
- Desktop page gutter 24px; large viewport 32px; mobile 16px.
- Control heights: compact 32px, default 36px, touch/mobile 44px.
- Radius: 6px control, 8px card, 12px modal; avoid pill shapes except status/filter chips.
- Border is the main surface separator; shadows only for floating layers.
- Z-index: base 0, sticky 20, dropdown 40, overlay 80, modal 100, toast 120.

## Icons

- Use Phosphor React as the primary icon family, outline weight and consistent sizing.
- Sizes: 16px inline, 18px controls/navigation, 20px important actions, 24px empty state.
- No emoji or raster icons for structural UI. Icon-only controls require tooltip and accessible name.

## Motion

- Hover/focus 120-160ms; dropdown/sheet 160-220ms; modal 200-260ms.
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

- Full-page glassmorphism, neon gradients, large decorative wedding scripts or excessive pink.
- Card-inside-card nesting, every metric as a chart, donut/pie for many RSVP states.
- Placeholder-only labels, hidden actions only on hover, silent save/delete, icon-only navigation.
- Dense mobile desktop-table shrink, low-contrast gray-on-gray, raw backend status codes.
