# Admin Dashboard Override

Inherits `../MASTER.md`. This page is an operational overview, not a marketing dashboard.

- Overview header combines breadcrumb/date, greeting, preview/share actions and published status/link in one 16px-radius white surface.
- KPI cards: four independent white tiles for invited, responded, attending and pending. Values and supporting text remain visible without relying on color.
- Primary visualization: RSVP trend over time (line) only when at least four time points exist; otherwise use stat cards.
- Comparison: horizontal/stacked bar for attendance by event/group. Avoid donut as the only representation.
- Desktop content uses an analytics-first main column and a secondary rail. The rail puts the next event before recent RSVP/wishes; below 1200px it reflows, and on mobile it stacks.
- Every chart includes accessible summary and link to the underlying filtered table.
- Empty dashboard becomes an onboarding checklist, not empty charts filled with zeroes.
- Operational text uses a readable modern scale: 14px body, 12px labels, 10-11px only for timestamps/metadata; KPI values use 32px tabular figures.
- Main panels use 14px radius, white surfaces, warm-gray borders and restrained tinted depth. Avoid translucent cards over the animated background.
- Desktop controls are at least 38-40px high; mobile interactive targets are at least 44px.
