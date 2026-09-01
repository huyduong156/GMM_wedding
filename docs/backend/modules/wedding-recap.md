# Backend web recap

Recap template content is stored in `WeddingContent` with `surface = RECAP`.
The same row stores recap lifecycle status and publication timestamp. Recap
media, wishes and snapshots reference this row directly; there is no separate
`WeddingRecap` table.

Recap là publication surface độc lập với thiệp online và wedding web. Draft dùng `WeddingContent` với `surface = RECAP`; public chỉ đọc immutable `PublishedRecapSnapshot`.

## API

- `GET/PUT /api/weddings/{weddingId}/recap`: đọc hoặc lưu draft theo `revision`; nếu owner chưa tạo draft, GET trả `200 { recap: null }`.
- `POST /api/weddings/{weddingId}/publish` với `surface = RECAP`: validate và tạo snapshot immutable.
- `POST /api/weddings/{weddingId}/unpublish` với `surface = RECAP` và `revision`: thu hồi publication pointer.
- Public URL dùng Wedding.slug; không tạo slug riêng cho recap. Endpoint availability slug recap là legacy và không được FE sử dụng cho flow mới.
- `GET /api/public/recaps/{weddingSlug}`: đọc snapshot public theo Wedding.slug, hỗ trợ ETag/cache.

Draft gồm `templateVersionId`, template-owned `content`, `themeConfig`, `sectionConfig`, publication `status`, `publishedAt`, media/wish selections và `revision`. Các field như thank-you/SEO là dữ liệu trong `content` JSON, không phải column riêng. Template phải là `RECAP`, đã `RELEASED`, không deprecated; media phải `READY` cùng wedding; wishes phải `APPROVED` cùng wedding.

Draft, publish, unpublish và availability theo wedding yêu cầu session owner. Public chỉ trả snapshot khi wedding `PUBLISHED`, visibility `PUBLIC`, chưa xóa và snapshot đang live. Slug recap không được trùng wedding publication hoặc recap publication khác.

Lưu draft và thay thế selections trong transaction. Publish hash payload, thu hồi snapshot cũ và tạo snapshot mới trong transaction. Mutation dùng optimistic concurrency; conflict trả `409 RECAP_REVISION_CONFLICT`, retry publish cùng payload hash là idempotent.

Khi publish, `WeddingContent.status` chuyển thành `PUBLISHED` và public lookup dùng `Wedding.slug`; không lưu slug riêng trên content. Script backfill slug chỉ còn phục vụ dữ liệu wedding nếu cần. Unit tests nằm tại `src/modules/recaps/application/recap-service.test.ts`, bao phủ validation, revision, publish snapshot và public lookup.

Preview token chưa cần trong phase này: FE render preview từ draft response; public route không đọc draft trực tiếp.
