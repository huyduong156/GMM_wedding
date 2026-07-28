# GMM Wedding Frontend

React + Vite + TypeScript cho Owner Workspace, editor và public wedding renderer.

## Chạy local

Yêu cầu Node.js 20 trở lên. Docker build hiện pin Node 20.

Yêu cầu Node.js 20 trở lên. Docker build hiện pin Node 20.

```bash
npm install
npm run dev
```

Ứng dụng mặc định tại `http://localhost:5173`.

## Lệnh kiểm tra

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Admin/editor tuân theo [design system](../design-system/MASTER.md) và [đặc tả Admin UI/UX](../docs/09-admin-ui-ux.md). Docker production build static assets và phục vụ bằng Nginx non-root.

Navigation hiện dùng một lớp History API nhỏ trong `src/app/navigation.tsx` thay cho React Router để tránh các advisory chưa có dải phiên bản an toàn phù hợp. Quyết định được ghi tại [ADR 0001](../docs/adr/0001-frontend-navigation-history-api.md).

Navigation hiện dùng một lớp History API nhỏ trong `src/app/navigation.tsx` thay cho React Router để tránh các advisory chưa có dải phiên bản an toàn phù hợp. Quyết định được ghi tại [ADR 0001](../docs/adr/0001-frontend-navigation-history-api.md).
