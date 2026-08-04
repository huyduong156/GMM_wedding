# Trạng thái bộ tài liệu

Last reviewed: 2026-08-04

## Đánh giá

Bộ tài liệu hiện đạt mức **Product/Architecture Foundation**: đủ để thống nhất phạm vi, chia module, thiết kế UI và bắt đầu scaffold source. Cấu trúc phù hợp cách xây SaaS hiện nay: product scope, feature catalog, modular architecture, data/API outline, security, roadmap, engineering rules, design system và admin UX được tách theo concern.

Chưa được xem là **Implementation-ready specification** cho đến khi các artifact dưới đây được tạo và kiểm chứng cùng source code.

## Ma trận trạng thái

| Hạng mục | Hiện tại | Điều kiện hoàn tất |
|---|---|---|
| Product/MVP | Foundation | User stories + acceptance criteria được ưu tiên |
| Feature catalog | Foundation | Mapping feature -> role -> phase -> API |
| Architecture | Proposed | ADR được accept và spike các rủi ro chính |
| Data model | Conceptual | Prisma schema + migration + ERD vật lý |
| API | Endpoint outline | OpenAPI 3.x + example/error/auth contract |
| Security | Baseline | Threat model workshop + security test cases |
| Admin UI/UX | Foundation implemented | Hoàn thiện từng module + visual regression/component coverage |
| Design system | Foundation | Tokens/components trong code + Storybook/visual tests |
| Thiệp online | Section/layout blueprint | Mỗi template mới ghi rõ layout option, mobile fallback và reduced-motion fallback cho từng section |
| Docker/deploy | Frontend image implemented | Backend image, root Compose, CI image scan/smoke test |
| Testing | Strategy | Test plan, fixtures, environments và CI thresholds |
| Operations | Baseline | SLO/alerts/runbooks/restore drill |

## Artifact cần tạo ở bước scaffold

1. `backend/prisma/schema.prisma` và migration đầu tiên.
2. `backend/openapi.yaml` hoặc contract sinh tự động.
3. ADR cho auth, publish snapshot, Docker topology và template versioning.
4. Dockerfile/.dockerignore của hai app và root `compose.yaml`.
5. Design tokens/components thật trong frontend và visual regression baseline.
6. Test plan cho register-publish, invite-RSVP, moderation và cross-tenant denial.
7. CI pipeline lint/typecheck/test/build/image scan/smoke.

Tài liệu phải tiến hóa cùng code; không coi diagram/endpoint outline là bằng chứng hệ thống đã triển khai.
