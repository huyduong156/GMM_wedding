# Deploy backend lên cPanel bằng CI/CD

Backend đã dùng Next.js `output: "standalone"`. Workflow
`.github/workflows/deploy-backend-cpanel.yml` build bundle trên GitHub Actions,
upload bundle lên cPanel qua SSH và tạo `tmp/restart.txt` để Passenger/cPanel
restart Node app. Hosting không cần chạy `npm run build`.

## Cấu hình cPanel một lần

Trong **Setup Node.js App**:

- Node.js: chọn Node 22.
- Application root: dùng đúng thư mục mà secret `CPANEL_DEPLOY_PATH` trỏ tới.
- Startup file: `server.js`.
- Application mode: `Production`.
- Khai báo các biến môi trường production trong cPanel, không commit `.env`.

Workflow cần các GitHub Actions Secrets:

| Secret | Giá trị |
|---|---|
| `CPANEL_SSH_HOST` | hostname SSH của hosting |
| `CPANEL_SSH_PORT` | port SSH, thường `22` |
| `CPANEL_SSH_USER` | user cPanel/SSH |
| `CPANEL_DEPLOY_PATH` | application root, ví dụ `/home/fruitsho/repositories/GMM_wedding/backend` |
| `CPANEL_SSH_PRIVATE_KEY` | private key dùng để SSH, chỉ lưu trong GitHub Secrets |
| `CPANEL_KNOWN_HOSTS` | output của `ssh-keyscan -p <port> <host>` |

Có thể chạy workflow tự động sau khi CI thành công trên branch `production`, hoặc
chạy thủ công từ tab **Actions** bằng `workflow_dispatch`.

## Kiểm tra sau deploy

1. Xem log Node app trong cPanel.
2. Gọi health endpoint `/api/health/live`.
3. Kiểm tra các biến môi trường production và kết nối database.
4. Migration database vẫn chạy riêng bằng quy trình migration đã review; workflow
   deploy không tự động sửa schema.

Không dùng `npm audit fix --force`, không upload `.env`, private key hoặc database
dump vào artifact.
