# Wedding Recap template authoring checklist

## Preflight

- [ ] Đọc docs manifest: project context, frontend README, architecture, engineering, theme compliance, recap README/catalog/contract, effects, runtime, 2.5D, motion và asset sources.
- [ ] Viết theme thesis, story spine, style lane, token map và section-theme matrix.
- [ ] Chọn section/layout cho default order và section optional; ghi lý do, mobile và reduced-motion fallback.
- [ ] Lập section composition map, seam/allowed-adjacency matrix, motion map và living-state map.
- [ ] Strong-subject theme có decor family bible, tối thiểu 6 artwork/4 vai trò, alpha/border/family/provenance QA.
- [ ] Fixture dùng một cặp đôi hư cấu xuyên recap, media đúng vai trò và có missing/long-content variants.

## Implementation

- [ ] Folder có renderer, config, content, fixture, CSS và test; preview dùng cùng renderer với production.
- [ ] Mỗi section có `data-editor-section`, semantic HTML và một primary composition + supporting layer.
- [ ] Có một signature interaction và ba trải nghiệm khác vai trò cho recap dài.
- [ ] Gallery/video có poster, controls, pause, keyboard/touch path; quote chỉ render approved wishes.
- [ ] Shared auto-scroll/music runtime được dùng đúng config; không tạo controller riêng.
- [ ] Decor pointer-events none, không border/background patch, không che text/face/CTA.

## Postflight/release

- [ ] Chụp/review desktop, 375px và 768px; kiểm tra crop, overflow, contrast, seam và focus.
- [ ] Test default order, ít nhất ba reorder hợp lệ, từng optional section off, missing media và long text.
- [ ] Test living-state 8–12 giây khi dừng đọc; pause ngoài viewport/tab/modal và cleanup khi unmount.
- [ ] Test reduced motion: tắt scrub/parallax/particles nhưng giữ story, layer và seam hoàn chỉnh.
- [ ] Test editor → preview → publish → public snapshot → unpublish; config/content versions khớp.
- [ ] Cập nhật `assets/ASSET_SOURCES.md`, docs manifest và theme notes trước release.
