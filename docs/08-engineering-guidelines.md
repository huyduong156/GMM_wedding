# Quy ước phát triển

## Code và Git

- TypeScript strict, tránh `any`; validate runtime ở boundary.
- Business rule tách khỏi UI, route handler và ORM.
- Branch/commit nhỏ; PR nêu vấn đề, giải pháp, test, migration/rủi ro/rollback.
- Không commit `.env`, secret, PII, DB dump hoặc asset không rõ bản quyền.
- Migration đã merge không sửa lại; lockfile được commit và CI install frozen.

## Test

- Unit: domain/schema/permission/entitlement.
- Integration: API + DB, transaction, constraint, resource isolation.
- Component: editor/form/accessibility.
- E2E: register-publish, invite-RSVP, wish-moderation, cross-tenant denial.
- Ưu tiên coverage luồng bảo mật/doanh thu/logic khó hơn con số hình thức.

## Frontend/backend

- Mobile-first; mọi trang có loading/error/empty/success; autosave xử lý offline/conflict.
- Semantic HTML, accessible primitives, responsive/lazy images, reduced motion.
- Frontend tổ chức theo Feature-Sliced Design với dependency flow `app → pages → widgets → features → entities → shared`. Chỉ tạo layer/slice khi có trách nhiệm thực; không import ngược lên layer cao hơn.
- Trong mỗi slice, tách `ui`, `model`, `api`, `lib` theo nhu cầu. Mock data của page không đặt trong component UI; primitive dùng chung không chứa business rule.
- Service backend nhận actor/context rõ; list có pagination; tránh N+1.
- Job idempotent, retry/backoff; public API có abuse control, cache và public DTO.

## Environment và ADR

- Có `.env.example`, validate env lúc start, không đưa server secret vào `VITE_*`.
- Môi trường dùng credentials/database/bucket riêng.
- Quyết định dài hạn tạo `docs/adr/NNNN-short-title.md`: Status, Context, Decision, Alternatives, Consequences. Không xóa ADR; quyết định mới supersede quyết định cũ.

## Docker và tính di động

- `frontend/Dockerfile` và `backend/Dockerfile` phải multi-stage, reproducible và có `.dockerignore` tương ứng.
- Pin Node LTS/package manager; cài dependency từ lockfile bằng chế độ frozen.
- Runtime image tối giản, chạy non-root, không chứa source map/secret/dev dependency không cần thiết.
- Container không giữ state; media, database và cache nằm ở service bên ngoài.
- Chỉ cấu hình không nhạy cảm cần lúc browser runtime mới được public; `VITE_*` thường được bake tại build time nên không dùng cho secret.
- Backend expose health/readiness; frontend có health endpoint hoặc static health file.
- Local Compose dùng named volumes cho PostgreSQL/Redis, network nội bộ và health-dependent startup.
- Migration chạy one-off; seed chỉ cho local/test và không tự chạy production.
- CI phải build, scan và smoke-test đúng image sẽ deploy.
