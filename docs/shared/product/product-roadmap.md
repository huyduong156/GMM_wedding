# Roadmap sản phẩm

## Phase 0 - Foundation (1-2 tuần)

Chốt persona/MVP/wireframe/design tokens; scaffold FE/BE; auth, PostgreSQL/Prisma, OpenAPI/schema, CI và environments. Tạo multi-stage Dockerfile cho từng source, root Compose và container smoke tests.

**Exit:** login local, health check, migration đầu, CI xanh; toàn bộ stack chạy được bằng Docker Compose và hai production image build thành công.

### Tiến độ hiện tại

- Owner Workspace frontend foundation: app shell, responsive navigation, dashboard mock, route skeleton và frontend Docker image đã triển khai và kiểm tra ở desktop/mobile.
- Các module guests, RSVP, wishes, editor, templates, analytics và settings hiện mới có route/placeholder.

## Phase 1 - Invitation-first wedding/template core (2-3 tuần)

Wedding CRUD tối giản và owner authorization; thông tin cặp đôi/ngày cưới; lễ/tiệc dạng dữ liệu hiển thị; template registry/version; canonical content; editor trực quan sau khi chọn template; autosave/media/preview và publish snapshot. Không triển khai membership UI/API ở phase này; Todo, ngân sách và sổ tiền mừng là core module ở phase riêng nên không chặn publish slice.

**Exit:** một user không chuyên có thể tạo wedding, chọn một trong ít nhất hai template, chỉnh trực tiếp trên preview và publish thiệp online hoàn chỉnh mà không phải hiểu cấu trúc section trước.

## Phase 2 - Guest/invite/RSVP (2-3 tuần)

Guest/group/import/export, invite token, RSVP + dashboard, event/party size, rate limit/chống bot/notification.

**Exit:** E2E import -> invite -> RSVP -> export và cross-tenant tests đạt.

## Phase 3 - Wishes/recap/admin/beta (2 tuần)

Wish moderation, Wedding Recap có public slug/OG metadata, admin tối thiểu, analytics/audit, accessibility/performance, observability, backup/security/load test.

**Exit:** staging production-like, runbook đầy đủ, pilot user thật.

## Phase 3.5 - Wedding companion core

Todo/checklist và reminder cơ bản; ngân sách dự kiến/thực chi; sổ tiền mừng owner-only và export an toàn. Các module dùng progressive disclosure, không phụ thuộc publication editor và không mở rộng thành quản lý nhà cung cấp/ERP.

**Exit:** owner quản lý được việc cần làm, ngân sách và tiền/quà mừng trong đúng wedding; dữ liệu tài chính có authorization/privacy/export tests và không xuất hiện trong public snapshot, analytics hoặc log.

## Phase 4 - Commercial (sau beta)

Plan/entitlement/billing, custom domain, premium template, email/SMS/Zalo, QR/check-in; SSR/pre-render nếu benchmark yêu cầu.

## Backlog

- Cộng tác viên và role wedding nhiều cấp là Post-MVP; owner-only vẫn là luồng mặc định.
- Wedding Recap sau media/wish/template core: editor, preview, immutable snapshot, public slug và social OG; ưu tiên cao hơn các tính năng planner.
- Vendor/contract/staff/operation timeline và accounting nâng cao là Post-MVP; không đồng nhất chúng với Todo, ngân sách và sổ tiền mừng cơ bản.
- Drag-drop nâng cao, version history, seating/meal/check-in, marketplace, referral, multi-language, photo wall/slideshow/livestream integration.

## Definition of Done

- Acceptance criteria và review hoàn tất.
- Lint/typecheck/test/build xanh; test business rule/authorization.
- Migration/API có rollout và rollback.
- Loading/error/empty/responsive/accessibility được kiểm tra.
- Telemetry không chứa PII/secret; docs/ADR được cập nhật.
