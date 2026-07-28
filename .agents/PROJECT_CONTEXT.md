# GMM Wedding - Persistent Project Context

Đây là bối cảnh lâu dài cho agent. Khi quyết định quan trọng đổi, cập nhật tài liệu trong `docs/` và tệp này nếu phiên sau cần biết.

## Product

- SaaS tạo thiệp/web cưới online; user chọn template, nhập nội dung, publish slug, quản lý khách, RSVP và lời chúc.
- Khách không cần login; invite cá nhân dùng opaque token.
- Thị trường đầu tiên: Việt Nam/tiếng Việt, mobile-first.

## Layout và kiến trúc

- `frontend/`: React + Vite + TypeScript.
- `backend/`: Next.js + TypeScript API.
- `docs/`: source of truth; `assets/`: tài nguyên rõ nguồn/bản quyền.
- Modular monolith, hai app deploy độc lập; PostgreSQL + Prisma đề xuất.
- Hai app bắt buộc có Docker image độc lập và portable; root Compose dùng cho local/integration.
- Dockerfile multi-stage, runtime non-root/stateless; backend dùng Next.js standalone, frontend dùng static server image.
- Migration chạy one-off job; secret được inject lúc deploy, không bake vào image.
- Template là reviewed code/version bất biến; canonical content/theme; publish tạo immutable snapshot.
- Snapshot public không chứa PII khách. Auth dùng secure cookie; backend authorize theo wedding/resource.
- Invite token entropy cao/lưu hash; public RSVP/wish có chống spam/rate limit.
- Admin/editor dùng dark-first modern compact UI; source of truth ở `design-system/MASTER.md` và `docs/09-admin-ui-ux.md`.
- Owner workspace và platform admin là hai IA/permission scope riêng; platform admin dùng `/admin/*` và server-side guards.
- Dùng Inter cho operational UI và Phosphor icons; rose accent tiết chế. Font cưới chỉ dùng preview/brand, không dùng bảng/form.

## Working agreements

- Đọc `docs/README.md` và tài liệu liên quan trước thay đổi lớn.
- Khi build admin page, đọc `design-system/MASTER.md` rồi kiểm tra override trong `design-system/pages/`.
- Owner Workspace foundation đã triển khai trong `frontend/`: React 18, Vite 6, app shell, dashboard mock, responsive navigation và module placeholders.
- Frontend yêu cầu Node >=20; Docker pin Node 20 và dùng Nginx unprivileged runtime.
- Navigation dùng internal History API adapter theo `docs/adr/0001-frontend-navigation-history-api.md`; không thêm React Router lại nếu chưa rà security advisory.
- Production `npm audit --omit=dev` hiện sạch. Dev audit còn advisory DoS transitive trong ESLint/minimatch; không dùng `npm audit fix --force` vì đề xuất downgrade sai.
- Dashboard dùng mock data; guests/RSVP/wishes/editor/templates/analytics/settings hiện mới là route placeholder.
- Giữ FE/BE tách riêng nếu chưa có quyết định mới.
- API/data/architecture change cập nhật docs/ADR cùng thay đổi.
- Không commit secret, `.env`, PII, DB dump hoặc asset không rõ quyền.
- Không tự mở rộng MVP sang drag-drop, billing/custom domain/marketplace.
- Khi scaffold source: `.env.example`, strict TypeScript, lint/typecheck/test/build, multi-stage Dockerfile, `.dockerignore`, Compose và CI image smoke test từ đầu.
