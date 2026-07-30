# Roadmap

## Phase 0 - Foundation (1-2 tuần)

Chốt persona/MVP/wireframe/design tokens; scaffold FE/BE; auth, PostgreSQL/Prisma, OpenAPI/schema, CI và environments. Tạo multi-stage Dockerfile cho từng source, root Compose và container smoke tests.

**Exit:** login local, health check, migration đầu, CI xanh; toàn bộ stack chạy được bằng Docker Compose và hai production image build thành công.

### Tiến độ hiện tại

- Owner Workspace frontend foundation: app shell, responsive navigation, dashboard mock, route skeleton và frontend Docker image đã triển khai và kiểm tra ở desktop/mobile.
- Các module guests, RSVP, wishes, editor, templates, analytics và settings hiện mới có route/placeholder.

## Phase 1 - Wedding/template core (2-3 tuần)

CRUD/authorization/slug, template registry/version, content schema, editor/autosave/media/preview, publish snapshot.

**Exit:** tạo và publish wedding hoàn chỉnh từ ít nhất hai template.

## Phase 2 - Guest/invite/RSVP (2-3 tuần)

Guest/group/import/export, invite token, RSVP + dashboard, event/party size, rate limit/chống bot/notification.

**Exit:** E2E import -> invite -> RSVP -> export và cross-tenant tests đạt.

## Phase 3 - Wishes/admin/beta (2 tuần)

Wish moderation, admin tối thiểu, analytics/audit, accessibility/performance, observability, backup/security/load test.

**Exit:** staging production-like, runbook đầy đủ, pilot user thật.

## Phase 4 - Commercial (sau beta)

Plan/entitlement/billing, custom domain, premium template, email/SMS/Zalo, QR/check-in; SSR/pre-render nếu benchmark yêu cầu.

## Backlog

- Wedding Todo List sau guest core: checklist mẫu, assignment, deadline và reminder.
- Sổ tiền mừng sau auth/guest core: owner-only CRUD/export, privacy/cross-role tests và retention.
- Wedding Recap sau media/wish/template core: editor, preview, immutable snapshot, public slug và social OG.
- Drag-drop nâng cao, version history, seating/meal/check-in, marketplace, referral, multi-language, photo wall/slideshow/livestream integration.

## Definition of Done

- Acceptance criteria và review hoàn tất.
- Lint/typecheck/test/build xanh; test business rule/authorization.
- Migration/API có rollout và rollback.
- Loading/error/empty/responsive/accessibility được kiểm tra.
- Telemetry không chứa PII/secret; docs/ADR được cập nhật.
