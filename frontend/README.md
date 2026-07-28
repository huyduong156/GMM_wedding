# GMM Wedding Frontend

React + Vite + TypeScript cho marketing, dashboard, editor và public wedding renderer.

Source chưa được scaffold ở bước tài liệu. Stack/cấu trúc dự kiến: [kiến trúc hệ thống](../docs/03-system-architecture.md).

Admin/editor phải tuân theo [design system](../design-system/MASTER.md) và [đặc tả admin UI/UX](../docs/09-admin-ui-ux.md): dark-first, compact, accessible; owner workspace và platform admin tách permission/navigation.

Khi scaffold phải có multi-stage `Dockerfile` và `.dockerignore`. Production image phục vụ static build bằng Nginx/Caddy, chạy non-root và không chứa secret. Development được hỗ trợ qua root `compose.yaml`, nhưng vẫn có thể chạy trực tiếp bằng package manager.
