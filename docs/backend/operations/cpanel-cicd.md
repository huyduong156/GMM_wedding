# Deploy backend lên cPanel bằng CI/CD

Backend đã dùng Next.js `output: "standalone"`. Workflow
`.github/workflows/deploy-backend-cpanel.yml` build bundle trên GitHub Actions,
upload bundle lên cPanel qua SSH và tạo `tmp/restart.txt` để Passenger/cPanel
restart Node app. Hosting không cần chạy `npm run build`.

Deploy được tách thành ba SSH phase để lỗi cPanel có thể chẩn đoán trực tiếp: preflight kiểm tra
xác thực, `tar`, quyền ghi và dung lượng; upload archive; cuối cùng giải nén, kiểm tra `server.js`,
activate và restart Passenger. Archive tạm nằm trong application root thay vì `/tmp` dùng chung
của hosting và được dọn bằng trap sau phase activate.

## Cấu hình cPanel một lần

Trong **Setup Node.js App**:

- Node.js: chọn Node 22.
- Application root: dùng đúng thư mục mà secret `CPANEL_DEPLOY_PATH` trỏ tới.
- Startup file: `server.js`.
- Application mode: `Production`.
- Khai báo các biến môi trường production trong cPanel, không commit `.env`.

Workflow cần các GitHub Actions Secrets:

| Secret                   | Giá trị                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `CPANEL_SSH_HOST`        | hostname SSH của hosting                                                                        |
| `CPANEL_SSH_PORT`        | port SSH, thường `22`                                                                           |
| `CPANEL_SSH_USER`        | user cPanel/SSH                                                                                 |
| `CPANEL_DEPLOY_PATH`     | đúng **App Root Directory** trong cPanel, ví dụ `/home/fruitsho/gmm-wedding-production-backend` |
| `CPANEL_SSH_PRIVATE_KEY` | private key dùng để SSH, chỉ lưu trong GitHub Secrets                                           |
| `CPANEL_KNOWN_HOSTS`     | output của `ssh-keyscan -p <port> <host>`                                                       |

Có thể chạy workflow tự động sau khi CI thành công trên branch `production`, hoặc
chạy thủ công từ tab **Actions** bằng `workflow_dispatch`.

## Kiểm tra sau deploy

1. Xem log Node app trong cPanel.
2. Gọi health endpoint `/api/health/live`.
3. Kiểm tra các biến môi trường production và kết nối database.
4. Migration database vẫn chạy riêng bằng quy trình migration đã review; workflow
   deploy không tự động sửa schema.

Nếu workflow trả SSH exit code `255`, xem phase bị lỗi:

- `Verify cPanel SSH and deploy directory`: kiểm tra SSH Access đã bật, public key đã authorize,
  đúng host/port/user và firewall Vietnix không chặn IP GitHub Actions.
- `Upload backend release archive`: kiểm tra quota/dung lượng application root và giới hạn session.
- `Activate backend release and restart Passenger`: đọc stderr của `tar`, kiểm tra bundle có
  `server.js` và quyền ghi vào application root.

Không dùng `npm audit fix --force`, không upload `.env`, private key hoặc database
dump vào artifact.
