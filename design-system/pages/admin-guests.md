# Admin Guests Override

Inherits `../MASTER.md`. This page is a high-density operational directory for wedding guest management.

- Header keeps one primary action, `Thêm khách mời`; import and export remain secondary utilities.
- Four compact summary cards expose total guests, attending, pending and declined counts with labels and icons, never color alone.
- Desktop uses a semantic data table with selection, guest identity/tags, group, party size, invitation state and attendance confirmation. Table assignment and update time are intentionally omitted from the primary directory.
- Search is deferred. Attendance filter chips plus group and tag selectors update the visible dataset without blocking typing. Tags are subgroup context such as current/former company, paternal/maternal relatives or school friends.
- Bulk actions appear only after selection. Destructive/archive treatment is visually separated from ordinary actions.
- Guest contact/email is omitted from the primary directory because attendance operations are name-first and contact is rarely used in this product context. Repository fixtures must not contain real guest PII.
- Use attendance confirmation language (`Có tham dự`, `Chưa xác nhận`, `Không tham dự`), not a separate generic response concept.
- The directory is optimized for large weddings: compact 52px desktop rows, sticky table header and 50 rows per page by default, with 100/200 row options.
- Below 768px, the table becomes readable guest cards with the same selection and status information. A fixed add button provides the primary mobile action.
- Empty filtered results explain the state and provide a single reset action.
- Import wizard, row detail sheet, saved views and server-backed pagination remain follow-up interactions; do not imply these prototype controls persist data.
