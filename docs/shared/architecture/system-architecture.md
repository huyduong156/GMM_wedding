# Kiến trúc và công nghệ

## Sơ đồ tổng thể

```text
Browser
  |-- frontend: React/Vite (marketing, dashboard, editor, public renderer)
  `-- HTTPS JSON API
        `-- backend: Next.js modular monolith
              |-- PostgreSQL + Prisma
              |-- Redis (rate limit/cache/queue khi cần)
              |-- S3-compatible storage
              `-- email + observability providers
```

Hai ứng dụng deploy độc lập và có Docker image riêng. Không dùng microservice sớm vì domain còn đổi và transaction wedding/guest/RSVP gắn chặt; module boundary vẫn phải rõ để có thể tách sau.

## Frontend (`frontend/`)

- React, Vite, TypeScript strict. Navigation hiện qua typed History API adapter theo ADR 0001; đánh giá lại router library khi route complexity tăng.
- TanStack Query cho server state; Zustand chỉ cho editor/UI state phức tạp.
- React Hook Form + Zod; Tailwind CSS + accessible primitives.
- i18next; Vitest + React Testing Library; Playwright E2E.

```text
src/
  app/                         composition, providers, route dispatch
  pages/{auth,admin,...}/      route-level UI theo bề mặt sản phẩm
  widgets/{app-shell,admin-shell}/
  features/ entities/ shared/  logic dùng lại theo Feature-Sliced Design
```

Frontend có ba route namespace và visual shell độc lập: `/login` cho auth, `/studio/*` cho owner workspace và `/gmm_admin/*` cho platform admin. Route constants tập trung trong `shared/config/routes.ts`; không hard-code URL trong page/widget. URL quản trị ít phổ biến chỉ giảm dò tình cờ; backend vẫn phải guard role và resource ở mọi API.

## Backend (`backend/`)

- Next.js App Router/Route Handlers, TypeScript strict.
- PostgreSQL + Prisma migrations; Zod ở API boundary.
- Auth.js hoặc session tương đương qua secure HTTP-only cookie.
- Redis/BullMQ chỉ khi có cache, distributed rate limit hoặc background job thật.
- Presigned upload lên S3-compatible storage; email transactional.
- Structured log/request ID, Sentry/OpenTelemetry; unit/integration/E2E tests.

```text
src/
  app/api/v1/
  modules/{auth,users,weddings,templates,guests,rsvps,wishes,tasks,gift-ledger,recaps,media,notifications}/
  infrastructure/ shared/ jobs/ tests/
```

Route handler chỉ parse/validate, gọi application service và map DTO; business rule không nằm trong route hay Prisma repository.

## Public rendering và publish snapshot

MVP tái sử dụng React template renderer. Khi publish, backend validate rồi tạo `PublishedWeddingSnapshot` bất biến. Public API trả snapshot an toàn theo slug với ETag/cache. Draft không ảnh hưởng trang live.

CSR có thể yếu hơn SSR về SEO/first-load; đo Core Web Vitals trước beta. Nếu không đạt, chuyển public renderer sang Next.js/pre-render mà giữ nguyên domain contract.

## Template engine

- Template là code được review, không cho user upload script/HTML tùy ý.
- `Template` giữ identity/catalog metadata; `TemplateVersion` bất biến chứa renderer, template config hash, section hỗ trợ và các contract version.
- Template config là contract dùng chung cho editor, backend validator, migration và renderer; `templateConfigVersion`, content schema version và renderer API version được quản lý độc lập với SemVer của template.
- Wedding lưu canonical semantic content độc lập presentation. Mỗi thiệp online, website cưới hoặc recap chọn template/lifecycle riêng; template cung cấp section/theme/thứ tự mặc định và editor chỉ tạo section override sau khi user đã chọn template.
- Wedding cũ giữ version cũ cho đến khi migration chủ động.
- Sync template là idempotent, chỉ thêm version mới; cùng key/version nhưng khác hash phải thất bại. Version cũ được deprecate thay vì xóa khi còn tham chiếu.

Chi tiết quyết định và hệ quả deploy xem [ADR 0004](./adr/0004-code-template-contract-and-versioning.md).

## Media

Frontend xin presigned URL -> backend kiểm tra quyền/quota/MIME -> upload trực tiếp -> job xác minh/scan/tối ưu -> chỉ asset `ready` được publish.

## Publication-first và Wedding companion core

- Wedding aggregate ở MVP là hồ sơ gốc tối giản và owner-only trong luồng sản phẩm: thông tin cặp đôi/ngày cưới, các lễ/tiệc dạng dữ liệu và liên kết tới publication/guest/RSVP. Không xây workflow wedding planner quanh từng event.
- Recap là publication aggregate trọng tâm sau thiệp online và website cưới: draft tham chiếu media/wish hợp lệ, publish tạo immutable `PublishedRecapSnapshot`, public API/cache theo recap slug. Template recap dùng registry hiện có với product type riêng.
- Todo, ngân sách và gift ledger là các module trọng tâm độc lập, được triển khai theo phase và mở bằng progressive disclosure để không chặn luồng publish. Dữ liệu ngân sách/ledger là owner-only, không vào public snapshot, analytics, search hoặc log. Collaboration nhiều cấp và planner chuyên nghiệp vẫn là phần mở rộng.

Chi tiết thiết kế task/ledger/recap xem [ADR 0005](./adr/0005-wedding-planning-ledger-and-recap.md); cách giữ luồng publication đơn giản trong khi triển khai các module companion theo phase xem [ADR 0008](./adr/0008-invitation-first-wedding-scope.md).

## Deploy

- local, staging/preview, production tách database/bucket.
- Mỗi source có multi-stage `Dockerfile` riêng, pin Node LTS và chạy bằng non-root user.
- `frontend` build thành static assets và được phục vụ bằng Nginx/Caddy trong container; API base URL được cấu hình rõ theo môi trường.
- `backend` build Next.js ở chế độ `output: "standalone"`, image runtime chỉ chứa standalone output, static files và production dependencies cần thiết.
- Root `compose.yaml` phục vụ local/integration gồm frontend, backend, PostgreSQL và Redis; production không bắt buộc dùng Compose.
- Worker deploy thành process/image riêng khi có queue, tái sử dụng code backend nhưng không chạy chung lifecycle với web server.
- Container stateless; upload không ghi lâu dài vào filesystem container mà dùng S3-compatible storage.
- Config/secret được inject bằng environment/secret manager, không bake vào image và không copy `.env` vào image.
- Có healthcheck/readiness; xử lý `SIGTERM` và shutdown graceful để deploy/scale an toàn.
- Image build được cho Linux `amd64` và `arm64` khi hạ tầng yêu cầu, gắn immutable tag theo Git SHA/version.
- CI: lint -> typecheck -> unit -> integration -> build -> E2E smoke.
- CI build và scan cả hai image; chạy smoke test bằng image đã build trước khi push registry.
- Production dùng migration có rollout/rollback, không dùng `db push`.

### Luồng container đề xuất

```text
Internet / Load Balancer
  |-- frontend container :80
  `-- backend container  :3000
        |-- managed/containerized PostgreSQL
        |-- managed/containerized Redis
        `-- external S3-compatible storage
```

Database migration chạy bằng one-off job/release command từ backend image. Không chạy migration đồng thời trong mọi backend replica khi container khởi động.

## Chưa khóa

Nhà cung cấp deploy/email/storage/payment; Auth.js hay managed auth; CSR hay SSR cho public renderer; workspace/package manager chung hay giữ hai package độc lập.
