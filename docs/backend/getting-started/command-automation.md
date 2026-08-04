# Command automation: npm scripts và Makefile

## Vấn đề cần giải quyết

Developer không được cài từng package thủ công khi đổi máy hoặc checkout branch. Dependency phải được khai báo trong `backend/package.json` và khóa chính xác trong `backend/package-lock.json`; từ đó một lệnh tái tạo toàn bộ môi trường dependency.

```text
package.json       khai báo dependency và command chuẩn
package-lock.json  khóa dependency tree có thể tái tạo
npm ci             cài đúng lockfile, không tự sửa dependency
Makefile           alias ngắn, tùy chọn
Dockerfile         môi trường build/runtime portable
```

Makefile không thay thế npm và không tự biết package nào cần cài.

## Giao diện lệnh chuẩn

### Portable, luôn được hỗ trợ

Chạy được trên Windows, Linux, CI và Docker khi Node/npm tồn tại:

```powershell
npm --prefix .\backend ci
npm --prefix .\backend run dev
npm --prefix .\backend run check
npm --prefix .\backend run build
```

Đây là interface chính của repository. CI phải gọi npm scripts hoặc command tương đương, không phụ thuộc GNU Make.

### Makefile wrapper, tùy chọn

Khi terminal đã có GNU Make:

```powershell
Set-Location .\backend
make help
make doctor
make install
make dev
make check
```

Makefile nằm tại `backend/Makefile` và chỉ gọi npm/Docker command chuẩn. Nó không chứa business logic hoặc flow riêng mà npm scripts/CI không biết.

## Target semantics

| Target | Hành vi | Có sửa lockfile? | Dùng khi |
|---|---|---:|---|
| `make doctor` | Kiểm tra Node, npm, Docker, Compose | Không | Onboarding/chẩn đoán máy |
| `make install` | Chạy `npm ci` | Không | Clone mới hoặc CI |
| `make sync` | Alias deterministic của install | Không | Đổi branch/máy |
| `make outdated` | Báo dependency có bản mới | Không | Maintenance review |
| `make update` | `npm update` trong semver range rồi báo phần còn cũ | Có thể | PR nâng dependency có chủ đích |
| `make dev` | Development server | Không | Code local |
| `make check` | Lint + typecheck + test | Không | Trước commit/PR |
| `make build` | Production build | Không | Verify release artifact |
| `make docker-build` | Build backend image riêng | Không | Container verification |
| `make docker-up` | Start backend/PostgreSQL qua backend Compose | Không | Local integration |
| `make db-admin-up` | Start PostgreSQL và Adminer local tại port 8081 | Không | Xem/quản lý database local |
| `make db-admin-down` | Stop và remove Adminer container | Không | Kết thúc phiên quản trị database |
| `make db-migrate` | Development migration | Có thể đổi DB/schema artifacts | Local development |
| `make db-migrate-deploy` | Apply reviewed migration | Đổi DB | Release job |
| `make db-seed` | Chạy seed local idempotent | Có | Tạo dữ liệu demo local sau migration |

## `install`, `sync` và `update` khác nhau

- `install/sync` phải deterministic: dùng lockfile hiện có, không tự nâng version.
- `outdated` chỉ báo cáo, phù hợp chạy định kỳ.
- `update` là maintenance change: review changelog/advisory, chạy test/build, kiểm tra diff `package.json`/`package-lock.json` và commit cùng PR.
- Không cấu hình `make update` tự động nâng major version hoặc chạy trong startup/CI thường ngày.
- Không dùng `npm audit fix --force` tự động vì có thể tạo breaking downgrade/upgrade.

## Quy tắc thêm package

Khi feature thật sự cần dependency mới:

```powershell
npm --prefix .\backend install package-name
```

Dev-only:

```powershell
npm --prefix .\backend install --save-dev package-name
```

Sau đó bắt buộc:

1. Review `backend/package.json` và `backend/package-lock.json`.
2. Chạy lint, typecheck, test và build.
3. Commit cả manifest và lockfile.
4. Không commit `node_modules/`.
5. CI/máy khác chạy `npm ci`, không cài lại từng package.

## GNU Make trên Windows

GNU Make không có sẵn trên phần lớn máy Windows. Có thể dùng WSL, Git Bash/MSYS2 hoặc cài GNU Make qua package manager được tổ chức phê duyệt. Không bắt buộc mọi developer cài Make; họ luôn có thể dùng npm scripts tương ứng.

Không dùng một npm package giả lập Make chỉ để chạy Makefile. Nếu team muốn một task runner duy nhất không phụ thuộc hệ điều hành, npm scripts vẫn là lựa chọn mặc định cho repository Node.js này.

## Contract cho `backend/package.json` sau scaffold

Các script tối thiểu cần tồn tại để Makefile không drift:

```json
{
  "scripts": {
    "dev": "next dev",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "npm run lint && npm run typecheck && npm run test",
    "build": "next build",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy"
  }
}
```

Đây là target contract; command cụ thể được cập nhật khi framework/test stack được scaffold và xác nhận.

## Acceptance checklist

- Clone sạch + `npm ci` tạo đủ dependency.
- Xóa `node_modules` rồi `npm ci` vẫn build/test thành công.
- Make target và npm script có cùng semantics.
- CI không phụ thuộc Make.
- `node_modules`, `.env`, build/cache không vào Git.
- Dependency mới luôn thay đổi manifest + lockfile.
- Docker build dùng frozen lockfile và không dựa vào `node_modules` host.
