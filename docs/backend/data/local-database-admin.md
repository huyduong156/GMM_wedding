# Trang quản trị database local

Backend dùng PostgreSQL nên trang quản trị local là Adminer, không phải phpMyAdmin. Adminer chạy trong Compose profile `tools`, chỉ bind vào `127.0.0.1` và không được triển khai lên production.

## Khởi động

Từ thư mục `backend/`:

```powershell
make db-admin-up
```

Hoặc từ repository root khi máy không có GNU Make:

```powershell
docker compose -f .\backend\compose.yaml --profile tools up -d postgres db-admin
```

Mở `http://localhost:8081` và đăng nhập:

| Trường | Giá trị local mặc định |
|---|---|
| System | `PostgreSQL` |
| Server | `postgres` |
| Username | `gmm_wedding` |
| Password | `gmm_wedding_local` |
| Database | `gmm_wedding` |

Có thể đổi cổng host bằng `DB_ADMIN_PORT` trong `backend/.env`. Credential mặc định chỉ dành cho local development.

## Dừng trang quản trị

```powershell
make db-admin-down
```

Lệnh này chỉ xóa container Adminer; PostgreSQL và volume dữ liệu vẫn được giữ.

## Quy tắc an toàn

- Không publish Adminer ra interface public hoặc đưa service này vào production.
- Không dùng credential local ở staging/production.
- Không commit database dump hoặc dữ liệu khách thật.
- Migration vẫn phải được tạo và review qua Prisma; không dùng GUI để thay đổi schema thủ công.
