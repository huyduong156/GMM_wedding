# Backend web recap

Recap là publication surface độc lập với thiệp online và wedding web. Draft dùng `WeddingRecap`; public chỉ đọc immutable `PublishedRecapSnapshot`.

## API

- `GET/PUT /api/weddings/{weddingId}/recap`: đọc hoặc lưu draft theo `revision`; nếu owner chưa tạo draft, GET trả `200 { recap: null }`.
- `POST /api/weddings/{weddingId}/recap/publish`: validate và tạo snapshot immutable.
- `POST /api/weddings/{weddingId}/recap/unpublish`: thu hồi publication pointer.
- `GET /api/slugs/recaps/{slug}/availability`: kiểm tra slug recap và wedding đang live.
- `GET /api/public/recaps/{recapSlug}`: đọc snapshot public, hỗ trợ ETag/cache.

Draft gồm `templateVersionId`, metadata, `content`, `themeConfig`, `sectionConfig`, media/wish selections và `revision`. Template phải là `RECAP`, đã `RELEASED`, không deprecated; media phải `READY` cùng wedding; wishes phải `APPROVED` cùng wedding.

Draft, publish, unpublish và availability theo wedding yêu cầu session owner. Public chỉ trả snapshot khi wedding `PUBLISHED`, visibility `PUBLIC`, chưa xóa và snapshot đang live. Slug recap không được trùng wedding publication hoặc recap publication khác.

Lưu draft và thay thế selections trong transaction. Publish hash payload, thu hồi snapshot cũ và tạo snapshot mới trong transaction. Mutation dùng optimistic concurrency; conflict trả `409 RECAP_REVISION_CONFLICT`, retry publish cùng payload hash là idempotent.

Migration `20260823194500_recap_api` bổ sung các JSONB field có default an toàn cho dữ liệu cũ. Unit tests nằm tại `src/modules/recaps/application/recap-service.test.ts`, bao phủ validation, revision, publish snapshot, public lookup và slug collision.

Preview token chưa cần trong phase này: FE render preview từ draft response; public route không đọc draft trực tiếp.
