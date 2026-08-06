# GMM Wedding Frontend

React + Vite + TypeScript cho Owner Workspace, editor và public wedding renderer.

## Chạy local

Yêu cầu Node.js 20 trở lên. Docker build hiện pin Node 20.

```bash
npm install
npm run dev
```

Ứng dụng mặc định tại `http://localhost:5173`.

Ở chế độ Vite development, API client mặc định gọi `/api`; Vite proxy chuyển request sang `http://localhost:3000` và dùng origin `http://localhost:8080` đã được backend local cho phép. Nhờ đó cả FE dev `5173` và FE Docker `8080` dùng được cùng backend mà không cần mở rộng CORS trên nhánh frontend. Nếu đặt `VITE_API_BASE_URL`, giá trị đó sẽ ghi đè proxy mặc định.

## Chạy bằng Docker

Từ thư mục gốc của repository:

```bash
docker compose up --build frontend
```

Ứng dụng được phục vụ tại `http://localhost:8080`. Có thể đổi cổng host và API URL lúc build:

```bash
FRONTEND_PORT=8088 VITE_API_BASE_URL=http://localhost:3000/api/v1 docker compose up --build frontend
```

Với PowerShell, đặt `$env:FRONTEND_PORT` và `$env:VITE_API_BASE_URL` trước khi chạy `docker compose`.

## Lệnh kiểm tra

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Admin/editor tuân theo [design system](../design-system/MASTER.md) và [đặc tả Admin UI/UX](../docs/09-admin-ui-ux.md). Docker production build static assets và phục vụ bằng Nginx non-root.

Navigation hiện dùng một History API adapter trong `src/app/providers/navigation/` và `src/shared/lib/navigation/` thay cho React Router. Quyết định được ghi tại [ADR 0001](../docs/adr/0001-frontend-navigation-history-api.md).

## Cấu trúc source

Frontend tuân theo Feature-Sliced Design:

```text
src/
├─ app/       # composition, providers, global styles
├─ pages/     # route-level slices
├─ widgets/   # UI blocks lớn, tự đủ
├─ features/  # business interactions khi được triển khai
├─ entities/  # reusable domain slices khi được triển khai
└─ shared/    # primitives và infrastructure dùng chung
```

Dependency chỉ đi từ layer cao xuống layer thấp. Xem [ADR 0002](../docs/adr/0002-frontend-feature-sliced-design.md).
